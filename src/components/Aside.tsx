import React, { FunctionComponent, ReactNode } from "react";
import styles from "../styles/Aside.module.scss";

interface AsideProps {
  title?: string;
  children: ReactNode;
}

const Aside: FunctionComponent<AsideProps> = ({
  title = null,
  children,
}: AsideProps): JSX.Element => (
  <>
    <aside
      className={`${styles.related_items} govuk-!-padding-top-3 govuk-!-padding-bottom-4`}
      role="complementary"
    >
      {title !== null && (
        <h2 className="govuk-heading-m" id="subsection-title">
          {title}
        </h2>
      )}
      <nav role="navigation" aria-labelledby="subsection-title">
        {children}
      </nav>
    </aside>
  </>
);

export default Aside;
