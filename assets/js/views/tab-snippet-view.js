define([
       "jquery", "underscore", "backbone"
       , "models/snippet-model"
       , "views/snippet-view", "views/temp-snippet-view"
       , "helper/pubsub"
], function(
  $, _, Backbone
  , SnippetModel
  , SnippetView, TempSnippetView
  , PubSub
){
  return SnippetView.extend({
    events:{
      "mousedown" : "mouseDownHandler"
    }
    , mouseDownHandler: function(mouseDownEvent){
      mouseDownEvent.preventDefault();
      mouseDownEvent.stopPropagation();
      //hide all popovers
      $(".popover").hide();
      $(window.form_builder_temp_container).append(new TempSnippetView({model: new SnippetModel($.extend(true,{},this.model.attributes))}).render());
      PubSub.trigger("newTempPostRender", mouseDownEvent);
    }
  });
});
