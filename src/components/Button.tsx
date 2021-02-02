import React, { FunctionComponent } from "react";

interface ButtonProps {
  buttonText: string;
}

const Button: FunctionComponent<ButtonProps> = ({
  buttonText,
}: ButtonProps): JSX.Element => (
  <button className="govuk-button" data-module="govuk-button">
    {buttonText}
  </button>
);

interface StartButtonProps {
  buttonText?: string;
}

export const StartButton: FunctionComponent<StartButtonProps> = ({
  buttonText = "Start now",
}: StartButtonProps) => (
  <>
    <a
      href="#"
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
    </a>
  </>
);

export default Button;
