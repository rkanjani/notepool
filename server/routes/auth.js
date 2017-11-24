import express from 'express'
import passport from 'passport'
const router = express.Router();

// Register route
router.post('/register', (req, res, next) => {
  const validationResult = validateRegisterForm(req);
  if(!validationResult.success){
    return res.json({
      confirmation: 'fail',
      message: validationResult.errors
    });
  }
  return passport.authenticate('local-register', (err, user, info) => {
    if(info){
      return res.json({
        confirmation: 'fail',
        message: info.message
      });
    }
    if(err){
      return res.json({
        confirmation: 'fail',
        message: 'Could not process the form.'
      });
    }

    return res.json({
      confirmation: 'success',
      message: 'You have successfully registered!',
      user: user.summary()
    });
  })(req, res, next);
});

// Login route
router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req);
  if(!validationResult.success){
    return res.json({
      confirmation: 'fail',
      message: validationResult.errors
    });
  }
  return passport.authenticate('local-login', (err, user, info) => {
    if(info){
      return res.json({
        confirmation: 'fail',
        message: info.message
      });
    }
    if(err){
      return res.json({
        confirmation: 'fail',
        message: 'Could not process the form.'
      });
    }

    return res.json({
      confirmation: 'success',
      message: 'You have successfully logged in!',
      user: user.summary()
    });
  })(req, res, next);
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout();
  return res.json({
    confirmation: 'success',
    message: 'You have successfully logged out!'
  });
});

// Validate user inputs for registering
const validateRegisterForm = (req) => {
  let isFormValid = true;

  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email is invalid.').isEmail();
  req.checkBody('password', 'Password is required.').notEmpty();

  let errors = req.validationErrors();

  if (!req.body || typeof req.body.name !== 'string'
      || typeof req.body.email !== 'string'
      || typeof req.body.password !== 'string'
      || errors){
    isFormValid = false;
  }
  return {
    success: isFormValid,
    errors: errors
  }
}

// Validate user inputs for logging in
const validateLoginForm = (req) => {
  let isFormValid = true;

  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();

  let errors = req.validationErrors();

  if (!req.body || typeof req.body.email !== 'string'
      || typeof req.body.password !== 'string'
      || errors){
    isFormValid = false;
  }
  return {
    success: isFormValid,
    errors: errors
  }
}

export default router
