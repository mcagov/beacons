import { z } from 'zod';
import {
  ValidTestRecord,
  ValidLegacyBeacons,
  ValidBeacon,
  ValidNote,
  ValidBeaconUse,
  ValidPerson,
  ValidAccountHolder,
  ValidLegacyBeaconClaimEvent,
  ValidFlywaySchemaHistory,
  ValidBeaconSearch
} from './types';

import type { InMemParquet } from './types';

export const getHeaders = (record: unknown) => {
  if (ValidTestRecord.safeParse(record).success) {
    return [
      { id: 'registration_dttm', title: 'registration_dttm' },
      { id: 'id', title: 'id' },
      { id: 'first_name', title: 'first_name' },
      { id: 'last_name', title: 'last_name' },
      { id: 'email', title: 'email' },
      { id: 'gender', title: 'gender' },
      { id: 'ip_address', title: 'ip_address' },
      { id: 'cc', title: 'cc' },
      { id: 'country', title: 'country' },
      { id: 'birthdate', title: 'birthdate' },
      { id: 'salary', title: 'salary' },
      { id: 'title', title: 'title' },
      { id: 'comments', title: 'comments' }
    ];
  }

  if (ValidBeacon.safeParse(record).success) {
    return [
      { id: 'id', title: 'id' },
      { id: 'hex_id', title: 'hex_id' },
      { id: 'manufacturer', title: 'manufacturer' },
      { id: 'manufacturer_serial_number', title: 'manufacturer_serial_number' },
      { id: 'model', title: 'model' },
      { id: 'battery_expiry_date', title: 'battery_expiry_date' },
      { id: 'last_serviced_date', title: 'last_serviced_date' },
      { id: 'created_date', title: 'created_date' },
      { id: 'beacon_status', title: 'beacon_status' },
      { id: 'chk_code', title: 'chk_code' },
      { id: 'reference_number', title: 'reference_number' },
      { id: 'account_holder_id', title: 'account_holder_id' },
      { id: 'last_modified_date', title: 'last_modified_date' },
      { id: 'mti', title: 'mti' },
      { id: 'svdr', title: 'svdr' },
      { id: 'csta', title: 'csta' },
      { id: 'beacon_type', title: 'beacon_type' },
      { id: 'protocol', title: 'protocol' },
      { id: 'coding', title: 'coding' }
    ];
  }

  if (ValidBeaconUse.safeParse(record).success) {
    return [
      { id: 'id', title: 'id' },
      { id: 'beacon_id', title: 'beacon_id' },
      { id: 'environment', title: 'environment' },
      { id: 'main_use', title: 'main_use' },
      { id: 'beacon_position', title: 'beacon_position' },
      { id: 'created_date', title: 'created_date' },
      { id: 'activity', title: 'activity' },
      { id: 'other_activity', title: 'other_activity' },
      { id: 'call_sign', title: 'call_sign' },
      { id: 'vhf_radio', title: 'chf_radio' },
      { id: 'fixed_vhf_radio', title: 'fixed_vhf_radio' },
      { id: 'fixed_vhf_radio_value', title: 'fixed_vhf_radio_value' },
      { id: 'portable_vhf_radio', title: 'portable_vhf_radio' },
      { id: 'portable_vhf_radio_value', title: 'portable_vhf_radio_value' },
      { id: 'satellite_telephone', title: 'satellite_telephone' },
      { id: 'satellite_telephone_value', title: 'satellite_telephone_value' },
      { id: 'mobile_telephone', title: 'mobile_telephone' },
      { id: 'mobile_telephone_1', title: 'mobile_telephone_1' },
      { id: 'mobile_telephone_2', title: 'mobile_telephone_2' },
      { id: 'purpose', title: 'purpose' },
      { id: 'max_capacity', title: 'max_capacity' },
      { id: 'vessel_name', title: 'vessel_name' },
      { id: 'homeport', title: 'homeport' },
      { id: 'area_of_operation', title: 'area_of_operation' },
      { id: 'beacon_location', title: 'beacon_location' },
      { id: 'imo_number', title: 'imo_number' },
      { id: 'ssr_number', title: 'ssr_number' },
      { id: 'official_number', title: 'official_number' },
      { id: 'rig_platform_location', title: 'rig_platform_location' },
      { id: 'aircraft_manufacturer', title: 'aircraft_manufacturer' },
      { id: 'principal_airport', title: 'principal_airport' },
      { id: 'secondary_airport', title: 'secondary_airport' },
      { id: 'registration_mark', title: 'registration_mark' },
      { id: 'hex_address', title: 'hex_address' },
      { id: 'cn_or_msn_number', title: 'cn_or_msn_number' },
      { id: 'dongle', title: 'dongle' },
      { id: 'working_remotely_location', title: 'working_remotely_location' },
      {
        id: 'working_remotely_people_count',
        title: 'working_remotely_people_count'
      },
      { id: 'windfarm_location', title: 'windfarm_location' },
      { id: 'windfarm_people_count', title: 'windfarm_people_count' },
      { id: 'other_activity_location', title: 'other_activity_location' },
      {
        id: 'other_activity_people_count',
        title: 'other_activity_people_count'
      },
      { id: 'more_details', title: 'more_details' },
      { id: 'port_letter_number', title: 'port_letter_number' },
      { id: 'other_communication', title: 'other_communication' },
      { id: 'other_communication_value', title: 'other_communication_value' },
      { id: 'rsa_number', title: 'rsa_number' }
    ];
  }

  if (ValidPerson.safeParse(record).success) {
    return [
      { id: 'id', title: 'id' },
      { id: 'person_type', title: 'person_type' },
      { id: 'full_name', title: 'full_name' },
      { id: 'email', title: 'email' },
      { id: 'address_line_1', title: 'address_line_1' },
      { id: 'address_line_2', title: 'address_line_2' },
      { id: 'address_line_3', title: 'address_line_3' },
      { id: 'address_line_4', title: 'address_line_4' },
      { id: 'created_date', title: 'created_date' },
      { id: 'postcode', title: 'postcode' },
      { id: 'county', title: 'county' },
      { id: 'telephone_number', title: 'telephone_number' },
      { id: 'beacon_id', title: 'beacon_id' },
      {
        id: 'alternative_telephone_number',
        title: 'alternative_telephone_number'
      },
      {
        id: 'alternative_telephone_number_2',
        title: 'alternative_telephone_number_2'
      },
      { id: 'town_or_city', title: 'town_or_city' },
      { id: 'telephone_number_2', title: 'telephone_number_2' },
      { id: 'last_modified_date', title: 'last_modified_date' },
      { id: 'country', title: 'country' },
      { id: 'company_name', title: 'company_name' },
      { id: 'care_of', title: 'care_of' },
      { id: 'fax', title: 'fax' },
      { id: 'is_main', title: 'is_main' },
      { id: 'create_user_id', title: 'create_user_id' },
      { id: 'update_user_id', title: 'update_user_id' },
      { id: 'versioning', title: 'versioning' },
      { id: 'migrated', title: 'migrated' }
    ];
  }

  if (ValidAccountHolder.safeParse(record).success) {
    return [
      { id: 'id', title: 'id' },
      { id: 'auth_id', title: 'auth_id' },
      { id: 'person_id', title: 'person_id' }
    ];
  }

  if (ValidBeaconSearch.safeParse(record).success) {
    return [
      { id: 'id', title: 'id' },
      { id: 'created_date', title: 'created_date' },
      { id: 'last_modified_date', title: 'last_modified_date' },
      { id: 'beacon_status', title: 'beacon_status' },
      { id: 'hex_id', title: 'hex_id' },
      { id: 'owner_name', title: 'owner_name' },
      { id: 'account_holder_id', title: 'account_holder_id' },
      { id: 'use_activities', title: 'use_activities' },
      { id: 'beacon_type', title: 'beacon_type' },
      { id: 'manufacturer_serial_number', title: 'manufacturer_serial_number' },
      { id: 'cospas_sarsat_number', title: 'cospas_sarsat_number' }
    ];
  }

  if (ValidFlywaySchemaHistory.safeParse(record).success) {
    return [
      { id: 'installed_rank', title: 'installed_rank' },
      { id: 'version', title: 'version' },
      { id: 'description', title: 'description' },
      { id: 'type', title: 'type' },
      { id: 'script', title: 'script' },
      { id: 'checksum', title: 'checksum' },
      { id: 'installed_by', title: 'installed_by' },
      { id: 'installed_on', title: 'installed_on' },
      { id: 'execution_time', title: 'execution_time' },
      { id: 'success', title: 'success' }
    ];
  }

  if (ValidLegacyBeaconClaimEvent.safeParse(record).success) {
    return [
      { id: 'id', title: 'id' },
      { id: 'claim_event_type', title: 'claim_event_type' },
      { id: 'legacy_beacon_id', title: 'legacy_beacon_id' },
      { id: 'account_holder_id', title: 'account_holder_id' },
      { id: 'when_happened', title: 'when_happened' },
      { id: 'reason', title: 'reason' }
    ];
  }

  if (ValidNote.safeParse(record).success) {
    return [
      { id: 'id', title: 'id' },
      { id: 'beacon_id', title: 'beacon_id' },
      { id: 'text', title: 'text' },
      { id: 'type', title: 'type' },
      { id: 'created_date', title: 'created_date' },
      { id: 'user_id', title: 'user_id' },
      { id: 'full_name', title: 'full_name' },
      { id: 'email', title: 'email' }
    ];
  }
  return [
    // default return ValidLegacyBeacons
    { id: 'id', title: 'id' },
    { id: 'hex_id', title: 'hex_id' },
    { id: 'data', title: 'data' },
    { id: 'owner_email', title: 'owner_email' },
    { id: 'owner_name', title: 'owner_name' },
    { id: 'created_date', title: 'created_date' },
    { id: 'last_modified_date', title: 'last_modified_date' },
    { id: 'beacon_status', title: 'beacon_status' },
    { id: 'use_activities', title: 'use_activities' }
  ];
};

export const ValidParquet = (input: unknown[]): InMemParquet[] => {
  if (ValidTestRecord.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidTestRecord>[];
  }
  if (ValidLegacyBeacons.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidLegacyBeacons>[];
  }

  if (ValidBeacon.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidBeacon>[];
  }

  if (ValidNote.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidNote>[];
  }

  if (ValidBeaconUse.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidBeaconUse>[];
  }

  if (ValidPerson.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidPerson>[];
  }

  if (ValidAccountHolder.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidAccountHolder>[];
  }

  if (ValidLegacyBeaconClaimEvent.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidLegacyBeaconClaimEvent>[];
  }

  if (ValidFlywaySchemaHistory.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidFlywaySchemaHistory>[];
  }

  if (ValidBeaconSearch.safeParse(input[0]).success) {
    return input as z.infer<typeof ValidBeaconSearch>[];
  }

  return [];
};
