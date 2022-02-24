import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const iShouldSeeText = async (text: string) => {
  expect(await screen.findByText(text)).toBeVisible();
};

export const iClickButtonFoundByText = async (buttonText: string | RegExp) => {
  const button = await screen.findByText(buttonText);
  userEvent.click(button);
};

export const iClickButtonFoundByTestId = async (
  testIdText: string | RegExp
) => {
  const button = await screen.findByTestId(testIdText);
  userEvent.click(button);
};
