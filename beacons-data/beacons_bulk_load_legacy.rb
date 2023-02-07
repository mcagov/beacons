require 'pg'
require 'faker'
require 'securerandom'
require 'json'

$default_value = ""

Faker::Config.locale = 'tr'

def populateBeacons
	
	owner_name = ARGV[0] || Faker::Name.name
	owner_email = ARGV[1] || Faker::Internet.email

  	db_host = 'localhost'
	db_password= 'password'

	puts("host is #{db_host}")

	conn = PG.connect( dbname: 'beacons', :host => db_host, :port => 5432,
		 :user => 'beacons_service', :password => db_password )

	conn.prepare("statement", 'INSERT INTO legacy_beacon (id, hex_id, owner_email, owner_name, created_date, beacon_status, data, last_modified_date, use_activities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)')

	useLookup = {}
	useLookup["MARITIME"] = ["SAILING","MOTOR","ROWING","SMALL_UNPOWERED","FISHING_VESSEL","MERCHANT_VESSEL","FLOATING_PLATFORM","OFFSHORE_WINDFARM","OFFSHORE_RIG_PLATFORM"]
	useLookup["AIRCRAFT"] = ["JET_AIRCRAFT","LIGHT_AIRCRAFT","GLIDER","HOT_AIR_BALLOON","ROTOR_CRAFT","PASSENGER_PLANE","CARGO_AIRPLANE"]
	useLookup["LAND"] = ["DRIVING","CYCLING","CLIMBING_MOUNTAINEERING","SKIING","WALKING_HIKING","WORKING_REMOTELY","WINDFARM","OTHER"]
	useLookup["RIG/PLATFORM"] = ["RIG_USE"]
	useLookup["MOD"] = ["MOD_USE"]

	10000.times do |count|
		# generate random data
		uuid = SecureRandom.uuid
		created_date = Faker::Time.between_dates(from: '2010-09-01', to: '2020-09-01').iso8601
		last_modified_date = Faker::Time.between_dates(from: '2020-09-01', to: '2021-09-01').iso8601
		beacon_status = "MIGRATED"

		person_uuid = SecureRandom.uuid
		account_holder_uuid = SecureRandom.uuid
		beacon_uuid = SecureRandom.uuid
		hex_id =  Faker::Base.regexify("1D[A-F1-9]{13}")
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
	tripInfo = Faker::Movies::Hobbit.quote

	# Maritime only fields
	if environment == "MARITIME"
		homePort = Faker::Address.city
		vessel_type = purpose
		beacon_location = ["Cabin", "Hull", "On Life Jacket", "Backpack"].sample
		area_of_use = "UK AND NORTH SEA COASTAL PORTS"
		fishing_vessel_pln = Faker::Number.number(digits: 6)
		hull_id_number = Faker::Alphanumeric.alphanumeric(number: 8)
		survival_craft_type = "Maritime dinghy"
	end

	#Aircraft only fields
	if environment == "AIRCRAFT"
		aircraft_type = purpose
		aircraft_description = "#{Faker::Color.color_name} #{aircraft_type}"
		aircraft_registration_mark = Faker::Vehicle.vin
		principal_airport = Faker::Address.city
		beacon_location = ["Cabin", "Under Seat", "Hold"].sample
		area_of_use = "UK SKIES"
		survival_craft_type = "Aircraft parachute"
	end

	#Rig/Platform only fields
	if environment == "RIG/PLATFORM"
		rigName = Faker::Movies::StarWars.vehicle
		beacon_location = ["On Platform", "ON Rig"].sample
		area_of_use = "UK RIG AREAS"
		survival_craft_type = "Rig survival craft"
	end

	#Land only fields
	if environment == "LAND"
		landUse = activity
		beacon_location = ["In Backpack", "On Person", "In Vehicle"].sample
		area_of_use = "UK INLAND AREAS"
		survival_craft_type = "Land buggy"
	end

	#MOD only fields
	if environment == "MOD"
		beacon_location = ["Classified Location","Redacted"].sample
		mod_type = Faker::Vehicle.model
		mod_status = ["ACTIVE","INACTIVE"].sample
		mod_variant = Faker::Vehicle.manufacture
		area_of_use = "MOD CLASSIFIED AREA"
		survival_craft_type = "MOD classified survival craft"
	end

	return {
		"note": Faker::Movies::StarWars.quote,
		"notes": Faker::Movies::HarryPotter.quote,
		"isMain": main_use,
		"landUse": landUse,
		"rigName": rigName,
		"useType": activity,
		"callSign": call_sign,
		"homePort": homePort,
		"position": position,
		"tripInfo": tripInfo,
		"areaOfUse": area_of_use,
		"beaconNsn": Faker::Number.number(digits: 3),
		"imoNumber": Faker::Number.number(digits: 4),
		"fkBeaconId": 6062,
		"maxPersons": Faker::Number.between(from: 1, to: 10),
		"mmsiNumber": Faker::Base.numerify("#########"),
		"versioning": 0,
		"vesselName": vessel_name,
		"vesselType": vessel_type,
		"createdDate": created_date,
		"aircraftType": aircraft_type,
		"createUserId": 2889,
		"hullIdNumber": hull_id_number,
		"rssSsrNumber": Faker::Alphanumeric.alphanumeric(number: 5),
		"updateUserId": 2889,
		"cg66RefNumber": Faker::Alphanumeric.alphanumeric(number: 3),
		"pennantNumber": Faker::Alphanumeric.alphanumeric(number: 5),
		"beaconPosition": beacon_location,
		"communications": "VHF/DSC",
		"officialNumber": Faker::Number.number(digits: 3),
		"pkBeaconUsesId": 6057,
		"aodSerialNumber": Faker::Number.number(digits: 9),
		"bit24AddressHex": Faker::Alphanumeric.alphanumeric(number: 10),
		"beaconPartNumber": Faker::Number.between(from: 1, to: 6),
		"fishingVesselPln": fishing_vessel_pln,
		"lastModifiedDate": last_modified_date,
		"principalAirport": principal_airport,
		"localManagementId": Faker::Number.number(digits: 3),
		"survivalCraftType": survival_craft_type,
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
		# for CH locale
		"address4": Faker::Address.state,
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
		"lastServiceDate": last_modified_date,
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
#populateBeaconsWithNoHexIds
