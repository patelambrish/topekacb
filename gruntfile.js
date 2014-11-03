module.exports = function(grunt) {
    grunt.initConfig({
        sass: {
            dev: {
                options: {
                    style: 'compact',
                    compass: false,
                    precision: 8
                },
                files: {
                	'public/assets/css/site.css': 'public/assets/css/site.scss'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['sass:dev']);
}
