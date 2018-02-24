"use strict"

module.exports = function(grunt) {
    var sourceDir = "src";
    var outDir = "www";

    // Grunt test doesn't build the app, so in that case we need to read the most recent version
    var cachebustedRelativeDir;
    var cachebustFileName = 'cachebustVersion.txt'
    if(grunt.cli.tasks && (grunt.cli.tasks[0] == 'test' || grunt.cli.tasks[0] == 'watch')){
        try {
            // This version file gets created by the createVersion task immediately after dev and production run "clean"
            cachebustedRelativeDir = grunt.file.read(cachebustFileName);
        }
        catch(e){
            throw new Error('cachebustVersion.txt not found. You must run "dev" at least once before running "test"')
        }
    }
    else {
        cachebustedRelativeDir = "v" + new Date().getTime();
        grunt.file.write(cachebustFileName, cachebustedRelativeDir);
    }

    var cachebustedDir = outDir + '/' + cachebustedRelativeDir;

    var devLibFiles = [
        '/lib/jquery-3.1.0.min.js',
        '/lib/lodash.min.js',
        '/lib/gl-matrix-min.js',
        '/lib/angular.js',
        '/lib/angular-route.js',
        '/lib/pixi.min.js'
    ];

    var devTemplateData = {
        task: 'dev',
        cachebustedRelativeDir: cachebustedRelativeDir,
        getVersionedPath: function(unversionedPath) {
            // console.log("checking path: ", cachebustedDir + unversionedPath)

            var versionedPath = grunt.file.expand(cachebustedDir + unversionedPath)[0];
            if (versionedPath) versionedPath = versionedPath.replace(outDir + '/', '');
            else {
                // console.log("didn't find file, checking path: ", sourceDir + unversionedPath)
                // If it's a lib file, it'll still be in source because we don't copy them until after templating
                var versionedPath = grunt.file.expand(sourceDir + unversionedPath)[0];
                if (versionedPath) versionedPath = cachebustedRelativeDir + versionedPath.replace(sourceDir, '');
                else throw new Error('File not found at path: ' + unversionedPath);
            }

            return versionedPath;
        },
        libFilesRelativePaths: devLibFiles
    };

    grunt.initConfig({
        clean: {
            app: [outDir + '/**/*'],
        },
        copy: {
            html: {
                files: [
                    {expand: true, cwd: sourceDir, src: 'app/**/*.html', dest: cachebustedDir}
                ]
            },
            img: {
                files: [
                    {expand: true, cwd: sourceDir, src: 'img/**', dest: cachebustedDir}
                ]
            },
            index: {
                files: [
                    {expand: true, cwd: sourceDir, src: 'index.html', dest: outDir}
                ]
            },
            lib: {
                files: [
                    {expand: true, cwd: sourceDir, src: 'lib/**', dest: cachebustedDir},
                    {expand: true, cwd: sourceDir, src: 'res/**', dest: outDir}
                ]
            },
            // Sourcemapping stuff
            ts: {
                files: [{
                    expand: true, cwd: sourceDir, src: '**/*.ts', dest: cachebustedDir}]
            }
        },
        karma: {
            dev: {
                options: {
                    configFile: 'karma.conf.js',
                    files: devLibFiles.map(function(file){
                            return sourceDir + file;
                        }).concat([
                            sourceDir + '/lib/angular-mocks.js',
                            cachebustedDir + '/sudoku.js',
                            sourceDir + '/tests/**/*.js',
                        ]),
                    singleRun: true
                }
            }
        },
        less: {
            options: {
                strictMath: true,
                strictUnits: true
            },
            dev: {
                files: [{
                    src: sourceDir + '/**/*.less',
                    dest: cachebustedDir + '/sudoku.min.css'
                }]
            },
            prod: {
                options: {
                    compress: true
                },
                files: [{
                    src: sourceDir + '/**/*.less',
                    dest: cachebustedDir + '/sudoku.min.css'
                }]
            }
        },
        template: {
            dev: {
                options: {
                    data: devTemplateData
                },
                files: [{expand: true, src: outDir + '/**/*.*'}]
            }
        },
        ts: {
            main: {
                src: [
                    sourceDir + '/**/*.ts',
                    '!' + sourceDir + '/app/main.ts',
                    sourceDir + '/app/main.ts',
                ],
                dest: cachebustedDir + '/sudoku.js',
                options: {
                    // compiler: './node_modules/typescript/bin/tsc',
                    sourceMap: true,
                    sourceRoot: '/' + cachebustedRelativeDir + '/app'
                }
            }
        },
        watch: {
            app: {
                files: [sourceDir + '/**/*.*'],
                tasks: [
                    'dev'
                    // 'test'
                ],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            // test: {
            //     files: [sourceDir + '/tests/**/*.*'],
            //     tasks: [
            //         'test'
            //     ],
            //     options: {
            //         interrupt: true,
            //         livereload: true
            //     }
            // }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-ts');


    grunt.registerTask('dev', [
        'clean:app',
        'copy:index',
        'copy:html',
        'less:dev',
        'ts:main',
        'template:dev',
        'copy:lib',
        'copy:img',
        'copy:ts',
    ]);
    grunt.registerTask('default', 'dev');

    grunt.registerTask('test', 'karma:dev');

    grunt.registerTask('prod', [
        ''
    ]);

};