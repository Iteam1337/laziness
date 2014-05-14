module.exports = function(grunt) {
  grunt.initConfig({

    clean: [ 'dest' ],

    copy: {
      target: {
        expand: true,
        cwd: 'src/',
        src: ['**'],
        dest: 'dest/',
        filter: 'isFile'
      }
    },

    watch: {
      stuff: {
        files: [ 'src/**/*.*' ],
        tasks: [ 'clean', 'copy' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //grunt.registerTask('default', []);
}