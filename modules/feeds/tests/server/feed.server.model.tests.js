'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Feed = mongoose.model('Feed');

/**
 * Globals
 */
var user, feed;

/**
 * Unit tests
 */
describe('Feed Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'RW@123456@Odessa'
    });

    user.save(function() { 
      feed = new Feed({
        name: 'censor.net.ua',
        url: 'http://censor.net.ua/includes/news_ru.xml',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(10000);
      return feed.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      feed.name = '';
      feed.url = 'http://censor.net.ua/includes/news_ru.xml';

      return feed.save(function(err) {
        should.exist(err);
        done();
      });
    });
    
    it('should be able to show an error when try to save without url', function(done) { 
      feed.name = 'censor.net.ua';
      feed.url = '';

      return feed.save(function(err) {
        should.exist(err);
        done();
      });
    });
    
  });

  afterEach(function(done) { 
    Feed.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
