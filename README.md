property.js
===========

property.js is a JavaScript Library that Provides Simpler Usage of the Native Properties (as specified in ECMAScript 5, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty for browser support).

### The main features are:
 * Create properties in a simple way
 * Observe changes to the properties
 * Use privacy for separation of concern

## Creation
		var obj = {};
		property.mixin(obj);
		obj.addProperty("phrase", "hello, my name is");
		obj.addProperty("name", "Roberto");
		obj.addProperty("greeting").
			getter(function(){ return obj.phrase + " " + obj.name; }).
			setter(false);

		console.log(obj.greeting); //console: hello, my name is Roberto

		obj.name = "Alejandro";

		console.log(obj.greeting);	//console: hello, my name is Alejandro

## Observe
		var obj = {};
		property.mixin(obj);
		obj.addProperty("phrase", "hello, my name is");
		obj.addProperty("name", "Roberto").observe(function(newVal, oldVal){
			console.log("Did you just change name from " + oldVal + " to " + newVal + "?")
		});

		obj.name = "Alejandro"; //console: Did you just change name from Roberto to Alejandro?

## Privacy
		var obj = {};
		property.mixin(obj);
		obj.addProperty("phrase", "hello, my name is");
		var namePrivateScope = obj.addProperty("name", "Roberto").setter(true, true); //second argument specifies if setter is private
		var greetingFullyPrivate = obj.addProperty().
			getter(function(){ return obj.phrase + " " + obj.name; }, true).
			setter(false);

		namePrivateScope("Alejandro"); //Use the private handle to set!
		console.log(greetingFullyPrivate()); //Use the private handle to get!

		console.log(obj.greeting); //Undefined because property is fully private (ie. property isn't present)
		obj.name = "Alejandro"; //error: Attempt to change private setter publicly

## Alternate creation (without mixin)
		var obj = {};
		property(obj, "phrase", "hello world");
		console.log(obj.phrase);

## Getters and setters
		The Getters and Setters are powerful, and allows you to use the properties in a flexible manner: 
		- The First Argument Allows you to Specify a custom Getter/Setter Method, or alternatively a truthy value to use the default Method (basically just getting and setting the internal value of the property), or a falsy value to remove the Getter/Setter completely.
		- The Second Argument specifies whether the Property is private or not (if it should be public you can leave it out). A private Setter/Getter is only accessable from the Private Scope handle (ie. the variable returned from addProperty, with the familiar JQuery Property Syntax), whereas a public Setter/Getter will be available for use as a property on the object.