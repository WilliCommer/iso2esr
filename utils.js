/* 
 * utils.js
 * 
 * collection of utility functions
 * 
 * 
 */


// requiere modules

const fs = require('fs');
const xml_parser = require('fast-xml-parser');


/*
 * get_value(object, path, [defaultValue])
 * Gets the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place.
 * 
 */
exports.get_value = require('lodash/get');


/*
 * loadXmlFileAsJson(filename)
 * 
 */

exports.loadXmlFileAsJson = function (filename) {
  
  var xml = fs.readFileSync(filename, 'utf8');
  return xml_parser.parse(xml);
  
};

