define([
  "jquery", "underscore", "backbone"
  , "text!templates/popover/popover-main.html"
  , "text!templates/popover/popover-input.html"
  , "text!templates/popover/popover-select.html"
  , "text!templates/popover/popover-textarea.html"
  , "text!templates/popover/popover-textarea-split.html"
  , "text!templates/popover/popover-checkbox.html"
  , "text!templates/popover/popover-rowcontainer.html"
  , "text!templates/popover/popover-panelcontainer.html"
  , "templates/snippet/snippet-templates"
  , "models/snippet-model"
  , "views/row-container-view"
  , "views/panel-container-view"
  // , "bootstrap"
], function(
  $, _, Backbone
  , _PopoverMain
  , _PopoverInput
  , _PopoverSelect
  , _PopoverTextArea
  , _PopoverTextAreaSplit
  , _PopoverCheckbox
  , _PopoverRowcontainer
  , _PopoverPanelcontainer
  , _snippetTemplates
  , SnippetModel
  , RowContainerView
  , PanelContainerView
){
  return Backbone.View.extend({
    tagName: "div"
    , className: "component" 
    , initialize: function(){
      if (!_snippetTemplates[this.model.idFriendlyTitle()]){
    	  console.error('Template ' + this.model.idFriendlyTitle() + 'not found in snippetTemplates. Is it added to templates/snippet/snippet-templates ?');
      }
      this.template = _.template(_snippetTemplates[this.model.idFriendlyTitle()])
      this.popoverTemplates = {
        "input" : _.template(_PopoverInput)
        , "select" : _.template(_PopoverSelect)
        , "textarea" : _.template(_PopoverTextArea)
        , "textarea-split" : _.template(_PopoverTextAreaSplit)
        , "checkbox" : _.template(_PopoverCheckbox)
        , "rowcontainer" : _.template(_PopoverRowcontainer)
        , "panelcontainer" : _.template(_PopoverPanelcontainer)
      }
    }
    , render: function(withAttributes, renderJSON){
      var that = this;
      var content = _.template(_PopoverMain)({
        "title": that.model.get("title"),
        "items" : that.model.get("fields"),
        "popoverTemplates": that.popoverTemplates
      });
      if (withAttributes) {
    	var content = this.$el.html(
          that.template(that.model.getValues())
        ).attr({
          "data-content"     : content
          , "data-title"     : that.model.get("title")
          , "data-trigger"   : "manual"
          , "data-html"      : true
          , "data-container" : "body"
        });

    	// render drop target
		var wrapper = $("<div></div>");
		var $drop_target_bottom = $("<div class='drop_target'><span class='glyphicon glyphicon-plus-sign'></span></div>");
		wrapper.append(content);
		wrapper.append($drop_target_bottom);
		content = wrapper;

    	if (typeof(this.model.row_container_views) != 'undefined'){
    		var $current_row_container = $("#" + this.model.attributes.fields.id.value, content);
    		_.each(this.model.row_container_views, function(rcv, key){
    			rcv.render();
    			var current_view_html = rcv.$el;
    			current_view_html.appendTo($current_row_container);
    		});
    	} else if (typeof(this.model.panel_container_views) != 'undefined') {
    		var $current_panel_container = $("#" + this.model.attributes.fields.id.value, content);
    		_.each(this.model.panel_container_views, function(pcv, key){
    			pcv.render();
    			var current_view_html = pcv.$el;
    			current_view_html.appendTo($current_panel_container);
    		});
    	} else if (this.model.attributes.collection) {
    		// initializing with nested collections
    		if (this.model.attributes.fields.id.type == 'rowcontainer'){
	    		var $current_row_container = $("#" + this.model.attributes.fields.id.value, content);
	    		this.model.row_container_views = {};
	    		var RowContainerCollection = require("collections/rowcontainer-collection");
	    		var rcv = new RowContainerView({model: this.model, collection: new RowContainerCollection(this.model.attributes.collection)});
	    		this.model.row_container_views[this.model] = rcv;
	    		var current_view_html = rcv.$el;
	    		current_view_html.appendTo($current_row_container);
    		} else if (this.model.attributes.fields.id.type == 'panelcontainer'){
	    		var $current_panel_container = $("#" + this.model.attributes.fields.id.value, content);
	    		this.model.panel_container_views = {};
	    		var PanelContainerCollection = require("collections/panelcontainer-collection");
	    		var pcv = new PanelContainerView({model: this.model, collection: new PanelContainerCollection(this.model.attributes.collection)});
	    		this.model.panel_container_views[this.model] = pcv;
	    		var current_view_html = pcv.$el;
	    		current_view_html.appendTo($current_panel_container);
    		}
    	}
    	return content;
      } else if(renderJSON){
    	  var json = this.model.toJSON();
    	  if (typeof(this.model.row_container_views) != 'undefined'){
    		  var collection = JSON.parse('[]');
    		  _.each(this.model.row_container_views, function(rcv, key){
    			  var collection_json = rcv.collection.toJSON();
    			  _.each(collection_json, function(v, k){
    				  collection.push(v);
    			  });
    		  });
    		  json["collection"] = collection;
    	  }
    	  if (typeof(this.model.panel_container_views) != 'undefined'){
    		  var collection = JSON.parse('[]');
    		  _.each(this.model.panel_container_views, function(pcv, key){
    			  var collection_json = pcv.collection.toJSON();
    			  var i = 0;
    			  _.each(pcv.collection.models, function(v, k){
    				  if(v.row_container_views){
    					  _.each(v.row_container_views, function(rcv, k){
    						  collection_json[i]["collection"] = rcv.collection.toJSON();
    					  });
    				  }
    				  i += 1;
    			  });
    			  _.each(collection_json, function(v, k){
    				  collection.push(v);
    			  });
    		  });
    		  json["collection"] = collection;
    	  }
    	  return JSON.stringify(json);
      } else {
        var content = this.$el.html(
          that.template(that.model.getValues())
        );
         /* render components in the row-container */
         if (typeof(this.model.row_container_views) != 'undefined'){
    		var $current_row_container = $("#" + this.model.attributes.fields.id.value, content);
    		_.each(this.model.row_container_views, function(rcv, key){
    			
    			var current_view_html = rcv.$el.clone();
    			var current_view_groups = $('div.form-group', current_view_html).unwrap();
    			current_view_html.appendTo($current_row_container);
    			current_view_html.find(".drop_target").remove();
    		});
    	}
         /* render components in the panel-container */
        if (typeof(this.model.panel_container_views) != 'undefined'){
     		var $current_panel_container = $("#" + this.model.attributes.fields.id.value, content);
     		_.each(this.model.panel_container_views, function(pcv, key){
     			var current_view_html = pcv.$el.clone();
     			var current_rows = $('.container-fluid.fb-highlight', current_view_html).unwrap().unwrap();
     			var current_view_groups = $('div.form-group', current_view_html).unwrap();
     			current_view_html.appendTo($current_panel_container);
     			current_view_html.find(".drop_target").remove();
     		});
     	}
        return content;
      }
    }
  });
});
