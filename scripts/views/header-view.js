/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header.html',
    'models/header-model',
    'bootstrap'
], function ($, _, Backbone, Template, CategoryModel, Bootstrap) {
    'use strict';

    var HeaderView = Backbone.View.extend({
        
        //el: '#header',
        tagName: 'div',
        className: 'container',
        id: 'header',
        template: _.template( $(Template).html() ),

        events: {
            // 'click a' : 'tabClick'
        },
        
        initialize: function() {
            this.model.setView( this );
        },

        render: function() {
            var cc = this.model.toJSON().categoryCollection.models;
            this.$el.html( this.template( {cc: cc} ) );
            this.$el.find('li > a').tab();
            _.each( this.$el.find('li > a'), function( elem ) {
                $(elem).click( function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                    Backbone.trigger( 'category:change', $(this).attr('data-category') );
                });
            });
            return this;
        },

         tabClick: function( e ) {
            console.log('tabClick');
        }
    });

    return HeaderView;
});