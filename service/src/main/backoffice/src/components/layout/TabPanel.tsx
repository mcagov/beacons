import React, { ReactNode } from "react";

interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
}

export const TabPanel = ({
  children,
  value,
  index,
}: TabPanelProps): JSX.Element => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <>{children}</>}
    </div>
  );
};
