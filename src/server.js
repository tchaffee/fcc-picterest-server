// server.js
require('dotenv').config();

const path       = process.cwd();
const express    = require('express');
const app        = express();
const port       = process.env.PORT || 8080;
const mongoose   = require('mongoose');
const jwt        = require('express-jwt');
const bodyParser = require('body-parser');

const PicController = require(path + '/src/controllers/picController.js');
const picController = new PicController();

const UserController = require(path + '/src/controllers/userController.js');
const userController = new UserController();

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

const authenticate = jwt({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_CLIENT_ID
});

// ROUTES
// ==============================================

// get an instance of router
var router = express.Router();

// Body parser must come before setting up routes or POST will not work.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add a picture
router.post('/api/users/me/pics', authenticate, function(req, res) {

  if ( ! req.user ) {
    res.json({ error: 'User is not authenticated.' } );
  } else {
    const bodyJSON = req.body;

    picController.addMyPic(req.user, bodyJSON.url, bodyJSON.description)
    .then(() => { res.sendStatus(200)});
  }
});

// Get my pictures
router.get('/api/users/me/pics', authenticate, function(req, res) {

  if ( ! req.user ) {
    res.json({ error: 'User is not authenticated.' } );
  } else {
    picController.getMyPics(req.user)
    .then(pics => {
      console.log('sending my pics back as response.');
      res.json({ pics: pics });
    })
    .catch(reason => res.status(500).json({ error: reason }));
  }
});

// Delete my picture
router.delete('/api/users/me/pics', authenticate, function(req, res) {

  if ( ! req.user ) {
    res.json({ error: 'User is not authenticated.' } );
  } else {
    const bodyJSON = req.body;

    picController.deleteMyPic(req.user.sub, bodyJSON.url)
    .then(() => { res.sendStatus(200)});
  }
});

// Get user pictures
router.get('/api/users/:userId/pics', authenticate, function(req, res) {

  if ( ! req.user ) {
    res.json({ error: 'User is not authenticated.' } );
  } else {
    picController.getUserPics(req.params.userId)
    .then(pics => {
      console.log('sending user pics back as response.');
      res.json({ pics: pics });
    })
    .catch(reason => res.status(500).json({ error: reason }));
  }
});

// Like / unlike a picture
router.post('/api/pics/:picId', authenticate, function(req, res) {

  console.log(`got a post to /api/pics/${req.params.picId}`);

  if ( ! req.user ) {
    console.log(`user not authed`);
    res.json({ error: 'User is not authenticated.' } );
  } else {
    console.log(`call likePic`);    
    picController.likePic(req.user, req.params.picId)
    .then(() => { res.sendStatus(200)});
  }
});

// Get all pictures
router.get('/api/pics', authenticate, function(req, res) {

  if ( ! req.user ) {
    res.json({ error: 'User is not authenticated.' } );
  } else {
    picController.getAllPics()
    .then(pics => {
      res.json({ pics: pics });
    })
    .catch(reason => res.status(500).json({ error: reason }));
  }
});


// apply the routes to our application
app.use('/', router);

// Catch auth errors.
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err });
  } else {
    // continue doing what we were doing and go to the route
    next();
  }
});

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Pictures happen on port ' + port);
