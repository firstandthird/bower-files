'use strict';

/**
 * Function which will allow objects to be extended
 */
Object.defineProperty(Object.prototype, "extend", {
	enumerable: false,
	value: function(from) {
		var props = Object.getOwnPropertyNames(from);
		var dest = this;
		props.forEach(function(name) {
			if (name in dest) {
				var destination = Object.getOwnPropertyDescriptor(from, name);
				Object.defineProperty(dest, name, destination);
			}
		});
		return this;
	}
});

var bower = require('bower'),
		DepTree = require('deptree'),
		fs = require('fs'),
		path = require('path'),
		defaultOpts = {
			type : '.js',
			include: [],
			map: [],
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

			if(relPath.indexOf(options.type) > -1 && fs.existsSync(relPath)){
				dependencies.tree.add(name, Object.keys(obj.dependencies));
				dependencies.files[name] = relPath;
			}
		}
		for (var dependency in obj.dependencies){
			if (obj.dependencies.hasOwnProperty(dependency)){
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
			userOptions = defaultOpts.extend(options || {});

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
						return;
					}
					if(userOptions.include.length && userOptions.exclude.indexOf(dep) !== -1){
						return;
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
				callback(error,null);
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
				callback(new Error('No files could be found with given parameters'), null);
			}
		});
};