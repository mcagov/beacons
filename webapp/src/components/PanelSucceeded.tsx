import React, { ReactChild, ReactChildren } from "react";
import { Panel } from "./Panel";

export const PanelSucceeded = (props: {
  title: string;
  children?: ReactChild | ReactChildren;
  reference?: string;
}): JSX.Element => (
  <Panel title={props.title} reference={props.reference}>
    {props.children}
  </Panel>
);
