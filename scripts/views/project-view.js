/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/project.html'
], function ($, _, Backbone, Template) {
    'use strict';

    var ProjectView = Backbone.View.extend({
        tagName: 'div',
        className: 'project row',
        //el: 'div',
        //template: DataUtils.devTemplate('gapMatchInteraction'),
        //template: _.template( Template ),
        template: _.template( $(Template).html() ),
        //template: _.template( $(Template).html() ),
        //tmpl: $('<div />').html( $(Template).html() ).text(),
        //tmpl:  $(Template).html(),
        //model:CategoryModel,
        
        events: {
            'click .asset-btn' : 'showImage'
            /*
            'click #headerNewItemBtn' : 'newItemClick',
            'click #editItemBtn' : 'editItemClick',
            'click #createItemBtn' : 'createItemClick',
            'click #createPassageBtn' : 'createPassageClick'
            */
        },
        
        initialize: function() {
            //console.log('CategoryView, intialize, this.model:', this.model );
            this.model.setView( this );
        },

        render: function() {
            //console.log('ProjectView > render, this.model',this.model)
            //var t = this.template( {model: this.model.toJSON()} );
            //return t;
            var that = this;
            this.$el.html( this.template( {model: this.model.toJSON()} ) );
            /*
            this.$el.find('.asset-btn').click( function(e) {
                that.showImage( e );
            });
*/
            this.selectButton( this.$el.find('.asset-btn').first() );
            this.delegateEvents();
            return this;
        },

        showImage: function( e ) {
            console.log('showImage, e:',e)
            var $button = $( e.currentTarget );
            this.$el.find( '.images > img' ).attr( 'src', $button.attr('data-asset') );
            this.selectButton( e.currentTarget )
        },

        selectButton: function( button ) {
            _.each( this.$el.find('.asset-btn'), function( btn ) {
                $( btn ).removeClass('selected');
                $( btn ).prop('disabled', false);
            });
            $( button ).addClass('selected');
            $( button ).prop('disabled', true);
        }
    });

    return ProjectView;
});