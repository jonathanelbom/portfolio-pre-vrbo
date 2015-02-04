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
        buildModel: null,
        buildCollection: null,
        buildView: null,

        routes: {
            'item': 'newItem',
            'item/:id': 'loadItem',
            'item/': 'newItem',
            'passage/:id': 'loadPassage',
            'passage/': 'loadPassage',
            'passage': 'loadPassage',
            'metadata': 'loadMetadata',
            'list':'listAssets',
            //'*actions': 'landing'
            '*actions': 'defaultItem',
            'postLogin': 'landing'
        },

        defaultItem: function () {
            this.appModel = new AppModel();
            this.appModel.loadData();
            //this.newItem('choice.json', '/data/');
        }
    });

    return AppRouter;
});
