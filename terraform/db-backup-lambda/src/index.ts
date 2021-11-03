import AWS from 'aws-sdk';
import {
  getMultipleParquetFilesFromS3,
  getParquetFromS3Fn,
  getParquetFileFromS3,
  readParquet
} from './readParquet';
import { uploadCsvFileToS3 } from './writeCsv';

import type { S3Event, Handler } from 'aws-lambda';

export const handler: Handler = async (
  event: S3Event
): Promise<void | Error> => {
  const s3 = new AWS.S3({
    region: process.env.REGION as string,
    apiVersion: '2006-03-01'
  }); // we have to use v2 in order to utilise parquet-lite s3 stream
  const objectPath = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  )
    .replace(/_SUCCESS/, '')
    .replace(/\/$/, '');

  const lambdaDir = '/tmp/';
  const date = new Date();
  const outputPath = `${date.toISOString().split('T')[0]}${
    objectPath ? '/' + objectPath : ''
  }`;

  const outputFileName = `output.csv`;
  const SNAPSHOT_BUCKET = process.env.SNAPSHOT_BUCKET as string;
  const DEST_BUCKET = process.env.DEST_BUCKET as string;
  const OUTPUT_KEY = `${DEST_BUCKET}/${outputPath}`;

  // init get parquet from s3 func
  const parquetLiteS3LibFn = getParquetFromS3Fn(s3, SNAPSHOT_BUCKET);
  const getParquet = getParquetFileFromS3(parquetLiteS3LibFn, readParquet);

  try {
    // get the parquet file
    const parquetFile = await getMultipleParquetFilesFromS3(
      s3,
      SNAPSHOT_BUCKET,
      objectPath,
      getParquet
    );

    if (parquetFile.length === 0) {
      throw new Error(
        'Zod column header validation failed against the retrieved parquet files'
      );
    }

    // transform and upload csv file
    await uploadCsvFileToS3(
      s3,
      OUTPUT_KEY,
      outputFileName,
      parquetFile,
      `${lambdaDir}${outputFileName}`
    );
  } catch (err) {
    console.error(err);
  }
};
