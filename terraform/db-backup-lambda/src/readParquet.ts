// @ts-ignore
import { ParquetReader } from 'parquetjs-lite';
import { S3 } from 'aws-sdk';
import { ValidParquet } from './validation';
import type {
  ParquetReaderFn,
  IParquetReader,
  ReadParquetIntoMemFn,
  ReadParquetIntoMemFnClosure,
  InMemParquet
} from './types';

export const readParquet = async (
  parquetFileName: string,
  readParquetFn: ParquetReaderFn
): Promise<unknown[] | Error> => {
  try {
    const reader = await readParquetFn(parquetFileName);

    // create a new cursor
    const cursor = reader.getCursor();

    const records: unknown[] = [];

    // read all records from the file and print them
    let record = null;
    while ((record = await cursor.next())) {
      records.push(record);
    }
    await reader.close();
    return records;
  } catch (err) {
    return new Error(`Error parsing ${parquetFileName}: ${err}`);
  }
};

export const getParquetFromS3Fn =
  (client: S3, bucket: string) =>
  async (parquetFileName: string): Promise<IParquetReader> =>
    ParquetReader.openS3(client, {
      Bucket: bucket,
      Key: parquetFileName
    });

export const getParquetFileFromS3 =
  (parquetReaderFn: ParquetReaderFn, readParquet: ReadParquetIntoMemFn) =>
  async (parquetFileName: string) =>
    readParquet(parquetFileName, parquetReaderFn); // returns Array<unknown<object>>

export const getMultipleParquetFilesFromS3 = async (
  client: S3,
  bucket: string,
  objectPath: string,
  getParquetFileFn: ReadParquetIntoMemFnClosure
): Promise<InMemParquet[]> => {
  const data = await client
    .listObjectsV2({
      Bucket: bucket,
      Prefix: objectPath + '/'
    })
    .promise();

  // remove the non-parquet files so when can pull just them
  const filteredParquetFiles = (data.Contents as S3.ObjectList).filter(
    (file: S3.Object) => (file.Key as string).includes('.parquet', -9)
  );

  // pull the parquet files
  const parquetFiles = await Promise.allSettled(
    filteredParquetFiles.map(async (file: S3.Object) =>
      getParquetFileFn(file.Key as string)
    )
  );

  // combine all the pulled parquet file contents into one array
  const allValues = parquetFiles
    .filter((c) => c.status === 'fulfilled')
    .map((c) => <PromiseFulfilledResult<unknown>>c)
    .map((c) => c.value)
    .flat(1);

  // log rejected results
  const rejectedValues = parquetFiles.filter((c) => c.status === 'rejected');
  if (rejectedValues) {
    rejectedValues.map((file) =>
      console.error('There was errors pulling some parquet files: ', file)
    );
  }

  // zod provides runtime validation
  return ValidParquet(allValues);
};
