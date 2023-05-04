import { FunctionComponent } from "react";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";

export const LegacyBeaconRecoveryEmailViewing: FunctionComponent<{
  recoveryEmail: string;
}> = ({ recoveryEmail }) => {
  const fields = [
    {
      key: "Recovery email",
      value: recoveryEmail,
    },
  ];

  return <PanelViewingState fields={fields} columns={2} splitAfter={20} />;
};
