#!/usr/bin/env ruby

=begin
 brew install ruby
 brew install postgresql
 xcrun gem install pg
 xcrun gem install faker
 ruby beacons_bulk_load_legacy.rb <your name> <your email>

 or

 ruby beacons_bulk_load_legacy.rb
 SELECT Count(b)
 FROM   beacon_search b
 WHERE  ( Lower(b.hex_id) LIKE '%'
          OR Lower(b.beacon_status) LIKE '%'
          OR Lower(b.owner_name) LIKE '%'
          OR Lower(b.use_activities) LIKE '%' )
       AND ( Lower(b.beacon_status) LIKE '%' )
       AND ( Lower(b.use_activities) LIKE '%' );


	To clear data:

	delete from legacy_beacon_claim_event;
	delete from legacy_beacon;
=end

require 'pg'
require 'faker'
require 'securerandom'
require 'json'

$default_value = ""

def populateBeacons
	owner_name = ARGV[0] || Faker::Name.name
	owner_email = ARGV[1] || Faker::Internet.email

  db_host = 'localhost'
	db_password= 'password'

	conn = PG.connect( dbname: 'beacons', :host => db_host, :port => 5432,
		 :user => 'beacons_service', :password => db_password )

	conn.prepare("statement", 'INSERT INTO legacy_beacon (id, hex_id, owner_email, owner_name, created_date, beacon_status, data, last_modified_date, use_activities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)')

	useLookup = {}
	useLookup["MARITIME"] = ["SAILING","MOTOR","ROWING","SMALL_UNPOWERED","FISHING_VESSEL","MERCHANT_VESSEL","FLOATING_PLATFORM","OFFSHORE_WINDFARM","OFFSHORE_RIG_PLATFORM"]
	useLookup["AIRCRAFT"] = ["JET_AIRCRAFT","LIGHT_AIRCRAFT","GLIDER","HOT_AIR_BALLOON","ROTOR_CRAFT","PASSENGER_PLANE","CARGO_AIRPLANE"]
	useLookup["LAND"] = ["DRIVING","CYCLING","CLIMBING_MOUNTAINEERING","SKIING","WALKING_HIKING","WORKING_REMOTELY","WINDFARM","OTHER"]
	useLookup["RIG/PLATFORM"] = ["RIG_USE"]
	useLookup["MOD"] = ["MOD_USE"]

	20.times do |count|

		Faker::Config.locale = 'en-GB'

		# generate random data
		uuid = SecureRandom.uuid
		created_date = Faker::Date.between(from: '2010-09-01', to: '2020-09-01')
		last_modified_date = Faker::Date.between(from: '2020-09-01', to: '2021-09-01')
		beacon_status = "MIGRATED"

		person_uuid = SecureRandom.uuid
		account_holder_uuid = SecureRandom.uuid
		beacon_uuid = SecureRandom.uuid
		hex_id = Faker::Base.regexify("1D[A-F1-9]{13}")
		person_type_emergency = "EMERGENCY_CONTACT"
		person_type_owner = "OWNER"
		auth_id = SecureRandom.uuid

		uses = []

		use_activities = ["Maritime", "Sailing", "Climbing"].sample

		Faker::Number.between(from: 1, to: 3).times do |useIndex|
			environment = ["MARITIME","AIRCRAFT","RIG/PLATFORM","LAND","MOD"].sample
			use_activities = "#{environment} (#{useLookup[environment].sample})"
			main_use = true

			uses.insert(useIndex,buildBeaconUse(environment, use_activities, main_use,created_date,last_modified_date))
		end

		primaryOwner = buildOwner("Y",owner_name,created_date,last_modified_date)
		secondaryOwners = []

		Faker::Number.between(from: 1, to: 3).times do |secondaryOwnerIndex|
			owner_name = Faker::Name.name
			main_use = "N"
			secondaryOwners.insert(secondaryOwnerIndex,buildOwner(main_use,owner_name,created_date,last_modified_date))
		end

		data = {
			"uses": uses,
			"owner": primaryOwner,
			"beacon": buildBeacon(hex_id,created_date,last_modified_date),
			"secondaryOwners": secondaryOwners,
			"emergencyContact": {
				"details": " #{owner_name}, TEL: #{Faker::PhoneNumber.phone_number}\n\nMATCOM F TEL: #{Faker::PhoneNumber.phone_number}   FAX: #{Faker::PhoneNumber.phone_number}\n\nVessel Email: #{owner_email}"
			}
		}.to_json

		#puts data

		#debug_output = "INSERT INTO legacy_beacon (id, hex_id, owner_email, owner_name, created_date, beacon_status, data, last_modified_date, use_activities) VALUES (#{uuid}, #{hex_id}, #{owner_email}, #{owner_name}, #{created_date}, #{beacon_status}, #{data}, #{last_modified_date}, #{use_activities});"

		puts hex_id

		# run SQL
		conn.exec_prepared('statement', [ uuid, hex_id, owner_email, owner_name, created_date, beacon_status, data, last_modified_date, use_activities])
	end
end

