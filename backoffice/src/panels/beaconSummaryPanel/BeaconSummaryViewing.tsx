import { FunctionComponent } from "react";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";
import { IBeacon } from "../../entities/IBeacon";
import {
  formatEmergencyContacts,
  formatOwners,
  formatSvdr,
  formatUses,
} from "../../utils/writingStyle";

export const BeaconSummaryViewing: FunctionComponent<{
  beacon: IBeacon;
}> = ({ beacon }) => {
  const fields = [
    {
      key: "Beacon status",
      value: beacon?.status,
    },
    {
      key: "Manufacturer",
      value: beacon?.manufacturer,
    },
    {
      key: "Model",
      value: beacon?.model,
    },
    {
      key: "Serial number",
      value: beacon?.manufacturerSerialNumber,
    },
    {
      key: "CHK code",
      value: beacon?.chkCode,
    },
    {
      key: "Beacon type",
      value: beacon?.beaconType,
    },
    {
      key: "Protocol",
      value: beacon?.protocol,
    },
    {
      key: "Coding",
      value: beacon?.coding,
    },
    {
      key: "CSTA / TAC",
      value: beacon?.csta,
    },
    {
      key: "MTI",
      value: beacon?.mti,
    },
    {
      key: "SVDR",
      value: formatSvdr(beacon?.svdr),
    },
    {
      key: "Battery expiry date",
      // value: formatMonth(beacon?.batteryExpiryDate),
      value: beacon?.batteryExpiryDate,
    },
    {
      key: "Last serviced date",
      // value: formatMonth(beacon?.lastServicedDate),
      value: beacon?.lastServicedDate,
    },
    {
      key: "Created date",
      value: beacon?.registeredDate,
    },
    {
      key: "Last modified date",
      value: beacon?.lastModifiedDate,
    },
    {
      key: "Reference",
      value: beacon?.referenceNumber,
    },
    {
      key: "Owner(s)",
      value: formatOwners(beacon?.owners || []),
    },
    {
      key: "Emergency contacts",
      value: formatEmergencyContacts(beacon?.emergencyContacts || []),
    },
    {
      key: "Registered uses",
      value: formatUses(beacon?.uses || []),
    },
  ];

  return <PanelViewingState fields={fields} columns={2} splitAfter={16} />;
};
