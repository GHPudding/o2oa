MWF.xApplication.query = MWF.xApplication.query || {};
MWF.xApplication.query.StatementDesigner = MWF.xApplication.query.StatementDesigner || {};
MWF.xApplication.query.StatementDesigner.widget = MWF.xApplication.query.StatementDesigner.widget || {};

MWF.xApplication.query.StatementDesigner.widget.ViewFilter = new Class({
    Implements: [Options, Events],
    Extends: MWF.widget.Common,
    options: {
        "style": "default",
        "type": "identity",
        "names": []
    },
    initialize: function (node, app, filtrData, options) {
        this.setOptions(options);
        this.node = $(node);
        this.app = app;
        this.filtrData = filtrData;

        this.path = "../x_component_query_StatementDesigner/widget/$ViewFilter/";
        this.cssPath = "../x_component_query_StatementDesigner/widget/$ViewFilter/" + this.options.style + "/css.wcss";
        this._loadCss();

        this.items = [];
        this.load();

    },
    load: function (data) {
        this.getInputNodes();
        this.createActionNode();
        //this.createAddNode();
        //this.loadIdentitys();
        this.loadData();
    },
    loadData: function () {
        if (this.filtrData.filtrData && this.filtrData.filtrData.length) {
            this.filtrData.filtrData.each(function (data) {
                this.items.push(new MWF.xApplication.query.StatementDesigner.widget.ViewFilter.Item(this, data));
            }.bind(this));
        }

        if (this.filtrData.customData && this.filtrData.customData.length) {
            this.filtrData.customData.each(function (data) {
                data.type = "custom";
                this.items.push(new MWF.xApplication.query.StatementDesigner.widget.ViewFilter.ItemCustom(this, data));
            }.bind(this));
        }
    },
    createScriptArea: function (node) {
        this.scriptValueArea = node;
        var title = node.get("title");

        MWF.require("MWF.widget.ScriptArea", function () {
            this.scriptArea = new MWF.widget.ScriptArea(node, {
                "title": title,
                "maxObj": this.app.formContentNode || this.app.pageContentNode,
                "onChange": function () {
                    this.scriptData = this.scriptArea.toJson();
                }.bind(this),
                "onSave": function () {
                    //this.app.saveForm();
                }.bind(this),
                "style": "formula"
            });
            var v = (this.scriptData) ? this.scriptData.code : "";
            this.scriptArea.load(v);
        }.bind(this));
    },
    createFilterValueScriptArea: function (node) {
        var title = node.get("title");

        MWF.require("MWF.widget.ScriptArea", function () {
            this.filterValueScriptArea = new MWF.widget.ScriptArea(node, {
                "title": title,
                "isload": true,
                "isbind": false,
                "maxObj": this.app.formContentNode || this.app.pageContentNode,
                "onChange": function () {
                    this.filterValueScriptData = this.filterValueScriptArea.toJson();
                }.bind(this),
                "onSave": function () {
                    //this.app.saveForm();
                }.bind(this),
                "style": "formula"
            });
            var v = (this.filterValueScriptData) ? this.filterValueScriptData.code : "";
            this.filterValueScriptArea.load(v);
        }.bind(this));
    },
    createCustomFilterValueScriptArea: function (node) {
        var title = node.get("title");

        MWF.require("MWF.widget.ScriptArea", function () {
            this.customFilterValueScriptArea = new MWF.widget.ScriptArea(node, {
                "title": title,
                "isload": true,
                "isbind": false,
                "maxObj": this.app.formContentNode || this.app.pageContentNode,
                "onChange": function () {
                    this.customFilterValueScriptData = this.customFilterValueScriptArea.toJson();
                }.bind(this),
                "onSave": function () {
                    //this.app.saveForm();
                }.bind(this),
                "style": "formula"
            });
            var v = (this.customFilterValueScriptData) ? this.customFilterValueScriptData.code : "";
            this.customFilterValueScriptArea.load(v);
        }.bind(this));
    },
    getInputNodes: function () {
        debugger;
        this.inputAreaNode = this.node.getElement(".inputAreaNode_vf");
        this.actionAreaNode = this.node.getElement(".actionAreaNode_vf");
        this.actionAreaNode.setStyles(this.css.actionAreaNode);
        this.listAreaNode = this.node.getElement(".listAreaNode_vf");
        this.fieldListAreaNode = this.node.getElement(".fieldListAreaNode_vf");

        this.restrictViewFilterTable = this.node.getElement(".restrictViewFilterTable_vf");

        var scriptValueArea = this.node.getElement(".MWFFilterFormulaArea");
        if (scriptValueArea) {
            this.createScriptArea(scriptValueArea);
        }

        this.titleInput = this.inputAreaNode.getElement(".titleInput_vf");
        this.pathInput = this.inputAreaNode.getElement(".pathInput_vf");
        this.parameterInput = this.inputAreaNode.getElement(".parameterInput_vf");
        this.datatypeInput = this.inputAreaNode.getElement(".datatypeInput_vf");

        this.restrictFilterInput = this.inputAreaNode.getElement(".restrictFilterInput_vf");
        this.customFilterInput = this.inputAreaNode.getElement(".customFilterInput_vf");

        // this.logicInput = this.inputAreaNode.getElement(".logicInput_vf");

        // this.comparisonInput = this.inputAreaNode.getElement(".comparisonInput_vf");
        // this.comparisonInput.addEvent("change", function(){
        //     this.switchInputDisplay();
        // }.bind(this))

        this.valueTextInput = this.inputAreaNode.getElement(".valueTextInput_vf");
        this.valueNumberInput = this.inputAreaNode.getElement(".valueNumberInput_vf");
        this.valueDatetimeInput = this.inputAreaNode.getElement(".valueDatetimeInput_vf");
        this.valueBooleanInput = this.inputAreaNode.getElement(".valueBooleanInput_vf");
        this.valueDateInput = this.inputAreaNode.getElement(".valueDateInput_vf");
        this.valueTimeInput = this.inputAreaNode.getElement(".valueTimeInput_vf");

        if (this.app.statement.view) {
            var dataId = this.app.statement.view.data.id;

            this.filterValueType = this.inputAreaNode.getElements("[name='" + dataId + "viewFilterValueType']");
            this.filterValueScriptDiv = this.inputAreaNode.getElement("#" + dataId + "viewFilterValueScriptDiv");
            this.filterValueScript = this.inputAreaNode.getElement("[name='" + dataId + "viewFilterValueScript']");
            if (this.filterValueScript) {
                this.createFilterValueScriptArea(this.filterValueScript);
            }

            this.customFilterValueTypes = this.inputAreaNode.getElements("[name='" + dataId + "viewCustomFilterValueType']");
            this.customFilterValueScriptDiv = this.inputAreaNode.getElement("#" + dataId + "viewCustomFilterValueScriptDiv");
            this.customFilterValueScript = this.inputAreaNode.getElement("[name='" + dataId + "viewCustomFilterValueScript']");
            if (this.customFilterValueScript) {
                this.createCustomFilterValueScriptArea(this.customFilterValueScript);
            }
        }

        MWF.require("MWF.widget.Calendar", function () {
            this.calendar = new MWF.widget.Calendar(this.valueDatetimeInput, {
                "style": "xform",
                "isTime": true,
                "secondEnable": true,
                "target": this.app.content,
                "format": "db",
                "onComplate": function () {
                    this.node.getElement("#" + id + "viewFilterDateFormulaSelector").getElements("input").set("checked", false);
                }.bind(this)
            });
            new MWF.widget.Calendar(this.valueDateInput, {
                "style": "xform",
                "isTime": false,
                "target": this.app.content,
                "format": "%Y-%m-%d"
            });
            new MWF.widget.Calendar(this.valueTimeInput, {
                "style": "xform",
                "timeOnly": true,
                "secondEnable": true,
                "target": this.app.content,
                "format": "%H:%M:%S"
            });
        }.bind(this));

        this.datatypeInput.addEvent("change", function () {
            this.switchInputDisplay();
        }.bind(this));

        this.valueTextInput.addEvent("keydown", function (e) {
            if (e.code == 13) this.modifyOrAddFilterItem();
        }.bind(this));
        this.valueNumberInput.addEvent("keydown", function (e) {
            if (e.code == 13) this.modifyOrAddFilterItem();
        }.bind(this));

        //if (this.app.statement.view){
        //    var id = this.app.view.data.id;
        //     var div = this.node.getElement("#"+id+"viewFilterValueArea2");
        //     // inputs = div.getElements("input");
        //     if( div ){
        //this.valueTextInput2 = div.getElement(".valueTextInput2_vf") || null;
        //this.valueNumberInput2 = div.getElement(".valueNumberInput2_vf") || null;
        //this.valueDatetimeInput2 = div.getElement(".valueDatetimeInput2_vf") || null;
        //this.valueDateInput2 = div.getElement(".valueDateInput2_vf") || null;
        //this.valueTimeInput2 = div.getElement(".valueTimeInput2_vf") || null;
        //this.valueBooleanInput2 = div.getElement(".valueBooleanInput2_vf") || null;
        //
        //MWF.require("MWF.widget.Calendar", function(){
        //    this.calendar = new MWF.widget.Calendar(this.valueDatetimeInput2, {
        //        "style": "xform",
        //        "isTime": true,
        //        "secondEnable": true,
        //        "target": this.app.content,
        //        "format": "db",
        //        "onComplate": function(){
        //            this.node.getElement("#"+id+"viewFilterDateFormulaSelector2").getElements("input").set("checked", false);
        //        }.bind(this)
        //    });
        //    new MWF.widget.Calendar(this.valueDateInput2, {
        //        "style": "xform",
        //        "isTime": false,
        //        "target": this.app.content,
        //        "format": "%Y-%m-%d"
        //    });
        //    new MWF.widget.Calendar(this.valueTimeInput2, {
        //        "style": "xform",
        //        "timeOnly": true,
        //        "secondEnable": true,
        //        "target": this.app.content,
        //        "format": "%H:%M:%S"
        //    });
        //}.bind(this));
        //
        //this.valueTextInput2.addEvent("keydown", function(e){
        //    if (e.code==13) this.modifyOrAddFilterItem();
        //}.bind(this));
        //this.valueNumberInput2.addEvent("keydown", function(e){
        //    if (e.code==13) this.modifyOrAddFilterItem();
        //}.bind(this));
        //     }
        // }
    },
    switchInputDisplay: function () {
        var id = "";
        if (this.app.statement.view) {
            id = this.app.statement.view.data.id;
        }

        var config = {
            "textValue": {
                "selectorArea" : "#" + id + "viewFilterTextFormulaSelector",
                "input" : this.valueTextInput
            },
            "datetimeValue" : {
                "selectorArea" : "#" + id + "viewFilterDateFormulaSelector",
                "input" : this.valueDatetimeInput
            },
            "dateTimeValue": {
                "selectorArea" : "#" + id + "viewFilterDateFormulaSelector",
                "input" : this.valueDatetimeInput
            },
            "dateValue": {
                "selectorArea" : "#" + id + "viewFilterDateOnlyFormulaSelector",
                "input" : this.valueDateInput
            },
            "timeValue": {
                "selectorArea" : "#" + id + "viewFilterTimeOnlyFormulaSelector",
                "input" : this.valueTimeInput
            },
            "numberValue": {
                "input" : this.valueNumberInput
            },
            "booleanValue": {
                "input" : this.valueBooleanInput
            }
        };

        debugger;

        var formulaSelectorIdList = [
            "#" + id + "viewFilterTextFormulaSelector",
            "#" + id + "viewFilterDateFormulaSelector",
            "#" + id + "viewFilterDateOnlyFormulaSelector",
            "#" + id + "viewFilterTimeOnlyFormulaSelector"
        ];

        var inputList = [
            this.valueTextInput,
            this.valueDatetimeInput,
            this.valueDateInput,
            this.valueTimeInput,
            this.valueNumberInput,
            this.valueBooleanInput
        ];
        formulaSelectorIdList.each( function(id) {
            var el = this.inputAreaNode.getElement( id );
            if( !el )return;
            el.setStyle("display", "none");
        }.bind(this));
        inputList.each( function(el){
            el.setStyle("display", "none");
        }.bind(this));
        var formatType = this.datatypeInput.options[this.datatypeInput.selectedIndex].value;
        var obj = config[formatType];
        if( obj ){
            if(obj.selectorArea){
                var el = this.inputAreaNode.getElement( obj.selectorArea );
                if( el )el.setStyle("display", "block");
            }
            if( obj.input )obj.input.setStyle("display", "block");
        }
    },
    createActionNode: function () {
        this.actionNode = new Element("div", {"styles": this.css.actionNode}).inject(this.actionAreaNode);
        this.actionNode.addEvent("click", function () {
            this.modifyOrAddFilterItem();
        }.bind(this));
    },
    modifyOrAddFilterItem: function () {
        debugger;
        var flag;
        if (this.currentFilterItem) {
            flag = this.modifyFilterItem();
        } else {
            if (this.restrictFilterInput.checked) {
                flag = this.addFilterItem();
            } else {
                flag = this.addCustomFilterItem();
            }
        }
        if( flag ){
            this.setData({
                "logic": "and",
                "path": "",
                "parameter" : "",
                "title": "",
                "type": this.restrictFilterInput.checked ? "restrict" : "custom",
                "comparison": "equals",
                "formatType": "textValue",
                "value": "",
                "otherValue": "",
                "code": ""
            });
        }
    },
    modifyFilterItem: function () {
        var data = this.getInputData();
        if( this.restrictFilterInput.checked ){
            if (this.verificationData(data)) {
                this.currentFilterItem.reload(data);
                this.currentFilterItem.unSelected();
                this.fireEvent("change");
                return true;
            }
        }else{
            if (this.verificationDataCustom(data)) {
                this.currentFilterItem.reload(data);
                this.currentFilterItem.unSelected();
                this.fireEvent("change");
                return true;
            }
        }
        return false;
    },
    addFilterItem: function () {
        var data = this.getInputData();
        if (this.verificationData(data)) {
            this.items.push(new MWF.xApplication.query.StatementDesigner.widget.ViewFilter.Item(this, data));
            this.fireEvent("change");
            return true;
        }
        return false;
    },
    addCustomFilterItem: function () {
        var data = this.getInputData();
        if (this.verificationDataCustom(data)) {
            this.items.push(new MWF.xApplication.query.StatementDesigner.widget.ViewFilter.ItemCustom(this, data));
            this.fireEvent("change");
            return true;
        }
        return false;
    },
    verificationData: function (data) {
        if (!data.parameter) {
            this.verificationNode = new Element("div", {"styles": this.css.verificationNode}).inject(this.inputAreaNode);
            new Element("div", {
                "styles": this.css.verificationTextNode,
                "text": this.app.lp.mastInputParameter
            }).inject(this.verificationNode);
            this.parameterInput.focus();
            this.parameterInput.setStyle("background-color", "#fbe8e8");

            this.parameterInput.addEvents({
                "keydown": function () {
                    if (this.verificationNode) {
                        this.verificationNode.destroy();
                        this.verificationNode = null;
                        this.parameterInput.setStyle("background-color", "#FFF");
                    }
                }.bind(this),
                "click": function () {
                    if (this.verificationNode) {
                        this.verificationNode.destroy();
                        this.verificationNode = null;
                    }
                }.bind(this)
            });
            return false;
        }
        // if (data.comparison=="range" && !data.otherValue){
        //     this.verificationNode = new Element("div", {"styles": this.css.verificationNode}).inject(this.inputAreaNode);
        //     new Element("div", {"styles": this.css.verificationTextNode, "text": this.app.lp.mastInputPath}).inject(this.verificationNode);
        // }
        return true;
    },
    verificationDataCustom: function (data) {
        if (!data.title) {
            this.verificationNode = new Element("div", {"styles": this.css.verificationNode}).inject(this.inputAreaNode);
            new Element("div", {
                "styles": this.css.verificationTextNode,
                "text": this.app.lp.mastInputTitle
            }).inject(this.verificationNode);
            this.titleInput.focus();
            this.titleInput.setStyle("background-color", "#fbe8e8");

            this.titleInput.addEvents({
                "keydown": function () {
                    if (this.verificationNode) {
                        this.verificationNode.destroy();
                        this.verificationNode = null;
                        this.titleInput.setStyle("background-color", "#FFF");
                    }
                }.bind(this),
                "click": function () {
                    if (this.verificationNode) {
                        this.verificationNode.destroy();
                        this.verificationNode = null;
                    }
                }.bind(this)
            });
            return false;
        }
        if (!data.path || data.path.indexOf(".")<1 ) {
            this.verificationNode = new Element("div", {"styles": this.css.verificationNode}).inject(this.inputAreaNode);
            var text = !data.path ? this.app.lp.mastInputPath : this.app.lp.pathExecption;
            new Element("div", {
                "styles": this.css.verificationTextNode,
                "text": text
            }).inject(this.verificationNode);
            this.pathInput.focus();
            this.pathInput.setStyle("background-color", "#fbe8e8");

            this.pathInput.addEvents({
                "keydown": function () {
                    if (this.verificationNode) {
                        this.verificationNode.destroy();
                        this.verificationNode = null;
                        this.pathInput.setStyle("background-color", "#FFF");
                    }
                }.bind(this),
                "click": function () {
                    if (this.verificationNode) {
                        this.verificationNode.destroy();
                        this.verificationNode = null;
                    }
                }.bind(this)
            });
            return false;
        }
        return true;
    },
    getInputData: function () {
        // var logic = this.logicInput.options[this.logicInput.selectedIndex].value;
        var path = this.pathInput.get("value");
        var parameter = this.parameterInput.get("value");

        var title = this.titleInput.get("value");
        if (this.restrictFilterInput.checked) var type = "restrict";
        if (this.customFilterInput.checked) var type = "custom";

        // var comparison = this.comparisonInput.options[this.comparisonInput.selectedIndex].value;
        var comparison = "";
        var formatType = this.datatypeInput.options[this.datatypeInput.selectedIndex].value;
        var value = "";
        var value2 = "";
        switch (formatType) {
            case "textValue":
                value = this.valueTextInput.get("value") || "";
                //value2 = (this.valueTextInput2) ? (this.valueTextInput2.get("value") || "") : "";
                break;
            case "numberValue":
                value = this.valueNumberInput.get("value").toFloat();
                //value2 = (this.valueNumberInput2) ? this.valueNumberInput2.get("value").toFloat() : "";
                break;
            case "datetimeValue":
            case "dateTimeValue":
                value = this.valueDatetimeInput.get("value") || "";
                //value2 = (this.valueDatetimeInput2) ? (this.valueDatetimeInput2.get("value") || "") : "";
                break;
            case "dateValue":
                value = this.valueDateInput.get("value") || "";
                //value2 = (this.valueDateInput2) ? (this.valueDateInput2.get("value") || "") : "";
                break;
            case "timeValue":
                value = this.valueTimeInput.get("value") || "";
                //value2 = (this.valueTimeInput2) ? (this.valueTimeInput2.get("value") || "") : "";
                break;

            case "booleanValue":
                value = this.valueBooleanInput.options[this.valueBooleanInput.selectedIndex].value;
                //value2 = (this.valueBooleanInput2) ? this.valueBooleanInput2.options[this.valueBooleanInput.selectedIndex].value : "";
                if (value == "true") {
                    value = true;
                } else {
                    value = false;
                }
                //if (value2=="true"){
                //    value2 = true;
                //}else{
                //    value2 = false;
                //}
                break;
        }
        if (type === "restrict") {
            this.filterValueType.each(function (radio) {
                if (radio.get("checked")) valueType = radio.get("value");
            });
            return {
                //"logic": logic,
                "parameter": parameter,
                "title": title,
                "type": type,
                //"comparison": comparison,
                "formatType": formatType,
                "value": value,
                //"otherValue": value2,
                "code": this.scriptData,
                "valueType": valueType,
                "valueScript": this.filterValueScriptData
            };
        } else {
            var valueType = "";
            this.customFilterValueTypes.each(function (radio) {
                if (radio.get("checked")) valueType = radio.get("value");
            });
            return {
                // "logic": "and",
                "path": path,
                "title": title,
                "type": type,
                // "comparison": comparison,
                "formatType": formatType,
                "value": value,
                "otherValue": value2,
                "code": this.scriptData,
                "valueType": valueType,
                "valueScript": this.customFilterValueScriptData
            };
        }
    },

    setData: function (data) {
        // for (var i=0; i<this.logicInput.options.length; i++){
        //     if (this.logicInput.options[i].value===data.logic){
        //this.logicInput.options[i].set("selected", true);
        //break;
        //     }
        // }

        this.titleInput.set("value", data.title);
        this.pathInput.set("value", data.path);
        this.parameterInput.set("value", data.parameter);

        // for (var i=0; i<this.comparisonInput.options.length; i++){
        //     if (this.comparisonInput.options[i].value===data.comparison){
        //this.comparisonInput.options[i].set("selected", true);
        //break;
        //     }
        // }

        for (var i = 0; i < this.datatypeInput.options.length; i++) {
            if (this.datatypeInput.options[i].value === data.formatType) {
                this.datatypeInput.options[i].set("selected", true);
                break;
            }
        }

        switch (data.formatType) {
            case "textValue":
                this.valueTextInput.set("value", data.value);
                //if (this.valueTextInput2) this.valueTextInput2.set("value", data.otherValue);
                break;
            case "numberValue":
                this.valueNumberInput.set("value", data.value);
                //if (this.valueNumberInput2) this.valueNumberInput2.set("value", data.otherValue);
                break;
            case "datetimeValue":
            case "dateTimeValue":
                this.valueDatetimeInput.set("value", data.value);
                //if (this.valueDatetimeInput2) this.valueDatetimeInput2.set("value", data.otherValue);
                break;
            case "dateValue":
                this.valueDateInput.set("value", data.value);
                //if (this.valueDateInput2) this.valueDateInput2.set("value", data.otherValue);
                break;
            case "timeValue":
                this.valueTimeInput.set("value", data.value);
                //if (this.valueTimeInput2) this.valueTimeInput2.set("value", data.otherValue);
                break;
            case "booleanValue":

                for (var i = 0; i < this.valueBooleanInput.options.length; i++) {
                    var v = this.valueBooleanInput.options[i].value;
                    if (v == "true") {
                        v = true;
                    } else {
                        v = false;
                    }
                    if (v === data.value) {
                        this.valueBooleanInput.options[i].set("selected", true);
                        break;
                    }
                }
                //if (this.valueBooleanInput2){
                //    for (var i=0; i<this.valueBooleanInput2.options.length; i++){
                //        var v = this.valueBooleanInput2.options[i].value;
                //        if (v=="true"){
                //            v = true;
                //        }else{
                //            v = false;
                //        }
                //        if (v===data.otherValue){
                //            this.valueBooleanInput2.options[i].set("selected", true);
                //            break;
                //        }
                //    }
                //}
                break;
        }
        this.scriptData = data.code;
        try {
            if (this.scriptArea && this.scriptArea.editor) this.scriptArea.editor.setValue(this.scriptData.code);
        } catch (e) {
        }

        debugger;
        if (data.type === "custom") {
            this.customFilterValueTypes.each(function (radio) {
                if (data.valueType) {
                    if (data.valueType === radio.get("value")) radio.set("checked", true);
                } else {
                    if ("input" === radio.get("value")) radio.set("checked", true);
                }
            });
            if (this.customFilterValueScriptArea) {
                if (!data.valueType || data.valueType === "input") {
                    this.customFilterValueScriptDiv.hide();
                    this.customFilterValueScriptData = "";
                    this.customFilterValueScriptArea.editor.setValue("");
                } else {
                    this.customFilterValueScriptDiv.show();
                    this.customFilterValueScriptData = data.valueScript;
                    this.customFilterValueScriptArea.editor.setValue(data.valueScript ? data.valueScript.code : "");
                }
            }
        }

        if (data.type === "restrict") {
            this.filterValueType.each(function (radio) {
                if (data.valueType) {
                    if (data.valueType === radio.get("value")) radio.set("checked", true);
                } else {
                    if ("input" === radio.get("value")) radio.set("checked", true);
                }
            });
            if (this.filterValueScriptArea) {
                if (!data.valueType || data.valueType === "input") {
                    this.filterValueScriptDiv.hide();
                    this.filterValueScriptData = "";
                    this.filterValueScriptArea.editor.setValue("");
                } else {
                    this.filterValueScriptDiv.show();
                    this.filterValueScriptData = data.valueScript;
                    this.filterValueScriptArea.editor.setValue(data.valueScript ? data.valueScript.code : "");
                }
            }
        }


        this.switchInputDisplay();
        if (this.datatypeInput.onchange) {
            this.datatypeInput.onchange();
        }
    },

    deleteItem: function (item) {
        if (this.currentFilterItem == item) item.unSelected();
        this.items.erase(item);
        item.node.destroy();
        MWF.release(item);
        this.fireEvent("change");
    },
    getData: function () {
        debugger;
        var data = [];
        var customData = [];
        this.items.each(function (item) {
            if (item.data.type === "custom") {
                customData.push(item.data);
            } else {
                data.push(item.data);
            }
        }.bind(this));
        return {"data": data, "customData": customData};
    }
});

