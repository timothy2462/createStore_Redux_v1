import React, { useState, useEffect } from 'react';
import { INCREMENT, DECREMENT, RESET, counterStore, renameStore } from './utils/counterStore';
import type { CounterState } from './utils/counterStore';
import './App.css';

function App() {
  // Use React state to trigger re-renders when store updates
  const [state, setState] = useState<CounterState>(counterStore.getState());
  const [storeName, setStoreName] = useState<string>(counterStore.getStoreName());
  const [nameInput, setNameInput] = useState<string>("");

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = counterStore.subscribe(() => {
      setState(counterStore.getState());
      setStoreName(counterStore.getStoreName());
    });
    
    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRenameStore = () => {
    if (nameInput.trim()) {
      counterStore.dispatch(renameStore(nameInput));
      setNameInput("");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{storeName}</h1>
        
        <div style={{ margin: '20px 0' }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>{state.count}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => counterStore.dispatch({ type: DECREMENT })}
            style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            -
          </button>
          <button 
            onClick={() => counterStore.dispatch({ type: RESET })}
            style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reset
          </button>
          <button 
            onClick={() => counterStore.dispatch({ type: INCREMENT })}
            style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            +
          </button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter new store name"
            style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleRenameStore}
            style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Rename Store
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;