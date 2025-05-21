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
  let currentState = initialState;
  
  let storeName = initialName;
  
  let listeners: (() => void)[] = [];
  
  
  const getState = (): S => {
    return currentState;
  };
  
 
  const getStoreName = (): string => {
    return storeName;
  };
  
  
  const setStoreName = (newName: string): void => {
    storeName = newName;
    // Notify listeners of the change
    listeners.forEach(listener => listener());
  };
  
   //Dispatches an action to update the state
  const dispatch = (action: Action): void => {
    if (action.type === '@@RENAME_STORE') {
      if (typeof action.name === 'string') {
        setStoreName(action.name);
        return;
      }
    } 
    currentState = reducer(currentState, action);
    listeners.forEach(listener => listener());
  };
  
  const subscribe = (listener: () => void): () => boolean => {
    listeners.push(listener);
    
    return (): boolean => {
      const index = listeners.indexOf(listener);
      if (index === -1) {
        return false;
      }
      
      listeners.splice(index, 1);
      return true;
    };
  };
  
  dispatch({ type: '@@INIT' });
  
  return {
    getState,
    dispatch,
    subscribe,
    getStoreName,
    setStoreName
  };
}