'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Feed name',
    trim: true
  },
  url: {
    type: String,
    default: '',
    required: 'Please fill Feed url',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Feed', FeedSchema);
