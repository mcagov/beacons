import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";

interface LabelProps {
  label: Blob;
}

interface LabelViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
}

interface LabelsViewProps {
  exportsGateway: IExportsGateway;
  beaconIds: string[];
}

const RenderLabel: FunctionComponent<LabelProps> = ({ label }): JSX.Element => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (label.size > 0 && !isLoading) {
      setLoading(true);
      setUrl(URL.createObjectURL(label));
    }
  }, [label, isLoading]);

  useEffect(() => {
    if (url.length > 0) {
      var printTab = window.open(url, "_blank");
      printTab?.print();
    }
  }, [url]);

  return (
    <object
      className="label"
      width="100%"
      height="800"
      data={url + "#zoom=500"}
      type="application/pdf"
      aria-label="Beacon Label"
    />
  );
};

export const LabelView: FunctionComponent<LabelViewProps> = ({
  exportsGateway,
  beaconId,
}): JSX.Element => {
  const [label, setLabel] = useState<Blob>({} as Blob);

  useEffect(() => {
    exportsGateway.getLabelForBeacon(beaconId).then(setLabel);
  }, [beaconId, exportsGateway]);

  return <RenderLabel label={label} />;
};

export const LabelsView: FunctionComponent<LabelsViewProps> = ({
  exportsGateway,
  beaconIds,
}): JSX.Element => {
  const [label, setLabel] = useState<Blob>({} as Blob);

  useEffect(() => {
    exportsGateway.getLabelsForBeacons(beaconIds).then(setLabel);
  }, [beaconIds, exportsGateway]);

  return <RenderLabel label={label} />;
};
