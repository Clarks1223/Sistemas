import { createContext, useReducer } from 'react';
import c04Data from '../json/c04.json';
import i01Data from '../json/i01.json';
import i02Data from '../json/i02.json';

export const FinancialContext = createContext();

const initialState = {
  c04: c04Data,
  i01: i01Data,
  i02: i02Data,
};

const ADD_RECORD = 'ADD_RECORD';
const UPDATE_RECORD = 'UPDATE_RECORD';
const DELETE_RECORD = 'DELETE_RECORD';

function financialReducer(state, action) {
  const { type, payload } = action;
  
  switch (type) {
    case ADD_RECORD:
      return {
        ...state,
        [payload.structure]: [...state[payload.structure], { ...payload.record, id: Date.now().toString() }],
      };
    case UPDATE_RECORD:
      return {
        ...state,
        [payload.structure]: state[payload.structure].map((item) =>
          item.id === payload.id ? { ...item, ...payload.record } : item
        ),
      };
    case DELETE_RECORD:
      return {
        ...state,
        [payload.structure]: state[payload.structure].filter((item) => item.id !== payload.id),
      };
    default:
      return state;
  }
}

export function FinancialProvider({ children }) {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  const addRecord = (structure, record) => {
    dispatch({ type: ADD_RECORD, payload: { structure, record } });
  };

  const updateRecord = (structure, id, record) => {
    dispatch({ type: UPDATE_RECORD, payload: { structure, id, record } });
  };

  const deleteRecord = (structure, id) => {
    dispatch({ type: DELETE_RECORD, payload: { structure, id } });
  };

  const getRecords = (structure) => state[structure] || [];

  return (
    <FinancialContext.Provider value={{ state, addRecord, updateRecord, deleteRecord, getRecords }}>
      {children}
    </FinancialContext.Provider>
  );
}
