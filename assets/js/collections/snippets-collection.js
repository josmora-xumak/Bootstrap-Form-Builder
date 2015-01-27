define([
       "jquery" , "underscore" , "backbone"
       , "models/snippet-model"
       , "views/tab-snippet-view"
], function(
  $, _, Backbone
  , SnippetModel
  , TabSnippetView
){
  return Backbone.Collection.extend({
    model: SnippetModel
    , renderAll: function(){
      return this.map(function(snippet){
        return new TabSnippetView({model: snippet}).render();
      });
    }
  });
});
