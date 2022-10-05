#!/usr/bin/env ruby

=begin
 brew install ruby
 brew install postgresql
 export PATH="/usr/local/opt/ruby/bin:$PATH"

 gem install pg
 gem install faker

 #To clear out existing 'new' beacons:

  update account_holder set person_id = null;
  update person set beacon_id = null;

  delete from note;
  delete from emergency_contact;
  delete from beacon_use;
  delete from beacon_owner;
  delete from beacon;
  delete from account_holder;
  delete from person;


 ruby beacons_bulk_register.rb
=end

require 'pg'
require 'faker'
require 'securerandom'
require 'json'

owner_name = ARGV[0] || Faker::Name.name
owner_email = ARGV[1] || Faker::Internet.email

db_host = 'localhost'
db_password= 'password'

conn = PG.connect( dbname: 'beacons', :host => db_host, :port => 5432,
    :user => 'beacons_service', :password => db_password )

conn.prepare("accountholder", 'INSERT INTO account_holder (id, auth_id,
person_id, full_name, email, address_line_1, address_line_2,
address_line_3, address_line_4, town_or_city, postcode, county, country,
telephone_number, alternative_telephone_number, created_date,
last_modified_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
$12, $13, $14, $15, $16, $17)')

conn.prepare("beacon", 'INSERT INTO beacon (id, created_date,
account_holder_id, hex_id, beacon_status, manufacturer, model,
manufacturer_serial_number, last_modified_date, beacon_type,
chk_code, battery_expiry_date, last_serviced_date,
reference_number, mti, svdr, csta, protocol, coding) VALUES ($1, $2,
$3, $4, $5, $6, $7,
$8, $9, $10,
$11, $12, $13,
$14, $15, $16, $17, $18, $19)')

conn.prepare("beacon_owner", 'INSERT INTO beacon_owner (id, beacon_id,
full_name, email, address_line_1, address_line_2, address_line_3,
address_line_4, town_or_city, postcode, county, country, telephone_number,
alternative_telephone_number, created_date, last_modified_date) VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)')

conn.prepare("beaconuse", 'INSERT INTO beacon_use (id, beacon_id,
main_use, created_date, vessel_name, homeport, area_of_operation,
beacon_location, activity, call_sign, mobile_telephone,
mobile_telephone_1, purpose, environment, more_details, max_capacity,
portable_vhf_radio, portable_vhf_radio_value, registration_mark,
fixed_vhf_radio, fixed_vhf_radio_value, hex_address, principal_airport,
secondary_airport, aircraft_manufacturer, working_remotely_location,
working_remotely_people_count, windfarm_location, windfarm_people_count,
other_activity_location, other_activity_people_count)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
$16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)')

conn.prepare("emergency_contact", 'INSERT INTO emergency_contact (id,
beacon_id, full_name, telephone_number, alternative_telephone_number,
created_date, last_modified_date) VALUES ($1, $2, $3, $4, $5, $6, $7)')

conn.prepare("note", 'INSERT INTO note (id, beacon_id, text, type,
created_date, user_id, full_name, email) VALUES ($1, $2, $3, $4, $5, $6,
$7, $8)')

50.times do |count|

#Setup beacon with dummy data

  Faker::Config.locale = 'en-GB'

  person_uuid = SecureRandom.uuid
  account_holder_uuid = SecureRandom.uuid
  beacon_owner_uuid = SecureRandom.uuid

  beacon_uuid = SecureRandom.uuid
  hex_id = Faker::Base.regexify("1D[A-F1-9]{13}")

  email = Faker::Internet.email
  fullname = Faker::Name.name

  created_date = Faker::Time.between_dates(from: '2012-01-01', to: '2022-07-24').iso8601
  last_modified_date = Faker::Time.between_dates(from: '2012-01-01', to: '2022-07-24').iso8601
  beacon_status = "NEW"
  person_type_emergency = "EMERGENCY_CONTACT"
  person_type_owner = "OWNER"
  manufacturer = Faker::Vehicle.make
  model = Faker::Vehicle.model(make_of_model: manufacturer)
  manufacturer_serial_number = Faker::Base.bothify("#?#?#?#?#?#???##")
  auth_id = SecureRandom.uuid

  telephone_number = Faker::PhoneNumber.phone_number
  is_main = "YES"
  county = Faker::Address.county
  country = "UK"
  town = Faker::Address.city
  address1 = Faker::Address.street_name
  address2 = Faker::Address.street_address
  postcode = Faker::Address.postcode
  migrated_status = "F"

  beacon_type = "EPIRB"

  create_user_id = 1
  update_user_id = 1

  chk_code = "CB#{Faker::Number.number(digits: 2)}F"
  battery_expiry_date = Faker::Time.between_dates(from: '2012-01-01', to: '2024-07-24').iso8601
  last_serviced_date = Faker::Time.between_dates(from: '2012-01-01', to: '2022-07-24').iso8601
  reference_number = "ABC#{Faker::Number.number(digits: 3)}"
  mti = Faker::Number.number(digits: 5).to_s
  svdr = false
  csta = Faker::Number.number(digits: 3).to_s
  protocol = "EPIRB Standard Location, GPS, MMS"
  coding = "SN #{Faker::Number.number(digits: 5).to_s}"

  #Insert Beacon & User info:

  # Insert account holder
  conn.exec_prepared('accountholder', [ account_holder_uuid, auth_id, nil,
    fullname, email, address1, address2, nil, nil, town, postcode, county,
    country, telephone_number, telephone_number, created_date, created_date])

    # Insert Beacon
  conn.exec_prepared('beacon', [ beacon_uuid, created_date,
    account_holder_uuid, hex_id, beacon_status, manufacturer, model,
    manufacturer_serial_number, last_modified_date, beacon_type, chk_code,
    battery_expiry_date, last_serviced_date, reference_number, mti,
    svdr, csta, protocol, coding])

    # Insert beacon owner
  conn.exec_prepared('beacon_owner', [ beacon_owner_uuid, beacon_uuid,
    fullname, email, address1, address2, nil, nil, town, postcode, county,
    country, telephone_number, telephone_number, created_date, created_date])

