/*global define*/

define([
    'jquery',
    'backbone',
    'underscore'
], function ($, Backbone, _) {
    'use strict';
    var Dispatcher = _.extend({}, Backbone.Events);

    return Dispatcher;
});