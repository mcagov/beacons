import React, { FunctionComponent, ReactNode } from "react";

interface RadioListProps {
  radioListTitleText?: string;
  radioListSubTitleText?: string;
  children: ReactNode;
}

interface RadioListTitleProps {
  titleText?: string;
}

interface RadioListSubTitleProps {
  subTitleText?: string;
}

interface RadioListItemProps {
  id: string;
  name: string;
  value: string;
  text: string;
  hintText?: string;
}

const RadioListTitle: FunctionComponent<RadioListTitleProps> = ({
  titleText,
}: RadioListTitleProps): JSX.Element => (
  <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
    <h2 className="govuk-fieldset__heading">{titleText}</h2>
  </legend>
);

const RadioListSubTitle: FunctionComponent<RadioListSubTitleProps> = ({
  subTitleText,
}: RadioListSubTitleProps): JSX.Element => (
  <div id="beacon-intent-hint" className="govuk-hint">
    {subTitleText}
  </div>
);

export const RadioListItem: FunctionComponent<RadioListItemProps> = ({
  id,
  name,
  value,
  text,
  hintText,
}: RadioListItemProps): JSX.Element => (
  <div className="govuk-radios__item">
    <input
      className="govuk-radios__input"
      id={id}
      name={name}
      type="radio"
      value={value}
      aria-describedby={id + `-hint`}
    />
    <label className="govuk-label govuk-radios__label" htmlFor={id}>
      {text}
    </label>
    <div id={id + `-hint`} className="govuk-hint govuk-radios__hint">
      {hintText}
    </div>
  </div>
);

export const RadioList: FunctionComponent<RadioListProps> = ({
  radioListTitleText,
  radioListSubTitleText,
  children,
}: RadioListProps): JSX.Element => (
  <div className="govuk-form-group">
    <fieldset className="govuk-fieldset">
      <RadioListTitle titleText={radioListTitleText} />

      <RadioListSubTitle subTitleText={radioListSubTitleText} />

      <div className="govuk-radios govuk-!-margin-bottom-3">{children}</div>
    </fieldset>
  </div>
);
