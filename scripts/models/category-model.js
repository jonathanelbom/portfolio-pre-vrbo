/* global define, $, console */

define([
    'underscore',
    'backbone',
    'dispatcher',
    'collections/project-collection'
    /* ,
    'collections/dataNodes',
    'models/dataNode',
    'models/htmlNode',
    'models/choiceInteraction',
    'models/tableNode',
    'models/gapMatchInteraction',
    'models/imageNode',
    'models/voiceRecorderModel',
    'models/metaDataModel',
    'models/itemMetaData',
    'backboneDocumentModel'
    */

], function (_, Backbone, Dispatcher, ProjectCollection ) {
    'use strict';

    var CategoryModel = Backbone.Model.extend({
            defaults: {
                projectCollection: [],
                title: '',
                id: null,
                data: null,
                view: null
            },

            initialize: function () {
                //console.log('CategoryModel > initialize, data:',this.get('data') );
                var $data = $( this.get('data') );
                this.set( 'title', $data.children( 'text[id=title]').text() );
                var pc = new ProjectCollection();
                _.each( $data.find('project'), function( elem, idx, list ) {
                    pc.add( { data: elem } );
                });
                this.set( 'id', $data.attr('id') );
                this.set( 'projectCollection', pc );
            },

            addProject: function( elem, idx, list) {
            },

            setView: function (view) {
                this.set('view', view);
            },

            getView: function() {
                return this.get('view');
            }
        });

    return CategoryModel;
});