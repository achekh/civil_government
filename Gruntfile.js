'use strict';

var paths = {
    js: ['*.js', 'server/**/*.js', 'public/**/*.js', 'test/**/*.js', '!test/coverage/**', '!public/system/lib/**', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/**/public/lib/**'],
    html: ['public/**/views/**', 'server/views/**', 'packages/**/public/**/views/**', 'packages/**/server/views/**'],
    css: ['public/**/css/*.css', '!public/system/lib/**', 'packages/**/public/**/css/*.css', '!packages/**/public/lib/**']
};

module.exports = function(grunt) {

    if (process.env.NODE_ENV !== 'production') {
        require('time-grunt')(grunt);
    }

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('server/config/assets.json'),
        clean: ['public/build'],
        watch: {
            js: {
                files: paths.js,
//                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: paths.html,
                options: {
                    livereload: true
                }
            },
            css: {
                files: paths.css,
//                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: paths.js,
                options: {
                    jshintrc: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: '<%= assets.js %>'
//                files: [{
//                    expand: true,
//                    cwd: __dirname,
//                    src: [
//                        "public/system/lib/jquery/dist/jquery.min.js",
//                        "public/system/lib/angular/angular.js",
//                        "public/system/lib/angular-i18n/angular-locale_uk-ua.js",
//                        "public/system/lib/angular-mocks/angular-mocks.js",
//                        "public/system/lib/angular-cookies/angular-cookies.js",
//                        "public/system/lib/angular-resource/angular-resource.js",
//                        "public/system/lib/angular-ui-router/release/angular-ui-router.js",
//                        "public/system/lib/angular-bootstrap/ui-bootstrap.js",
//                        "public/system/lib/angular-bootstrap/ui-bootstrap-tpls.js",
//                        "public/system/lib/angular-xeditable/dist/js/xeditable.js",
//                        "public/system/lib/ng-file-upload/angular-file-upload.js",
//                        "public/system/lib/ng-file-upload/angular-file-upload-shim.js",
//                        "public/init.js",
//                        "public/*/*.js",
//                        "public/*/{controllers,routes,services}/*.js",
//                        "packages/*/public/*.js",
//                        "packages/*/public/*/*.js"
//                    ],
//                    dest: 'build/js'
//                }]
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: paths.css
        },
        cssmin: {
            combine: {
                files: '<%= assets.css %>'
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['public/**', 'node_modules/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    env: {
                        PORT: require('./server/config/config').port
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server.js'
            },
            src: ['test/mocha/**/*.js', 'packages/**/test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['clean','cssmin', 'uglify', 'concurrent']);
    } else {
        grunt.registerTask('default', ['clean','jshint', 'csslint', 'concurrent']);
    }

    //Db seed
    grunt.registerTask('db.seed', 'Seed database with sample data', function () {
        require(process.cwd() + '/server/config/seed')(this.async());
    });

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

    // For Heroku users only.
    // Docs: https://github.com/linnovate/mean/wiki/Deploying-on-Heroku
    grunt.registerTask('heroku:production', ['cssmin', 'uglify']);
};
