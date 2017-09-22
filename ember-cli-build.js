/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'hinting': false,
    'ember-bootstrap': {
      bootstrapVersion: 3,
      importBootstrapFont: true,
      importBootstrapCSS: false
    },
    'ember-cli-mocha': {
      useLintTree: false
    }
  });

  app.import('bower_components/jquery-ui/jquery-ui.min.js');

  return app.toTree();
};
