define([
       "jquery", "underscore", "backbone"
       // , "views/snippet-view"
       , "text!templates/app/temp.html"
       , "helper/pubsub"
       , "text!templates/popover/popover-main.html"
       , "text!templates/popover/popover-input.html"
       , "text!templates/popover/popover-select.html"
       , "text!templates/popover/popover-textarea.html"
       , "text!templates/popover/popover-textarea-split.html"
       , "text!templates/popover/popover-checkbox.html"
       , "text!templates/popover/popover-rowcontainer.html"
       , "templates/snippet/snippet-templates"
], function(
  $, _, Backbone
  // , SnippetView
  , _tempTemplate
  , PubSub
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
    , initialize: function(){
    		  PubSub.on("newTempPostRender", this.postRender, this);
		      this.template = _.template(_snippetTemplates[this.model.idFriendlyTitle()])
		      this.popoverTemplates = {
		        "input" : _.template(_PopoverInput)
		        , "select" : _.template(_PopoverSelect)
		        , "textarea" : _.template(_PopoverTextArea)
		        , "textarea-split" : _.template(_PopoverTextAreaSplit)
		        , "checkbox" : _.template(_PopoverCheckbox)
		        , "rowcontainer" : _.template(_PopoverRowcontainer)
		      }
		      this.tempTemplate = _.template(_tempTemplate);
    		}
  
    /* initialize: function(){
      PubSub.on("newTempPostRender", this.postRender, this);
      this.constructor.__super__.initialize.call(this);
      this.tempTemplate = _.template(_tempTemplate);
    }*/
    , className: "temp"
    //, render: function() {
    //  return this.$el.html(this.tempTemplate({text: this.constructor.__super__.render.call(this).html()}));
     //}
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
        	this.$el.html(this.tempTemplate({text: content.html()}))
        	return content;
        } else {
        	var content = this.$el.html(that.template(that.model.getValues()));
        	this.$el.html(this.tempTemplate({text: content.html()}))
        	return content;
        }
        }
    , postRender: function(mouseEvent){
      this.tempContainer  = this.$el.find("div")[0];
      this.tempContainerBCR = this.tempContainer.getBoundingClientRect();

      this.tempForm  = this.$el.find("form")[0];
      this.halfHeight = Math.floor(this.tempForm.clientHeight/2);
      this.halfWidth  = Math.floor(this.tempForm.clientWidth/2);
      this.centerOnEvent(mouseEvent);
    }
    , events:{
      "mousemove": "mouseMoveHandler",
      "mouseup" : "mouseUpHandler"
    }
    , centerOnEvent: function(mouseEvent){
      var mouseX     = mouseEvent.pageX;
      var mouseY     = mouseEvent.pageY;

      this.tempForm.style.top = (mouseY - this.halfHeight) + "px";
      this.tempForm.style.left = (mouseX - this.halfWidth -
        this.tempContainerBCR.left) + "px";
      // Make sure the element has been drawn and
      // has height in the dom before triggering.
      PubSub.trigger("tempMove-row", mouseEvent);
      if (!mouseEvent.isPropagationStopped()){
    	  PubSub.trigger("tempMove", mouseEvent);
      }
    }
    , mouseMoveHandler: function(mouseEvent) {
      mouseEvent.preventDefault();
      this.centerOnEvent(mouseEvent);
    }
    , mouseUpHandler: function(mouseEvent){
      mouseEvent.preventDefault();
      PubSub.trigger("tempDrop-row", mouseEvent, this.model);
      if (!mouseEvent.isPropagationStopped()){
    	  PubSub.trigger("tempDrop", mouseEvent, this.model);
      }
      this.remove();
    }
  });
});
