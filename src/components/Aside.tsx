import React, { FunctionComponent, ReactNode } from "react";
import styles from "../styles/Aside.module.scss";

interface AsideProps {
  title: string;
  children: ReactNode;
}

const Aside: FunctionComponent<AsideProps> = ({
  title,
  children,
}: AsideProps): JSX.Element => (
  <>
    <aside className={styles.related_items} role="complementary">
      <h2 className="govuk-heading-m" id="subsection-title">
        {title}
      </h2>
      <nav role="navigation" aria-labelledby="subsection-title">
        {children}
      </nav>
    </aside>
  </>
);

export default Aside;
