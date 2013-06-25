property.js
===========

property.js is a JavaScript Library that Provides Simpler Usage of the Native Properties (as specified in ECMAScript 5, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty for browser support).

### The main features are:
 * Create properties in a simple way
 * Observe changes to the properties
 * Provide a way to to handle privacy

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
By observing a property you'll get notified when it changes. You'll get both the new and old value in the callback.
		var HiSayer = function(){
			property.mixin(this);
			this.addProperty("phrase", "hello, my name is");
			this.addProperty("name", "Roberto").
				observe(function(newVal, oldVal) { console.log("Did you just change name from " + oldVal + " to " + newVal + "?") });
		}

		var hiSayer = new HiSayer();

		hiSayer.name = "Alejandro"; //console: Did you just change name from Roberto to Alejandro?

## Privacy
There are two ways to set/get the property you add, one private and one public, to make it easy to achieve encapsulation and code reuse. The this.propertyName (where propertyName is the first argument given to the addProperty function) is the public accessor. The addProperty method also returns a private object that accesses that same property, that you get by calling it as a function, and set by calling it as a function with the argument you want to assign to it. An example:

		var HiSayer = function(){
			property.mixin(this);	
			var phrase		= this.addProperty("phrase", "hello, my name is"),
				name 		= this.addProperty("name", "Roberto").setter(true, true), //second argument specifies that setter is private
				greeting 	= this.addProperty().
					getter(function(){ return this.phrase + " " + this.name; }, true).
					setter(false);

			name("Alejandro"); //Use the private accessor to set
			console.log(greeting()); //Use the private handle to get
		}

		var hiSayer = new HiSayer();

		console.log(hiSayer.greeting); //Undefined because property is fully private
		hiSayer.name = "Alejandro"; //throws error: Attempt to change private setter publicly

This will remove a lot of clutter and help your code simple and clean. Some common patterns are:
* Public property
	Both getting and setting is possible from the public property
		this.addProperty("name", "value"); 
		/* which really is the same as this: */ 
		this.addProperty("name", "value").
			setter(true, false).
			getter(true, false);

		/* valid use */
		someProp(1);				//private set
		console.log(someProp());	//private get
		this.someProp = 2			//public set
		console.log(this.someProp);	//public get

* Private property
		var someProp = this.addProperty(null, "value"); 
		/* which really is the same as this: */ 
		this.addProperty("name", "value").
			setter(true, true).
			getter(true, true);

		/* valid use */
		someProp(1);				//private set
		console.log(someProp());	//private get

		/* invalid use */
		this.someProp = 2			//public set
		console.log(this.someProp); //public get
		

* Protected property
		var someProp = this.addProperty("someProp", "value"); 
		/* which really is the same as this: */
		this.addProperty("someProp", "value").
			setter(true, true).
			getter(true, false);

		/* valid use */
		someProp(1);				//private set
		console.log(someProp());	//private get
		console.log(this.someProp);	//public get

		/* invalid use */
		this.someProp = 2			//public set

* Read-only property
		var someProp = this.addProperty("someProp", "readOnlyValue").
			setter(false); 
		/* which really is the same as this: */
		this.addProperty("someProp", "value").
			setter(false).
			getter(true, false);

		/* valid use */
		console.log(someProp());	//private get
		console.log(this.someProp);	//public get

		/* invalid use */
		someProp(1);				//private set
		this.someProp = 2;			//public set

## Alternate creation (without mixin)
		var HiSayer = function(){
			property(this, "phrase", "hello world");
			console.log(this.phrase);	
		}

## Getters and setters
The Getters and Setters are powerful, and allows you to use the properties in a flexible manner: 
- The first argument allows you to specify a custom Getter/Setter Method, or alternatively a truthy value to use the default Method (directly getting and setting the internal value of the property), or a falsy value to remove the Getter/Setter completely. Both getters and setters are expected to return a value, for the setter this is the value that's gonna get stored internally.
- The second argument specifies whether the Property is private or not (public is default). A private Setter/Getter is only accessable from the private property handle (which is the variable returned from addProperty), whereas a public Setter/Getter will be available as a property on the object.