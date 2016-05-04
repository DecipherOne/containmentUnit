'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',

        // Task configuration.
        bower: {
            install: {
                options: {
                    cleanTargetDir:true,
                    copy: false,
                    targetDir: 'bower_components'
                }
            }
        },
        clean: {
            options: {
                force: true
            },
            files: ['../containmentUnit/public/scripts/*','css']
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    outputStyle: 'compact',
                    noLineComments: true ,
                    bundleExec:true
                }
            },
            localDev: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    outputStyle: 'expanded',
                    noLineComments: false
                }
            }
        },
        concat:{
            cuMain:{
                src:[
                    'bower_components/jquery/jquery.js',
                    'js/harStorageExisting/harviewer/require.js',
                    'js/harStorageExisting/LAB.min.js',
                    'js/harStorageExisting/datatables/jquery.dataTables.min.js',
                    'js/harStorageExisting/datatables/ColReorder.min.js',
                    'js/harStorageExisting/datatables/TableTools.min.js',
                    'js/harStorageExisting/harviewer/core/trace.js',
                    'js/harStorageExisting/harviewer/domplate/domplate.js',
                    'js/harStorageExisting/preferences.js',
                    'js/harStorageExisting/harviewer/harPreview.js',
                    'js/harStorageExisting/highcharts/highcharts.js',  
                    'js/harStorageExisting/highcharts/themes.js',
                    'js/harStorageExisting/highcharts/exporting.js',
                    'js/harStorageExisting/chosen.jquery.js',                    
                    'js/harStorageExisting/spin.js',
                    'js/harStorageExisting/harstorage.js',
                    'js/ectoControl.js',
                    'js/wraithControl.js',
                    'js/harStorageExisting/tabber.js',
                    'js/initTemplates.js'
                    
                ],
                dest:'../containmentUnit/public/scripts/containmentUnit.js',
                nonull: true
            }
        },
        cssmin: {
            options: {
                banner: '/* DO NOT COMMIT */',
                report: false /* change to 'gzip' to see gzipped sizes on local */
            },
            minify: {
                expand: true,
                cwd: 'css',
                src: ['containmentUnitCore.css'],
                dest: '../containmentUnit/public/styles/',
                ext: '.min.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                report: false /* change to 'gzip' to see gzipped sizes on local */
            },
            minify:{
                expand: true,
                cwd: '../containmentUnit/public/scripts/',
                src: ['**/*.js','!*.min.js'],
                dest: '../containmentUnit/public/scripts/',
                ext: '.min.js'
            }
        },
        watch: {
            sassy: {
                files: ['sass/**/*.scss'],
                tasks: ['compass:localDev'],
                options: {
                    spawn: false
                }
            },
            scripts:{
                files:['js/**/*.js','!js/bundled/*.js'],
                tasks:['concat'],
                options:{
                    spawn:false
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('local', ['compass:localDev','watch']);
    grunt.registerTask('localMavenBuild', ['compass:localDev','concat']);
    grunt.registerTask('localFirstTime', ['bower','compass:localDev','concat']);
    grunt.registerTask('default', ['bower','clean','compass:dist','cssmin','concat','uglify']);


};
