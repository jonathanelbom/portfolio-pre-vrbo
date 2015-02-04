/* global define, $, console */

define([
    'underscore',
    'backbone',
    'dispatcher',
    'collections/category-collection',
    'models/category-model',
    'views/category-view',
    'models/header-model',
    'views/header-view'
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

], function (_, Backbone, Dispatcher, CategoryColletion, CategoryModel, CategoryView, HeaderModel, HeaderView ) {
    'use strict';

    var AppModel = Backbone.Model.extend({
            defaults: {
                categoryCollection: [],
                headerView: null
            },

            initialize: function () {
                Backbone.on( 'category:change', this.onCategoryChange, this );
            },

            loadData: function () {
                var that = this;
                $.ajax({
                    url: './portfolio.xml',
                    success: function (xml) {
                        //console.log('success, xml:',xml);
                        that.parseXml(xml);
                    },
                    //$.proxy(that.onItemLoaded, that),
                    error: function () {
                        console.log('error');
                    },
                    dataType: 'xml'
                });
            },

            parseXml: function (xml) {
                var cc = new CategoryColletion();
                $( xml ).find(' work > category').each( function() {
                    var categoryModel = new CategoryModel( {data: this} );
                    var categoryView = new CategoryView( {model: categoryModel} );
                    cc.add( categoryModel );   
                });
                this.set('categoryCollection', cc);
                this.build();
            },

            onCategoryChange: function(category) {
                this.renderCategory(category);                
            },

            renderCategory: function(category) {
                 var cc = this.get('categoryCollection');
                var cm;
                if (typeof category === 'undefined') {
                    cm = cc.first();
                }
                else {
                    cm = cc.findWhere( {id: category} );
                }

                $('#content').empty();
                $('#content').append( cm.getView().render().el );
                //$('#content').html( cm.getView().render().el );
            },

            build: function() {
                var that = this;
                var cc = this.get('categoryCollection');
                var headerModel = new HeaderModel( { categoryCollection: cc } );
                this.headerView = new HeaderView( { model: headerModel } )
                $('#header_bg').append( this.headerView.render().el );
                this.renderCategory();
            }
        });

    return AppModel;
});