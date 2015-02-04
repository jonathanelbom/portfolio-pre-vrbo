/* global define */

define([
    'jquery',
    'underscore'

], function ($, _) {

    'use strict';

    var dataUtils = {};

    dataUtils.devTemplate = function (file, templateJs) {
        var temp = null;
        $.ajax({
            url: 'scripts/templates/' + file + '.ejs',
            dataType: 'text',
            async: false
        }).done(function (ejs) {
            temp = _.template(ejs);
        }).fail(function () {
            temp = function () { return templateJs ? templateJs[file] : 'error'; };
        });
        return temp;
    };

    return dataUtils;
});


