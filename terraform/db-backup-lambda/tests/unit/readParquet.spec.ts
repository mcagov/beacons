// @ts-ignore
import { ParquetReader } from 'parquetjs-lite';
import { readParquet } from '../../src/readParquet';

describe('GIVEN readParquet', () => {
  it('THEN parse the .parquet file AND return the results in an array', async () => {
    const mockParquetReaderFn = async (parquetFilePath: string) =>
      await ParquetReader.openFile(parquetFilePath);
    const parquetFile = await readParquet(
      'tests/fixtures/userdata1.parquet',
      mockParquetReaderFn
    );

    parquetFile instanceof Error
      ? fail('readParquet threw an error')
      : expect(parquetFile.length).toBeGreaterThan(999);
  });

  it('THEN the file is NOT parquet SHOW error', async () => {
    const mockParquetReaderFn = async (parquetFilePath: string) =>
      await ParquetReader.openFile(parquetFilePath);
    const result = await readParquet(
      'tests/fixtures/userdata1.not_parquet',
      mockParquetReaderFn
    );
    expect(result).toEqual(
      new Error(
        'Error parsing tests/fixtures/userdata1.not_parquet: Error: read failed'
      )
    );
  });
});
