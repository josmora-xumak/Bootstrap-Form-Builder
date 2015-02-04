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
    , makeid: function(){
	      var text = "";
	      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	      for( var i=0; i < 6; i++ )
	          text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	      return text;
	  }
    , renderAll: function(){
      return this.map(function(snippet){
        return new TabSnippetView({model: snippet}).render();
      });
    }
  });
});
