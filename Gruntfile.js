'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        /*jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },*/

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        testing: {
            url: 'http://www.example.com/',
            width: 640,
            height: 480
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'testing']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['test']);
};
