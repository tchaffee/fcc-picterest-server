'use strict';

// var Users = require('../models/users.js');
var Users = require('../models/users.js');

/**
 * @module controllers/UserController
 */
function UserController () {
  const self = this;

  /**
   * Gets an existing user. Creates the user if it does not exist.
   *
   * @param {string} userId - External user id.
   *
   * @returns {Promise}
   */
  this.getOrCreateUser = function (authUser) {

    console.log('authUser');
    console.log(authUser);

    return Users.findOne({ external_id: authUser.sub})
    .then(userDoc => {
      if ( ! userDoc ) {
        return self.addUser(authUser);
      }
      
      return userDoc;
    });
  }

  this.getUser = function (userId) {

    return Users.findOne({ external_id: userId })
    .then(userDoc => {
      if ( ! userDoc ) {
        return {};
      }
      
      return userDoc;
    });
  }

  this.addUser = function (authUser) {
    const newUser = new Users();

    newUser.external_id = authUser.sub;
    newUser.name = authUser.name;
    newUser.picture = authUser.picture;
    return newUser.save();
  }

  this.getProfile = function (authUser) {
    return self.getOrCreateUser(authUser)
    .then(user => user);
  }

};

module.exports = UserController;
