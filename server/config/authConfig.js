export default {
  'googleAuth' : {
    'clientID'      : '133121145713-qc279g7kho92n3bg93k0ij61dufob85e.apps.googleusercontent.com',
    'clientSecret'  : 'V6N2PCNiaUr0nxnn8YJ_46eY',
    'callbackURL'   : 'http://localhost:3010/auth/google/callback'
  },

  'facebookAuth' : {
    'clientID'      : '247893029076540',
    'clientSecret'  : 'f96d4413fae4202cd8ffedbd6311f5f1',
    'callbackURL'   : 'http://localhost:3010/auth/facebook/callback',
    'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
  }
}
