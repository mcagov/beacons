export type User = LoggedInUser | LoggedOutUser;

export type LoggedInUser = {
  type: "loggedInUser";
  attributes: UserAttributes;
  apiAccessToken?: string;
};

export type LoggedOutUser = {
  type: "loggedOutUser";
};

export type UserAttributes = {
  username: string;
  displayName?: string;
  roles: Role[];
};

export type Role =
  | "DEFAULT_ACCESS"
  | "ADD_BEACON_NOTES"
  | "UPDATE_RECORDS"
  | "DATA_EXPORTER"
  | "DELETE_BEACONS"
  | "ADMIN_EXPORT";

export type UserActions = LoginAction | SetApiAccessTokenAction;

export type LoginAction = {
  type: "login";
  userAttributes: UserAttributes;
};

export type SetApiAccessTokenAction = {
  type: "set_api_access_token";
  apiAccessToken: string;
};

export function userReducer(user: User, action: UserActions): User {
  switch (action.type) {
    case "set_api_access_token":
      if (user.type === "loggedInUser") {
        return { ...user, apiAccessToken: action.apiAccessToken };
      } else {
        return user;
      }
    case "login":
      return {
        type: "loggedInUser",
        attributes: action.userAttributes,
      };
  }
}
