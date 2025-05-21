import { createStore } from "./createStore";
import type { Action } from './createStore';

export interface CounterState {
  count: number;
  lastUpdated: string;
}

const initialState: CounterState = {
  count: 0,
  lastUpdated: new Date().toISOString()
};

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';
export const RENAME_STORE = '@@RENAME_STORE';

// Reducer function to handle state updates
const counterReducer = (state: CounterState, action: Action): CounterState => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1,
        lastUpdated: new Date().toISOString()
      };
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
        lastUpdated: new Date().toISOString()
      };
    case RESET:
      return {
        ...state,
        count: 0,
        lastUpdated: new Date().toISOString()
      };
    default:
      return state;
  }
};

export const counterStore = createStore(initialState, counterReducer, "Counter Store");

// Action creator for renaming the store
export const renameStore = (newName: string) => ({
  type: RENAME_STORE,
  name: newName
});