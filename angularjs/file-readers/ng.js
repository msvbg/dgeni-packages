var _ = require('lodash');
var jsParser = require('esprima');

/**
 * @dgService ngFileReader
 * @description
 * This file reader will create a doc for each angular component
 * in each file pulling in documentation from jsdoc comments if
 * available
 */
module.exports = function ngFileReader(moduleExtractor, moduleDefs) {
  return {
    name: 'ngFileReader',
    defaultPattern: /\.js$/,
    getDocs: function(fileInfo) {

      fileInfo.ast = jsParser.parse(fileInfo.content, {
        loc: true,
        attachComment: true
      });

      var moduleInfo = moduleExtractor(fileInfo.ast);
      moduleInfo.fileInfo = fileInfo;

      _.forEach(moduleInfo, function(module) {
        if ( module.dependencies ) {
          // we have defined a new module
          moduleDefs[module.name] = module;
        } else {
          // we have reopened a module - find the definition
          var moduleDef = moduleDefs[module.name];
          if ( !moduleDef ) {
            throw new Error('Module definition missing');
          }
          // Add the new components to this module definition
          _.forEach(module.components, function(components, componentType) {
            _.forEach(components, function(component) {
              component.fileInfo = fileInfo;
              moduleDef.components[componentType].push(component);
            });
          });
        }
      });
    }
  };
};