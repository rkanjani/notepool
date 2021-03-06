import express from 'express'
import controllers from '../controllers'
const router = express.Router();

// GET resource
router.get('/:resource', (req, res, next) => {

  let resource = req.params.resource;
  let query = req.query;
  let controller = controllers[resource];

  if(controller == null){
    return res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: ' + resource
    });
  }

  controller.find(query, false)
  .then(result => {
    res.json({
      confirmation: 'success',
      result: result
    });
  })
  .catch(err => {
    res.json({
      confirmation: 'fail',
      message: err
    });
  });
});

// GET resource by id
router.get('/:resource/:id', (req, res, next) => {

  let resource = req.params.resource;
  let id = req.params.id
  let controller = controllers[resource];

  if(controller == null){
    return res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: ' + resource
    });
  }

  controller.findById(id, false)
  .then(result => {
    res.json({
      confirmation: 'success',
      result: result
    });
  })
  .catch(err => {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource ID: ' + id + ', Resource: ' + resource
    });
  });
});

// POST resource
router.post('/:resource', (req, res, next) => {

  let resource = req.params.resource;
  let controller = controllers[resource];

  if(controller == null){
    return res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: ' + resource
    });
  }

  controller.create(req.body, false)
  .then(result => {
    res.json({
      confirmation: 'success',
      result: result
    });
  })
  .catch(err => {
    res.json({
      confirmation: 'fail',
      message: err
    });
  });
});

// PUT resource
router.put('/:resource/:id', (req, res, next) => {

  let resource = req.params.resource;
  let id = req.params.id;
  let controller = controllers[resource];

  if(controller == null){
    return res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: ' + resource
    });
  }

  controller.update(id, req.body, false)
  .then(result => {
    res.json({
      confirmation: 'success',
      result: result
    });
  })
  .catch(err => {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource ID: ' + id + ', Resource: ' + resource
    });
  });
});

// DELETE resource by id
router.delete('/:resource/:id', (req, res, next) => {

  let resource = req.params.resource;
  let id = req.params.id;
  let controller = controllers[resource];

  if(controller == null){
    return res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: ' + resource
    });
  }

  controller.delete(id)
  .then(result => {
    res.json({
      confirmation: 'success',
      result: result
    });
  })
  .catch(err => {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource ID: ' + id + ', Resource: ' + resource
    });
  });
});

export default router
