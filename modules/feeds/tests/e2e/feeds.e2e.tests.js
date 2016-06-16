'use strict';

describe('Feeds E2E Tests:', function () {
  describe('Test Feeds page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/feeds');
      expect(element.all(by.repeater('feed in feeds')).count()).toEqual(2);
    });
  });
  
  describe('Test managind feeds', function () {
    
    beforeEach(function() {
      browser.get('http://localhost:3001/feeds');
    });

    it('Element Should Be Present', function () {
      expect(element(by.id('start')).getText()).toBe('Select Workout');
    });
    
    it('Should add feeds', function () {
      element(by.model('nameChannel')).sendKeys('censor.net.ua');
      element(by.model('urlChannel')).sendKeys('http://censor.net.ua/includes/news_ru.xml');
      element(by.id('addChannel')).click();
      expect(element.all(by.repeater('feed in feeds')).count()).toEqual(4);
      //console.log('expect-toEqual(4)');
    });
    
    
  });
  
});
