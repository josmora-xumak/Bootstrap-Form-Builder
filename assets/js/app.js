define([
       "jquery" , "underscore" , "backbone"
       , "collections/snippets-collection" , "collections/form-snippets-collection"
       , "views/tab-view" , "views/form-view"
       //, "text!data/input.json", "text!data/radio.json", "text!data/select.json", "text!data/buttons.json"
       , "text!data/containers.json"
       , "text!" + window.form_fields_resource
       , "text!templates/app/render.html",
], function(
  $, _, Backbone
  , SnippetsCollection, MyFormSnippetsCollection
  , TabView, MyFormView
  //, inputJSON, radioJSON, selectJSON, buttonsJSON
  , containersJSON
  , formFieldsJSON
  , renderTab
){
  return {
    initialize: function(){
      //Bootstrap tabs from json.
      new TabView({
        title: "Containers"
            , collection: new SnippetsCollection(JSON.parse(containersJSON))
      });
      new TabView({
          title: "Form fields"
              , collection: new SnippetsCollection(JSON.parse(formFieldsJSON))
        });
      new TabView({
          title: "Rendered"
          , content: renderTab
        });
      /*
      new TabView({
        title: "Input"
        , collection: new SnippetsCollection(JSON.parse(inputJSON))
      });
      new TabView({
        title: "Radio / Checkbox"
        , collection: new SnippetsCollection(JSON.parse(radioJSON))
      });
      new TabView({
        title: "Select"
        , collection: new SnippetsCollection(JSON.parse(selectJSON))
      });
      new TabView({
        title: "Buttons"
        , collection: new SnippetsCollection(JSON.parse(buttonsJSON))
      });
      new TabView({
        title: "About"
        , content: aboutTab
      });
       */

      //Make the first tab active!
      $("#components .tab-pane").first().addClass("active");
      $("#formtabs li").first().addClass("active");
      if (window.form_builder_initial_data){
    	  new MyFormView({
              title: "Original"
              , collection: new MyFormSnippetsCollection([window.form_builder_initial_data])
            });
      } else {
    	  new MyFormView({
    	        title: "Original"
    	        , collection: new MyFormSnippetsCollection([
    	          { "title" : "Form Name"
    	            , "fields": {
    	              "name" : {
    	                "label"   : "Form Name"
    	                , "type"  : "input"
    	                , "value" : "Form Name"
    	              }
    	            }
    	          }
    	        ])
    	      });
      }
    }
  }
});
