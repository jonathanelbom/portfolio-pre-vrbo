({
    baseUrl: './',
    //optimize: 'none', //uncomment this option if built source needs to be debugged
    paths: {
    	almond: '../vendor/almond/almond'
        /*
        jquery: '../vendor/jquery/jquery.min',
        underscore: '../vendor/underscore/underscore-min',
        backbone: '../vendor/backbone/backbone-min',
        bootstrap: '../vendor/bootstrap/js/bootstrap.min',
        text: '../vendor/requirejs-text/text',
        */
    },
    mainConfigFile: 'require-config.js',
    name: 'almond',
    include: ['main'],
    /*
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    },
    */
    out: 'portfolio.js'
})