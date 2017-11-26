import { createHandler } from 'redux-socket.io-connect'

// backend variable persists (since based on server not client)
let currentClients = {};

export default createHandler({
  UPDATE_NOTE: (context, action) => {
    dispatchToMultipleClients(context, action, 'UPDATE_NOTE');
  },

  SET_CURRENT_NOTE: (context, action) => {
    dispatchToMultipleClients(context, action, 'UPDATE_NOTE');
  },

  DELETE_NOTE: (context, action) => {
    dispatchToMultipleClients(context, action, 'DELETE_NOTE');
  },

  ADD_COLLABORATOR: (context, action) => {
    dispatchToSingleClient(context, action, 'ADD_NOTE');
  },

  REMOVE_COLLABORATOR: (context, action) => {
    dispatchToSingleClient(context, action, 'DELETE_NOTE');
  },

  LOGIN_SUCCESS: (context, action) => {
    const { client, server } = context;
    currentClients[client.id] = action.payload.email;
  },

  LOGOUT_USER: (context, action) => {
    const { client } = context;
    // console.log(client.id);
    delete currentClients[client.id];
    // console.log(currentClients);
  },

  SET_CLIENT_SOCKET: (context, action) => {
    const { client } = context;
    const oldClientId = getClientId(action.payload.email);
    delete currentClients[oldClientId];
    currentClients[client.id] = action.payload.email;
    // console.log(currentClients);
  }
});

// Dispatch an action to multiple clients that are collaborating on a certain note
const dispatchToMultipleClients = (context, action, dispatchType) => {
  const { client, dispatchTo } = context;
  const payload = action.payload;
  // console.log(action, client.id);
  const otherClients = getCollaboratingClients(client.id, payload);
  // console.log(otherClients);
  let clientId;
  for (clientId in otherClients){
    dispatchTo(clientId, {
      type: dispatchType,
      payload: payload
    });
  }
}

// Dispatch an action to a single client based on user's email
const dispatchToSingleClient = (context, action, dispatchType, note) => {
  const { client, dispatchTo } = context;
  const payload = action.payload;
  // console.log(action, client.id);
  // 'REMOVE_COLLABORATOR' sends email object in payload, whereas 'ADD_COLLABORATOR' sends collaborator object in payload
  const clientId = getClientId(payload.email ? payload.email : payload.collaborator.email);
  dispatchTo(clientId, {
    type: dispatchType,
    payload: (note ? note : payload.note)
  });
  //console.log(currentClients);
}

// Get all clients that have users who are collaborating on a certain note
const getCollaboratingClients = (clientId, note) => {
  let otherClients = Object.assign({}, currentClients);
  delete otherClients[clientId]; // remove client who dispatched action

  // remove clients who aren't collaborating
  let id;
  for (id in otherClients){
    let found = false;
    note.collaborators.forEach(collaborator => {
      if (collaborator['email'] === otherClients[id]){
        found = true;
      }
    });
    if (!found){
      delete otherClients[id];
    }
  }
  return otherClients;
}

// Get single client id based on user's email
const getClientId = (email) => {
  console.log(currentClients)
  let id;
  for (id in currentClients){
    if (currentClients[id] === email){
      return id;
    }
  }
  return null;
}
