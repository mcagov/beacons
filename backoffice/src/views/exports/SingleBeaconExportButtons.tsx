import { Button } from "@mui/material";
import ContentPrintIcon from "@mui/icons-material/Print";

export function SingleBeaconExportButtons({
  beaconId,
  buttonClasses,
}: {
  beaconId: string;
  buttonClasses: string;
}) {
  return (
    <>
      <span className={buttonClasses}>
        <Button
          href={`/backoffice#/certificate/${beaconId}`}
          variant="outlined"
          endIcon={<ContentPrintIcon />}
        >
          certificate
        </Button>
      </span>
      <span className={buttonClasses}>
        <Button
          href={`/backoffice#/letter/registration/${beaconId}`}
          variant="outlined"
          endIcon={<ContentPrintIcon />}
        >
          Registration letter
        </Button>
      </span>
      <span className={buttonClasses}>
        <Button
          href={`/backoffice#/letter/amended/${beaconId}`}
          variant="outlined"
          endIcon={<ContentPrintIcon />}
        >
          Amended letter
        </Button>
      </span>
      <span className={buttonClasses}>
        <Button
          href={`/backoffice#/label/${beaconId}`}
          variant="outlined"
          endIcon={<ContentPrintIcon />}
        >
          Label
        </Button>
      </span>
    </>
  );
}
