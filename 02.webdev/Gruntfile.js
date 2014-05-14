module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      options: {
        reporter: require('jshint-stylish'),

        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        maxComplexity: 4
      },
      all: [ 'src/js/**/*.js' ]
    },

    mocha: {

    },

    less: {

    },

    concat: {

    },

    uglify: {

    },

    clean: {
      html: [ 'dest/**/*.html' ]
    },

    copy: {
      html: {
        expand: true,
        cwd: 'src/',
        src: ['**/*.html'],
        dest: 'dest/',
        filter: 'isFile'
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dest'
        }
      }
    },

    watch: {
      html: {
        files: [ 'src/**/*.*' ],
        tasks: [ 'clean:html', 'copy:html' ]
      },
      less: {
        files: [ 'src/**/*.*' ],
        tasks: [ 'less', 'clean:css', 'copy:css' ]
      },
      script: {
        files: [ 'src/**/*.*' ],
        tasks: [ 'jshint:script', 'mocha', 'concat', 'uglify', 'clean:js', 'copy:js' ]
      },
      test: {
        files: [ 'test/*.html', 'test/unit/**/*.js' ],
        tasks: [ 'jshint:test', 'mocha' ]
      },
      connect: {
        files: [ 'dest/**/*.*' ],
        tasks: [ ],
        options: {
          livereload: true
        }
      }
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

  grunt.registerTask('build', ['copy:html']);
  grunt.registerTask('server', ['connect', 'watch:connect']);
  grunt.registerTask('default', []);
}