define([
       "jquery", "underscore", "backbone"
      , "views/temp-snippet-view"
      , "helper/pubsub"
      , "text!templates/app/renderrrowcontainer.html"
], function(
  $, _, Backbone
  , TempSnippetView
  , PubSub
  , _renderForm
){
  return Backbone.View.extend({
    tagName: "div"
    , className: "fb-subtarget row"
    , initialize: function(){
      this.collection.on("add", this.render, this);
      this.collection.on("remove", this.render, this);
      this.collection.on("change", this.render, this);
      PubSub.on("mySnippetDrag-row", this.handleSnippetDrag, this);
      PubSub.on("tempMove-row", this.handleTempMove_row, this);
      PubSub.on("tempDrop-row", this.handleTempDrop, this);
      this.renderForm = _.template(_renderForm);
      this.render();
    }
  	, wrap_in_column: function($inner, collection_length){
  		var col_class='col-md-';
  		col_class = col_class + Math.floor(12/collection_length);
  		var $col = $('<div class="' + col_class + '"></div>');
  		$inner.appendTo($col);
  		return $col;
  	}
    , render: function(){
      //Render Snippet Views
      this.$el.empty();
      var that = this;
      var containsFile = false;
      var collection_length = this.collection.length;
      _.each(this.collection.renderAll(), function(snippet){
    	// adjust drop target
    	$("div.drop_target", snippet).addClass("drop_sub_target").addClass("col-md-1").parent().addClass("row");
    	$("div.component", snippet).addClass("col-md-10");
    	snippet = that.wrap_in_column(snippet, collection_length)
        that.$el.append(snippet);
      });
      this.$el.appendTo("#" + this.model.attributes.fields.id.value);
      this.delegateEvents();
      PubSub.trigger("rowContainerRendered");
    }

    , getTarget: function(eventX, eventY){
        var myFormBits = $(this.$el.find(".drop_target"));
        var topelement = _.find(myFormBits, function(renderedSnippet) {
      	if ((eventY >= $(renderedSnippet).offset().top  && eventY <= ($(renderedSnippet).offset().top  + $(renderedSnippet).outerHeight()))
      	 && (eventX >= $(renderedSnippet).offset().left && eventX <= ($(renderedSnippet).offset().left + $(renderedSnippet).outerWidth()))) {
            return true;
          }
          else {
            return false;
          }
        });
        if (topelement){
          return topelement;
        }
    }

    , handleSnippetDrag: function(mouseEvent, snippetModel) {
    	if (this.collection.contains(snippetModel)){
    		$("body").append(new TempSnippetView({model: snippetModel}).render());
    		this.collection.remove(snippetModel);
    		mouseEvent._skip_event = true;
    		PubSub.trigger("newTempPostRender", mouseEvent);
      }
    }

    , handleTempMove_row: function(mouseEvent){
      if (mouseEvent.isPropagationStopped()){
    	  return;
      }
      $(".drop_target").removeClass("hovered");
      if(mouseEvent.pageX >= this.$el.offset().left &&
  	     mouseEvent.pageX <= (this.$el.offset().left + this.$el.width()) &&
         mouseEvent.pageY >= this.$el.offset().top &&
         mouseEvent.pageY <= (this.$el.offset().top + this.$el.outerHeight())){
    	  var target = $(this.getTarget(mouseEvent.pageX, mouseEvent.pageY));
    	  if (target){target.addClass('hovered');}
          mouseEvent.stopPropagation();
      } else {
    	  $(".drop_target").removeClass("hovered");
      }
    }
    
    , handleTempDrop: function(mouseEvent, model, index){
    	if(mouseEvent.pageX >= this.$el.offset().left &&
           mouseEvent.pageX <= (this.$el.offset().left + this.$el.width()) &&
           mouseEvent.pageY >= this.$el.offset().top &&
           mouseEvent.pageY <= (this.$el.offset().top + this.$el.outerHeight())){
		    var index = $(".drop_target.drop_sub_target", this.$el).index($(".drop_target.drop_sub_target.hovered"));
		        if (index>-1){
		        	$(".drop_target").removeClass("hovered");
		        	this.collection.add(model,{at: index+1});
		        	mouseEvent.stopPropagation();
		        }else {
		        	this.collection.add(model,{at: 1});
		        	mouseEvent.stopPropagation();
		        }
    	}
    }
  })
});
