'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        project: {
            app: 'public/src',
            build: 'public/compiled',
            serverApp: 'server'
        },
        eslint: {
            app: ['Gruntfile.js', '<%= project.app %>/scripts/**/*.js', '<%= project.serverApp %>/**/*.js']
        },
        concat: {
            js: {
                files: {
                    '.tmp/concat/scripts/build.js': ['<%= project.app %>/scripts/**/*.js',
                        '<%= project.app %>/vendor/**/*.js']

                }
            },
            css: {
                files: {
                    '.tmp/concat/styles/build.css': ['<%= project.app %>/styles/**/*.css']
                }
            }
        },
        uglify: {
            js: {
                files: {
                    '.tmp/min/scripts/build.min.js': '.tmp/concat/scripts/build.js'
                }
            }
        },
        cssmin: {
            css: {
                files: {
                    '.tmp/min/styles/build.min.css': '.tmp/concat/styles/build.css'
                }
            }
        },
        copy: {
            img: {
                files: [
                    {expand: true, cwd: '<%= project.app %>', src: ['img/**'], dest: '<%= project.build %>'}
                ]
            },
            favicon: {
                files: {
                    '<%= project.build %>/favicon.ico': '<%= project.app %>/favicon.ico'
                }
            },
            js: {
                files: {
                    '<%= project.build %>/scripts/build.min.js': '.tmp/min/scripts/build.min.js'
                }
            },
            css: {
                files: {
                    '<%= project.build %>/styles/build.min.css': '.tmp/min/styles/build.min.css'
                }
            }
        },
        clean: {
            build: {
                src: ['.tmp', '<%= project.build %>']
            }
        },
        less: {
            build: {
                options: {
                    strictMath: true,
                    compress: false
                },
                files: [{
                    expand: true,
                    src: ['public/styles/**/*.less'],
                    ext: '.css',
                    extDot: 'first'
                }]
            }
        },
        babel: {
            build: {
                options: {
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    src: ['<%= project.serverApp %>/**/*.es6'],
                    ext: '.js',
                    extDot: 'first'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask('build', ['babel', 'eslint', 'clean', 'less', 'concat', 'uglify', 'cssmin', 'copy']);
};
