/*global require*/
'use strict';

require.config({
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
    paths: {
        jquery: '../vendor/jquery/jquery.min',
        backbone: '../vendor/backbone/backbone-min',
        underscore: '../vendor/underscore/underscore-min',
        bootstrap: '../vendor/bootstrap/js/bootstrap.min',
        text: '../vendor/requirejs-text/text'
    }
});

require([
    'backbone',
    'jquery',
    'routes/app',
    'underscore',
    'bootstrap',
    'text'
], function (Backbone, JQuery, App, _) {
    window.Application = new App();
    Backbone.history.start();
}); 