import React from "react";
import { Role } from "../../lib/User";
import { useAuthContext } from "./AuthProvider";

export const OnlyVisibleToUsersWith = ({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) => {
  const { user } = useAuthContext();

  if (user.type === "loggedInUser" && user?.attributes.roles.includes(role)) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};
