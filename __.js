/* **************************************************
*
* New Framework
* Primary purpose is to hopefully keep code organized
* The model, view, and controller classes can be extended
* at any time by calling the extend method.
*
* Example Usage:
*
* Extending a class (1)
*
*     __.model.extend('ClassName', { 
*         init : function() { return true; }
*     });
*
*     __.model.ClassName.init(); // returns true
*
*
**********
* Extending a class (2)
*
*     __.extend(__.model, 'ClassName', { 
*         init : function() { return true; }
*     });
*
*     __.model.ClassName.init(); // returns true
*
*
**********
* Extending the main __ class
*
*     __.extend('ClassName', { 
*         init : function() { return true; }
*     });
*
*     __.ClassName.init(); // returns true
*
*
**********
* You can extend any object, if needed
*
*    var ClassName = {};
*     __.extend(ClassName, { 
*         init : function() { return true; }
*     });
*
*     ClassName.init(); // returns true
*
**********
*
*
* */

var __ = {

	extend : function(base, extension, methods) {
		if ( typeof(methods) == 'undefined' ) {
			methods   = extension;
			extension = base;
			base      = (typeof(base)=='string')?this:base;
		}

		if ( typeof base == 'undefined' ) {
			base = {};
			base[extension] = methods;

		} else {
			for ( var prop in methods ) {				
				if ( typeof base[extension] == 'undefined' ) {
					base[extension] = methods;
				} else {
					for ( var prop in methods ) {
						base[extension][prop] = methods[prop];
					}
				}
			}
		}
	},
	/* ******
	*
	* End
	*
	********************************************** */







	
	/* **********************************************
	*
	*
	****** */
	model : {
		extend : function(source, methods) {
			if ( typeof this[source] == 'undefined' ) {
				this[source] = methods;
			} else {
				for ( var prop in methods ) {
					this[source][prop] = methods[prop];
				}	
			}
		}
	},
	/* ******
	*
	* End
	*
	********************************************** */







	
	/* **********************************************
	*
	*
	****** */
	controller : {
		extend : function(source, methods) {
			if ( typeof  this[source] == 'undefined' ) {
				this[source] = methods;
			} else {
				for ( var prop in methods ) {
					this[source][prop] = methods[prop];
				}	
			}
		}		
	},
	/* ******
	*
	* End
	*
	********************************************** */







	
	/* **********************************************
	*
	*
	****** */
	view : {
		extend : function(source, methods) {
			if ( typeof  this[source] == 'undefined' ) {
				this[source] = methods;
			} else {
				for ( var prop in methods ) {
					this[source][prop] = methods[prop];
				}	
			}
		}		
	},
	/* ******
	*
	* End
	*
	********************************************** */







	
	/* **********************************************
	*
	*
	****** */
	dom : {
		extend : function(source, methods) {
			if ( typeof  this[source] == 'undefined' ) {
				this[source] = methods;
			} else {
				for ( var prop in methods ) {
					this[source][prop] = methods[prop];
				}	
			}
		}		
	}
	/* ******
	*
	* End
	*
	********************************************** */








	/* **********************************************
	*
	* Method: __.setDefaults
	* For: merges two objects. Your methods default
	*    object used to set default parameter values
	*    and optional overrides/additions passed to
	*    to your method
	* 
	* Use:
	*    yourMethod : function(objOptions) {
	*        var defaults = { color: 'red', width : '100', height : '100' } 
	*        var options  = __.setDefaults(objOptions, defaults);
	*    }
	*
	* objOptions [object] [required] (object passed to your method)
	* defaults   [object] [optional] (defaults set in your method)
	*
	****** */
	setDefaults : function(objOptions, defaults) {

		var options={};

		if ( typeof defaults == 'undefined' ) {
			defaults = {};
		}

		if ( typeof(objOptions) == 'object' ) {
			for ( var property in objOptions ) {
				defaults[property] = objOptions[property];
			}
		}

		defaults.hasCallback = false;
		if ( typeof defaults.callback == 'function' ) {
			defaults.hasCallback = true;
		}
		options = defaults;

		return options;
	},
	/* ******
	*
	* End
	*
	********************************************** */







	
	/* **********************************************
	*
	* Will find the position of a character in a string
	* beginning at a given start position
	*
	* Accepts an array for the needle
	*
	* If needle is a string, it will return the position of
	* the character
	*
	* var Str = 'the brown fox jumps over the lazy dog';
	* foundChar = __.findPreviousOccurence(Str, 'x', 15); // should return 11
	*
	*********
	*
	* If the needle is an array, it will find the first occurance
	* of any of the array keys passed. It will return the position
	* and the character (needle key) that was found first.
	*
	* var Str = 'the brown fox jumps over the lazy dog';
	* foundChar = __.findPreviousOccurence(Str, Array('x','u','v'), 25); // should return Array(20, 'v');
	*
	****** */
	findPreviousOccurence : function(haystack, needle, startPos) {
		position = -1;

		var is_object = (typeof needle == 'object');
		for (i=startPos; i>=0; i-- ) {

			substr = haystack.substring(i-1, i);

			if ( is_object && ( needle.indexOf(substr) > -1 && position < 0) ) {
				position = [i, substr];

			} else if (haystack.substring(i, i + 1) == needle && position < 0) {
				position = i;
			}
		}
		return position;
	},
	/* ******
	*
	* End
	*
	********************************************** */







	
	/* **********************************************
	*
	* Will find the position of a character in a string
	* beginning at a given start position
	*
	* Accepts an array for the needle
	*
	* If needle is a string, it will return the position of
	* the character
	*
	* var Str = 'the brown fox jumps over the lazy dog';
	* foundChar = __.findPreviousOccurence(Str, 'x', 0); // should return 11
	*
	*********
	*
	* If the needle is an array, it will find the first occurance
	* of any of the array keys passed. It will return the position
	* and the character (needle key) that was found first.
	*
	* var Str = 'the brown fox jumps over the lazy dog';
	* foundChar = __.findPreviousOccurence(Str, Array('x','u','v'), 0); // should return Array(20, 'v');
	*
	****** */
	findNextOccurence : function(haystack, needle, startPos) {
		position = -1;

		var is_object = (typeof needle == 'object');

		for (i=startPos; i<=haystack.length; i++ ) {
			substr = haystack.substring(i-1, i);
			if ( is_object && ( needle.indexOf(substr) > -1 && position < 0) ) {
				position = [i-1, substr];
				
			} else if (haystack.substring(i, i + 1) == needle && position < 0) {
				position = i+1;
			}
		}
		return position;
	},
	/* ******
	*
	* End
	*
	********************************************** */
}