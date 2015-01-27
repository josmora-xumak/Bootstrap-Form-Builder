define([
  "jquery", "underscore", "backbone"
  , "text!templates/popover/popover-main.html"
  , "text!templates/popover/popover-input.html"
  , "text!templates/popover/popover-select.html"
  , "text!templates/popover/popover-textarea.html"
  , "text!templates/popover/popover-textarea-split.html"
  , "text!templates/popover/popover-checkbox.html"
  , "text!templates/popover/popover-rowcontainer.html"
  , "templates/snippet/snippet-templates"
  , "bootstrap"
], function(
  $, _, Backbone
  , _PopoverMain
  , _PopoverInput
  , _PopoverSelect
  , _PopoverTextArea
  , _PopoverTextAreaSplit
  , _PopoverCheckbox
  , _PopoverRowcontainer
  , _snippetTemplates
){
  return Backbone.View.extend({
    tagName: "div"
    , className: "component" 
    , initialize: function(){
      this.template = _.template(_snippetTemplates[this.model.idFriendlyTitle()])
      this.popoverTemplates = {
        "input" : _.template(_PopoverInput)
        , "select" : _.template(_PopoverSelect)
        , "textarea" : _.template(_PopoverTextArea)
        , "textarea-split" : _.template(_PopoverTextAreaSplit)
        , "checkbox" : _.template(_PopoverCheckbox)
        , "rowcontainer" : _.template(_PopoverRowcontainer)
      }
    }
    , render: function(withAttributes){
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
    	if (typeof(this.model.row_container_views) != 'undefined'){
    		var $current_row_container = $("#" + this.model.attributes.fields.id.value, content);
    		_.each(this.model.row_container_views, function(rcv, key){
    			var current_view_html = rcv.$el;
    			current_view_html.appendTo($current_row_container);
    		});
    		
    	}
    	
    	
    	return content;
      } else {
        return this.$el.html(
          that.template(that.model.getValues())
        )
      }
    }
  });
});
