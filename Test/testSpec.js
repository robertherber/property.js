if(typeof module !== "undefined"){
	property = require('../src/property.js');
}

describe('Property', function(){
	describe('Creation', function() {
		it("Should be createable from a mixin", function(){
			var obj = {};
			property.mixin(obj);
			obj.addProperty("yeah", 5);
			expect(obj.yeah).toEqual(5);
		});

		it("Should be createable directly", function(){
			var obj = {};
			property(obj, "yeah", 5);
			expect(obj.yeah).toEqual(5);
		});

		it("Should throw exception when setting setter or getter twice", function(){
			var obj = {};
			var prop = property(obj, "yeah", 5);
			prop.setter(true).getter(true);
			expect(function(){ prop.setter(true); }).toThrow(new Error("Setter has already been set"));
			expect(function(){ prop.getter(true); }).toThrow(new Error("Getter has already been set"));
		});
	});

	describe('Observable', function() {
		it("Should be notified on change with old and new value", function(){
			var obj = {},
				firstValue = 5,
				secondValue = 10;
			property.mixin(obj);
			
			obj.addProperty("yeah", firstValue).observe(function(newVal, oldVal){
				expect(newVal).toEqual(secondValue);
				expect(oldVal).toEqual(firstValue);
			});

			obj.yeah = secondValue;
		});
	});

	describe('Privacy', function() {
		it("Should be created public get/set", function(){
			var obj = {};
			property.mixin(obj);
			obj.addProperty("yeah", 5);
			obj.yeah = 10; //public accessor
			expect(obj.yeah).toEqual(10);
		});

		it("Basic private get/set", function(){
			var obj = {};
			property.mixin(obj);
			var privateYeah = obj.addProperty("yeah", 5);
			expect(privateYeah()).toEqual(5);
			privateYeah(10);
			expect(privateYeah()).toEqual(10);
			expect(obj.yeah).toEqual(10);
		});

		it("Basic public get/set", function(){
			var obj = {};
			property.mixin(obj);
			var privateYeah = obj.addProperty("yeah", 5);
			expect(obj.yeah).toEqual(5);
			expect(privateYeah()).toEqual(5);
			obj.yeah = 10;
			expect(obj.yeah).toEqual(10);
			expect(privateYeah()).toEqual(10);
		});

		it("Should throw exception when Publicy setting a Property with a Private setter", function(){
			var obj = {};
			property.mixin(obj);
			obj.addProperty("yeah", 5).setter(true, true);
			expect(function()
				{ 
					obj.yeah = 10 
				}).toThrow(new Error("Attempt to Publicly set Private property"));
		});

		it("Should throw Exception when Setting a Property that is Read-Only", function(){
			var obj = {};
			property.mixin(obj);
			obj.addProperty("yeah", 5).setter(false);
			expect(function()
				{ 
					obj.yeah = 10 
				}).toThrow(new Error("Attempt to set a Property that is Read-Only"));
		});

		it("Private properties should be undefined in the Public Scope", function(){
			var obj = {};
			property.mixin(obj);
			obj.addProperty("yeah", 5).setter(true, true).getter(true, true);
			expect(obj.yeah).toBeUndefined();
		});
	});
});