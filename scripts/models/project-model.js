/* global define, $, console */

define([
    'underscore',
    'backbone',
    'dispatcher'
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

], function (_, Backbone, Dispatcher ) {
    'use strict';

    var ProjectModel = Backbone.Model.extend({
            defaults: {
                data: null,
                view: null,
                id: null,
                title: '',
                role: '',
                descr: '',
                assets: [],
                links: [],
                imgIdx: 0
            },

            imgPrefix: 'images',
            initialize: function () {
                 this.parseData();
            },

            parseData: function() {
                var that = this;
                var $data = $( this.get('data') );
                //console.log('this.get(data):',this.get('data'))
                var assets = [];
                _.each( $data.find('asset'), function(asset) {
                    var $asset = $( asset );
                    if ( $asset.attr('type') === 'image' ) {
                        assets.push( './' + that.imgPrefix + '/' + $asset.attr('uri') );
                    }
                });
                var links = [];
                _.each( $data.find('link'), function(link) {
                    var $link = $( link );
                    links.push( { 'url': $link.attr('url'),
                                  'text': $link.text() 
                    });
                });
                //console.log('assets:',assets);
                this.set({ 'id': $data.attr('id'),
                           'title': $data.find('text[id=title]').text(),
                           'role': $data.find('text[id=role]').text(),
                           'descr': $data.find('text[id=descr]').text(),
                           'assets': assets,
                           'links': links
                });
                //console.log('this.toJSON():',this.toJSON() );
            },

            setView: function (view) {
                this.set('view', view);
            },

            getView: function() {
                return this.get('view');
            }
        });

    return ProjectModel;
});