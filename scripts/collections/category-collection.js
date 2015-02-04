/*global define*/

define([
    'underscore',
    'backbone',
    'dispatcher',
    'models/category-model'
], function (_, Backbone, Dispatcher, CategoryModel) {
    'use strict';

    var CategoryCollection = Backbone.Collection.extend({
        model: CategoryModel,

        initialize: function() {
        }
    });


    return CategoryCollection;
});