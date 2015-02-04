/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/category.html',
    'models/category-model'
], function ($, _, Backbone, Template, CategoryModel) {
    'use strict';

    var CategoryView = Backbone.View.extend({
        tagName: 'div',
        className: 'category',
        //el: '#header',
        //template: _.template( $(Template).html() ),
        
        initialize: function() {
            this.model.setView( this );
        },

        render: function() {
            var that = this;
            var projectCollection = this.model.get('projectCollection');
            projectCollection.forEach( function(pm) {
                that.$el.append( pm.getView().render().el );               
            });
            return this;
        }
    });

    return CategoryView;
});