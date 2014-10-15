var _ = require('lodash');

module.exports = function generateModuleDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],

    $process: function(docs) {

      _.forEach(moduleDefs, function(moduleDef) {

        moduleDef.docType = 'ngModule';
        moduleDef.id = _.template('module:${name}')(moduleDef);
        docs.push(moduleDef);

        // Also create a doc for holding each type of component in the module
        _.forEach(moduleDef.registrations, function(registrations, componentType) {
          if ( registrations.length > 0 ) {
            var componentGroup = {
              docType: 'componentGroup',
              name: componentType,
              module: moduleDef,
              parent: moduleDef.id,
            };
            componentGroup.id = _.template('${module.id}.group:${name}')(componentGroup);
            docs.push(componentGroup);
          }
        });

      });

    }
  };
};