MWF.xApplication.query.StatementDesigner.widget.ViewFilter.Item = new Class({
    Implements: [Events],
    initialize: function (filter, data) {
        this.filter = filter;
        this.data = data;
        this.container = this.filter.listAreaNode;
        this.css = this.filter.css;
        this.app = this.filter.app;
        this.load();
    },
    load: function () {
        this.node = new Element("div", {"styles": this.css.itemNode}).inject(this.container);
        this.deleteNode = new Element("div", {"styles": this.css.itemDeleteNode}).inject(this.node);
        this.contentNode = new Element("div", {"styles": this.css.itemContentNode}).inject(this.node);
        this.contentNode.set("text", this.getText());

        this.contentNode.addEvent("click", function () {
            this.selected();
        }.bind(this));

        this.deleteNode.addEvent("click", function (e) {
            this.deleteItem(e);
        }.bind(this));
    },
    getText: function () {
        var lp = this.app.lp.filter;
        if (this.data.formatType === "numberValue") {
            return this.data.title + " " + this.data.parameter + " " + this.data.value;
        } else {
            return this.data.title + " " + this.data.parameter + " \"" + this.data.value + "\"";
        }
    },
    reload: function (data) {
        this.data = data;
        this.contentNode.set("text", this.getText());
    },
    selected: function () {
        if( this.filter.verificationNode ){
            this.filter.verificationNode.destroy();
            this.filter.verificationNode = null;
            this.filter.parameterInput.setStyle("background-color", "#FFF");
        }
        this.filter.restrictFilterInput.set("checked", true);
        this.filter.restrictFilterInput.click();
        if (this.filter.currentFilterItem) this.filter.currentFilterItem.unSelected();
        this.node.setStyles(this.css.itemNode_current);
        this.filter.currentFilterItem = this;
        this.filter.setData(this.data);
    },
    unSelected: function () {
        this.node.setStyles(this.css.itemNode);
        this.filter.currentFilterItem = null;
        this.filter.currentItem = this;
    },
    deleteItem: function (e) {
        var _self = this;
        this.filter.app.confirm("warn", e, this.app.lp.delete_filterItem_title, this.app.lp.delete_filterItem, 300, 120, function () {
            _self.destroy();
            this.close();
        }, function () {
            this.close();
        });
    },
    destroy: function () {
        this.filter.deleteItem(this);
    }
});

MWF.xApplication.query.StatementDesigner.widget.ViewFilter.ItemCustom = new Class({
    Extends: MWF.xApplication.query.StatementDesigner.widget.ViewFilter.Item,
    initialize: function (filter, data) {
        this.filter = filter;
        this.data = data;
        this.container = this.filter.fieldListAreaNode;
        this.css = this.filter.css;
        this.app = this.filter.app;
        this.load();
    },
    selected: function () {
        if( this.filter.verificationNode ){
            this.filter.verificationNode.destroy();
            this.filter.verificationNode = null;
            this.filter.pathInput.setStyle("background-color", "#FFF");
        }
         this.filter.customFilterInput.set("checked", true);
         this.filter.customFilterInput.click();
        if (this.filter.currentFilterItem) this.filter.currentFilterItem.unSelected();
        this.node.setStyles(this.css.itemNode_current);
        this.filter.currentFilterItem = this;
        this.filter.setData(this.data);
    },
    getText: function () {
        var lp = this.app.lp.filter;
        return this.data.title + "(" + this.data.path + ")";
    },
});
