import { combineReducers } from 'redux'

import { noteConstants } from '../constants'
import { userConstants } from '../constants'

// Notes reducer that contains all of a user's notes
const notes = (state = [], action) => {
  switch (action.type) {
    case noteConstants.RECEIVE_NOTES:
      return action.payload;

    case noteConstants.ADD_NOTE:
      return [...state, action.payload];

    case noteConstants.UPDATE_NOTE:
    case noteConstants.SET_CURRENT_NOTE:
      return state.map(note => {
        if(note.id === action.payload.id){
          return action.payload;
        }
        return note;
      });

    case noteConstants.DELETE_NOTE:
      return state.filter(note => note.id !== action.payload.id);

    case noteConstants.ADD_COLLABORATOR:
      return state.map(note => {
        if(note.id === action.payload.id){
          let selectedNote = {...note};
          selectedNote.collaborators.push(action.payload.email);
          return selectedNote;
        }
        return note;
      });

    case noteConstants.REMOVE_COLLABORATOR:
      return state.map(note => {
        if(note.id === action.payload.id){
          let selectedNote = {...note};
          for(let i = 0; i < selectedNote.collaborators.length; i++){
            if(selectedNote.collaborators[i] === action.payload.email){
              selectedNote.collaborators.splice(i, 1);
            }
          }
          return selectedNote;
        }
        return note;
      });

    case userConstants.LOGOUT_USER:
      return [];

    default:
      return state;
  }
}

// NotesById reducer that contains a user's notes as a lookup table with note ids as keys
const notesById = (state = {}, action) => {
  let nextState = {};
  let selectedNote;

  switch (action.type){
    case noteConstants.RECEIVE_NOTES:
      nextState = {...state};
      action.payload.forEach(note => {
        nextState[note.id] = note;
      });
      return nextState;

    case noteConstants.ADD_NOTE:
    case noteConstants.UPDATE_NOTE:
    case noteConstants.SET_CURRENT_NOTE:
      return {...state, [action.payload.id]: action.payload};

    case noteConstants.DELETE_NOTE:
      nextState = {...state};
      delete nextState[action.payload.id];
      return nextState;

    case userConstants.LOGOUT_USER:
      return {};

    default:
      return state;
  }
}

// Loading reducer for when fetching notes
const loading = (state = false, action) => {
  switch (action.type){
    case noteConstants.RECEIVING_NOTES:
      return true;

    case noteConstants.RECEIVE_NOTES:
      return false;

    default:
      return state;
  }
}

// CurrentNote reducer that holds the current note
const currentNote = (state = {}, action) => {
  switch (action.type){
    case noteConstants.SET_CURRENT_NOTE:
      return action.payload;

    default:
      return state;
  }
}

// Combines all the above reducers
export default combineReducers({
  notes,
  notesById,
  loading,
  currentNote
});

// Function to get a note by its id
export const getNoteById = (state, id) => state.notesById[id];
