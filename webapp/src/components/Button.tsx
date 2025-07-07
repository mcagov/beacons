import Link from "next/link";
import React, { FunctionComponent, ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
}

interface ButtonProps {
  buttonText: string;
  classes?: string;
}

interface StartButtonProps {
  buttonText?: string;
  href: string;
}

interface BackButtonProps {
  href: string;
}

interface LinkButtonProps {
  buttonText: string;
  href: string;
  classes?: string;
}

export const ButtonGroup: FunctionComponent<ButtonGroupProps> = ({
  children,
}: ButtonGroupProps): JSX.Element => (
  <div className="govuk-button-group">{children}</div>
);

export const Button: FunctionComponent<ButtonProps> = ({
  buttonText,
  classes = "",
}: ButtonProps): JSX.Element => (
  <button
    className={`govuk-button ${classes}`}
    data-module="govuk-button"
    role="button"
  >
    {buttonText}
  </button>
);

export const StartButton: FunctionComponent<StartButtonProps> = ({
  buttonText = "Start now",
  href,
}: StartButtonProps): JSX.Element => (
  <Link
    href={href}
    role="button"
    draggable="false"
    className="govuk-button govuk-button--start"
    data-module="govuk-button"
  >
    {buttonText}
    <svg
      className="govuk-button__start-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="17.5"
      height="19"
      viewBox="0 0 33 40"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
    </svg>
  </Link>
);

export const BackButton: FunctionComponent<BackButtonProps> = ({
  href,
}: BackButtonProps): JSX.Element => {
  return (
    <a href={href} className="govuk-back-link">
      Back
    </a>
  );
};

export const LinkButton: FunctionComponent<LinkButtonProps> = ({
  buttonText,
  href,
  classes = "",
}: LinkButtonProps): JSX.Element => (
  <a
    href={href}
    role="button"
    draggable="false"
    className={"govuk-button " + classes}
    data-module="govuk-button"
  >
    {buttonText}
  </a>
);