def buildBeaconUse(environment, activity, main_use,created_date,last_modified_date)

	call_sign = Faker::Artist.name
	vessel_name = Faker::Artist.name
	more_details = Faker::Movies::StarWars.quote
	purpose = ["PLEASURE", "COMMERCIAL"].sample
	position = "#{Faker::Address.latitude} #{Faker::Address.longitude}"

	# Maritime only fields
	if environment == "MARITIME"
		homePort = Faker::Address.city
		vessel_type = purpose
		beacon_location = ["Cabin", "Hull", "On Life Jacket", "Backpack"].sample
	end

	#Aircraft only fields
	if environment == "AIRCRAFT"
		aircraft_type = purpose
		aircraft_description = "#{Faker::Color.color_name} #{aircraft_type}"
		aircraft_registration_mark = Faker::Vehicle.vin
		principal_airport = Faker::Address.city
		beacon_location = ["Cabin", "Under Seat", "Hold"].sample
	end

	#Rig/Platform only fields
	if environment == "RIG/PLATFORM"
		rigName = Faker::Movies::StarWars.vehicle
		beacon_location = ["On Platform", "ON Rig"].sample
	end

	#Land only fields
	if environment == "LAND"
		landUse = activity
		beacon_location = ["In Backpack", "On Person", "In Vehicle"].sample
	end

	#MOD only fields
	if environment == "MOD"
		beacon_location = ["Classified Location","Redacted"].sample
		mod_type = Faker::Vehicle.model
		mod_status = ["ACTIVE","INACTIVE"].sample
		mod_variant = Faker::Vehicle.manufacture
	end

	return {
		"note": Faker::Movies::StarWars.quote,
		"notes": $default_value,
		"isMain": main_use,
		"landUse": landUse,
		"rigName": rigName,
		"useType": activity,
		"callSign": call_sign,
		"homePort": homePort,
		"position": $default_value,
		"tripInfo": $default_value,
		"areaOfUse": $default_value,
		"beaconNsn": $default_value,
		"imoNumber": $default_value,
		"fkBeaconId": 6062,
		"maxPersons": Faker::Number.between(from: 1, to: 10),
		"mmsiNumber": Faker::Base.numerify("#########"),
		"versioning": 0,
		"vesselName": vessel_name,
		"vesselType": vessel_type,
		"createdDate": created_date,
		"aircraftType": aircraft_type,
		"createUserId": 2889,
		"hullIdNumber": $default_value,
		"rssSsrNumber": $default_value,
		"updateUserId": 2889,
		"cg66RefNumber": $default_value,
		"pennantNumber": $default_value,
		"beaconPosition": beacon_location,
		"communications": "VHF/DSC",
		"officialNumber": $default_value,
		"pkBeaconUsesId": 6057,
		"aodSerialNumber": $default_value,
		"bit24AddressHex": $default_value,
		"beaconPartNumber": $default_value,
		"fishingVesselPln": $default_value,
		"lastModifiedDate": last_modified_date,
		"principalAirport": principal_airport,
		"localManagementId": $default_value,
		"survivalCraftType": $default_value,
		"aircraftDescription": aircraft_description,
		"aircraftRegistrationMark": aircraft_registration_mark,
		"modType": mod_type,
		"modStatus": mod_status,
		"modVariant": mod_variant
	}
end

def buildOwner(is_main,owner_name,created_date,last_modified_date)
	return {
		"fax": Faker::PhoneNumber.phone_number,
		"email": Faker::Internet.email,
		"careOf": Faker::Name.name,
		"isMain": is_main,
		"phone1": Faker::PhoneNumber.phone_number,
		"phone2": Faker::PhoneNumber.phone_number,
		"country": "UK",
		"mobile1": Faker::PhoneNumber.phone_number,
		"mobile2": Faker::PhoneNumber.phone_number,
		"address1": Faker::Address.street_name,
		"address2": Faker::Address.street_address,
		"address3": Faker::Address.city,
		"address4": Faker::Address.county,
		"postCode": Faker::Address.postcode,
		"ownerName": owner_name,
		"fkBeaconId": 6062,
		"versioning": 0,
		"companyName": Faker::Company.name,
		"createdDate": created_date,
		"createUserId": "3748",
		"updateUserId": "3748",
		"pkBeaconOwnerId": 231035,
		"lastModifiedDate": last_modified_date
	}
end

def buildBeacon(hex_id,created_date,last_modified_date)

	manufacturer = Faker::Vehicle.make
	model = Faker::Vehicle.model(make_of_model: manufacturer)
	manufacturer_serial_number = Faker::Number.number(digits: 5).to_s

	csta = Faker::Number.number(digits: 3).to_s
	coding = "SN #{Faker::Number.number(digits: 5).to_s}"
	protocol = "EPIRB, NON-GPS, CSTA, SERIALISED"
	mti = Faker::Number.number(digits: 4).to_s

	return {
		"note": Faker::Movies::StarWars.quote,
		"hexId": hex_id,
		"model": model,
		"coding": coding,
		"protocol": protocol,
		"isPending": "N",
		"beaconType": "EPIRB",
		"isArchived": "N",
		"pkBeaconId": 6062,
		"statusCode": "ACTIVE",
		"versioning": 0,
		"createdDate": created_date,
		"departRefId": "1187/02",
		"isWithdrawn": "N",
		"createUserId": 2889,
		"manufacturer": manufacturer,
		"serialNumber": manufacturer_serial_number,
		"updateUserId": 2889,
		"lastServiceDate": $default_value,
		"withdrawnReason": $default_value,
		"lastModifiedDate": last_modified_date,
		"batteryExpiryDate": created_date,
		"cospasSarsatNumber": Faker::Base.numerify("######"),
		"firstRegistrationDate": created_date,
		"manufacturerSerialNumber": manufacturer_serial_number,
		"csta": csta,
		"mti": mti
	}
end

populateBeacons
