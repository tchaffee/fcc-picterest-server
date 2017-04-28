'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const Book = require('./books');

const User = new Schema({
	external_id: String,
	name: String,
	picture: String
});

module.exports = mongoose.model('User', User);
