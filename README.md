property.js
===========

property.js is a JavaScript Library that Provides Simpler Usage of the Native Properties (as specified in ECMAScript 5, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty for browser support).

### The main features are:
 * Create properties in a simple way
 * Observe changes to the properties
 * Use privacy for separation of concern

## Creation
		var HiSayer = function(){
			property.mixin(this);
			
			this.addProperty("phrase", "hello, my name is");
			this.addProperty("name", "Roberto");
			this.addProperty("greeting").
				getter(function(){ return this.phrase + " " + this.name; }).
				setter(false);
		}

		var hiSayer = new HiSayer();
	
		console.log(hiSayer.greeting); //console: hello, my name is Roberto
		hiSayer.name = "Alejandro";
		console.log(hiSayer.greeting); //console: hello, my name is Alejandro

## Observe
		var HiSayer = function(){
			property.mixin(this);
			this.addProperty("phrase", "hello, my name is");
			this.addProperty("name", "Roberto").observe(function(newVal, oldVal){
				console.log("Did you just change name from " + oldVal + " to " + newVal + "?")
			});
		}

		var hiSayer = new HiSayer();

		hiSayer.name = "Alejandro"; //console: Did you just change name from Roberto to Alejandro?

## Privacy
		var HiSayer = function(){
			property.mixin(this);	
			var phrase 		= this.addProperty("phrase", "hello, my name is"),
				name 		= this.addProperty("name", "Roberto").setter(true, true), //second argument specifies if setter is private
				greeting 	= this.addProperty().
					getter(function(){ return this.phrase + " " + this.name; }, true).
					setter(false);

			name("Alejandro"); //Use the private handle to set, this uses same syntax as ex. JQuery Properties
			console.log(greeting()); //Use the private handle to get!
		}

		var hiSayer = new HiSayer();

		console.log(hiSayer.greeting); //Undefined because property is fully private
		hiSayer.name = "Alejandro"; //throws error: Attempt to change private setter publicly

## Alternate creation (without mixin)
		var HiSayer = function(){
			property(this, "phrase", "hello world");
			console.log(this.phrase);	
		}

## Getters and setters
The Getters and Setters are powerful, and allows you to use the properties in a flexible manner: 
- The First Argument Allows you to Specify a custom Getter/Setter Method, or alternatively a truthy value to use the default Method (basically just getting and setting the internal value of the property), or a falsy value to remove the Getter/Setter completely.
- The Second Argument specifies whether the Property is private or not (if it should be public you can leave it out). A private Setter/Getter is only accessable from the Private Scope handle (ie. the variable returned from addProperty, with the familiar JQuery Property Syntax), whereas a public Setter/Getter will be available for use as a property on the object.