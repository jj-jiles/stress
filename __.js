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




		/**
			@namespace
			Collection is a helper class that will
			make modeling application data easier
		*/
		Collection : {





			
			/**
				Returns a given collection
				Determines if the requested collection is set
				and is an object. If not, returns nothing
				and prints error to console.
			*/
			returnCollection : function(Collection, AllowEmpty) {

				if ( typeof Collection == 'object' ) {
					this.collection = Collection;
					return this.collection;

				} else {

					var arrColl = Collection.split('.');
					var AllowEmpty = (typeof AllowEmpty !== 'undefined')?AllowEmpty:false;
					if ( arrColl.length > 1 ) {
						arr = '';
						for ( var prop in arrColl ) {
							arr += "['" + arrColl[prop] + "']";
						}				
						collection = eval('this' + arr );
					} else {
						collection = this[Collection];
					}

					this.collection = collection;

					if ( typeof this.collection !== 'object' && !AllowEmpty) {
						console.log('The collection you requested is not an object');
						var trace = printStackTrace();
						//Output however you want!
						console.log(trace.join('\n\n'));
						return;

					} else {
						return this.collection;
					}

				}
			},
			/**
				End
			*/


			/**
				Determines is a given variable is an array
				@return boolean
			*/
			is_array : function(x) {
				return ( x instanceof Array );
			},
			/**
				End
			*/





			
			/**
				adds a data model to the schema
			*/
			set : function(objOptions) {
				var defaults = {
					name : '',
					model      : {}
				}
				var options = __.setDefaults(objOptions, defaults);

				if ( options.model instanceof Object ) {
					this[options.name] = options.model;
				} else {
					console.log('The model is not an object or array');
					var trace = printStackTrace();
					//Output however you want!
					console.log(trace.join('\n'));					
				}

			},
			/**
				End
			*/





			
			/**
				Returns a given collection			
			*/
			get : function(Collection, where, log) {
				collection = this.returnCollection(Collection, true);
				if ( typeof log !== 'undefined' ) {
					console.log(collection);
				}
				if ( typeof collection === 'undefined' ) {
					return false;
				} else {
					if ( typeof where === 'object' ) {
						needle = where['key'];
						val    = where['equals'];
						if ( collection instanceof Array ) {
							for ( var i=0; i<collection.length; i++ ) {
								if ( typeof(collection[i][needle]) !== 'undefined' && collection[i][needle] == val ) {
									return collection[i];
								}
							}
						} else {
							return collection[needle]
						}

					} else {
						if ( collection.hasOwnProperty(where) ) {
							return collection[where];
						
						} else if ( typeof where === 'undefined' ) {
							return collection;
						
						} else {
							return false;
						
						}
					}
				}

				return false;
			},
			/**
				End
			*/






			/**
				A simple console.log helper
				
				Use:
				__.model.Collection.log('CollectionName');
				
				instead of:
				console.log(__.model.Collection.get('CollectionName'));
			*/
			log : function(Collection) {
				collection = this.returnCollection(Collection);
				console.log(collection);
				var trace = printStackTrace();
				//Output however you want!
				console.log(trace.join('\n'));	
			},
			/**
				end
			*/






			/**
				Not used yet.
				This will part of collection validation
			*/
			isValid : function(Collection, Prototype) {
				var x = ( typeof Collection === "string") ? this.returnCollection(Collection + 'Prototype') : Prototype;
				var y = ( typeof Collection === "string") ? this.returnCollection(Collection) : Collection;
				
				// If both x and y are null or undefined and exactly the same
				if ( x === y ) {
					return true;
				}

				// If they are not strictly equal, they both need to be Objects
				if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
					return false;
				}

				// They must have the exact same prototype chain, the closest we can do is
				// test the constructor.
				if ( x.constructor !== y.constructor ) {
					return false;
				}

				for ( var p in x ) {

					// Inherited properties were tested using x.constructor === y.constructor
					if ( x.hasOwnProperty( p ) ) {

						if ( !x[ p ].hasOwnProperty('Type') ) {
							if ( typeof x[ p ] != typeof y[ p ]) {
								return false;
							}


							if ( typeof( x[ p ]) == 'object' && typeof( y[ p ] ) == 'object' ) {
								if ( ! this.isValid( y[ p ] , x[ p ] ) ) {
									return false;
								}
							}

						} else {

							if ( x[ p ].Type instanceof Object && y[ p ] instanceof Object ) {
								if ( ! this.isValid( y[ p ] , x[ p ].Type ) ) {
									return false;
								}
							}

							// Allows comparing x[ p ] and y[ p ] when set to undefined
							if ( ! y.hasOwnProperty( p ) ) {
								return false;
							}

					 		// If they have the same strict value or identity then they are equal
							if ( x[ p ] === y[ p ] ) {
								continue;
							}

							// Numbers, Strings, Functions, Booleans must be strictly equal
							if ( typeof( x[ p ].Type ) !== typeof( y[ p ]) ) {
								return false;
							}
						}
					}

				}

				for ( p in y ) {
					// allows x[ p ] to be set to undefined
					if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
						//return false;
					}
				}

				return true;

			},
			/**
				end
			*/






			/**
				Used to sort a Collection by a specific key
			
				Use:
				__.model.Collection.sortBy('CollectionName', 'KeyName', false, function(a){return a.toUpperCase()});
			*/
			sortBy : function(Collection, key, reverse, primer) {
				var collection = this.returnCollection(Collection);

				var TempArray = Array();
				var TempObject = {};
				var SortedCollection = Array();
				if ( collection instanceof Array ) {
					for ( i=0; i<collection.length; i++ ) {
						for ( var prop in collection[i] ) {
							if (prop == key ) {
								TempArray.push( collection[i][prop] );
								TempObject[ collection[i][prop] ] = collection[i];
							}
						}
					}

					TempArray.sort();

					for ( i=0; i<TempArray.length; i++ ) {
						SortedCollection.push(TempObject[TempArray[i]]);
					}
				}

				return SortedCollection;
			},
			/**
				end
			*/








			/**
			 
				simple check to see if a value exists within a given collection

				Use :
				__.model.collection.valueExists('GridViewProfile.Columns', {
					key : 'KeyName',
					equals : 'Value'
				});

				- or -

				__.model.collection.valueExists('GridViewProfile.Columns', {
					index : 45,
					equals : 'Value'
				});
			*/
			valueExists : function(Collection, where) {
				collection = this.returnCollection(Collection);

				if ( typeof where === 'object' ) {
					if ( where.index !== undefined ) {
						index = parseInt(where.index);
						return ( typeof collection[index] !== 'undefined' );
					} else {
						needle = (where.hasOwnProperty('key')) ? where['key'] : undefined;
						val    = where['value'];

						if ( needle !== undefined ) {
							return ( collection[needle].indexOf(val) > -1 );
						} else {
							return ( collection.indexOf(val) > -1 );
						}
					}
				} else {
					if ( collection.length !== undefined ) {
						return ( collection.indexOf(where) > -1 );
					} else {
						return ( collection.hasOwnProperty(where));
					}
				}

			},
			/**
				End
			*/






			/**
				Searches a collection for a given value
				Can compare against another object is one is specified

				@Collection : 'CollectionName'
				@where      : { 
								key        : 'NameofCollectionKey', 
								equals     : 'ValueOfKey' -or- Array,
								requires   : 'all|any',
								ignoreKeys : Array() 
							}
				@notIn      : { 
								list          : Array(), 
								CollectionKey : 'NameOfKeyInCollection', 
								ListKey       : 'IfListIsObjectSpecifyKey' 
							}

				ComparedAgainst = Array(0,2,3,4,5);
				CollectionObject = Array( { Id: 0, Title: 'A Title' }, { Id : 1, Title : 'Another Object', Id : 2, Title : 'This is cool', { Id : 3, Title : 'Another Test Object' } }

				__.model.Collection.search('CollectionObject', { key : 'Title', equals : 'Another'}, { list : ComparedAgainst, CollectionKey : 'Id' } );
				@returns 1 records because the Id for 'Another Test Object' is in the ComparedAgainst array
			 
			*/
			search : function(Collection, where, notIn) {
				var ItemsFound       = Array();
				var KeywordsList     = null;
				var KeywordsRequired = 'any';
				var IgnoreKeys       = null;

				if ( typeof notIn === 'object' ) {
					var notInList = ( notIn.hasOwnProperty('list') ) ? notIn.list : undefined;
					var CollectionKey = ( notIn.hasOwnProperty('CollectionKey') ) ? notIn.CollectionKey : undefined;
					var ListKey = ( notIn.hasOwnProperty('ListKey') ) ? notIn.ListKey : undefined;
				}
				
				if ( typeof where === 'object' ) {
					var needle = where['key'];

					if ( where['equals'] instanceof Array ) {
						KeywordsList = where['equals'];

					} else {
						//val = String(where['equals']).toLowerCase();
						if ( where.hasOwnProperty('key') ) {
							val = String(where['equals']).toLowerCase();
						} else {
							KeywordsList = Array();
							KeywordsList.push(where['equals']);
						}
					}

					if ( typeof where['requires'] !== 'undefined' ) {
						KeywordsRequired = where['requires'];
					}

					if ( where['ignoreKeys'] instanceof Array) {
						IgnoreKeys = where['ignoreKeys'];
					}

				}

				this.forEach(Collection, function(Item, Index) {					
					var strNeedle = String(Item[needle]).toLowerCase();
					var TotalKeywordsFound = 0;
					var KeywordsListReference = Array();

					//
					// Equals is an array list of keywords
					if ( KeywordsList !== null ) {

						for ( i=0; i<KeywordsList.length; i++ ) {
							KeywordsListReference[KeywordsList[i].toLowerCase()] = 0;
						}
						
						//
						// Loop through the list of keywords
						for (i=0; i<KeywordsList.length; i++) {

							keyword = KeywordsList[i].toLowerCase();

							//
							// Loop through each property of the Item
							for ( var prop in Item ) {
								// check to see if we need to ignore this property
								ignoreProp = ( typeof IgnoreKeys !== null && IgnoreKeys.indexOf(prop) > -1) ? true : false;

								if ( Item[prop] instanceof Object ) {
									for ( var ii in Item[prop] ) {
										propVal = Item[prop][ii].toLowerCase();
										//
										// if we don't need to ignore this property, see if the keyword is there
										if (!ignoreProp && propVal != "" && propVal.indexOf(keyword) > -1 ) {
											KeywordsListReference[keyword] = 1;
										}

									}
								} else {
									propVal = Item[prop].toLowerCase();
									//
									// if we don't need to ignore this property, see if the keyword is there
									if (!ignoreProp && propVal != "" && propVal.indexOf(keyword) > -1 ) {
										KeywordsListReference[keyword] = 1;
									}
								}

							}
						}

						for ( var prop in KeywordsListReference) {
							TotalKeywordsFound = TotalKeywordsFound+Number(KeywordsListReference[prop]);
						}

						//
						// search requires all keywords to be found in the Item
						if ( KeywordsRequired == 'all' && TotalKeywordsFound >= (KeywordsList.length) ) {
							ItemsFound.push(Item);

						//
						// search can have any of the keywords in the Item
						} else if ( KeywordsRequired == 'any' && TotalKeywordsFound > 0 ) {
							ItemsFound.push(Item);
						}


					} else {

						if ( strNeedle.indexOf(val) > -1 ) {
							if ( __.model.Collection.is_array(notInList) && notInList.length > 0 && ( notInList.indexOf(Item[CollectionKey]) < 0 ) ) {
								ItemsFound.push(Item);
							} else if ( (__.model.Collection.is_array(notInList) && notInList.length <= 0) ) {
								ItemsFound.push(Item);
							} else if ( notInList === 'undefined' || !__.model.Collection.is_array(notInList) ) {
								ItemsFound.push(Item);
							}
						}
					}

				});

				return ItemsFound;

			},
			/**
				End
			*/





			
			/**
				adds a forEach loop to a collection

				Use :
					__.model.collection.forEach('CollectionName', function(key, row) {
						console.log(this[row]);
					});
			*/
			forEach : function(collection, callback, where, offset, rowCount) {

					if ( typeof where !== 'undefined' ) {
						collection = this.get(collection, where);
					} else {
						collection = this.returnCollection(collection);
					}

				if ( typeof collection !== 'object' ) {
					console.log('The collection you requested is not an object');
					var trace = printStackTrace();
					//Output however you want!
					console.log(trace.join('\n\n'));
					return;

				} else {
					offset   = ( typeof offset !== 'undefined' ) ? offset : 0;
					rowCount = ( typeof rowCount !== 'undefined' ) ? offset+rowCount : collection.length;
					rowCount = ( rowCount > collection.length ) ? collection.length : rowCount;

					if ( collection instanceof Array ) {
						for ( var i=offset; i<rowCount; i++ ) {
							if ( typeof collection[i] != 'undefined' ) {
								callback.call(collection, collection[i], i, this);
							}
						}
					} else if ( collection instanceof Object ) {
						for ( var prop in collection ) {
							callback.call(collection, collection[prop], prop, i, this);
						}
					}
				}
			},
			/**
				End
			*/





			
			/**
				insert a key/value into a schema

				Use :
					__.model.schema.insertInto(
						'CollectionName',
						{
							key : 'key', 
							value : 'value of key' 
						}
					);
					-- or --
					__.model.schema.insertInto('CollectionName','SomeValue');
			*/
			insertInto : function(Collection, KeyValue) {
				collection  = this.returnCollection(Collection);

				// key/value passed as an object
				if (KeyValue instanceof Object && KeyValue.hasOwnProperty('key') ) {
					key = String(KeyValue['key']);
					val = KeyValue['value'];

					if ( typeof collection[key] === 'undefined' ) {
						if ( typeof(val) == 'object' ) {
							collection[key] = val;
						} else {
							collection[key] = val;
						}

					} else {
						collection[key].push(val);						
					}
				
				// key and value passed separately
				} else if (typeof KeyValue !== 'undefined' && collection instanceof Array ) {
					collection.push(KeyValue);

				// there was no key/value passed
				} else {
					console.log('A key/value was not passed correctly.');
					var trace = printStackTrace();
					//Output however you want!
					console.log(trace.join('\n'));
				}

				return collection;
			},
			/**
				End
			*/





			
			/**
				insert a key/value into a schema

				Use :
				__.model.Collection.update(
					'nameOfCollection',                     // Name of the Collection
					{ key : 'theKey', equals : '25' },    // Search criteria (where clause)
					{ 'keyToUpdate' : 'New Value for Key' } // Name of key to update and its value
				);
			*/
			update : function(Collection, where, newKeys) {
				collection = this.returnCollection(Collection);

				if ( where.index !== undefined ) {
					
					needle = parseInt(where['index']);
					val    = where['equals'];
					collection[needle] = val;

				} else {
					needle = where['key'];
					val    = where['equals'];

					if ( collection instanceof Array ) {
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


					} else if ( collection instanceof Object ) {
						for ( var CollectionKey in collection ) {
							if ( CollectionKey === key ) {
								for ( var prop in newKeys ) {
									collection[CollectionKey] = newKeys[prop];
								}
							}
						}
					} else {
						console.log('A key/value was not passed correctly.');
						var trace = printStackTrace();
						//Output however you want!
						console.log(trace.join('\n\n'));
					}
				}

				return collection;

			},
			/**
				End
			*/





			
			/**
				delete a key from a schema

				Use :
					// the Collection is an single dimension array/object
					// specify the Collection and the array key or property
					__.model.schema.deleteFrom({
						'CollectionName',    // Name of Collection
						key : [23|'keyname'] // key to remove
					});
					-- or if the you need to remove the key from an array within a collection --
					__.model.schema.deleteFrom({
						'CollectionName',  // Name of Collection
						{
							key : [23|'keyname'] // Property Name in the object
							value : 25           // key in array
						}
					});
			*/
			deleteFrom : function(Collection, where) {
				collection   = this.returnCollection(Collection);

				if ( where instanceof Object ) {
					needle = (where.hasOwnProperty('key')) ? where['key'] : undefined;
					val    = where['equals'];

					if ( collection instanceof Array ) {
						for ( i=0; i<collection.length; i++) {
							if ( collection[i].hasOwnProperty(needle) && collection[i][needle] === val ) {
								collection.splice(i,1);
							}
						}

					}

				} else {
					if ( collection instanceof Array ) {
						if ( typeof where === 'number' ) {
							collection.splice(where, 1);
						} else if ( typeof where === 'string' ) {
							where = collection.indexOf(where);
							collection.splice(where, 1);
						}

					} else { 
						if ( collection instanceof Array ) {
							where = collection.indexOf(where);
							collection.splice(where, 1);
						} else if ( collection instanceof Object ) {
							delete collection[where];
						}
					}
				}

				return collection;
			}
			/**
				End
			*/


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
};





// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)

/**
 * Main function giving a function stack trace with a forced or passed in Error
 *
 * @cfg {Error} e The error to create a stacktrace from (optional)
 * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
 * @return {Array} of Strings with functions, lines, files, and arguments where possible
 */
function printStackTrace(options) {
    options = options || {guess: true};
    var ex = options.e || null, guess = !!options.guess;
    var p = new printStackTrace.implementation(), result = p.run(ex);
    return (guess) ? p.guessAnonymousFunctions(result) : result;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = printStackTrace;
}

printStackTrace.implementation = function() {
};

printStackTrace.implementation.prototype = {
    /**
     * @param {Error} ex The error to create a stacktrace from (optional)
     * @param {String} mode Forced mode (optional, mostly for unit tests)
     */
    run: function(ex, mode) {
        ex = ex || this.createException();
        // examine exception properties w/o debugger
        //for (var prop in ex) {alert("Ex['" + prop + "']=" + ex[prop]);}
        mode = mode || this.mode(ex);
        if (mode === 'other') {
            return this.other(arguments.callee);
        } else {
            return this[mode](ex);
        }
    },

    createException: function() {
        try {
            this.undef();
        } catch (e) {
            return e;
        }
    },

    /**
     * Mode could differ for different exception, e.g.
     * exceptions in Chrome may or may not have arguments or stack.
     *
     * @return {String} mode of operation for the exception
     */
    mode: function(e) {
        if (e['arguments'] && e.stack) {
            return 'chrome';
        } else if (e.stack && e.sourceURL) {
            return 'safari';
        } else if (e.stack && e.number) {
            return 'ie';
        } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
            // e.message.indexOf("Backtrace:") > -1 -> opera
            // !e.stacktrace -> opera
            if (!e.stacktrace) {
                return 'opera9'; // use e.message
            }
            // 'opera#sourceloc' in e -> opera9, opera10a
            if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                return 'opera9'; // use e.message
            }
            // e.stacktrace && !e.stack -> opera10a
            if (!e.stack) {
                return 'opera10a'; // use e.stacktrace
            }
            // e.stacktrace && e.stack -> opera10b
            if (e.stacktrace.indexOf("called from line") < 0) {
                return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
            }
            // e.stacktrace && e.stack -> opera11
            return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
        } else if (e.stack) {
            return 'firefox';
        }
        return 'other';
    },

    /**
     * Given a context, function name, and callback function, overwrite it so that it calls
     * printStackTrace() first with a callback and then runs the rest of the body.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to instrument
     * @param {Function} function to call with a stack trace on invocation
     */
    instrumentFunction: function(context, functionName, callback) {
        context = context || window;
        var original = context[functionName];
        context[functionName] = function instrumented() {
            callback.call(this, printStackTrace().slice(4));
            return context[functionName]._instrumented.apply(this, arguments);
        };
        context[functionName]._instrumented = original;
    },

    /**
     * Given a context and function name of a function that has been
     * instrumented, revert the function to it's original (non-instrumented)
     * state.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to de-instrument
     */
    deinstrumentFunction: function(context, functionName) {
        if (context[functionName].constructor === Function &&
                context[functionName]._instrumented &&
                context[functionName]._instrumented.constructor === Function) {
            context[functionName] = context[functionName]._instrumented;
        }
    },

    /**
     * Given an Error object, return a formatted Array based on Chrome's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    chrome: function(e) {
        var stack = (e.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
          replace(/^\s+(at eval )?at\s+/gm, '').
          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
        stack.pop();
        return stack;
    },

    /**
     * Given an Error object, return a formatted Array based on Safari's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    safari: function(e) {
        return e.stack.replace(/\[native code\]\n/m, '')
            .replace(/^(?=\w+Error\:).*$\n/m, '')
            .replace(/^@/gm, '{anonymous}()@')
            .split('\n');
    },

    /**
     * Given an Error object, return a formatted Array based on IE's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    ie: function(e) {
        var lineRE = /^.*at (\w+) \(([^\)]+)\)$/gm;
        return e.stack.replace(/at Anonymous function /gm, '{anonymous}()@')
            .replace(/^(?=\w+Error\:).*$\n/m, '')
            .replace(lineRE, '$1@$2')
            .split('\n');
    },

    /**
     * Given an Error object, return a formatted Array based on Firefox's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    firefox: function(e) {
        return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^[\(@]/gm, '{anonymous}()@').split('\n');
    },

    opera11: function(e) {
        var ANON = '{anonymous}', lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var location = match[4] + ':' + match[1] + ':' + match[2];
                var fnName = match[3] || "global code";
                fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
                result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    opera10b: function(e) {
        // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
        // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
        // "@file://localhost/G:/js/test/functional/testcase1.html:15"
        var lineRE = /^(.*)@(.+):(\d+)$/;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i++) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[1]? (match[1] + '()') : "global code";
                result.push(fnName + '@' + match[2] + ':' + match[3]);
            }
        }

        return result;
    },

    /**
     * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    opera10a: function(e) {
        // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
        // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[3] || ANON;
                result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    // Opera 7.x-9.2x only!
    opera9: function(e) {
        // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
        // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
        var lines = e.message.split('\n'), result = [];

        for (var i = 2, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    // Safari 5-, IE 9-, and others
    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], fn, args, maxStackSize = 10;
        while (curr && curr['arguments'] && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments'] || []);
            stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
            curr = curr.caller;
        }
        return stack;
    },

    /**
     * Given arguments array as a String, subsituting type names for non-string types.
     *
     * @param {Arguments} args
     * @return {Array} of Strings with stringified arguments
     */
    stringifyArguments: function(args) {
        var result = [];
        var slice = Array.prototype.slice;
        for (var i = 0; i < args.length; ++i) {
            var arg = args[i];
            if (arg === undefined) {
                result[i] = 'undefined';
            } else if (arg === null) {
                result[i] = 'null';
            } else if (arg.constructor) {
                if (arg.constructor === Array) {
                    if (arg.length < 3) {
                        result[i] = '[' + this.stringifyArguments(arg) + ']';
                    } else {
                        result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
                    }
                } else if (arg.constructor === Object) {
                    result[i] = '#object';
                } else if (arg.constructor === Function) {
                    result[i] = '#function';
                } else if (arg.constructor === String) {
                    result[i] = '"' + arg + '"';
                } else if (arg.constructor === Number) {
                    result[i] = arg;
                }
            }
        }
        return result.join(',');
    },

    sourceCache: {},

    /**
     * @return the text from a given URL
     */
    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (req) {
            try {
                req.open('GET', url, false);
                //req.overrideMimeType('text/plain');
                //req.overrideMimeType('text/javascript');
                req.send(null);
                //return req.status == 200 ? req.responseText : '';
                return req.responseText;
            } catch (e) {
            }
        }
        return '';
    },

    /**
     * Try XHR methods in order and store XHR factory.
     *
     * @return <Function> XHR function or equivalent
     */
    createXMLHTTPObject: function() {
        var xmlhttp, XMLHttpFactories = [
            function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function() {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {
            }
        }
    },

    /**
     * Given a URL, check if it is in the same domain (so we can get the source
     * via Ajax).
     *
     * @param url <String> source url
     * @return False if we need a cross-domain request
     */
    isSameDomain: function(url) {
        return typeof location !== "undefined" && url.indexOf(location.hostname) !== -1; // location may not be defined, e.g. when running from nodejs.
    },

    /**
     * Get source code from given URL if in the same domain.
     *
     * @param url <String> JS source URL
     * @return <Array> Array of source code lines
     */
    getSource: function(url) {
        // TODO reuse source from script tags?
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessAnonymousFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /\{anonymous\}\(.*\)@(.*)/,
                reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
                frame = stack[i], ref = reStack.exec(frame);

            if (ref) {
                var m = reRef.exec(ref[1]);
                if (m) { // If falsey, we did not get any file/line information
                    var file = m[1], lineno = m[2], charno = m[3] || 0;
                    if (file && this.isSameDomain(file) && lineno) {
                        var functionName = this.guessAnonymousFunction(file, lineno, charno);
                        stack[i] = frame.replace('{anonymous}', functionName);
                    }
                }
            }
        }
        return stack;
    },

    guessAnonymousFunction: function(url, lineNo, charNo) {
        var ret;
        try {
            ret = this.findFunctionName(this.getSource(url), lineNo);
        } catch (e) {
            ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
        }
        return ret;
    },

    findFunctionName: function(source, lineNo) {
        // FIXME findFunctionName fails for compressed source
        // (more than one function on the same line)
        // function {name}({args}) m[1]=name m[2]=args
        var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
        // {name} = function ({args}) TODO args capture
        // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
        var reFunctionExpression = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;
        // {name} = eval()
        var reFunctionEvaluation = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
        // Walk backwards in the source lines until we find
        // the line which matches one of the patterns above
        var code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
        for (var i = 0; i < maxLines; ++i) {
            // lineNo is 1-based, source[] is 0-based
            line = source[lineNo - i - 1];
            commentPos = line.indexOf('//');
            if (commentPos >= 0) {
                line = line.substr(0, commentPos);
            }
            // TODO check other types of comments? Commented code may lead to false positive
            if (line) {
                code = line + code;
                m = reFunctionExpression.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
                m = reFunctionDeclaration.exec(code);
                if (m && m[1]) {
                    //return m[1] + "(" + (m[2] || "") + ")";
                    return m[1];
                }
                m = reFunctionEvaluation.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return '(?)';
    }
};