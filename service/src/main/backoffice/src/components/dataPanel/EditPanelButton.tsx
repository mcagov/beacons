import { Button, Typography } from "@material-ui/core";
import { IEntityLink } from "entities/IEntityLink";
import React, { FunctionComponent } from "react";

export const EditPanelButton: FunctionComponent<{
  onClick: () => void;
  links?: IEntityLink[];
}> = ({ onClick, links, children }): JSX.Element => {
  const canEdit = links == null || links.some((link) => link.verb === "PATCH");
  return canEdit ? (
    <PanelButton onClick={onClick}>{children}</PanelButton>
  ) : (
    <></>
  );
};

export const PanelButton: FunctionComponent<{
  onClick: () => void;
}> = ({ onClick, children }): JSX.Element => {
  return (
    <Typography align="right" style={{ paddingRight: "5em" }}>
      <Button variant="outlined" onClick={onClick}>
        {children}
      </Button>
    </Typography>
  );
};
