module.exports = function (grunt) {
    var http = require('http');
    var send = require('send');
    var url = require('url');
    var fs = require('fs');
    var localAssets = 'pictures';
    var localAssets2 = 'img';
    // Project configuratasdion.
    grunt.registerTask('prepareJSON', 'Preapring JSON', function() {
        var data = String(fs.readFileSync('app/templates/data/index.json'));
        var replaced = {
            local:data.replace(/@/gm,localAssets).replace(/~/gm,localAssets2)
        }
        for(var type in replaced){
            fs.writeFileSync("temp/index_"+type+".json",replaced[type]);
        }
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 9001,
                    listen: '192.168.0.15',
                    base: '',
                    debug: true,
                    middleware: function (connect, options) {
                        // Return array of whatever middlewares you want
                        return [
                            //connect.static(options.base),
                            function (req, res, next) {

                                function error(err) {
                                    res.statusCode = err.status || 500;
                                    res.end('Error: ' + err.message);
                                }

                                // your custom directory handling logic:
                                function redirect() {
                                    res.statusCode = 301;
                                    res.setHeader('Location', req.url + '/');
                                    res.end('Redirecting to ' + req.url + '/');
                                }

                                // transfer arbitrary files from within
                                // /www/example.com/public/*
                                var path = url.parse(req.url).pathname;

                                if (path.indexOf('bower_components') > -1) {
                                    console.log(path);
                                    var appPath = '';
                                } else {
                                    var appPath = '/app';
                                }

                                send(req, path)
                                    .root(__dirname + appPath)
                                    .on('error', error)
                                    .index('index.html')
                                    .hidden(true)
                                    .on('directory', redirect)
                                    .pipe(res);
                            }
                            ];
                    }
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'app/js/build/index.min.js':
                    [
                        'app/js/app/respond.js',
                        'app/js/vendor/modernizr.js',
                        'bower_components/picturefill/external/matchmedia.js',
                        'bower_components/picturefill/picturefill.js',
                        'app/js/app/helpers.js',
                        'app/js/app/app.js'
                    ]
                }
            }
        },
        watch: {
            templates: {
                files: ['app/templates/**/*.html', 'temp/**/*.json'],
                tasks: ['mustache_render']
            },
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['sass:dist']
            },
            css: {
                files: ['temp/app.css'],
                tasks: ['autoprefixer']
            },
            js: {
                files: ['app/js/app/**/*.js'],
                tasks: ['uglify']
            },
            json:{
               files: ['app/templates/**/*.json'],
               tasks: ['prepareJSON']
            }
        },

        mustache_render: {
            options: {
                directory: 'app/templates/partials',
                extension: '.html',
                prefix: '_'
            },
            all: {
                files: [
                    {
                        data: 'temp/index_local.json',
                        template: 'app/templates/_index.html',
                        dest: 'app/index.html'
                    }
          ]
            },
        },
        sass: {
            dist: {
                options: {
                    //outputStyle: 'compressed',
                    includePaths: [
                        'bower_components/foundation/scss/'
                    ]
                },
                files: {
                    'temp/app.css': 'scss/app.scss',
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 9', 'Safari 5']
            },
            multiple_files: {
                  expand: true,
                  flatten: true,
                  src: 'temp/**/*.css', // -> src/css/file1.css, src/css/file2.css
                  dest: 'app/css/' // -> dest/css/file1.css, dest/css/file2.css
            },

        },
        browser_sync: {
            files: {
                src: [
                    'app/index.html',
                    'app/js/**/*.js',
                    'app/css/app.css'
                ]
            },
            options: {
                host: 'localhost',
                reloadFileTypes: ['php', 'html', 'js', 'erb', 'svg'],
                injectFileTypes: ['css', 'png', 'jpg', 'svg', 'gif'],
                watchTask: true,
                debugInfo: true,
                ghostMode: {
                    scroll: true,
                    forms: true
                }

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mustache-render');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-ftp-deploy');

    grunt.event.on('watch', function (action, filepath, target) {
        grunt.config.set('myFile', filepath);
        grunt.config.set('_myFile', filepath.replace(/\\/g, '/'));
        console.log(filepath.replace(/\\/g, '/'))
    });

    // Default task(s).
    grunt.registerTask('default', ['connect', 'browser_sync', 'sass', 'watch']);

};