Faker::Number.between(from: 5, to: 6).times do

  emergency_contact_uuid = SecureRandom.uuid
  emergency_contact_name = Faker::Name.name
  emergency_contact_telephone_1 = Faker::PhoneNumber.phone_number
  emergency_contact_telephone_2 = Faker::PhoneNumber.phone_number

  # Insert Emerg contact
  conn.exec_prepared('emergency_contact', [ emergency_contact_uuid,
  beacon_uuid, emergency_contact_name, emergency_contact_telephone_1,
  emergency_contact_telephone_2, created_date, created_date])
end

Faker::Number.between(from: 3, to: 5).times do
        # setup dummy beacon use(s) (do 1-3 times)
        environment = ["AVIATION", "MARITIME", "LAND"].sample

        if environment == "AVIATION"
          activity = ["JET_AIRCRAFT","LIGHT_AIRCRAFT","GLIDER","HOT_AIR_BALLOON","ROTOR_CRAFT","PASSENGER_PLANE","CARGO_AIRPLANE"].sample
          beacon_location = ["Cabin", "Under Seat", "Hold"].sample
          registration_mark = Faker::Base.regexify("[A-Z]{3} [0-9]{3}")
          hex_address = Faker::Base.regexify("[A-Z0-9]{6}")
          purpose = ["PLEASURE", "COMMERCIAL"].sample

          principal_airport = Faker::Address.city
          secondary_airport = Faker::Address.city
          aircraft_manufacturer = Faker::Vehicle.manufacture
        end


        if environment == "MARITIME"
          activity = ["SAILING","MOTOR","ROWING","SMALL_UNPOWERED","FISHING_VESSEL","MERCHANT_VESSEL","FLOATING_PLATFORM","OFFSHORE_WINDFARM","OFFSHORE_RIG_PLATFORM"].sample
          beacon_location = ["Cabin", "Hull", "On Life Jacket"].sample
          purpose = ["PLEASURE", "COMMERCIAL"].sample

          homeport = Faker::Address.city
        end


        if environment == "LAND"
          activity = ["DRIVING","CYCLING","CLIMBING_MOUNTAINEERING","SKIING","WALKING_HIKING","WORKING_REMOTELY","WINDFARM","OTHER"].sample
          beacon_location = ["In Backpack", "On Person", "In Vehicle"].sample

          if activity == "WORKING_REMOTELY"
            working_remotely_location = Faker::Address.city
            working_remotely_people_count = Faker::Number.between(from: 1, to: 10)
          end

          if activity == "WINDFARM"
            windfarm_location = Faker::Address.city
            windfarm_people_count = Faker::Number.between(from: 1, to: 10)
          end

          if activity == "OTHER"
            other_activity_location = Faker::Address.city
            other_activity_people_count = Faker::Number.between(from: 1, to: 10)
          end

        end

        puts environment

        beacon_use_uuid = SecureRandom.uuid
        mobile_telephone = true
        main_use = true
        vessel_name = Faker::Name.name
        area_of_operation = Faker::Address.state
        call_sign = Faker::Artist.name
        mobile_telephone_1 = Faker::PhoneNumber.phone_number
        more_details = Faker::Movies::StarWars.quote
        max_capacity = Faker::Number.between(from: 1, to: 10)

        portable_vhf_radio = true
        portable_vhf_radio_value = Faker::Base.numerify("### ####")

        fixed_vhf_radio = true
        fixed_vhf_radio_value = Faker::Base.numerify("#########")

        # Insert use
        conn.exec_prepared('beaconuse', [ beacon_use_uuid, beacon_uuid,
      main_use, created_date, vessel_name, homeport, area_of_operation,
      beacon_location, activity, call_sign, mobile_telephone,
      mobile_telephone_1, purpose, environment, more_details, max_capacity,
      portable_vhf_radio, portable_vhf_radio_value, registration_mark,
      fixed_vhf_radio, fixed_vhf_radio_value, hex_address, principal_airport,
      secondary_airport,aircraft_manufacturer,working_remotely_location,
      working_remotely_people_count,windfarm_location,windfarm_people_count,
      other_activity_location,other_activity_people_count])
end

Faker::Number.between(from: 2, to: 4).times do
  # setup dummy note(s) for beacon (do 0-4 times)
  note_uuid = SecureRandom.uuid
  note_text = Faker::Movies::StarWars.quote
  note_type = ["INCIDENT", "GENERAL"].sample
  staff_user_uuid = SecureRandom.uuid
  staff_full_name = Faker::Name.name
  staff_email = Faker::Internet.email

  # Insert note
  conn.exec_prepared('note', [ note_uuid, beacon_uuid, note_text,
  note_type, created_date, staff_user_uuid, staff_full_name, staff_email ])
end

  puts count+1
  puts hex_id

end
