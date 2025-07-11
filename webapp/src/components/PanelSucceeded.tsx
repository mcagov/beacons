import React, { ReactNode, type JSX } from "react";
import { Panel } from "./Panel";

export const PanelSucceeded = (props: {
  title: string;
  children?: ReactNode;
  reference?: string;
}): JSX.Element => (
  <Panel title={props.title} reference={props.reference}>
    {props.children}
  </Panel>
);
