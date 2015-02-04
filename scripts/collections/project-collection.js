/*global define*/

define([
    'underscore',
    'backbone',
    'dispatcher',
    'models/project-model',
    'views/project-view'
], function (_, Backbone, Dispatcher, ProjectModel, ProjectView) {
    'use strict';

    var ProjectCollection = Backbone.Collection.extend({
        model: ProjectModel,

        initialize: function() {
            this.on( 'add', this.onAddModel );
        },

        onAddModel: function( model ) {
            var view = new ProjectView( {model: model} );
        }
    });

    return ProjectCollection;
});