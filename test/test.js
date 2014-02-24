"use strict";

var assert = require('assert'),
    bowerFiles = require('../index');

suite('Bower-Files', function () {
  test('should only return js files by default', function (done) {
    bowerFiles(function (err, results) {
      var files = results.filter(function (file) {
        return file.indexOf('.js') === -1;
      });
      assert.equal(files.length, 0,'Only JS files');
      done();
    });
  });
  test('should only return one less file if type is .less', function (done) {
    bowerFiles({ type: '.less' },function (err, results) {
      assert.equal(results.length,1,'Only one result');
      assert.equal(results[0],'bower_components/oban/oban.less','Only one result');
      done();
    });
  });
  test('Should exclude given libraries', function (done) {
    bowerFiles({
      exclude : ['fidel']
    }, function (err, results) {
      assert.equal(results.indexOf('bower_components/fidel/dist/fidel.js'),-1);
      done();
    });
  });
  test('Should include only given libraries and it\'s dependencies', function (done) {
    bowerFiles({
      include : ['fidel']
    }, function (err, results) {
      assert.equal(results.indexOf('bower_components/fidel/dist/fidel.js'),1);
      assert.equal(results.length,2);
      done();
    });
  });
  test('Should return an error if no files are found', function (done) {
    bowerFiles({
      type: '.hbs'
    }, function (err, results) {
      assert.equal(err.message,'No files could be found with given parameters');
      assert.equal(results,null);
      done();
    });
  });
  test('Should use the map property to map main properties', function (done) {
    bowerFiles({
      type: '.css',
      map: {
        'Font-Awesome' : 'css/font-awesome.css'
      }
    }, function (err, results) {
      assert.equal(results.indexOf('bower_components/Font-Awesome/css/font-awesome.css'),0);
      assert.equal(results.length,1);
      done();
    });
  });
});