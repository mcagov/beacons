import React, { FunctionComponent } from "react";

interface HeaderProps {
  serviceName: string;
  homeLink: string;
  signOutUri?: string;
}

export const Header: FunctionComponent<HeaderProps> = ({
  serviceName,
  homeLink,
  signOutUri,
}: HeaderProps): JSX.Element => {
  return (
    <header className="govuk-header " role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <HeaderLogo />
        <div className="govuk-header__content">
          <a
            href={homeLink}
            className="govuk-header__link govuk-header__link--service-name"
          >
            {serviceName}
          </a>
          {signOutUri && (
            <nav className="govuk-header__navigation">
              <ul id="navigation" className="govuk-header__navigation ">
                <li className="govuk-header__navigation-item">
                  <a className="govuk-header__link" href={signOutUri}>
                    Sign out
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

const HeaderLogo: FunctionComponent = (): JSX.Element => (
  <div className="govuk-header__logo">
    <a
      href="https://www.gov.uk/"
      className="govuk-header__link govuk-header__link--homepage"
    >
      <span className="govuk-header__logotype">
        <svg
          aria-hidden="true"
          focusable="false"
          className="govuk-header__logotype-crown"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 30"
          height="30"
          width="32"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M 22.6 10.4 c -1 0.4 -2 -0.1 -2.4 -1 c -0.4 -0.9 0.1 -2 1 -2.4 c 0.9 -0.4 2 0.1 2.4 1 s -0.1 2 -1 2.4 m -5.9 6.7 c -0.9 0.4 -2 -0.1 -2.4 -1 c -0.4 -0.9 0.1 -2 1 -2.4 c 0.9 -0.4 2 0.1 2.4 1 s -0.1 2 -1 2.4 m 10.8 -3.7 c -1 0.4 -2 -0.1 -2.4 -1 c -0.4 -0.9 0.1 -2 1 -2.4 c 0.9 -0.4 2 0.1 2.4 1 s 0 2 -1 2.4 m 3.3 4.8 c -1 0.4 -2 -0.1 -2.4 -1 c -0.4 -0.9 0.1 -2 1 -2.4 c 0.9 -0.4 2 0.1 2.4 1 s -0.1 2 -1 2.4 M 17 4.7 l 2.3 1.2 V 2.5 l -2.3 0.7 l -0.2 -0.2 l 0.9 -3 h -3.4 l 0.9 3 l -0.2 0.2 c -0.1 0.1 -2.3 -0.7 -2.3 -0.7 v 3.4 L 15 4.7 c 0.1 0.1 0.1 0.2 0.2 0.2 l -1.3 4 c -0.1 0.2 -0.1 0.4 -0.1 0.6 c 0 1.1 0.8 2 1.9 2.2 h 0.7 c 1 -0.2 1.9 -1.1 1.9 -2.1 c 0 -0.2 0 -0.4 -0.1 -0.6 l -1.3 -4 c -0.1 -0.2 0 -0.2 0.1 -0.3 m -7.6 5.7 c 0.9 0.4 2 -0.1 2.4 -1 c 0.4 -0.9 -0.1 -2 -1 -2.4 c -0.9 -0.4 -2 0.1 -2.4 1 s 0 2 1 2.4 m -5 3 c 0.9 0.4 2 -0.1 2.4 -1 c 0.4 -0.9 -0.1 -2 -1 -2.4 c -0.9 -0.4 -2 0.1 -2.4 1 s 0.1 2 1 2.4 m -3.2 4.8 c 0.9 0.4 2 -0.1 2.4 -1 c 0.4 -0.9 -0.1 -2 -1 -2.4 c -0.9 -0.4 -2 0.1 -2.4 1 s 0 2 1 2.4 m 14.8 11 c 4.4 0 8.6 0.3 12.3 0.8 c 1.1 -4.5 2.4 -7 3.7 -8.8 l -2.5 -0.9 c 0.2 1.3 0.3 1.9 0 2.7 c -0.4 -0.4 -0.8 -1.1 -1.1 -2.3 l -1.2 4 c 0.7 -0.5 1.3 -0.8 2 -0.9 c -1.1 2.5 -2.6 3.1 -3.5 3 c -1.1 -0.2 -1.7 -1.2 -1.5 -2.1 c 0.3 -1.2 1.5 -1.5 2.1 -0.1 c 1.1 -2.3 -0.8 -3 -2 -2.3 c 1.9 -1.9 2.1 -3.5 0.6 -5.6 c -2.1 1.6 -2.1 3.2 -1.2 5.5 c -1.2 -1.4 -3.2 -0.6 -2.5 1.6 c 0.9 -1.4 2.1 -0.5 1.9 0.8 c -0.2 1.1 -1.7 2.1 -3.5 1.9 c -2.7 -0.2 -2.9 -2.1 -2.9 -3.6 c 0.7 -0.1 1.9 0.5 2.9 1.9 l 0.4 -4.3 c -1.1 1.1 -2.1 1.4 -3.2 1.4 c 0.4 -1.2 2.1 -3 2.1 -3 h -5.4 s 1.7 1.9 2.1 3 c -1.1 0 -2.1 -0.2 -3.2 -1.4 l 0.4 4.3 c 1 -1.4 2.2 -2 2.9 -1.9 c -0.1 1.5 -0.2 3.4 -2.9 3.6 c -1.9 0.2 -3.4 -0.8 -3.5 -1.9 c -0.2 -1.3 1 -2.2 1.9 -0.8 c 0.7 -2.3 -1.2 -3 -2.5 -1.6 c 0.9 -2.2 0.9 -3.9 -1.2 -5.5 c -1.5 2 -1.3 3.7 0.6 5.6 c -1.2 -0.7 -3.1 0 -2 2.3 c 0.6 -1.4 1.8 -1.1 2.1 0.1 c 0.2 0.9 -0.3 1.9 -1.5 2.1 c -0.9 0.2 -2.4 -0.5 -3.5 -3 c 0.6 0 1.2 0.3 2 0.9 l -1.2 -4 c -0.3 1.1 -0.7 1.9 -1.1 2.3 c -0.3 -0.8 -0.2 -1.4 0 -2.7 l -2.9 0.9 C 1.3 23 2.6 25.5 3.7 30 c 3.7 -0.5 7.9 -0.8 12.3 -0.8"
          />
        </svg>
        <span className="govuk-header__logotype-text"> GOV.UK</span>
      </span>
    </a>
  </div>
);
