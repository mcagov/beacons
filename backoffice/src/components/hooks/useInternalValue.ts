import React from "react";

interface InternalState {
  internalValue: string;
  editing: boolean;
}

interface SetEditingAction {
  type: "set_editing";
  payload: { editing: boolean };
}

interface SetValueAction {
  type: "set_value";
  payload: { internalValue: string };
}

interface ClearValueAction {
  type: "clear_value";
}

type Action = SetEditingAction | SetValueAction | ClearValueAction;

function reducer(state: InternalState, action: Action) {
  switch (action.type) {
    case "set_editing":
      return { ...state, ...action.payload };
    case "set_value":
      if (!state.editing) {
        return state;
      }
      return { ...state, ...action.payload };
    case "clear_value":
      return { internalValue: "", editing: false };
  }
}

export function useInternalValue(
  initialValue: string
): [InternalState, React.Dispatch<Action>] {
  return React.useReducer(reducer, {
    editing: false,
    internalValue: initialValue,
  });
}

export function setEditing(
  dispatch: React.Dispatch<Action>,
  editing: boolean
): void {
  dispatch({ type: "set_editing", payload: { editing } });
}

export function setInternalValue(
  dispatch: React.Dispatch<Action>,
  internalValue: string
): void {
  dispatch({ type: "set_value", payload: { internalValue } });
}

export function clearInternalValue(dispatch: React.Dispatch<Action>) {
  dispatch({ type: "clear_value" });
}
