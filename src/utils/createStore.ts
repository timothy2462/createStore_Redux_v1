export type Action = { type: string } & Record<string, any>;
type Reducer<S> = { (currentState: S, action: Action): S; };

/**
 * Creates a Redux-like store to manage application state
 * @param initialState The initial state of the store
 * @param reducer Function that determines how state updates in response to actions
 * @param name Optional name for the store
 * @returns Object with getState, dispatch, subscribe, and storeName methods
 */
export function createStore<S extends Record<string, any>>(
  initialState: S,
  reducer: Reducer<S>,
  initialName: string = "default"
) {
  // Internal state of the store
  let currentState = initialState;
  
  // Store name
  let storeName = initialName;
  
  // Array to store listener callbacks
  let listeners: (() => void)[] = [];
  
  /**
   * Returns the current state of the store
   */
  const getState = (): S => {
    return currentState;
  };
  
  /**
   * Gets the current name of the store
   */
  const getStoreName = (): string => {
    return storeName;
  };
  
  /**
   * Updates the name of the store
   */
  const setStoreName = (newName: string): void => {
    storeName = newName;
    // Notify listeners of the change
    listeners.forEach(listener => listener());
  };
  
  /**
   * Dispatches an action to update the state
   * @param action Object describing the change to make
   */
  const dispatch = (action: Action): void => {
    // Check if this is a special rename action
    if (action.type === '@@RENAME_STORE') {
      if (typeof action.name === 'string') {
        setStoreName(action.name);
        return;
      }
    }
    
    // Update the state by passing current state and action to the reducer
    currentState = reducer(currentState, action);
    
    // Notify all listeners that the state has changed
    listeners.forEach(listener => listener());
  };
  
  /**
   * Registers a listener function to be called whenever state changes
   * @param listener Callback function to be executed when state changes
   * @returns Function to unsubscribe the listener
   */
  const subscribe = (listener: () => void): () => boolean => {
    // Add the listener to our array
    listeners.push(listener);
    
    // Return a function to unsubscribe this listener
    return (): boolean => {
      const index = listeners.indexOf(listener);
      if (index === -1) {
        return false;
      }
      
      listeners.splice(index, 1);
      return true;
    };
  };
  
  // Initialize the store with a default action
  dispatch({ type: '@@INIT' });
  
  return {
    getState,
    dispatch,
    subscribe,
    getStoreName,
    setStoreName
  };
}