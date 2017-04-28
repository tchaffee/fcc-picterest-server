'use strict';

const Pics = require('../models/pics.js');
const Users = require('../models/users.js');
const UserController = require('../controllers/userController.js');

function PicController () {

  const self = this;

  this.addMyPic = function (user, url, description) {
    const userController = new UserController();

    const getUser = userController.getOrCreateUser(user);

    return getUser
    .then(user => {
      const newPic = new Pics();

      newPic.url = url;
      newPic.description = description;
      newPic.owner = user;
      return newPic.save();
    });
  }

  this.getMyPics = function (user) {
    const userController = new UserController();

    return userController.getOrCreateUser(user)
    .then(user => {
      return Pics.find({ owner: user._id })
      .populate('owner')
      .then(picsDoc => {
        
        if (picsDoc) {
          return picsDoc;
        } else {
          return [];
        }
      });
    });
  }

  this.getUserPics = function (userId) {
    const userController = new UserController();

    return userController.getUser(userId)
    .then(user => {
      return Pics.find({ owner: user._id })
      .populate('owner')
      .then(picsDoc => {
        
        if (picsDoc) {
          return picsDoc;
        } else {
          return [];
        }
      });
    });
  }

  this.getAllPics = function () {

    return Pics.find()
    .populate('owner')
    .then(picsDoc => {
      
      if (picsDoc) {
        return picsDoc;
      } else {
        return [];
      }
    });
  }  

  this.deleteMyPic = function (userId, picUrl) {
    const userController = new UserController();

    return userController.getOrCreateUser(userId)
    .then(user => {
      return Pics.findOneAndRemove({ owner: user._id, url: picUrl })
      .exec();
    });
  }

  this.getPic = function (picId) {
      return Pics.findOne({ _id: picId })
      .populate('owner')
      .then(picsDoc => {        
        if (picsDoc) {
          return picsDoc;
        } else {
          return {};
        }
      });
  }

  // Toggles the "like" of a picture for the specified user.
  this.likePic = function (user, picId) {
    console.log('likePic');

    const userController = new UserController();

    const getPic = self.getPic(picId);
    const getUser = userController.getOrCreateUser(user.sub);

    console.log(user);
    console.log(picId);

    return Promise.all([getPic, getUser])
    .then( ([pic, user]) => {
      console.log('likePic promise all');
      console.log(pic);
      console.log(user);

      const isFound = pic.likes.some(function (like) {
        return like.equals(user._id);
      });

      if (isFound) {
        console.log('removing like');
        pic.likes.remove(user._id);
      } else {
        console.log('adding like');
        pic.likes.push(user._id);
      }
      return pic.save();
    });
  }
}

module.exports = PicController;
