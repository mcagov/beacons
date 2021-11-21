import { writeCsv } from '../../src/writeCsv';
import { InMemParquet } from '../../src/types';
import fs from 'fs';

const mockRecord = [
  {
    id: '123',
    hex_id: '456',
    manufacturer: 'massey ferguson',
    model: 'cool boat',
    manufacturer_serial_number: '00001',
    battery_expiry_date: '01/01/1970',
    last_serviced_date: '01/01/1970',
    created_date: '01/01/1970',
    beacon_status: 'WORKING',
    chk_code: 'ok',
    reference_number: '8888',
    account_holder_id: '789',
    last_modified_date: '01/01/1970',
    mti: 'mti',
    svdr: true,
    csta: 'csta',
    beacon_type: 'flare',
    protocol: 'beacon',
    coding: 'true'
  }
] as InMemParquet[];

const filePath = 'tests/unit/writeCsv-test-01.csv';

describe('GIVEN writeCsv', () => {
  afterEach(() => {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.log('Cannot delete file: ', err);
    }
  });

  it('THEN write a csv file locally AND move it', async () => {
    const expectedResult = `id,hex_id,manufacturer,manufacturer_serial_number,model,battery_expiry_date,last_serviced_date,created_date,beacon_status,chk_code,reference_number,account_holder_id,last_modified_date,mti,svdr,csta,beacon_type,protocol,coding
123,456,massey ferguson,00001,cool boat,01/01/1970,01/01/1970,01/01/1970,WORKING,ok,8888,789,01/01/1970,mti,true,csta,flare,beacon,true\n`;

    const mockMoveFileFn = jest.fn(() => Promise.resolve(true));
    await writeCsv(mockRecord, filePath, mockMoveFileFn);

    // assert on mock move fn
    expect(mockMoveFileFn).toHaveBeenCalledWith(expectedResult);
    expect(mockMoveFileFn).toHaveBeenCalledTimes(1);

    // parse the file content
    const fileContent = fs.readFileSync(filePath);
    expect(fileContent.toString('utf-8')).toBe(expectedResult);
  });

  it('WHEN the function is passed an incorrect path THEN throw and catch the error correctly', async () => {
    const mockMoveFileFn = jest.fn(() => Promise.resolve(true));

    expect.assertions(1);
    try {
      const output = await writeCsv(
        mockRecord,
        '/incorrect/file/path',
        mockMoveFileFn
      );
      if (output instanceof Error) {
        throw output;
      }
    } catch (e) {
      expect(e).toEqual(
        new Error(
          `Error writing and moving csv file: Error: Error writing to csv: Error: ENOENT: no such file or directory, open '/incorrect/file/path'`
        )
      );
    }
  });

  it('WHEN the function throws an error THEN throw and catch the error correctly', async () => {
    expect.assertions(1);
    try {
      const mockMoveFileFn = jest.fn(() =>
        Promise.reject(new Error('Move function threw error'))
      );
      const actual = await writeCsv(mockRecord, filePath, mockMoveFileFn);
      if (actual instanceof Error) {
        throw actual;
      }
    } catch (e) {
      expect(e).toEqual(
        new Error(
          `Error writing and moving csv file: Error: Move function threw error`
        )
      );
    }
  });
});
