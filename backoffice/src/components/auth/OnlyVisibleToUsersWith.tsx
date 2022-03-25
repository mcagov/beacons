import React from "react";
import { Role } from "../../lib/User";
import { AuthContext } from "./AuthProvider";

export const OnlyVisibleToUsersWith = ({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) => {
  return (
    <AuthContext.Consumer>
      {(auth) => {
        if (auth.user?.roles.includes(role)) {
          return <>{children}</>;
        } else {
          return <></>;
        }
      }}
    </AuthContext.Consumer>
  );
};
