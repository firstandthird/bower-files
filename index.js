'use strict';
var bower = require('bower'),
    DepTree = require('deptree'),
    aug = require('aug'),
    fs = require('fs'),
    path = require('path'),
    defaultOpts = {
      type : '.js',
      include: [],
      map: {},
      exclude: []
    };

function noop(){

}

function getDependencies(name, obj, dependencies, options){
  if (name){
    var mainFile = obj.pkgMeta.main || options.map[name];
    if (mainFile){
      var fullPath = path.resolve(obj.canonicalDir,mainFile),
          relPath = path.relative(__dirname,fullPath);

      if(options.exclude.indexOf(name) === -1 && relPath.indexOf(options.type) > -1 && fs.existsSync(relPath)){
        dependencies.tree.add(name, Object.keys(obj.dependencies));
        dependencies.files[name] = relPath;
      }
    }
    for (var dependency in obj.dependencies){
      if (obj.dependencies.hasOwnProperty(dependency) && options.exclude.indexOf(dependency) === -1){
        getDependencies(dependency,obj.dependencies[dependency], dependencies, options);
      }
    }
  }
}

module.exports = function(options, callback){
  var results = [],
      files = [],
      error = null,
      deptree = new DepTree(),
      userOptions;

  if (typeof options === "function"){
    callback = options;
    options = {};
  }

  userOptions = aug({},defaultOpts, options);


  if (!Array.isArray(userOptions.exclude)){
    userOptions.exclude = [userOptions.exclude];
  }
  if (!Array.isArray(userOptions.include)){
    userOptions.include = [userOptions.include];
  }

  callback = callback || noop;
  bower.commands.list({ map: true }, { offline: true })
    .on('end', function(data) {
      for (var dep in data.dependencies) {
        if (data.dependencies.hasOwnProperty(dep)){
          if(userOptions.include.length && userOptions.include.indexOf(dep) === -1) {
            continue;
          }
          if(userOptions.exclude.length && userOptions.exclude.indexOf(dep) !== -1){
            continue;
          }

          if (data.dependencies[dep].missing){
            error = new Error(dep + ' is currently missing. Perhaps you\'re missing a bower install?');
            break;
          }
          getDependencies(dep,data.dependencies[dep],{
            tree : deptree,
            files : files
          },userOptions);
        }
      }
      if (error){
        callback(error);
        return;
      }
      var resolved = deptree.resolve();

      for (var i = 0, length = resolved.length; i < length; i++){
        if (files[resolved[i]]) {
          results.push(files[resolved[i]]);
        }
      }

      if (results.length){
        callback(null,results);
      }
      else {
        callback(new Error('No files could be found with given parameters'));
      }
    });
};