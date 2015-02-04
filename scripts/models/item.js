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

    var ItemModel = Backbone.Model.extend({
            defaults: {
                dataNodesCollection: [],
                metaDataModel: {},
                itemMetaData:{},
                refid:'Yay'
            },

            initialize: function () {
                _.bind(this.onItemLoaded, this);
                _.bind(this.serializeItem, this);

                Dispatcher.on('itemModel:saveNeeded', $.proxy(this.serializeItem, this));

            },

            loadMetaData: function(){
                var that = this;
                $.ajax({
                    url: '/data/metaData.json',
                    success: $.proxy(that.onMetaDataLoaded, that),
                    error: function () {
                        console.log('THERE\'S AN ERROR HERE LOADING THE META DATA');
                    },
                    dataType: 'json'
                });
            },

            loadItem: function (id, api) {
                var that = this;
                if (typeof api === 'undefined') {
                    api = 'v0/read/json/';
                }
                if (id) {
                    $.ajax({
                        url: api + id,
                        success: $.proxy(that.onItemLoaded, that),
                        error: function () {
                            // TODO: notify user item not found
                            that.clearItem(); // do we want to do this here?
                        },
                        dataType: 'json'
                    });
                } else {
                    this.clearItem();
                }
            },

            clearItem: function () {
                var dnc = new DataNodesCollection();
                this.set({dataNodesCollection: dnc});
                Dispatcher.trigger('itemModel:itemLoadComplete');
            },

            onMetaDataLoaded: function (data) {
                var nodes = data.attribute;
                var mdn = new MetaDataNodeModel(nodes);
                this.set({metaDataModel: mdn});
                Dispatcher.trigger('itemModel:itemLoadComplete');
            },

            /******************
             * function: onItemLoaded
             * @param data - object containing Node for current Item
             * desc: creates dataNodeCollection and populates Item information
             */
            onItemLoaded: function (data) {
                this.updateItemBody(data);

                var metaNodes = data.attributes;
                var metaNodeModel = new ItemMetaData(metaNodes);
                this.set({itemMetaData: metaNodeModel});
                this.loadMetaData();
            },

            updateItemBody: function (data) {
                var nodes = data.qti.itemBody;
                var dnc = new DataNodesCollection();
                this.set({dataNodesCollection: dnc});

                function getResponseDeclaration(nodeObj) {
                    for (var key in nodeObj) {
                        if(nodeObj[key].responseIdentifier) {
                            for(var j = 0; j < data.qti.responseDeclaration.length; j++) {
                                if (data.qti.responseDeclaration[j].identifier === nodeObj[key].responseIdentifier) {
                                    //console.log('match' + JSON.stringify(data.qti.responseDeclaration[j]));
                                    return data.qti.responseDeclaration[j];
                                }
                            }
                        } else {
                            console.log('WARNING: item.getResponseDeclaration loading interaction with no responseIdentifier');
                        }
                    }
                }

                for (var i = 0; i < nodes.length; i++) {

                    var nodeModel;
                    /*
                     add-a-data-node 1: this block identifies loaded qti json by type.
                     Be sure to include the module in the require block at the top of the script!
                     This logic will be centralized into a dataNode factory
                     */
                    //console.log('nodes['+i+']:', nodes[i]);
                    if (nodes[i].html) {
                        nodeModel = this.setHTMLModel(nodes[i]);
                    } else if (nodes[i].choiceInteraction) {
                        nodeModel = new ChoiceInteractionModel({nodeObj: nodes[i], responseDeclaration: getResponseDeclaration(nodes[i])});
                        //console.log('choiceModel responseDecl' + JSON.stringify(nodeModel.get('responseDeclaration').toJSON()));
                        //} else if (nodes[i].table) {
                        //    nodeModel = new TableNodeModel({nodeObj: nodes[i]});
                    } else if (nodes[i].gapMatchInteraction) {
                        nodeModel = new GapMatchInteractionModel({nodeObj: nodes[i], responseDeclaration: getResponseDeclaration(nodes[i])});
                    } else if (nodes[i].customInteraction) {
                        nodeModel = this.setCustomInteractionModel(nodes[i]);
                    }

                    // console.log('onItemLoaded, nodeModel = ', nodeModel);
                    nodeModel.set('index', i);

                    dnc.add(nodeModel);
                }
            },

            setCustomInteractionModel: function (nodeObj) {
                //console.log('setCustomInteractionModel | nodeObj', nodeObj)
                var tempModel = null;
                var tempClass = nodeObj.customInteraction.class;
                //console.log('tempClass', tempClass);
                if (tempClass === 'voice-recorder') {
                    tempModel = new VoiceRecorderModel(nodeObj);
                }
                return tempModel;
            },

            setHTMLModel: function (nodeObj) {
                var tempModel = null;
                var tempXML = $.parseXML(nodeObj.html);
                //console.log('tempXML=',tempXML)

                var classType = $($(tempXML).find('div').get(0)).attr('class').split('-')[1];
                
                //console.log('classType', classType);
                switch(classType){
                case 'image':
                    tempModel = new ImageNodeModel(nodeObj);
                    break;
                case 'table':
                    //console.log('should be creating a table model here');
                    tempModel = new TableNodeModel(nodeObj);
                    break;
                case 'richtext':
                    tempModel = new HtmlNodeModel(nodeObj);
                    break;
                default:
                    tempModel = new HtmlNodeModel(nodeObj);
                }
                return tempModel;
            },


            /**
             * getItemQtiXml()
             *
             * Gets the QTI XML representation of the modules in the editor
             * The first parameter sent to the callback will be an error, if any
             * The second parameter will be the requested QTI XML
             *
             * @param callback
             */
            getItemQtiXml: function (callback) {
                var that = this;

                this.serializeItem(function (data) {
                    that.transformQtiJsonToXml(data, callback);
                });
            },

            /**
             * transformQtiJsonToXml()
             *
             * Calls the transform API for the supplied json
             * the first parameter sent to the callback will be an error, if any
             * the second parameter will be the requested xml string
             *
             * @param json
             * @param callback
             */
            transformQtiJsonToXml: function (json, callback) {

                $.ajax({
                    url: 'v1/transform',
                    type: 'POST',
                    data: {
                        transformtype: 'toxml',
                        data: json
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (!!data.error) {
                            callback(data.error);
                            return;
                        }
                        callback(undefined, data.data, textStatus, jqXHR);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        callback(errorThrown);
                    },
                    dataType: 'json'
                });
            },

            /**
             * transformQtiXmlToJson()
             *
             * Calls the transform API for the supplied xml string
             * the first parameter sent to the callback will be an error, if any
             * the second parameter will be the requested json
             *
             * @param xml
             * @param callback
             */
            transformQtiXmlToJson: function (xml, callback) {
                $.ajax({
                    url: 'v1/transform',
                    type: 'POST',
                    data: {
                        transformtype: 'tojson',
                        data: xml
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (!!data.error) {
                            callback(data.error);
                            return;
                        }
                        callback(undefined, data.data, textStatus, jqXHR);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        callback(errorThrown);
                    },
                    dataType: 'json'
                });
            },

            serializeItem: function (callback) {
                this.get('dataNodesCollection').sort();
                var data = {};
                var responseCount = 0;
                var that = this;


                $.getJSON('data/qtiSkeleton.json', function (data) {

                    if(that.get('dataNodesCollection').length){
                        that.get('dataNodesCollection').each(function (node) {

                            var nodeObj = node.getQTIJSONString();
                            if (!nodeObj) {
                                nodeObj = node.get('nodeObj').toJSON();
                            }
                            var respDecl = node.get('responseDeclaration').toJSON();

                            if (node.get('hasResponse')) {
                                var incId = 'RESPONSE';

                                if (responseCount > 0) {
                                    incId += (responseCount + 1);
                                }

                                respDecl.identifier = incId;
                                respDecl.baseType = 'identifier';

                                // This should only execute once, but this needs a more bulletproof logic.
                                for(var key in nodeObj) {
                                    if(nodeObj.hasOwnProperty(key)) {
                                        nodeObj[key].responseIdentifier = incId;
                                        break;
                                    }
                                }

                                data.qti.responseDeclaration.push(respDecl);
                            }

                            if (responseCount > 0) {
                                data.qti.responseProcessing = {};
                            } else {
                                data.qti.responseProcessing = node.get('responseProcessing');
                            }

                            data.qti.outcomeDeclaration = node.get('outcomeDeclaration');
                            responseCount++;
                            data.qti.itemBody.push(nodeObj);
                        });
                    }

                    var serialized = JSON.stringify(data);
                    console.log(serialized);
                    if (callback) {
                        callback(serialized);
                    }
                });
            }
        });

    return ItemModel;
});