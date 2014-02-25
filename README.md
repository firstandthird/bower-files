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

```javascript
bowerFiles({ type: '.css'}, function(err, files) {});
```

* `include`: Include only dependencies for a given library. Can be an array.

```javascript
// Just grab deps for weekly
bowerFiles({ include: 'weekly', function(err, files) {});
```

* `exclude`: Get dependencies except the one specified. Can be an array.

```javascript
// Grab all deps except jquery
bowerFiles({ exclude: 'jquery', function(err, files){});
```

* `map`: Object with paths to given files just in case the library didn't provide a `main` file:

```javascript
bowerFiles({
    type: '.css',
    map: {
        'Font-Awesome' : 'css/font-awesome.css'
    }
});
```

## CLI Usage

These are the parameters of the CLI:

````
Options:
  -t, --type     Type of the files you want to get.                                             [default: ".js"]
  -i, --include  The only libraries you want to include in your results. Comma separated list.
  -e, --exclude  Libraries you want to exclude and their dependencies. Comma separated list.
  -j, --json     Output the content as JSON instead of one line per file.
  -m, --map      Path to a JSON file which has a map of libraries and relative paths.
  -h, --help     Shows help info.
````

### Tests

You can run tests by running `npm test`
