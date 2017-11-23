import { noteConstants } from '../constants'
import { APIManager } from '../../utils'

// ACTION DISPATCHERS
// equivalent to " ... => { return (dispatch) => { ... }} "

// Action dispatcher for fetching all of a user's notes
export const fetchNotes = (id) => (dispatch) => {
  dispatch(fetchingNotesAction());

  APIManager.get(`/api/users/${id}`, null)
  .then(response => {
    const params = { params: { collaborators: response.result.local.email }}
    APIManager.get('/api/notes', params)
    .then(response => {
      //setTimeout(() => {dispatch(fetchNotesAction(response.result))}, 1000);
      dispatch(fetchNotesAction(response.result));
      return null;
    })
    .catch(error => {
      console.log(error.message);
    });
    return null;
  })
  .catch(error => {
    console.log(error.message);
  });
}

// Action dispatcher for adding a note
export const addNote = (note) => (dispatch) => {
  return APIManager.post('/api/notes', note)
  .then(response => {
    dispatch(addNoteAction(response.result));
    return response.result;
  })
  .catch(error => {
    console.log(error.message);
  });
}

// Action dispatcher for updating a given note
export const updateNote = (note) => (dispatch) => {
  APIManager.put(`/api/notes/${note.id}`, {data: note})
  .then(response => {
    dispatch(updateNoteAction(response.result));
    return null;
  })
  .catch(error => {
    console.log(error.message);
  });
}

// Action dispatcher for deleting a given
export const deleteNote = (note) => (dispatch) => {
  APIManager.delete(`/api/notes/${note.id}`)
  .then(response => {
    dispatch(deleteNoteAction(note));
    return null;
  })
  .catch(error => {
    console.log(error.message);
  });
}

// Action dispatcher for setting a note as the current note
export const setCurrentNote = (note) => (dispatch) => {
  dispatch(setCurrentNoteAction(note));
}

// Action dispatcher for adding a collaborator from a note
export const addCollaborator = (params) => (dispatch) => {
  dispatch(addCollaboratorAction(params));
  dispatch(updateCollaborator(params));
}

// Action dispatcher for removing a collaborator from a note
export const removeCollaborator = (params) => (dispatch) => {
  dispatch(removeCollaboratorAction(params));
  dispatch(updateCollaborator(params));
}

// Updates the note with the collaborator changes in the database and sets it as the current note
const updateCollaborator = (params) => (dispatch, getState) => {
  const note = getState().note.notesById[params.id];
  //const data = { data: { email: params.email }}
  APIManager.put(`/api/notes/${params.id}`, {data: note})
  .then(response => {
    dispatch(setCurrentNoteAction(response.result));
    return null;
  })
  .catch(error => {
    console.log(error.message);
  });
}

// ACTION CREATORS
// equivalent to " ... => { return { ... } } "

const fetchingNotesAction = () => ({
  type: noteConstants.RECEIVING_NOTES
})

const fetchNotesAction = (notes) => ({
  type: noteConstants.RECEIVE_NOTES,
  payload: notes
});

const addNoteAction = (note) => ({
  type: noteConstants.ADD_NOTE,
  payload: note
});

const updateNoteAction = (note) => ({
  type: noteConstants.UPDATE_NOTE,
  payload: note,
  meta: {
    emit: true
  }
});

const deleteNoteAction = (note) => ({
  type: noteConstants.DELETE_NOTE,
  payload: note,
  meta: {
    emit: true
  }
});

const setCurrentNoteAction = (note) => ({
  type: noteConstants.SET_CURRENT_NOTE,
  payload: note,
  meta: {
    emit: true
  }
});

const addCollaboratorAction = (params) => ({
  type: noteConstants.ADD_COLLABORATOR,
  payload: params,
  meta: {
    emit: true
  }
});

const removeCollaboratorAction = (params) => ({
  type: noteConstants.REMOVE_COLLABORATOR,
  payload: params,
  meta: {
    emit: true
  }
});
