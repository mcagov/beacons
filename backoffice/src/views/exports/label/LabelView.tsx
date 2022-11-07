import { FunctionComponent, useEffect, useState } from "react";
import { IExportsGateway } from "gateways/exports/IExportsGateway";

interface LabelViewProps {
  exportsGateway: IExportsGateway;
  beaconId: string;
}

export const LabelView: FunctionComponent<LabelViewProps> = ({
  exportsGateway,
  beaconId,
}): JSX.Element => {
  const [label, setLabel] = useState<Blob>({} as Blob);
  const [url, setUrl] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    exportsGateway.getLabelForBeacon(beaconId).then(setLabel);
  }, [beaconId]);

  useEffect(() => {
    if (label.size > 0 && !isLoading) {
      setLoading(true);
      setUrl(URL.createObjectURL(label));
    }
  }, [label, isLoading]);

  return (
    <object
      className="label"
      width="100%"
      height="800"
      data={url + "#zoom=500"}
      type="application/pdf"
    />
  );
};
