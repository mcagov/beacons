import { FunctionComponent } from "react";
import { PanelViewingState } from "../../components/dataPanel/PanelViewingState";

export const LegacyBeaconRecoveryEmailEditing: FunctionComponent<{
  recoveryEmail: string;
}> = ({ recoveryEmail }) => {
  const fields = [
    {
      key: "Recovery email editing!!",
      value: recoveryEmail,
    },
  ];

  return <PanelViewingState fields={fields} columns={2} splitAfter={20} />;
};
