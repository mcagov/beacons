import { z } from 'zod';

export type InMemParquet =
  | z.infer<typeof ValidTestRecord>
  | z.infer<typeof ValidLegacyBeacons>
  | z.infer<typeof ValidBeacon>
  | z.infer<typeof ValidNote>
  | z.infer<typeof ValidBeaconUse>
  | z.infer<typeof ValidPerson>
  | z.infer<typeof ValidAccountHolder>
  | z.infer<typeof ValidLegacyBeaconClaimEvent>
  | z.infer<typeof ValidFlywaySchemaHistory>
  | z.infer<typeof ValidBeaconSearch>;

export const ValidTestRecord = z.object({
  registration_dttm: z.string(),
  id: z.number().optional(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().optional(),
  gender: z.string().optional(),
  ip_address: z.string().optional(),
  cc: z.string().optional(),
  country: z.string().optional(),
  birthdate: z.string().optional(),
  salary: z.number().optional(),
  title: z.string().optional(),
  comments: z.string().optional()
});

export const ValidLegacyBeacons = z.object({
  hex_id: z.string().optional(),
  id: z.string(),
  data: z.any(),
  owner_email: z.string().optional(),
  owner_name: z.string().optional(),
  created_date: z.string(),
  last_modified_date: z.string(),
  beacon_status: z.string(),
  use_activities: z.string().optional()
});

export const ValidBeacon = z.object({
  id: z.string(),
  hex_id: z.string(),
  manufacturer: z.string(),
  model: z.string(),
  manufacturer_serial_number: z.string(),
  battery_expiry_date: z.string().optional(),
  last_serviced_date: z.string().optional(),
  created_date: z.string().optional(),
  beacon_status: z.string().optional(),
  chk_code: z.string().optional(),
  reference_number: z.string().optional(),
  account_holder_id: z.string().optional(),
  last_modified_date: z.string(),
  mti: z.string().optional(),
  svdr: z.boolean(),
  csta: z.string().optional(),
  beacon_type: z.string().optional(),
  protocol: z.string().optional(),
  coding: z.string().optional()
});

export const ValidNote = z.object({
  id: z.string(),
  beacon_id: z.string(),
  text: z.string().optional(),
  type: z.string().optional(),
  created_date: z.string().optional(),
  user_id: z.string().optional(),
  full_name: z.string().optional(),
  email: z.string().optional()
});

export const ValidBeaconUse = z.object({
  id: z.string(),
  beacon_id: z.string(),
  environment: z.string(),
  main_use: z.boolean(),
  beacon_position: z.string().optional(),
  created_date: z.string().optional(),
  activity: z.string(),
  other_activity: z.string().optional(),
  call_sign: z.string().optional(),
  vhf_radio: z.boolean().optional(),
  fixed_vhf_radio: z.boolean().optional(),
  fixed_vhf_radio_value: z.string().optional(),
  portable_vhf_radio: z.boolean().optional(),
  portable_vhf_radio_value: z.string().optional(),
  satellite_telephone: z.boolean().optional(),
  satellite_telephone_value: z.string().optional(),
  mobile_telephone: z.boolean().optional(),
  mobile_telephone_1: z.string().optional(),
  mobile_telephone_2: z.string().optional(),
  purpose: z.string().optional(),
  max_capacity: z.number().optional(),
  vessel_name: z.string().optional(),
  homeport: z.string().optional(),
  area_of_operation: z.string().optional(),
  beacon_location: z.string().optional(),
  imo_number: z.string().optional(),
  ssr_number: z.string().optional(),
  official_number: z.string().optional(),
  rig_platform_location: z.string().optional(),
  aircraft_manufacturer: z.string().optional(),
  principal_airport: z.string().optional(),
  secondary_airport: z.string().optional(),
  registration_mark: z.string().optional(),
  hex_address: z.string().optional(),
  cn_or_msn_number: z.string().optional(),
  dongle: z.boolean().optional(),
  working_remotely_location: z.string().optional(),
  working_remotely_people_count: z.string().optional(),
  windfarm_location: z.string().optional(),
  windfarm_people_count: z.string().optional(),
  other_activity_location: z.string().optional(),
  other_activity_people_count: z.string().optional(),
  more_details: z.string(),
  port_letter_number: z.string().optional(),
  other_communication: z.boolean().optional(),
  other_communication_value: z.string().optional(),
  rss_number: z.string().optional()
});

export const ValidPerson = z.object({
  id: z.string(),
  person_type: z.string(),
  full_name: z.string().optional(),
  email: z.string().optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  address_line_3: z.string().optional(),
  address_line_4: z.string().optional(),
  created_date: z.string().optional(),
  postcode: z.string().optional(),
  county: z.string().optional(),
  telephone_number: z.string().optional(),
  beacon_id: z.string().optional(),
  alternative_telephone_number: z.string().optional(),
  town_or_city: z.string().optional(),
  alternative_telephone_number_2: z.string().optional(),
  telephone_number_2: z.string().optional(),
  last_modified_date: z.string().optional(),
  country: z.string().optional(),
  company_name: z.string().optional(),
  care_of: z.string().optional(),
  fax: z.string().optional(),
  is_main: z.string().optional(),
  create_user_id: z.number().optional(),
  update_user_id: z.number().optional(),
  versioning: z.number().optional(),
  migrated: z.boolean().optional()
});

export const ValidAccountHolder = z.object({
  id: z.string(),
  auth_id: z.string().optional(),
  person_id: z.string()
});

export const ValidLegacyBeaconClaimEvent = z.object({
  id: z.string(),
  claim_event_type: z.any().optional(),
  legacy_beacon_id: z.string(),
  account_holder_id: z.string(),
  when_happened: z.string(),
  reason: z.string().optional()
});

export const ValidBeaconSearch = z.object({
  id: z.string(),
  created_date: z.string().optional(),
  last_modified_date: z.string().optional(),
  beacon_status: z.string().optional(),
  hex_id: z.string().optional(),
  owner_name: z.string().optional(),
  owner_email: z.string().optional(),
  account_holder_id: z.string(),
  use_activities: z.string().optional(),
  beacon_type: z.string().optional(),
  manufacturer_serial_number: z.string().optional(),
  cospas_sarsat_number: z.string().optional()
});

export const ValidFlywaySchemaHistory = z.object({
  installed_rank: z.number(),
  version: z.string().optional(),
  description: z.string(),
  type: z.string(),
  script: z.string(),
  checksum: z.number().optional(),
  installed_by: z.string(),
  installed_on: z.string(),
  execution_time: z.number(),
  success: z.boolean()
});

export interface IParquetReader {
  getCursor(): ParquetCursor;
  close(): Promise<void>;
}

export interface ParquetCursor {
  next(): Promise<ParquetRow | null>;
}

type ParquetRow = {
  [x: string]: string | number;
};

export type ParquetReaderFn = {
  (x: string): Promise<IParquetReader>;
};

export type ReadParquetIntoMemFn = {
  (x: string, y: ParquetReaderFn): Promise<unknown[] | Error>;
};

export type ReadParquetIntoMemFnClosure = {
  (x: string): Promise<unknown[] | Error>;
};
