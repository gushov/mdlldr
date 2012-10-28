/*global module:false */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/*.js']
    },
    buster: {
      test: {
        config: 'test/buster.js'
      },
      server: {
        port: 1111
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint buster'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        strict: false,
        eqnull: true,
        browser: true,
        node: true
      },
      globals: {}
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint buster');
  grunt.loadNpmTasks('grunt-buster');

};