bower-files
===========

A library that talks to Bower and grabs the files that you need for your application.

### Usage

````
var bowerFiles = require('bower-files');

bowerFiles(function(err, files) {
    //array of all file paths, in order by dependency
    //example that includes weekly
    //files => ['/path/to/jquery.js', '/path/to/fidel.js', ..., '/path/to/weekly']
})

````

### Options

* `type`: Changes the filetype that is fetched, which by default is `.js`.

    bowerFiles({ type: '.css'}, function(err, files) {});

* `include`: Include only dependencies for a given library. Can be an array.

    // Just grab deps for weekly
    bowerFiles({ include: 'weekly', function(err, files) {});

* `exclude`: Get dependencies except the one specified. Can be an array.

    // Grab all deps except jquery
    bowerFiles({ exclude: 'jquery', function(err, files){});

* `map`: Object with paths to given files just in case the library didn't provide a `main` file:

    bowerFiles({
      type: '.css',
      map: {
        'Font-Awesome' : 'css/font-awesome.css'
      }
    }

### Tests

You can run tests by running `npm test`