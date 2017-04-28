'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pic = new Schema({
	url: String,
	description: String,
	owner: { type: mongoose.Schema.ObjectId, ref : 'User', required: true },
	likes: [{ type: mongoose.Schema.ObjectId, ref : 'User' }]
});

module.exports = mongoose.model('Pic', Pic);
