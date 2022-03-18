import React from "react";

type UserSettings = {
  searchMode: SearchMode;
};

export type SearchMode = "default" | "advanced";

type UserSettingsAction = {
  action: "update_searchMode";
  payload: SearchMode;
};

const UserSettingsContext = React.createContext<
  [settings: UserSettings, dispatch: React.Dispatch<UserSettingsAction>] | null
>(null);

function userSettingsReducer(
  settings: UserSettings,
  action: UserSettingsAction
): UserSettings {
  switch (action.action) {
    case "update_searchMode":
      settings = { ...settings, searchMode: action.payload };
  }

  return settings;
}

export function UserSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [userSettings, dispatch] = React.useReducer(userSettingsReducer, {
    searchMode: "default",
  });
  return (
    <UserSettingsContext.Provider value={[userSettings, dispatch]}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings(): [
  UserSettings,
  React.Dispatch<UserSettingsAction>
] {
  const context = React.useContext(UserSettingsContext);
  if (context == null) {
    throw new Error(
      "useUserSettings must be used in a child of UserSettingsContext"
    );
  }
  return context;
}

export function updateSearchMode(
  dispatch: React.Dispatch<UserSettingsAction>,
  searchMode: SearchMode
): void {
  dispatch({ action: "update_searchMode", payload: searchMode });
}
