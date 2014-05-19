module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('aws-keys.json'),

    files: {
      libs: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/mustache/mustache.js'
      ],
      code: [ 'src/js/**/*.js' ],
      test: [ 'test/**/*.js' ]
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish'),

        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        maxcomplexity: 4,
        globals: {
          '$': true,
          'laziness': true,
          'Mustache': true
        }
      },
      script: {
        src: [ '<%= files.code %>' ]
      },
      test: {
        options: {
          expr: true,
          globals: {
            'describe': true,
            'xdescribe': true,
            'it': true,
            'xit': true,
            'before': true,
            'beforeEach': true,
            'after': true,
            'afterEach': true
          }
        },
        src: [ '<%= files.test %>' ]
      }
    },

    mocha: {
      unit: {
        options: {
          reporter: 'Spec',
          run: true
        },
        src: [ 'test/**/*.html' ]
      }
    },

    less: {
      development: {
        options: {
          compress: true,
          sourceMap: true
        },
        files: {
          'dist/main.min.css': 'src/less/main.less'
        }
      }
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\r'
      },
      dist: {
        src: [ '<%= files.libs %>', '<%= files.code %>' ],
        dest: 'dist/js/main.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= concat.options.banner %>',
        sourceMap: true,
        sourceMapName: 'dist/js/main.map'
      },
      target: {
        files: {
          'dist/js/main.min.js': [ 'dist/js/main.js' ]
        }
      }
    },

    clean: {
      html: [ 'dist/**/*.html' ],
      css: [ 'dist/**/*.css' ],
      js: [ 'dist/**/*.js' ]
    },

    copy: {
      html: {
        expand: true,
        cwd: 'src/',
        src: ['**/*.html'],
        dest: 'dist/',
        filter: 'isFile'
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dist'
        }
      }
    },

    watch: {
      html: {
        files: [ 'src/**/*.html' ],
        tasks: [ 'clean:html', 'copy:html' ]
      },
      less: {
        files: [ 'src/**/*.less' ],
        tasks: [ 'less' ]
      },
      script: {
        files: [ '<%= files.code %>' ],
        tasks: [ 'jshint:script', 'mocha', 'concat', 'uglify' ]
      },
      tests: {
        files: [ 'test/*.html', '<%= files.test %>' ],
        tasks: [ 'jshint:test', 'mocha' ]
      },
      connect: {
        files: [ 'dist/**/*.*' ],
        tasks: [ ],
        options: {
          livereload: true
        }
      }
    },

    focus: {
      dev: {
        exclude: ['connect']
      }
    },

    s3: {
      options: {
        key: '<%= aws.key %>', // Use the variables
        secret: '<%= aws.secret %>', // You can also use env variables
        region: 'eu-west-1',
        access: 'public-read',
        headers: {
          // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
          "Cache-Control": "max-age=630720000, public"
        },
        gzip: true,
        gzipExclude: [ '.jpg', '.png' ]
      },
      stage: {
        options: {
          bucket: 'laziness'
        },
        upload: [
          {
            src: 'dist/**/*',
            rel: 'dist',
            dest: '/'
          }
        ]
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-focus');
  grunt.loadNpmTasks('grunt-s3');

  grunt.registerTask('test', [ 'jshint', 'mocha' ]);
  grunt.registerTask('build', [ 'clean', 'less', 'concat', 'uglify', 'copy' ]);
  grunt.registerTask('server', [ 'connect', 'watch:connect' ]);
  grunt.registerTask('default', [ 'test', 'build', 'focus:dev' ]);
  grunt.registerTask('deploy', ['s3:stage']);
}