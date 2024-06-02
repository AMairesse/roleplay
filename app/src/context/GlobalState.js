"use client";

// context/GlobalState.js
import { createContext, useReducer, useContext } from 'react';

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

const initialState = {
  user: null,
  token: null,
  // Ajoutez d'autres états globaux ici
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SCENE':
      return {
        ...state,
        currentScene: action.payload,
      };
    case 'SET_SCENES':
      return {
        ...state,
        scenes: action.payload,
      };
    case 'SET_CURRENT_WORLD':
      return {
        ...state,
        currentWorld: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
      case 'ADD_IMAGE_TO_SCENE':
        return {
          ...state,
          scenes: state.scenes.map((scene, index) =>
            index === action.payload.index
              ? { ...scene, images: [...scene.images, action.payload.image] }
              : scene
          ),
        };
    // Ajoutez d'autres cas ici
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);
