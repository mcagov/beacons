import type { AWSError } from 'aws-sdk/lib/error';
import type { PromiseResult } from 'aws-sdk/lib/request';
import type { S3 } from 'aws-sdk';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { getHeaders } from './validation';

import type { InMemParquet } from './types';

const writeToCsvFile = async (records: InMemParquet[], path: string) => {
  const csvWriter = createObjectCsvWriter({
    path: path,
    header: [...getHeaders(records[0])] // TODO: marry headers with actual data, pass this in a arg depending on the table being read
  });
  try {
    await csvWriter.writeRecords(records);
  } catch (err) {
    throw new Error(`Error writing to csv: ${err}`);
  }
};

export const writeCsv = async (
  parquetFile: InMemParquet[],
  localWritePath: string,
  moveFileFn: (z: string) => Promise<any>
) => {
  try {
    await writeToCsvFile(parquetFile, localWritePath);
    const fileContent = fs.readFileSync(localWritePath); // reads /tmp/output.csv into Buffer

    const result = await moveFileFn(fileContent.toString('utf-8')); // uploads /tmp/ouput.csv
    if (result instanceof Error) {
      throw result;
    }
  } catch (err) {
    return new Error(`Error writing and moving csv file: ${err}`);
  }
};

const putCsvFn =
  (client: S3, bucket: string, key: string) =>
  async (
    body: string
  ): Promise<PromiseResult<S3.Types.PutObjectOutput, AWSError>> =>
    client
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: body
      })
      .promise();

export const uploadCsvFileToS3 = async (
  client: S3,
  bucket: string,
  key: string,
  parquetFile: InMemParquet[],
  localWritePath: string
) => {
  const uploadCsvFn = putCsvFn(client, bucket, key);
  return writeCsv(parquetFile, localWritePath, uploadCsvFn);
};
