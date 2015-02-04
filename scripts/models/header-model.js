/* global define, $, console */

define([
    'underscore',
    'backbone',
    'dispatcher',
    'collections/category-collection'
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

    var HeaderModel = Backbone.Model.extend({
            defaults: {
                categoryCollection: null
            },

            initialize: function () {
            },

            setView: function (view) {
                this.set('view', view);
            },

            getView: function() {
                return this.get('view');
            }
        });

    return HeaderModel;
});