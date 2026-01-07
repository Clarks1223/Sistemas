import { createContext, useReducer, useEffect } from 'react';
import { c04Service } from '../services/api';

export const FinancialContext = createContext();

const initialState = {
  c04: [], 
  i01: [],
  i02: [],
  loading: { c04: false },
  error: { c04: null }
};

const SET_RECORDS = 'SET_RECORDS';
const ADD_RECORD = 'ADD_RECORD';
const UPDATE_RECORD = 'UPDATE_RECORD';
const DELETE_RECORD = 'DELETE_RECORD';
const SET_ERROR = 'SET_ERROR';
const SET_LOADING = 'SET_LOADING';

function financialReducer(state, action) {
  const { type, payload } = action;
  
  switch (type) {
    case SET_RECORDS:
        return {
            ...state,
            [payload.structure]: payload.data
        };
    case ADD_RECORD:
      return {
        ...state,
        [payload.structure]: [...state[payload.structure], payload.record],
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
    case SET_LOADING:
        return { ...state, loading: { ...state.loading, [payload.structure]: payload.isLoading } };
    case SET_ERROR:
        return { ...state, error: { ...state.error, [payload.structure]: payload.error } };
    default:
      return state;
  }
}

export function FinancialProvider({ children }) {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  // Load C04 Data on Mount
  useEffect(() => {
    const fetchC04 = async () => {
        dispatch({ type: SET_LOADING, payload: { structure: 'c04', isLoading: true } });
        try {
            const response = await c04Service.getAll();
            dispatch({ type: SET_RECORDS, payload: { structure: 'c04', data: response.data } });
        } catch (error) {
            console.error("Error fetching C04:", error);
            dispatch({ type: SET_ERROR, payload: { structure: 'c04', error: error.message } });
        } finally {
            dispatch({ type: SET_LOADING, payload: { structure: 'c04', isLoading: false } });
        }
    };
    fetchC04();

    // Conditionally load local JSONs if they exist (avoids build error if missing)
    const loadLocalData = async () => {
        try {
            // Use Vite's glob import to detect presence of files without breaking build
            const jsonFiles = import.meta.glob('../json/*.json');
            
            if (jsonFiles['../json/i01.json']) {
                const mod = await jsonFiles['../json/i01.json']();
                dispatch({ type: SET_RECORDS, payload: { structure: 'i01', data: mod.default } });
            }
            
            if (jsonFiles['../json/i02.json']) {
                 const mod = await jsonFiles['../json/i02.json']();
                 dispatch({ type: SET_RECORDS, payload: { structure: 'i02', data: mod.default } });
            }
        } catch (err) {
            console.warn("Could not load local JSON data", err);
        }
    };
    loadLocalData();

  }, []);

  const addRecord = async (structure, record) => {
    if (structure === 'c04') {
        try {
            const response = await c04Service.create(record);
            dispatch({ type: ADD_RECORD, payload: { structure, record: response.data } });
        } catch (error) {
             console.error("Error adding C04:", error);
             alert("Error al guardar: " + (error.response?.data ? JSON.stringify(error.response.data) : error.message));
        }
    } else {
        // Fallback for i01/i02 (local state)
        dispatch({ type: ADD_RECORD, payload: { structure, record: { ...record, id: Date.now().toString() } } });
    }
  };

  const updateRecord = async (structure, id, record) => {
    if (structure === 'c04') {
        try {
            // Using PATCH for partial updates usually better with forms, but PUT is also fine if full payload.
            // Based on previous turn instructions, I will use PATCH or update logic.
            const response = await c04Service.update(id, record); // Assuming full update based on form submit
            dispatch({ type: UPDATE_RECORD, payload: { structure, id, record: response.data } });
        } catch (error) {
            console.error("Error updating C04:", error);
            alert("Error al actualizar: " + (error.response?.data ? JSON.stringify(error.response.data) : error.message));
        }
    } else {
        dispatch({ type: UPDATE_RECORD, payload: { structure, id, record } });
    }
  };

  const deleteRecord = async (structure, id) => {
    if (structure === 'c04') {
        try {
            await c04Service.delete(id);
            dispatch({ type: DELETE_RECORD, payload: { structure, id } });
        } catch (error) {
            console.error("Error deleting C04:", error);
            alert("Error al eliminar");
        }
    } else {
        dispatch({ type: DELETE_RECORD, payload: { structure, id } });
    }
  };

  const getRecords = (structure) => state[structure] || [];

  return (
    <FinancialContext.Provider value={{ state, addRecord, updateRecord, deleteRecord, getRecords }}>
      {children}
    </FinancialContext.Provider>
  );
}
