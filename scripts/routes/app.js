/*global define*/

define([
    'jquery',
    'backbone',
    'underscore',
    'dispatcher',
    'models/app-model'
    
], function ($, Backbone, _, Dispatcher, AppModel) {
    'use strict';

    var AppRouter = Backbone.Router.extend({

        appModel: null,
        routes: {
            '*actions': 'start'
        },

        start: function () {
            this.appModel = new AppModel();
            this.appModel.loadData();
        }
    });

    return AppRouter;
});
