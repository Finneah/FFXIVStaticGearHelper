"use strict";
/* eslint-disable no-labels */
module.exports = function (grunt) {
    pkg: grunt.file.readJSON('package.json'),
        grunt.initConfig({
            jsdoc: {
                dist: {
                    src: [
                        // './src/commands/**/*',
                        './src/database/actions/bestInSlot/deleteBis.ts'
                        // './src/handler/*',
                        // './src/listeners/*',
                        // './src/types/*',
                        // './src/utils/*',
                        // './main.ts'
                    ],
                    dest: './doc',
                    options: {
                        configure: './jsdoc.json'
                    }
                }
            }
        });
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.registerTask('default', ['jsdoc']);
};
