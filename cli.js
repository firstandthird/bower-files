#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    optimist = require('optimist'),
    version = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).version,
    bowerFiles = require('./index');

var argv = optimist
    .usage('bower-files '+version+'\nUsage: $0 [opts]')
    .alias('t','type')
    .describe('t', 'Type of the files you want to get')
    .default('t', '.js')
    .alias('i','include')
    .describe('i', 'The only libraries you want to include in your results. Comma separated list.')
    .alias('e','exclude')
    .describe('e', 'Libraries you want to exclude and their dependencies. Comma separated list.')
    .alias('h','help')
    .describe('h', 'Shows help info')
    .argv;

if (argv.help) {
  return optimist.showHelp(function(help) {
    console.log(help);
  });
}

var excludeList = argv.exclude ? argv.exclude.toLowerCase().split(',') : [],
    includeList = argv.include ? argv.include.toLowerCase().split(',') : [];

bowerFiles({
  type: argv.type,
  exclude: excludeList,
  include: includeList
}, function (err, data) {
  if (err){
    throw err;
  }
  else {
    console.log(data)
  }
});