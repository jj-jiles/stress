/* **************************************************
*
* IE8 does not support the indexOf function for arrays
* If it does not exist, add it
*
****** */
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}
/* ******
*
* End
*
********************************************** */


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
		},




		Collection : {


			/* **********************************************
			* 
			* Returns a given collection
			* Determines if the requested collection is set
			* and is an object. If not, returns nothing
			* and prints error to console.
			*
			****** */
			returnCollection : function(Collection) {
				var arrColl = Collection.split('.');
				if ( arrColl.length > 1 ) {
					arr = '';
					for ( var prop in arrColl ) {
						arr += "['" + arrColl[prop] + "']";
					}
				
					collection = eval('this' + arr );
				} else {
					collection = this[Collection];
				}

				if ( typeof collection !== 'object' ) {
					console.log('The collection you requested is not an object');
					return;

				} else {
					return collection;
				}
			},
			/* ******
			*
			* End
			*
			********************************************** */








			/* **********************************************
			* 
			* Returns a given collection
			*
			****** */
			get : function(Collection, where) {
				collection = this.returnCollection(Collection);

				if ( typeof where !== 'undefined' ) {
					needle = where['key'];
					val    = where['equals'];

					if ( typeof collection.length !== 'undefined' ) {
						for ( var i=0; i<collection.length; i++ ) {
							if ( typeof(collection[i][needle]) !== 'undefined' && collection[i][needle] == val ) {
								return collection[i];
							}
						}
					} else {
						for ( var prop in collection ) {

						}
					}
				}

				return collection;
			},
			/* ******
			*
			* End
			*
			********************************************** */








			/* **********************************************
			* 
			* adds a forEach loop to a collection
			*
			* Use :
			*     __.model.collection.forEach('GridViewProfile.Columns', function(key, row) {
			*         console.log(this[row]);
			*     });
			*
			****** */
			forEach : function(collection, callback, offset, rowCount) {
				collection = this.returnCollection(collection);

				if ( typeof collection !== 'object' ) {
					console.log('The collection you requested is not an object');
					return;

				} else {
					offset   = ( typeof offset !== 'undefined' ) ? offset : 0;
					rowCount = ( typeof rowCount !== 'undefined' ) ? offset+rowCount : collection.length;
					rowCount = ( rowCount > collection.length ) ? collection.length : rowCount;

					if ( typeof collection.length !== 'undefined' ) {
						for ( var i=offset; i<rowCount; i++ ) {
							callback.call(collection, collection[i], i, this);
						}
					} else {
						for ( var prop in collection ) {
							callback.call(collection, collection[prop], prop, this);
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
			* adds a data model to the schema
			*
			*
			****** */
			set : function(objOptions) {
				var defaults = {
					name : '',
					model      : {}
				}
				var options = __.setDefaults(objOptions, defaults);

				if ( typeof options.model === 'object' ) {
					this[options.name] = options.model;
				} else {
					console.log('The model is not an object or array')
				}

			},
			/* ******
			*
			* End
			*
			********************************************** */








			/* **********************************************
			*
			* insert a key/value into a schema
			*
			* Use :
			*    __.model.schema.insertInto({
			* 	      schema : 'nameOfArray',
			*         -- as an object --
			*         keyValue : { 
			*             key : 'key', 
			*             value : 'value of key' 
			*         }
			*         -- or -- 
			* 	      key    : 23,
			*         value  : 'value of key'
			*    });
			*
			****** */
			insertInto : function(objOptions) {
				var defaults = {
					key : '',
					value : ''
				};
				var options = __.setDefaults(objOptions, defaults);

				// key/value passed as an object
				if ( typeof options.keyValue === 'object' ) {
					this[options.Collection].push(options.key);
				
				// key and value passed separately
				} else if ( options.key != '' ) {
					var key = Array();
					key[options.key] = options.value;
					this[options.Collection].push(key);

				// there was no key/value passed
				} else {
					console.log('A key/value was not passed correctly.');

				}
			},
			/* ******
			*
			* End
			*
			********************************************** */








			/* **********************************************
			*
			* insert a key/value into a schema
			*
			* Use :
			*    __.model.Collection.update(
			* 	     'nameOfCollection',
			*        { 'key' : theKey, 'equals' : '25' },
			*        { 'keyToUpdate' : 'New Value for Key' }
			*    );
			*
			****** */
			update : function(Collection, where, newKeys) {
				collection = this.returnCollection(Collection);

				needle = where['key'];
				val    = where['equals'];

				if ( typeof collection.length !== 'undefined' ) {
					for ( var i=0; i<collection.length; i++ ) {
						if ( typeof(collection[i][needle]) !== 'undefined' && collection[i][needle] == val ) {
							for ( var prop in newKeys ) {
								collection[i][prop] = newKeys[prop];
							}
						}
					}

					this.set({
						name  : Collection,
						model : collection
					});

				} else {
					for ( var prop in collection ) {

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
			* delete a key from a schema
			*
			* Use :
			*    __.model.schema.deleteFrom({
			* 	      schema : 'nameOfArray',
			* 	      key    : 23 // key to remove
			*    });
			*
			****** */
			deleteFrom : function(objOptions) {
				var defaults = { key : '' };
				var options = __.setDefaults(objOptions, defaults);

				// key was passed in
				if ( options.key != '' ) {
					this[options.Collection].splice(options.key,1);

				// no key was passed in
				} else {
					console.log('A key was not passed correctly.');

				}
			}
			/* ******
			*
			* End
			*
			********************************************** */

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
/*	dom : {
		extend : function(source, methods) {
			if ( typeof  this[source] == 'undefined' ) {
				this[source] = methods;
			} else {
				for ( var prop in methods ) {
					this[source][prop] = methods[prop];
				}	
			}
		}		
	}*/
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