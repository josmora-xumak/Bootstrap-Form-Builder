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
    	snippet = that.wrap_in_column(snippet, collection_length)
        that.$el.append(snippet);
      });
      $("#render").val(that.renderForm({
        multipart: this.collection.containsFileType(),
        text: _.map(this.collection.renderAllClean(), function(e){return e.html()}).join("\n")
      }));
      this.$el.appendTo("#" + this.model.attributes.fields.id.value);
      this.delegateEvents();
    }

    , getBottomAbove: function(eventY){
      var myFormBits = $(this.$el.find(".component"));
      var topelement = _.find(myFormBits, function(renderedSnippet) {
        if (($(renderedSnippet).position().top + $(renderedSnippet).height()) > eventY  - 160) {
          return true;
        }
        else {
          return false;
        }
      });
      if (topelement){
        return topelement;
      } else {
        return myFormBits[0];
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
      this.$el.removeClass("subtarget");
      if(mouseEvent.pageX >= this.$el.offset().left &&
  	     mouseEvent.pageX < (this.$el.offset().left + this.$el.width()) &&
         mouseEvent.pageY >= this.$el.offset().top &&
         mouseEvent.pageY < (this.$el.offset().top + this.$el.height())){
    	$(".target").removeClass("target");
        this.$el.addClass("subtarget");
        mouseEvent.stopPropagation();
      } else {
        $(".subtarget").removeClass("subtarget");
      }
    }

    , handleTempDrop: function(mouseEvent, model, index){
      if(mouseEvent.pageX >= this.$el.offset().left &&
      	 mouseEvent.pageX < (this.$el.offset().left + this.$el.width()) &&
         mouseEvent.pageY >= this.$el.offset().top &&
         mouseEvent.pageY < (this.$el.offset().top + this.$el.height())){
    	 $(".target").removeClass("target");
    	 var index = $(".subtarget").index();
    	 $(".subtarget").removeClass("subtarget");
    	 this.collection.add(model,{at: index+1});
    	 mouseEvent.stopPropagation();
      } else {
        //$(".target").removeClass("target");
        $(".subtarget").removeClass("subtarget");
      }
    }
  })
});
