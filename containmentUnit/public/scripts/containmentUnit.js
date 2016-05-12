/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );

var require,define;(function(){function getInteractiveScript(){var a,b,c;if(interactiveScript&&interactiveScript.readyState==="interactive")return interactiveScript;a=document.getElementsByTagName("script");for(b=a.length-1;b>-1&&(c=a[b]);b--)if(c.readyState==="interactive")return interactiveScript=c;return null}function newContext(contextName){function loadPaused(a){a.prefix&&a.name.indexOf("__$p")===0&&defined[a.prefix]&&(a=makeModuleMap(a.originalName,a.parentMap));var b=a.prefix,c=a.fullName;!specified[c]&&!loaded[c]&&(specified[c]=!0,b?defined[b]?callPlugin(b,a):(pluginsQueue[b]||(pluginsQueue[b]=[],(managerCallbacks[b]||(managerCallbacks[b]=[])).push({onDep:function(a,c){if(a===b){var d,e,f=pluginsQueue[b];for(d=0;d<f.length;d++)e=f[d],callPlugin(b,makeModuleMap(e.originalName,e.parentMap));delete pluginsQueue[b]}}})),pluginsQueue[b].push(a)):req.load(context,c,a.url))}function callPlugin(pluginName,dep){var name=dep.name,fullName=dep.fullName,load;fullName in defined||fullName in loaded||(plugins[pluginName]||(plugins[pluginName]=defined[pluginName]),loaded[fullName]||(loaded[fullName]=!1),load=function(a){require.onPluginLoad&&require.onPluginLoad(context,pluginName,name,a),execManager({prefix:dep.prefix,name:dep.name,fullName:dep.fullName,callback:function(){return a}}),loaded[fullName]=!0},load.fromText=function(moduleName,text){var hasInteractive=useInteractive;context.loaded[moduleName]=!1,context.scriptCount+=1,hasInteractive&&(useInteractive=!1),eval(text),hasInteractive&&(useInteractive=!0),context.completeLoad(moduleName)},plugins[pluginName].load(name,makeRequire(dep.parentMap,!0),load,config))}function checkLoaded(){var a=config.waitSeconds*1e3,b=a&&context.startTime+a<(new Date).getTime(),c="",d=!1,e=!1,f,g,h;if(context.pausedCount>0)return undefined;if(config.priorityWait)if(isPriorityDone())resume();else return undefined;for(f in loaded)if(!(f in empty)){d=!0;if(!loaded[f])if(b)c+=f+" ";else{e=!0;break}}if(!d&&!context.waitCount)return undefined;if(b&&c){g=new Error("require.js load timeout for modules: "+c),g.requireType="timeout",g.requireModules=c;return req.onError(g)}if(e||context.scriptCount){(isBrowser||isWebWorker)&&setTimeout(checkLoaded,50);return undefined}if(context.waitCount){for(i=0;h=waitAry[i];i++)forceExec(h,{});checkLoaded();return undefined}req.checkReadyState();return undefined}function forceExec(a,b){if(a.isDone)return undefined;var c=a.fullName,d=a.depArray,e,f;if(c){if(b[c])return defined[c];b[c]=!0}for(f=0;f<d.length;f++)e=d[f],e&&(!a.deps[e]&&waiting[e]&&a.onDep(e,forceExec(waiting[e],b)));return c?defined[c]:undefined}function jQueryCheck(a){if(!context.jQuery){var b=a||(typeof jQuery!=="undefined"?jQuery:null);b&&"readyWait"in b&&(context.jQuery=b,callDefMain(["jquery",[],function(){return jQuery}]),context.scriptCount&&(b.readyWait+=1,context.jQueryIncremented=!0))}}function callDefMain(a){main.apply(null,a),loaded[a[0]]=!0}function main(a,b,c,d){var e=makeModuleMap(a,d),f=e.name,g=e.fullName,h={},i={waitId:f||reqWaitIdPrefix+waitIdCounter++,depCount:0,depMax:0,prefix:e.prefix,name:f,fullName:g,deps:{},depArray:b,callback:c,onDep:function(a,b){a in i.deps||(i.deps[a]=b,i.depCount+=1,i.depCount===i.depMax&&execManager(i))}},j,k,l,m;if(g){if(g in defined||loaded[g]===!0)return;specified[g]=!0,loaded[g]=!0,context.jQueryDef=g==="jquery"}for(j=0;j<b.length;j++)k=b[j],k&&(k=makeModuleMap(k,f?e:d),l=k.fullName,b[j]=l,l==="require"?i.deps[l]=makeRequire(e):l==="exports"?(i.deps[l]=defined[g]={},i.usingExports=!0):l==="module"?(i.cjsModule=m=i.deps[l]={id:f,uri:f?context.nameToUrl(f,null,d):undefined},m.setExports=makeSetExports(m)):l in defined&&!(l in waiting)?i.deps[l]=defined[l]:h[l]||(i.depMax+=1,queueDependency(k),(managerCallbacks[l]||(managerCallbacks[l]=[])).push(i),h[l]=!0));i.depCount===i.depMax?execManager(i):(waiting[i.waitId]=i,waitAry.push(i),context.waitCount+=1)}function execManager(a){var b,c,d,e=a.callback,f=a.fullName,g=[],h=a.depArray;if(e&&isFunction(e)){if(h)for(b=0;b<h.length;b++)g.push(a.deps[h[b]]);c=req.execCb(f,a.callback,g);if(f)if(!a.usingExports||c!==undefined||a.cjsModule&&"exports"in a.cjsModule)if(a.cjsModule&&"exports"in a.cjsModule)c=defined[f]=a.cjsModule.exports;else{if(f in defined&&!a.usingExports)return req.onError(new Error(f+" has already been defined"));defined[f]=c}else c=defined[f]}else f&&(c=defined[f]=e);if(f){d=managerCallbacks[f];if(d){for(b=0;b<d.length;b++)d[b].onDep(f,c);delete managerCallbacks[f]}}waiting[a.waitId]&&(delete waiting[a.waitId],a.isDone=!0,context.waitCount-=1,context.waitCount===0&&(waitAry=[]));return undefined}function queueDependency(a){var b=a.prefix,c=a.fullName;specified[c]||c in defined||(b&&!plugins[b]&&(plugins[b]=undefined,(normalizedWaiting[b]||(normalizedWaiting[b]=[])).push(a),(managerCallbacks[b]||(managerCallbacks[b]=[])).push({onDep:function(a,c){a===b&&updateNormalizedNames(b)}}),queueDependency(makeModuleMap(b))),context.paused.push(a))}function updateNormalizedNames(a){var b,c,d,e,f,g,h,i,j,k,l=normalizedWaiting[a];if(l)for(g=0;c=l[g];g++){b=c.fullName,d=makeModuleMap(c.originalName,c.parentMap),e=d.fullName,f=managerCallbacks[b]||[],k=managerCallbacks[e];if(e!==b){b in specified&&(delete specified[b],specified[e]=!0),k?managerCallbacks[e]=k.concat(f):managerCallbacks[e]=f,delete managerCallbacks[b];for(h=0;h<f.length;h++){j=f[h].depArray;for(i=0;i<j.length;i++)j[i]===b&&(j[i]=e)}}}delete normalizedWaiting[a]}function makeRequire(a,b){var c=makeContextModuleFunc(context.require,a,b);mixin(c,{nameToUrl:makeContextModuleFunc(context.nameToUrl,a),toUrl:makeContextModuleFunc(context.toUrl,a),isDefined:makeContextModuleFunc(context.isDefined,a),ready:req.ready,isBrowser:req.isBrowser}),req.paths&&(c.paths=req.paths);return c}function makeContextModuleFunc(a,b,c){return function(){var d=[].concat(aps.call(arguments,0)),e;c&&isFunction(e=d[d.length-1])&&(e.__requireJsBuild=!0),d.push(b);return a.apply(null,d)}}function makeSetExports(a){return function(b){a.exports=b}}function isPriorityDone(){var a=!0,b=config.priorityWait,c,d;if(b){for(d=0;c=b[d];d++)if(!loaded[c]){a=!1;break}a&&delete config.priorityWait}return a}function makeModuleMap(a,b){var c=a?a.indexOf("!"):-1,d=null,e=b?b.name:null,f=a,g,h,i;c!==-1&&(d=a.substring(0,c),a=a.substring(c+1,a.length)),d&&(d=normalize(d,e)),a&&(d?(i=defined[d],i?i.normalize?g=i.normalize(a,function(a){return normalize(a,e)}):g=normalize(a,e):g="__$p"+e+"@"+a):g=normalize(a,e),h=urlMap[g],h||(req.toModuleUrl?h=req.toModuleUrl(context,a,b):h=context.nameToUrl(a,null,b),urlMap[g]=h));return{prefix:d,name:g,parentMap:b,url:h,originalName:f,fullName:d?d+"!"+g:g}}function normalize(a,b){var c,d;a.charAt(0)==="."&&(b&&(config.pkgs[b]?b=[b]:(b=b.split("/"),b=b.slice(0,b.length-1)),a=b.concat(a.split("/")),trimDots(a),d=config.pkgs[c=a[0]],a=a.join("/"),d&&a===c+"/"+d.main&&(a=c)));return a}function trimDots(a){var b,c;for(b=0;c=a[b];b++)if(c===".")a.splice(b,1),b-=1;else if(c==="..")if(b!==1||a[2]!==".."&&a[0]!=="..")b>0&&(a.splice(b-1,2),b-=2);else break}var context,resume,config={waitSeconds:7,baseUrl:s.baseUrl||"./",paths:{},pkgs:{}},defQueue=[],specified={require:!0,exports:!0,module:!0},urlMap={},defined={},loaded={},waiting={},waitAry=[],waitIdCounter=0,managerCallbacks={},plugins={},pluginsQueue={},resumeDepth=0,normalizedWaiting={};resume=function(){var a,b,c;resumeDepth+=1,context.scriptCount<=0&&(context.scriptCount=0);while(defQueue.length){a=defQueue.shift();if(a[0]===null)return req.onError(new Error("Mismatched anonymous require.def modules"));callDefMain(a)}if(!config.priorityWait||isPriorityDone())while(context.paused.length){c=context.paused,context.pausedCount+=c.length,context.paused=[];for(b=0;a=c[b];b++)loadPaused(a);context.startTime=(new Date).getTime(),context.pausedCount-=c.length}resumeDepth===1&&checkLoaded(),resumeDepth-=1;return undefined},context={contextName:contextName,config:config,defQueue:defQueue,waiting:waiting,waitCount:0,specified:specified,loaded:loaded,urlMap:urlMap,scriptCount:0,urlFetched:{},defined:defined,paused:[],pausedCount:0,plugins:plugins,managerCallbacks:managerCallbacks,makeModuleMap:makeModuleMap,normalize:normalize,configure:function(a){var b,c,d,e,f,g;a.baseUrl&&(a.baseUrl.charAt(a.baseUrl.length-1)!=="/"&&(a.baseUrl+="/")),b=config.paths,d=config.packages,e=config.pkgs,mixin(config,a,!0);if(a.paths){for(c in a.paths)c in empty||(b[c]=a.paths[c]);config.paths=b}f=a.packagePaths;if(f||a.packages){if(f)for(c in f)c in empty||configurePackageDir(e,f[c],c);a.packages&&configurePackageDir(e,a.packages),config.pkgs=e}a.priority&&(g=context.requireWait,context.requireWait=!1,context.takeGlobalQueue(),resume(),context.require(a.priority),resume(),context.requireWait=g,config.priorityWait=a.priority),(a.deps||a.callback)&&context.require(a.deps||[],a.callback),a.ready&&req.ready(a.ready)},isDefined:function(a,b){return makeModuleMap(a,b).fullName in defined},require:function(a,b,c){var d,e,f;if(typeof a==="string"){if(req.get)return req.get(context,a,b);d=a,c=b,f=makeModuleMap(d,c),e=defined[f.fullName];if(e===undefined)return req.onError(new Error("require: module name '"+f.fullName+"' has not been loaded yet for context: "+contextName));return e}main(null,a,b,c);if(!context.requireWait)while(!context.scriptCount&&context.paused.length)resume();return undefined},takeGlobalQueue:function(){globalDefQueue.length&&(apsp.apply(context.defQueue,[context.defQueue.length-1,0].concat(globalDefQueue)),globalDefQueue=[])},completeLoad:function(a){var b;context.takeGlobalQueue();while(defQueue.length){b=defQueue.shift();if(b[0]===null){b[0]=a;break}if(b[0]===a)break;callDefMain(b),b=null}b?callDefMain(b):callDefMain([a,[],a==="jquery"&&typeof jQuery!=="undefined"?function(){return jQuery}:null]),loaded[a]=!0,jQueryCheck(),req.isAsync&&(context.scriptCount-=1),resume(),req.isAsync||(context.scriptCount-=1)},toUrl:function(a,b){var c=a.lastIndexOf("."),d=null;c!==-1&&(d=a.substring(c,a.length),a=a.substring(0,c));return context.nameToUrl(a,d,b)},nameToUrl:function(a,b,c){var d,e,f,g,h,i,j,k,l=context.config;if(a.indexOf("./")===0||a.indexOf("../")===0)h=c&&c.url?c.url.split("/"):[],h.length&&h.pop(),h=h.concat(a.split("/")),trimDots(h),k=h.join("/")+(b?b:req.jsExtRegExp.test(a)?"":".js");else{a=normalize(a,c);if(req.jsExtRegExp.test(a))k=a+(b?b:"");else{d=l.paths,e=l.pkgs,h=a.split("/");for(i=h.length;i>0;i--){j=h.slice(0,i).join("/");if(d[j]){h.splice(0,i,d[j]);break}if(f=e[j]){a===f.name?g=f.location+"/"+f.main:g=f.location+"/"+f.lib,h.splice(0,i,g);break}}k=h.join("/")+(b||".js"),k=(k.charAt(0)==="/"||k.match(/^\w+:/)?"":l.baseUrl)+k}}return l.urlArgs?k+((k.indexOf("?")===-1?"?":"&")+l.urlArgs):k}},context.jQueryCheck=jQueryCheck,context.resume=resume;return context}function configurePackageDir(a,b,c){var d,e,f;for(d=0;f=b[d];d++)f=typeof f==="string"?{name:f}:f,e=f.location,c&&(!e||e.indexOf("/")!==0&&e.indexOf(":")===-1)&&(e=c+"/"+(e||f.name)),a[f.name]={name:f.name,location:e||f.name,lib:f.lib||"lib",main:(f.main||"lib/main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}}function mixin(a,b,c){for(var d in b)!(d in empty)&&(!(d in a)||c)&&(a[d]=b[d]);return req}function isArray(a){return ostring.call(a)==="[object Array]"}function isFunction(a){return ostring.call(a)==="[object Function]"}var version="0.24.0",commentRegExp=/(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,cjsRequireRegExp=/require\(["']([^'"\s]+)["']\)/g,currDirRegExp=/^\.\//,jsSuffixRegExp=/\.js$/,ostring=Object.prototype.toString,ap=Array.prototype,aps=ap.slice,apsp=ap.splice,isBrowser=typeof window!=="undefined"&&navigator&&document,isWebWorker=!isBrowser&&typeof importScripts!=="undefined",readyRegExp=isBrowser&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",reqWaitIdPrefix="_r@@",empty={},contexts={},globalDefQueue=[],interactiveScript=null,isDone=!1,useInteractive=!1,req,cfg={},currentlyAddingScript,s,head,baseElement,scripts,script,src,subPath,mainScript,dataMain,i,scrollIntervalId,setReadyState,ctx;if(typeof require!=="undefined"){if(isFunction(require))return;cfg=require}req=require=function(a,b){var c=defContextName,d,e;!isArray(a)&&typeof a!=="string"&&(e=a,isArray(b)?(a=b,b=arguments[2]):a=[]),e&&e.context&&(c=e.context),d=contexts[c]||(contexts[c]=newContext(c)),e&&d.configure(e);return d.require(a,b)},req.version=version,req.isArray=isArray,req.isFunction=isFunction,req.mixin=mixin,req.jsExtRegExp=/^\/|:|\?|\.js$/,s=req.s={contexts:contexts,skipAsync:{},isPageLoaded:!isBrowser,readyCalls:[]},req.isAsync=req.isBrowser=isBrowser,isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=function(a){throw a},req.load=function(a,b,c){var d=a.contextName,e=a.urlFetched,f=a.loaded;isDone=!1,f[b]||(f[b]=!1),e[c]||(a.scriptCount+=1,req.attach(c,d,b),e[c]=!0,a.jQuery&&!a.jQueryIncremented&&(a.jQuery.readyWait+=1,a.jQueryIncremented=!0))},define=req.def=function(a,b,c){var d,e;typeof a!=="string"&&(c=b,b=a,a=null),req.isArray(b)||(c=b,b=[]),!a&&!b.length&&req.isFunction(c)&&(c.length&&(c.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(a,c){b.push(c)}),b=["require","exports","module"].concat(b)));if(useInteractive){d=currentlyAddingScript||getInteractiveScript();if(!d)return req.onError(new Error("ERROR: No matching script interactive for "+c));a||(a=d.getAttribute("data-requiremodule")),e=contexts[d.getAttribute("data-requirecontext")]}(e?e.defQueue:globalDefQueue).push([a,b,c]);return undefined},define.amd={multiversion:!0,plugins:!0},req.execCb=function(a,b,c){return b.apply(null,c)},req.onScriptLoad=function(a){var b=a.currentTarget||a.srcElement,c,d,e;if(a.type==="load"||readyRegExp.test(b.readyState))interactiveScript=null,c=b.getAttribute("data-requirecontext"),d=b.getAttribute("data-requiremodule"),e=contexts[c],contexts[c].completeLoad(d),b.detachEvent&&!isOpera?b.detachEvent("onreadystatechange",req.onScriptLoad):b.removeEventListener("load",req.onScriptLoad,!1)},req.attach=function(a,b,c,d,e){var f,g,h;if(isBrowser){d=d||req.onScriptLoad,f=document.createElement("script"),f.type=e||"text/javascript",f.charset="utf-8",f.async=!s.skipAsync[a],f.setAttribute("data-requirecontext",b),f.setAttribute("data-requiremodule",c),f.attachEvent&&!isOpera?(useInteractive=!0,f.attachEvent("onreadystatechange",d)):f.addEventListener("load",d,!1),f.src=a,currentlyAddingScript=f,baseElement?head.insertBefore(f,baseElement):head.appendChild(f),currentlyAddingScript=null;return f}isWebWorker&&(h=contexts[b],g=h.loaded,g[c]=!1,importScripts(a),h.completeLoad(c));return null};if(isBrowser){scripts=document.getElementsByTagName("script");for(i=scripts.length-1;i>-1&&(script=scripts[i]);i--){head||(head=script.parentNode);if(dataMain=script.getAttribute("data-main")){cfg.baseUrl||(src=dataMain.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath,dataMain=mainScript.replace(jsSuffixRegExp,"")),cfg.deps=cfg.deps?cfg.deps.concat(dataMain):[dataMain];break}}}s.baseUrl=cfg.baseUrl,req.pageLoaded=function(){s.isPageLoaded||(s.isPageLoaded=!0,scrollIntervalId&&clearInterval(scrollIntervalId),setReadyState&&(document.readyState="complete"),req.callReady())},req.checkReadyState=function(){var a=s.contexts,b;for(b in a)if(!(b in empty))if(a[b].waitCount)return;s.isDone=!0,req.callReady()},req.callReady=function(){var a=s.readyCalls,b,c,d,e,f;if(s.isPageLoaded&&s.isDone){if(a.length){s.readyCalls=[];for(b=0;c=a[b];b++)c()}d=s.contexts;for(f in d)f in empty||(e=d[f],e.jQueryIncremented&&(e.jQuery.ready(!0),e.jQueryIncremented=!1))}},req.ready=function(a){s.isPageLoaded&&s.isDone?a():s.readyCalls.push(a);return req},isBrowser&&(document.addEventListener?(document.addEventListener("DOMContentLoaded",req.pageLoaded,!1),window.addEventListener("load",req.pageLoaded,!1),document.readyState||(setReadyState=!0,document.readyState="loading")):window.attachEvent&&(window.attachEvent("onload",req.pageLoaded),self===self.top&&(scrollIntervalId=setInterval(function(){try{document.body&&(document.documentElement.doScroll("left"),req.pageLoaded())}catch(a){}},30))),document.readyState==="complete"&&req.pageLoaded()),req(cfg),req.isAsync&&typeof setTimeout!=="undefined"&&(ctx=s.contexts[cfg.context||defContextName],ctx.requireWait=!0,setTimeout(function(){ctx.requireWait=!1,ctx.takeGlobalQueue(),ctx.jQueryCheck(),ctx.scriptCount||ctx.resume(),req.checkReadyState()},0))})();
/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(o){var K=o.$LAB,y="UseLocalXHR",z="AlwaysPreserveOrder",u="AllowDuplicates",A="CacheBust",B="BasePath",C=/^[^?#]*\//.exec(location.href)[0],D=/^\w+\:\/\/\/?[^\/]+/.exec(C)[0],i=document.head||document.getElementsByTagName("head"),L=(o.opera&&Object.prototype.toString.call(o.opera)=="[object Opera]")||("MozAppearance"in document.documentElement.style),q=document.createElement("script"),E=typeof q.preload=="boolean",r=E||(q.readyState&&q.readyState=="uninitialized"),F=!r&&q.async===true,M=!r&&!F&&!L;function G(a){return Object.prototype.toString.call(a)=="[object Function]"}function H(a){return Object.prototype.toString.call(a)=="[object Array]"}function N(a,c){var b=/^\w+\:\/\//;if(/^\/\/\/?/.test(a)){a=location.protocol+a}else if(!b.test(a)&&a.charAt(0)!="/"){a=(c||"")+a}return b.test(a)?a:((a.charAt(0)=="/"?D:C)+a)}function s(a,c){for(var b in a){if(a.hasOwnProperty(b)){c[b]=a[b]}}return c}function O(a){var c=false;for(var b=0;b<a.scripts.length;b++){if(a.scripts[b].ready&&a.scripts[b].exec_trigger){c=true;a.scripts[b].exec_trigger();a.scripts[b].exec_trigger=null}}return c}function t(a,c,b,d){a.onload=a.onreadystatechange=function(){if((a.readyState&&a.readyState!="complete"&&a.readyState!="loaded")||c[b])return;a.onload=a.onreadystatechange=null;d()}}function I(a){a.ready=a.finished=true;for(var c=0;c<a.finished_listeners.length;c++){a.finished_listeners[c]()}a.ready_listeners=[];a.finished_listeners=[]}function P(d,f,e,g,h){setTimeout(function(){var a,c=f.real_src,b;if("item"in i){if(!i[0]){setTimeout(arguments.callee,25);return}i=i[0]}a=document.createElement("script");if(f.type)a.type=f.type;if(f.charset)a.charset=f.charset;if(h){if(r){e.elem=a;if(E){a.preload=true;a.onpreload=g}else{a.onreadystatechange=function(){if(a.readyState=="loaded")g()}}a.src=c}else if(h&&c.indexOf(D)==0&&d[y]){b=new XMLHttpRequest();b.onreadystatechange=function(){if(b.readyState==4){b.onreadystatechange=function(){};e.text=b.responseText+"\n//@ sourceURL="+c;g()}};b.open("GET",c);b.send()}else{a.type="text/cache-script";t(a,e,"ready",function(){i.removeChild(a);g()});a.src=c;i.insertBefore(a,i.firstChild)}}else if(F){a.async=false;t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}else{t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}},0)}function J(){var l={},Q=r||M,n=[],p={},m;l[y]=true;l[z]=false;l[u]=false;l[A]=false;l[B]="";function R(a,c,b){var d;function f(){if(d!=null){d=null;I(b)}}if(p[c.src].finished)return;if(!a[u])p[c.src].finished=true;d=b.elem||document.createElement("script");if(c.type)d.type=c.type;if(c.charset)d.charset=c.charset;t(d,b,"finished",f);if(b.elem){b.elem=null}else if(b.text){d.onload=d.onreadystatechange=null;d.text=b.text}else{d.src=c.real_src}i.insertBefore(d,i.firstChild);if(b.text){f()}}function S(c,b,d,f){var e,g,h=function(){b.ready_cb(b,function(){R(c,b,e)})},j=function(){b.finished_cb(b,d)};b.src=N(b.src,c[B]);b.real_src=b.src+(c[A]?((/\?.*$/.test(b.src)?"&_":"?_")+~~(Math.random()*1E9)+"="):"");if(!p[b.src])p[b.src]={items:[],finished:false};g=p[b.src].items;if(c[u]||g.length==0){e=g[g.length]={ready:false,finished:false,ready_listeners:[h],finished_listeners:[j]};P(c,b,e,((f)?function(){e.ready=true;for(var a=0;a<e.ready_listeners.length;a++){e.ready_listeners[a]()}e.ready_listeners=[]}:function(){I(e)}),f)}else{e=g[0];if(e.finished){j()}else{e.finished_listeners.push(j)}}}function v(){var e,g=s(l,{}),h=[],j=0,w=false,k;function T(a,c){a.ready=true;a.exec_trigger=c;x()}function U(a,c){a.ready=a.finished=true;a.exec_trigger=null;for(var b=0;b<c.scripts.length;b++){if(!c.scripts[b].finished)return}c.finished=true;x()}function x(){while(j<h.length){if(G(h[j])){try{h[j++]()}catch(err){}continue}else if(!h[j].finished){if(O(h[j]))continue;break}j++}if(j==h.length){w=false;k=false}}function V(){if(!k||!k.scripts){h.push(k={scripts:[],finished:true})}}e={script:function(){for(var f=0;f<arguments.length;f++){(function(a,c){var b;if(!H(a)){c=[a]}for(var d=0;d<c.length;d++){V();a=c[d];if(G(a))a=a();if(!a)continue;if(H(a)){b=[].slice.call(a);b.unshift(d,1);[].splice.apply(c,b);d--;continue}if(typeof a=="string")a={src:a};a=s(a,{ready:false,ready_cb:T,finished:false,finished_cb:U});k.finished=false;k.scripts.push(a);S(g,a,k,(Q&&w));w=true;if(g[z])e.wait()}})(arguments[f],arguments[f])}return e},wait:function(){if(arguments.length>0){for(var a=0;a<arguments.length;a++){h.push(arguments[a])}k=h[h.length-1]}else k=false;x();return e}};return{script:e.script,wait:e.wait,setOptions:function(a){s(a,g);return e}}}m={setGlobalDefaults:function(a){s(a,l);return m},setOptions:function(){return v().setOptions.apply(null,arguments)},script:function(){return v().script.apply(null,arguments)},wait:function(){return v().wait.apply(null,arguments)},queueScript:function(){n[n.length]={type:"script",args:[].slice.call(arguments)};return m},queueWait:function(){n[n.length]={type:"wait",args:[].slice.call(arguments)};return m},runQueue:function(){var a=m,c=n.length,b=c,d;for(;--b>=0;){d=n.shift();a=a[d.type].apply(null,d.args)}return a},noConflict:function(){o.$LAB=K;return m},sandbox:function(){return J()}};return m}o.$LAB=J();(function(a,c,b){if(document.readyState==null&&document[a]){document.readyState="loading";document[a](c,b=function(){document.removeEventListener(c,b,false);document.readyState="complete"},false)}})("addEventListener","DOMContentLoaded")})(this);
/*
 * File:        jquery.dataTables.min.js
 * Version:     1.8.2
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Info:        www.datatables.net
 * 
 * Copyright 2008-2011 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, as supplied with this software.
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
(function(i,za,p){i.fn.dataTableSettings=[];var D=i.fn.dataTableSettings;i.fn.dataTableExt={};var n=i.fn.dataTableExt;n.sVersion="1.8.2";n.sErrMode="alert";n.iApiIndex=0;n.oApi={};n.afnFiltering=[];n.aoFeatures=[];n.ofnSearch={};n.afnSortData=[];n.oStdClasses={sPagePrevEnabled:"paginate_enabled_previous",sPagePrevDisabled:"paginate_disabled_previous",sPageNextEnabled:"paginate_enabled_next",sPageNextDisabled:"paginate_disabled_next",sPageJUINext:"",sPageJUIPrev:"",sPageButton:"paginate_button",sPageButtonActive:"paginate_active",
sPageButtonStaticDisabled:"paginate_button paginate_button_disabled",sPageFirst:"first",sPagePrevious:"previous",sPageNext:"next",sPageLast:"last",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",
sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sFooterTH:""};n.oJUIClasses={sPagePrevEnabled:"fg-button ui-button ui-state-default ui-corner-left",
sPagePrevDisabled:"fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",sPageNextEnabled:"fg-button ui-button ui-state-default ui-corner-right",sPageNextDisabled:"fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",sPageJUINext:"ui-icon ui-icon-circle-arrow-e",sPageJUIPrev:"ui-icon ui-icon-circle-arrow-w",sPageButton:"fg-button ui-button ui-state-default",sPageButtonActive:"fg-button ui-button ui-state-default ui-state-disabled",sPageButtonStaticDisabled:"fg-button ui-button ui-state-default ui-state-disabled",
sPageFirst:"first ui-corner-tl ui-corner-bl",sPagePrevious:"previous",sPageNext:"next",sPageLast:"last ui-corner-tr ui-corner-br",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"ui-state-default",sSortDesc:"ui-state-default",sSortable:"ui-state-default",
sSortableAsc:"ui-state-default",sSortableDesc:"ui-state-default",sSortableNone:"ui-state-default",sSortColumn:"sorting_",sSortJUIAsc:"css_right ui-icon ui-icon-triangle-1-n",sSortJUIDesc:"css_right ui-icon ui-icon-triangle-1-s",sSortJUI:"css_right ui-icon ui-icon-carat-2-n-s",sSortJUIAscAllowed:"css_right ui-icon ui-icon-carat-1-n",sSortJUIDescAllowed:"css_right ui-icon ui-icon-carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollWrapper:"dataTables_scroll",
sScrollHead:"dataTables_scrollHead ui-state-default",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot ui-state-default",sScrollFootInner:"dataTables_scrollFootInner",sFooterTH:"ui-state-default"};n.oPagination={two_button:{fnInit:function(g,l,s){var t,w,y;if(g.bJUI){t=p.createElement("a");w=p.createElement("a");y=p.createElement("span");y.className=g.oClasses.sPageJUINext;w.appendChild(y);y=p.createElement("span");y.className=g.oClasses.sPageJUIPrev;
t.appendChild(y)}else{t=p.createElement("div");w=p.createElement("div")}t.className=g.oClasses.sPagePrevDisabled;w.className=g.oClasses.sPageNextDisabled;t.title=g.oLanguage.oPaginate.sPrevious;w.title=g.oLanguage.oPaginate.sNext;l.appendChild(t);l.appendChild(w);i(t).bind("click.DT",function(){g.oApi._fnPageChange(g,"previous")&&s(g)});i(w).bind("click.DT",function(){g.oApi._fnPageChange(g,"next")&&s(g)});i(t).bind("selectstart.DT",function(){return false});i(w).bind("selectstart.DT",function(){return false});
if(g.sTableId!==""&&typeof g.aanFeatures.p=="undefined"){l.setAttribute("id",g.sTableId+"_paginate");t.setAttribute("id",g.sTableId+"_previous");w.setAttribute("id",g.sTableId+"_next")}},fnUpdate:function(g){if(g.aanFeatures.p)for(var l=g.aanFeatures.p,s=0,t=l.length;s<t;s++)if(l[s].childNodes.length!==0){l[s].childNodes[0].className=g._iDisplayStart===0?g.oClasses.sPagePrevDisabled:g.oClasses.sPagePrevEnabled;l[s].childNodes[1].className=g.fnDisplayEnd()==g.fnRecordsDisplay()?g.oClasses.sPageNextDisabled:
g.oClasses.sPageNextEnabled}}},iFullNumbersShowPages:5,full_numbers:{fnInit:function(g,l,s){var t=p.createElement("span"),w=p.createElement("span"),y=p.createElement("span"),F=p.createElement("span"),x=p.createElement("span");t.innerHTML=g.oLanguage.oPaginate.sFirst;w.innerHTML=g.oLanguage.oPaginate.sPrevious;F.innerHTML=g.oLanguage.oPaginate.sNext;x.innerHTML=g.oLanguage.oPaginate.sLast;var v=g.oClasses;t.className=v.sPageButton+" "+v.sPageFirst;w.className=v.sPageButton+" "+v.sPagePrevious;F.className=
v.sPageButton+" "+v.sPageNext;x.className=v.sPageButton+" "+v.sPageLast;l.appendChild(t);l.appendChild(w);l.appendChild(y);l.appendChild(F);l.appendChild(x);i(t).bind("click.DT",function(){g.oApi._fnPageChange(g,"first")&&s(g)});i(w).bind("click.DT",function(){g.oApi._fnPageChange(g,"previous")&&s(g)});i(F).bind("click.DT",function(){g.oApi._fnPageChange(g,"next")&&s(g)});i(x).bind("click.DT",function(){g.oApi._fnPageChange(g,"last")&&s(g)});i("span",l).bind("mousedown.DT",function(){return false}).bind("selectstart.DT",
function(){return false});if(g.sTableId!==""&&typeof g.aanFeatures.p=="undefined"){l.setAttribute("id",g.sTableId+"_paginate");t.setAttribute("id",g.sTableId+"_first");w.setAttribute("id",g.sTableId+"_previous");F.setAttribute("id",g.sTableId+"_next");x.setAttribute("id",g.sTableId+"_last")}},fnUpdate:function(g,l){if(g.aanFeatures.p){var s=n.oPagination.iFullNumbersShowPages,t=Math.floor(s/2),w=Math.ceil(g.fnRecordsDisplay()/g._iDisplayLength),y=Math.ceil(g._iDisplayStart/g._iDisplayLength)+1,F=
"",x,v=g.oClasses;if(w<s){t=1;x=w}else if(y<=t){t=1;x=s}else if(y>=w-t){t=w-s+1;x=w}else{t=y-Math.ceil(s/2)+1;x=t+s-1}for(s=t;s<=x;s++)F+=y!=s?'<span class="'+v.sPageButton+'">'+s+"</span>":'<span class="'+v.sPageButtonActive+'">'+s+"</span>";x=g.aanFeatures.p;var z,$=function(M){g._iDisplayStart=(this.innerHTML*1-1)*g._iDisplayLength;l(g);M.preventDefault()},X=function(){return false};s=0;for(t=x.length;s<t;s++)if(x[s].childNodes.length!==0){z=i("span:eq(2)",x[s]);z.html(F);i("span",z).bind("click.DT",
$).bind("mousedown.DT",X).bind("selectstart.DT",X);z=x[s].getElementsByTagName("span");z=[z[0],z[1],z[z.length-2],z[z.length-1]];i(z).removeClass(v.sPageButton+" "+v.sPageButtonActive+" "+v.sPageButtonStaticDisabled);if(y==1){z[0].className+=" "+v.sPageButtonStaticDisabled;z[1].className+=" "+v.sPageButtonStaticDisabled}else{z[0].className+=" "+v.sPageButton;z[1].className+=" "+v.sPageButton}if(w===0||y==w||g._iDisplayLength==-1){z[2].className+=" "+v.sPageButtonStaticDisabled;z[3].className+=" "+
v.sPageButtonStaticDisabled}else{z[2].className+=" "+v.sPageButton;z[3].className+=" "+v.sPageButton}}}}}};n.oSort={"string-asc":function(g,l){if(typeof g!="string")g="";if(typeof l!="string")l="";g=g.toLowerCase();l=l.toLowerCase();return g<l?-1:g>l?1:0},"string-desc":function(g,l){if(typeof g!="string")g="";if(typeof l!="string")l="";g=g.toLowerCase();l=l.toLowerCase();return g<l?1:g>l?-1:0},"html-asc":function(g,l){g=g.replace(/<.*?>/g,"").toLowerCase();l=l.replace(/<.*?>/g,"").toLowerCase();return g<
l?-1:g>l?1:0},"html-desc":function(g,l){g=g.replace(/<.*?>/g,"").toLowerCase();l=l.replace(/<.*?>/g,"").toLowerCase();return g<l?1:g>l?-1:0},"date-asc":function(g,l){g=Date.parse(g);l=Date.parse(l);if(isNaN(g)||g==="")g=Date.parse("01/01/1970 00:00:00");if(isNaN(l)||l==="")l=Date.parse("01/01/1970 00:00:00");return g-l},"date-desc":function(g,l){g=Date.parse(g);l=Date.parse(l);if(isNaN(g)||g==="")g=Date.parse("01/01/1970 00:00:00");if(isNaN(l)||l==="")l=Date.parse("01/01/1970 00:00:00");return l-
g},"numeric-asc":function(g,l){return(g=="-"||g===""?0:g*1)-(l=="-"||l===""?0:l*1)},"numeric-desc":function(g,l){return(l=="-"||l===""?0:l*1)-(g=="-"||g===""?0:g*1)}};n.aTypes=[function(g){if(typeof g=="number")return"numeric";else if(typeof g!="string")return null;var l,s=false;l=g.charAt(0);if("0123456789-".indexOf(l)==-1)return null;for(var t=1;t<g.length;t++){l=g.charAt(t);if("0123456789.".indexOf(l)==-1)return null;if(l=="."){if(s)return null;s=true}}return"numeric"},function(g){var l=Date.parse(g);
if(l!==null&&!isNaN(l)||typeof g=="string"&&g.length===0)return"date";return null},function(g){if(typeof g=="string"&&g.indexOf("<")!=-1&&g.indexOf(">")!=-1)return"html";return null}];n.fnVersionCheck=function(g){var l=function(x,v){for(;x.length<v;)x+="0";return x},s=n.sVersion.split(".");g=g.split(".");for(var t="",w="",y=0,F=g.length;y<F;y++){t+=l(s[y],3);w+=l(g[y],3)}return parseInt(t,10)>=parseInt(w,10)};n._oExternConfig={iNextUnique:0};i.fn.dataTable=function(g){function l(){this.fnRecordsTotal=
function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsTotal,10):this.aiDisplayMaster.length};this.fnRecordsDisplay=function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsDisplay,10):this.aiDisplay.length};this.fnDisplayEnd=function(){return this.oFeatures.bServerSide?this.oFeatures.bPaginate===false||this._iDisplayLength==-1?this._iDisplayStart+this.aiDisplay.length:Math.min(this._iDisplayStart+this._iDisplayLength,this._iRecordsDisplay):this._iDisplayEnd};this.sInstance=
this.oInstance=null;this.oFeatures={bPaginate:true,bLengthChange:true,bFilter:true,bSort:true,bInfo:true,bAutoWidth:true,bProcessing:false,bSortClasses:true,bStateSave:false,bServerSide:false,bDeferRender:false};this.oScroll={sX:"",sXInner:"",sY:"",bCollapse:false,bInfinite:false,iLoadGap:100,iBarWidth:0,bAutoCss:true};this.aanFeatures=[];this.oLanguage={sProcessing:"Processing...",sLengthMenu:"Show _MENU_ entries",sZeroRecords:"No matching records found",sEmptyTable:"No data available in table",
sLoadingRecords:"Loading...",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sInfoThousands:",",sSearch:"Search:",sUrl:"",oPaginate:{sFirst:"First",sPrevious:"Previous",sNext:"Next",sLast:"Last"},fnInfoCallback:null};this.aoData=[];this.aiDisplay=[];this.aiDisplayMaster=[];this.aoColumns=[];this.aoHeader=[];this.aoFooter=[];this.iNextId=0;this.asDataSearch=[];this.oPreviousSearch={sSearch:"",
bRegex:false,bSmart:true};this.aoPreSearchCols=[];this.aaSorting=[[0,"asc",0]];this.aaSortingFixed=null;this.asStripeClasses=[];this.asDestroyStripes=[];this.sDestroyWidth=0;this.fnFooterCallback=this.fnHeaderCallback=this.fnRowCallback=null;this.aoDrawCallback=[];this.fnInitComplete=this.fnPreDrawCallback=null;this.sTableId="";this.nTableWrapper=this.nTBody=this.nTFoot=this.nTHead=this.nTable=null;this.bInitialised=this.bDeferLoading=false;this.aoOpenRows=[];this.sDom="lfrtip";this.sPaginationType=
"two_button";this.iCookieDuration=7200;this.sCookiePrefix="SpryMedia_DataTables_";this.fnCookieCallback=null;this.aoStateSave=[];this.aoStateLoad=[];this.sAjaxSource=this.oLoadedState=null;this.sAjaxDataProp="aaData";this.bAjaxDataGet=true;this.jqXHR=null;this.fnServerData=function(a,b,c,d){d.jqXHR=i.ajax({url:a,data:b,success:function(f){i(d.oInstance).trigger("xhr",d);c(f)},dataType:"json",cache:false,error:function(f,e){e=="parsererror"&&alert("DataTables warning: JSON data from server could not be parsed. This is caused by a JSON formatting error.")}})};
this.aoServerParams=[];this.fnFormatNumber=function(a){if(a<1E3)return a;else{var b=a+"";a=b.split("");var c="";b=b.length;for(var d=0;d<b;d++){if(d%3===0&&d!==0)c=this.oLanguage.sInfoThousands+c;c=a[b-d-1]+c}}return c};this.aLengthMenu=[10,25,50,100];this.bDrawing=this.iDraw=0;this.iDrawError=-1;this._iDisplayLength=10;this._iDisplayStart=0;this._iDisplayEnd=10;this._iRecordsDisplay=this._iRecordsTotal=0;this.bJUI=false;this.oClasses=n.oStdClasses;this.bSortCellsTop=this.bSorted=this.bFiltered=false;
this.oInit=null;this.aoDestroyCallback=[]}function s(a){return function(){var b=[A(this[n.iApiIndex])].concat(Array.prototype.slice.call(arguments));return n.oApi[a].apply(this,b)}}function t(a){var b,c,d=a.iInitDisplayStart;if(a.bInitialised===false)setTimeout(function(){t(a)},200);else{Aa(a);X(a);M(a,a.aoHeader);a.nTFoot&&M(a,a.aoFooter);K(a,true);a.oFeatures.bAutoWidth&&ga(a);b=0;for(c=a.aoColumns.length;b<c;b++)if(a.aoColumns[b].sWidth!==null)a.aoColumns[b].nTh.style.width=q(a.aoColumns[b].sWidth);
if(a.oFeatures.bSort)R(a);else if(a.oFeatures.bFilter)N(a,a.oPreviousSearch);else{a.aiDisplay=a.aiDisplayMaster.slice();E(a);C(a)}if(a.sAjaxSource!==null&&!a.oFeatures.bServerSide){c=[];ha(a,c);a.fnServerData.call(a.oInstance,a.sAjaxSource,c,function(f){var e=f;if(a.sAjaxDataProp!=="")e=aa(a.sAjaxDataProp)(f);for(b=0;b<e.length;b++)v(a,e[b]);a.iInitDisplayStart=d;if(a.oFeatures.bSort)R(a);else{a.aiDisplay=a.aiDisplayMaster.slice();E(a);C(a)}K(a,false);w(a,f)},a)}else if(!a.oFeatures.bServerSide){K(a,
false);w(a)}}}function w(a,b){a._bInitComplete=true;if(typeof a.fnInitComplete=="function")typeof b!="undefined"?a.fnInitComplete.call(a.oInstance,a,b):a.fnInitComplete.call(a.oInstance,a)}function y(a,b,c){a.oLanguage=i.extend(true,a.oLanguage,b);typeof b.sEmptyTable=="undefined"&&typeof b.sZeroRecords!="undefined"&&o(a.oLanguage,b,"sZeroRecords","sEmptyTable");typeof b.sLoadingRecords=="undefined"&&typeof b.sZeroRecords!="undefined"&&o(a.oLanguage,b,"sZeroRecords","sLoadingRecords");c&&t(a)}function F(a,
b){var c=a.aoColumns.length;b={sType:null,_bAutoType:true,bVisible:true,bSearchable:true,bSortable:true,asSorting:["asc","desc"],sSortingClass:a.oClasses.sSortable,sSortingClassJUI:a.oClasses.sSortJUI,sTitle:b?b.innerHTML:"",sName:"",sWidth:null,sWidthOrig:null,sClass:null,fnRender:null,bUseRendered:true,iDataSort:c,mDataProp:c,fnGetData:null,fnSetData:null,sSortDataType:"std",sDefaultContent:null,sContentPadding:"",nTh:b?b:p.createElement("th"),nTf:null};a.aoColumns.push(b);if(typeof a.aoPreSearchCols[c]==
"undefined"||a.aoPreSearchCols[c]===null)a.aoPreSearchCols[c]={sSearch:"",bRegex:false,bSmart:true};else{if(typeof a.aoPreSearchCols[c].bRegex=="undefined")a.aoPreSearchCols[c].bRegex=true;if(typeof a.aoPreSearchCols[c].bSmart=="undefined")a.aoPreSearchCols[c].bSmart=true}x(a,c,null)}function x(a,b,c){b=a.aoColumns[b];if(typeof c!="undefined"&&c!==null){if(typeof c.sType!="undefined"){b.sType=c.sType;b._bAutoType=false}o(b,c,"bVisible");o(b,c,"bSearchable");o(b,c,"bSortable");o(b,c,"sTitle");o(b,
c,"sName");o(b,c,"sWidth");o(b,c,"sWidth","sWidthOrig");o(b,c,"sClass");o(b,c,"fnRender");o(b,c,"bUseRendered");o(b,c,"iDataSort");o(b,c,"mDataProp");o(b,c,"asSorting");o(b,c,"sSortDataType");o(b,c,"sDefaultContent");o(b,c,"sContentPadding")}b.fnGetData=aa(b.mDataProp);b.fnSetData=Ba(b.mDataProp);if(!a.oFeatures.bSort)b.bSortable=false;if(!b.bSortable||i.inArray("asc",b.asSorting)==-1&&i.inArray("desc",b.asSorting)==-1){b.sSortingClass=a.oClasses.sSortableNone;b.sSortingClassJUI=""}else if(b.bSortable||
i.inArray("asc",b.asSorting)==-1&&i.inArray("desc",b.asSorting)==-1){b.sSortingClass=a.oClasses.sSortable;b.sSortingClassJUI=a.oClasses.sSortJUI}else if(i.inArray("asc",b.asSorting)!=-1&&i.inArray("desc",b.asSorting)==-1){b.sSortingClass=a.oClasses.sSortableAsc;b.sSortingClassJUI=a.oClasses.sSortJUIAscAllowed}else if(i.inArray("asc",b.asSorting)==-1&&i.inArray("desc",b.asSorting)!=-1){b.sSortingClass=a.oClasses.sSortableDesc;b.sSortingClassJUI=a.oClasses.sSortJUIDescAllowed}}function v(a,b){var c;
c=i.isArray(b)?b.slice():i.extend(true,{},b);b=a.aoData.length;var d={nTr:null,_iId:a.iNextId++,_aData:c,_anHidden:[],_sRowStripe:""};a.aoData.push(d);for(var f,e=0,h=a.aoColumns.length;e<h;e++){c=a.aoColumns[e];typeof c.fnRender=="function"&&c.bUseRendered&&c.mDataProp!==null&&O(a,b,e,c.fnRender({iDataRow:b,iDataColumn:e,aData:d._aData,oSettings:a}));if(c._bAutoType&&c.sType!="string"){f=G(a,b,e,"type");if(f!==null&&f!==""){f=ia(f);if(c.sType===null)c.sType=f;else if(c.sType!=f&&c.sType!="html")c.sType=
"string"}}}a.aiDisplayMaster.push(b);a.oFeatures.bDeferRender||z(a,b);return b}function z(a,b){var c=a.aoData[b],d;if(c.nTr===null){c.nTr=p.createElement("tr");typeof c._aData.DT_RowId!="undefined"&&c.nTr.setAttribute("id",c._aData.DT_RowId);typeof c._aData.DT_RowClass!="undefined"&&i(c.nTr).addClass(c._aData.DT_RowClass);for(var f=0,e=a.aoColumns.length;f<e;f++){var h=a.aoColumns[f];d=p.createElement("td");d.innerHTML=typeof h.fnRender=="function"&&(!h.bUseRendered||h.mDataProp===null)?h.fnRender({iDataRow:b,
iDataColumn:f,aData:c._aData,oSettings:a}):G(a,b,f,"display");if(h.sClass!==null)d.className=h.sClass;if(h.bVisible){c.nTr.appendChild(d);c._anHidden[f]=null}else c._anHidden[f]=d}}}function $(a){var b,c,d,f,e,h,j,k,m;if(a.bDeferLoading||a.sAjaxSource===null){j=a.nTBody.childNodes;b=0;for(c=j.length;b<c;b++)if(j[b].nodeName.toUpperCase()=="TR"){k=a.aoData.length;a.aoData.push({nTr:j[b],_iId:a.iNextId++,_aData:[],_anHidden:[],_sRowStripe:""});a.aiDisplayMaster.push(k);h=j[b].childNodes;d=e=0;for(f=
h.length;d<f;d++){m=h[d].nodeName.toUpperCase();if(m=="TD"||m=="TH"){O(a,k,e,i.trim(h[d].innerHTML));e++}}}}j=ba(a);h=[];b=0;for(c=j.length;b<c;b++){d=0;for(f=j[b].childNodes.length;d<f;d++){e=j[b].childNodes[d];m=e.nodeName.toUpperCase();if(m=="TD"||m=="TH")h.push(e)}}h.length!=j.length*a.aoColumns.length&&J(a,1,"Unexpected number of TD elements. Expected "+j.length*a.aoColumns.length+" and got "+h.length+". DataTables does not support rowspan / colspan in the table body, and there must be one cell for each row/column combination.");
d=0;for(f=a.aoColumns.length;d<f;d++){if(a.aoColumns[d].sTitle===null)a.aoColumns[d].sTitle=a.aoColumns[d].nTh.innerHTML;j=a.aoColumns[d]._bAutoType;m=typeof a.aoColumns[d].fnRender=="function";e=a.aoColumns[d].sClass!==null;k=a.aoColumns[d].bVisible;var u,r;if(j||m||e||!k){b=0;for(c=a.aoData.length;b<c;b++){u=h[b*f+d];if(j&&a.aoColumns[d].sType!="string"){r=G(a,b,d,"type");if(r!==""){r=ia(r);if(a.aoColumns[d].sType===null)a.aoColumns[d].sType=r;else if(a.aoColumns[d].sType!=r&&a.aoColumns[d].sType!=
"html")a.aoColumns[d].sType="string"}}if(m){r=a.aoColumns[d].fnRender({iDataRow:b,iDataColumn:d,aData:a.aoData[b]._aData,oSettings:a});u.innerHTML=r;a.aoColumns[d].bUseRendered&&O(a,b,d,r)}if(e)u.className+=" "+a.aoColumns[d].sClass;if(k)a.aoData[b]._anHidden[d]=null;else{a.aoData[b]._anHidden[d]=u;u.parentNode.removeChild(u)}}}}}function X(a){var b,c,d;a.nTHead.getElementsByTagName("tr");if(a.nTHead.getElementsByTagName("th").length!==0){b=0;for(d=a.aoColumns.length;b<d;b++){c=a.aoColumns[b].nTh;
a.aoColumns[b].sClass!==null&&i(c).addClass(a.aoColumns[b].sClass);if(a.aoColumns[b].sTitle!=c.innerHTML)c.innerHTML=a.aoColumns[b].sTitle}}else{var f=p.createElement("tr");b=0;for(d=a.aoColumns.length;b<d;b++){c=a.aoColumns[b].nTh;c.innerHTML=a.aoColumns[b].sTitle;a.aoColumns[b].sClass!==null&&i(c).addClass(a.aoColumns[b].sClass);f.appendChild(c)}i(a.nTHead).html("")[0].appendChild(f);Y(a.aoHeader,a.nTHead)}if(a.bJUI){b=0;for(d=a.aoColumns.length;b<d;b++){c=a.aoColumns[b].nTh;f=p.createElement("div");
f.className=a.oClasses.sSortJUIWrapper;i(c).contents().appendTo(f);var e=p.createElement("span");e.className=a.oClasses.sSortIcon;f.appendChild(e);c.appendChild(f)}}d=function(){this.onselectstart=function(){return false};return false};if(a.oFeatures.bSort)for(b=0;b<a.aoColumns.length;b++)if(a.aoColumns[b].bSortable!==false){ja(a,a.aoColumns[b].nTh,b);i(a.aoColumns[b].nTh).bind("mousedown.DT",d)}else i(a.aoColumns[b].nTh).addClass(a.oClasses.sSortableNone);a.oClasses.sFooterTH!==""&&i(a.nTFoot).children("tr").children("th").addClass(a.oClasses.sFooterTH);
if(a.nTFoot!==null){c=S(a,null,a.aoFooter);b=0;for(d=a.aoColumns.length;b<d;b++)if(typeof c[b]!="undefined")a.aoColumns[b].nTf=c[b]}}function M(a,b,c){var d,f,e,h=[],j=[],k=a.aoColumns.length;if(typeof c=="undefined")c=false;d=0;for(f=b.length;d<f;d++){h[d]=b[d].slice();h[d].nTr=b[d].nTr;for(e=k-1;e>=0;e--)!a.aoColumns[e].bVisible&&!c&&h[d].splice(e,1);j.push([])}d=0;for(f=h.length;d<f;d++){if(h[d].nTr){a=0;for(e=h[d].nTr.childNodes.length;a<e;a++)h[d].nTr.removeChild(h[d].nTr.childNodes[0])}e=0;
for(b=h[d].length;e<b;e++){k=c=1;if(typeof j[d][e]=="undefined"){h[d].nTr.appendChild(h[d][e].cell);for(j[d][e]=1;typeof h[d+c]!="undefined"&&h[d][e].cell==h[d+c][e].cell;){j[d+c][e]=1;c++}for(;typeof h[d][e+k]!="undefined"&&h[d][e].cell==h[d][e+k].cell;){for(a=0;a<c;a++)j[d+a][e+k]=1;k++}h[d][e].cell.rowSpan=c;h[d][e].cell.colSpan=k}}}}function C(a){var b,c,d=[],f=0,e=false;b=a.asStripeClasses.length;c=a.aoOpenRows.length;if(!(a.fnPreDrawCallback!==null&&a.fnPreDrawCallback.call(a.oInstance,a)===
false)){a.bDrawing=true;if(typeof a.iInitDisplayStart!="undefined"&&a.iInitDisplayStart!=-1){a._iDisplayStart=a.oFeatures.bServerSide?a.iInitDisplayStart:a.iInitDisplayStart>=a.fnRecordsDisplay()?0:a.iInitDisplayStart;a.iInitDisplayStart=-1;E(a)}if(a.bDeferLoading){a.bDeferLoading=false;a.iDraw++}else if(a.oFeatures.bServerSide){if(!a.bDestroying&&!Ca(a))return}else a.iDraw++;if(a.aiDisplay.length!==0){var h=a._iDisplayStart,j=a._iDisplayEnd;if(a.oFeatures.bServerSide){h=0;j=a.aoData.length}for(h=
h;h<j;h++){var k=a.aoData[a.aiDisplay[h]];k.nTr===null&&z(a,a.aiDisplay[h]);var m=k.nTr;if(b!==0){var u=a.asStripeClasses[f%b];if(k._sRowStripe!=u){i(m).removeClass(k._sRowStripe).addClass(u);k._sRowStripe=u}}if(typeof a.fnRowCallback=="function"){m=a.fnRowCallback.call(a.oInstance,m,a.aoData[a.aiDisplay[h]]._aData,f,h);if(!m&&!e){J(a,0,"A node was not returned by fnRowCallback");e=true}}d.push(m);f++;if(c!==0)for(k=0;k<c;k++)m==a.aoOpenRows[k].nParent&&d.push(a.aoOpenRows[k].nTr)}}else{d[0]=p.createElement("tr");
if(typeof a.asStripeClasses[0]!="undefined")d[0].className=a.asStripeClasses[0];e=a.oLanguage.sZeroRecords.replace("_MAX_",a.fnFormatNumber(a.fnRecordsTotal()));if(a.iDraw==1&&a.sAjaxSource!==null&&!a.oFeatures.bServerSide)e=a.oLanguage.sLoadingRecords;else if(typeof a.oLanguage.sEmptyTable!="undefined"&&a.fnRecordsTotal()===0)e=a.oLanguage.sEmptyTable;b=p.createElement("td");b.setAttribute("valign","top");b.colSpan=Z(a);b.className=a.oClasses.sRowEmpty;b.innerHTML=e;d[f].appendChild(b)}typeof a.fnHeaderCallback==
"function"&&a.fnHeaderCallback.call(a.oInstance,i(a.nTHead).children("tr")[0],ca(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay);typeof a.fnFooterCallback=="function"&&a.fnFooterCallback.call(a.oInstance,i(a.nTFoot).children("tr")[0],ca(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay);f=p.createDocumentFragment();b=p.createDocumentFragment();if(a.nTBody){e=a.nTBody.parentNode;b.appendChild(a.nTBody);if(!a.oScroll.bInfinite||!a._bInitComplete||a.bSorted||a.bFiltered){c=a.nTBody.childNodes;for(b=
c.length-1;b>=0;b--)c[b].parentNode.removeChild(c[b])}b=0;for(c=d.length;b<c;b++)f.appendChild(d[b]);a.nTBody.appendChild(f);e!==null&&e.appendChild(a.nTBody)}for(b=a.aoDrawCallback.length-1;b>=0;b--)a.aoDrawCallback[b].fn.call(a.oInstance,a);i(a.oInstance).trigger("draw",a);a.bSorted=false;a.bFiltered=false;a.bDrawing=false;if(a.oFeatures.bServerSide){K(a,false);typeof a._bInitComplete=="undefined"&&w(a)}}}function da(a){if(a.oFeatures.bSort)R(a,a.oPreviousSearch);else if(a.oFeatures.bFilter)N(a,
a.oPreviousSearch);else{E(a);C(a)}}function Ca(a){if(a.bAjaxDataGet){a.iDraw++;K(a,true);var b=Da(a);ha(a,b);a.fnServerData.call(a.oInstance,a.sAjaxSource,b,function(c){Ea(a,c)},a);return false}else return true}function Da(a){var b=a.aoColumns.length,c=[],d,f;c.push({name:"sEcho",value:a.iDraw});c.push({name:"iColumns",value:b});c.push({name:"sColumns",value:ka(a)});c.push({name:"iDisplayStart",value:a._iDisplayStart});c.push({name:"iDisplayLength",value:a.oFeatures.bPaginate!==false?a._iDisplayLength:
-1});for(f=0;f<b;f++){d=a.aoColumns[f].mDataProp;c.push({name:"mDataProp_"+f,value:typeof d=="function"?"function":d})}if(a.oFeatures.bFilter!==false){c.push({name:"sSearch",value:a.oPreviousSearch.sSearch});c.push({name:"bRegex",value:a.oPreviousSearch.bRegex});for(f=0;f<b;f++){c.push({name:"sSearch_"+f,value:a.aoPreSearchCols[f].sSearch});c.push({name:"bRegex_"+f,value:a.aoPreSearchCols[f].bRegex});c.push({name:"bSearchable_"+f,value:a.aoColumns[f].bSearchable})}}if(a.oFeatures.bSort!==false){d=
a.aaSortingFixed!==null?a.aaSortingFixed.length:0;var e=a.aaSorting.length;c.push({name:"iSortingCols",value:d+e});for(f=0;f<d;f++){c.push({name:"iSortCol_"+f,value:a.aaSortingFixed[f][0]});c.push({name:"sSortDir_"+f,value:a.aaSortingFixed[f][1]})}for(f=0;f<e;f++){c.push({name:"iSortCol_"+(f+d),value:a.aaSorting[f][0]});c.push({name:"sSortDir_"+(f+d),value:a.aaSorting[f][1]})}for(f=0;f<b;f++)c.push({name:"bSortable_"+f,value:a.aoColumns[f].bSortable})}return c}function ha(a,b){for(var c=0,d=a.aoServerParams.length;c<
d;c++)a.aoServerParams[c].fn.call(a.oInstance,b)}function Ea(a,b){if(typeof b.sEcho!="undefined")if(b.sEcho*1<a.iDraw)return;else a.iDraw=b.sEcho*1;if(!a.oScroll.bInfinite||a.oScroll.bInfinite&&(a.bSorted||a.bFiltered))la(a);a._iRecordsTotal=b.iTotalRecords;a._iRecordsDisplay=b.iTotalDisplayRecords;var c=ka(a);if(c=typeof b.sColumns!="undefined"&&c!==""&&b.sColumns!=c)var d=Fa(a,b.sColumns);b=aa(a.sAjaxDataProp)(b);for(var f=0,e=b.length;f<e;f++)if(c){for(var h=[],j=0,k=a.aoColumns.length;j<k;j++)h.push(b[f][d[j]]);
v(a,h)}else v(a,b[f]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=false;C(a);a.bAjaxDataGet=true;K(a,false)}function Aa(a){var b=p.createElement("div");a.nTable.parentNode.insertBefore(b,a.nTable);a.nTableWrapper=p.createElement("div");a.nTableWrapper.className=a.oClasses.sWrapper;a.sTableId!==""&&a.nTableWrapper.setAttribute("id",a.sTableId+"_wrapper");a.nTableReinsertBefore=a.nTable.nextSibling;for(var c=a.nTableWrapper,d=a.sDom.split(""),f,e,h,j,k,m,u,r=0;r<d.length;r++){e=0;h=d[r];if(h==
"<"){j=p.createElement("div");k=d[r+1];if(k=="'"||k=='"'){m="";for(u=2;d[r+u]!=k;){m+=d[r+u];u++}if(m=="H")m="fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix";else if(m=="F")m="fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix";if(m.indexOf(".")!=-1){k=m.split(".");j.setAttribute("id",k[0].substr(1,k[0].length-1));j.className=k[1]}else if(m.charAt(0)=="#")j.setAttribute("id",m.substr(1,m.length-1));else j.className=m;r+=u}c.appendChild(j);
c=j}else if(h==">")c=c.parentNode;else if(h=="l"&&a.oFeatures.bPaginate&&a.oFeatures.bLengthChange){f=Ga(a);e=1}else if(h=="f"&&a.oFeatures.bFilter){f=Ha(a);e=1}else if(h=="r"&&a.oFeatures.bProcessing){f=Ia(a);e=1}else if(h=="t"){f=Ja(a);e=1}else if(h=="i"&&a.oFeatures.bInfo){f=Ka(a);e=1}else if(h=="p"&&a.oFeatures.bPaginate){f=La(a);e=1}else if(n.aoFeatures.length!==0){j=n.aoFeatures;u=0;for(k=j.length;u<k;u++)if(h==j[u].cFeature){if(f=j[u].fnInit(a))e=1;break}}if(e==1&&f!==null){if(typeof a.aanFeatures[h]!=
"object")a.aanFeatures[h]=[];a.aanFeatures[h].push(f);c.appendChild(f)}}b.parentNode.replaceChild(a.nTableWrapper,b)}function Ja(a){if(a.oScroll.sX===""&&a.oScroll.sY==="")return a.nTable;var b=p.createElement("div"),c=p.createElement("div"),d=p.createElement("div"),f=p.createElement("div"),e=p.createElement("div"),h=p.createElement("div"),j=a.nTable.cloneNode(false),k=a.nTable.cloneNode(false),m=a.nTable.getElementsByTagName("thead")[0],u=a.nTable.getElementsByTagName("tfoot").length===0?null:a.nTable.getElementsByTagName("tfoot")[0],
r=typeof g.bJQueryUI!="undefined"&&g.bJQueryUI?n.oJUIClasses:n.oStdClasses;c.appendChild(d);e.appendChild(h);f.appendChild(a.nTable);b.appendChild(c);b.appendChild(f);d.appendChild(j);j.appendChild(m);if(u!==null){b.appendChild(e);h.appendChild(k);k.appendChild(u)}b.className=r.sScrollWrapper;c.className=r.sScrollHead;d.className=r.sScrollHeadInner;f.className=r.sScrollBody;e.className=r.sScrollFoot;h.className=r.sScrollFootInner;if(a.oScroll.bAutoCss){c.style.overflow="hidden";c.style.position="relative";
e.style.overflow="hidden";f.style.overflow="auto"}c.style.border="0";c.style.width="100%";e.style.border="0";d.style.width="150%";j.removeAttribute("id");j.style.marginLeft="0";a.nTable.style.marginLeft="0";if(u!==null){k.removeAttribute("id");k.style.marginLeft="0"}d=i(a.nTable).children("caption");h=0;for(k=d.length;h<k;h++)j.appendChild(d[h]);if(a.oScroll.sX!==""){c.style.width=q(a.oScroll.sX);f.style.width=q(a.oScroll.sX);if(u!==null)e.style.width=q(a.oScroll.sX);i(f).scroll(function(){c.scrollLeft=
this.scrollLeft;if(u!==null)e.scrollLeft=this.scrollLeft})}if(a.oScroll.sY!=="")f.style.height=q(a.oScroll.sY);a.aoDrawCallback.push({fn:Ma,sName:"scrolling"});a.oScroll.bInfinite&&i(f).scroll(function(){if(!a.bDrawing)if(i(this).scrollTop()+i(this).height()>i(a.nTable).height()-a.oScroll.iLoadGap)if(a.fnDisplayEnd()<a.fnRecordsDisplay()){ma(a,"next");E(a);C(a)}});a.nScrollHead=c;a.nScrollFoot=e;return b}function Ma(a){var b=a.nScrollHead.getElementsByTagName("div")[0],c=b.getElementsByTagName("table")[0],
d=a.nTable.parentNode,f,e,h,j,k,m,u,r,H=[],L=a.nTFoot!==null?a.nScrollFoot.getElementsByTagName("div")[0]:null,T=a.nTFoot!==null?L.getElementsByTagName("table")[0]:null,B=i.browser.msie&&i.browser.version<=7;h=a.nTable.getElementsByTagName("thead");h.length>0&&a.nTable.removeChild(h[0]);if(a.nTFoot!==null){k=a.nTable.getElementsByTagName("tfoot");k.length>0&&a.nTable.removeChild(k[0])}h=a.nTHead.cloneNode(true);a.nTable.insertBefore(h,a.nTable.childNodes[0]);if(a.nTFoot!==null){k=a.nTFoot.cloneNode(true);
a.nTable.insertBefore(k,a.nTable.childNodes[1])}if(a.oScroll.sX===""){d.style.width="100%";b.parentNode.style.width="100%"}var U=S(a,h);f=0;for(e=U.length;f<e;f++){u=Na(a,f);U[f].style.width=a.aoColumns[u].sWidth}a.nTFoot!==null&&P(function(I){I.style.width=""},k.getElementsByTagName("tr"));f=i(a.nTable).outerWidth();if(a.oScroll.sX===""){a.nTable.style.width="100%";if(B&&(d.scrollHeight>d.offsetHeight||i(d).css("overflow-y")=="scroll"))a.nTable.style.width=q(i(a.nTable).outerWidth()-a.oScroll.iBarWidth)}else if(a.oScroll.sXInner!==
"")a.nTable.style.width=q(a.oScroll.sXInner);else if(f==i(d).width()&&i(d).height()<i(a.nTable).height()){a.nTable.style.width=q(f-a.oScroll.iBarWidth);if(i(a.nTable).outerWidth()>f-a.oScroll.iBarWidth)a.nTable.style.width=q(f)}else a.nTable.style.width=q(f);f=i(a.nTable).outerWidth();e=a.nTHead.getElementsByTagName("tr");h=h.getElementsByTagName("tr");P(function(I,na){m=I.style;m.paddingTop="0";m.paddingBottom="0";m.borderTopWidth="0";m.borderBottomWidth="0";m.height=0;r=i(I).width();na.style.width=
q(r);H.push(r)},h,e);i(h).height(0);if(a.nTFoot!==null){j=k.getElementsByTagName("tr");k=a.nTFoot.getElementsByTagName("tr");P(function(I,na){m=I.style;m.paddingTop="0";m.paddingBottom="0";m.borderTopWidth="0";m.borderBottomWidth="0";m.height=0;r=i(I).width();na.style.width=q(r);H.push(r)},j,k);i(j).height(0)}P(function(I){I.innerHTML="";I.style.width=q(H.shift())},h);a.nTFoot!==null&&P(function(I){I.innerHTML="";I.style.width=q(H.shift())},j);if(i(a.nTable).outerWidth()<f){j=d.scrollHeight>d.offsetHeight||
i(d).css("overflow-y")=="scroll"?f+a.oScroll.iBarWidth:f;if(B&&(d.scrollHeight>d.offsetHeight||i(d).css("overflow-y")=="scroll"))a.nTable.style.width=q(j-a.oScroll.iBarWidth);d.style.width=q(j);b.parentNode.style.width=q(j);if(a.nTFoot!==null)L.parentNode.style.width=q(j);if(a.oScroll.sX==="")J(a,1,"The table cannot fit into the current element which will cause column misalignment. The table has been drawn at its minimum possible width.");else a.oScroll.sXInner!==""&&J(a,1,"The table cannot fit into the current element which will cause column misalignment. Increase the sScrollXInner value or remove it to allow automatic calculation")}else{d.style.width=
q("100%");b.parentNode.style.width=q("100%");if(a.nTFoot!==null)L.parentNode.style.width=q("100%")}if(a.oScroll.sY==="")if(B)d.style.height=q(a.nTable.offsetHeight+a.oScroll.iBarWidth);if(a.oScroll.sY!==""&&a.oScroll.bCollapse){d.style.height=q(a.oScroll.sY);B=a.oScroll.sX!==""&&a.nTable.offsetWidth>d.offsetWidth?a.oScroll.iBarWidth:0;if(a.nTable.offsetHeight<d.offsetHeight)d.style.height=q(i(a.nTable).height()+B)}B=i(a.nTable).outerWidth();c.style.width=q(B);b.style.width=q(B+a.oScroll.iBarWidth);
if(a.nTFoot!==null){L.style.width=q(a.nTable.offsetWidth+a.oScroll.iBarWidth);T.style.width=q(a.nTable.offsetWidth)}if(a.bSorted||a.bFiltered)d.scrollTop=0}function ea(a){if(a.oFeatures.bAutoWidth===false)return false;ga(a);for(var b=0,c=a.aoColumns.length;b<c;b++)a.aoColumns[b].nTh.style.width=a.aoColumns[b].sWidth}function Ha(a){var b=a.oLanguage.sSearch;b=b.indexOf("_INPUT_")!==-1?b.replace("_INPUT_",'<input type="text" />'):b===""?'<input type="text" />':b+' <input type="text" />';var c=p.createElement("div");
c.className=a.oClasses.sFilter;c.innerHTML="<label>"+b+"</label>";a.sTableId!==""&&typeof a.aanFeatures.f=="undefined"&&c.setAttribute("id",a.sTableId+"_filter");b=i("input",c);b.val(a.oPreviousSearch.sSearch.replace('"',"&quot;"));b.bind("keyup.DT",function(){for(var d=a.aanFeatures.f,f=0,e=d.length;f<e;f++)d[f]!=i(this).parents("div.dataTables_filter")[0]&&i("input",d[f]).val(this.value);this.value!=a.oPreviousSearch.sSearch&&N(a,{sSearch:this.value,bRegex:a.oPreviousSearch.bRegex,bSmart:a.oPreviousSearch.bSmart})});
b.bind("keypress.DT",function(d){if(d.keyCode==13)return false});return c}function N(a,b,c){Oa(a,b.sSearch,c,b.bRegex,b.bSmart);for(b=0;b<a.aoPreSearchCols.length;b++)Pa(a,a.aoPreSearchCols[b].sSearch,b,a.aoPreSearchCols[b].bRegex,a.aoPreSearchCols[b].bSmart);n.afnFiltering.length!==0&&Qa(a);a.bFiltered=true;i(a.oInstance).trigger("filter",a);a._iDisplayStart=0;E(a);C(a);oa(a,0)}function Qa(a){for(var b=n.afnFiltering,c=0,d=b.length;c<d;c++)for(var f=0,e=0,h=a.aiDisplay.length;e<h;e++){var j=a.aiDisplay[e-
f];if(!b[c](a,fa(a,j,"filter"),j)){a.aiDisplay.splice(e-f,1);f++}}}function Pa(a,b,c,d,f){if(b!==""){var e=0;b=pa(b,d,f);for(d=a.aiDisplay.length-1;d>=0;d--){f=qa(G(a,a.aiDisplay[d],c,"filter"),a.aoColumns[c].sType);if(!b.test(f)){a.aiDisplay.splice(d,1);e++}}}}function Oa(a,b,c,d,f){var e=pa(b,d,f);if(typeof c=="undefined"||c===null)c=0;if(n.afnFiltering.length!==0)c=1;if(b.length<=0){a.aiDisplay.splice(0,a.aiDisplay.length);a.aiDisplay=a.aiDisplayMaster.slice()}else if(a.aiDisplay.length==a.aiDisplayMaster.length||
a.oPreviousSearch.sSearch.length>b.length||c==1||b.indexOf(a.oPreviousSearch.sSearch)!==0){a.aiDisplay.splice(0,a.aiDisplay.length);oa(a,1);for(c=0;c<a.aiDisplayMaster.length;c++)e.test(a.asDataSearch[c])&&a.aiDisplay.push(a.aiDisplayMaster[c])}else{var h=0;for(c=0;c<a.asDataSearch.length;c++)if(!e.test(a.asDataSearch[c])){a.aiDisplay.splice(c-h,1);h++}}a.oPreviousSearch.sSearch=b;a.oPreviousSearch.bRegex=d;a.oPreviousSearch.bSmart=f}function oa(a,b){if(!a.oFeatures.bServerSide){a.asDataSearch.splice(0,
a.asDataSearch.length);b=typeof b!="undefined"&&b==1?a.aiDisplayMaster:a.aiDisplay;for(var c=0,d=b.length;c<d;c++)a.asDataSearch[c]=ra(a,fa(a,b[c],"filter"))}}function ra(a,b){var c="";if(typeof a.__nTmpFilter=="undefined")a.__nTmpFilter=p.createElement("div");for(var d=a.__nTmpFilter,f=0,e=a.aoColumns.length;f<e;f++)if(a.aoColumns[f].bSearchable)c+=qa(b[f],a.aoColumns[f].sType)+"  ";if(c.indexOf("&")!==-1){d.innerHTML=c;c=d.textContent?d.textContent:d.innerText;c=c.replace(/\n/g," ").replace(/\r/g,
"")}return c}function pa(a,b,c){if(c){a=b?a.split(" "):sa(a).split(" ");a="^(?=.*?"+a.join(")(?=.*?")+").*$";return new RegExp(a,"i")}else{a=b?a:sa(a);return new RegExp(a,"i")}}function qa(a,b){if(typeof n.ofnSearch[b]=="function")return n.ofnSearch[b](a);else if(b=="html")return a.replace(/\n/g," ").replace(/<.*?>/g,"");else if(typeof a=="string")return a.replace(/\n/g," ");else if(a===null)return"";return a}function R(a,b){var c,d,f,e,h=[],j=[],k=n.oSort;d=a.aoData;var m=a.aoColumns;if(!a.oFeatures.bServerSide&&
(a.aaSorting.length!==0||a.aaSortingFixed!==null)){h=a.aaSortingFixed!==null?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(c=0;c<h.length;c++){var u=h[c][0];f=ta(a,u);e=a.aoColumns[u].sSortDataType;if(typeof n.afnSortData[e]!="undefined"){var r=n.afnSortData[e](a,u,f);f=0;for(e=d.length;f<e;f++)O(a,f,u,r[f])}}c=0;for(d=a.aiDisplayMaster.length;c<d;c++)j[a.aiDisplayMaster[c]]=c;var H=h.length;a.aiDisplayMaster.sort(function(L,T){var B,U;for(c=0;c<H;c++){B=m[h[c][0]].iDataSort;U=m[B].sType;
B=k[(U?U:"string")+"-"+h[c][1]](G(a,L,B,"sort"),G(a,T,B,"sort"));if(B!==0)return B}return k["numeric-asc"](j[L],j[T])})}if((typeof b=="undefined"||b)&&!a.oFeatures.bDeferRender)V(a);a.bSorted=true;i(a.oInstance).trigger("sort",a);if(a.oFeatures.bFilter)N(a,a.oPreviousSearch,1);else{a.aiDisplay=a.aiDisplayMaster.slice();a._iDisplayStart=0;E(a);C(a)}}function ja(a,b,c,d){i(b).bind("click.DT",function(f){if(a.aoColumns[c].bSortable!==false){var e=function(){var h,j;if(f.shiftKey){for(var k=false,m=0;m<
a.aaSorting.length;m++)if(a.aaSorting[m][0]==c){k=true;h=a.aaSorting[m][0];j=a.aaSorting[m][2]+1;if(typeof a.aoColumns[h].asSorting[j]=="undefined")a.aaSorting.splice(m,1);else{a.aaSorting[m][1]=a.aoColumns[h].asSorting[j];a.aaSorting[m][2]=j}break}k===false&&a.aaSorting.push([c,a.aoColumns[c].asSorting[0],0])}else if(a.aaSorting.length==1&&a.aaSorting[0][0]==c){h=a.aaSorting[0][0];j=a.aaSorting[0][2]+1;if(typeof a.aoColumns[h].asSorting[j]=="undefined")j=0;a.aaSorting[0][1]=a.aoColumns[h].asSorting[j];
a.aaSorting[0][2]=j}else{a.aaSorting.splice(0,a.aaSorting.length);a.aaSorting.push([c,a.aoColumns[c].asSorting[0],0])}R(a)};if(a.oFeatures.bProcessing){K(a,true);setTimeout(function(){e();a.oFeatures.bServerSide||K(a,false)},0)}else e();typeof d=="function"&&d(a)}})}function V(a){var b,c,d,f,e,h=a.aoColumns.length,j=a.oClasses;for(b=0;b<h;b++)a.aoColumns[b].bSortable&&i(a.aoColumns[b].nTh).removeClass(j.sSortAsc+" "+j.sSortDesc+" "+a.aoColumns[b].sSortingClass);f=a.aaSortingFixed!==null?a.aaSortingFixed.concat(a.aaSorting):
a.aaSorting.slice();for(b=0;b<a.aoColumns.length;b++)if(a.aoColumns[b].bSortable){e=a.aoColumns[b].sSortingClass;d=-1;for(c=0;c<f.length;c++)if(f[c][0]==b){e=f[c][1]=="asc"?j.sSortAsc:j.sSortDesc;d=c;break}i(a.aoColumns[b].nTh).addClass(e);if(a.bJUI){c=i("span",a.aoColumns[b].nTh);c.removeClass(j.sSortJUIAsc+" "+j.sSortJUIDesc+" "+j.sSortJUI+" "+j.sSortJUIAscAllowed+" "+j.sSortJUIDescAllowed);c.addClass(d==-1?a.aoColumns[b].sSortingClassJUI:f[d][1]=="asc"?j.sSortJUIAsc:j.sSortJUIDesc)}}else i(a.aoColumns[b].nTh).addClass(a.aoColumns[b].sSortingClass);
e=j.sSortColumn;if(a.oFeatures.bSort&&a.oFeatures.bSortClasses){d=Q(a);if(a.oFeatures.bDeferRender)i(d).removeClass(e+"1 "+e+"2 "+e+"3");else if(d.length>=h)for(b=0;b<h;b++)if(d[b].className.indexOf(e+"1")!=-1){c=0;for(a=d.length/h;c<a;c++)d[h*c+b].className=i.trim(d[h*c+b].className.replace(e+"1",""))}else if(d[b].className.indexOf(e+"2")!=-1){c=0;for(a=d.length/h;c<a;c++)d[h*c+b].className=i.trim(d[h*c+b].className.replace(e+"2",""))}else if(d[b].className.indexOf(e+"3")!=-1){c=0;for(a=d.length/
h;c<a;c++)d[h*c+b].className=i.trim(d[h*c+b].className.replace(" "+e+"3",""))}j=1;var k;for(b=0;b<f.length;b++){k=parseInt(f[b][0],10);c=0;for(a=d.length/h;c<a;c++)d[h*c+k].className+=" "+e+j;j<3&&j++}}}function La(a){if(a.oScroll.bInfinite)return null;var b=p.createElement("div");b.className=a.oClasses.sPaging+a.sPaginationType;n.oPagination[a.sPaginationType].fnInit(a,b,function(c){E(c);C(c)});typeof a.aanFeatures.p=="undefined"&&a.aoDrawCallback.push({fn:function(c){n.oPagination[c.sPaginationType].fnUpdate(c,
function(d){E(d);C(d)})},sName:"pagination"});return b}function ma(a,b){var c=a._iDisplayStart;if(b=="first")a._iDisplayStart=0;else if(b=="previous"){a._iDisplayStart=a._iDisplayLength>=0?a._iDisplayStart-a._iDisplayLength:0;if(a._iDisplayStart<0)a._iDisplayStart=0}else if(b=="next")if(a._iDisplayLength>=0){if(a._iDisplayStart+a._iDisplayLength<a.fnRecordsDisplay())a._iDisplayStart+=a._iDisplayLength}else a._iDisplayStart=0;else if(b=="last")if(a._iDisplayLength>=0){b=parseInt((a.fnRecordsDisplay()-
1)/a._iDisplayLength,10)+1;a._iDisplayStart=(b-1)*a._iDisplayLength}else a._iDisplayStart=0;else J(a,0,"Unknown paging action: "+b);i(a.oInstance).trigger("page",a);return c!=a._iDisplayStart}function Ka(a){var b=p.createElement("div");b.className=a.oClasses.sInfo;if(typeof a.aanFeatures.i=="undefined"){a.aoDrawCallback.push({fn:Ra,sName:"information"});a.sTableId!==""&&b.setAttribute("id",a.sTableId+"_info")}return b}function Ra(a){if(!(!a.oFeatures.bInfo||a.aanFeatures.i.length===0)){var b=a._iDisplayStart+
1,c=a.fnDisplayEnd(),d=a.fnRecordsTotal(),f=a.fnRecordsDisplay(),e=a.fnFormatNumber(b),h=a.fnFormatNumber(c),j=a.fnFormatNumber(d),k=a.fnFormatNumber(f);if(a.oScroll.bInfinite)e=a.fnFormatNumber(1);e=a.fnRecordsDisplay()===0&&a.fnRecordsDisplay()==a.fnRecordsTotal()?a.oLanguage.sInfoEmpty+a.oLanguage.sInfoPostFix:a.fnRecordsDisplay()===0?a.oLanguage.sInfoEmpty+" "+a.oLanguage.sInfoFiltered.replace("_MAX_",j)+a.oLanguage.sInfoPostFix:a.fnRecordsDisplay()==a.fnRecordsTotal()?a.oLanguage.sInfo.replace("_START_",
e).replace("_END_",h).replace("_TOTAL_",k)+a.oLanguage.sInfoPostFix:a.oLanguage.sInfo.replace("_START_",e).replace("_END_",h).replace("_TOTAL_",k)+" "+a.oLanguage.sInfoFiltered.replace("_MAX_",a.fnFormatNumber(a.fnRecordsTotal()))+a.oLanguage.sInfoPostFix;if(a.oLanguage.fnInfoCallback!==null)e=a.oLanguage.fnInfoCallback(a,b,c,d,f,e);a=a.aanFeatures.i;b=0;for(c=a.length;b<c;b++)i(a[b]).html(e)}}function Ga(a){if(a.oScroll.bInfinite)return null;var b='<select size="1" '+(a.sTableId===""?"":'name="'+
a.sTableId+'_length"')+">",c,d;if(a.aLengthMenu.length==2&&typeof a.aLengthMenu[0]=="object"&&typeof a.aLengthMenu[1]=="object"){c=0;for(d=a.aLengthMenu[0].length;c<d;c++)b+='<option value="'+a.aLengthMenu[0][c]+'">'+a.aLengthMenu[1][c]+"</option>"}else{c=0;for(d=a.aLengthMenu.length;c<d;c++)b+='<option value="'+a.aLengthMenu[c]+'">'+a.aLengthMenu[c]+"</option>"}b+="</select>";var f=p.createElement("div");a.sTableId!==""&&typeof a.aanFeatures.l=="undefined"&&f.setAttribute("id",a.sTableId+"_length");
f.className=a.oClasses.sLength;f.innerHTML="<label>"+a.oLanguage.sLengthMenu.replace("_MENU_",b)+"</label>";i('select option[value="'+a._iDisplayLength+'"]',f).attr("selected",true);i("select",f).bind("change.DT",function(){var e=i(this).val(),h=a.aanFeatures.l;c=0;for(d=h.length;c<d;c++)h[c]!=this.parentNode&&i("select",h[c]).val(e);a._iDisplayLength=parseInt(e,10);E(a);if(a.fnDisplayEnd()==a.fnRecordsDisplay()){a._iDisplayStart=a.fnDisplayEnd()-a._iDisplayLength;if(a._iDisplayStart<0)a._iDisplayStart=
0}if(a._iDisplayLength==-1)a._iDisplayStart=0;C(a)});return f}function Ia(a){var b=p.createElement("div");a.sTableId!==""&&typeof a.aanFeatures.r=="undefined"&&b.setAttribute("id",a.sTableId+"_processing");b.innerHTML=a.oLanguage.sProcessing;b.className=a.oClasses.sProcessing;a.nTable.parentNode.insertBefore(b,a.nTable);return b}function K(a,b){if(a.oFeatures.bProcessing){a=a.aanFeatures.r;for(var c=0,d=a.length;c<d;c++)a[c].style.visibility=b?"visible":"hidden"}}function Na(a,b){for(var c=-1,d=0;d<
a.aoColumns.length;d++){a.aoColumns[d].bVisible===true&&c++;if(c==b)return d}return null}function ta(a,b){for(var c=-1,d=0;d<a.aoColumns.length;d++){a.aoColumns[d].bVisible===true&&c++;if(d==b)return a.aoColumns[d].bVisible===true?c:null}return null}function W(a,b){var c,d;c=a._iDisplayStart;for(d=a._iDisplayEnd;c<d;c++)if(a.aoData[a.aiDisplay[c]].nTr==b)return a.aiDisplay[c];c=0;for(d=a.aoData.length;c<d;c++)if(a.aoData[c].nTr==b)return c;return null}function Z(a){for(var b=0,c=0;c<a.aoColumns.length;c++)a.aoColumns[c].bVisible===
true&&b++;return b}function E(a){a._iDisplayEnd=a.oFeatures.bPaginate===false?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength>a.aiDisplay.length||a._iDisplayLength==-1?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength}function Sa(a,b){if(!a||a===null||a==="")return 0;if(typeof b=="undefined")b=p.getElementsByTagName("body")[0];var c=p.createElement("div");c.style.width=q(a);b.appendChild(c);a=c.offsetWidth;b.removeChild(c);return a}function ga(a){var b=0,c,d=0,f=a.aoColumns.length,e,h=i("th",
a.nTHead);for(e=0;e<f;e++)if(a.aoColumns[e].bVisible){d++;if(a.aoColumns[e].sWidth!==null){c=Sa(a.aoColumns[e].sWidthOrig,a.nTable.parentNode);if(c!==null)a.aoColumns[e].sWidth=q(c);b++}}if(f==h.length&&b===0&&d==f&&a.oScroll.sX===""&&a.oScroll.sY==="")for(e=0;e<a.aoColumns.length;e++){c=i(h[e]).width();if(c!==null)a.aoColumns[e].sWidth=q(c)}else{b=a.nTable.cloneNode(false);e=a.nTHead.cloneNode(true);d=p.createElement("tbody");c=p.createElement("tr");b.removeAttribute("id");b.appendChild(e);if(a.nTFoot!==
null){b.appendChild(a.nTFoot.cloneNode(true));P(function(k){k.style.width=""},b.getElementsByTagName("tr"))}b.appendChild(d);d.appendChild(c);d=i("thead th",b);if(d.length===0)d=i("tbody tr:eq(0)>td",b);h=S(a,e);for(e=d=0;e<f;e++){var j=a.aoColumns[e];if(j.bVisible&&j.sWidthOrig!==null&&j.sWidthOrig!=="")h[e-d].style.width=q(j.sWidthOrig);else if(j.bVisible)h[e-d].style.width="";else d++}for(e=0;e<f;e++)if(a.aoColumns[e].bVisible){d=Ta(a,e);if(d!==null){d=d.cloneNode(true);if(a.aoColumns[e].sContentPadding!==
"")d.innerHTML+=a.aoColumns[e].sContentPadding;c.appendChild(d)}}f=a.nTable.parentNode;f.appendChild(b);if(a.oScroll.sX!==""&&a.oScroll.sXInner!=="")b.style.width=q(a.oScroll.sXInner);else if(a.oScroll.sX!==""){b.style.width="";if(i(b).width()<f.offsetWidth)b.style.width=q(f.offsetWidth)}else if(a.oScroll.sY!=="")b.style.width=q(f.offsetWidth);b.style.visibility="hidden";Ua(a,b);f=i("tbody tr:eq(0)",b).children();if(f.length===0)f=S(a,i("thead",b)[0]);if(a.oScroll.sX!==""){for(e=d=c=0;e<a.aoColumns.length;e++)if(a.aoColumns[e].bVisible){c+=
a.aoColumns[e].sWidthOrig===null?i(f[d]).outerWidth():parseInt(a.aoColumns[e].sWidth.replace("px",""),10)+(i(f[d]).outerWidth()-i(f[d]).width());d++}b.style.width=q(c);a.nTable.style.width=q(c)}for(e=d=0;e<a.aoColumns.length;e++)if(a.aoColumns[e].bVisible){c=i(f[d]).width();if(c!==null&&c>0)a.aoColumns[e].sWidth=q(c);d++}a.nTable.style.width=q(i(b).outerWidth());b.parentNode.removeChild(b)}}function Ua(a,b){if(a.oScroll.sX===""&&a.oScroll.sY!==""){i(b).width();b.style.width=q(i(b).outerWidth()-a.oScroll.iBarWidth)}else if(a.oScroll.sX!==
"")b.style.width=q(i(b).outerWidth())}function Ta(a,b){var c=Va(a,b);if(c<0)return null;if(a.aoData[c].nTr===null){var d=p.createElement("td");d.innerHTML=G(a,c,b,"");return d}return Q(a,c)[b]}function Va(a,b){for(var c=-1,d=-1,f=0;f<a.aoData.length;f++){var e=G(a,f,b,"display")+"";e=e.replace(/<.*?>/g,"");if(e.length>c){c=e.length;d=f}}return d}function q(a){if(a===null)return"0px";if(typeof a=="number"){if(a<0)return"0px";return a+"px"}var b=a.charCodeAt(a.length-1);if(b<48||b>57)return a;return a+
"px"}function Za(a,b){if(a.length!=b.length)return 1;for(var c=0;c<a.length;c++)if(a[c]!=b[c])return 2;return 0}function ia(a){for(var b=n.aTypes,c=b.length,d=0;d<c;d++){var f=b[d](a);if(f!==null)return f}return"string"}function A(a){for(var b=0;b<D.length;b++)if(D[b].nTable==a)return D[b];return null}function ca(a){for(var b=[],c=a.aoData.length,d=0;d<c;d++)b.push(a.aoData[d]._aData);return b}function ba(a){for(var b=[],c=0,d=a.aoData.length;c<d;c++)a.aoData[c].nTr!==null&&b.push(a.aoData[c].nTr);
return b}function Q(a,b){var c=[],d,f,e,h,j;f=0;var k=a.aoData.length;if(typeof b!="undefined"){f=b;k=b+1}for(f=f;f<k;f++){j=a.aoData[f];if(j.nTr!==null){b=[];e=0;for(h=j.nTr.childNodes.length;e<h;e++){d=j.nTr.childNodes[e].nodeName.toLowerCase();if(d=="td"||d=="th")b.push(j.nTr.childNodes[e])}e=d=0;for(h=a.aoColumns.length;e<h;e++)if(a.aoColumns[e].bVisible)c.push(b[e-d]);else{c.push(j._anHidden[e]);d++}}}return c}function sa(a){return a.replace(new RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^)",
"g"),"\\$1")}function ua(a,b){for(var c=-1,d=0,f=a.length;d<f;d++)if(a[d]==b)c=d;else a[d]>b&&a[d]--;c!=-1&&a.splice(c,1)}function Fa(a,b){b=b.split(",");for(var c=[],d=0,f=a.aoColumns.length;d<f;d++)for(var e=0;e<f;e++)if(a.aoColumns[d].sName==b[e]){c.push(e);break}return c}function ka(a){for(var b="",c=0,d=a.aoColumns.length;c<d;c++)b+=a.aoColumns[c].sName+",";if(b.length==d)return"";return b.slice(0,-1)}function J(a,b,c){a=a.sTableId===""?"DataTables warning: "+c:"DataTables warning (table id = '"+
a.sTableId+"'): "+c;if(b===0)if(n.sErrMode=="alert")alert(a);else throw a;else typeof console!="undefined"&&typeof console.log!="undefined"&&console.log(a)}function la(a){a.aoData.splice(0,a.aoData.length);a.aiDisplayMaster.splice(0,a.aiDisplayMaster.length);a.aiDisplay.splice(0,a.aiDisplay.length);E(a)}function va(a){if(!(!a.oFeatures.bStateSave||typeof a.bDestroying!="undefined")){var b,c,d,f="{";f+='"iCreate":'+(new Date).getTime()+",";f+='"iStart":'+(a.oScroll.bInfinite?0:a._iDisplayStart)+",";
f+='"iEnd":'+(a.oScroll.bInfinite?a._iDisplayLength:a._iDisplayEnd)+",";f+='"iLength":'+a._iDisplayLength+",";f+='"sFilter":"'+encodeURIComponent(a.oPreviousSearch.sSearch)+'",';f+='"sFilterEsc":'+!a.oPreviousSearch.bRegex+",";f+='"aaSorting":[ ';for(b=0;b<a.aaSorting.length;b++)f+="["+a.aaSorting[b][0]+',"'+a.aaSorting[b][1]+'"],';f=f.substring(0,f.length-1);f+="],";f+='"aaSearchCols":[ ';for(b=0;b<a.aoPreSearchCols.length;b++)f+='["'+encodeURIComponent(a.aoPreSearchCols[b].sSearch)+'",'+!a.aoPreSearchCols[b].bRegex+
"],";f=f.substring(0,f.length-1);f+="],";f+='"abVisCols":[ ';for(b=0;b<a.aoColumns.length;b++)f+=a.aoColumns[b].bVisible+",";f=f.substring(0,f.length-1);f+="]";b=0;for(c=a.aoStateSave.length;b<c;b++){d=a.aoStateSave[b].fn(a,f);if(d!=="")f=d}f+="}";Wa(a.sCookiePrefix+a.sInstance,f,a.iCookieDuration,a.sCookiePrefix,a.fnCookieCallback)}}function Xa(a,b){if(a.oFeatures.bStateSave){var c,d,f;d=wa(a.sCookiePrefix+a.sInstance);if(d!==null&&d!==""){try{c=typeof i.parseJSON=="function"?i.parseJSON(d.replace(/'/g,
'"')):eval("("+d+")")}catch(e){return}d=0;for(f=a.aoStateLoad.length;d<f;d++)if(!a.aoStateLoad[d].fn(a,c))return;a.oLoadedState=i.extend(true,{},c);a._iDisplayStart=c.iStart;a.iInitDisplayStart=c.iStart;a._iDisplayEnd=c.iEnd;a._iDisplayLength=c.iLength;a.oPreviousSearch.sSearch=decodeURIComponent(c.sFilter);a.aaSorting=c.aaSorting.slice();a.saved_aaSorting=c.aaSorting.slice();if(typeof c.sFilterEsc!="undefined")a.oPreviousSearch.bRegex=!c.sFilterEsc;if(typeof c.aaSearchCols!="undefined")for(d=0;d<
c.aaSearchCols.length;d++)a.aoPreSearchCols[d]={sSearch:decodeURIComponent(c.aaSearchCols[d][0]),bRegex:!c.aaSearchCols[d][1]};if(typeof c.abVisCols!="undefined"){b.saved_aoColumns=[];for(d=0;d<c.abVisCols.length;d++){b.saved_aoColumns[d]={};b.saved_aoColumns[d].bVisible=c.abVisCols[d]}}}}}function Wa(a,b,c,d,f){var e=new Date;e.setTime(e.getTime()+c*1E3);c=za.location.pathname.split("/");a=a+"_"+c.pop().replace(/[\/:]/g,"").toLowerCase();var h;if(f!==null){h=typeof i.parseJSON=="function"?i.parseJSON(b):
eval("("+b+")");b=f(a,h,e.toGMTString(),c.join("/")+"/")}else b=a+"="+encodeURIComponent(b)+"; expires="+e.toGMTString()+"; path="+c.join("/")+"/";f="";e=9999999999999;if((wa(a)!==null?p.cookie.length:b.length+p.cookie.length)+10>4096){a=p.cookie.split(";");for(var j=0,k=a.length;j<k;j++)if(a[j].indexOf(d)!=-1){var m=a[j].split("=");try{h=eval("("+decodeURIComponent(m[1])+")")}catch(u){continue}if(typeof h.iCreate!="undefined"&&h.iCreate<e){f=m[0];e=h.iCreate}}if(f!=="")p.cookie=f+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+
c.join("/")+"/"}p.cookie=b}function wa(a){var b=za.location.pathname.split("/");a=a+"_"+b[b.length-1].replace(/[\/:]/g,"").toLowerCase()+"=";b=p.cookie.split(";");for(var c=0;c<b.length;c++){for(var d=b[c];d.charAt(0)==" ";)d=d.substring(1,d.length);if(d.indexOf(a)===0)return decodeURIComponent(d.substring(a.length,d.length))}return null}function Y(a,b){b=i(b).children("tr");var c,d,f,e,h,j,k,m,u=function(L,T,B){for(;typeof L[T][B]!="undefined";)B++;return B};a.splice(0,a.length);d=0;for(j=b.length;d<
j;d++)a.push([]);d=0;for(j=b.length;d<j;d++){f=0;for(k=b[d].childNodes.length;f<k;f++){c=b[d].childNodes[f];if(c.nodeName.toUpperCase()=="TD"||c.nodeName.toUpperCase()=="TH"){var r=c.getAttribute("colspan")*1,H=c.getAttribute("rowspan")*1;r=!r||r===0||r===1?1:r;H=!H||H===0||H===1?1:H;m=u(a,d,0);for(h=0;h<r;h++)for(e=0;e<H;e++){a[d+e][m+h]={cell:c,unique:r==1?true:false};a[d+e].nTr=b[d]}}}}}function S(a,b,c){var d=[];if(typeof c=="undefined"){c=a.aoHeader;if(typeof b!="undefined"){c=[];Y(c,b)}}b=0;
for(var f=c.length;b<f;b++)for(var e=0,h=c[b].length;e<h;e++)if(c[b][e].unique&&(typeof d[e]=="undefined"||!a.bSortCellsTop))d[e]=c[b][e].cell;return d}function Ya(){var a=p.createElement("p"),b=a.style;b.width="100%";b.height="200px";b.padding="0px";var c=p.createElement("div");b=c.style;b.position="absolute";b.top="0px";b.left="0px";b.visibility="hidden";b.width="200px";b.height="150px";b.padding="0px";b.overflow="hidden";c.appendChild(a);p.body.appendChild(c);b=a.offsetWidth;c.style.overflow="scroll";
a=a.offsetWidth;if(b==a)a=c.clientWidth;p.body.removeChild(c);return b-a}function P(a,b,c){for(var d=0,f=b.length;d<f;d++)for(var e=0,h=b[d].childNodes.length;e<h;e++)if(b[d].childNodes[e].nodeType==1)typeof c!="undefined"?a(b[d].childNodes[e],c[d].childNodes[e]):a(b[d].childNodes[e])}function o(a,b,c,d){if(typeof d=="undefined")d=c;if(typeof b[c]!="undefined")a[d]=b[c]}function fa(a,b,c){for(var d=[],f=0,e=a.aoColumns.length;f<e;f++)d.push(G(a,b,f,c));return d}function G(a,b,c,d){var f=a.aoColumns[c];
if((c=f.fnGetData(a.aoData[b]._aData))===undefined){if(a.iDrawError!=a.iDraw&&f.sDefaultContent===null){J(a,0,"Requested unknown parameter '"+f.mDataProp+"' from the data source for row "+b);a.iDrawError=a.iDraw}return f.sDefaultContent}if(c===null&&f.sDefaultContent!==null)c=f.sDefaultContent;else if(typeof c=="function")return c();if(d=="display"&&c===null)return"";return c}function O(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d)}function aa(a){if(a===null)return function(){return null};
else if(typeof a=="function")return function(c){return a(c)};else if(typeof a=="string"&&a.indexOf(".")!=-1){var b=a.split(".");return b.length==2?function(c){return c[b[0]][b[1]]}:b.length==3?function(c){return c[b[0]][b[1]][b[2]]}:function(c){for(var d=0,f=b.length;d<f;d++)c=c[b[d]];return c}}else return function(c){return c[a]}}function Ba(a){if(a===null)return function(){};else if(typeof a=="function")return function(c,d){return a(c,d)};else if(typeof a=="string"&&a.indexOf(".")!=-1){var b=a.split(".");
return b.length==2?function(c,d){c[b[0]][b[1]]=d}:b.length==3?function(c,d){c[b[0]][b[1]][b[2]]=d}:function(c,d){for(var f=0,e=b.length-1;f<e;f++)c=c[b[f]];c[b[b.length-1]]=d}}else return function(c,d){c[a]=d}}this.oApi={};this.fnDraw=function(a){var b=A(this[n.iApiIndex]);if(typeof a!="undefined"&&a===false){E(b);C(b)}else da(b)};this.fnFilter=function(a,b,c,d,f){var e=A(this[n.iApiIndex]);if(e.oFeatures.bFilter){if(typeof c=="undefined")c=false;if(typeof d=="undefined")d=true;if(typeof f=="undefined")f=
true;if(typeof b=="undefined"||b===null){N(e,{sSearch:a,bRegex:c,bSmart:d},1);if(f&&typeof e.aanFeatures.f!="undefined"){b=e.aanFeatures.f;c=0;for(d=b.length;c<d;c++)i("input",b[c]).val(a)}}else{e.aoPreSearchCols[b].sSearch=a;e.aoPreSearchCols[b].bRegex=c;e.aoPreSearchCols[b].bSmart=d;N(e,e.oPreviousSearch,1)}}};this.fnSettings=function(){return A(this[n.iApiIndex])};this.fnVersionCheck=n.fnVersionCheck;this.fnSort=function(a){var b=A(this[n.iApiIndex]);b.aaSorting=a;R(b)};this.fnSortListener=function(a,
b,c){ja(A(this[n.iApiIndex]),a,b,c)};this.fnAddData=function(a,b){if(a.length===0)return[];var c=[],d,f=A(this[n.iApiIndex]);if(typeof a[0]=="object")for(var e=0;e<a.length;e++){d=v(f,a[e]);if(d==-1)return c;c.push(d)}else{d=v(f,a);if(d==-1)return c;c.push(d)}f.aiDisplay=f.aiDisplayMaster.slice();if(typeof b=="undefined"||b)da(f);return c};this.fnDeleteRow=function(a,b,c){var d=A(this[n.iApiIndex]);a=typeof a=="object"?W(d,a):a;var f=d.aoData.splice(a,1),e=i.inArray(a,d.aiDisplay);d.asDataSearch.splice(e,
1);ua(d.aiDisplayMaster,a);ua(d.aiDisplay,a);typeof b=="function"&&b.call(this,d,f);if(d._iDisplayStart>=d.aiDisplay.length){d._iDisplayStart-=d._iDisplayLength;if(d._iDisplayStart<0)d._iDisplayStart=0}if(typeof c=="undefined"||c){E(d);C(d)}return f};this.fnClearTable=function(a){var b=A(this[n.iApiIndex]);la(b);if(typeof a=="undefined"||a)C(b)};this.fnOpen=function(a,b,c){var d=A(this[n.iApiIndex]);this.fnClose(a);var f=p.createElement("tr"),e=p.createElement("td");f.appendChild(e);e.className=c;
e.colSpan=Z(d);if(typeof b.jquery!="undefined"||typeof b=="object")e.appendChild(b);else e.innerHTML=b;b=i("tr",d.nTBody);i.inArray(a,b)!=-1&&i(f).insertAfter(a);d.aoOpenRows.push({nTr:f,nParent:a});return f};this.fnClose=function(a){for(var b=A(this[n.iApiIndex]),c=0;c<b.aoOpenRows.length;c++)if(b.aoOpenRows[c].nParent==a){(a=b.aoOpenRows[c].nTr.parentNode)&&a.removeChild(b.aoOpenRows[c].nTr);b.aoOpenRows.splice(c,1);return 0}return 1};this.fnGetData=function(a,b){var c=A(this[n.iApiIndex]);if(typeof a!=
"undefined"){a=typeof a=="object"?W(c,a):a;if(typeof b!="undefined")return G(c,a,b,"");return typeof c.aoData[a]!="undefined"?c.aoData[a]._aData:null}return ca(c)};this.fnGetNodes=function(a){var b=A(this[n.iApiIndex]);if(typeof a!="undefined")return typeof b.aoData[a]!="undefined"?b.aoData[a].nTr:null;return ba(b)};this.fnGetPosition=function(a){var b=A(this[n.iApiIndex]),c=a.nodeName.toUpperCase();if(c=="TR")return W(b,a);else if(c=="TD"||c=="TH"){c=W(b,a.parentNode);for(var d=Q(b,c),f=0;f<b.aoColumns.length;f++)if(d[f]==
a)return[c,ta(b,f),f]}return null};this.fnUpdate=function(a,b,c,d,f){var e=A(this[n.iApiIndex]);b=typeof b=="object"?W(e,b):b;if(i.isArray(a)&&typeof a=="object"){e.aoData[b]._aData=a.slice();for(c=0;c<e.aoColumns.length;c++)this.fnUpdate(G(e,b,c),b,c,false,false)}else if(a!==null&&typeof a=="object"){e.aoData[b]._aData=i.extend(true,{},a);for(c=0;c<e.aoColumns.length;c++)this.fnUpdate(G(e,b,c),b,c,false,false)}else{a=a;O(e,b,c,a);if(e.aoColumns[c].fnRender!==null){a=e.aoColumns[c].fnRender({iDataRow:b,
iDataColumn:c,aData:e.aoData[b]._aData,oSettings:e});e.aoColumns[c].bUseRendered&&O(e,b,c,a)}if(e.aoData[b].nTr!==null)Q(e,b)[c].innerHTML=a}c=i.inArray(b,e.aiDisplay);e.asDataSearch[c]=ra(e,fa(e,b,"filter"));if(typeof f=="undefined"||f)ea(e);if(typeof d=="undefined"||d)da(e);return 0};this.fnSetColumnVis=function(a,b,c){var d=A(this[n.iApiIndex]),f,e;e=d.aoColumns.length;var h,j;if(d.aoColumns[a].bVisible!=b){if(b){for(f=j=0;f<a;f++)d.aoColumns[f].bVisible&&j++;j=j>=Z(d);if(!j)for(f=a;f<e;f++)if(d.aoColumns[f].bVisible){h=
f;break}f=0;for(e=d.aoData.length;f<e;f++)if(d.aoData[f].nTr!==null)j?d.aoData[f].nTr.appendChild(d.aoData[f]._anHidden[a]):d.aoData[f].nTr.insertBefore(d.aoData[f]._anHidden[a],Q(d,f)[h])}else{f=0;for(e=d.aoData.length;f<e;f++)if(d.aoData[f].nTr!==null){h=Q(d,f)[a];d.aoData[f]._anHidden[a]=h;h.parentNode.removeChild(h)}}d.aoColumns[a].bVisible=b;M(d,d.aoHeader);d.nTFoot&&M(d,d.aoFooter);f=0;for(e=d.aoOpenRows.length;f<e;f++)d.aoOpenRows[f].nTr.colSpan=Z(d);if(typeof c=="undefined"||c){ea(d);C(d)}va(d)}};
this.fnPageChange=function(a,b){var c=A(this[n.iApiIndex]);ma(c,a);E(c);if(typeof b=="undefined"||b)C(c)};this.fnDestroy=function(){var a=A(this[n.iApiIndex]),b=a.nTableWrapper.parentNode,c=a.nTBody,d,f;a.bDestroying=true;d=0;for(f=a.aoDestroyCallback.length;d<f;d++)a.aoDestroyCallback[d].fn();d=0;for(f=a.aoColumns.length;d<f;d++)a.aoColumns[d].bVisible===false&&this.fnSetColumnVis(d,true);i(a.nTableWrapper).find("*").andSelf().unbind(".DT");i("tbody>tr>td."+a.oClasses.sRowEmpty,a.nTable).parent().remove();
if(a.nTable!=a.nTHead.parentNode){i(a.nTable).children("thead").remove();a.nTable.appendChild(a.nTHead)}if(a.nTFoot&&a.nTable!=a.nTFoot.parentNode){i(a.nTable).children("tfoot").remove();a.nTable.appendChild(a.nTFoot)}a.nTable.parentNode.removeChild(a.nTable);i(a.nTableWrapper).remove();a.aaSorting=[];a.aaSortingFixed=[];V(a);i(ba(a)).removeClass(a.asStripeClasses.join(" "));if(a.bJUI){i("th",a.nTHead).removeClass([n.oStdClasses.sSortable,n.oJUIClasses.sSortableAsc,n.oJUIClasses.sSortableDesc,n.oJUIClasses.sSortableNone].join(" "));
i("th span."+n.oJUIClasses.sSortIcon,a.nTHead).remove();i("th",a.nTHead).each(function(){var e=i("div."+n.oJUIClasses.sSortJUIWrapper,this),h=e.contents();i(this).append(h);e.remove()})}else i("th",a.nTHead).removeClass([n.oStdClasses.sSortable,n.oStdClasses.sSortableAsc,n.oStdClasses.sSortableDesc,n.oStdClasses.sSortableNone].join(" "));a.nTableReinsertBefore?b.insertBefore(a.nTable,a.nTableReinsertBefore):b.appendChild(a.nTable);d=0;for(f=a.aoData.length;d<f;d++)a.aoData[d].nTr!==null&&c.appendChild(a.aoData[d].nTr);
if(a.oFeatures.bAutoWidth===true)a.nTable.style.width=q(a.sDestroyWidth);i(c).children("tr:even").addClass(a.asDestroyStripes[0]);i(c).children("tr:odd").addClass(a.asDestroyStripes[1]);d=0;for(f=D.length;d<f;d++)D[d]==a&&D.splice(d,1);a=null};this.fnAdjustColumnSizing=function(a){var b=A(this[n.iApiIndex]);ea(b);if(typeof a=="undefined"||a)this.fnDraw(false);else if(b.oScroll.sX!==""||b.oScroll.sY!=="")this.oApi._fnScrollDraw(b)};for(var xa in n.oApi)if(xa)this[xa]=s(xa);this.oApi._fnExternApiFunc=
s;this.oApi._fnInitialise=t;this.oApi._fnInitComplete=w;this.oApi._fnLanguageProcess=y;this.oApi._fnAddColumn=F;this.oApi._fnColumnOptions=x;this.oApi._fnAddData=v;this.oApi._fnCreateTr=z;this.oApi._fnGatherData=$;this.oApi._fnBuildHead=X;this.oApi._fnDrawHead=M;this.oApi._fnDraw=C;this.oApi._fnReDraw=da;this.oApi._fnAjaxUpdate=Ca;this.oApi._fnAjaxParameters=Da;this.oApi._fnAjaxUpdateDraw=Ea;this.oApi._fnServerParams=ha;this.oApi._fnAddOptionsHtml=Aa;this.oApi._fnFeatureHtmlTable=Ja;this.oApi._fnScrollDraw=
Ma;this.oApi._fnAdjustColumnSizing=ea;this.oApi._fnFeatureHtmlFilter=Ha;this.oApi._fnFilterComplete=N;this.oApi._fnFilterCustom=Qa;this.oApi._fnFilterColumn=Pa;this.oApi._fnFilter=Oa;this.oApi._fnBuildSearchArray=oa;this.oApi._fnBuildSearchRow=ra;this.oApi._fnFilterCreateSearch=pa;this.oApi._fnDataToSearch=qa;this.oApi._fnSort=R;this.oApi._fnSortAttachListener=ja;this.oApi._fnSortingClasses=V;this.oApi._fnFeatureHtmlPaginate=La;this.oApi._fnPageChange=ma;this.oApi._fnFeatureHtmlInfo=Ka;this.oApi._fnUpdateInfo=
Ra;this.oApi._fnFeatureHtmlLength=Ga;this.oApi._fnFeatureHtmlProcessing=Ia;this.oApi._fnProcessingDisplay=K;this.oApi._fnVisibleToColumnIndex=Na;this.oApi._fnColumnIndexToVisible=ta;this.oApi._fnNodeToDataIndex=W;this.oApi._fnVisbleColumns=Z;this.oApi._fnCalculateEnd=E;this.oApi._fnConvertToWidth=Sa;this.oApi._fnCalculateColumnWidths=ga;this.oApi._fnScrollingWidthAdjust=Ua;this.oApi._fnGetWidestNode=Ta;this.oApi._fnGetMaxLenString=Va;this.oApi._fnStringToCss=q;this.oApi._fnArrayCmp=Za;this.oApi._fnDetectType=
ia;this.oApi._fnSettingsFromNode=A;this.oApi._fnGetDataMaster=ca;this.oApi._fnGetTrNodes=ba;this.oApi._fnGetTdNodes=Q;this.oApi._fnEscapeRegex=sa;this.oApi._fnDeleteIndex=ua;this.oApi._fnReOrderIndex=Fa;this.oApi._fnColumnOrdering=ka;this.oApi._fnLog=J;this.oApi._fnClearTable=la;this.oApi._fnSaveState=va;this.oApi._fnLoadState=Xa;this.oApi._fnCreateCookie=Wa;this.oApi._fnReadCookie=wa;this.oApi._fnDetectHeader=Y;this.oApi._fnGetUniqueThs=S;this.oApi._fnScrollBarWidth=Ya;this.oApi._fnApplyToChildren=
P;this.oApi._fnMap=o;this.oApi._fnGetRowData=fa;this.oApi._fnGetCellData=G;this.oApi._fnSetCellData=O;this.oApi._fnGetObjectDataFn=aa;this.oApi._fnSetObjectDataFn=Ba;var ya=this;return this.each(function(){var a=0,b,c,d,f;a=0;for(b=D.length;a<b;a++){if(D[a].nTable==this)if(typeof g=="undefined"||typeof g.bRetrieve!="undefined"&&g.bRetrieve===true)return D[a].oInstance;else if(typeof g.bDestroy!="undefined"&&g.bDestroy===true){D[a].oInstance.fnDestroy();break}else{J(D[a],0,"Cannot reinitialise DataTable.\n\nTo retrieve the DataTables object for this table, please pass either no arguments to the dataTable() function, or set bRetrieve to true. Alternatively, to destory the old table and create a new one, set bDestroy to true (note that a lot of changes to the configuration can be made through the API which is usually much faster).");
return}if(D[a].sTableId!==""&&D[a].sTableId==this.getAttribute("id")){D.splice(a,1);break}}var e=new l;D.push(e);var h=false,j=false;a=this.getAttribute("id");if(a!==null){e.sTableId=a;e.sInstance=a}else e.sInstance=n._oExternConfig.iNextUnique++;if(this.nodeName.toLowerCase()!="table")J(e,0,"Attempted to initialise DataTables on a node which is not a table: "+this.nodeName);else{e.nTable=this;e.oInstance=ya.length==1?ya:i(this).dataTable();e.oApi=ya.oApi;e.sDestroyWidth=i(this).width();if(typeof g!=
"undefined"&&g!==null){e.oInit=g;o(e.oFeatures,g,"bPaginate");o(e.oFeatures,g,"bLengthChange");o(e.oFeatures,g,"bFilter");o(e.oFeatures,g,"bSort");o(e.oFeatures,g,"bInfo");o(e.oFeatures,g,"bProcessing");o(e.oFeatures,g,"bAutoWidth");o(e.oFeatures,g,"bSortClasses");o(e.oFeatures,g,"bServerSide");o(e.oFeatures,g,"bDeferRender");o(e.oScroll,g,"sScrollX","sX");o(e.oScroll,g,"sScrollXInner","sXInner");o(e.oScroll,g,"sScrollY","sY");o(e.oScroll,g,"bScrollCollapse","bCollapse");o(e.oScroll,g,"bScrollInfinite",
"bInfinite");o(e.oScroll,g,"iScrollLoadGap","iLoadGap");o(e.oScroll,g,"bScrollAutoCss","bAutoCss");o(e,g,"asStripClasses","asStripeClasses");o(e,g,"asStripeClasses");o(e,g,"fnPreDrawCallback");o(e,g,"fnRowCallback");o(e,g,"fnHeaderCallback");o(e,g,"fnFooterCallback");o(e,g,"fnCookieCallback");o(e,g,"fnInitComplete");o(e,g,"fnServerData");o(e,g,"fnFormatNumber");o(e,g,"aaSorting");o(e,g,"aaSortingFixed");o(e,g,"aLengthMenu");o(e,g,"sPaginationType");o(e,g,"sAjaxSource");o(e,g,"sAjaxDataProp");o(e,
g,"iCookieDuration");o(e,g,"sCookiePrefix");o(e,g,"sDom");o(e,g,"bSortCellsTop");o(e,g,"oSearch","oPreviousSearch");o(e,g,"aoSearchCols","aoPreSearchCols");o(e,g,"iDisplayLength","_iDisplayLength");o(e,g,"bJQueryUI","bJUI");o(e.oLanguage,g,"fnInfoCallback");typeof g.fnDrawCallback=="function"&&e.aoDrawCallback.push({fn:g.fnDrawCallback,sName:"user"});typeof g.fnServerParams=="function"&&e.aoServerParams.push({fn:g.fnServerParams,sName:"user"});typeof g.fnStateSaveCallback=="function"&&e.aoStateSave.push({fn:g.fnStateSaveCallback,
sName:"user"});typeof g.fnStateLoadCallback=="function"&&e.aoStateLoad.push({fn:g.fnStateLoadCallback,sName:"user"});if(e.oFeatures.bServerSide&&e.oFeatures.bSort&&e.oFeatures.bSortClasses)e.aoDrawCallback.push({fn:V,sName:"server_side_sort_classes"});else e.oFeatures.bDeferRender&&e.aoDrawCallback.push({fn:V,sName:"defer_sort_classes"});if(typeof g.bJQueryUI!="undefined"&&g.bJQueryUI){e.oClasses=n.oJUIClasses;if(typeof g.sDom=="undefined")e.sDom='<"H"lfr>t<"F"ip>'}if(e.oScroll.sX!==""||e.oScroll.sY!==
"")e.oScroll.iBarWidth=Ya();if(typeof g.iDisplayStart!="undefined"&&typeof e.iInitDisplayStart=="undefined"){e.iInitDisplayStart=g.iDisplayStart;e._iDisplayStart=g.iDisplayStart}if(typeof g.bStateSave!="undefined"){e.oFeatures.bStateSave=g.bStateSave;Xa(e,g);e.aoDrawCallback.push({fn:va,sName:"state_save"})}if(typeof g.iDeferLoading!="undefined"){e.bDeferLoading=true;e._iRecordsTotal=g.iDeferLoading;e._iRecordsDisplay=g.iDeferLoading}if(typeof g.aaData!="undefined")j=true;if(typeof g!="undefined"&&
typeof g.aoData!="undefined")g.aoColumns=g.aoData;if(typeof g.oLanguage!="undefined")if(typeof g.oLanguage.sUrl!="undefined"&&g.oLanguage.sUrl!==""){e.oLanguage.sUrl=g.oLanguage.sUrl;i.getJSON(e.oLanguage.sUrl,null,function(u){y(e,u,true)});h=true}else y(e,g.oLanguage,false)}else g={};if(typeof g.asStripClasses=="undefined"&&typeof g.asStripeClasses=="undefined"){e.asStripeClasses.push(e.oClasses.sStripeOdd);e.asStripeClasses.push(e.oClasses.sStripeEven)}c=false;d=i(this).children("tbody").children("tr");
a=0;for(b=e.asStripeClasses.length;a<b;a++)if(d.filter(":lt(2)").hasClass(e.asStripeClasses[a])){c=true;break}if(c){e.asDestroyStripes=["",""];if(i(d[0]).hasClass(e.oClasses.sStripeOdd))e.asDestroyStripes[0]+=e.oClasses.sStripeOdd+" ";if(i(d[0]).hasClass(e.oClasses.sStripeEven))e.asDestroyStripes[0]+=e.oClasses.sStripeEven;if(i(d[1]).hasClass(e.oClasses.sStripeOdd))e.asDestroyStripes[1]+=e.oClasses.sStripeOdd+" ";if(i(d[1]).hasClass(e.oClasses.sStripeEven))e.asDestroyStripes[1]+=e.oClasses.sStripeEven;
d.removeClass(e.asStripeClasses.join(" "))}c=[];var k;a=this.getElementsByTagName("thead");if(a.length!==0){Y(e.aoHeader,a[0]);c=S(e)}if(typeof g.aoColumns=="undefined"){k=[];a=0;for(b=c.length;a<b;a++)k.push(null)}else k=g.aoColumns;a=0;for(b=k.length;a<b;a++){if(typeof g.saved_aoColumns!="undefined"&&g.saved_aoColumns.length==b){if(k[a]===null)k[a]={};k[a].bVisible=g.saved_aoColumns[a].bVisible}F(e,c?c[a]:null)}if(typeof g.aoColumnDefs!="undefined")for(a=g.aoColumnDefs.length-1;a>=0;a--){var m=
g.aoColumnDefs[a].aTargets;i.isArray(m)||J(e,1,"aTargets must be an array of targets, not a "+typeof m);c=0;for(d=m.length;c<d;c++)if(typeof m[c]=="number"&&m[c]>=0){for(;e.aoColumns.length<=m[c];)F(e);x(e,m[c],g.aoColumnDefs[a])}else if(typeof m[c]=="number"&&m[c]<0)x(e,e.aoColumns.length+m[c],g.aoColumnDefs[a]);else if(typeof m[c]=="string"){b=0;for(f=e.aoColumns.length;b<f;b++)if(m[c]=="_all"||i(e.aoColumns[b].nTh).hasClass(m[c]))x(e,b,g.aoColumnDefs[a])}}if(typeof k!="undefined"){a=0;for(b=k.length;a<
b;a++)x(e,a,k[a])}a=0;for(b=e.aaSorting.length;a<b;a++){if(e.aaSorting[a][0]>=e.aoColumns.length)e.aaSorting[a][0]=0;k=e.aoColumns[e.aaSorting[a][0]];if(typeof e.aaSorting[a][2]=="undefined")e.aaSorting[a][2]=0;if(typeof g.aaSorting=="undefined"&&typeof e.saved_aaSorting=="undefined")e.aaSorting[a][1]=k.asSorting[0];c=0;for(d=k.asSorting.length;c<d;c++)if(e.aaSorting[a][1]==k.asSorting[c]){e.aaSorting[a][2]=c;break}}V(e);a=i(this).children("thead");if(a.length===0){a=[p.createElement("thead")];this.appendChild(a[0])}e.nTHead=
a[0];a=i(this).children("tbody");if(a.length===0){a=[p.createElement("tbody")];this.appendChild(a[0])}e.nTBody=a[0];a=i(this).children("tfoot");if(a.length>0){e.nTFoot=a[0];Y(e.aoFooter,e.nTFoot)}if(j)for(a=0;a<g.aaData.length;a++)v(e,g.aaData[a]);else $(e);e.aiDisplay=e.aiDisplayMaster.slice();e.bInitialised=true;h===false&&t(e)}})}})(jQuery,window,document);

/*
 * File:        ColReorder.min.js
 * Version:     1.0.4
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * 
 * Copyright 2010-2011 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD (3 point) style license, as supplied with this software.
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
(function(f,o,i){function m(a){for(var c=[],d=0,b=a.length;d<b;d++)c[a[d]]=d;return c}function j(a,c,d){c=a.splice(c,1)[0];a.splice(d,0,c)}function n(a,c,d){for(var b=[],e=0,h=a.childNodes.length;e<h;e++)a.childNodes[e].nodeType==1&&b.push(a.childNodes[e]);c=b[c];d!==null?a.insertBefore(c,b[d]):a.appendChild(c)}f.fn.dataTableExt.oApi.fnColReorder=function(a,c,d){var b,e,h=a.aoColumns.length,g;if(c!=d)if(c<0||c>=h)this.oApi._fnLog(a,1,"ColReorder 'from' index is out of bounds: "+c);else if(d<0||d>=
h)this.oApi._fnLog(a,1,"ColReorder 'to' index is out of bounds: "+d);else{g=[];b=0;for(e=h;b<e;b++)g[b]=b;j(g,c,d);var k=m(g);b=0;for(e=a.aaSorting.length;b<e;b++)a.aaSorting[b][0]=k[a.aaSorting[b][0]];if(a.aaSortingFixed!==null){b=0;for(e=a.aaSortingFixed.length;b<e;b++)a.aaSortingFixed[b][0]=k[a.aaSortingFixed[b][0]]}b=0;for(e=h;b<e;b++)a.aoColumns[b].iDataSort=k[a.aoColumns[b].iDataSort];b=0;for(e=h;b<e;b++){g=a.aoColumns[b];if(typeof g.mDataProp=="number"){g.mDataProp=k[g.mDataProp];g.fnGetData=
a.oApi._fnGetObjectDataFn(g.mDataProp);g.fnSetData=a.oApi._fnSetObjectDataFn(g.mDataProp)}}if(a.aoColumns[c].bVisible){k=this.oApi._fnColumnIndexToVisible(a,c);var l=null;for(b=d<c?d:d+1;l===null&&b<h;){l=this.oApi._fnColumnIndexToVisible(a,b);b++}g=a.nTHead.getElementsByTagName("tr");b=0;for(e=g.length;b<e;b++)n(g[b],k,l);if(a.nTFoot!==null){g=a.nTFoot.getElementsByTagName("tr");b=0;for(e=g.length;b<e;b++)n(g[b],k,l)}b=0;for(e=a.aoData.length;b<e;b++)a.aoData[b].nTr!==null&&n(a.aoData[b].nTr,k,l)}j(a.aoColumns,
c,d);j(a.aoPreSearchCols,c,d);b=0;for(e=a.aoData.length;b<e;b++){f.isArray(a.aoData[b]._aData)&&j(a.aoData[b]._aData,c,d);j(a.aoData[b]._anHidden,c,d)}b=0;for(e=a.aoHeader.length;b<e;b++)j(a.aoHeader[b],c,d);if(a.aoFooter!==null){b=0;for(e=a.aoFooter.length;b<e;b++)j(a.aoFooter[b],c,d)}b=0;for(e=h;b<e;b++){f(a.aoColumns[b].nTh).unbind("click");this.oApi._fnSortAttachListener(a,a.aoColumns[b].nTh,b)}typeof ColVis!="undefined"&&ColVis.fnRebuild(a.oInstance);typeof a.oInstance._oPluginFixedHeader!="undefined"&&
a.oInstance._oPluginFixedHeader.fnUpdate()}};ColReorder=function(a,c){if(!this.CLASS||this.CLASS!="ColReorder")alert("Warning: ColReorder must be initialised with the keyword 'new'");if(typeof c=="undefined")c={};this.s={dt:null,init:c,fixed:0,dropCallback:null,mouse:{startX:-1,startY:-1,offsetX:-1,offsetY:-1,target:-1,targetIndex:-1,fromIndex:-1},aoTargets:[]};this.dom={drag:null,pointer:null};this.s.dt=a.fnSettings();this._fnConstruct();ColReorder.aoInstances.push(this);return this};ColReorder.prototype=
{fnReset:function(){for(var a=[],c=0,d=this.s.dt.aoColumns.length;c<d;c++)a.push(this.s.dt.aoColumns[c]._ColReorder_iOrigCol);this._fnOrderColumns(a)},_fnConstruct:function(){var a=this,c,d;if(typeof this.s.init.iFixedColumns!="undefined")this.s.fixed=this.s.init.iFixedColumns;if(typeof this.s.init.fnReorderCallback!="undefined")this.s.dropCallback=this.s.init.fnReorderCallback;c=0;for(d=this.s.dt.aoColumns.length;c<d;c++){c>this.s.fixed-1&&this._fnMouseListener(c,this.s.dt.aoColumns[c].nTh);this.s.dt.aoColumns[c]._ColReorder_iOrigCol=
c}this.s.dt.aoStateSave.push({fn:function(h,g){return a._fnStateSave.call(a,g)},sName:"ColReorder_State"});var b=null;if(typeof this.s.init.aiOrder!="undefined")b=this.s.init.aiOrder.slice();if(this.s.dt.oLoadedState&&typeof this.s.dt.oLoadedState.ColReorder!="undefined"&&this.s.dt.oLoadedState.ColReorder.length==this.s.dt.aoColumns.length)b=this.s.dt.oLoadedState.ColReorder;if(b)if(a.s.dt._bInitComplete){c=m(b);a._fnOrderColumns.call(a,c)}else{var e=false;this.s.dt.aoDrawCallback.push({fn:function(){if(!a.s.dt._bInitComplete&&
!e){e=true;var h=m(b);a._fnOrderColumns.call(a,h)}},sName:"ColReorder_Pre"})}},_fnOrderColumns:function(a){if(a.length!=this.s.dt.aoColumns.length)this.s.dt.oInstance.oApi._fnLog(oDTSettings,1,"ColReorder - array reorder does not match known number of columns. Skipping.");else{for(var c=0,d=a.length;c<d;c++){var b=f.inArray(c,a);if(c!=b){j(a,b,c);this.s.dt.oInstance.fnColReorder(b,c)}}if(this.s.dt.oScroll.sX!==""||this.s.dt.oScroll.sY!=="")this.s.dt.oInstance.fnAdjustColumnSizing();this.s.dt.oInstance.oApi._fnSaveState(this.s.dt)}},
_fnStateSave:function(a){var c,d=a.split('"aaSorting"')[0],b=[],e=this.s.dt;d+='"aaSorting":[ ';for(a=0;a<e.aaSorting.length;a++)d+="["+e.aoColumns[e.aaSorting[a][0]]._ColReorder_iOrigCol+',"'+e.aaSorting[a][1]+'"],';d=d.substring(0,d.length-1);d+="],";a=0;for(c=e.aoColumns.length;a<c;a++)b[e.aoColumns[a]._ColReorder_iOrigCol]={sSearch:encodeURIComponent(e.aoPreSearchCols[a].sSearch),bRegex:!e.aoPreSearchCols[a].bRegex};d+='"aaSearchCols":[ ';for(a=0;a<b.length;a++)d+='["'+b[a].sSearch+'",'+b[a].bRegex+
"],";d=d.substring(0,d.length-1);d+="],";b=[];a=0;for(c=e.aoColumns.length;a<c;a++)b[e.aoColumns[a]._ColReorder_iOrigCol]=e.aoColumns[a].bVisible;d+='"abVisCols":[ ';for(a=0;a<b.length;a++)d+=b[a]+",";d=d.substring(0,d.length-1);d+="],";b=[];a=0;for(c=e.aoColumns.length;a<c;a++)b.push(e.aoColumns[a]._ColReorder_iOrigCol);d+='"ColReorder":['+b.join(",")+"]";return d},_fnMouseListener:function(a,c){var d=this;f(c).bind("mousedown.ColReorder",function(b){d._fnMouseDown.call(d,b,c);return false})},_fnMouseDown:function(a,
c){var d=this,b=this.s.dt.aoColumns,e=a.target.nodeName=="TH"?a.target:f(a.target).parents("TH")[0];e=f(e).offset();this.s.mouse.startX=a.pageX;this.s.mouse.startY=a.pageY;this.s.mouse.offsetX=a.pageX-e.left;this.s.mouse.offsetY=a.pageY-e.top;this.s.mouse.target=c;this.s.mouse.targetIndex=f("th",c.parentNode).index(c);this.s.mouse.fromIndex=this.s.dt.oInstance.oApi._fnVisibleToColumnIndex(this.s.dt,this.s.mouse.targetIndex);this.s.aoTargets.splice(0,this.s.aoTargets.length);this.s.aoTargets.push({x:f(this.s.dt.nTable).offset().left,
to:0});c=a=0;for(e=b.length;c<e;c++){c!=this.s.mouse.fromIndex&&a++;b[c].bVisible&&this.s.aoTargets.push({x:f(b[c].nTh).offset().left+f(b[c].nTh).outerWidth(),to:a})}this.s.fixed!==0&&this.s.aoTargets.splice(0,this.s.fixed);f(i).bind("mousemove.ColReorder",function(h){d._fnMouseMove.call(d,h)});f(i).bind("mouseup.ColReorder",function(h){d._fnMouseUp.call(d,h)})},_fnMouseMove:function(a){if(this.dom.drag===null){if(Math.pow(Math.pow(a.pageX-this.s.mouse.startX,2)+Math.pow(a.pageY-this.s.mouse.startY,
2),0.5)<5)return;this._fnCreateDragNode()}this.dom.drag.style.left=a.pageX-this.s.mouse.offsetX+"px";this.dom.drag.style.top=a.pageY-this.s.mouse.offsetY+"px";for(var c=false,d=1,b=this.s.aoTargets.length;d<b;d++)if(a.pageX<this.s.aoTargets[d-1].x+(this.s.aoTargets[d].x-this.s.aoTargets[d-1].x)/2){this.dom.pointer.style.left=this.s.aoTargets[d-1].x+"px";this.s.mouse.toIndex=this.s.aoTargets[d-1].to;c=true;break}if(!c){this.dom.pointer.style.left=this.s.aoTargets[this.s.aoTargets.length-1].x+"px";
this.s.mouse.toIndex=this.s.aoTargets[this.s.aoTargets.length-1].to}},_fnMouseUp:function(){f(i).unbind("mousemove.ColReorder");f(i).unbind("mouseup.ColReorder");if(this.dom.drag!==null){i.body.removeChild(this.dom.drag);i.body.removeChild(this.dom.pointer);this.dom.drag=null;this.dom.pointer=null;this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex,this.s.mouse.toIndex);if(this.s.dt.oScroll.sX!==""||this.s.dt.oScroll.sY!=="")this.s.dt.oInstance.fnAdjustColumnSizing();this.s.dropCallback!==null&&
this.s.dropCallback.call(this);this.s.dt.oInstance.oApi._fnSaveState(this.s.dt)}},_fnCreateDragNode:function(){var a=this;this.dom.drag=f(this.s.dt.nTHead.parentNode).clone(true)[0];for(this.dom.drag.className+=" DTCR_clonedTable";this.dom.drag.getElementsByTagName("caption").length>0;)this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("caption")[0]);for(;this.dom.drag.getElementsByTagName("tbody").length>0;)this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("tbody")[0]);for(;this.dom.drag.getElementsByTagName("tfoot").length>
0;)this.dom.drag.removeChild(this.dom.drag.getElementsByTagName("tfoot")[0]);f("thead tr:eq(0)",this.dom.drag).each(function(){f("th:not(:eq("+a.s.mouse.targetIndex+"))",this).remove()});f("tr",this.dom.drag).height(f("tr:eq(0)",a.s.dt.nTHead).height());f("thead tr:gt(0)",this.dom.drag).remove();f("thead th:eq(0)",this.dom.drag).each(function(){this.style.width=f("th:eq("+a.s.mouse.targetIndex+")",a.s.dt.nTHead).width()+"px"});this.dom.drag.style.position="absolute";this.dom.drag.style.top="0px";
this.dom.drag.style.left="0px";this.dom.drag.style.width=f("th:eq("+a.s.mouse.targetIndex+")",a.s.dt.nTHead).outerWidth()+"px";this.dom.pointer=i.createElement("div");this.dom.pointer.className="DTCR_pointer";this.dom.pointer.style.position="absolute";if(this.s.dt.oScroll.sX===""&&this.s.dt.oScroll.sY===""){this.dom.pointer.style.top=f(this.s.dt.nTable).offset().top+"px";this.dom.pointer.style.height=f(this.s.dt.nTable).height()+"px"}else{this.dom.pointer.style.top=f("div.dataTables_scroll",this.s.dt.nTableWrapper).offset().top+
"px";this.dom.pointer.style.height=f("div.dataTables_scroll",this.s.dt.nTableWrapper).height()+"px"}i.body.appendChild(this.dom.pointer);i.body.appendChild(this.dom.drag)}};ColReorder.aoInstances=[];ColReorder.fnReset=function(a){for(var c=0,d=ColReorder.aoInstances.length;c<d;c++)ColReorder.aoInstances[c].s.dt.oInstance==a&&ColReorder.aoInstances[c].fnReset()};ColReorder.prototype.CLASS="ColReorder";ColReorder.VERSION="1.0.4";ColReorder.prototype.VERSION=ColReorder.VERSION;typeof f.fn.dataTable==
"function"&&typeof f.fn.dataTableExt.fnVersionCheck=="function"&&f.fn.dataTableExt.fnVersionCheck("1.8.0")?f.fn.dataTableExt.aoFeatures.push({fnInit:function(a){var c=a.oInstance;if(typeof c._oPluginColReorder=="undefined")c._oPluginColReorder=new ColReorder(a.oInstance,typeof a.oInit.oColReorder!="undefined"?a.oInit.oColReorder:{});else c.oApi._fnLog(a,1,"ColReorder attempted to initialise twice. Ignoring second");return null},cFeature:"R",sFeature:"ColReorder"}):alert("Warning: ColReorder requires DataTables 1.8.0 or greater - www.datatables.net/download")})(jQuery,
window,document);

// Simple Set Clipboard System
// Author: Joseph Huckaby
var ZeroClipboard={version:"1.0.4-TableTools2",clients:{},moviePath:"",nextId:1,$:function(a){if(typeof a=="string")a=document.getElementById(a);if(!a.addClass){a.hide=function(){this.style.display="none"};a.show=function(){this.style.display=""};a.addClass=function(b){this.removeClass(b);this.className+=" "+b};a.removeClass=function(b){this.className=this.className.replace(new RegExp("\\s*"+b+"\\s*")," ").replace(/^\s+/,"").replace(/\s+$/,"")};a.hasClass=function(b){return!!this.className.match(new RegExp("\\s*"+
b+"\\s*"))}}return a},setMoviePath:function(a){this.moviePath=a},dispatch:function(a,b,c){(a=this.clients[a])&&a.receiveEvent(b,c)},register:function(a,b){this.clients[a]=b},getDOMObjectPosition:function(a){var b={left:0,top:0,width:a.width?a.width:a.offsetWidth,height:a.height?a.height:a.offsetHeight};if(a.style.width!="")b.width=a.style.width.replace("px","");if(a.style.height!="")b.height=a.style.height.replace("px","");for(;a;){b.left+=a.offsetLeft;b.top+=a.offsetTop;a=a.offsetParent}return b},
Client:function(a){this.handlers={};this.id=ZeroClipboard.nextId++;this.movieId="ZeroClipboardMovie_"+this.id;ZeroClipboard.register(this.id,this);a&&this.glue(a)}};
ZeroClipboard.Client.prototype={id:0,ready:false,movie:null,clipText:"",fileName:"",action:"copy",handCursorEnabled:true,cssEffects:true,handlers:null,sized:false,glue:function(a,b){this.domElement=ZeroClipboard.$(a);a=99;if(this.domElement.style.zIndex)a=parseInt(this.domElement.style.zIndex)+1;var c=ZeroClipboard.getDOMObjectPosition(this.domElement);this.div=document.createElement("div");var d=this.div.style;d.position="absolute";d.left=this.domElement.offsetLeft+"px";d.top=this.domElement.offsetTop+
"px";d.width=c.width+"px";d.height=c.height+"px";d.zIndex=a;if(typeof b!="undefined"&&b!="")this.div.title=b;if(c.width!=0&&c.height!=0)this.sized=true;this.domElement.parentNode.appendChild(this.div);this.div.innerHTML=this.getHTML(c.width,c.height)},positionElement:function(){var a=ZeroClipboard.getDOMObjectPosition(this.domElement),b=this.div.style;b.position="absolute";b.left=this.domElement.offsetLeft+"px";b.top=this.domElement.offsetTop+"px";b.width=a.width+"px";b.height=a.height+"px";if(a.width!=
0&&a.height!=0)this.sized=true;b=this.div.childNodes[0];b.width=a.width;b.height=a.height},getHTML:function(a,b){var c="",d="id="+this.id+"&width="+a+"&height="+b;if(navigator.userAgent.match(/MSIE/)){var f=location.href.match(/^https/i)?"https://":"http://";c+='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+f+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+a+'" height="'+b+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+
ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+d+'"/><param name="wmode" value="transparent"/></object>'}else c+='<embed id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+a+'" height="'+b+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+
d+'" wmode="transparent" />';return c},hide:function(){if(this.div)this.div.style.left="-2000px"},show:function(){this.reposition()},destroy:function(){if(this.domElement&&this.div){this.hide();this.div.innerHTML="";var a=document.getElementsByTagName("body")[0];try{a.removeChild(this.div)}catch(b){}this.div=this.domElement=null}},reposition:function(a){if(a)(this.domElement=ZeroClipboard.$(a))||this.hide();if(this.domElement&&this.div){a=ZeroClipboard.getDOMObjectPosition(this.domElement);var b=
this.div.style;b.left=""+a.left+"px";b.top=""+a.top+"px"}},clearText:function(){this.clipText="";this.ready&&this.movie.clearText()},appendText:function(a){this.clipText+=a;this.ready&&this.movie.appendText(a)},setText:function(a){this.clipText=a;this.ready&&this.movie.setText(a)},setCharSet:function(a){this.charSet=a;this.ready&&this.movie.setCharSet(a)},setBomInc:function(a){this.incBom=a;this.ready&&this.movie.setBomInc(a)},setFileName:function(a){this.fileName=a;this.ready&&this.movie.setFileName(a)},
setAction:function(a){this.action=a;this.ready&&this.movie.setAction(a)},addEventListener:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");this.handlers[a]||(this.handlers[a]=[]);this.handlers[a].push(b)},setHandCursor:function(a){this.handCursorEnabled=a;this.ready&&this.movie.setHandCursor(a)},setCSSEffects:function(a){this.cssEffects=!!a},receiveEvent:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");switch(a){case "load":this.movie=document.getElementById(this.movieId);
if(!this.movie){var c=this;setTimeout(function(){c.receiveEvent("load",null)},1);return}if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){c=this;setTimeout(function(){c.receiveEvent("load",null)},100);this.ready=true;return}this.ready=true;this.movie.clearText();this.movie.appendText(this.clipText);this.movie.setFileName(this.fileName);this.movie.setAction(this.action);this.movie.setCharSet(this.charSet);this.movie.setBomInc(this.incBom);this.movie.setHandCursor(this.handCursorEnabled);
break;case "mouseover":this.domElement&&this.cssEffects&&this.recoverActive&&this.domElement.addClass("active");break;case "mouseout":if(this.domElement&&this.cssEffects){this.recoverActive=false;if(this.domElement.hasClass("active")){this.domElement.removeClass("active");this.recoverActive=true}}break;case "mousedown":this.domElement&&this.cssEffects&&this.domElement.addClass("active");break;case "mouseup":if(this.domElement&&this.cssEffects){this.domElement.removeClass("active");this.recoverActive=
false}break}if(this.handlers[a])for(var d=0,f=this.handlers[a].length;d<f;d++){var e=this.handlers[a][d];if(typeof e=="function")e(this,b);else if(typeof e=="object"&&e.length==2)e[0][e[1]](this,b);else typeof e=="string"&&window[e](this,b)}}};


/*
 * File:        TableTools.min.js
 * Version:     2.0.1
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * 
 * Copyright 2009-2011 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD (3 point) style license, as supplied with this software.
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
var TableTools;
(function(e,n,j){TableTools=function(a,b){if(!this.CLASS||this.CLASS!="TableTools")alert("Warning: TableTools must be initialised with the keyword 'new'");this.s={that:this,dt:null,print:{saveStart:-1,saveLength:-1,saveScroll:-1,funcEnd:function(){}},buttonCounter:0,select:{type:"",selected:[],preRowSelect:null,postSelected:null,postDeselected:null,all:false,selectedClass:""},custom:{},swfPath:"",buttonSet:[],master:false};this.dom={container:null,table:null,print:{hidden:[],message:null},collection:{collection:null,
background:null}};this.fnSettings=function(){return this.s};if(typeof b=="undefined")b={};this.s.dt=a.fnSettings();this._fnConstruct(b);return this};TableTools.prototype={fnGetSelected:function(){return this._fnGetMasterSettings().select.selected},fnIsSelected:function(a){for(var b=this.fnGetSelected(),c=0,d=b.length;c<d;c++)if(a==b[c])return true;return false},fnSelectAll:function(){this._fnGetMasterSettings().that._fnRowSelectAll()},fnSelectNone:function(){this._fnGetMasterSettings().that._fnRowDeselectAll()},
fnGetTitle:function(a){var b="";if(typeof a.sTitle!="undefined"&&a.sTitle!=="")b=a.sTitle;else{a=j.getElementsByTagName("title");if(a.length>0)b=a[0].innerHTML}return"\u00a1".toString().length<4?b.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,""):b.replace(/[^a-zA-Z0-9_\.,\-_ !\(\)]/g,"")},fnCalcColRatios:function(a){var b=this.s.dt.aoColumns;a=this._fnColumnTargets(a.mColumns);var c=[],d=0,f=0,h,g;h=0;for(g=a.length;h<g;h++)if(a[h]){d=b[h].nTh.offsetWidth;f+=d;c.push(d)}h=0;for(g=c.length;h<
g;h++)c[h]/=f;return c.join("\t")},fnGetTableData:function(a){if(this.s.dt)return this._fnGetDataTablesData(a)},fnSetText:function(a,b){this._fnFlashSetText(a,b)},fnResizeButtons:function(){for(var a in ZeroClipboard.clients)if(a){var b=ZeroClipboard.clients[a];typeof b.domElement!="undefined"&&b.domElement.parentNode==this.dom.container&&b.positionElement()}},fnResizeRequired:function(){for(var a in ZeroClipboard.clients)if(a){var b=ZeroClipboard.clients[a];if(typeof b.domElement!="undefined"&&b.domElement.parentNode==
this.dom.container&&b.sized===false)return true}return false},_fnConstruct:function(a){this._fnCustomiseSettings(a);this.dom.container=j.createElement("div");this.dom.container.style.position="relative";this.dom.container.className=!this.s.dt.bJUI?"DTTT_container":"DTTT_container ui-buttonset ui-buttonset-multi";this.s.select.type!="none"&&this._fnRowSelectConfig();this._fnButtonDefinations(this.s.buttonSet,this.dom.container)},_fnCustomiseSettings:function(a){if(typeof this.s.dt._TableToolsInit==
"undefined"){this.s.master=true;this.s.dt._TableToolsInit=true}this.dom.table=this.s.dt.nTable;this.s.custom=e.extend({},TableTools.DEFAULTS,a);this.s.swfPath=this.s.custom.sSwfPath;if(typeof ZeroClipboard!="undefined")ZeroClipboard.moviePath=this.s.swfPath;this.s.select.type=this.s.custom.sRowSelect;this.s.select.preRowSelect=this.s.custom.fnPreRowSelect;this.s.select.postSelected=this.s.custom.fnRowSelected;this.s.select.postDeselected=this.s.custom.fnRowDeselected;this.s.select.selectedClass=this.s.custom.sSelectedClass;
this.s.buttonSet=this.s.custom.aButtons},_fnButtonDefinations:function(a,b){for(var c,d=0,f=a.length;d<f;d++){if(typeof a[d]=="string"){if(typeof TableTools.BUTTONS[a[d]]=="undefined"){alert("TableTools: Warning - unknown button type: "+a[d]);continue}c=e.extend({},TableTools.BUTTONS[a[d]],true)}else{if(typeof TableTools.BUTTONS[a[d].sExtends]=="undefined"){alert("TableTools: Warning - unknown button type: "+a[d].sExtends);continue}c=e.extend({},TableTools.BUTTONS[a[d].sExtends],true);c=e.extend(c,
a[d],true)}if(this.s.dt.bJUI){c.sButtonClass+=" ui-button ui-state-default";c.sButtonClassHover+=" ui-button ui-state-default ui-state-hover"}b.appendChild(this._fnCreateButton(c))}},_fnCreateButton:function(a){var b=this._fnButtonBase(a);if(a.sAction=="print")this._fnPrintConfig(b,a);else if(a.sAction.match(/flash/))this._fnFlashConfig(b,a);else if(a.sAction=="text")this._fnTextConfig(b,a);else if(a.sAction=="collection"){this._fnTextConfig(b,a);this._fnCollectionConfig(b,a)}return b},_fnButtonBase:function(a){var b=
j.createElement("button"),c=j.createElement("span"),d=this._fnGetMasterSettings();b.className="DTTT_button "+a.sButtonClass;b.setAttribute("id","ToolTables_"+this.s.dt.sInstance+"_"+d.buttonCounter);b.appendChild(c);c.innerHTML=a.sButtonText;d.buttonCounter++;return b},_fnGetMasterSettings:function(){if(this.s.master)return this.s;else for(var a=TableTools._aInstances,b=0,c=a.length;b<c;b++)if(this.dom.table==a[b].s.dt.nTable)return a[b].s},_fnCollectionConfig:function(a,b){a=j.createElement("div");
a.style.display="none";a.className=!this.s.dt.bJUI?"DTTT_collection":"DTTT_collection ui-buttonset ui-buttonset-multi";b._collection=a;this._fnButtonDefinations(b.aButtons,a)},_fnCollectionShow:function(a,b){var c=this,d=e(a).offset(),f=b._collection;b=d.left;d=d.top+e(a).outerHeight();var h=e(n).height(),g=e(j).height(),k=e(n).width(),m=e(j).width();f.style.position="absolute";f.style.left=b+"px";f.style.top=d+"px";f.style.display="block";e(f).css("opacity",0);var l=j.createElement("div");l.style.position=
"absolute";l.style.left="0px";l.style.top="0px";l.style.height=(h>g?h:g)+"px";l.style.width=(k>m?k:m)+"px";l.className="DTTT_collection_background";e(l).css("opacity",0);j.body.appendChild(l);j.body.appendChild(f);h=e(f).outerWidth();k=e(f).outerHeight();if(b+h>m)f.style.left=m-h+"px";if(d+k>g)f.style.top=d-k-e(a).outerHeight()+"px";this.dom.collection.collection=f;this.dom.collection.background=l;setTimeout(function(){e(f).animate({opacity:1},500);e(l).animate({opacity:0.25},500)},10);e(l).click(function(){c._fnCollectionHide.call(c,
null,null)})},_fnCollectionHide:function(a,b){if(!(b!==null&&b.sExtends=="collection"))if(this.dom.collection.collection!==null){e(this.dom.collection.collection).animate({opacity:0},500,function(){this.style.display="none"});e(this.dom.collection.background).animate({opacity:0},500,function(){this.parentNode.removeChild(this)});this.dom.collection.collection=null;this.dom.collection.background=null}},_fnRowSelectConfig:function(){if(this.s.master){var a=this,b,c,d=this.s.dt.aoOpenRows;e(a.s.dt.nTable).addClass("DTTT_selectable");
e("tr",a.s.dt.nTBody).live("click",function(f){if(this.parentNode==a.s.dt.nTBody){b=0;for(c=d.length;b<c;b++)if(this==d[b].nTr)return;a.s.select.preRowSelect!==null&&!a.s.select.preRowSelect.call(a,f)||(a.s.select.type=="single"?a._fnRowSelectSingle.call(a,this):a._fnRowSelectMulti.call(a,this))}});a.s.dt.aoDrawCallback.push({fn:function(){a.s.select.all&&a.s.dt.oFeatures.bServerSide&&a.fnSelectAll()},sName:"TableTools_select"})}},_fnRowSelectSingle:function(a){if(this.s.master)if(!e("td",a).hasClass(this.s.dt.oClasses.sRowEmpty)){if(e(a).hasClass(this.s.select.selectedClass))this._fnRowDeselect(a);
else{this.s.select.selected.length!==0&&this._fnRowDeselectAll();this.s.select.selected.push(a);e(a).addClass(this.s.select.selectedClass);this.s.select.postSelected!==null&&this.s.select.postSelected.call(this,a)}TableTools._fnEventDispatch(this,"select",a)}},_fnRowSelectMulti:function(a){if(this.s.master)if(!e("td",a).hasClass(this.s.dt.oClasses.sRowEmpty)){if(e(a).hasClass(this.s.select.selectedClass))this._fnRowDeselect(a);else{this.s.select.selected.push(a);e(a).addClass(this.s.select.selectedClass);
this.s.select.postSelected!==null&&this.s.select.postSelected.call(this,a)}TableTools._fnEventDispatch(this,"select",a)}},_fnRowSelectAll:function(){if(this.s.master){for(var a,b=0,c=this.s.dt.aiDisplayMaster.length;b<c;b++){a=this.s.dt.aoData[this.s.dt.aiDisplayMaster[b]].nTr;if(!e(a).hasClass(this.s.select.selectedClass)){this.s.select.selected.push(a);e(a).addClass(this.s.select.selectedClass)}}this.s.select.all=true;TableTools._fnEventDispatch(this,"select",null)}},_fnRowDeselectAll:function(){if(this.s.master){for(var a=
this.s.select.selected.length-1;a>=0;a--)this._fnRowDeselect(a);this.s.select.all=false;TableTools._fnEventDispatch(this,"select",null)}},_fnRowDeselect:function(a){if(typeof a.nodeName!="undefined")a=e.inArray(a,this.s.select.selected);var b=this.s.select.selected[a];e(b).removeClass(this.s.select.selectedClass);this.s.select.selected.splice(a,1);this.s.select.postDeselected!==null&&this.s.select.postDeselected.call(this,b);this.s.select.all=false},_fnTextConfig:function(a,b){var c=this;b.fnInit!==
null&&b.fnInit.call(this,a,b);if(b.sToolTip!=="")a.title=b.sToolTip;e(a).hover(function(){e(a).removeClass(b.sButtonClass).addClass(b.sButtonClassHover);b.fnMouseover!==null&&b.fnMouseover.call(this,a,b,null)},function(){e(a).removeClass(b.sButtonClassHover).addClass(b.sButtonClass);b.fnMouseout!==null&&b.fnMouseout.call(this,a,b,null)});b.fnSelect!==null&&TableTools._fnEventListen(this,"select",function(d){b.fnSelect.call(c,a,b,d)});e(a).click(function(d){d.preventDefault();b.fnClick!==null&&b.fnClick.call(c,
a,b,null);b.fnComplete!==null&&b.fnComplete.call(c,a,b,null,null);c._fnCollectionHide(a,b)})},_fnFlashConfig:function(a,b){var c=this,d=new ZeroClipboard.Client;b.fnInit!==null&&b.fnInit.call(this,a,b);d.setHandCursor(true);if(b.sAction=="flash_save"){d.setAction("save");d.setCharSet(b.sCharSet=="utf16le"?"UTF16LE":"UTF8");d.setBomInc(b.bBomInc);d.setFileName(b.sFileName.replace("*",this.fnGetTitle(b)))}else if(b.sAction=="flash_pdf"){d.setAction("pdf");d.setFileName(b.sFileName.replace("*",this.fnGetTitle(b)))}else d.setAction("copy");
d.addEventListener("mouseOver",function(){e(a).removeClass(b.sButtonClass).addClass(b.sButtonClassHover);b.fnMouseover!==null&&b.fnMouseover.call(c,a,b,d)});d.addEventListener("mouseOut",function(){e(a).removeClass(b.sButtonClassHover).addClass(b.sButtonClass);b.fnMouseout!==null&&b.fnMouseout.call(c,a,b,d)});d.addEventListener("mouseDown",function(){b.fnClick!==null&&b.fnClick.call(c,a,b,d)});d.addEventListener("complete",function(f,h){b.fnComplete!==null&&b.fnComplete.call(c,a,b,d,h);c._fnCollectionHide(a,
b)});this._fnFlashGlue(d,a,b.sToolTip)},_fnFlashGlue:function(a,b,c){var d=this,f=b.getAttribute("id");if(j.getElementById(f)){a.glue(b,c);if(a.domElement.parentNode!=a.div.parentNode&&typeof d.__bZCWarning=="undefined"){d.s.dt.oApi._fnLog(this.s.dt,0,"It looks like you are using the version of ZeroClipboard which came with TableTools 1. Please update to use the version that came with TableTools 2.");d.__bZCWarning=true}}else setTimeout(function(){d._fnFlashGlue(a,b,c)},100)},_fnFlashSetText:function(a,
b){b=this._fnChunkData(b,8192);a.clearText();for(var c=0,d=b.length;c<d;c++)a.appendText(b[c])},_fnColumnTargets:function(a){var b=[],c=this.s.dt;if(typeof a=="object"){i=0;for(iLen=c.aoColumns.length;i<iLen;i++)b.push(false);i=0;for(iLen=a.length;i<iLen;i++)b[a[i]]=true}else if(a=="visible"){i=0;for(iLen=c.aoColumns.length;i<iLen;i++)b.push(c.aoColumns[i].bVisible?true:false)}else if(a=="hidden"){i=0;for(iLen=c.aoColumns.length;i<iLen;i++)b.push(c.aoColumns[i].bVisible?false:true)}else{i=0;for(iLen=
c.aoColumns.length;i<iLen;i++)b.push(true)}return b},_fnNewline:function(a){return a.sNewLine=="auto"?navigator.userAgent.match(/Windows/)?"\r\n":"\n":a.sNewLine},_fnGetDataTablesData:function(a){var b,c,d,f,h="",g="",k=this.s.dt,m=new RegExp(a.sFieldBoundary,"g"),l=this._fnColumnTargets(a.mColumns),o=this._fnNewline(a);if(a.bHeader){b=0;for(c=k.aoColumns.length;b<c;b++)if(l[b]){g=k.aoColumns[b].sTitle.replace(/\n/g," ").replace(/<.*?>/g,"");g=this._fnHtmlDecode(g);h+=this._fnBoundData(g,a.sFieldBoundary,
m)+a.sFieldSeperator}h=h.slice(0,a.sFieldSeperator.length*-1);h+=o}d=0;for(f=k.aiDisplay.length;d<f;d++)if(!(typeof a.bSelectedOnly&&a.bSelectedOnly&&!e(k.aoData[k.aiDisplay[d]].nTr).hasClass(this.s.select.selectedClass))){b=0;for(c=k.aoColumns.length;b<c;b++)if(l[b]){g=k.aoData[k.aiDisplay[d]]._aData[b];if(typeof g=="string"){g=g.replace(/\n/g," ");g=g.replace(/<img.*?\s+alt\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+)).*?>/gi,"$1$2$3");g=g.replace(/<.*?>/g,"")}else g=g+"";g=g.replace(/^\s+/,"").replace(/\s+$/,
"");g=this._fnHtmlDecode(g);h+=this._fnBoundData(g,a.sFieldBoundary,m)+a.sFieldSeperator}h=h.slice(0,a.sFieldSeperator.length*-1);h+=o}h.slice(0,-1);if(a.bFooter){b=0;for(c=k.aoColumns.length;b<c;b++)if(l[b]&&k.aoColumns[b].nTf!==null){g=k.aoColumns[b].nTf.innerHTML.replace(/\n/g," ").replace(/<.*?>/g,"");g=this._fnHtmlDecode(g);h+=this._fnBoundData(g,a.sFieldBoundary,m)+a.sFieldSeperator}h=h.slice(0,a.sFieldSeperator.length*-1)}return _sLastData=h},_fnBoundData:function(a,b,c){return b===""?a:b+
a.replace(c,"\\"+b)+b},_fnChunkData:function(a,b){for(var c=[],d=a.length,f=0;f<d;f+=b)f+b<d?c.push(a.substring(f,f+b)):c.push(a.substring(f,d));return c},_fnHtmlDecode:function(a){if(a.indexOf("&")==-1)return a;a=this._fnChunkData(a,2048);var b=j.createElement("div"),c,d,f,h="";c=0;for(d=a.length;c<d;c++){f=a[c].lastIndexOf("&");if(f!=-1&&a[c].length>=8&&f>a[c].length-8){a[c].substr(f);a[c]=a[c].substr(0,f)}b.innerHTML=a[c];h+=b.childNodes[0].nodeValue}return h},_fnPrintConfig:function(a,b){var c=
this;b.fnInit!==null&&b.fnInit.call(this,a,b);e(a).hover(function(){e(a).removeClass(b.sButtonClass).addClass(b.sButtonClassHover)},function(){e(a).removeClass(b.sButtonClassHover).addClass(b.sButtonClass)});b.fnSelect!==null&&TableTools._fnEventListen(this,"select",function(d){b.fnSelect.call(c,a,b,d)});e(a).click(function(d){d.preventDefault();c._fnPrintStart.call(c,d,b);b.fnClick!==null&&b.fnClick.call(c,a,b,null);b.fnComplete!==null&&b.fnComplete.call(c,a,b,null,null);c._fnCollectionHide(a,b)})},
_fnPrintStart:function(a,b){var c=this;a=this.s.dt;this._fnPrintHideNodes(a.nTable);this.s.print.saveStart=a._iDisplayStart;this.s.print.saveLength=a._iDisplayLength;if(b.bShowAll){a._iDisplayStart=0;a._iDisplayLength=-1;a.oApi._fnCalculateEnd(a);a.oApi._fnDraw(a)}if(a.oScroll.sX!==""||a.oScroll.sY!=="")this._fnPrintScrollStart(a);a=a.aanFeatures;for(var d in a)if(d!="i"&&d!="t"&&d.length==1)for(var f=0,h=a[d].length;f<h;f++){this.dom.print.hidden.push({node:a[d][f],display:"block"});a[d][f].style.display=
"none"}e(j.body).addClass("DTTT_Print");if(b.sInfo!==""){var g=j.createElement("div");g.className="DTTT_print_info";g.innerHTML=b.sInfo;j.body.appendChild(g);setTimeout(function(){e(g).fadeOut("normal",function(){j.body.removeChild(g)})},2E3)}if(b.sMessage!==""){this.dom.print.message=j.createElement("div");this.dom.print.message.className="DTTT_PrintMessage";this.dom.print.message.innerHTML=b.sMessage;j.body.insertBefore(this.dom.print.message,j.body.childNodes[0])}this.s.print.saveScroll=e(n).scrollTop();
n.scrollTo(0,0);this.s.print.funcEnd=function(k){c._fnPrintEnd.call(c,k)};e(j).bind("keydown",null,this.s.print.funcEnd)},_fnPrintEnd:function(a){if(a.keyCode==27){a.preventDefault();a=this.s.dt;var b=this.s.print,c=this.dom.print;this._fnPrintShowNodes();if(a.oScroll.sX!==""||a.oScroll.sY!=="")this._fnPrintScrollEnd();n.scrollTo(0,b.saveScroll);if(c.message!==null){j.body.removeChild(c.message);c.message=null}e(j.body).removeClass("DTTT_Print");a._iDisplayStart=b.saveStart;a._iDisplayLength=b.saveLength;
a.oApi._fnCalculateEnd(a);a.oApi._fnDraw(a);e(j).unbind("keydown",this.s.print.funcEnd);this.s.print.funcEnd=null}},_fnPrintScrollStart:function(){var a=this.s.dt;a.nScrollHead.getElementsByTagName("div")[0].getElementsByTagName("table");var b=a.nTable.parentNode,c=a.nTable.getElementsByTagName("thead");c.length>0&&a.nTable.removeChild(c[0]);if(a.nTFoot!==null){c=a.nTable.getElementsByTagName("tfoot");c.length>0&&a.nTable.removeChild(c[0])}c=a.nTHead.cloneNode(true);a.nTable.insertBefore(c,a.nTable.childNodes[0]);
if(a.nTFoot!==null){c=a.nTFoot.cloneNode(true);a.nTable.insertBefore(c,a.nTable.childNodes[1])}if(a.oScroll.sX!==""){a.nTable.style.width=e(a.nTable).outerWidth()+"px";b.style.width=e(a.nTable).outerWidth()+"px";b.style.overflow="visible"}if(a.oScroll.sY!==""){b.style.height=e(a.nTable).outerHeight()+"px";b.style.overflow="visible"}},_fnPrintScrollEnd:function(){var a=this.s.dt,b=a.nTable.parentNode;if(a.oScroll.sX!==""){b.style.width=a.oApi._fnStringToCss(a.oScroll.sX);b.style.overflow="auto"}if(a.oScroll.sY!==
""){b.style.height=a.oApi._fnStringToCss(a.oScroll.sY);b.style.overflow="auto"}},_fnPrintShowNodes:function(){for(var a=this.dom.print.hidden,b=0,c=a.length;b<c;b++)a[b].node.style.display=a[b].display;a.splice(0,a.length)},_fnPrintHideNodes:function(a){for(var b=this.dom.print.hidden,c=a.parentNode,d=c.childNodes,f=0,h=d.length;f<h;f++)if(d[f]!=a&&d[f].nodeType==1){var g=e(d[f]).css("display");if(g!="none"){b.push({node:d[f],display:g});d[f].style.display="none"}}c.nodeName!="BODY"&&this._fnPrintHideNodes(c)}};
TableTools._aInstances=[];TableTools._aListeners=[];TableTools.fnGetMasters=function(){for(var a=[],b=0,c=TableTools._aInstances.length;b<c;b++)TableTools._aInstances[b].s.master&&a.push(TableTools._aInstances[b].s);return a};TableTools.fnGetInstance=function(a){if(typeof a!="object")a=j.getElementById(a);for(var b=0,c=TableTools._aInstances.length;b<c;b++)if(TableTools._aInstances[b].s.master&&TableTools._aInstances[b].dom.table==a)return TableTools._aInstances[b];return null};TableTools._fnEventListen=
function(a,b,c){TableTools._aListeners.push({that:a,type:b,fn:c})};TableTools._fnEventDispatch=function(a,b,c){for(var d=TableTools._aListeners,f=0,h=d.length;f<h;f++)a.dom.table==d[f].that.dom.table&&d[f].type==b&&d[f].fn(c)};TableTools.BUTTONS={csv:{sAction:"flash_save",sCharSet:"utf8",bBomInc:false,sFileName:"*.csv",sFieldBoundary:"'",sFieldSeperator:",",sNewLine:"auto",sTitle:"",sToolTip:"",sButtonClass:"DTTT_button_csv",sButtonClassHover:"DTTT_button_csv_hover",sButtonText:"CSV",mColumns:"all",
bHeader:true,bFooter:true,bSelectedOnly:false,fnMouseover:null,fnMouseout:null,fnClick:function(a,b,c){this.fnSetText(c,this.fnGetTableData(b))},fnSelect:null,fnComplete:null,fnInit:null},xls:{sAction:"flash_save",sCharSet:"utf16le",bBomInc:true,sFileName:"*.csv",sFieldBoundary:"",sFieldSeperator:"\t",sNewLine:"auto",sTitle:"",sToolTip:"",sButtonClass:"DTTT_button_xls",sButtonClassHover:"DTTT_button_xls_hover",sButtonText:"Excel",mColumns:"all",bHeader:true,bFooter:true,bSelectedOnly:false,fnMouseover:null,
fnMouseout:null,fnClick:function(a,b,c){this.fnSetText(c,this.fnGetTableData(b))},fnSelect:null,fnComplete:null,fnInit:null},copy:{sAction:"flash_copy",sFieldBoundary:"",sFieldSeperator:"\t",sNewLine:"auto",sToolTip:"",sButtonClass:"DTTT_button_copy",sButtonClassHover:"DTTT_button_copy_hover",sButtonText:"Copy",mColumns:"all",bHeader:true,bFooter:true,bSelectedOnly:false,fnMouseover:null,fnMouseout:null,fnClick:function(a,b,c){this.fnSetText(c,this.fnGetTableData(b))},fnSelect:null,fnComplete:function(a,
b,c,d){a=d.split("\n").length;a=this.s.dt.nTFoot===null?a-1:a-2;alert("Copied "+a+" row"+(a==1?"":"s")+" to the clipboard")},fnInit:null},pdf:{sAction:"flash_pdf",sFieldBoundary:"",sFieldSeperator:"\t",sNewLine:"\n",sFileName:"*.pdf",sToolTip:"",sTitle:"",sButtonClass:"DTTT_button_pdf",sButtonClassHover:"DTTT_button_pdf_hover",sButtonText:"PDF",mColumns:"all",bHeader:true,bFooter:false,bSelectedOnly:false,fnMouseover:null,fnMouseout:null,sPdfOrientation:"portrait",sPdfSize:"A4",sPdfMessage:"",fnClick:function(a,
b,c){this.fnSetText(c,"title:"+this.fnGetTitle(b)+"\nmessage:"+b.sPdfMessage+"\ncolWidth:"+this.fnCalcColRatios(b)+"\norientation:"+b.sPdfOrientation+"\nsize:"+b.sPdfSize+"\n--/TableToolsOpts--\n"+this.fnGetTableData(b))},fnSelect:null,fnComplete:null,fnInit:null},print:{sAction:"print",sInfo:"<h6>Print view</h6><p>Please use your browser's print function to print this table. Press escape when finished.",sMessage:"",bShowAll:true,sToolTip:"View print view",sButtonClass:"DTTT_button_print",sButtonClassHover:"DTTT_button_print_hover",
sButtonText:"Print",fnMouseover:null,fnMouseout:null,fnClick:null,fnSelect:null,fnComplete:null,fnInit:null},text:{sAction:"text",sToolTip:"",sButtonClass:"DTTT_button_text",sButtonClassHover:"DTTT_button_text_hover",sButtonText:"Text button",mColumns:"all",bHeader:true,bFooter:true,bSelectedOnly:false,fnMouseover:null,fnMouseout:null,fnClick:null,fnSelect:null,fnComplete:null,fnInit:null},select:{sAction:"text",sToolTip:"",sButtonClass:"DTTT_button_text",sButtonClassHover:"DTTT_button_text_hover",
sButtonText:"Select button",mColumns:"all",bHeader:true,bFooter:true,fnMouseover:null,fnMouseout:null,fnClick:null,fnSelect:function(a){this.fnGetSelected().length!==0?e(a).removeClass("DTTT_disabled"):e(a).addClass("DTTT_disabled")},fnComplete:null,fnInit:function(a){e(a).addClass("DTTT_disabled")}},select_single:{sAction:"text",sToolTip:"",sButtonClass:"DTTT_button_text",sButtonClassHover:"DTTT_button_text_hover",sButtonText:"Select button",mColumns:"all",bHeader:true,bFooter:true,fnMouseover:null,
fnMouseout:null,fnClick:null,fnSelect:function(a){this.fnGetSelected().length==1?e(a).removeClass("DTTT_disabled"):e(a).addClass("DTTT_disabled")},fnComplete:null,fnInit:function(a){e(a).addClass("DTTT_disabled")}},select_all:{sAction:"text",sToolTip:"",sButtonClass:"DTTT_button_text",sButtonClassHover:"DTTT_button_text_hover",sButtonText:"Select all",mColumns:"all",bHeader:true,bFooter:true,fnMouseover:null,fnMouseout:null,fnClick:function(){this.fnSelectAll()},fnSelect:function(a){this.fnGetSelected().length==
this.s.dt.fnRecordsDisplay()?e(a).addClass("DTTT_disabled"):e(a).removeClass("DTTT_disabled")},fnComplete:null,fnInit:null},select_none:{sAction:"text",sToolTip:"",sButtonClass:"DTTT_button_text",sButtonClassHover:"DTTT_button_text_hover",sButtonText:"Deselect all",mColumns:"all",bHeader:true,bFooter:true,fnMouseover:null,fnMouseout:null,fnClick:function(){this.fnSelectNone()},fnSelect:function(a){this.fnGetSelected().length!==0?e(a).removeClass("DTTT_disabled"):e(a).addClass("DTTT_disabled")},fnComplete:null,
fnInit:function(a){e(a).addClass("DTTT_disabled")}},ajax:{sAction:"text",sFieldBoundary:"",sFieldSeperator:"\t",sNewLine:"\n",sAjaxUrl:"/xhr.php",sToolTip:"",sButtonClass:"DTTT_button_text",sButtonClassHover:"DTTT_button_text_hover",sButtonText:"Ajax button",mColumns:"all",bHeader:true,bFooter:true,bSelectedOnly:false,fnMouseover:null,fnMouseout:null,fnClick:function(a,b){a=this.fnGetTableData(b);e.ajax({url:b.sAjaxUrl,data:[{name:"tableData",value:a}],success:b.fnAjaxComplete,dataType:"json",type:"POST",
cache:false,error:function(){alert("Error detected when sending table data to server")}})},fnSelect:null,fnComplete:null,fnInit:null,fnAjaxComplete:function(){alert("Ajax complete")}},collection:{sAction:"collection",sToolTip:"",sButtonClass:"DTTT_button_collection",sButtonClassHover:"DTTT_button_collection_hover",sButtonText:"Collection",fnMouseover:null,fnMouseout:null,fnClick:function(a,b){this._fnCollectionShow(a,b)},fnSelect:null,fnComplete:null,fnInit:null}};TableTools.DEFAULTS={sSwfPath:"media/swf/copy_cvs_xls_pdf.swf",
sRowSelect:"none",sSelectedClass:"DTTT_selected",fnPreRowSelect:null,fnRowSelected:null,fnRowDeselected:null,aButtons:["copy","csv","xls","pdf","print"]};TableTools.prototype.CLASS="TableTools";TableTools.VERSION="2.0.1";TableTools.prototype.VERSION=TableTools.VERSION;typeof e.fn.dataTable=="function"&&typeof e.fn.dataTableExt.fnVersionCheck=="function"&&e.fn.dataTableExt.fnVersionCheck("1.7.0")?e.fn.dataTableExt.aoFeatures.push({fnInit:function(a){a=new TableTools(a.oInstance,typeof a.oInit.oTableTools!=
"undefined"?a.oInit.oTableTools:{});TableTools._aInstances.push(a);return a.dom.container},cFeature:"T",sFeature:"TableTools"}):alert("Warning: TableTools 2 requires DataTables 1.7 or greater - www.datatables.net/download")})(jQuery,window,document);

/* See license.txt for terms of usage */

require.def("core/trace", [
],

function() {

//*************************************************************************************************

var Trace = {
    log: function(){},
    error: function(){},
    exception: function(){},
    time: function(){},
    timeEnd: function(){}
};

if (typeof(console) == "undefined")
    return Trace;


return Trace;

//*************************************************************************************************
});



require.def("domplate/domplate",[],function(){Domplate={};(function(){function DomplateTag(tagName)
{this.tagName=tagName;}
this.DomplateTag=DomplateTag;function DomplateEmbed()
{}
function DomplateLoop()
{}
var womb=null;var domplate=function()
{var lastSubject;for(var i=0;i<arguments.length;++i)
lastSubject=lastSubject?copyObject(lastSubject,arguments[i]):arguments[i];for(var name in lastSubject)
{var val=lastSubject[name];if(isTag(val))
val.tag.subject=lastSubject;}
return lastSubject;};domplate.context=function(context,fn)
{var lastContext=domplate.lastContext;domplate.topContext=context;fn.apply(context);domplate.topContext=lastContext;};this.domplate=domplate;this.create=domplate;this.TAG=function()
{var embed=new DomplateEmbed();return embed.merge(arguments);};this.FOR=function()
{var loop=new DomplateLoop();return loop.merge(arguments);};DomplateTag.prototype={merge:function(args,oldTag)
{if(oldTag)
this.tagName=oldTag.tagName;this.context=oldTag?oldTag.context:null;this.subject=oldTag?oldTag.subject:null;this.attrs=oldTag?copyObject(oldTag.attrs):{};this.classes=oldTag?copyObject(oldTag.classes):{};this.props=oldTag?copyObject(oldTag.props):null;this.listeners=oldTag?copyArray(oldTag.listeners):null;this.children=oldTag?copyArray(oldTag.children):[];this.vars=oldTag?copyArray(oldTag.vars):[];var attrs=args.length?args[0]:null;var hasAttrs=typeof(attrs)=="object"&&!isTag(attrs);this.children=[];if(domplate.topContext)
this.context=domplate.topContext;if(args.length)
parseChildren(args,hasAttrs?1:0,this.vars,this.children);if(hasAttrs)
this.parseAttrs(attrs);return creator(this,DomplateTag);},parseAttrs:function(args)
{for(var name in args)
{var val=parseValue(args[name]);readPartNames(val,this.vars);if(name.indexOf("on")==0)
{var eventName=$.browser.msie?name:name.substr(2);if(!this.listeners)
this.listeners=[];this.listeners.push(eventName,val);}
else if(name.indexOf("_")==0)
{var propName=name.substr(1);if(!this.props)
this.props={};this.props[propName]=val;}
else if(name.indexOf("$")==0)
{var className=name.substr(1);if(!this.classes)
this.classes={};this.classes[className]=val;}
else
{if(name=="class"&&name in this.attrs)
this.attrs[name]+=" "+val;else
this.attrs[name]=val;}}},compile:function()
{if(this.renderMarkup)
return;this.compileMarkup();this.compileDOM();},compileMarkup:function()
{this.markupArgs=[];var topBlock=[],topOuts=[],blocks=[],info={args:this.markupArgs,argIndex:0};this.generateMarkup(topBlock,topOuts,blocks,info);this.addCode(topBlock,topOuts,blocks);var fnBlock=['(function (__code__, __context__, __in__, __out__'];for(var i=0;i<info.argIndex;++i)
fnBlock.push(', s',i);fnBlock.push(') {\n');if(this.subject)
fnBlock.push('with (this) {\n');if(this.context)
fnBlock.push('with (__context__) {\n');fnBlock.push('with (__in__) {\n');fnBlock.push.apply(fnBlock,blocks);if(this.subject)
fnBlock.push('}\n');if(this.context)
fnBlock.push('}\n');fnBlock.push('}})\n');function __link__(tag,code,outputs,args)
{tag.tag.compile();var tagOutputs=[];var markupArgs=[code,tag.tag.context,args,tagOutputs];markupArgs.push.apply(markupArgs,tag.tag.markupArgs);tag.tag.renderMarkup.apply(tag.tag.subject,markupArgs);outputs.push(tag);outputs.push(tagOutputs);}
function __escape__(value)
{function replaceChars(ch)
{switch(ch)
{case"<":return"&lt;";case">":return"&gt;";case"&":return"&amp;";case"'":return"&#39;";case'"':return"&quot;";}
return"?";};return String(value).replace(/[<>&"']/g,replaceChars);}
function __loop__(iter,outputs,fn)
{var iterOuts=[];outputs.push(iterOuts);if(iter instanceof Array)
iter=new ArrayIterator(iter);try
{while(1)
{var value=iter.next();var itemOuts=[0,0];iterOuts.push(itemOuts);fn.apply(this,[value,itemOuts]);}}
catch(exc)
{if(exc!=StopIteration)
throw exc;}}
var js=$.browser.msie?'var f = '+fnBlock.join("")+';f':fnBlock.join("");this.renderMarkup=eval(js);},getVarNames:function(args)
{if(this.vars)
args.push.apply(args,this.vars);for(var i=0;i<this.children.length;++i)
{var child=this.children[i];if(isTag(child))
child.tag.getVarNames(args);else if(child instanceof Parts)
{for(var i=0;i<child.parts.length;++i)
{if(child.parts[i]instanceof Variable)
{var name=child.parts[i].name;var names=name.split(".");args.push(names[0]);}}}}},generateMarkup:function(topBlock,topOuts,blocks,info)
{topBlock.push(',"<',this.tagName,'"');for(var name in this.attrs)
{if(name!="class")
{var val=this.attrs[name];topBlock.push(', " ',name,'=\\""');addParts(val,',',topBlock,info,true);topBlock.push(', "\\""');}}
if(this.listeners)
{for(var i=0;i<this.listeners.length;i+=2)
readPartNames(this.listeners[i+1],topOuts);}
if(this.props)
{for(var name in this.props)
readPartNames(this.props[name],topOuts);}
if("class"in this.attrs||this.classes)
{topBlock.push(', " class=\\""');if("class"in this.attrs)
addParts(this.attrs["class"],',',topBlock,info,true);topBlock.push(', " "');for(var name in this.classes)
{topBlock.push(', (');addParts(this.classes[name],'',topBlock,info);topBlock.push(' ? "',name,'" + " " : "")');}
topBlock.push(', "\\""');}
topBlock.push(',">"');this.generateChildMarkup(topBlock,topOuts,blocks,info);topBlock.push(',"</',this.tagName,'>"');},generateChildMarkup:function(topBlock,topOuts,blocks,info)
{for(var i=0;i<this.children.length;++i)
{var child=this.children[i];if(isTag(child))
child.tag.generateMarkup(topBlock,topOuts,blocks,info);else
addParts(child,',',topBlock,info,true);}},addCode:function(topBlock,topOuts,blocks)
{if(topBlock.length)
blocks.push('__code__.push(""',topBlock.join(""),');\n');if(topOuts.length)
blocks.push('__out__.push(',topOuts.join(","),');\n');topBlock.splice(0,topBlock.length);topOuts.splice(0,topOuts.length);},addLocals:function(blocks)
{var varNames=[];this.getVarNames(varNames);var map={};for(var i=0;i<varNames.length;++i)
{var name=varNames[i];if(map.hasOwnProperty(name))
continue;map[name]=1;var names=name.split(".");blocks.push('var ',names[0]+' = '+'__in__.'+names[0]+';\n');}},compileDOM:function()
{var path=[];var blocks=[];this.domArgs=[];path.embedIndex=0;path.loopIndex=0;path.staticIndex=0;path.renderIndex=0;var nodeCount=this.generateDOM(path,blocks,this.domArgs);var fnBlock=['(function (root, context, o'];for(var i=0;i<path.staticIndex;++i)
fnBlock.push(', ','s'+i);for(var i=0;i<path.renderIndex;++i)
fnBlock.push(', ','d'+i);fnBlock.push(') {\n');for(var i=0;i<path.loopIndex;++i)
fnBlock.push('var l',i,' = 0;\n');for(var i=0;i<path.embedIndex;++i)
fnBlock.push('var e',i,' = 0;\n');if(this.subject)
fnBlock.push('with (this) {\n');if(this.context)
fnBlock.push('with (context) {\n');fnBlock.push(blocks.join(""));if(this.subject)
fnBlock.push('}\n');if(this.context)
fnBlock.push('}\n');fnBlock.push('return ',nodeCount,';\n');fnBlock.push('})\n');function __prop__(object,prop,value)
{object[prop]=value;}
function __bind__(object,fn)
{return function(event){return fn.apply(object,[event]);}}
function __link__(node,tag,args)
{tag.tag.compile();var domArgs=[node,tag.tag.context,0];domArgs.push.apply(domArgs,tag.tag.domArgs);domArgs.push.apply(domArgs,args);return tag.tag.renderDOM.apply(tag.tag.subject,domArgs);}
var self=this;function __loop__(iter,fn)
{var nodeCount=0;for(var i=0;i<iter.length;++i)
{iter[i][0]=i;iter[i][1]=nodeCount;nodeCount+=fn.apply(this,iter[i]);}
return nodeCount;}
function __path__(parent,offset)
{var root=parent;for(var i=2;i<arguments.length;++i)
{var index=arguments[i];if(i==3)
index+=offset;if(index==-1)
parent=parent.parentNode;else
parent=parent.childNodes[index];}
return parent;}
var js=$.browser.msie?'var f = '+fnBlock.join("")+';f':fnBlock.join("");this.renderDOM=eval(js);},generateDOM:function(path,blocks,args)
{if(this.listeners||this.props)
this.generateNodePath(path,blocks);if(this.listeners)
{for(var i=0;i<this.listeners.length;i+=2)
{var val=this.listeners[i+1];var arg=generateArg(val,path,args);if($.browser.msie)
blocks.push('node.attachEvent("',this.listeners[i],'", __bind__(this, ',arg,'));\n');else
blocks.push('node.addEventListener("',this.listeners[i],'", __bind__(this, ',arg,'), false);\n');}}
if(this.props)
{for(var name in this.props)
{var val=this.props[name];var arg=generateArg(val,path,args);blocks.push("__prop__(node, '"+name+"', "+arg+");\n");}}
this.generateChildDOM(path,blocks,args);return 1;},generateNodePath:function(path,blocks)
{blocks.push("var node = __path__(root, o");for(var i=0;i<path.length;++i)
blocks.push(",",path[i]);blocks.push(");\n");},generateChildDOM:function(path,blocks,args)
{path.push(0);for(var i=0;i<this.children.length;++i)
{var child=this.children[i];if(isTag(child))
path[path.length-1]+='+'+child.tag.generateDOM(path,blocks,args);else
path[path.length-1]+='+1';}
path.pop();}};DomplateEmbed.prototype=copyObject(DomplateTag.prototype,{merge:function(args,oldTag)
{this.value=oldTag?oldTag.value:parseValue(args[0]);this.attrs=oldTag?oldTag.attrs:{};this.vars=oldTag?copyArray(oldTag.vars):[];var attrs=args[1];for(var name in attrs)
{var val=parseValue(attrs[name]);this.attrs[name]=val;readPartNames(val,this.vars);}
return creator(this,DomplateEmbed);},getVarNames:function(names)
{if(this.value instanceof Parts)
names.push(this.value.parts[0].name);if(this.vars)
names.push.apply(names,this.vars);},generateMarkup:function(topBlock,topOuts,blocks,info)
{this.addCode(topBlock,topOuts,blocks);blocks.push('__link__(');addParts(this.value,'',blocks,info);blocks.push(', __code__, __out__, {\n');var lastName=null;for(var name in this.attrs)
{if(lastName)
blocks.push(',');lastName=name;var val=this.attrs[name];blocks.push('"',name,'":');addParts(val,'',blocks,info);}
blocks.push('});\n');},generateDOM:function(path,blocks,args)
{var embedName='e'+path.embedIndex++;this.generateNodePath(path,blocks);var valueName='d'+path.renderIndex++;var argsName='d'+path.renderIndex++;blocks.push(embedName+' = __link__(node, ',valueName,', ',argsName,');\n');return embedName;}});DomplateLoop.prototype=copyObject(DomplateTag.prototype,{merge:function(args,oldTag)
{this.isLoop=true;this.varName=oldTag?oldTag.varName:args[0];this.iter=oldTag?oldTag.iter:parseValue(args[1]);this.vars=[];this.children=oldTag?copyArray(oldTag.children):[];var offset=Math.min(args.length,2);parseChildren(args,offset,this.vars,this.children);return creator(this,DomplateLoop);},getVarNames:function(names)
{if(this.iter instanceof Parts)
names.push(this.iter.parts[0].name);DomplateTag.prototype.getVarNames.apply(this,[names]);},generateMarkup:function(topBlock,topOuts,blocks,info)
{this.addCode(topBlock,topOuts,blocks);var iterName;if(this.iter instanceof Parts)
{var part=this.iter.parts[0];iterName=part.name;if(part.format)
{for(var i=0;i<part.format.length;++i)
iterName=part.format[i]+"("+iterName+")";}}
else
iterName=this.iter;blocks.push('__loop__.apply(this, [',iterName,', __out__, function(',this.varName,', __out__) {\n');this.generateChildMarkup(topBlock,topOuts,blocks,info);this.addCode(topBlock,topOuts,blocks);blocks.push('}]);\n');},generateDOM:function(path,blocks,args)
{var iterName='d'+path.renderIndex++;var counterName='i'+path.loopIndex;var loopName='l'+path.loopIndex++;if(!path.length)
path.push(-1,0);var preIndex=path.renderIndex;path.renderIndex=0;var nodeCount=0;var subBlocks=[];var basePath=path[path.length-1];for(var i=0;i<this.children.length;++i)
{path[path.length-1]=basePath+'+'+loopName+'+'+nodeCount;var child=this.children[i];if(isTag(child))
nodeCount+='+'+child.tag.generateDOM(path,subBlocks,args);else
nodeCount+='+1';}
path[path.length-1]=basePath+'+'+loopName;blocks.push(loopName,' = __loop__.apply(this, [',iterName,', function(',counterName,',',loopName);for(var i=0;i<path.renderIndex;++i)
blocks.push(',d'+i);blocks.push(') {\n');blocks.push(subBlocks.join(""));blocks.push('return ',nodeCount,';\n');blocks.push('}]);\n');path.renderIndex=preIndex;return loopName;}});function Variable(name,format)
{this.name=name;this.format=format;}
function Parts(parts)
{this.parts=parts;}
function parseParts(str)
{var re=/\$([_A-Za-z][_A-Za-z0-9.|]*)/g;var index=0;var parts=[];var m;while(m=re.exec(str))
{var pre=str.substr(index,(re.lastIndex-m[0].length)-index);if(pre)
parts.push(pre);var expr=m[1].split("|");parts.push(new Variable(expr[0],expr.slice(1)));index=re.lastIndex;}
if(!index)
return str;var post=str.substr(index);if(post)
parts.push(post);return new Parts(parts);}
function parseValue(val)
{return typeof(val)=='string'?parseParts(val):val;}
function parseChildren(args,offset,vars,children)
{for(var i=offset;i<args.length;++i)
{var val=parseValue(args[i]);children.push(val);readPartNames(val,vars);}}
function readPartNames(val,vars)
{if(val instanceof Parts)
{for(var i=0;i<val.parts.length;++i)
{var part=val.parts[i];if(part instanceof Variable)
vars.push(part.name);}}}
function generateArg(val,path,args)
{if(val instanceof Parts)
{var vals=[];for(var i=0;i<val.parts.length;++i)
{var part=val.parts[i];if(part instanceof Variable)
{var varName='d'+path.renderIndex++;if(part.format)
{for(var j=0;j<part.format.length;++j)
varName=part.format[j]+'('+varName+')';}
vals.push(varName);}
else
vals.push('"'+part.replace(/"/g,'\\"')+'"');}
return vals.join('+');}
else
{args.push(val);return's'+path.staticIndex++;}}
function addParts(val,delim,block,info,escapeIt)
{var vals=[];if(val instanceof Parts)
{for(var i=0;i<val.parts.length;++i)
{var part=val.parts[i];if(part instanceof Variable)
{var partName=part.name;if(part.format)
{for(var j=0;j<part.format.length;++j)
partName=part.format[j]+"("+partName+")";}
if(escapeIt)
vals.push("__escape__("+partName+")");else
vals.push(partName);}
else
vals.push('"'+part+'"');}}
else if(isTag(val))
{info.args.push(val);vals.push('s'+info.argIndex++);}
else
vals.push('"'+val+'"');var parts=vals.join(delim);if(parts)
block.push(delim,parts);}
function isTag(obj)
{return(typeof(obj)=="function"||obj instanceof Function)&&!!obj.tag;}
function isDomplate(obj)
{return(typeof(obj)=="object")&&!!obj.render;}
function creator(tag,cons)
{var fn=new Function("var tag = arguments.callee.tag;"+"var cons = arguments.callee.cons;"+"var newTag = new cons();"+"return newTag.merge(arguments, tag);");fn.tag=tag;fn.cons=cons;extend(fn,Renderer);return fn;}
function copyArray(oldArray)
{var ary=[];if(oldArray)
for(var i=0;i<oldArray.length;++i)
ary.push(oldArray[i]);return ary;}
function copyObject(l,r)
{var m={};extend(m,l);extend(m,r);return m;}
function extend(l,r)
{for(var n in r)
l[n]=r[n];}
function ArrayIterator(array)
{var index=-1;this.next=function()
{if(++index>=array.length)
throw StopIteration;return array[index];};}
function StopIteration(){}
this.$break=function()
{throw StopIteration;};var Renderer={renderHTML:function(args,outputs,self)
{var code=[];var markupArgs=[code,this.tag.context,args,outputs];markupArgs.push.apply(markupArgs,this.tag.markupArgs);this.tag.renderMarkup.apply(self?self:this.tag.subject,markupArgs);return code.join("");},insertRows:function(args,before,self)
{this.tag.compile();var outputs=[];var html=this.renderHTML(args,outputs,self);var doc=before.ownerDocument;var tableParent=doc.createElement("div");tableParent.innerHTML="<table>"+html+"</table>";var tbody=tableParent.firstChild.firstChild;var parent=before.tagName.toLowerCase()=="tr"?before.parentNode:before;var after=before.tagName.toLowerCase()=="tr"?before.nextSibling:null;var firstRow=tbody.firstChild,lastRow;while(tbody.firstChild)
{lastRow=tbody.firstChild;if(after)
parent.insertBefore(lastRow,after);else
parent.appendChild(lastRow);}
var offset=0;if(this.tag.isLoop)
{var node=firstRow.parentNode.firstChild;for(;node&&node!=firstRow;node=node.nextSibling)
++offset;}
var domArgs=[firstRow,this.tag.context,offset];domArgs.push.apply(domArgs,this.tag.domArgs);domArgs.push.apply(domArgs,outputs);this.tag.renderDOM.apply(self?self:this.tag.subject,domArgs);return[firstRow,lastRow];},insertAfter:function(args,before,self)
{this.tag.compile();var outputs=[];var html=this.renderHTML(args,outputs,self);var doc=before.ownerDocument;var range=doc.createRange();range.selectNode(doc.body);var frag=range.createContextualFragment(html);var root=frag.firstChild;if(before.nextSibling)
before.parentNode.insertBefore(frag,before.nextSibling);else
before.parentNode.appendChild(frag);var domArgs=[root,this.tag.context,0];domArgs.push.apply(domArgs,this.tag.domArgs);domArgs.push.apply(domArgs,outputs);this.tag.renderDOM.apply(self?self:(this.tag.subject?this.tag.subject:null),domArgs);return root;},replace:function(args,parent,self)
{this.tag.compile();var outputs=[];var html=this.renderHTML(args,outputs,self);var root;if(parent.nodeType==1)
{parent.innerHTML=html;root=parent.firstChild;}
else
{if(!parent||parent.nodeType!=9)
parent=document;if(!womb||womb.ownerDocument!=parent)
womb=parent.createElement("div");womb.innerHTML=html;root=womb.firstChild;}
var domArgs=[root,this.tag.context,0];domArgs.push.apply(domArgs,this.tag.domArgs);domArgs.push.apply(domArgs,outputs);this.tag.renderDOM.apply(self?self:this.tag.subject,domArgs);return root;},append:function(args,parent,self)
{this.tag.compile();var outputs=[];var html=this.renderHTML(args,outputs,self);if(!womb||womb.ownerDocument!=parent.ownerDocument)
womb=parent.ownerDocument.createElement("div");womb.innerHTML=html;var root=womb.firstChild;while(womb.firstChild)
parent.appendChild(womb.firstChild);var domArgs=[root,this.tag.context,0];domArgs.push.apply(domArgs,this.tag.domArgs);domArgs.push.apply(domArgs,outputs);this.tag.renderDOM.apply(self?self:this.tag.subject,domArgs);return root;},insertCols:function(args,parent,self)
{this.tag.compile();var outputs=[];var html=this.renderHTML(args,outputs,self);var womb=parent.ownerDocument.createElement("div");womb.innerHTML="<table><tbody><tr>"+html+"</tr></tbody></table>";womb=womb.firstChild.firstChild.firstChild;var firstCol=womb.firstChild;if(!firstCol)
return null;while(womb.firstChild)
parent.appendChild(womb.firstChild);var offset=0;if(this.tag.isLoop)
{var node=firstCol.parentNode.firstChild;for(;node&&node!=firstCol;node=node.nextSibling)
++offset;}
var domArgs=[firstCol,this.tag.context,offset];domArgs.push.apply(domArgs,this.tag.domArgs);domArgs.push.apply(domArgs,outputs);this.tag.renderDOM.apply(self?self:this.tag.subject,domArgs);return firstCol;}};function defineTags()
{for(var i=0;i<arguments.length;++i)
{var tagName=arguments[i];var fn=new Function("var newTag = new Domplate.DomplateTag('"+tagName+"'); return newTag.merge(arguments);");var fnName=tagName.toUpperCase();Domplate[fnName]=fn;}}
defineTags("a","button","br","canvas","col","colgroup","div","fieldset","form","h1","h2","h3","hr","img","input","label","legend","li","ol","optgroup","option","p","pre","select","span","strong","table","tbody","td","textarea","tfoot","th","thead","tr","tt","ul","code","iframe","canvas");}).apply(Domplate);return Domplate;});
/*
 * Name space
 */
var HARSTORAGE = HARSTORAGE || {};

/*
 * Cookies
 */
HARSTORAGE.create_cookie = function(name, value) {
    "use strict";

    document.cookie = name + "=" + value + ";" +
                      "expires=Wed, 1 Jan 3014 00:00:00 UTC;" +
                      "path=/";
};

HARSTORAGE.read_cookie = function(name) {
    "use strict";

    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");

    for (var i=0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }

    return null;
};

/*
 * View Preferences Menu
 */
HARSTORAGE.view_preferences = function() {
    "use strict";

    // Read preference from Cookie
    var theme = HARSTORAGE.read_cookie("chartTheme");

    // If preference is found - update form
    if (theme) {
        var theme_list = document.getElementById("theme-list");

        var len = theme_list.length;

        for (var i=0; i < len; i++ ) {
            if (theme_list[i].value === theme) {
                theme_list[i].checked = true;
                break;
            }
        }
    }

    // Display preference menu
    var menu = document.getElementById("preferences");
    
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
};

/*
 * Update Preferences
 */
HARSTORAGE.update_preferences = function() {
    "use strict";

    // Look up for selected theme
    var theme_list = document.getElementById("theme-list");

    var len = theme_list.length;

    for (var i=0; i < len; i++ ) {
        if (theme_list[i].checked === true) {
            HARSTORAGE.create_cookie("chartTheme", theme_list[i].value);
            break;
        }
    }

    // Refresh current window
    window.location.reload();    
};

/*
 * Chart colors from theme
 */
HARSTORAGE.Colors = function() {
    "use strict";

    // Colors for Y Axis labels
    var theme = HARSTORAGE.read_cookie("chartTheme");

    if (theme === "dark-green" || !theme) {
        return [
            "#DDDF0D",
            "#55BF3B",
            "#DF5353",
            "#7798BF",
            "#6AF9C4",
            "#DB843D",
            "#EEAAEE",
            "#669933",
            "#CC3333",
            "#FF9944",
            "#996633",
            "#4572A7",
            "#80699B",
            "#92A8CD",
            "#A47D7C",
            "#9A48C9",
            "#C99A48",
            "#879D79"
        ];
    } else {
        return [
            "#669933",
            "#CC3333",
            "#FF9944",
            "#996633",
            "#4572A7",
            "#80699B",
            "#92A8CD",
            "#EEAAEE",
            "#A47D7C",
            "#DDDF0D",
            "#55BF3B",
            "#DF5353",
            "#7798BF",
            "#6AF9C4",
            "#DB843D",
            "#9A48C9",
            "#C99A48",
            "#879D79"
        ];
    }
};

/*
 * Spinner options
 */
HARSTORAGE.SpinnerOpts = {
    lines: 10,
    length: 6,
    width: 3,
    radius: 6,
    color: "#498a2d",
    speed: 0.8,
    trail: 80
};
(function($,require){
    
    $(document).ready(function(){
      var content = document.getElementById("content");

        if(content !== undefined && content!== null){

        require.def("core/lib", ["core/trace"],
                function(a) {
                    var b = {},
                        c = navigator.userAgent.toLowerCase();
                    b.isFirefox = /firefox/.test(c),
                        b.isOpera = /opera/.test(c), b.isWebkit = /webkit/.test(c),
                        b.isSafari = /webkit/.test(c),
                        b.isIE = /msie/.test(c) && !/opera/.test(c),
                        b.isIE6 = /msie 6/i.test(navigator.appVersion),
                        b.browserVersion = (c.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) ||
                            [0, "0"])[1],
                        b.isIElt8 = b.isIE && b.browserVersion - 0 < 8,
                        b.extend = function d(a, c) {
                            var d = {};
                            b.append(d, a), b.append(d, c);
                            return d;
                        },
                        b.append = function(a, b) {
                            for (var c in b)
                                a[c] = b[c];
                            return a;
                        },
                        b.bind = function() {
                            var a = b.cloneArray(arguments),
                                c = a.shift(),
                                d = a.shift();
                            return function() {
                                return c.apply(d, b.arrayInsert(b.cloneArray(a), 0,
                                    arguments));
                            }
                        },
                        b.bindFixed = function() {
                            var a = b.cloneArray(arguments),
                                c = a.shift(),
                                d = a.shift();
                            return function() {
                                return c.apply(d, a);
                            }
                        },
                        b.dispatch = function(b, c, d) {
                            for (var e = 0; b && e < b.length; e++) {
                                var f = b[e];
                                if (f[c])
                                    try {
                                        f[c].apply(f, d);
                                    }
                                catch (g) {
                                    a.exception(g);
                                }
                            }
                        },
                        b.dispatch2 = function(b, c, d) {
                            for (var e = 0; e < b.length; e++) {
                                var f = b[e];
                                if (f[c]) {
                                    try {
                                        var g = f[c].apply(f, d);
                                        if (g)
                                            return g;
                                    } catch (h) {
                                        a.exception(h);
                                    }
                                }
                            }
                        };
                    var e = Object.prototype.toString,
                        f = /^\s*function(\s+[\w_$][\w\d_$]*)?\s*\(/;
                    b.isArray = function(a) {
                            return e.call(a) === "[object Array]"
                        },
                        b.isFunction = function(a) {
                            if (!a) {
                                return !1;
                            }
                            return e.call(a) === "[object Function]" || b.isIE &&
                                typeof a != "string" && f.test("" + a);
                        },
                        b.isAncestor = function(a, b) {
                            for (var c = a; c; c = c.parentNode) {
                                if (c == b)
                                    return !0;
                            }
                            return !1;
                        },
                        b.fixEvent = function(a) {
                            return jQuery.event.fix(a || window.event);
                        },
                        b.fireEvent = function(a, b) {
                            if (document.createEvent) {
                                var c = document.createEvent("Events");
                                c.initEvent(b, !0, !1);
                                return !a.dispatchEvent(c);
                            }
                        },
                        b.cancelEvent = function(a) {
                            var c = b.fixEvent(a);
                            c.stopPropagation();
                            c.preventDefault();
                        },
                        b.addEventListener = function(a, b, c, d) {
                            d = d || !1, a.addEventListener ? a.addEventListener(b, c,
                                d) : a.attachEvent("on" + b, c);
                        },
                        b.removeEventListener = function(a, b, c, d) {
                            d = d || !1, a.removeEventListener ? a.removeEventListener(
                                b, c, d) : a.detachEvent("on" + b, c);
                        },
                        b.isLeftClick = function(a) {
                            return a.button == 0 && b.noKeyModifiers(a);
                        },
                        b.noKeyModifiers = function(a) {
                            return !a.ctrlKey && !a.shiftKey && !a.altKey && !a.metaKey;
                        },
                        b.isControlClick = function(a) {
                            return a.button == 0 && b.isControl(a);
                        },
                        b.isShiftClick = function(a) {
                            return a.button == 0 && b.isShift(a);
                        },
                        b.isControl = function(a) {
                            return (a.metaKey || a.ctrlKey) && !a.shiftKey && !a.altKey;
                        },
                        b.isAlt = function(a) {
                            return a.altKey && !a.ctrlKey && !a.shiftKey && !a.metaKey;
                        },
                        b.isAltClick = function(a) {
                            return a.button == 0 && b.isAlt(a);
                        },
                        b.isControlShift = function(a) {
                            return (a.metaKey || a.ctrlKey) && a.shiftKey && !a.altKey;
                        },
                        b.isShift = function(a) {
                            return a.shiftKey && !a.metaKey && !a.ctrlKey && !a.altKey;
                        },
                        b.inflateRect = function(a, b, c) {
                            return {
                                top: a.top - c,
                                left: a.left - b,
                                height: a.height + 2 * c,
                                width: a.width + 2 * b
                            };
                        },
                        b.pointInRect = function(a, b, c) {
                            return c >= a.top && c <= a.top + a.height && b >= a.left &&
                                b <= a.left + a.width;
                        },
                        b.cloneArray = function(a, b) {
                            var c = [];
                            if (b)
                                for (var d = 0; d < a.length; ++d)
                                    c.push(b(a[d]));
                            else
                                for (var d = 0; d < a.length; ++d)
                                    c.push(a[d]);
                            return c;
                        },
                        b.arrayInsert = function(a, b, c) {
                            for (var d = 0; d < c.length; ++d)
                                a.splice(d + b, 0, c[d]);
                            return a;
                        },
                        b.remove = function(a, b) {
                            for (var c = 0; c < a.length; ++c)
                                if (a[c] == b) {
                                    a.splice(c, 1);
                                    return !0;
                                }
                            return !1;
                        },
                        b.formatSize = function(a) {
                            var b = 1;
                            b = b > 2 ? 2 : b, b = b < -1 ? -1 : b;
                            if (b == -1)
                                return a + " B";
                            var c = Math.pow(10, b);
                            return a == -1 || a == undefined ? "?" : a == 0 ? "0" : a <
                                1024 ? a + " B" : a < 1048576 ? Math.round(a / 1024 * c) /
                                c + " KB" : Math.round(a / 1048576 * c) / c + " MB";
                        },
                        b.formatTime = function(a) {
                            return a == -1 ? "-" : a < 1e3 ? a + "ms" : a < 6e4 ? Math.ceil(
                                    a / 10) / 100 + "s" : Math.ceil(a / 6e4 * 100) /
                                100 + "m";
                        },
                        b.formatNumber = function(a) {
                            a += "";
                            var b = a.split("."),
                                c = b[0],
                                d = b.length > 1 ? "." + b[1] : "",
                                e = /(\d+)(\d{3})/;
                            while (e.test(c))
                                c = c.replace(e, "$1 $2");
                            return c + d;
                        },
                        b.formatString = function(a) {
                            var c = b.cloneArray(arguments),
                                a = c.shift();
                            for (var d = 0; d < c.length; d++) {
                                var e = c[d].toString();
                                a = a.replace("%S", e)
                            }
                            return a;
                        },
                        b.parseISO8601 = function(a) {
                            var c = b.fromISOString(a);
                            return c ? c.getTime() : null;
                        },
                        b.fromISOString = function(a) {
                            if (!a)
                                return null;
                            var b =
                                /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/,
                                c = new RegExp(b),
                                d = a.toString().match(new RegExp(b));
                            if (!d)
                                return null;
                            var e = new Date;
                            e.setUTCDate(1),
                                e.setUTCFullYear(parseInt(d[1], 10)),
                                e.setUTCMonth(parseInt(d[3], 10) - 1),
                                e.setUTCDate(parseInt(d[5], 10)),
                                e.setUTCHours(parseInt(d[7], 10)),
                                e.setUTCMinutes(parseInt(d[9], 10)),
                                e.setUTCSeconds(parseInt(d[11], 10)),
                                d[12] ? e.setUTCMilliseconds(parseFloat(d[12]) * 1e3) :
                                e.setUTCMilliseconds(0);
                            if (d[13] != "Z") {
                                var f = d[15] * 60 + parseInt(d[17], 10);
                                f *= d[14] == "-" ? -1 : 1,
                                    e.setTime(e.getTime() - f * 60 * 1e3);
                            }
                            return e;
                        },
                        b.toISOString = function(a) {
                            function b(a, b) {
                                b || (b = 2);
                                var c = new String(a);
                                while (c.length < b)
                                    c = "0" + c;
                                return c;
                            }
                            var c = a.getUTCFullYear() + "-" + b(a.getMonth() + 1) +
                                "-" + b(a.getDate()) + "T" + b(a.getHours()) + ":" + b(
                                    a.getMinutes()) + ":" + b(a.getSeconds()) + "." + b(
                                    a.getMilliseconds(), 3),
                                d = a.getTimezoneOffset(),
                                e = Math.floor(d / 60),
                                f = Math.floor(d % 60),
                                g = (d > 0 ? "-" : "+") + b(Math.abs(e)) + ":" + b(Math
                                    .abs(f));
                            return c + g;
                        },
                        b.getFileName = function(c) {
                            try {
                                var d = b.splitURLBase(c);
                                return d.name;
                            } catch (e) {
                                a.log(unescape(c));
                            }
                            return c;
                        },
                        b.getFileExtension = function(a) {
                            if (!a)
                                return null;
                            var b = a.indexOf("?");
                            b != -1 && (a = a.substr(0, b));
                            var c = a.lastIndexOf(".");
                            return a.substr(c + 1);
                        },
                        b.splitURLBase = function(a) {
                            if (b.isDataURL(a))
                                return b.splitDataURL(a);
                            return b.splitURLTrue(a);
                        },
                        b.isDataURL = function(a) {
                            return a && a.substr(0, 5) == "data:";
                        },
                        b.splitDataURL = function(a) {
                            var c = a.indexOf(":", 3);
                            if (c != 4)
                                return !1;
                            var d = a.indexOf(",", c + 1);
                            if (d < c)
                                return !1;
                            var e = {
                                    encodedContent: a.substr(d + 1)
                                },
                                f = a.substr(c + 1, d),
                                g = f.split(";");
                            for (var h = 0; h < g.length; h++) {
                                var i = g[h].split("=");
                                i.length == 2 && (e[i[0]] = i[1])
                            }
                            if (e.hasOwnProperty("fileName")) {
                                var j = decodeURIComponent(e.fileName),
                                    k = b.splitURLTrue(j);
                                if (e.hasOwnProperty("baseLineNumber")) {
                                    e.path = k.path,
                                        e.line = e.baseLineNumber;
                                    var l = decodeURIComponent(e.encodedContent.substr(
                                        0, 200)).replace(/\s*$/, "");
                                    e.name = "eval->" + l;
                                } else {
                                    e.name = k.name;
                                    e.path = k.path;
                                }
                            } else {
                                e.hasOwnProperty("path") || (e.path = "data:");
                                e.hasOwnProperty("name") || (e.name =
                                    decodeURIComponent(e.encodedContent.substr(0,
                                        200)).replace(/\s*$/, ""));
                            }
                            return e;
                        },
                        b.splitURLTrue = function(a) {
                            var b = /:\/{1,3}(.*?)\/([^\/]*?)\/?($|\?.*)/,
                                c = b.exec(a);
                            return c ? c[2] ? {
                                path: c[1],
                                name: c[2] + c[3]
                            } : {
                                path: c[1],
                                name: c[1]
                            } : {
                                name: a,
                                path: a
                            };
                        },
                        b.getURLParameter = function(a) {
                            var b = window.location.search.substring(1),
                                c = b.split("&");
                            for (var d = 0; d < c.length; d++) {
                                var e = c[d].split("=");
                                if (e[0] == a)
                                    return unescape(e[1])
                            }

                            return null;
                        },
                        b.getURLParameters = function(a) {
                            var b = [],
                                c = window.location.search.substring(1),
                                d = c.split("&");

                            for (var e = 0; e < d.length; e++) {
                                var f = d[e].split("=");
                                f[0] == a && b.push(unescape(f[1]))
                            }
                            return b;
                        },
                        b.parseURLParams = function(a) {
                            var c = a ? a.indexOf("?") : -1;
                            if (c == -1)
                                return [];
                            var d = a.substr(c + 1),
                                e = d.lastIndexOf("#");
                            e != -1 && (d = d.substr(0, e));
                            if (!d)
                                return [];
                            return b.parseURLEncodedText(d);
                        },
                        b.parseURLEncodedText = function(a, c) {
                            function f(a) {
                                try {
                                    return decodeURIComponent(a);
                                } catch (b) {
                                    return decodeURIComponent(unescape(a));
                                }
                            }
                            var d = 25e3,
                                e = [];

                            if (a == "")
                                return e;
                            a = a.replace(/\+/g, " ");
                            var g = a.split("&");
                            for (var h = 0; h < g.length; ++h)
                                try {
                                    var i = g[h].indexOf("=");
                                    if (i != -1) {
                                        var j = g[h].substring(0, i),
                                            k = g[h].substring(i + 1);
                                        k.length > d && !c && (k = b.$STR("LargeData")),
                                            e.push({
                                                name: f(j),
                                                value: f(k)
                                            })
                                    } else {
                                        var j = g[h];
                                        e.push({
                                            name: f(j),
                                            value: ""
                                        })
                                    }
                                }
                            catch (l) {}
                            e.sort(function(a, b) {
                                return a.name <= b.name ? -1 : 1
                            });
                            return e;
                        },
                        b.getBody = function(a) {
                            if (a.body)
                                return a.body;
                            var b = a.getElementsByTagName("body")[0];
                            if (b)
                                return b;
                            return null;
                        },
                        b.getHead = function(a) {
                            return a.getElementsByTagName("head")[0];
                        },
                        b.getAncestorByClass = function(a, c) {
                            for (var d = a; d; d = d.parentNode)
                                if (b.hasClass(d, c))
                                    return d;
                            return null;
                        },
                        b.$ = function() {
                            return b.getElementByClass.apply(this, arguments);
                        },
                        b.getElementByClass = function(a, c) {
                            if (!a)
                                return null;
                            var d = b.cloneArray(arguments);
                            d.splice(0, 1);
                            for (var e = a.firstChild; e; e = e.nextSibling) {
                                var f = b.cloneArray(d);
                                f.unshift(e);
                                if (b.hasClass.apply(this, f))
                                    return e;
                                var g = b.getElementByClass.apply(this, f);
                                if (g) return g;
                            }
                            return null;
                        },
                        b.getElementsByClass = function(a, c) {
                            function f(a, c, d) {
                                for (var e = a.firstChild; e; e = e.nextSibling) {
                                    var g = b.cloneArray(c);
                                    g.unshift(e), b.hasClass.apply(null, g) && d.push(e),
                                        f(e, c, d)
                                }
                            }
                            if (a.querySelectorAll) {
                                var d = b.cloneArray(arguments);
                                d.shift();
                                var e = "." + d.join(".");
                                return a.querySelectorAll(e);
                            }
                            var g = [],
                                d = b.cloneArray(arguments);
                            d.shift(),
                                f(a, d, g);
                            return g;
                        },
                        b.getChildByClass = function(a) {
                            for (var c = 1; c < arguments.length; ++c) {
                                var d = arguments[c],
                                    e = a.firstChild;
                                a = null;
                                for (; e; e = e.nextSibling)
                                    if (b.hasClass(e, d)) {
                                        a = e;
                                        break;
                                    }
                            }
                            return a;
                        },
                        b.eraseNode = function(a) {
                            while (a.lastChild)
                                a.removeChild(a.lastChild);
                        },
                        b.clearNode = function(a) {
                            a.innerHTML = "";
                        },
                        b.hasClass = function(a, b) {
                            if (a && a.nodeType == 1) {
                                for (var c = 1; c < arguments.length; ++c) {
                                    var b = arguments[c],
                                        d = a.className;
                                    if (!d || d.indexOf(b + " ") == -1)
                                        return !1;
                                }
                                return !0;
                            }
                            return !1;
                        },
                        b.setClass = function(a, c) {
                            a && !b.hasClass(a, c) && (a.className += " " + c + " ");
                        },
                        b.removeClass = function(a, b) {
                            if (a && a.className) {
                                var c = a.className.indexOf(b);
                                if (c >= 0) {
                                    var d = b.length;
                                    a.className = a.className.substr(0, c - 1) + a.className
                                        .substr(c + d);
                                }
                            }
                        },
                        b.toggleClass = function(a, c) {
                            if (b.hasClass(a, c)) {
                                b.removeClass(a, c);
                                return !1;
                            }
                            b.setClass(a, c);
                            return !0;
                        },
                        b.setClassTimed = function(a, c, d) {
                            d || (d = 1300),
                                a.__setClassTimeout ? clearTimeout(a.__setClassTimeout) :
                                b.setClass(a, c),
                                a.__setClassTimeout = setTimeout(function() {
                                    delete a.__setClassTimeout,
                                        b.removeClass(a, c)
                                }, d)
                        },
                        b.trim = function(a) {
                            return a.replace(/^\s*|\s*$/g, "");
                        },
                        b.wrapText = function(a, c) {
                            var d = /[^A-Za-z_$0-9'"-]/,
                                e = [],
                                f = 100,
                                g = b.splitLines(a);

                            for (var h = 0; h < g.length; ++h) {
                                var i = g[h];
                                while (i.length > f) {
                                    var j = d.exec(i.substr(f, 100)),
                                        k = f + (j ? j.index : 0),
                                        l = i.substr(0, k);
                                    i = i.substr(k),
                                        c || e.push("<pre>"),
                                        e.push(c ? l : b.escapeHTML(l)),
                                        c || e.push("</pre>")
                                }
                                c || e.push("<pre>"),
                                    e.push(c ? i : b.escapeHTML(i)),
                                    c || e.push("</pre>")
                            }
                            return e.join(c ? "\n" : "");
                        },
                        b.insertWrappedText = function(a, c, d) {
                            c.innerHTML = "<pre>" + b.wrapText(a, d) + "</pre>";
                        },
                        b.splitLines = function(a) {
                            var b = /\r\n|\r|\n/;
                            if (!a) return [];
                            if (a.split) return a.split(b);
                            var c = a + "",
                                d = c.split(b);
                            return d;
                        },
                        b.getPrettyDomain = function(a) {
                            var b = /[^:]+:\/{1,3}(www\.)?([^\/]+)/.exec(a);
                            return b ? b[2] : "";
                        },
                        b.escapeHTML = function(a) {
                            function b(a) {
                                switch (a) {
                                    case "<":
                                        return "&lt;";
                                    case ">":
                                        return "&gt;";
                                    case "&":
                                        return "&amp;";
                                    case "'":
                                        return "&#39;";
                                    case '"':
                                        return "&quot;";
                                }
                                return "?";
                            }
                            return String(a).replace(/[<>&"']/g, b);
                        },
                        b.cropString = function(a, c) {
                            a = a + "";
                            if (c) var d = c / 2;
                            else var d = 50;
                            return a.length > c ? b.escapeNewLines(a.substr(0, d) +
                                "..." + a.substr(a.length - d)) : b.escapeNewLines(
                                a)
                        }, b.escapeNewLines = function(a) {
                            return a.replace(/\r/g, "\\r").replace(/\n/g, "\\n")
                        }, b.cloneJSON = function(b) {
                            if (b == null || typeof b != "object") return b;
                            try {
                                var c = b.constructor();
                                for (var d in b) c[d] = cloneJSON(b[d]);
                                return c
                            } catch (e) {
                                a.exception(b)
                            }
                            return null
                        }, b.getOverflowParent = function(a) {
                            for (var b = a.parentNode; b; b = b.offsetParent)
                                if (b.scrollHeight > b.offsetHeight) return b
                        }, b.getElementBox = function(a) {
                            var c = {};
                            if (a.getBoundingClientRect) {
                                var d = a.getBoundingClientRect(),
                                    e = b.isIE ? document.body.clientTop || document.documentElement
                                    .clientTop : 0,
                                    f = b.getWindowScrollPosition();
                                c.top = Math.round(d.top - e + f.top), c.left = Math.round(
                                    d.left - e + f.left), c.height = Math.round(d.bottom -
                                    d.top), c.width = Math.round(d.right - d.left)
                            } else {
                                var g = b.getElementPosition(a);
                                c.top = g.top, c.left = g.left, c.height = a.offsetHeight,
                                    c.width = a.offsetWidth
                            }
                            return c
                        }, b.getElementPosition = function(a) {
                            var b = 0,
                                c = 0;
                            do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent);
                            return {
                                left: b,
                                top: c
                            }
                        }, b.getWindowSize = function() {
                            var a = 0,
                                b = 0,
                                c;
                            typeof window.innerWidth == "number" ? (a = window.innerWidth,
                                    b = window.innerHeight) : (c = document.documentElement) &&
                                (c.clientHeight || c.clientWidth) ? (a = c.clientWidth,
                                    b = c.clientHeight) : (c = document.body) && (c.clientHeight ||
                                    c.clientWidth) && (a = c.clientWidth, b = c.clientHeight);
                            return {
                                width: a,
                                height: b
                            }
                        }, b.getWindowScrollSize = function() {
                            var a = 0,
                                c = 0,
                                d;
                            !b.isIEQuiksMode && (d = document.documentElement) && (d.scrollHeight ||
                                    d.scrollWidth) && (a = d.scrollWidth, c = d.scrollHeight),
                                (d = document.body) && (d.scrollHeight || d.scrollWidth) &&
                                (d.scrollWidth > a || d.scrollHeight > c) && (a = d.scrollWidth,
                                    c = d.scrollHeight);
                            return {
                                width: a,
                                height: c
                            }
                        }, b.getWindowScrollPosition = function() {
                            var a = 0,
                                b = 0,
                                c;
                            typeof window.pageYOffset == "number" ? (a = window.pageYOffset,
                                b = window.pageXOffset) : (c = document.body) && (c
                                .scrollTop || c.scrollLeft) ? (a = c.scrollTop, b =
                                c.scrollLeft) : (c = document.documentElement) && (
                                c.scrollTop || c.scrollLeft) && (a = c.scrollTop, b =
                                c.scrollLeft);
                            return {
                                top: a,
                                left: b
                            }
                        }, b.scrollIntoCenterView = function(a, c, d, e) {
                            if (a) {
                                c || (c = b.getOverflowParent(a));
                                if (!c) return;
                                var f = b.getClientOffset(a);
                                if (!e) {
                                    var g = f.y - c.scrollTop,
                                        h = c.scrollTop + c.clientHeight - (f.y + a.offsetHeight);
                                    if (g < 0 || h < 0) {
                                        var i = f.y - c.clientHeight / 2;
                                        c.scrollTop = i
                                    }
                                }
                                if (!d) {
                                    var j = f.x - c.scrollLeft,
                                        k = c.scrollLeft + c.clientWidth - (f.x + a.clientWidth);
                                    if (j < 0 || k < 0) {
                                        var l = f.x - c.clientWidth / 2;
                                        c.scrollLeft = l
                                    }
                                }
                            }
                        }, b.getClientOffset = function(a) {
                            function b(a, c, d) {
                                var e = a.offsetParent,
                                    f = d.getComputedStyle(a, "");
                                a.offsetLeft && (c.x += a.offsetLeft + parseInt(f.borderLeftWidth)),
                                    a.offsetTop && (c.y += a.offsetTop + parseInt(f.borderTopWidth)),
                                    e ? e.nodeType == 1 && b(e, c, d) : a.ownerDocument
                                    .defaultView.frameElement && b(a.ownerDocument.defaultView
                                        .frameElement, c, a.ownerDocument.defaultView)
                            }
                            var c = {
                                x: 0,
                                y: 0
                            };
                            if (a) {
                                var d = a.ownerDocument.defaultView;
                                b(a, c, d)
                            }
                            return c
                        }, b.addStyleSheet = function(a, c) {
                            if (!a.getElementById(c)) {
                                var d = a.createElement("link");
                                d.type = "text/css", d.rel = "stylesheet", d.href = c,
                                    d.setAttribute("id", c);
                                var e = b.getHead(a);
                                e.appendChild(d)
                            }
                        }, b.selectElementText = function(a, b, c) {
                            var d = window,
                                e = d.document;
                            if (d.getSelection && e.createRange) {
                                var f = d.getSelection(),
                                    g = e.createRange();
                                g.setStart(a, b), g.setEnd(a, c), f.removeAllRanges(),
                                    f.addRange(g)
                            } else e.body.createTextRange && (g = e.body.createTextRange(),
                                g.moveToElementText(a), g.select())
                        };
                    return b
                }), require.def("core/cookies", ["core/lib"], function(a) {
                var b = {
                    getCookie: function(b) {
                        var c = document.cookie.split(";");
                        for (var d = 0; d < c.length; d++) {
                            var e = c[d].split("=");
                            if (a.trim(e[0]) == b) return e[1].length ?
                                unescape(a.trim(e[1])) : null
                        }
                    },
                    setCookie: function(a, b, c, d, e, f) {
                        var g = new Date;
                        g.setTime(g.getTime()), c && (c = c * 1e3 * 60 * 60 *
                            24);
                        var h = new Date(g.getTime() + c);
                        document.cookie = a + "=" + escape(b) + (c ?
                            ";expires=" + h.toGMTString() : "") + (d ?
                            ";path=" + d : "") + (e ? ";domain=" + e :
                            "") + (f ? ";secure" : "")
                    },
                    removeCookie: function(a, b, c) {
                        this.getCookie(a) && (document.cookie = a + "=" + (
                                b ? ";path=" + b : "") + (c ?
                                ";domain=" + c : "") +
                            ";expires=Thu, 01-Jan-1970 00:00:01 GMT")
                    },
                    toggleCookie: function(a) {
                        var b = this.getBooleanCookie(a);
                        this.setCookie(a, !b)
                    },
                    getBooleanCookie: function(a) {
                        var b = this.getCookie(a);
                        return !b || b == "false" ? !1 : !0
                    }
                };
                return b
            }),
            function() {
                function c(a, b, c, d, e) {
                    var f = d + b + "/" + e;
                    require._fileExists(a.nameToUrl(f, null)) && c.push(f)
                }

                function b(a, b, c, d, e, f) {
                    b[a] && (c.push(a), (b[a] === !0 || b[a] === 1) && d.push(e + a +
                        "/" + f))
                }
                var a = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;
                define("i18n", {
                    version: "0.24.0",
                    load: function(d, e, f, g) {
                        g = g || {};
                        var h, i = a.exec(d),
                            j = i[1],
                            k = i[4],
                            l = i[5],
                            m = k.split("-"),
                            n = [],
                            o = {},
                            p, q, r = "";
                        i[5] ? (j = i[1], h = j + l) : (h = d, l = i[4], k =
                            g.locale || (g.locale = typeof navigator ===
                                "undefined" ? "root" : (navigator.language ||
                                    navigator.userLanguage || "root").toLowerCase()
                            ), m = k.split("-"));
                        if (g.isBuild) {
                            n.push(h), c(e, "root", n, j, l);
                            for (p = 0; q = m[p]; p++) r += (r ? "-" : "") +
                                q, c(e, r, n, j, l);
                            e(n), f()
                        } else e([h], function(a) {
                            var c = [];
                            b("root", a, c, n, j, l);
                            for (p = 0; q = m[p]; p++) r += (r ?
                                "-" : "") + q, b(r, a, c, n, j,
                                l);
                            e(n, function() {
                                var b, d;
                                for (b = c.length - 1; b >
                                    -1 && (q = c[b]); b--) {
                                    d = a[q];
                                    if (d === !0 || d ===
                                        1) d = e(j + q +
                                        "/" + l);
                                    require.mixin(o, d)
                                }
                                f(o)
                            })
                        })
                    }
                })
            }(), define("nls/requestList", {
                root: {
                    fromCache: "From Cache",
                    menuBreakLayout: "Break Timeline Layout",
                    menuOpenRequestInWindow: "Open Request in New Window",
                    menuOpenResponseInWindow: "Open Response in New Window",
                    request: "Request",
                    requests: "Requests",
                    tooltipSize: "%S (%S bytes)",
                    tooltipZippedSize: "%S (%S bytes) - compressed",
                    tooltipUnzippedSize: "%S (%S bytes) - uncompressed",
                    unknownSize: "Unknown size",
                    "request.Started": "Request start time since the beginning",
                    "request.phases.label": "Request phases start and elapsed time relative to the request start:",
                    "request.phase.Resolving": "DNS Lookup",
                    "request.phase.Connecting": "Connecting",
                    "request.phase.Blocking": "Blocking",
                    "request.phase.Sending": "Sending",
                    "request.phase.Waiting": "Waiting",
                    "request.phase.Receiving": "Receiving",
                    "request.timings.label": "Event timing relative to the request start:",
                    ContentLoad: "DOM Loaded",
                    WindowLoad: "Page Loaded",
                    "page.event.Load": "Page Loaded",
                    menuBreakTimeline: "Break Timeline Layout",
                    menuOpenRequest: "Open Request in New Window",
                    menuOpenResponse: "Open Response in New Window"
                }
            }), require.def("preview/jsonSchema", [], function() {
                var a = {
                    validate: function(a, b) {
                        return this._validate(a, b, !1)
                    },
                    checkPropertyChange: function(a, b, c) {
                        return this._validate(a, b, c || "property")
                    },
                    _validate: function(a, b, c) {
                        function f(a, b, f, g) {
                            if (typeof b == "object") {
                                (typeof a != "object" || a instanceof Array) &&
                                d.push({
                                    property: f,
                                    message: "an object is required"
                                });
                                for (var h in b)
                                    if (b.hasOwnProperty(h) && (h.charAt(0) !=
                                            "_" || h.charAt(1) != "_")) {
                                        var i = a[h],
                                            j = b[h];
                                        e(i, j, f, h)
                                    }
                            }
                            for (h in a) {
                                a.hasOwnProperty(h) && (h.charAt(0) != "_" ||
                                        h.charAt(1) != "_") && b && !b[h] &&
                                    g === !1 && d.push({
                                        property: f,
                                        message: typeof i +
                                            "The property " + h +
                                            " is not defined in the schema and the schema does not allow additional properties"
                                    });
                                var k = b && b[h] && b[h].requires;
                                k && !(k in a) && d.push({
                                        property: f,
                                        message: "the presence of the property " +
                                            h + " requires that " + k +
                                            " also be present"
                                    }), i = a[h], b && typeof b == "object" &&
                                    !(h in b) && e(i, g, f, h), !c && i &&
                                    i.$schema && (d = d.concat(e(i, i.$schema,
                                        f, h)))
                            }
                            return d
                        }

                        function e(a, b, g, h) {
                            function k(a, b) {
                                if (a) {
                                    if (typeof a == "string" && a != "any" &&
                                        (a == "null" ? b !== null : typeof b !=
                                            a) && !(b instanceof Array && a ==
                                            "array") && (a != "integer" ||
                                            b % 1 !== 0)) return [{
                                        property: g,
                                        message: typeof b +
                                            " value found, but a " +
                                            a + " is required"
                                    }];
                                    if (a instanceof Array) {
                                        var c = [];
                                        for (var f = 0; f < a.length; f++)
                                            if (!(c = k(a[f], b)).length)
                                                break;
                                        if (c.length) return c
                                    } else if (typeof a == "object") {
                                        var h = d;
                                        d = [], e(b, a, g);
                                        var i = d;
                                        d = h;
                                        return i
                                    }
                                }
                                return []
                            }

                            function j(a) {
                                d.push({
                                    property: g,
                                    message: a
                                })
                            }
                            var i;
                            g += g ? typeof h == "number" ? "[" + h + "]" :
                                typeof h == "undefined" ? "" : "." + h : h;
                            if ((typeof b != "object" || b instanceof Array) &&
                                (g || typeof b != "function")) {
                                typeof b == "function" ? a instanceof b ||
                                    j(
                                        "is not an instance of the class/constructor " +
                                        b.name) : b && j(
                                        "Invalid schema/property definition " +
                                        b);
                                return null
                            }
                            c && b.readonly && j(
                                "is a readonly field, it can not be changed"
                            ), b["extends"] && e(a, b["extends"], g, h);
                            if (a === undefined) b.optional || j(
                                "is missing and it is not optional");
                            else {
                                d = d.concat(k(b.type, a)), b.disallow && !
                                    k(b.disallow, a).length && j(
                                        " disallowed value was matched");
                                if (a !== null) {
                                    if (a instanceof Array) {
                                        if (b.items)
                                            if (b.items instanceof Array)
                                                for (h = 0, i = a.length; h <
                                                    i; h++) d.concat(e(a[h],
                                                    b.items[h], g,
                                                    h));
                                            else
                                                for (h = 0, i = a.length; h <
                                                    i; h++) d.concat(e(a[h],
                                                    b.items, g, h));
                                        b.minItems && a.length < b.minItems &&
                                            j("There must be a minimum of " +
                                                b.minItems +
                                                " in the array"), b.maxItems &&
                                            a.length > b.maxItems && j(
                                                "There must be a maximum of " +
                                                b.maxItems +
                                                " in the array")
                                    } else b.properties && d.concat(f(a, b.properties,
                                        g, b.additionalProperties));
                                    b.pattern && typeof a == "string" && !a
                                        .match(b.pattern) && j(
                                            "does not match the regex pattern " +
                                            b.pattern), b.maxLength &&
                                        typeof a == "string" && a.length >
                                        b.maxLength && j("may only be " + b
                                            .maxLength + " characters long"
                                        ), b.minLength && typeof a ==
                                        "string" && a.length < b.minLength &&
                                        j("must be at least " + b.minLength +
                                            " characters long"), typeof b.minimum !==
                                        undefined && typeof a == typeof b.minimum &&
                                        b.minimum > a && j(
                                            "must have a minimum value of " +
                                            b.minimum), typeof b.maximum !==
                                        undefined && typeof a == typeof b.maximum &&
                                        b.maximum < a && j(
                                            "must have a maximum value of " +
                                            b.maximum);
                                    if (b["enum"]) {
                                        var l = b["enum"];
                                        i = l.length;
                                        var m;
                                        for (var n = 0; n < i; n++)
                                            if (l[n] === a) {
                                                m = 1;
                                                break
                                            }
                                        m || j(
                                            "does not have a value in the enumeration " +
                                            l.join(", "))
                                    }
                                    typeof b.maxDecimal == "number" && a.toString()
                                        .match(new RegExp("\\.[0-9]{" + (b.maxDecimal +
                                            1) + ",}")) && j(
                                            "may only have " + b.maxDecimal +
                                            " digits of decimal places")
                                }
                            }
                            return null
                        }
                        var d = [];
                        b && e(a, b, "", c || ""), !c && a && a.$schema &&
                            e(a, a.$schema, "", "");
                        return {
                            valid: !d.length,
                            errors: d
                        }
                    }
                };
                return a
            }), require.def("preview/ref", ["core/lib"], function(a) {
                var b = {
                    resolveJson: function(b, c) {
                        function n(o, p, q, r, s) {
                            var t, u, v = d in o ? o[d] : q;
                            v !== undefined && (v = (e + v).replace(k,
                                "$2$3"));
                            var w = s || o;
                            if (v !== undefined) {
                                f && (o.__id = v), c.schemas && !(o instanceof Array) &&
                                    (u = v.match(/^(.+\/)[^\.\[]*$/)) && (r =
                                        c.schemas[u[1]]);
                                if (g[v] && o instanceof Array == g[v] instanceof Array)
                                    w = g[v], delete w.$ref, t = !0;
                                else {
                                    var x = r && r.prototype;
                                    x && (m.prototype = x, w = new m)
                                }
                                g[v] = w, h && (h[v] = c.time)
                            }
                            var y = r && r.properties,
                                z = o.length;
                            for (var A in o) {
                                if (A == z) break;
                                if (o.hasOwnProperty(A)) {
                                    u = o[A];
                                    var B = y && y[A];
                                    if (B && B.format == "date-time" &&
                                        typeof u == "string") u = a.fromISOString(
                                        u);
                                    else if (typeof u == "object" && u && !
                                        (u instanceof Date)) {
                                        i = u.$ref;
                                        if (i) {
                                            delete o[A];
                                            var C = i.replace(
                                                /(#)([^\.\[])/, "$1.$2"
                                            ).match(
                                                /(^([^\[]*\/)?[^#\.\[]*)#?([\.\[].*)?/
                                            );
                                            if (i = C[1] == "$" || C[1] ==
                                                "this" || C[1] == "" ? b :
                                                g[(e + C[1]).replace(k,
                                                    "$2$3")]) C[3] && C[3].replace(
                                                /(\[([^\]]+)\])|(\.?([^\.\[]+))/g,
                                                function(a, b, c, d, e) {
                                                    i = i && i[c ? c.replace(
                                                        /[\"\'\\]/,
                                                        "") : e]
                                                });
                                            if (i) u = i;
                                            else if (p) u = n(u, !1, u.$ref,
                                                B), u._loadObject = c.loader;
                                            else {
                                                var D;
                                                D || j.push(w), D = !0
                                            }
                                        } else p || (u = n(u, j == o, v &&
                                            l(v, A), B, w != o &&
                                            typeof w[A] == "object" &&
                                            w[A]))
                                    }
                                    o[A] = u;
                                    if (w != o && !w.__isDirty) {
                                        var E = w[A];
                                        w[A] = u, t && u !== E && !w._loadObject &&
                                            !(u instanceof Date && E instanceof Date &&
                                                u.getTime() == E.getTime()) &&
                                            (typeof u != "function" ||
                                                typeof E != "function" || u
                                                .toString() != E.toString()
                                            ) && g.onUpdate && g.onUpdate(w,
                                                A, E, u)
                                    }
                                }
                            }
                            if (t) {
                                for (A in w)
                                    if (!w.__isDirty && w.hasOwnProperty(A) &&
                                        !o.hasOwnProperty(A) && A != "__id" &&
                                        A != "__clientId" && !(w instanceof Array &&
                                            isNaN(A))) {
                                        g.onUpdate && A != "_loadObject" &&
                                            A != "_idAttr" && g.onUpdate(w,
                                                A, w[A], undefined), delete w[
                                                A];
                                        while (w instanceof Array && w.length &&
                                            w[w.length - 1] === undefined) w
                                            .length--
                                    }
                            } else g.onLoad && g.onLoad(w);
                            return w
                        }
                        c = c || {};
                        var d = c.idAttribute || "id",
                            e = c.idPrefix || "",
                            f = c.assignAbsoluteIds,
                            g = c.index || {},
                            h = c.timeStamps,
                            i, j = [],
                            k =
                            /^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/,
                            l = this._addProp,
                            m = function() {};
                        b && typeof b == "object" && (b = n(b, !1, c.defaultId),
                            n(j, !1));
                        return b
                    },
                    _addProp: function(a, b) {
                        return a + (a.match(/#/) ? a.length == 1 ? "" : "." :
                            "#") + b
                    }
                };
                return b
            }), require.def("preview/harSchema", [], function() {
                function r() {}
                var a =
                    /^(\d{4})(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/,
                    b = {
                        logType: {
                            id: "logType",
                            description: "HTTP Archive structure.",
                            type: "object",
                            properties: {
                                log: {
                                    type: "object",
                                    properties: {
                                        version: {
                                            type: "string"
                                        },
                                        creator: {
                                            $ref: "creatorType"
                                        },
                                        browser: {
                                            $ref: "browserType"
                                        },
                                        pages: {
                                            type: "array",
                                            optional: !0,
                                            items: {
                                                $ref: "pageType"
                                            }
                                        },
                                        entries: {
                                            type: "array",
                                            items: {
                                                $ref: "entryType"
                                            }
                                        },
                                        comment: {
                                            type: "string",
                                            optional: !0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    c = {
                        creatorType: {
                            id: "creatorType",
                            description: "Name and version info of the log creator app.",
                            type: "object",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                version: {
                                    type: "string"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    d = {
                        browserType: {
                            id: "browserType",
                            description: "Name and version info of used browser.",
                            type: "object",
                            optional: !0,
                            properties: {
                                name: {
                                    type: "string"
                                },
                                version: {
                                    type: "string"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    e = {
                        pageType: {
                            id: "pageType",
                            description: "Exported web page",
                            optional: !0,
                            properties: {
                                startedDateTime: {
                                    type: "string",
                                    format: "date-time",
                                    pattern: a
                                },
                                id: {
                                    type: "string",
                                    unique: !0
                                },
                                title: {
                                    type: "string"
                                },
                                pageTimings: {
                                    $ref: "pageTimingsType"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    f = {
                        pageTimingsType: {
                            id: "pageTimingsType",
                            description: "Timing info about page load",
                            properties: {
                                onContentLoad: {
                                    type: "number",
                                    optional: !0,
                                    min: -1
                                },
                                onLoad: {
                                    type: "number",
                                    optional: !0,
                                    min: -1
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    g = {
                        entryType: {
                            id: "entryType",
                            description: "Request and Response related info",
                            optional: !0,
                            properties: {
                                pageref: {
                                    type: "string",
                                    optional: !0
                                },
                                startedDateTime: {
                                    type: "string",
                                    format: "date-time",
                                    pattern: a
                                },
                                time: {
                                    type: "integer",
                                    min: 0
                                },
                                request: {
                                    $ref: "requestType"
                                },
                                response: {
                                    $ref: "responseType"
                                },
                                cache: {
                                    $ref: "cacheType"
                                },
                                timings: {
                                    $ref: "timingsType"
                                },
                                serverIPAddress: {
                                    type: "string",
                                    optional: !0
                                },
                                connection: {
                                    type: "string",
                                    optional: !0
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    h = {
                        requestType: {
                            id: "requestType",
                            description: "Monitored request",
                            properties: {
                                method: {
                                    type: "string"
                                },
                                url: {
                                    type: "string"
                                },
                                httpVersion: {
                                    type: "string"
                                },
                                cookies: {
                                    type: "array",
                                    items: {
                                        $ref: "cookieType"
                                    }
                                },
                                headers: {
                                    type: "array",
                                    items: {
                                        $ref: "recordType"
                                    }
                                },
                                queryString: {
                                    type: "array",
                                    items: {
                                        $ref: "recordType"
                                    }
                                },
                                postData: {
                                    $ref: "postDataType"
                                },
                                headersSize: {
                                    type: "integer"
                                },
                                bodySize: {
                                    type: "integer"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    j = {
                        recordType: {
                            id: "recordType",
                            description: "Helper name-value pair structure.",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                value: {
                                    type: "string"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    k = {
                        responseType: {
                            id: "responseType",
                            description: "Monitored Response.",
                            properties: {
                                status: {
                                    type: "integer"
                                },
                                statusText: {
                                    type: "string"
                                },
                                httpVersion: {
                                    type: "string"
                                },
                                cookies: {
                                    type: "array",
                                    items: {
                                        $ref: "cookieType"
                                    }
                                },
                                headers: {
                                    type: "array",
                                    items: {
                                        $ref: "recordType"
                                    }
                                },
                                content: {
                                    $ref: "contentType"
                                },
                                redirectURL: {
                                    type: "string"
                                },
                                headersSize: {
                                    type: "integer"
                                },
                                bodySize: {
                                    type: "integer"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    l = {
                        cookieType: {
                            id: "cookieType",
                            description: "Cookie description.",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                value: {
                                    type: "string"
                                },
                                path: {
                                    type: "string",
                                    optional: !0
                                },
                                domain: {
                                    type: "string",
                                    optional: !0
                                },
                                expires: {
                                    type: "string",
                                    optional: !0
                                },
                                httpOnly: {
                                    type: "boolean",
                                    optional: !0
                                },
                                secure: {
                                    type: "boolean",
                                    optional: !0
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    m = {
                        postDataType: {
                            id: "postDataType",
                            description: "Posted data info.",
                            optional: !0,
                            properties: {
                                mimeType: {
                                    type: "string"
                                },
                                text: {
                                    type: "string",
                                    optional: !0
                                },
                                params: {
                                    type: "array",
                                    optional: !0,
                                    properties: {
                                        name: {
                                            type: "string"
                                        },
                                        value: {
                                            type: "string",
                                            optional: !0
                                        },
                                        fileName: {
                                            type: "string",
                                            optional: !0
                                        },
                                        contentType: {
                                            type: "string",
                                            optional: !0
                                        },
                                        comment: {
                                            type: "string",
                                            optional: !0
                                        }
                                    }
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    n = {
                        contentType: {
                            id: "contentType",
                            description: "Response content",
                            properties: {
                                size: {
                                    type: "integer"
                                },
                                compression: {
                                    type: "integer",
                                    optional: !0
                                },
                                mimeType: {
                                    type: "string"
                                },
                                text: {
                                    type: "string",
                                    optional: !0
                                },
                                encoding: {
                                    type: "string",
                                    optional: !0
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    o = {
                        cacheType: {
                            id: "cacheType",
                            description: "Info about a response coming from the cache.",
                            properties: {
                                beforeRequest: {
                                    $ref: "cacheEntryType"
                                },
                                afterRequest: {
                                    $ref: "cacheEntryType"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    p = {
                        cacheEntryType: {
                            id: "cacheEntryType",
                            optional: !0,
                            description: "Info about cache entry.",
                            properties: {
                                expires: {
                                    type: "string",
                                    optional: "true"
                                },
                                lastAccess: {
                                    type: "string"
                                },
                                eTag: {
                                    type: "string"
                                },
                                hitCount: {
                                    type: "integer"
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    },
                    q = {
                        timingsType: {
                            id: "timingsType",
                            description: "Info about request-response timing.",
                            properties: {
                                dns: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                connect: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                blocked: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                send: {
                                    type: "integer",
                                    min: -1
                                },
                                wait: {
                                    type: "integer",
                                    min: -1
                                },
                                receive: {
                                    type: "integer",
                                    min: -1
                                },
                                ssl: {
                                    type: "integer",
                                    optional: !0,
                                    min: -1
                                },
                                comment: {
                                    type: "string",
                                    optional: !0
                                }
                            }
                        }
                    };
                r.prototype = {
                    registerType: function() {
                        var a = function(a, b) {
                                for (var c in b) b.hasOwnProperty(c) && c !=
                                    "prototype" && (a[c] = b[c])
                            },
                            b = this;
                        for (i = 0; i < arguments.length; i += 1) a(b,
                            arguments[i])
                    }
                };
                var s = new r;
                s.registerType(b, c, d, e, f, g, h, j, k, m, n, o, p, q);
                return s
            }),
            function($) {
                if (!JSON) var JSON = {};
                (function() {
                    function str(a, b) {
                        var c, d, e, f, g = gap,
                            h, i = b[a];
                        i && typeof i === "object" && typeof i.toJSON ===
                            "function" && (i = i.toJSON(a)), typeof rep ===
                            "function" && (i = rep.call(b, a, i));
                        switch (typeof i) {
                            case "string":
                                return quote(i);
                            case "number":
                                return isFinite(i) ? String(i) : "null";
                            case "boolean":
                            case "null":
                                return String(i);
                            case "object":
                                if (!i) return "null";
                                gap += indent, h = [];
                                if (Object.prototype.toString.apply(i) ===
                                    "[object Array]") {
                                    f = i.length;
                                    for (c = 0; c < f; c += 1) h[c] = str(c, i) ||
                                        "null";
                                    e = h.length === 0 ? "[]" : gap ? "[\n" + gap +
                                        h.join(",\n" + gap) + "\n" + g + "]" : "[" +
                                        h.join(",") + "]", gap = g;
                                    return e
                                }
                                if (rep && typeof rep === "object") {
                                    f = rep.length;
                                    for (c = 0; c < f; c += 1) d = rep[c], typeof d ===
                                        "string" && (e = str(d, i), e && h.push(
                                            quote(d) + (gap ? ": " : ":") + e))
                                } else
                                    for (d in i) Object.hasOwnProperty.call(i, d) &&
                                        (e = str(d, i), e && h.push(quote(d) + (gap ?
                                            ": " : ":") + e));
                                e = h.length === 0 ? "{}" : gap ? "{\n" + gap + h.join(
                                    ",\n" + gap) + "\n" + g + "}" : "{" + h.join(
                                    ",") + "}", gap = g;
                                return e
                        }
                    }

                    function quote(a) {
                        escapable.lastIndex = 0;
                        return escapable.test(a) ? '"' + a.replace(escapable,
                            function(a) {
                                var b = meta[a];
                                return typeof b === "string" ? b : "\\u" + (
                                    "0000" + a.charCodeAt(0).toString(16)).slice(-
                                    4)
                            }) + '"' : '"' + a + '"'
                    }

                    function f(a) {
                        return a < 10 ? "0" + a : a
                    }
                    typeof Date.prototype.toJSON !== "function" && (Date.prototype.toJSON =
                        function(a) {
                            return this.getUTCFullYear() + "-" + f(this.getUTCMonth() +
                                    1) + "-" + f(this.getUTCDate()) + "T" + f(
                                    this.getUTCHours()) + ":" + f(this.getUTCMinutes()) +
                                ":" + f(this.getUTCSeconds()) + "Z"
                        }, String.prototype.toJSON = Number.prototype.toJSON =
                        Boolean.prototype.toJSON = function(a) {
                            return this.valueOf()
                        });
                    var cx =
                        /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        escapable =
                        /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        gap, indent, meta = {
                            "\b": "\\b",
                            "\t": "\\t",
                            "\n": "\\n",
                            "\f": "\\f",
                            "\r": "\\r",
                            '"': '\\"',
                            "\\": "\\\\"
                        },
                        rep;
                    typeof JSON.stringify !== "function" && (JSON.stringify =
                        function(a, b, c) {
                            var d;
                            gap = "", indent = "";
                            if (typeof c === "number")
                                for (d = 0; d < c; d += 1) indent += " ";
                            else typeof c === "string" && (indent = c);
                            rep = b;
                            if (b && typeof b !== "function" && (typeof b !==
                                    "object" || typeof b.length !== "number"))
                                throw new Error("JSON.stringify");
                            return str("", {
                                "": a
                            })
                        }), typeof JSON.parse !== "function" && (JSON.parse =
                        function(text, reviver) {
                            function walk(a, b) {
                                var c, d, e = a[b];
                                if (e && typeof e === "object")
                                    for (c in e) Object.hasOwnProperty.call(e,
                                        c) && (d = walk(e, c), d !==
                                        undefined ? e[c] = d : delete e[c]);
                                return reviver.call(a, b, e)
                            }
                            var j;
                            cx.lastIndex = 0, cx.test(text) && (text = text.replace(
                                cx,
                                function(a) {
                                    return "\\u" + ("0000" + a.charCodeAt(
                                        0).toString(16)).slice(-4)
                                }));
                            if (/^[\],:{}\s]*$/.test(text.replace(
                                    /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                                    "@").replace(
                                    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                                    "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                                j = eval("(" + text + ")");
                                return typeof reviver === "function" ? walk({
                                    "": j
                                }, "") : j
                            }
                            throw new SyntaxError("JSON.parse")
                        })
                })(), $.toJSON = function(a, b) {
                    typeof b == "undefined" && (b = null);
                    return JSON.parse(a, b)
                }, $.jSONToString = function(a, b, c) {
                    typeof b == "undefined" && (b = null), typeof c == "undefined" &&
                        (c = null);
                    return JSON.stringify(a, b, c)
                }
            }(jQuery), define("jquery-plugins/jquery.json", function() {}), require.def(
                "preview/harModel", ["core/lib", "preview/jsonSchema", "preview/ref",
                    "preview/harSchema", "core/cookies", "core/trace",
                    "jquery-plugins/jquery.json"
                ],
                function(a, b, c, d, e, f) {
                    function h() {
                        var a = {};
                        for (var b in this) b != "toJSON" && (a[b] = this[b]);
                        if (!this.text) return a;
                        a.text = Array.map(this.text, function(a) {
                            var b = a.charCodeAt(0);
                            if (b >= 32 && b < 127 || b == 10 || b == 13) return a
                                .charAt(0);
                            var c = b.toString(16).toUpperCase();
                            while (c.length < 4) c = "0" + c;
                            return "\\u" + c
                        }).join("");
                        return a
                    }

                    function g() {
                        this.input = null
                    }
                    g.prototype = {
                        append: function(a) {
                            {
                                if (a) {
                                    if (this.input) {
                                        if (!a.log.pages) {
                                            f.error(
                                                "Import of additional data without a page is not yet supported."
                                            );
                                            return null
                                        }
                                        for (var b = 0; b < a.log.pages.length; b++)
                                            this.importPage(a.log.pages[b], a.log
                                                .entries)
                                    } else this.input = a;
                                    return this.input
                                }
                                f.error(
                                    "HarModel.append; Trying to append null input!"
                                )
                            }
                        },
                        getPages: function() {
                            if (!this.input) return [];
                            return this.input.log.pages ? this.input.log.pages :
                                []
                        },
                        getFirstPage: function() {
                            var a = this.getPages();
                            return a.length > 0 ? a[0] : null
                        },
                        getPageEntries: function(a) {
                            return g.getPageEntries(this.input, a)
                        },
                        getAllEntries: function(a) {
                            return this.input ? this.input.log.entries : []
                        },
                        getParentPage: function(a) {
                            return g.getParentPage(this.input, a)
                        },
                        importPage: function(a, b) {
                            var c = this.getUniquePageID(a.id),
                                d = a.id;
                            a.id = c, this.input.log.pages.push(a);
                            for (var e = 0; e < b.length; e++) {
                                var f = b[e];
                                f.pageref == d && (f.pageref = c, this.input.log
                                    .entries.push(f))
                            }
                        },
                        getUniquePageID: function(a) {
                            var b = this.input.log.pages,
                                c = {};
                            for (var d = 0; d < b.length; d++) c[b[d].id] = !0;
                            if (!c[a]) return a;
                            var e = 1;
                            while (!0) {
                                var f = a + e;
                                if (!c[f]) return f;
                                e++
                            }
                        },
                        toJSON: function(a) {
                            a || (a = this.input);
                            if (!a) return "";
                            var b = this.input.log.entries;
                            for (var c = 0; c < b.length; c++) {
                                var d = b[c];
                                d.response.content.text && (d.response.content.toJSON =
                                    h)
                            }
                            var e = $.jSONToString(this.input, null, "\t"),
                                f = e.replace(/\\\\u/g, "\\u");
                            return f
                        },
                        getSize: function(a) {
                            a || (a = this.input);
                            if (!a) return 0;
                            var b = dojo.toJson(a, !0);
                            return b.length
                        }
                    }, g.parse = function(a, e) {
                        var f = a;
                        try {
                            typeof a === "string" && (f = jQuery.toJSON(a))
                        } catch (g) {
                            console.exception("HarModel.parse; EXCEPTION", g);
                            throw {
                                errors: [{
                                    message: "Failed to parse JSON",
                                    property: "JSON evaluation"
                                }]
                            }
                        }
                        if (!e) return f;
                        var h = c.resolveJson(d),
                            i = b.validate(f, h.logType);
                        if (i.valid) return f;
                        throw i
                    }, g.getPageEntries = function(a, b) {
                        var c = [],
                            d = a.log.entries;
                        if (!d) return c;
                        for (var e = 0; e < d.length; e++) {
                            var f = d[e];
                            !f.pageref && !b && c.push(f), b && f.pageref == b.id &&
                                c.push(f)
                        }
                        return c
                    }, g.getParentPage = function(a, b) {
                        var c = a.log.pages;
                        if (!c) return null;
                        for (var d = 0; d < c.length; d++)
                            if (c[d].id == b.pageref) return c[d];
                        return null
                    }, g.Loader = {
                        run: function(b, c) {
                            var d = a.getURLParameter("baseUrl");
                            d && d[d.length - 1] != "/" && (d += "/");
                            var e = a.getURLParameters("path"),
                                f = a.getURLParameter("callback"),
                                g = a.getURLParameters("inputUrl"),
                                h = [];
                            for (var i in e) h.push(d ? d + e[i] : e[i]);
                            for (var i in g) h.push(g[i]);
                            if ((d || g.length > 0) && h.length > 0) return this
                                .loadRemoteArchive(h, f, b, c);
                            var j = a.getURLParameter("path");
                            if (j) return this.loadLocalArchive(j, b, c)
                        },
                        loadExample: function(a, b) {
                            var c = document.location.href,
                                d = c.indexOf("?");
                            document.location = c.substr(0, d) + "?path=" + a,
                                e.setCookie("timeline", !0), e.setCookie(
                                    "stats", !0)
                        },
                        loadLocalArchive: function(a, b, c) {
                            $.ajax({
                                url: a,
                                context: this,
                                success: function(a) {
                                    b(a)
                                },
                                error: function(a, b) {
                                    c(a, b)
                                }
                            });
                            return !0
                        },
                        loadRemoteArchive: function(a, b, c, d) {
                            if (!a.length) return !1;
                            var e = a.shift();
                            b || (b = "onInputData"), $.ajax({
                                url: e,
                                context: this,
                                dataType: "jsonp",
                                jsonp: "callback",
                                jsonpCallback: b,
                                success: function(e) {
                                    c && c(e);
                                    if (a.length) {
                                        var f = this;
                                        setTimeout(function() {
                                            f.loadRemoteArchive(
                                                a, b, c,
                                                d)
                                        }, 300)
                                    }
                                },
                                error: function(a, b) {
                                    d && d(a, b)
                                }
                            });
                            return !0
                        },
                        load: function(a, b, c, d, e, f) {
                            function h(b, c) {
                                a.onLoadError && a.onLoadError(b, c), f && f.call(
                                    a, b, c)
                            }

                            function g(b) {
                                a.appendPreview && a.appendPreview(b), e && e.call(
                                    a, b)
                            }
                            return c ? this.loadRemoteArchive([b], d, g, h) :
                                this.loadLocalArchive(b, g, h)
                        }
                    };
                    return g
                }), define("nls/requestBody", {
                root: {
                    RequestHeaders: "Request Headers",
                    ResponseHeaders: "Response Headers",
                    RequestCookies: "Request Cookies",
                    ResponseCookies: "Response Cookies",
                    URLParameters: "Params",
                    Headers: "Headers",
                    Post: "Post",
                    Put: "Put",
                    Cookies: "Cookies",
                    Response: "Response",
                    Cache: "Cache",
                    HTML: "HTML",
                    DataURL: "Data URL"
                }
            }), require.def("domplate/tabView", ["domplate/domplate", "core/lib",
                "core/trace"
            ], function(Domplate, Lib, Trace) {
                with(Domplate) {
                    var TabViewTempl = domplate({
                        tag: TABLE({
                            "class": "tabView",
                            cellpadding: 0,
                            cellspacing: 0,
                            _repObject: "$tabView"
                        }, TBODY(TR({
                            "class": "tabViewRow"
                        }, TD({
                            "class": "tabViewCol",
                            valign: "top"
                        }, TAG("$tabList", {
                            tabView: "$tabView"
                        }))))),
                        tabList: DIV({
                            "class": "tabViewBody",
                            onclick: "$onClickTab"
                        }, DIV({
                            "class": "$tabView.id\\Bar tabBar"
                        }), DIV({
                            "class": "$tabView.id\\Bodies tabBodies"
                        })),
                        tabHeaderTag: A({
                            "class": "$tab.id\\Tab tab",
                            view: "$tab.id",
                            _repObject: "$tab"
                        }, "$tab.label"),
                        tabBodyTag: DIV({
                            "class": "tab$tab.id\\Body tabBody",
                            _repObject: "$tab"
                        }),
                        hideTab: function(a) {
                            return !1
                        },
                        onClickTab: function(a) {
                            var b = Lib.fixEvent(a),
                                c = this.getTabView(b.target);
                            c.onClickTab(b)
                        },
                        getTabView: function(a) {
                            var b = Lib.getAncestorByClass(a,
                                "tabView");
                            return b.repObject
                        }
                    });

                    function TabView(a) {
                        this.id = a, this.tabs = [], this.listeners = [], this.tabBarVisibility = !
                            0
                    }
                    TabView.prototype = {
                        appendTab: function(a) {
                            this.tabs.push(a), a.tabView = this;
                            return a
                        },
                        removeTab: function(a) {
                            for (var b in this.tabs) {
                                var c = this.tabs[b];
                                if (c.id == a) {
                                    this.tabs.splice(b, 1);
                                    break
                                }
                            }
                        },
                        getTab: function(a) {
                            for (var b in this.tabs) {
                                var c = this.tabs[b];
                                if (c.id == a) return c
                            }
                        },
                        selectTabByName: function(a) {
                            var b = Lib.getElementByClass(this.element,
                                a + "Tab");
                            b && this.selectTab(b)
                        },
                        showTabBar: function(a) {
                            this.element ? a ? this.element.removeAttribute(
                                    "hideTabBar") : this.element.setAttribute(
                                    "hideTabBar", "true") : this.tabBarVisibility =
                                a
                        },
                        addListener: function(a) {
                            this.listeners.push(a)
                        },
                        removeListener: function(a) {
                            Lib.remove(this.listeners, a)
                        },
                        onClickTab: function(a) {
                            var b = Lib.getAncestorByClass(a.target,
                                "tab");
                            b && this.selectTab(b)
                        },
                        selectTab: function(a) {
                            if (Lib.hasClass(a, "tab")) {
                                if (Lib.hasClass(a, "selected")) return;
                                var b = a.getAttribute("view");
                                if (!b) return;
                                var c = Lib.getAncestorByClass(a,
                                    "tabViewBody");
                                c.selectedTab && (c.selectedTab.removeAttribute(
                                        "selected"), c.selectedBody
                                    .removeAttribute("selected"),
                                    Lib.removeClass(c.selectedTab,
                                        "selected"), Lib.removeClass(
                                        c.selectedBody, "selected")
                                );
                                var d = Lib.getElementByClass(c, "tab" +
                                    b + "Body");
                                d || Trace.error(
                                        "TabView.selectTab; Missing tab body",
                                        a), c.selectedTab = a, c.selectedBody =
                                    d, c.selectedTab.setAttribute(
                                        "selected", "true"), c.selectedBody
                                    .setAttribute("selected", "true"),
                                    Lib.setClass(c.selectedBody,
                                        "selected"), Lib.setClass(c.selectedTab,
                                        "selected"), this.updateTabBody(
                                        c, b)
                            }
                        },
                        updateTabBody: function(a, b) {
                            var c = a.selectedTab.repObject;
                            if (!c._body._updated) {
                                c._body._updated = !0, c.bodyTag && c.bodyTag
                                    .replace({
                                        tab: c
                                    }, c._body), c && c.onUpdateBody &&
                                    c.onUpdateBody(this, c._body);
                                for (var d = 0; d < this.listeners.length; d++) {
                                    var e = this.listeners[d];
                                    e.onUpdateBody && e.onUpdateBody(
                                        this, c._body)
                                }
                            }
                        },
                        render: function(a) {
                            this.element = TabViewTempl.tag.replace({
                                tabView: this
                            }, a, TabViewTempl), Lib.setClass(this.element,
                                this.id), this.showTabBar(this.tabBarVisibility);
                            for (var b in this.tabs) {
                                var c = this.tabs[b],
                                    d = c.tabHeaderTag ? c.tabHeaderTag :
                                    TabViewTempl.tabHeaderTag,
                                    e = c.tabBodyTag ? c.tabBodyTag :
                                    TabViewTempl.tabBodyTag;
                                try {
                                    c._header = d.append({
                                            tab: c
                                        }, Lib.$(a, "tabBar")), c._body =
                                        e.append({
                                            tab: c
                                        }, Lib.$(a, "tabBodies"))
                                } catch (f) {
                                    Trace.exception(
                                        "TabView.appendTab; Exception ",
                                        f)
                                }
                            }
                            return this.element
                        }
                    }, TabView.Tab = function() {}, TabView.Tab.prototype = {
                        invalidate: function() {
                            this._updated = !1
                        },
                        select: function() {
                            this.tabView.selectTabByName(this.id)
                        }
                    };
                    return TabView
                }
            }), require.def("core/dragdrop", ["core/lib"], function(a) {
                function d(a) {
                    return isNaN(window.scrollX) ? new c(a.clientX + document.documentElement
                        .scrollLeft + document.body.scrollLeft, a.clientY +
                        document.documentElement.scrollTop + document.body.scrollTop
                    ) : new c(a.clientX + window.scrollX, a.clientY + window.scrollY)
                }

                function c(a, b) {
                    this.x = a, this.y = b, this.Add = function(a) {
                        var b = new c(this.x, this.y);
                        a != null && (isNaN(a.x) || (b.x += a.x), isNaN(a.y) ||
                            (b.y += a.y));
                        return b
                    }, this.Subtract = function(a) {
                        var b = new c(this.x, this.y);
                        a != null && (isNaN(a.x) || (b.x -= a.x), isNaN(a.y) ||
                            (b.y -= a.y));
                        return b
                    }, this.Bound = function(a, b) {
                        var c = this.Max(a);
                        return c.Min(b)
                    }, this.Check = function() {
                        var a = new c(this.x, this.y);
                        isNaN(a.x) && (a.x = 0), isNaN(a.y) && (a.y = 0);
                        return a
                    }, this.Apply = function(a) {
                        typeof a == "string" && (a = document.getElementById(a));
                        a && (isNaN(this.x) || (a.style.left = this.x + "px"),
                            isNaN(this.y) || (a.style.top = this.y + "px"))
                    }
                }

                function b(b, c) {
                    this.element = b, this.handle = b, this.callbacks = c, this.cursorStartPos =
                        null, this.cursorLastPos = null, this.dragging = !1, this.onDragStart =
                        a.bind(this.onDragStart, this), this.onDragOver = a.bind(
                            this.onDragOver, this), this.onDrop = a.bind(this.onDrop,
                            this), a.addEventListener(this.element, "mousedown",
                            this.onDragStart, !1), this.active = !0
                }
                b.prototype = {
                    onDragStart: function(b) {
                        var c = a.fixEvent(b);
                        this.dragging || (this.callbacks.onDragStart &&
                            this.callbacks.onDragStart(this), this.dragging = !
                            0, this.cursorStartPos = d(c), this.cursorLastPos =
                            this.cursorStartPos, a.addEventListener(
                                this.element.ownerDocument, "mousemove",
                                this.onDragOver, !1), a.addEventListener(
                                this.element.ownerDocument, "mouseup",
                                this.onDrop, !1), a.cancelEvent(c))
                    },
                    onDragOver: function(b) {
                        if (this.dragging) {
                            var c = a.fixEvent(b);
                            a.cancelEvent(c);
                            var e = d(c),
                                e = e.Subtract(this.cursorStartPos);
                            if (this.cursorLastPos.x == e.x && this.cursorLastPos
                                .y == e.y) return;
                            this.cursorLastPos = e, this.callbacks.onDragOver !=
                                null && this.callbacks.onDragOver(e, this)
                        }
                    },
                    onDrop: function(b) {
                        if (this.dragging) {
                            var c = a.fixEvent(b);
                            a.cancelEvent(c), this.dragStop()
                        }
                    },
                    dragStop: function() {
                        this.dragging && (a.removeEventListener(this.element
                                .ownerDocument, "mousemove", this.onDragOver, !
                                1), a.removeEventListener(this.element.ownerDocument,
                                "mouseup", this.onDrop, !1), this.cursorStartPos =
                            null, this.cursorLastPos = null, this.callbacks
                            .onDrop != null && this.callbacks.onDrop(
                                this), this.dragging = !1)
                    },
                    destroy: function() {
                        a.removeEventListener(this.element, "mousedown",
                                this.onDragStart, !1), this.active = !1,
                            this.dragging && this.dragStop()
                    }
                };
                var e = {};
                e.Tracker = b;
                return e
            }), require.def("syntax-highlighter/shCore", [], function() {
                var a = {
                    sh: {
                        Toolbar: {},
                        Utils: {},
                        RegexLib: {},
                        Brushes: {},
                        Strings: {
                            AboutDialog: '<html><head><title>About...</title></head><body class="dp-about"><table cellspacing="0"><tr><td class="copy"><p class="title">dp.SyntaxHighlighter</div><div class="para">Version: {V}</p><p><a href="http://www.dreamprojections.com/syntaxhighlighter/?ref=about" target="_blank">http://www.dreamprojections.com/syntaxhighlighter</a></p>&copy;2004-2007 Alex Gorbatchev.</td></tr><tr><td class="footer"><input type="button" class="close" value="OK" onClick="window.close()"/></td></tr></table></body></html>'
                        },
                        ClipboardSwf: null,
                        Version: "1.5.1"
                    }
                };
                a.SyntaxHighlighter = a.sh, a.sh.Toolbar.Commands = {
                        ExpandSource: {
                            label: "+ expand source",
                            check: function(a) {
                                return a.collapse
                            },
                            func: function(a, b) {
                                a.parentNode.removeChild(a), b.div.className =
                                    b.div.className.replace("collapsed", "")
                            }
                        },
                        ViewSource: {
                            label: "view plain",
                            func: function(b, c) {
                                var d = a.sh.Utils.FixForBlogger(c.originalCode)
                                    .replace(/</g, "&lt;"),
                                    e = window.open("", "_blank",
                                        "width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=0"
                                    );
                                e.document.write(
                                    '<textarea style="width:99%;height:99%">' +
                                    d + "</textarea>"), e.document.close()
                            }
                        },
                        CopyToClipboard: {
                            label: "copy to clipboard",
                            check: function() {
                                return window.clipboardData != null || a.sh.ClipboardSwf !=
                                    null
                            },
                            func: function(b, c) {
                                var d = a.sh.Utils.FixForBlogger(c.originalCode)
                                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                                    .replace(/&amp;/g, "&");
                                if (window.clipboardData) window.clipboardData.setData(
                                    "text", d);
                                else if (a.sh.ClipboardSwf != null) {
                                    var e = c.flashCopier;
                                    e == null && (e = document.createElement(
                                                "div"), c.flashCopier = e, c.div
                                            .appendChild(e)), e.innerHTML =
                                        '<embed src="' + a.sh.ClipboardSwf +
                                        '" FlashVars="clipboard=' +
                                        encodeURIComponent(d) +
                                        '" width="0" height="0" type="application/x-shockwave-flash"></embed>'
                                }
                                alert("The code is in your clipboard now")
                            }
                        },
                        PrintSource: {
                            label: "print",
                            func: function(b, c) {
                                var d = document.createElement("IFRAME"),
                                    e = null;
                                d.style.cssText =
                                    "position:absolute;width:0px;height:0px;left:-500px;top:-500px;",
                                    document.body.appendChild(d), e = d.contentWindow
                                    .document, a.sh.Utils.CopyStyles(e, window.document),
                                    e.write('<div class="' + c.div.className.replace(
                                            "collapsed", "") + ' printing">' +
                                        c.div.innerHTML + "</div>"), e.close(),
                                    d.contentWindow.focus(), d.contentWindow.print(),
                                    alert("Printing..."), document.body.removeChild(
                                        d)
                            }
                        },
                        About: {
                            label: "?",
                            func: function(b) {
                                var c = window.open("", "_blank",
                                        "dialog,width=300,height=150,scrollbars=0"
                                    ),
                                    d = c.document;
                                a.sh.Utils.CopyStyles(d, window.document), d.write(
                                    a.sh.Strings.AboutDialog.replace("{V}",
                                        a.sh.Version)), d.close(), c.focus()
                            }
                        }
                    }, a.sh.Toolbar.Create = function(b) {
                        var c = document.createElement("DIV");
                        c.className = "tools";
                        for (var d in a.sh.Toolbar.Commands) {
                            var e = a.sh.Toolbar.Commands[d];
                            if (e.check != null && !e.check(b)) continue;
                            c.innerHTML +=
                                '<a href="#" onclick="dp.sh.Toolbar.Command(\'' + d +
                                "',this);return false;\">" + e.label + "</a>"
                        }
                        return c
                    }, a.sh.Toolbar.Command = function(b, c) {
                        var d = c;
                        while (d != null && d.className.indexOf("dp-highlighter") ==
                            -1) d = d.parentNode;
                        d != null && a.sh.Toolbar.Commands[b].func(c, d.highlighter)
                    }, a.sh.Utils.CopyStyles = function(a, b) {
                        var c = b.getElementsByTagName("link");
                        for (var d = 0; d < c.length; d++) c[d].rel.toLowerCase() ==
                            "stylesheet" && a.write(
                                '<link type="text/css" rel="stylesheet" href="' + c[
                                    d].href + '"></link>')
                    }, a.sh.Utils.FixForBlogger = function(b) {
                        return a.sh.isBloggerMode == !0 ? b.replace(
                            /<br\s*\/?>|&lt;br\s*\/?&gt;/gi, "\n") : b
                    }, a.sh.RegexLib = {
                        MultiLineCComments: new RegExp("/\\*[\\s\\S]*?\\*/", "gm"),
                        SingleLineCComments: new RegExp("//.*$", "gm"),
                        SingleLinePerlComments: new RegExp("#.*$", "gm"),
                        DoubleQuotedString: new RegExp(
                            '"(?:\\.|(\\\\\\")|[^\\""\\n])*"', "g"),
                        SingleQuotedString: new RegExp(
                            "'(?:\\.|(\\\\\\')|[^\\''\\n])*'", "g")
                    }, a.sh.Match = function(a, b, c) {
                        this.value = a, this.index = b, this.length = a.length,
                            this.css = c
                    }, a.sh.Highlighter = function() {
                        this.noGutter = !1, this.addControls = !0, this.collapse = !
                            1, this.tabsToSpaces = !0, this.wrapColumn = 80, this.showColumns = !
                            0
                    }, a.sh.Highlighter.SortCallback = function(a, b) {
                        if (a.index < b.index) return -1;
                        if (a.index > b.index) return 1;
                        if (a.length < b.length) return -1;
                        if (a.length > b.length) return 1;
                        return 0
                    }, a.sh.Highlighter.prototype.CreateElement = function(a) {
                        var b = document.createElement(a);
                        b.highlighter = this;
                        return b
                    }, a.sh.Highlighter.prototype.GetMatches = function(b, c) {
                        var d = 0,
                            e = null;
                        while ((e = b.exec(this.code)) != null) this.matches[this.matches
                            .length] = new a.sh.Match(e[0], e.index, c)
                    }, a.sh.Highlighter.prototype.AddBit = function(a, b) {
                        if (a != null && a.length != 0) {
                            var c = this.CreateElement("SPAN");
                            a = a.replace(/ /g, "&nbsp;"), a = a.replace(/</g,
                                "&lt;"), a = a.replace(/\n/gm, "&nbsp;<br>");
                            if (b != null)
                                if (/br/gi.test(a)) {
                                    var d = a.split("&nbsp;<br>");
                                    for (var e = 0; e < d.length; e++) c = this.CreateElement(
                                            "SPAN"), c.className = b, c.innerHTML =
                                        d[e], this.div.appendChild(c), e + 1 < d.length &&
                                        this.div.appendChild(this.CreateElement(
                                            "BR"))
                                } else c.className = b, c.innerHTML = a, this.div.appendChild(
                                    c);
                            else c.innerHTML = a, this.div.appendChild(c)
                        }
                    }, a.sh.Highlighter.prototype.IsInside = function(a) {
                        if (a == null || a.length == 0) return !1;
                        for (var b = 0; b < this.matches.length; b++) {
                            var c = this.matches[b];
                            if (c == null) continue;
                            if (a.index > c.index && a.index < c.index + c.length)
                                return !0
                        }
                        return !1
                    }, a.sh.Highlighter.prototype.ProcessRegexList = function() {
                        for (var a = 0; a < this.regexList.length; a++) this.GetMatches(
                            this.regexList[a].regex, this.regexList[a].css)
                    }, a.sh.Highlighter.prototype.ProcessSmartTabs = function(a) {
                        function g(a, b) {
                            if (a.indexOf(e) == -1) return a;
                            var c = 0;
                            while ((c = a.indexOf(e)) != -1) {
                                var d = b - c % b;
                                a = f(a, c, d)
                            }
                            return a
                        }

                        function f(a, b, c) {
                            var d = a.substr(0, b),
                                e = a.substr(b + 1, a.length),
                                f = "";
                            for (var g = 0; g < c; g++) f += " ";
                            return d + f + e
                        }
                        var b = a.split("\n"),
                            c = "",
                            d = 4,
                            e = "\t";
                        for (var h = 0; h < b.length; h++) c += g(b[h], d) + "\n";
                        return c
                    }, a.sh.Highlighter.prototype.SwitchToList = function() {
                        var b = this.div.innerHTML.replace(/<(br)\/?>/gi, "\n"),
                            c = b.split("\n");
                        this.addControls == !0 && this.bar.appendChild(a.sh.Toolbar
                            .Create(this));
                        if (this.showColumns) {
                            var d = this.CreateElement("div"),
                                e = this.CreateElement("div"),
                                f = 10,
                                g = 1;
                            while (g <= 150) g % f == 0 ? (d.innerHTML += g, g += (
                                g + "").length) : (d.innerHTML += "&middot;", g++);
                            e.className = "columns", e.appendChild(d), this.bar.appendChild(
                                e)
                        }
                        for (var g = 0, h = this.firstLine; g < c.length - 1; g++,
                            h++) {
                            var i = this.CreateElement("LI"),
                                j = this.CreateElement("SPAN");
                            i.className = g % 2 == 0 ? "alt" : "", j.innerHTML = c[
                                g] + "&nbsp;", i.appendChild(j), this.ol.appendChild(
                                i)
                        }
                        this.div.innerHTML = ""
                    }, a.sh.Highlighter.prototype.Highlight = function(b) {
                        function f(a, b, c) {
                            return a.substr(b, c - b)
                        }

                        function e(b) {
                            var d = a.sh.Utils.FixForBlogger(b).split("\n"),
                                e = [],
                                f = new RegExp("^\\s*", "g"),
                                g = 1e3;
                            for (var h = 0; h < d.length && g > 0; h++) {
                                if (c(d[h]).length == 0) continue;
                                var i = f.exec(d[h]);
                                i != null && i.length > 0 && (g = Math.min(i[0].length,
                                    g))
                            }
                            if (g > 0)
                                for (var h = 0; h < d.length; h++) d[h] = d[h].substr(
                                    g);
                            return d.join("\n")
                        }

                        function d(a) {
                            return a.replace(/\n*$/, "").replace(/^\n*/, "")
                        }

                        function c(a) {
                            return a.replace(/^\s*(.*?)[\s\n]*$/g, "$1")
                        }
                        var g = 0;
                        b == null && (b = ""), this.originalCode = b, this.code = d(
                                e(b)), this.div = this.CreateElement("DIV"), this.bar =
                            this.CreateElement("DIV"), this.ol = this.CreateElement(
                                "OL"), this.matches = [], this.div.className =
                            "dp-highlighter", this.div.highlighter = this, this.bar
                            .className = "bar", this.ol.start = this.firstLine,
                            this.CssClass != null && (this.ol.className = this.CssClass),
                            this.collapse && (this.div.className += " collapsed"),
                            this.noGutter && (this.div.className += " nogutter"),
                            this.tabsToSpaces == !0 && (this.code = this.ProcessSmartTabs(
                                this.code)), this.ProcessRegexList();
                        if (this.matches.length == 0) this.AddBit(this.code, null),
                            this.SwitchToList(), this.div.appendChild(this.bar),
                            this.div.appendChild(this.ol);
                        else {
                            this.matches = this.matches.sort(a.sh.Highlighter.SortCallback);
                            for (var h = 0; h < this.matches.length; h++) this.IsInside(
                                this.matches[h]) && (this.matches[h] = null);
                            for (var h = 0; h < this.matches.length; h++) {
                                var i = this.matches[h];
                                if (i == null || i.length == 0) continue;
                                this.AddBit(f(this.code, g, i.index), null), this.AddBit(
                                    i.value, i.css), g = i.index + i.length
                            }
                            this.AddBit(this.code.substr(g), null), this.SwitchToList(),
                                this.div.appendChild(this.bar), this.div.appendChild(
                                    this.ol)
                        }
                    }, a.sh.Highlighter.prototype.GetKeywords = function(a) {
                        return "\\b" + a.replace(/ /g, "\\b|\\b") + "\\b"
                    }, a.sh.BloggerMode = function() {
                        a.sh.isBloggerMode = !0
                    }, a.sh.HighlightAll = function(b, c, d, e, f, g) {
                        function k(a, b, c) {
                            var d = document.getElementsByTagName(c);
                            for (var e = 0; e < d.length; e++) d[e].getAttribute(
                                "name") == b && a.push(d[e])
                        }

                        function j(a, b, c) {
                            var d = new RegExp("^" + a + "\\[(\\w+)\\]$", "gi"),
                                e = null;
                            for (var f = 0; f < b.length; f++)
                                if ((e = d.exec(b[f])) != null) return e[1];
                            return c
                        }

                        function i(a, b) {
                            for (var c = 0; c < b.length; c++)
                                if (b[c] == a) return !0;
                            return !1
                        }

                        function h() {
                            var a = arguments;
                            for (var b = 0; b < a.length; b++) {
                                if (a[b] == null) continue;
                                if (typeof a[b] == "string" && a[b] != "") return a[
                                    b] + "";
                                if (typeof a[b] == "object" && a[b].value != "")
                                    return a[b].value + ""
                            }
                            return null
                        }
                        var l = [],
                            m = null,
                            n = {},
                            o = "innerHTML";
                        typeof b == "string" ? (k(l, b, "pre"), k(l, b, "textarea")) :
                            l.push(b);
                        if (l.length != 0) {
                            for (var p in a.sh.Brushes) {
                                var q = a.sh.Brushes[p].Aliases;
                                if (q == null) continue;
                                for (var r = 0; r < q.length; r++) n[q[r]] = p
                            }
                            for (var r = 0; r < l.length; r++) {
                                var s = l[r],
                                    t = h(s.attributes["class"], s.className, s.attributes
                                        .language, s.language),
                                    u = "";
                                if (t == null) continue;
                                t = t.split(":"), u = t[0].toLowerCase();
                                if (n[u] == null) continue;
                                m = new a.sh.Brushes[n[u]], s.style.display =
                                    "none", m.noGutter = c == null ? i("nogutter",
                                        t) : !c, m.addControls = d == null ? !i(
                                        "nocontrols", t) : d, m.collapse = e ==
                                    null ? i("collapse", t) : e, m.showColumns = g ==
                                    null ? i("showcolumns", t) : g;
                                var v = document.getElementsByTagName("head")[0];
                                if (m.Style && v) {
                                    var w = document.createElement("style");
                                    w.setAttribute("type", "text/css");
                                    if (w.styleSheet) w.styleSheet.cssText = m.Style;
                                    else {
                                        var x = document.createTextNode(m.Style);
                                        w.appendChild(x)
                                    }
                                    v.appendChild(w)
                                }
                                m.firstLine = f == null ? parseInt(j("firstline", t,
                                        1)) : f, m.Highlight(s[o]), m.source = s, s
                                    .parentNode.insertBefore(m.div, s)
                            }
                        }
                    }, a.sh.Brushes.JScript = function() {
                        var b =
                            "abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends false final finally float for function goto if implements import in instanceof int interface long native new null package private protected public return short static super switch synchronized this throw throws transient true try typeof var void volatile while with";
                        this.regexList = [{
                            regex: a.sh.RegexLib.SingleLineCComments,
                            css: "comment"
                        }, {
                            regex: a.sh.RegexLib.MultiLineCComments,
                            css: "comment"
                        }, {
                            regex: a.sh.RegexLib.DoubleQuotedString,
                            css: "string"
                        }, {
                            regex: a.sh.RegexLib.SingleQuotedString,
                            css: "string"
                        }, {
                            regex: new RegExp("^\\s*#.*", "gm"),
                            css: "preprocessor"
                        }, {
                            regex: new RegExp(this.GetKeywords(b), "gm"),
                            css: "keyword"
                        }], this.CssClass = "dp-c"
                    }, a.sh.Brushes.JScript.prototype = new a.sh.Highlighter, a.sh.Brushes
                    .JScript.Aliases = ["js", "jscript", "javascript"];
                return a
            }), require.def("preview/requestBody", ["domplate/domplate",
                "i18n!nls/requestBody", "core/lib", "core/cookies",
                "domplate/tabView", "core/dragdrop", "syntax-highlighter/shCore"
            ], function(Domplate, Strings, Lib, Cookies, TabView, DragDrop, dp) {
                with(Domplate) {
                    function RequestBody() {}
                    RequestBody.prototype = domplate({
                        render: function(a, b) {
                            var c = new TabView("requestBody");
                            b.response.headers.length > 0 && c.appendTab(
                                    new HeadersTab(b)), b.request.queryString &&
                                b.request.queryString.length && c.appendTab(
                                    new ParamsTab(b)), b.request.postData &&
                                c.appendTab(new SentDataTab(b, b.request
                                    .method)), b.response.content.text &&
                                b.response.content.text.length > 0 &&
                                c.appendTab(new ResponseTab(b)),
                                this.showCache(b) && c.appendTab(
                                    new CacheTab(b)), this.showHtml(
                                    b) && c.appendTab(new HtmlTab(b)),
                                this.showDataURL(b) && c.appendTab(
                                    new DataURLTab(b));
                            var d = c.render(a);
                            c.tabs.length > 0 && c.selectTabByName(
                                c.tabs[0].id);
                            return d
                        },
                        showCache: function(a) {
                            if (!a.cache) return !1;
                            if (!a.cache.afterRequest) return !1;
                            if (a.category == "image") return !1;
                            return !0
                        },
                        showHtml: function(a) {
                            return a.response.content.mimeType ==
                                "text/html" || a.mimeType ==
                                "application/xhtml+xml"
                        },
                        showDataURL: function(a) {
                            return a.request.url.indexOf("data:") ==
                                0
                        }
                    });

                    function HeadersTab(a) {
                        this.file = a
                    }
                    HeadersTab.prototype = domplate(TabView.Tab.prototype, {
                        id: "Headers",
                        label: Strings.Headers,
                        bodyTag: TABLE({
                            "class": "netInfoHeadersText netInfoText netInfoHeadersTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY(TR({
                            "class": "netInfoResponseHeadersTitle"
                        }, TD({
                            colspan: 2
                        }, DIV({
                            "class": "netInfoHeadersGroup"
                        }, Strings.ResponseHeaders))), TR({
                            "class": "netInfoRequestHeadersTitle"
                        }, TD({
                            colspan: 2
                        }, DIV({
                            "class": "netInfoHeadersGroup"
                        }, Strings.RequestHeaders))))),
                        headerDataTag: FOR("param", "$headers", TR(TD({
                            "class": "netInfoParamName"
                        }, "$param.name"), TD({
                            "class": "netInfoParamValue"
                        }, PRE("$param|getParamValue")))),
                        getParamValue: function(a) {
                            return Lib.wrapText(a.value, !0)
                        },
                        onUpdateBody: function(a, b) {
                            this.file.response.headers && this.insertHeaderRows(
                                    b, this.file.response.headers,
                                    "Headers", "ResponseHeaders"),
                                this.file.request.headers && this.insertHeaderRows(
                                    b, this.file.request.headers,
                                    "Headers", "RequestHeaders")
                        },
                        insertHeaderRows: function(a, b, c, d) {
                            var e = Lib.getElementByClass(a,
                                    "netInfo" + c + "Table"),
                                f = Lib.getElementByClass(e,
                                    "netInfo" + d + "Title");
                            b.length ? (this.headerDataTag.insertRows({
                                headers: b
                            }, f ? f : a), Lib.removeClass(
                                f, "collapsed")) : Lib.setClass(
                                f, "collapsed")
                        }
                    });

                    function ResponseTab(a) {
                        this.file = a
                    }
                    ResponseTab.prototype = domplate(TabView.Tab.prototype, {
                        id: "Response",
                        label: Strings.Response,
                        bodyTag: DIV({
                            "class": "netInfoResponseText netInfoText"
                        }, PRE({
                            "class": "javascript:nocontrols:nogutter:",
                            name: "code"
                        })),
                        onUpdateBody: function(a, b) {
                            var c = Lib.getElementByClass(b,
                                "netInfoResponseText");
                            if (this.file.category == "image") {
                                Lib.clearNode(c);
                                var d = b.ownerDocument.createElement(
                                    "img");
                                d.src = this.file.href, c.appendChild(
                                    d, c)
                            } else {
                                Lib.clearNode(c.firstChild);
                                var e = this.file.response.content.text,
                                    f = this.file.response.content.mimeType;
                                f == "application/javascript" || f ==
                                    "text/javascript" || f ==
                                    "application/x-javascript" || f ==
                                    "text/ecmascript" || f ==
                                    "application/ecmascript" ? (c.firstChild
                                        .innerHTML = e, dp.SyntaxHighlighter
                                        .HighlightAll(c.firstChild)
                                    ) : Lib.insertWrappedText(e, c.firstChild)
                            }
                        }
                    });

                    function ParamsTab(a) {
                        this.file = a
                    }
                    ParamsTab.prototype = domplate(HeadersTab.prototype, {
                        id: "Params",
                        label: Strings.URLParameters,
                        bodyTag: TABLE({
                            "class": "netInfoParamsText netInfoText netInfoParamsTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY()),
                        onUpdateBody: function(a, b) {
                            if (this.file.request.queryString) {
                                var c = Lib.getElementByClass(b,
                                    "netInfoParamsText");
                                this.insertHeaderRows(c, this.file.request
                                    .queryString, "Params")
                            }
                        }
                    });

                    function SentDataTab(a, b) {
                        b = b.charAt(0).toUpperCase() + b.slice(1).toLowerCase(),
                            this.file = a, this.id = b, this.label = Strings[b]
                    }
                    SentDataTab.prototype = domplate(HeadersTab.prototype, {
                        bodyTag: DIV({
                            "class": "netInfo$tab.id\\Text netInfoText"
                        }, TABLE({
                            "class": "netInfo$tab.id\\Table",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY())),
                        onUpdateBody: function(a, b) {
                            var c = this.file.request.postData;
                            if (c) {
                                var d = Lib.getElementByClass(b,
                                    "netInfo" + this.id +
                                    "Text");
                                c.mimeType ==
                                    "application/x-www-form-urlencoded" ?
                                    this.insertHeaderRows(d, c.params,
                                        this.id) : Lib.insertWrappedText(
                                        c.text, d)
                            }
                        }
                    });

                    function CookiesTab(a) {
                        this.file = a
                    }
                    CookiesTab.prototype = domplate(HeadersTab.prototype, {
                        id: "Cookies",
                        label: Strings.Cookies,
                        bodyTag: DIV({
                            "class": "netInfoCookiesText netInfoText"
                        }, TABLE({
                            "class": "netInfoCookiesTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY(TR({
                                "class": "netInfoResponseCookiesTitle"
                            }, TD({
                                colspan: 2
                            }, DIV({
                                "class": "netInfoCookiesGroup"
                            }, Strings.ResponseCookies))),
                            TR({
                                "class": "netInfoRequestCookiesTitle"
                            }, TD({
                                colspan: 2
                            }, DIV({
                                "class": "netInfoCookiesGroup"
                            }, Strings.RequestCookies)))))),
                        onUpdateBody: function(a, b) {
                            if (file.response.cookies) {
                                var c = Lib.getElementByClass(b,
                                    "netInfoParamsText");
                                this.insertHeaderRows(c, file.response
                                    .cookies, "Cookies",
                                    "ResponseCookies")
                            }
                            if (file.request.cookies) {
                                var c = Lib.getElementByClass(b,
                                    "netInfoParamsText");
                                this.insertHeaderRows(c, file.request
                                    .cookies, "Cookies",
                                    "RequestCookies")
                            }
                        }
                    });

                    function CacheTab(a) {
                        this.file = a
                    }
                    CacheTab.prototype = domplate(HeadersTab.prototype, {
                        id: "Cache",
                        label: Strings.Cache,
                        bodyTag: DIV({
                            "class": "netInfoCacheText netInfoText"
                        }, TABLE({
                            "class": "netInfoCacheTable",
                            cellpadding: 0,
                            cellspacing: 0
                        }, TBODY())),
                        onUpdateBody: function(a, b) {
                            if (this.file.cache && this.file.cache.afterRequest) {
                                var c = this.file.cache.afterRequest,
                                    d = [];
                                for (var e in c) d.push({
                                    name: e,
                                    value: c[e]
                                });
                                this.insertHeaderRows(b, d, "Cache")
                            }
                        }
                    });

                    function HtmlTab(a) {
                        this.file = a
                    }
                    HtmlTab.prototype = domplate(HeadersTab.prototype, {
                        id: "HTML",
                        label: Strings.HTML,
                        bodyTag: DIV({
                            "class": "netInfoHtmlText netInfoText"
                        }, IFRAME({
                            "class": "netInfoHtmlPreview",
                            onload: "$onLoad"
                        }), DIV({
                            "class": "htmlPreviewResizer"
                        })),
                        onUpdateBody: function(a, b) {
                            this.preview = Lib.getElementByClass(b,
                                "netInfoHtmlPreview");
                            var c = parseInt(Cookies.getCookie(
                                "htmlPreviewHeight"));
                            isNaN(c) || (this.preview.style.height =
                                c + "px");
                            var d = Lib.getElementByClass(b,
                                "htmlPreviewResizer");
                            this.resizer = new DragDrop.Tracker(d, {
                                onDragStart: Lib.bind(this.onDragStart,
                                    this),
                                onDragOver: Lib.bind(this.onDragOver,
                                    this),
                                onDrop: Lib.bind(this.onDrop,
                                    this)
                            })
                        },
                        onLoad: function(a) {
                            var b = Lib.fixEvent(a),
                                c = Lib.getAncestorByClass(b.target,
                                    "tabHTMLBody").repObject;
                            c.preview.contentWindow.document.body.innerHTML =
                                c.file.response.content.text
                        },
                        onDragStart: function(a) {
                            var b = Lib.getBody(this.preview.ownerDocument);
                            b.setAttribute("resizingHtmlPreview",
                                    "true"), this.startHeight =
                                this.preview.clientHeight
                        },
                        onDragOver: function(a, b) {
                            var c = this.startHeight + a.y;
                            this.preview.style.height = c + "px",
                                Cookies.setCookie(
                                    "htmlPreviewHeight", c)
                        },
                        onDrop: function(a) {
                            var b = Lib.getBody(this.preview.ownerDocument);
                            b.removeAttribute("resizingHtmlPreview")
                        }
                    });

                    function DataURLTab(a) {
                        this.file = a
                    }
                    DataURLTab.prototype = domplate(HeadersTab.prototype, {
                        id: "DataURL",
                        label: Strings.DataURL,
                        bodyTag: DIV({
                            "class": "netInfoDataURLText netInfoText"
                        }),
                        onUpdateBody: function(a, b) {
                            var c = Lib.getElementByClass(b,
                                    "netInfoDataURLText"),
                                d = this.file.request.url;
                            if (d.indexOf("data:image") == 0) {
                                var e = b.ownerDocument.createElement(
                                    "img");
                                e.src = d, c.appendChild(e)
                            } else Lib.insertWrappedText(unescape(d),
                                c)
                        }
                    });
                    return RequestBody
                }
            }), require.def("domplate/infoTip", ["domplate/domplate", "core/lib",
                "core/trace"
            ], function(Domplate, Lib, Trace) {
                with(Domplate) {
                    var InfoTip = Lib.extend({
                        listeners: [],
                        maxWidth: 100,
                        maxHeight: 80,
                        infoTipMargin: 10,
                        infoTipWindowPadding: 25,
                        tags: domplate({
                            infoTipTag: DIV({
                                "class": "infoTip"
                            })
                        }),
                        initialize: function() {
                            if (!$.browser.msie) {
                                var a = $("body");
                                a.bind("mouseover", Lib.bind(this.onMouseMove,
                                    this)), a.bind("mouseout",
                                    Lib.bind(this.onMouseOut,
                                        this)), a.bind(
                                    "mousemove", Lib.bind(this.onMouseMove,
                                        this));
                                return this.infoTip = this.tags.infoTipTag
                                    .append({}, Lib.getBody(
                                        document))
                            }
                        },
                        showInfoTip: function(a, b, c, d, e, f) {
                            var g = Lib.getOverflowParent(b),
                                h = c + (g ? g.scrollLeft : 0),
                                i = Lib.dispatch2(this.listeners,
                                    "showInfoTip", [a, b, h, d, e,
                                        f
                                    ]);
                            if (i) {
                                var j = a.ownerDocument.documentElement,
                                    k = j.clientWidth,
                                    l = j.clientHeight;
                                c + a.offsetWidth + this.infoTipMargin >
                                    k - this.infoTipWindowPadding ?
                                    (a.style.left = "auto", a.style
                                        .right = k - c + this.infoTipMargin +
                                        "px") : (a.style.left = c +
                                        this.infoTipMargin + "px",
                                        a.style.right = "auto"), d +
                                    a.offsetHeight + this.infoTipMargin >
                                    l ? (a.style.top = Math.max(0,
                                            l - (a.offsetHeight +
                                                this.infoTipMargin)
                                        ) + "px", a.style.bottom =
                                        "auto") : (a.style.top = d +
                                        this.infoTipMargin + "px",
                                        a.style.bottom = "auto"), a
                                    .setAttribute("active", "true")
                            } else this.hideInfoTip(a)
                        },
                        hideInfoTip: function(a) {
                            a && a.removeAttribute("active")
                        },
                        onMouseOut: function(a) {
                            a.relatedTarget || this.hideInfoTip(
                                this.infoTip)
                        },
                        onMouseMove: function(a) {
                            this.infoTip.setAttribute("multiline", !
                                1);
                            var b = a.clientX,
                                c = a.clientY;
                            this.showInfoTip(this.infoTip, a.target,
                                b, c, a.rangeParent, a.rangeOffset
                            )
                        },
                        populateTimingInfoTip: function(a, b) {
                            this.tags.colorTag.replace({
                                rgbValue: b
                            }, a);
                            return !0
                        },
                        addListener: function(a) {
                            this.listeners.push(a)
                        },
                        removeListener: function(a) {
                            Lib.remove(this.listeners, a)
                        }
                    });
                    InfoTip.initialize();
                    return InfoTip
                }
            }), require.def("domplate/popupMenu", ["domplate/domplate", "core/lib",
                "core/trace"
            ], function(Domplate, Lib, Trace) {
                with(Domplate) {
                    var Controller = {
                            controllers: [],
                            controllerContext: {
                                label: "controller context"
                            },
                            initialize: function(a) {
                                this.controllers = [], this.controllerContext =
                                    a || this.controllerContext
                            },
                            shutdown: function() {
                                this.removeControllers()
                            },
                            addController: function() {
                                for (var a = 0, b; b = arguments[a]; a++) {
                                    typeof b[0] == "string" && (b[0] = $$(b[
                                        0], this.controllerContext));
                                    var c = b[2];
                                    b[2] = Lib.bind(c, this), b[3] = c,
                                        this.controllers.push(b), Lib.addEventListener
                                        .apply(this, b)
                                }
                            },
                            removeController: function() {
                                for (var a = 0, b; b = arguments[a]; a++)
                                    for (var c = 0, d; d = this.controllers[
                                            c]; c++) b[0] == d[0] && b[1] ==
                                        d[1] && b[2] == d[3] && Lib.removeEventListener
                                        .apply(this, d)
                            },
                            removeControllers: function() {
                                for (var a = 0, b; b = this.controllers[a]; a++)
                                    Lib.removeEventListener.apply(this, b)
                            }
                        },
                        menuItemProps = {
                            "class": "$item.className",
                            type: "$item.type",
                            value: "$item.value",
                            _command: "$item.command"
                        };
                    Lib.isIE6 && (menuItemProps.href = "javascript:void(0)");
                    var MenuPlate = domplate({
                        tag: DIV({
                            "class": "popupMenu popupMenuShadow"
                        }, DIV({
                            "class": "popupMenuContent popupMenuShadowContent"
                        }, FOR("item",
                            "$object.items|memberIterator",
                            TAG("$item.tag", {
                                item: "$item"
                            })))),
                        itemTag: A(menuItemProps, "$item.label"),
                        checkBoxTag: A(Lib.extend(menuItemProps, {
                            checked: "$item.checked"
                        }), "$item.label"),
                        radioButtonTag: A(Lib.extend(menuItemProps, {
                            selected: "$item.selected"
                        }), "$item.label"),
                        groupTag: A(Lib.extend(menuItemProps, {
                            child: "$item.child"
                        }), "$item.label"),
                        shortcutTag: A(menuItemProps, "$item.label",
                            SPAN({
                                "class": "popupMenuShortcutKey"
                            }, "$item.key")),
                        separatorTag: SPAN({
                            "class": "popupMenuSeparator"
                        }),
                        memberIterator: function(a) {
                            var b = [];
                            for (var c = 0, d = a.length; c < d; c++) {
                                var e = a[c];
                                if (typeof e == "string" && e.indexOf(
                                        "-") == 0) {
                                    b.push({
                                        tag: this.separatorTag
                                    });
                                    continue
                                }
                                e = Lib.extend(e, {}), e.type = e.type ||
                                    "", e.value = e.value || "";
                                var f = e.type;
                                e.tag = this.itemTag;
                                var g = e.className || "";
                                g += "popupMenuOption ", f ==
                                    "checkbox" ? (g +=
                                        "popupMenuCheckBox ", e.tag =
                                        this.checkBoxTag) : f ==
                                    "radio" ? (g +=
                                        "popupMenuRadioButton ", e.tag =
                                        this.radioButtonTag) : f ==
                                    "group" ? (g +=
                                        "popupMenuGroup ", e.tag =
                                        this.groupTag) : f ==
                                    "shortcut" && (g +=
                                        "popupMenuShortcut ", e.tag =
                                        this.shortcutTag), e.checked ?
                                    g += "popupMenuChecked " : e.selected &&
                                    (g += "popupMenuRadioSelected "),
                                    e.disabled && (g +=
                                        "popupMenuDisabled "), e.className =
                                    g, e.label = e.label, b.push(e)
                            }
                            return b
                        }
                    });

                    function Menu(a) {
                        if (!a.element) {
                            a.getItems && (a.items = a.getItems());
                            var b = Lib.getBody(document);
                            a.element = MenuPlate.tag.append({
                                object: a
                            }, b, MenuPlate)
                        }
                        Lib.append(this, a), typeof this.element == "string" ?
                            (this.id = this.element, this.element = $(this.id)) :
                            this.id && (this.element.id = this.id), this.elementStyle =
                            this.element.style, this.isVisible = !1, this.handleMouseDown =
                            Lib.bind(this.handleMouseDown, this), this.handleMouseOver =
                            Lib.bind(this.handleMouseOver, this), this.handleMouseOut =
                            Lib.bind(this.handleMouseOut, this), this.handleWindowMouseDown =
                            Lib.bind(this.handleWindowMouseDown, this)
                    }
                    var menuMap = {};
                    Menu.prototype = Lib.extend(Controller, {
                        initialize: function() {
                            Controller.initialize.call(this), this.addController(
                                [this.element, "mousedown",
                                    this.handleMouseDown
                                ], [this.element, "mouseover",
                                    this.handleMouseOver
                                ])
                        },
                        destroy: function() {
                            this.hide(), this.parentMenu && (this.parentMenu
                                    .childMenu = null), this.element
                                .parentNode.removeChild(this.element),
                                this.element = null, this.elementStyle =
                                null, this.parentMenu = null, this.parentTarget =
                                null
                        },
                        shutdown: function() {
                            Controller.shutdown.call(this)
                        },
                        showPopup: function(a) {
                            var b = Lib.isIE6 ? 1 : -4,
                                c = Lib.getElementBox(a),
                                d = {
                                    top: 0,
                                    left: 0
                                };
                            this.show(c.left + b - d.left, c.top +
                                c.height - 5 - d.top)
                        },
                        show: function(a, b) {
                            this.initialize();
                            if (!this.isVisible) {
                                a = a || 0, b = b || 0;
                                if (this.parentMenu) {
                                    var c = this.parentMenu.childMenu;
                                    c && c != this && c.destroy(),
                                        this.parentMenu.childMenu =
                                        this
                                } else Lib.addEventListener(
                                    document, "mousedown", this
                                    .handleWindowMouseDown);
                                this.elementStyle.display = "block",
                                    this.elementStyle.visibility =
                                    "hidden";
                                var d = Lib.getWindowSize();
                                a = Math.min(a, d.width - this.element
                                        .clientWidth - 10), a =
                                    Math.max(a, 0), b = Math.min(b,
                                        d.height - this.element.clientHeight -
                                        10), b = Math.max(b, 0),
                                    this.elementStyle.left = a +
                                    "px", this.elementStyle.top = b +
                                    "px", this.elementStyle.visibility =
                                    "visible", this.isVisible = !0,
                                    Lib.isFunction(this.onShow) &&
                                    this.onShow.apply(this,
                                        arguments)
                            }
                        },
                        hide: function() {
                            this.clearHideTimeout(), this.clearShowChildTimeout();
                            this.isVisible && (this.elementStyle.display =
                                "none", this.childMenu && (this
                                    .childMenu.destroy(), this.childMenu =
                                    null), this.parentTarget &&
                                Lib.removeClass(this.parentTarget,
                                    "popupMenuGroupSelected"),
                                this.isVisible = !1, this.shutdown(),
                                Lib.isFunction(this.onHide) &&
                                this.onHide.apply(this,
                                    arguments))
                        },
                        showChildMenu: function(a) {
                            var b = a.getAttribute("child"),
                                c = this,
                                a = a;
                            this.showChildTimeout = window.setTimeout(
                                function() {
                                    var d = Lib.getElementBox(a),
                                        e = menuMap.hasOwnProperty(
                                            b) ? menuMap[b] : {
                                            element: $(b)
                                        },
                                        f = new Menu(Lib.extend(
                                            e, {
                                                parentMenu: c,
                                                parentTarget: a
                                            })),
                                        g = Lib.isIE6 ? -1 : -6;
                                    f.show(d.left + d.width + g,
                                        d.top - 6), Lib.setClass(
                                        a,
                                        "popupMenuGroupSelected"
                                    )
                                }, 350)
                        },
                        clearHideTimeout: function() {
                            this.hideTimeout && (window.clearTimeout(
                                    this.hideTimeout), delete this
                                .hideTimeout)
                        },
                        clearShowChildTimeout: function() {
                            this.showChildTimeout && (window.clearTimeout(
                                    this.showChildTimeout),
                                this.showChildTimeout = null)
                        },
                        handleMouseDown: function(a) {
                            Lib.cancelEvent(a, !0);
                            var b = this;
                            while (b.parentMenu) b = b.parentMenu;
                            var c = a.target || a.srcElement;
                            c = Lib.getAncestorByClass(c,
                                "popupMenuOption");
                            if (!c || Lib.hasClass(c,
                                    "popupMenuGroup")) return !1;
                            if (c && !Lib.hasClass(c,
                                    "popupMenuDisabled")) {
                                var d = c.getAttribute("type");
                                if (d == "checkbox") {
                                    var e = c.getAttribute(
                                            "checked"),
                                        f = c.getAttribute("value"),
                                        g = Lib.hasClass(c,
                                            "popupMenuChecked");
                                    g ? (Lib.removeClass(c,
                                                "popupMenuChecked"),
                                            c.setAttribute(
                                                "checked", "")) : (
                                            Lib.setClass(c,
                                                "popupMenuChecked"),
                                            c.setAttribute(
                                                "checked", "true")),
                                        Lib.isFunction(this.onCheck) &&
                                        this.onCheck.call(this, c,
                                            f, !g)
                                }
                                if (d == "radiobutton") {
                                    var h = Lib.getElementsByClass(
                                            c.parentNode,
                                            "popupMenuRadioSelected"
                                        ),
                                        i = c.getAttribute("group");
                                    for (var j = 0, k = h.length; j <
                                        k; j++) radio = h[j], radio
                                        .getAttribute("group") == i &&
                                        (Lib.removeClass(radio,
                                            "popupMenuRadioSelected"
                                        ), radio.setAttribute(
                                            "selected", ""));
                                    Lib.setClass(c,
                                        "popupMenuRadioSelected"
                                    ), c.setAttribute(
                                        "selected", "true")
                                }
                                var l = null,
                                    m = c.command;
                                Lib.isFunction(m) ? l = m : typeof m ==
                                    "string" && (l = this[m]);
                                var n = !0;
                                l && (n = l.call(this, c) !== !1),
                                    n && b.hide()
                            }
                            return !1
                        },
                        handleWindowMouseDown: function(a) {
                            var b = a.target || a.srcElement;
                            b = Lib.getAncestorByClass(b,
                                "popupMenu"), b || (Lib.removeEventListener(
                                    document, "mousedown", this
                                    .handleWindowMouseDown),
                                this.destroy())
                        },
                        handleMouseOver: function(a) {
                            this.clearHideTimeout(), this.clearShowChildTimeout();
                            var b = a.target || a.srcElement;
                            b = Lib.getAncestorByClass(b,
                                "popupMenuOption");
                            if (b) {
                                var c = this.childMenu;
                                c && (Lib.removeClass(c.parentTarget,
                                            "popupMenuGroupSelected"
                                        ), c.parentTarget != b && c
                                        .isVisible && (c.clearHideTimeout(),
                                            c.hideTimeout = window.setTimeout(
                                                function() {
                                                    c.destroy()
                                                }, 300))), Lib.hasClass(
                                        b, "popupMenuGroup") &&
                                    this.showChildMenu(b)
                            }
                        }
                    }), Lib.append(Menu, {
                        register: function(a) {
                            menuMap[a.id] = a
                        },
                        check: function(a) {
                            Lib.setClass(a, "popupMenuChecked"), a.setAttribute(
                                "checked", "true")
                        },
                        uncheck: function(a) {
                            Lib.removeClass(a, "popupMenuChecked"),
                                a.setAttribute("checked", "")
                        },
                        disable: function(a) {
                            Lib.setClass(a, "popupMenuDisabled")
                        },
                        enable: function(a) {
                            Lib.removeClass(a, "popupMenuDisabled")
                        }
                    });
                    return Menu
                }
            }), require.def("preview/requestList", ["domplate/domplate", "core/lib",
                "i18n!nls/requestList", "preview/harModel", "core/cookies",
                "preview/requestBody", "domplate/infoTip", "domplate/popupMenu"
            ], function(Domplate, Lib, Strings, HarModel, Cookies, RequestBody,
                InfoTip, Menu) {
                with(Domplate) {
                    function RequestList(a) {
                        this.input = a, this.pageTimings = [], this.addPageTiming({
                            name: "onContentLoad",
                            classes: "netContentLoadBar",
                            description: Strings.ContentLoad
                        }), this.addPageTiming({
                            name: "onLoad",
                            classes: "netWindowLoadBar",
                            description: Strings.WindowLoad
                        }), InfoTip.addListener(this)
                    }
                    RequestList.columns = ["url", "status", "type", "domain",
                        "size", "timeline"
                    ], RequestList.columnsHiddenByDefault = ["type",
                        "domain"
                    ], RequestList.getHiddenColumns = function() {
                        var a = Cookies.getCookie("hiddenCols");
                        if (a) {
                            a = a.replace(/\+/g, " "), a = unescape(a);
                            return a.split(" ")
                        }
                        return Lib.cloneArray(RequestList.columnsHiddenByDefault)
                    };
                    var cols = RequestList.getHiddenColumns();
                    document.getElementById("content").setAttribute(
                            "hiddenCols", cols.join(" ")), RequestList.prototype =
                        domplate({
                            tableTag: TABLE({
                                "class": "netTable",
                                cellpadding: 0,
                                cellspacing: 0,
                                onclick: "$onClick",
                                _repObject: "$requestList"
                            }, TBODY(TR(TD({
                                "class": "netHrefCol",
                                width: "20%"
                            }), TD({
                                "class": "netStatusCol",
                                width: "7%"
                            }), TD({
                                "class": "netTypeCol",
                                width: "7%"
                            }), TD({
                                "class": "netDomainCol",
                                width: "7%"
                            }), TD({
                                "class": "netSizeCol",
                                width: "7%"
                            }), TD({
                                "class": "netTimeCol",
                                width: "100%"
                            }), TD({
                                width: "15px"
                            })))),
                            fileTag: FOR("file", "$files", TR({
                                "class": "netRow loaded",
                                $isExpandable: "$file|isExpandable",
                                $responseError: "$file|isError",
                                $responseRedirect: "$file|isRedirect",
                                $fromCache: "$file|isFromCache"
                            }, TD({
                                "class": "netHrefCol netCol"
                            }, DIV({
                                "class": "netHrefLabel netLabel",
                                style: "margin-left: $file|getIndent\\px"
                            }, "$file|getHref"), DIV({
                                "class": "netFullHrefLabel netHrefLabel netLabel",
                                style: "margin-left: $file|getIndent\\px"
                            }, "$file|getFullHref")), TD({
                                "class": "netStatusCol netCol"
                            }, DIV({
                                "class": "netStatusLabel netLabel"
                            }, "$file|getStatus")), TD({
                                "class": "netTypeCol netCol"
                            }, DIV({
                                "class": "netTypeLabel netLabel"
                            }, "$file|getType")), TD({
                                "class": "netDomainCol netCol"
                            }, DIV({
                                "class": "netDomainLabel netLabel"
                            }, "$file|getDomain")), TD({
                                "class": "netSizeCol netCol"
                            }, DIV({
                                "class": "netSizeLabel netLabel"
                            }, "$file|getSize")), TD({
                                "class": "netTimeCol netCol"
                            }, DIV({
                                "class": "netTimelineBar"
                            }, "&nbsp;", DIV({
                                "class": "netBlockingBar netBar"
                            }), DIV({
                                "class": "netResolvingBar netBar"
                            }), DIV({
                                "class": "netConnectingBar netBar"
                            }), DIV({
                                "class": "netSendingBar netBar"
                            }), DIV({
                                "class": "netWaitingBar netBar"
                            }), DIV({
                                "class": "netReceivingBar netBar"
                            }, SPAN({
                                    "class": "netTimeLabel"
                                },
                                "$file|getElapsedTime"
                            )))), TD({
                                "class": "netOptionsCol netCol"
                            }, DIV({
                                "class": "netOptionsLabel netLabel",
                                onclick: "$onOpenOptions"
                            })))),
                            headTag: TR({
                                "class": "netHeadRow"
                            }, TD({
                                "class": "netHeadCol",
                                colspan: 7
                            }, DIV({
                                "class": "netHeadLabel"
                            }, "$doc.rootFile.href"))),
                            netInfoTag: TR({
                                "class": "netInfoRow"
                            }, TD({
                                "class": "netInfoCol",
                                colspan: 7
                            })),
                            summaryTag: TR({
                                "class": "netRow netSummaryRow"
                            }, TD({
                                "class": "netHrefCol netCol"
                            }, DIV({
                                "class": "netCountLabel netSummaryLabel"
                            }, "-")), TD({
                                "class": "netStatusCol netCol"
                            }), TD({
                                "class": "netTypeCol netCol"
                            }), TD({
                                "class": "netDomainCol netCol"
                            }), TD({
                                "class": "netTotalSizeCol netSizeCol netCol"
                            }, DIV({
                                "class": "netTotalSizeLabel netSummaryLabel"
                            }, "0KB")), TD({
                                "class": "netTotalTimeCol netTimeCol netCol"
                            }, DIV({
                                "class": "",
                                style: "width: 100%"
                            }, DIV({
                                "class": "netCacheSizeLabel netSummaryLabel"
                            }, "(", SPAN("0KB"), SPAN(
                                " " + Strings.fromCache
                            ), ")"), DIV({
                                "class": "netTimeBar"
                            }, SPAN({
                                "class": "netTotalTimeLabel netSummaryLabel"
                            }, "0ms")))), TD({
                                "class": "netCol"
                            })),
                            getIndent: function(a) {
                                return 0
                            },
                            isError: function(a) {
                                var b = Math.floor(a.response.status /
                                    100);
                                return b == 4 || b == 5
                            },
                            isRedirect: function(a) {
                                return !1
                            },
                            isFromCache: function(a) {
                                return a.cache && a.cache.afterRequest
                            },
                            getHref: function(a) {
                                var b = Lib.getFileName(this.getFullHref(
                                    a));
                                return unescape(a.request.method + " " +
                                    b)
                            },
                            getFullHref: function(a) {
                                return unescape(a.request.url)
                            },
                            getStatus: function(a) {
                                var b = a.response.status > 0 ? a.response
                                    .status + " " : "";
                                return b + a.response.statusText
                            },
                            getType: function(a) {
                                return a.response.content.mimeType
                            },
                            getDomain: function(a) {
                                return Lib.getPrettyDomain(a.request.url)
                            },
                            getSize: function(a) {
                                var b = a.response.bodySize,
                                    c = b && b != -1 ? b : a.response.content
                                    .size;
                                return this.formatSize(c)
                            },
                            isExpandable: function(a) {
                                var b = a.response.headers.length > 0,
                                    c = a.request.url.indexOf("data:") ==
                                    0;
                                return b || c
                            },
                            formatSize: function(a) {
                                return Lib.formatSize(a)
                            },
                            getElapsedTime: function(a) {
                                return Lib.formatTime(a.time)
                            },
                            onClick: function(a) {
                                var b = Lib.fixEvent(a);
                                if (Lib.isLeftClick(a)) {
                                    var c = Lib.getAncestorByClass(b.target,
                                        "netRow");
                                    c && (this.toggleHeadersRow(c), Lib
                                        .cancelEvent(a))
                                } else Lib.isControlClick(a) && window.open(
                                    a.target.innerText || a.target.textContent
                                )
                            },
                            toggleHeadersRow: function(a) {
                                if (Lib.hasClass(a, "isExpandable")) {
                                    var b = a.repObject;
                                    Lib.toggleClass(a, "opened");
                                    if (Lib.hasClass(a, "opened")) {
                                        var c = this.netInfoTag.insertRows({},
                                            a)[0];
                                        c.repObject = b;
                                        var d = new RequestBody;
                                        d.render(c.firstChild, b)
                                    } else {
                                        var c = a.nextSibling,
                                            e = Lib.getElementByClass(c,
                                                "netInfoBody");
                                        a.parentNode.removeChild(c)
                                    }
                                }
                            },
                            onOpenOptions: function(a) {
                                var b = Lib.fixEvent(a);
                                Lib.cancelEvent(a);
                                if (Lib.isLeftClick(a)) {
                                    var c = b.target,
                                        d = Lib.getAncestorByClass(c,
                                            "netRow"),
                                        e = this.getMenuItems(d),
                                        f = new Menu({
                                            id: "requestContextMenu",
                                            items: e
                                        });
                                    f.showPopup(c)
                                }
                            },
                            getMenuItems: function(a) {
                                var b = a.repObject,
                                    c = a.phase,
                                    d = c.files[0] == b && this.phases[
                                        0] == c,
                                    e = [{
                                        label: Strings.menuBreakTimeline,
                                        type: "checkbox",
                                        disabled: d,
                                        checked: c.files[0] == b &&
                                            !d,
                                        command: Lib.bind(this.breakLayout,
                                            this, a)
                                    }, "-", {
                                        label: Strings.menuOpenRequest,
                                        command: Lib.bind(this.openRequest,
                                            this, b)
                                    }, {
                                        label: Strings.menuOpenResponse,
                                        disabled: !b.response.content
                                            .text,
                                        command: Lib.bind(this.openResponse,
                                            this, b)
                                    }];
                                Lib.dispatch(this.listeners,
                                    "getMenuItems", [this, e, c, b]
                                );
                                return e
                            },
                            openRequest: function(a, b) {
                                window.open(b.request.url)
                            },
                            openResponse: function(a, b) {
                                var c = b.response.content.text,
                                    d = b.response.content.mimeType,
                                    e = b.response.content.encoding,
                                    f = "data:" + (d ? d : "") + ";" +
                                    (e ? e : "") + "," + c;
                                window.open(f)
                            },
                            breakLayout: function(a, b) {
                                var c = b.repObject,
                                    d = b.phase,
                                    e = d.files[0] == c;
                                b.breakLayout = !e, b.setAttribute(
                                    "breakLayout", b.breakLayout ?
                                    "true" : "false");
                                var f = Lib.getAncestorByClass(b,
                                        "netTable"),
                                    g = HarModel.getParentPage(this.input,
                                        c);
                                this.updateLayout(f, g)
                            },
                            updateLayout: function(a, b) {
                                var c = HarModel.getPageEntries(this.input,
                                    b);
                                this.table = a;
                                var d = this.table.firstChild,
                                    e = this.firstRow = d.firstChild.nextSibling;
                                this.phases = [];
                                var f = Cookies.getCookie(
                                    "phaseInterval");
                                f || (f = 4e3);
                                var g = null,
                                    h = b ? Lib.parseISO8601(b.startedDateTime) :
                                    null,
                                    i = b && b.pageTimings ? b.pageTimings
                                    .onLoad : -1;
                                i > 0 && (i += h);
                                for (var j = 0; j < c.length; j++) {
                                    var k = c[j];
                                    Lib.hasClass(e, "netInfoRow") && (e =
                                            e.nextSibling), e.repObject =
                                        k, h || (h = Lib.parseISO8601(k
                                            .startedDateTime));
                                    var l = Lib.parseISO8601(k.startedDateTime),
                                        m = g ? Lib.parseISO8601(g.getLastStartTime()) :
                                        0,
                                        n = g ? g.endTime : 0,
                                        o = !1;
                                    f >= 0 && (o = l > i && l - m >= f &&
                                            l + k.time >= n + f),
                                        typeof e.breakLayout ==
                                        "boolean" ? !g || e.breakLayout ?
                                        g = this.startPhase(k) : g.addFile(
                                            k) : !g || o ? g = this.startPhase(
                                            k) : g.addFile(k), this.phases[
                                            0] != g && e.setAttribute(
                                            "breakLayout", g.files[0] ==
                                            k ? "true" : "false");
                                    if (g.startTime == undefined || g.startTime >
                                        l) g.startTime = l;
                                    if (g.endTime == undefined || g.endTime <
                                        l + k.time) g.endTime = l + k.time;
                                    e = e.nextSibling
                                }
                                this.updateTimeStamps(b), this.updateTimeline(
                                    b), this.updateSummaries(b)
                            },
                            startPhase: function(a) {
                                var b = new Phase(a);
                                this.phases.push(b);
                                return b
                            },
                            calculateFileTimes: function(a, b, c) {
                                c != b.phase && (c = b.phase, this.phaseStartTime =
                                    c.startTime, this.phaseEndTime =
                                    c.endTime, this.phaseElapsed =
                                    this.phaseEndTime - c.startTime
                                );
                                var d = b.timings.blocked < 0 ? 0 : b.timings
                                    .blocked,
                                    e = d + (b.timings.dns < 0 ? 0 : b.timings
                                        .dns),
                                    f = e + (b.timings.connect < 0 ? 0 :
                                        b.timings.connect),
                                    g = f + (b.timings.send < 0 ? 0 : b
                                        .timings.send),
                                    h = g + (b.timings.wait < 0 ? 0 : b
                                        .timings.wait),
                                    i = h + (b.timings.receive < 0 ? 0 :
                                        b.timings.receive),
                                    j = b.time,
                                    k = Lib.parseISO8601(b.startedDateTime);
                                this.barOffset = ((k - this.phaseStartTime) /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barBlockingWidth = (d /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barResolvingWidth = (e /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barConnectingWidth = (
                                    f / this.phaseElapsed * 100).toFixed(
                                    3), this.barSendingWidth = (g /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barWaitingWidth = (h /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.barReceivingWidth = (i /
                                    this.phaseElapsed * 100).toFixed(
                                    3), this.calculatePageTimings(a,
                                    b, c);
                                return c
                            },
                            calculatePageTimings: function(a, b, c) {
                                if (a) {
                                    var d = Lib.parseISO8601(a.startedDateTime);
                                    for (var e = 0; e < c.pageTimings.length; e++) {
                                        var f = c.pageTimings[e].time;
                                        if (f > 0) {
                                            var g = d + f - c.startTime,
                                                h = (g / this.phaseElapsed *
                                                    100).toFixed(3);
                                            c.pageTimings[e].offset = h
                                        }
                                    }
                                }
                            },
                            updateTimeline: function(a) {
                                var b = this.table.firstChild,
                                    c;
                                for (var d = this.firstRow; d; d = d.nextSibling) {
                                    var e = d.repObject;
                                    if (!e) continue;
                                    if (Lib.hasClass(d, "netInfoRow"))
                                        continue;
                                    c = this.calculateFileTimes(a, e, c),
                                        d.phase = e.phase, delete e.phase;
                                    var f = Lib.getElementByClass(d,
                                            "netTimelineBar"),
                                        g = f.children[0],
                                        h = g.nextSibling,
                                        i = h.nextSibling,
                                        j = i.nextSibling,
                                        k = j.nextSibling,
                                        l = k.nextSibling;
                                    g.style.left = i.style.left = h.style
                                        .left = j.style.left = k.style.left =
                                        l.style.left = this.barOffset +
                                        "%", g.style.width = this.barBlockingWidth +
                                        "%", h.style.width = this.barResolvingWidth +
                                        "%", i.style.width = this.barConnectingWidth +
                                        "%", j.style.width = this.barSendingWidth +
                                        "%", k.style.width = this.barWaitingWidth +
                                        "%", l.style.width = this.barReceivingWidth +
                                        "%";
                                    var m = Lib.getElementsByClass(f,
                                        "netPageTimingBar");
                                    for (var n = 0; n < m.length; n++) m[
                                        n].parentNode.removeChild(m[
                                        n]);
                                    for (var n = 0; n < c.pageTimings.length; n++) {
                                        var o = c.pageTimings[n];
                                        if (!o.offset) continue;
                                        var p = f.ownerDocument.createElement(
                                            "DIV");
                                        f.appendChild(p), o.classes &&
                                            Lib.setClass(p, o.classes),
                                            Lib.setClass(p,
                                                "netPageTimingBar netBar"
                                            ), p.style.left = o.offset +
                                            "%", p.style.display =
                                            "block", o.offset = null
                                    }
                                }
                            },
                            updateTimeStamps: function(a) {
                                if (a) {
                                    var b = [];
                                    for (var c = 0; a.pageTimings && c <
                                        this.pageTimings.length; c++) {
                                        var d = this.pageTimings[c],
                                            e = a.pageTimings[d.name];
                                        e > 0 && b.push({
                                            label: d.name,
                                            time: e,
                                            classes: d.classes,
                                            comment: d.description
                                        })
                                    }
                                    var f = a.pageTimings ? a.pageTimings
                                        ._timeStamps : [];
                                    f && b.push.apply(b, f);
                                    var g = this.phases;
                                    for (var c = 0; c < g.length; c++) {
                                        var h = g[c],
                                            i = g[c + 1];
                                        for (var j = 0; j < b.length; j++) {
                                            var k = b[j],
                                                l = k.time;
                                            if (!l) continue;
                                            var m = Lib.parseISO8601(a.startedDateTime);
                                            l += m;
                                            if (!i || l < i.startTime)
                                                if (c == 0 || l >= h.startTime)
                                                    h.startTime > l &&
                                                    (h.startTime = l),
                                                    h.endTime < l && (h
                                                        .endTime = l),
                                                    h.pageTimings.push({
                                                        classes: k.classes ?
                                                            k.classes :
                                                            "netTimeStampBar",
                                                        name: k.label,
                                                        description: k
                                                            .comment,
                                                        time: k.time
                                                    })
                                        }
                                    }
                                }
                            },
                            updateSummaries: function(a) {
                                var b = this.phases,
                                    c = 0,
                                    d = 0,
                                    e = 0,
                                    f = 0;
                                for (var g = 0; g < b.length; ++g) {
                                    var h = b[g];
                                    h.invalidPhase = !1;
                                    var i = this.summarizePhase(h);
                                    c += i.fileCount, d += i.totalSize,
                                        e += i.cachedSize, f += i.totalTime
                                }
                                var j = this.summaryRow;
                                if (j) {
                                    var k = Lib.getElementByClass(j,
                                        "netCountLabel");
                                    k.firstChild.nodeValue = this.formatRequestCount(
                                        c);
                                    var l = Lib.getElementByClass(j,
                                        "netTotalSizeLabel");
                                    l.setAttribute("totalSize", d), l.firstChild
                                        .nodeValue = Lib.formatSize(d);
                                    var m = Lib.getElementByClass(j,
                                        "netCacheSizeLabel");
                                    m.setAttribute("collapsed", e == 0),
                                        m.childNodes[1].firstChild.nodeValue =
                                        Lib.formatSize(e);
                                    var n = Lib.getElementByClass(j,
                                            "netTotalTimeLabel"),
                                        o = Lib.formatTime(f);
                                    a && a.pageTimings.onLoad > 0 && (o +=
                                        " (onload: " + Lib.formatTime(
                                            a.pageTimings.onLoad) +
                                        ")"), n.innerHTML = o
                                }
                            },
                            formatRequestCount: function(a) {
                                return a + " " + (a == 1 ? Strings.request :
                                    Strings.requests)
                            },
                            summarizePhase: function(a) {
                                var b = 0,
                                    c = 0,
                                    d = "all";
                                d == "all" && (d = null);
                                var e = 0,
                                    f = 0,
                                    g = 0;
                                for (var h = 0; h < a.files.length; h++) {
                                    var i = a.files[h],
                                        j = Lib.parseISO8601(i.startedDateTime);
                                    if (!d || i.category == d) {
                                        ++e;
                                        var k = i.response.bodySize,
                                            l = k && k != -1 ? k : i.response
                                            .content.size;
                                        c += l, i.response.status ==
                                            304 && (b += l);
                                        if (!f || j < f) f = j;
                                        var m = j + i.time;
                                        m > g && (g = m)
                                    }
                                }
                                var n = g - f;
                                return {
                                    cachedSize: b,
                                    totalSize: c,
                                    totalTime: n,
                                    fileCount: e
                                }
                            },
                            showInfoTip: function(a, b, c, d) {
                                var e = Lib.getAncestorByClass(b,
                                    "netTable");
                                if (e && e.repObject == this) {
                                    var f = Lib.getAncestorByClass(b,
                                        "netRow");
                                    if (f) {
                                        if (Lib.getAncestorByClass(b,
                                                "netBar")) {
                                            a.setAttribute("multiline", !
                                                0);
                                            var g = f.repObject.startedDateTime +
                                                "-nettime";
                                            this.infoTipURL = g;
                                            return this.populateTimeInfoTip(
                                                a, f)
                                        }
                                        if (Lib.hasClass(b,
                                                "netSizeLabel")) {
                                            var g = f.repObject.startedDateTime +
                                                "-netsize";
                                            this.infoTipURL = g;
                                            return this.populateSizeInfoTip(
                                                a, f)
                                        }
                                    }
                                }
                            },
                            populateTimeInfoTip: function(a, b) {
                                EntryTimeInfoTip.render(this, b, a);
                                return !0
                            },
                            populateSizeInfoTip: function(a, b) {
                                EntrySizeInfoTip.render(this, b, a);
                                return !0
                            },
                            render: function(a, b) {
                                var c = HarModel.getPageEntries(this.input,
                                    b);
                                if (!c.length) return null;
                                return this.append(a, b, c)
                            },
                            append: function(a, b, c) {
                                this.table || (this.table = this.tableTag
                                        .replace({
                                            requestList: this
                                        }, a, this)), this.summaryRow ||
                                    (this.summaryRow = this.summaryTag.insertRows({},
                                        this.table.firstChild)[0]);
                                var d = this.table.firstChild,
                                    e = d.lastChild.previousSibling,
                                    f = this.fileTag.insertRows({
                                        files: c
                                    }, e, this);
                                this.updateLayout(this.table, b);
                                return f[0]
                            },
                            addPageTiming: function(a) {
                                this.pageTimings.push(a)
                            }
                        });

                    function Phase(a) {
                        this.files = [], this.pageTimings = [], this.addFile(a)
                    }
                    Phase.prototype = {
                        addFile: function(a) {
                            this.files.push(a), a.phase = this
                        },
                        getLastStartTime: function() {
                            return this.files[this.files.length - 1].startedDateTime
                        }
                    };
                    var EntryTimeInfoTip = domplate({
                            tableTag: TABLE({
                                "class": "timeInfoTip"
                            }, TBODY()),
                            timingsTag: FOR("time", "$timings", TR({
                                    "class": "timeInfoTipRow",
                                    $collapsed: "$time|hideBar"
                                }, TD({
                                    "class": "$time|getBarClass timeInfoTipBar",
                                    $loaded: "$time.loaded",
                                    $fromCache: "$time.fromCache"
                                }), TD({
                                        "class": "timeInfoTipCell startTime"
                                    },
                                    "$time.start|formatStartTime"),
                                TD({
                                    "class": "timeInfoTipCell elapsedTime"
                                }, "$time.elapsed|formatTime"), TD(
                                    "$time|getLabel"))),
                            startTimeTag: TR(TD(), TD(
                                    "$startTime.time|formatStartTime"),
                                TD({
                                    "class": "timeInfoTipStartLabel",
                                    colspan: 2
                                }, "$startTime|getLabel")),
                            separatorTag: TR({}, TD({
                                "class": "timeInfoTipSeparator",
                                colspan: 4,
                                height: "10px"
                            }, SPAN("$label"))),
                            eventsTag: FOR("event", "$events", TR({
                                    "class": "timeInfoTipEventRow"
                                }, TD({
                                    "class": "timeInfoTipBar",
                                    align: "center"
                                }, DIV({
                                    "class": "$event|getPageTimingClass timeInfoTipEventBar"
                                })), TD(
                                    "$event.start|formatStartTime"),
                                TD({
                                    colspan: 2
                                }, "$event|getTimingLabel"))),
                            hideBar: function(a) {
                                return !a.elapsed && a.bar ==
                                    "request.phase.Blocking"
                            },
                            getBarClass: function(a) {
                                var b = a.bar.substr(a.bar.lastIndexOf(
                                    ".") + 1);
                                return "net" + b + "Bar"
                            },
                            getPageTimingClass: function(a) {
                                return a.classes ? a.classes : ""
                            },
                            formatTime: function(a) {
                                return Lib.formatTime(a)
                            },
                            formatStartTime: function(a) {
                                var b = a > 0,
                                    c = Lib.formatTime(Math.abs(a));
                                if (!a) return c;
                                return (b > 0 ? "+" : "-") + c
                            },
                            getLabel: function(a) {
                                return Strings[a.bar]
                            },
                            getTimingLabel: function(a) {
                                return a.bar
                            },
                            render: function(a, b, c) {
                                var d = a.input,
                                    e = b.repObject,
                                    f = HarModel.getParentPage(d, e),
                                    g = f ? Lib.parseISO8601(f.startedDateTime) :
                                    null,
                                    h = Lib.parseISO8601(e.startedDateTime),
                                    i = EntryTimeInfoTip.tableTag.replace({},
                                        c),
                                    j = {};
                                g ? j.time = h - g : j.time = h - b.phase
                                    .startTime, j.bar =
                                    "request.Started", this.startTimeTag
                                    .insertRows({
                                        startTime: j
                                    }, i.firstChild), this.separatorTag
                                    .insertRows({
                                        label: Strings[
                                            "request.phases.label"
                                        ]
                                    }, i.firstChild);
                                var k = 0,
                                    l = [],
                                    m = e.timings.blocked,
                                    n = e.timings.dns,
                                    o = e.timings.ssl,
                                    p = e.timings.connect,
                                    q = e.timings.send,
                                    r = e.timings.wait,
                                    s = e.timings.receive;
                                m >= 0 && l.push({
                                    bar: "request.phase.Blocking",
                                    elapsed: m,
                                    start: k
                                }), n >= 0 && l.push({
                                    bar: "request.phase.Resolving",
                                    elapsed: n,
                                    start: k += m < 0 ? 0 : m
                                }), p >= 0 && l.push({
                                    bar: "request.phase.Connecting",
                                    elapsed: p,
                                    start: k += n < 0 ? 0 : n
                                }), q >= 0 && l.push({
                                    bar: "request.phase.Sending",
                                    elapsed: q,
                                    start: k += p < 0 ? 0 : p
                                }), r >= 0 && l.push({
                                    bar: "request.phase.Waiting",
                                    elapsed: r,
                                    start: k += q < 0 ? 0 : q
                                }), s >= 0 && l.push({
                                    bar: "request.phase.Receiving",
                                    elapsed: s,
                                    start: k += r < 0 ? 0 : r,
                                    loaded: e.loaded,
                                    fromCache: e.fromCache
                                }), this.timingsTag.insertRows({
                                    timings: l
                                }, i.firstChild);
                                if (!f) return !0;
                                var t = [];
                                for (var u = 0; u < b.phase.pageTimings
                                    .length; u++) {
                                    var v = b.phase.pageTimings[u];
                                    t.push({
                                        bar: v.description ? v.description :
                                            v.name,
                                        start: g + v.time - h,
                                        classes: v.classes,
                                        time: v.time
                                    })
                                }
                                t.length && (t.sort(function(a, b) {
                                        return a.time < b.time ?
                                            -1 : 1
                                    }), this.separatorTag.insertRows({
                                        label: Strings[
                                            "request.timings.label"
                                        ]
                                    }, i.firstChild), this.eventsTag
                                    .insertRows({
                                        events: t
                                    }, i.firstChild));
                                return !0
                            }
                        }),
                        EntrySizeInfoTip = domplate({
                            tag: DIV({
                                "class": "sizeInfoTip"
                            }, "$file|getSize"),
                            zippedTag: DIV(DIV({
                                "class": "sizeInfoTip"
                            }, "$file|getBodySize"), DIV({
                                "class": "sizeInfoTip"
                            }, "$file|getContentSize")),
                            getSize: function(a) {
                                var b = a.response.bodySize;
                                if (b < 0) return Strings.unknownSize;
                                return Lib.formatString(Strings.tooltipSize,
                                    Lib.formatSize(b), Lib.formatNumber(
                                        b))
                            },
                            getBodySize: function(a) {
                                var b = a.response.bodySize;
                                if (b < 0) return Strings.unknownSize;
                                return Lib.formatString(Strings.tooltipZippedSize,
                                    Lib.formatSize(b), Lib.formatNumber(
                                        b))
                            },
                            getContentSize: function(a) {
                                var b = a.response.content.size;
                                if (b < 0) return Strings.unknownSize;
                                return Lib.formatString(Strings.tooltipUnzippedSize,
                                    Lib.formatSize(b), Lib.formatNumber(
                                        b))
                            },
                            render: function(a, b, c) {
                                var d = a.input,
                                    e = b.repObject;
                                if (e.response.bodySize == e.response.content
                                    .size) return this.tag.replace({
                                    file: e
                                }, c);
                                return this.zippedTag.replace({
                                    file: e
                                }, c)
                            }
                        });
                    return RequestList
                }
            }), define("nls/pageList", {
                root: {
                    "column.label.url": "URL",
                    "column.label.status": "Status",
                    "column.label.type": "Type",
                    "column.label.domain": "Domain",
                    "column.label.size": "Size",
                    "column.label.timeline": "Timeline",
                    "action.label.Reset": "Reset"
                }
            }), require.def("preview/pageList", ["domplate/domplate", "core/lib",
                "core/trace", "core/cookies", "preview/requestList",
                "i18n!nls/pageList", "domplate/popupMenu"
            ], function(Domplate, Lib, Trace, Cookies, RequestList, Strings, Menu) {
                with(Domplate) {
                    function PageList(a) {
                        this.input = a, this.listeners = []
                    }
                    PageList.prototype = domplate({
                        tableTag: TABLE({
                            "class": "pageTable",
                            cellpadding: 0,
                            cellspacing: 0,
                            onclick: "$onClick",
                            _repObject: "$input"
                        }, TBODY(TAG("$rowTag", {
                            groups: "$input.log.pages"
                        }))),
                        rowTag: FOR("group", "$groups", TR({
                            "class": "pageRow",
                            _repObject: "$group"
                        }, TD({
                            "class": "groupName pageCol",
                            width: "1%"
                        }, SPAN({
                            "class": "pageName"
                        }, "$group|getPageTitle")), TD({
                            "class": "netOptionsCol netCol",
                            width: "15px"
                        }, DIV({
                            "class": "netOptionsLabel netLabel",
                            onclick: "$onOpenOptions"
                        })))),
                        bodyTag: TR({
                            "class": "pageInfoRow",
                            style: "height:auto;"
                        }, TD({
                            "class": "pageInfoCol",
                            colspan: 2
                        })),
                        getPageTitle: function(a) {
                            return Lib.cropString(a.title, 100)
                        },
                        getPageID: function(a) {
                            return "[" + a.id + "]"
                        },
                        onClick: function(a) {
                            var b = Lib.fixEvent(a);
                            if (Lib.isLeftClick(a)) {
                                var c = Lib.getAncestorByClass(b.target,
                                    "pageRow");
                                c && (this.toggleRow(c), Lib.cancelEvent(
                                    a))
                            }
                        },
                        toggleRow: function(a, b) {
                            var c = Lib.hasClass(a, "opened");
                            if (!c || !b) {
                                Lib.toggleClass(a, "opened");
                                if (Lib.hasClass(a, "opened")) {
                                    var d = this.bodyTag.insertRows({},
                                            a)[0],
                                        e = this.createRequestList(),
                                        f = PageList.prototype.pageTimings;
                                    for (var g = 0; g < f.length; g++)
                                        e.addPageTiming(f[g]);
                                    e.render(d.firstChild, a.repObject)
                                } else {
                                    var d = a.nextSibling;
                                    a.parentNode.removeChild(d)
                                }
                            }
                        },
                        expandAll: function(a) {
                            var b = a.firstChild.firstChild;
                            while (b) Lib.hasClass(b, "pageRow") &&
                                this.toggleRow(b, !0), b = b.nextSibling
                        },
                        getPageRow: function(a) {
                            var b = this.element.parentNode,
                                c = Lib.getElementsByClass(b,
                                    "pageRow");
                            for (var d = 0; d < c.length; d++) {
                                var e = c[d];
                                if (e.repObject == a) return e
                            }
                        },
                        togglePage: function(a) {
                            var b = this.getPageRow(a);
                            this.toggleRow(b)
                        },
                        expandPage: function(a) {
                            var b = this.getPageRow(a);
                            this.toggleRow(b, !0)
                        },
                        collapsePage: function(a) {
                            var b = this.getPageRow(a);
                            Lib.hasClass(b, "opened") && this.toggleRow(
                                b)
                        },
                        onOpenOptions: function(a) {
                            var b = Lib.fixEvent(a);
                            Lib.cancelEvent(a);
                            if (Lib.isLeftClick(a)) {
                                var c = b.target,
                                    d = Lib.getAncestorByClass(c,
                                        "pageRow"),
                                    e = this.getMenuItems(d.repObject),
                                    f = new Menu({
                                        id: "requestContextMenu",
                                        items: e
                                    });
                                f.showPopup(c)
                            }
                        },
                        getMenuItems: function(a) {
                            var b = RequestList.getHiddenColumns().join(),
                                c, d = 0,
                                e = [];
                            for (var f = 0; f < RequestList.columns
                                .length; f++) {
                                var g = RequestList.columns[f],
                                    h = b.indexOf(g) == -1;
                                e.push({
                                    label: Strings[
                                        "column.label." +
                                        g],
                                    type: "checkbox",
                                    checked: h,
                                    command: Lib.bindFixed(
                                        this.onToggleColumn,
                                        this, g)
                                }), h && (c = f, d++)
                            }
                            d == 1 && (e[c].disabled = !0), e.push(
                                "-"), e.push({
                                label: Strings[
                                    "action.label.Reset"
                                ],
                                command: Lib.bindFixed(this
                                    .updateColumns,
                                    this)
                            });
                            return e
                        },
                        onToggleColumn: function(a) {
                            var b = RequestList.getHiddenColumns();
                            Lib.remove(b, a) || b.push(a), this.updateColumns(
                                b)
                        },
                        updateColumns: function(a) {
                            var b = a || RequestList.columnsHiddenByDefault;
                            Cookies.setCookie("hiddenCols", b.join(
                                " ")), document.getElementById(
                                "content").setAttribute(
                                "hiddenCols", b.join(" "))
                        },
                        createRequestList: function() {
                            var a = new RequestList(this.input);
                            a.listeners = this.listeners;
                            return a
                        },
                        append: function(a) {
                            var b = this.createRequestList();
                            b.render(a, null);
                            var c = this.input.log.pages;
                            if (c && c.length) {
                                var d = this.tableTag.append({
                                        input: this.input
                                    }, a, this),
                                    e = d.firstChild.childNodes.length,
                                    f = d.parentNode.childNodes.length;
                                e == 1 && f == 1 && this.toggleRow(
                                    d.firstChild.firstChild);
                                var g = Lib.getURLParameter(
                                    "expand");
                                g && this.expandAll(d)
                            }
                        },
                        render: function(a) {
                            this.append(a)
                        },
                        addListener: function(a) {
                            this.listeners.push(a)
                        },
                        removeListener: function(a) {
                            Lib.remove(this.listeners, a)
                        }
                    }), PageList.prototype.pageTimings = [];
                    return PageList
                }
            }), require.def("domplate/toolbar", ["domplate/domplate", "core/lib",
                "core/trace", "domplate/popupMenu"
            ], function(Domplate, Lib, Trace, Menu) {
                with(Domplate) {
                    var ToolbarTempl = domplate({
                        tag: DIV({
                            "class": "toolbar",
                            onclick: "$onClick"
                        }),
                        buttonTag: SPAN({
                            "class": "$button|getClassName toolbarButton",
                            title: "$button.tooltiptext",
                            $text: "$button|hasLabel",
                            onclick: "$button|getCommand"
                        }, "$button|getLabel"),
                        dropDownTag: SPAN({
                            "class": "$button|getClassName toolbarButton dropDown",
                            _repObject: "$button",
                            title: "$button.tooltiptext",
                            $text: "$button|hasLabel",
                            onclick: "$onDropDown"
                        }, "$button|getLabel", SPAN({
                            "class": "arrow"
                        })),
                        separatorTag: SPAN({
                            "class": "toolbarSeparator",
                            style: "color: gray;"
                        }, "|"),
                        hasLabel: function(a) {
                            return a.label ? !0 : !1
                        },
                        getLabel: function(a) {
                            return a.label ? a.label : ""
                        },
                        getClassName: function(a) {
                            return a.className ? a.className : ""
                        },
                        getCommand: function(a) {
                            return a.command ? a.command : function() {}
                        },
                        onClick: function(a) {
                            var b = $.event.fix(a || window.event);
                            Lib.cancelEvent(b)
                        },
                        onDropDown: function(a) {
                            var b = $.event.fix(a || window.event),
                                c = b.target,
                                d = Lib.getAncestorByClass(c,
                                    "toolbarButton"),
                                e = d.repObject.items,
                                f = new Menu({
                                    id: "toolbarContextMenu",
                                    items: e
                                });
                            f.showPopup(d)
                        }
                    });

                    function Toolbar() {
                        this.buttons = []
                    }
                    Toolbar.prototype = {
                        addButton: function(a) {
                            a.tooltiptext || (tooltiptext = ""), this.buttons
                                .push(a)
                        },
                        removeButton: function(a) {
                            for (var b = 0; b < this.buttons.length; b++)
                                if (this.buttons[b].id == a) {
                                    this.buttons.splice(b, 1);
                                    break
                                }
                        },
                        addButtons: function(a) {
                            for (var b = 0; b < a.length; b++) this.addButton(
                                a[b])
                        },
                        getButton: function(a) {
                            for (var b = 0; b < this.buttons.length; b++)
                                if (this.buttons[b].id == a) return this
                                    .buttons[b]
                        },
                        render: function(a) {
                            if (this.buttons.length) {
                                this.element && (a = this.element.parentNode),
                                    this.element = ToolbarTempl.tag.replace({},
                                        a);
                                for (var b = 0; b < this.buttons.length; b++) {
                                    var c = this.buttons[b],
                                        d = c.items ? ToolbarTempl.dropDownTag :
                                        ToolbarTempl.buttonTag,
                                        e = c.tag ? c.tag : d;
                                    e.append({
                                            button: c
                                        }, this.element), b < this.buttons
                                        .length - 1 && ToolbarTempl.separatorTag
                                        .append({}, this.element)
                                }
                                return this.element
                            }
                        }
                    };
                    return Toolbar
                }
            }), require.def("preview/menu", ["domplate/domplate", "core/lib",
                "domplate/toolbar", "core/trace"
            ], function(Domplate, Lib, Toolbar, Trace) {
                with(Domplate) {
                    function Menu() {}
                    Menu.prototype = {
                        render: function(a) {
                            this.element = MenuPlate.render(a), this.toolbar =
                                new Toolbar, this.toolbar.addButton({
                                    id: "credentials",
                                    label: "Powered by Jan Odvarko",
                                    tooltiptext: "http://www.softwareishard.com/blog/har-viewer/",
                                    command: Lib.bindFixed(this.onCredentials,
                                        this, !0)
                                });
                            var b = Lib.getElementByClass(this.element,
                                "menuContent");
                            this.toolbar.render(b), Lib.isWebkit && (b.style
                                .paddingTop = "1px")
                        },
                        onCredentials: function() {
                            window.open(
                                "http://www.softwareishard.com/blog/har-viewer/"
                            )
                        },
                        onFullPreview: function() {}
                    };
                    var MenuPlate = domplate({
                        tag: DIV({
                            "class": "menu",
                            _repObject: "$object"
                        }, DIV({
                            "class": "menuHandle",
                            onmousemove: "$onMouseMove",
                            onclick: "$onMouseClick"
                        }), DIV({
                            "class": "menuContent",
                            style: "display: none"
                        })),
                        onMouseMove: function(a) {
                            var b = Lib.fixEvent(a);
                            this.open(b.target)
                        },
                        onMouseClick: function(a) {
                            var b = Lib.fixEvent(a);
                            this.toggle(b.target)
                        },
                        open: function(a) {
                            var b = Lib.getAncestorByClass(a,
                                    "menu"),
                                c = Lib.getElementByClass(b,
                                    "menuContent");
                            c.clientWidth <= 0 && this.toggle(a)
                        },
                        toggle: function(a) {
                            var b = Lib.getAncestorByClass(a,
                                    "menu"),
                                c = Lib.getElementByClass(b,
                                    "menuContent");
                            $(c).animate({
                                    width: "toggle"
                                }, undefined, undefined,
                                function() {
                                    var a = Lib.getElementByClass(
                                        b, "menuHandle");
                                    c.clientWidth > 0 ? Lib.setClass(
                                        a, "opened") : Lib.removeClass(
                                        a, "opened")
                                })
                        },
                        render: function(a, b) {
                            return this.tag.append({
                                object: b
                            }, a, this)
                        }
                    });
                    return Menu
                }
            }), require.def("harPreview", ["preview/pageList", "preview/harModel",
                "core/lib", "core/trace", "preview/menu"
            ], function(a, b, c, d, e) {
                function f() {
                    this.id = "harPreview", this.model = new b
                }
                f.prototype = {
                    initialize: function(a) {
                        this.topMenu = new e, this.topMenu.render(a);
                        var d = c.bind(this.appendPreview, this);
                        b.Loader.run(d)
                    },
                    appendPreview: function(e) {
                        try {
                            var f = b.parse(e, !0);
                            this.model.append(f);
                            var h = new a(f);
                            h.render(g), c.fireEvent(g,
                                "onPreviewHARLoaded")
                        } catch (i) {
                            d.exception(
                                "HarPreview.appendPreview; EXCEPTION ",
                                i)
                        }
                    },
                    loadHar: function(a, c) {
                        c = c || {};
                        return b.Loader.load(this, a, c.jsonp, c.jsonpCallback,
                            c.success, c.ajaxError)
                    }
                };
                var g = document.getElementById("content"),
                    h = g.repObject = new f;
                c.fireEvent(g, "onPreviewPreInit"), h.initialize(g), c.fireEvent(g,
                    "onPreviewInit"), d.log("HarPreview; initialized OK")
            });
        }  
    });
    
    
    })(jQuery,require = window.require || {});
/*
 Highcharts JS v2.2.0 (2012-02-16)

 (c) 2009-2011 Torstein H?nsi

 License: www.highcharts.com/license
*/
(function(){function N(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function Oa(){for(var a=0,b=arguments,c=b.length,d={};a<c;a++)d[b[a++]]=b[a];return d}function Q(a,b){return parseInt(a,b||10)}function yb(a){return typeof a==="string"}function kb(a){return typeof a==="object"}function zb(a){return Object.prototype.toString.call(a)==="[object Array]"}function Ja(a){return typeof a==="number"}function lb(a){return oa.log(a)/oa.LN10}function cb(a){return oa.pow(10,a)}function Gb(a,b){for(var c=
a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function y(a){return a!==ba&&a!==null}function r(a,b,c){var d,e;if(yb(b))y(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(y(b)&&kb(b))for(d in b)a.setAttribute(d,b[d]);return e}function Hb(a){return zb(a)?a:[a]}function p(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],typeof c!=="undefined"&&c!==null)return c}function U(a,b){if(Sb&&b&&b.opacity!==ba)b.filter="alpha(opacity="+b.opacity*100+")";N(a.style,b)}function xa(a,
b,c,d,e){a=V.createElement(a);b&&N(a,b);e&&U(a,{padding:0,border:ga,margin:0});c&&U(a,c);d&&d.appendChild(a);return a}function O(a,b){var c=function(){};c.prototype=new a;N(c.prototype,b);return c}function fc(a,b,c,d){var e=Ba.lang,f=isNaN(b=ya(b))?2:b,b=c===void 0?e.decimalPoint:c,d=d===void 0?e.thousandsSep:d,e=a<0?"-":"",c=String(Q(a=ya(+a||0).toFixed(f))),g=c.length>3?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+ya(a-c).toFixed(f).slice(2):"")}
function gc(a,b,c,d){var e,c=p(c,1);e=a/c;b||(b=[1,2,2.5,5,10],d&&d.allowDecimals===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(a=b[d],e<=(b[d]+(b[d+1]||b[d]))/2)break;a*=c;return a}function Ic(a,b){var c=b||[[Ab,[1,2,5,10,20,25,50,100,200,500]],[mb,[1,2,5,10,15,30]],[Bb,[1,2,5,10,15,30]],[Pa,[1,2,3,4,6,8,12]],[na,[1,2]],[Ka,[1,2]],[Xa,[1,2,3,4,6]],[za,null]],d=c[c.length-1],e=C[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=C[d[0]],f=d[1],c[g+1]&&a<=(e*f[f.length-1]+
C[c[g+1][0]])/2)break;e===C[za]&&a<5*e&&(f=[1,2,5]);e===C[za]&&a<5*e&&(f=[1,2,5]);c=gc(a/e,f);return{unitRange:e,count:c,unitName:d[0]}}function Jc(a,b,c,d){var e=[],f={},g=Ba.global.useUTC,h,i=new Date(b),b=a.unitRange,k=a.count;i.setMilliseconds(0);b>=C[mb]&&i.setSeconds(b>=C[Bb]?0:k*Ta(i.getSeconds()/k));if(b>=C[Bb])i[oc](b>=C[Pa]?0:k*Ta(i[Ib]()/k));if(b>=C[Pa])i[pc](b>=C[na]?0:k*Ta(i[Tb]()/k));if(b>=C[na])i[hc](b>=C[Xa]?1:k*Ta(i[Ya]()/k));b>=C[Xa]&&(i[qc](b>=C[za]?0:k*Ta(i[Cb]()/k)),h=i[nb]());
b>=C[za]&&(h-=h%k,i[rc](h));if(b===C[Ka])i[hc](i[Ya]()-i[ic]()+p(d,1));d=1;h=i[nb]();for(var j=i.getTime(),m=i[Cb](),i=i[Ya]();j<c;)e.push(j),b===C[za]?j=ob(h+d*k,0):b===C[Xa]?j=ob(h,m+d*k):!g&&(b===C[na]||b===C[Ka])?j=ob(h,m,i+d*k*(b===C[na]?1:7)):(j+=b*k,b<=C[Pa]&&j%C[na]===0&&(f[j]=na)),d++;e.push(j);e.info=N(a,{higherRanks:f,totalRange:b*k});return e}function sc(){this.symbol=this.color=0}function tc(a,b,c,d,e,f,g,h,i){var k=g.x,g=g.y,i=k+c+(i?h:-a-h),j=g-b+d+15,m;i<7&&(i=c+k+h);i+a>c+e&&(i-=
i+a-(c+e),j=g-b+d-h,m=!0);j<d+5?(j=d+5,m&&g>=j&&g<=j+b&&(j=g+d+h)):j+b>d+f&&(j=d+f-b-h);return{x:i,y:j}}function Kc(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,c){d=b(a,c);return d===0?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function Ub(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Jb(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Kb(a){for(var b in a)a[b]&&a[b].destroy&&a[b].destroy(),delete a[b]}function Vb(a){pb||
(pb=xa(db));a&&pb.appendChild(a);pb.innerHTML=""}function jc(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw c;else ea.console&&console.log(c)}function Db(a){return parseFloat(a.toPrecision(14))}function Lb(a,b){Wb=p(a,b.animation)}function uc(){var a=Ba.global.useUTC,b=a?"getUTC":"get",c=a?"setUTC":"set";ob=a?Date.UTC:function(a,b,c,g,h,i){return(new Date(a,b,p(c,1),p(g,0),p(h,0),p(i,0))).getTime()};Ib=b+"Minutes";Tb=b+"Hours";ic=b+"Day";Ya=b+"Date";Cb=b+"Month";nb=
b+"FullYear";oc=c+"Minutes";pc=c+"Hours";hc=c+"Date";qc=c+"Month";rc=c+"FullYear"}function pa(){}function vc(a,b){function c(a){function b(a,c){this.pos=a;this.type=c||"";this.isNew=!0;c||this.addLabel()}function c(a){if(a)this.options=a,this.id=a.id;return this}function d(a,b,c,e){this.isNegative=b;this.options=a;this.x=c;this.stack=e;this.alignOptions={align:a.align||(X?b?"left":"right":"center"),verticalAlign:a.verticalAlign||(X?"middle":b?"bottom":"top"),y:p(a.y,X?4:b?14:-6),x:p(a.x,X?b?-6:6:
0)};this.textAlign=a.textAlign||(X?b?"right":"left":"center")}function e(){var a=[],b=[],c;R=O=null;o(z.series,function(e){if(e.visible||!q.ignoreHiddenSeries){var f=e.options,g,h,i,j,k,l,m,H,n,La=f.threshold,z,o=[],v=0;if(D&&La<=0)La=f.threshold=null;if(u)f=e.xData,f.length&&(R=Za(p(R,f[0]),Ub(f)),O=$(p(O,f[0]),Jb(f)));else{var F,t,Mb,P=e.cropped,x=e.xAxis.getExtremes(),w=!!e.modifyValue;g=f.stacking;Ca=g==="percent";if(g)k=f.stack,j=e.type+p(k,""),l="-"+j,e.stackKey=j,h=a[j]||[],a[j]=h,i=b[l]||
[],b[l]=i;Ca&&(R=0,O=99);f=e.processedXData;m=e.processedYData;z=m.length;for(c=0;c<z;c++)if(H=f[c],n=m[c],n!==null&&n!==ba&&(g?(t=(F=n<La)?i:h,Mb=F?l:j,n=t[H]=y(t[H])?t[H]+n:n,ca[Mb]||(ca[Mb]={}),ca[Mb][H]||(ca[Mb][H]=new d(s.stackLabels,F,H,k)),ca[Mb][H].setTotal(n)):w&&(n=e.modifyValue(n)),P||(f[c+1]||H)>=x.min&&(f[c-1]||H)<=x.max))if(H=n.length)for(;H--;)n[H]!==null&&(o[v++]=n[H]);else o[v++]=n;!Ca&&o.length&&(R=Za(p(R,o[0]),Ub(o)),O=$(p(O,o[0]),Jb(o)));La!==null&&(R>=La?(R=La,Oa=!0):O<La&&(O=
La,Pa=!0))}}})}function f(a,b,c){for(var d,b=Db(Ta(b/a)*a),c=Db(ac(c/a)*a),e=[];b<=c;){e.push(b);b=Db(b+a);if(b===d)break;d=b}return e}function g(a,b,c,d){var e=[];if(!d)z._minorAutoInterval=null;if(a>=0.5)a=B(a),e=f(a,b,c);else if(a>=0.08){var h=Ta(b),i,j,k,l,m,H;for(i=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];h<c+1&&!H;h++){k=i.length;for(j=0;j<k&&!H;j++)l=lb(cb(h)*i[j]),l>b&&e.push(m),m>c&&(H=!0),m=l}}else if(b=cb(b),c=cb(c),a=s[d?"minorTickInterval":"tickInterval"],a=p(a==="auto"?null:
a,z._minorAutoInterval,(c-b)*(s.tickPixelInterval/(d?5:1))/((d?T/W.length:T)||1)),a=gc(a,null,oa.pow(10,Ta(oa.log(a)/oa.LN10))),e=Xb(f(a,b,c),lb),!d)z._minorAutoInterval=a/5;d||(Ma=a);return e}function h(){var a=[],b,c;if(D){c=W.length;for(b=1;b<c;b++)a=a.concat(g(Fa,W[b-1],W[b],!0))}else for(b=I+(W[0]-I)%Fa;b<=J;b+=Fa)a.push(b);return a}function i(){var a,b=O-R>=fb,c,d,e,f,g,h;u&&fb===ba&&!D&&(y(s.min)||y(s.max)?fb=null:(o(z.series,function(a){f=a.xData;for(d=g=a.xIncrement?1:f.length-1;d>0;d--)if(e=
f[d]-f[d-1],c===ba||e<c)c=e}),fb=Za(c*5,O-R)));J-I<fb&&(a=(fb-J+I)/2,a=[I-a,p(s.min,I-a)],b&&(a[2]=R),I=Jb(a),h=[I+fb,p(s.max,I+fb)],b&&(h[2]=O),J=Ub(h),J-I<fb&&(a[0]=J-fb,a[1]=p(s.min,J-fb),I=Jb(a)))}function j(a){var b,c=s.tickInterval,d=s.tickPixelInterval;ga?(pa=l[u?"xAxis":"yAxis"][s.linkedTo],b=pa.getExtremes(),I=p(b.min,b.dataMin),J=p(b.max,b.dataMax),s.type!==pa.options.type&&jc(11,1)):(I=p(da,s.min,R),J=p(ea,s.max,O));D&&(!a&&I<=0&&jc(10),I=lb(I),J=lb(J));ka&&(da=I=$(I,J-ka),ea=J,a&&(ka=
null));i();if(!Ua&&!Ca&&!ga&&y(I)&&y(J)){b=J-I||1;if(!y(s.min)&&!y(da)&&Ea&&(R<0||!Oa))I-=b*Ea;if(!y(s.max)&&!y(ea)&&Ga&&(O>0||!Pa))J+=b*Ga}Ma=I===J||I===void 0||J===void 0?1:ga&&!c&&d===pa.options.tickPixelInterval?pa.tickInterval:p(c,Ua?1:(J-I)*d/(T||1));u&&!a&&o(z.series,function(a){a.processData(I!==na||J!==za)});Y();z.beforeSetTickPositions&&z.beforeSetTickPositions();z.postProcessTickInterval&&(Ma=z.postProcessTickInterval(Ma));!w&&!D&&(Wa=oa.pow(10,Ta(oa.log(Ma)/oa.LN10)),y(s.tickInterval)||
(Ma=gc(Ma,null,Wa,s)));z.tickInterval=Ma;Fa=s.minorTickInterval==="auto"&&Ma?Ma/5:s.minorTickInterval;(W=s.tickPositions||Xa&&Xa.apply(z,[I,J]))||(W=w?(z.getNonLinearTimeTicks||Jc)(Ic(Ma,s.units),I,J,s.startOfWeek,z.ordinalPositions,z.closestPointRange,!0):D?g(Ma,I,J):f(Ma,I,J));Z(z,"afterSetTickPositions",{tickPositions:W});if(!ga&&(a=W[0],c=W[W.length-1],s.startOnTick?I=a:I>a&&W.shift(),s.endOnTick?J=c:J<c&&W.pop(),hb||(hb={x:0,y:0}),!w&&W.length>hb[Sa]&&s.alignTicks!==!1))hb[Sa]=W.length}function k(a){a=
(new c(a)).render();ra.push(a);return a}function m(){var a=s.title,d=s.stackLabels,e=s.alternateGridColor,f=s.lineWidth,g,i,j=l.hasRendered&&y(na)&&!isNaN(na),H=(g=z.series.length&&y(I)&&y(J))||p(s.showEmpty,!0),n,q;if(g||ga)if(Fa&&!Ua&&o(h(),function(a){wa[a]||(wa[a]=new b(a,"minor"));j&&wa[a].isNew&&wa[a].render(null,!0);wa[a].isActive=!0;wa[a].render()}),o(W,function(a,c){if(!ga||a>=I&&a<=J)Qa[a]||(Qa[a]=new b(a)),j&&Qa[a].isNew&&Qa[a].render(c,!0),Qa[a].isActive=!0,Qa[a].render(c)}),e&&o(W,function(a,
b){if(b%2===0&&a<J)Aa[a]||(Aa[a]=new c),n=a,q=W[b+1]!==ba?W[b+1]:J,Aa[a].options={from:D?cb(n):n,to:D?cb(q):q,color:e},Aa[a].render(),Aa[a].isActive=!0}),!z._addedPlotLB)o((s.plotLines||[]).concat(s.plotBands||[]),function(a){k(a)}),z._addedPlotLB=!0;o([Qa,wa,Aa],function(a){for(var b in a)a[b].isActive?a[b].isActive=!1:(a[b].destroy(),delete a[b])});f&&(g=r+(F?qb:0)+E,i=ta-Nb-(F?ib:0)+E,g=K.crispLine([ua,P?r:g,P?i:jb,ha,P?qa-bc:g,P?i:ta-Nb],f),aa?aa.animate({d:g}):aa=K.path(g).attr({stroke:s.lineColor,
"stroke-width":f,zIndex:7}).add(),aa[H?"show":"hide"]());if(v&&H)H=P?r:jb,f=Q(a.style.fontSize||12),H={low:H+(P?0:T),middle:H+T/2,high:H+(P?T:0)}[a.align],f=(P?jb+ib:r)+(P?1:-1)*(F?-1:1)*Ya+(t===2?f:0),v[v.isNew?"attr":"animate"]({x:P?H:f+(F?qb:0)+E+(a.x||0),y:P?f-(F?ib:0)+E:H+(a.y||0)}),v.isNew=!1;if(d&&d.enabled){var u,x,d=z.stackTotalGroup;if(!d)z.stackTotalGroup=d=K.g("stack-labels").attr({visibility:eb,zIndex:6}).translate(S,L).add();for(u in ca)for(x in a=ca[u],a)a[x].render(d)}z.isDirty=!1}
function n(a){for(var b=ra.length;b--;)ra[b].id===a&&ra[b].destroy()}var u=a.isX,F=a.opposite,P=X?!u:u,t=P?F?0:2:F?1:3,ca={},s=M(u?cc:kc,[Lc,Mc,wc,Nc][t],a),z=this,v,x=s.type,w=x==="datetime",D=x==="logarithmic",E=s.offset||0,Sa=u?"x":"y",T=0,A,G,C,V,r,jb,qb,ib,Nb,bc,U,Y,gb,Rb,fa,aa,R,O,fb=s.minRange||s.maxZoom,ka=s.range,da,ea,xa,Ba,J=null,I=null,na,za,Ea=s.minPadding,Ga=s.maxPadding,Ha=0,ga=y(s.linkedTo),pa,Oa,Pa,Ca,x=s.events,Ra,ra=[],Ma,Fa,Wa,W,Xa=s.tickPositioner,Qa={},wa={},Aa={},Ja,Ka,Ya,Ua=
s.categories,db=s.labels.formatter||function(){var a=this.value,b=this.dateTimeLabelFormat;return b?dc(b,a):Ma%1E6===0?a/1E6+"M":Ma%1E3===0?a/1E3+"k":!Ua&&a>=1E3?fc(a,0):a},Va=P&&s.labels.staggerLines,Da=s.reversed,Ia=Ua&&s.tickmarkPlacement==="between"?0.5:0;b.prototype={addLabel:function(){var a=this.pos,b=s.labels,c=Ua&&P&&Ua.length&&!b.step&&!b.staggerLines&&!b.rotation&&la/Ua.length||!P&&la/2,d=a===W[0],e=a===W[W.length-1],f=Ua&&y(Ua[a])?Ua[a]:a,g=this.label,h=W.info,i;w&&h&&(i=s.dateTimeLabelFormats[h.higherRanks[a]||
h.unitName]);this.isFirst=d;this.isLast=e;a=db.call({axis:z,chart:l,isFirst:d,isLast:e,dateTimeLabelFormat:i,value:D?Db(cb(f)):f});c=c&&{width:$(1,B(c-2*(b.padding||10)))+ia};c=N(c,b.style);y(g)?g&&g.attr({text:a}).css(c):this.label=y(a)&&b.enabled?K.text(a,0,0,b.useHTML).attr({align:b.align,rotation:b.rotation}).css(c).add(Rb):null},getLabelSize:function(){var a=this.label;return a?(this.labelBBox=a.getBBox())[P?"height":"width"]:0},render:function(a,b){var c=this.type,d=this.label,e=this.pos,f=
s.labels,g=this.gridLine,h=c?c+"Grid":"grid",i=c?c+"Tick":"tick",j=s[h+"LineWidth"],k=s[h+"LineColor"],l=s[h+"LineDashStyle"],H=s[i+"Length"],h=s[i+"Width"]||0,m=s[i+"Color"],n=s[i+"Position"],i=this.mark,La=f.step,ca=b&&ab||ta,q;q=P?U(e+Ia,null,null,b)+C:r+E+(F?(b&&bb||qa)-bc-r:0);ca=P?ca-Nb+E-(F?ib:0):ca-U(e+Ia,null,null,b)-C;if(j){e=gb(e+Ia,j,b);if(g===ba){g={stroke:k,"stroke-width":j};if(l)g.dashstyle=l;if(!c)g.zIndex=1;this.gridLine=g=j?K.path(e).attr(g).add(fa):null}!b&&g&&e&&g.animate({d:e})}if(h)n===
"inside"&&(H=-H),F&&(H=-H),c=K.crispLine([ua,q,ca,ha,q+(P?0:-H),ca+(P?H:0)],h),i?i.animate({d:c}):this.mark=K.path(c).attr({stroke:m,"stroke-width":h}).add(Rb);d&&!isNaN(q)&&(q=q+f.x-(Ia&&P?Ia*G*(Da?-1:1):0),ca=ca+f.y-(Ia&&!P?Ia*G*(Da?1:-1):0),y(f.y)||(ca+=Q(d.styles.lineHeight)*0.9-d.getBBox().height/2),Va&&(ca+=a/(La||1)%Va*16),this.isFirst&&!p(s.showFirstLabel,1)||this.isLast&&!p(s.showLastLabel,1)?d.hide():d.show(),La&&a%La&&d.hide(),d[this.isNew?"attr":"animate"]({x:q,y:ca}));this.isNew=!1},
destroy:function(){Kb(this)}};c.prototype={render:function(){var a=this,b=(z.pointRange||0)/2,c=a.options,d=c.label,e=a.label,f=c.width,g=c.to,h=c.from,i=c.value,j,k=c.dashStyle,H=a.svgElem,l=[],m,s,n=c.color;s=c.zIndex;var La=c.events;D&&(h=lb(h),g=lb(g),i=lb(i));if(f){if(l=gb(i,f),b={stroke:n,"stroke-width":f},k)b.dashstyle=k}else if(y(h)&&y(g))h=$(h,I-b),g=Za(g,J+b),j=gb(g),(l=gb(h))&&j?l.push(j[4],j[5],j[1],j[2]):l=null,b={fill:n};else return;if(y(s))b.zIndex=s;if(H)l?H.animate({d:l},null,H.onGetPath):
(H.hide(),H.onGetPath=function(){H.show()});else if(l&&l.length&&(a.svgElem=H=K.path(l).attr(b).add(),La))for(m in k=function(b){H.on(b,function(c){La[b].apply(a,[c])})},La)k(m);if(d&&y(d.text)&&l&&l.length&&qb>0&&ib>0){d=M({align:P&&j&&"center",x:P?!j&&4:10,verticalAlign:!P&&j&&"middle",y:P?j?16:10:j?6:-4,rotation:P&&!j&&90},d);if(!e)a.label=e=K.text(d.text,0,0).attr({align:d.textAlign||d.align,rotation:d.rotation,zIndex:s}).css(d.style).add();j=[l[1],l[4],p(l[6],l[1])];l=[l[2],l[5],p(l[7],l[2])];
m=Ub(j);s=Ub(l);e.align(d,!1,{x:m,y:s,width:Jb(j)-m,height:Jb(l)-s});e.show()}else e&&e.hide();return a},destroy:function(){Kb(this);Gb(ra,this)}};d.prototype={destroy:function(){Kb(this)},setTotal:function(a){this.cum=this.total=a},render:function(a){var b=this.options.formatter.call(this);this.label?this.label.attr({text:b,visibility:$a}):this.label=l.renderer.text(b,0,0).css(this.options.style).attr({align:this.textAlign,rotation:this.options.rotation,visibility:$a}).add(a)},setOffset:function(a,
b){var c=this.isNegative,d=z.translate(this.total,0,0,0,1),e=z.translate(0),e=ya(d-e),f=l.xAxis[0].translate(this.x)+a,g=l.plotHeight,c={x:X?c?d:d-e:f,y:X?g-f-b:c?g-d-e:g-d,width:X?e:b,height:X?b:e};this.label&&this.label.align(this.alignOptions,null,c).attr({visibility:eb})}};U=function(a,b,c,d,e){var f=1,g=0,h=d?V:G,d=d?na:I,e=s.ordinal||D&&e;h||(h=G);c&&(f*=-1,g=T);Da&&(f*=-1,g-=f*T);b?(Da&&(a=T-a),a=a/h+d,e&&(a=z.lin2val(a))):(e&&(a=z.val2lin(a)),a=f*(a-d)*h+g+f*Ha);return a};gb=function(a,b,
c){var d,e,f,a=U(a,null,null,c),g=c&&ab||ta,h=c&&bb||qa,i,c=e=B(a+C);d=f=B(g-a-C);if(isNaN(a))i=!0;else if(P){if(d=jb,f=g-Nb,c<r||c>r+qb)i=!0}else if(c=r,e=h-bc,d<jb||d>jb+ib)i=!0;return i?null:K.crispLine([ua,c,d,ha,e,f],b||0)};Y=function(){var a=J-I,b=0,c,d;if(u)ga?b=pa.pointRange:o(z.series,function(a){b=$(b,a.pointRange);d=a.closestPointRange;!a.noSharedTooltip&&y(d)&&(c=y(c)?Za(c,d):d)}),z.pointRange=b,z.closestPointRange=c;V=G;z.translationSlope=G=T/(a+b||1);C=P?r:Nb;Ha=G*(b/2)};va.push(z);
l[u?"xAxis":"yAxis"].push(z);X&&u&&Da===ba&&(Da=!0);N(z,{addPlotBand:k,addPlotLine:k,adjustTickAmount:function(){if(hb&&hb[Sa]&&!w&&!Ua&&!ga&&s.alignTicks!==!1){var a=Ja,b=W.length;Ja=hb[Sa];if(b<Ja){for(;W.length<Ja;)W.push(Db(W[W.length-1]+Ma));G*=(b-1)/(Ja-1);J=W[W.length-1]}if(y(a)&&Ja!==a)z.isDirty=!0}},categories:Ua,getExtremes:function(){return{min:D?Db(cb(I)):I,max:D?Db(cb(J)):J,dataMin:R,dataMax:O,userMin:da,userMax:ea}},getPlotLinePath:gb,getThreshold:function(a){var b=D?cb(I):I,c=D?cb(J):
J;b>a||a===null?a=b:c<a&&(a=c);return U(a,0,1,0,1)},isXAxis:u,options:s,plotLinesAndBands:ra,getOffset:function(){var a=z.series.length&&y(I)&&y(J),c=a||p(s.showEmpty,!0),d=0,e=0,f=s.title,g=s.labels,h=[-1,1,1,-1][t],i;Rb||(Rb=K.g("axis").attr({zIndex:7}).add(),fa=K.g("grid").attr({zIndex:s.gridZIndex||1}).add());Ka=0;if(a||ga)o(W,function(a){Qa[a]?Qa[a].addLabel():Qa[a]=new b(a)}),o(W,function(a){if(t===0||t===2||{1:"left",3:"right"}[t]===g.align)Ka=$(Qa[a].getLabelSize(),Ka)}),Va&&(Ka+=(Va-1)*16);
else for(i in Qa)Qa[i].destroy(),delete Qa[i];if(f&&f.text){if(!v)v=z.axisTitle=K.text(f.text,0,0,f.useHTML).attr({zIndex:7,rotation:f.rotation||0,align:f.textAlign||{low:"left",middle:"center",high:"right"}[f.align]}).css(f.style).add(),v.isNew=!0;c&&(d=v.getBBox()[P?"height":"width"],e=p(f.margin,P?5:10));v[c?"show":"hide"]()}E=h*p(s.offset,sa[t]);Ya=p(f.offset,Ka+e+(t!==2&&Ka&&h*s.labels[P?"y":"x"]));sa[t]=$(sa[t],Ya+d+h*E)},render:m,setAxisSize:function(){var a=s.offsetLeft||0,b=s.offsetRight||
0;r=p(s.left,S+a);jb=p(s.top,L);qb=p(s.width,la-a+b);ib=p(s.height,ma);Nb=ta-ib-jb;bc=qa-qb-r;T=P?qb:ib;z.left=r;z.top=jb;z.len=T},setAxisTranslation:Y,setCategories:function(b,c){z.categories=a.categories=Ua=b;o(z.series,function(a){a.translate();a.setTooltipPoints(!0)});z.isDirty=!0;p(c,!0)&&l.redraw()},setExtremes:function(a,b,c,d){c=p(c,!0);Z(z,"setExtremes",{min:a,max:b},function(){da=a;ea=b;c&&l.redraw(d)})},setScale:function(){var a,b,c;na=I;za=J;A=T;T=P?qb:ib;o(z.series,function(a){if(a.isDirtyData||
a.isDirty||a.xAxis.isDirty)c=!0});if(T!==A||c||ga||da!==xa||ea!==Ba){e();j();xa=da;Ba=ea;if(!u)for(a in ca)for(b in ca[a])ca[a][b].cum=ca[a][b].total;if(!z.isDirty)z.isDirty=l.isDirtyBox||I!==na||J!==za}},setTickPositions:j,translate:U,redraw:function(){rb.resetTracker&&rb.resetTracker();m();o(ra,function(a){a.render()});o(z.series,function(a){a.isDirty=!0})},removePlotBand:n,removePlotLine:n,reversed:Da,setTitle:function(a,b){s.title=M(s.title,a);v=v.destroy();z.isDirty=!0;p(b,!0)&&l.redraw()},series:[],
stacks:ca,destroy:function(){var a;Na(z);for(a in ca)Kb(ca[a]),ca[a]=null;if(z.stackTotalGroup)z.stackTotalGroup=z.stackTotalGroup.destroy();o([Qa,wa,Aa,ra],function(a){Kb(a)});o([aa,Rb,fa,v],function(a){a&&a.destroy()});aa=Rb=fa=v=null}});for(Ra in x)ja(z,Ra,x[Ra]);if(D)z.val2lin=lb,z.lin2val=cb}function d(a){function b(){var c=this.points||Hb(this),d=c[0].series,e;e=[d.tooltipHeaderFormatter(c[0].key)];o(c,function(a){d=a.series;e.push(d.tooltipFormatter&&d.tooltipFormatter(a)||a.point.tooltipFormatter(d.tooltipOptions.pointFormat))});
e.push(a.footerFormat||"");return e.join("")}function c(a,b){n=m?a:(2*n+a)/3;q=m?b:(q+b)/2;u.attr({x:n,y:q});mb=ya(a-n)>1||ya(b-q)>1?function(){c(a,b)}:null}function d(){if(!m){var a=l.hoverPoints;u.hide();a&&o(a,function(a){a.setState()});l.hoverPoints=null;m=!0}}var e,f=a.borderWidth,g=a.crosshairs,h=[],i=a.style,j=a.shared,k=Q(i.padding),m=!0,n=0,q=0;i.padding=0;var u=K.label("",0,0,null,null,null,a.useHTML).attr({padding:k,fill:a.backgroundColor,"stroke-width":f,r:a.borderRadius,zIndex:8}).css(i).hide().add();
wa||u.shadow(a.shadow);return{shared:j,refresh:function(f){var i,k,n,q,v={},t=[];n=f.tooltipPos;i=a.formatter||b;var v=l.hoverPoints,F;j&&(!f.series||!f.series.noSharedTooltip)?(q=0,v&&o(v,function(a){a.setState()}),l.hoverPoints=f,o(f,function(a){a.setState(Ra);q+=a.plotY;t.push(a.getLabelConfig())}),k=f[0].plotX,q=B(q)/f.length,v={x:f[0].category},v.points=t,f=f[0]):v=f.getLabelConfig();v=i.call(v);e=f.series;k=p(k,f.plotX);q=p(q,f.plotY);i=B(n?n[0]:X?la-q:k);k=B(n?n[1]:X?ma-k:q);n=j||!e.isCartesian||
e.tooltipOutsidePlot||Eb(i,k);v===!1||!n?d():(m&&(u.show(),m=!1),u.attr({text:v}),F=a.borderColor||f.color||e.color||"#606060",u.attr({stroke:F}),n=tc(u.width,u.height,S,L,la,ma,{x:i,y:k},p(a.distance,12),X),c(B(n.x),B(n.y)));if(g){g=Hb(g);var x;n=g.length;for(var D;n--;)if(x=f.series[n?"yAxis":"xAxis"],g[n]&&x)if(x=x.getPlotLinePath(f[n?"y":"x"],1),h[n])h[n].attr({d:x,visibility:eb});else{D={"stroke-width":g[n].width||1,stroke:g[n].color||"#C0C0C0",zIndex:g[n].zIndex||2};if(g[n].dashStyle)D.dashstyle=
g[n].dashStyle;h[n]=K.path(x).attr(D).add()}}Z(l,"tooltipRefresh",{text:v,x:i+S,y:k+L,borderColor:F})},hide:d,hideCrosshairs:function(){o(h,function(a){a&&a.hide()})},destroy:function(){o(h,function(a){a&&a.destroy()});u&&(u=u.destroy())}}}function e(a){function b(a){var c,d,e,a=a||ea.event;if(!a.target)a.target=a.srcElement;if(a.originalEvent)a=a.originalEvent;if(a.event)a=a.event;c=a.touches?a.touches.item(0):a;Va=xc(G);d=Va.left;e=Va.top;Sb?(d=a.x,c=a.y):(d=c.pageX-d,c=c.pageY-e);return N(a,{chartX:B(d),
chartY:B(c)})}function c(a){var b={xAxis:[],yAxis:[]};o(va,function(c){var d=c.translate,e=c.isXAxis;b[e?"xAxis":"yAxis"].push({axis:c,value:d((X?!e:e)?a.chartX-S:ma-a.chartY+L,!0)})});return b}function e(){var a=l.hoverSeries,b=l.hoverPoint;if(b)b.onMouseOut();if(a)a.onMouseOut();sb&&(sb.hide(),sb.hideCrosshairs());nb=null}function f(){if(n){var a={xAxis:[],yAxis:[]},b=n.getBBox(),c=b.x-S,d=b.y-L;k&&(o(va,function(e){if(e.options.zoomEnabled!==!1){var f=e.translate,g=e.isXAxis,h=X?!g:g,i=f(h?c:ma-
d-b.height,!0,0,0,1),f=f(h?c+b.width:ma-d,!0,0,0,1);a[g?"xAxis":"yAxis"].push({axis:e,min:Za(i,f),max:$(i,f)})}}),Z(l,"selection",a,Ab));n=n.destroy()}U(G,{cursor:"auto"});l.mouseIsDown=Ya=k=!1;Na(V,ra?"touchend":"mouseup",f)}function g(a){var b=y(a.pageX)?a.pageX:a.page.x,a=y(a.pageX)?a.pageY:a.page.y;Va&&!Eb(b-Va.left-S,a-Va.top-L)&&e()}function h(){e();Va=null}var i,j,k,n,m=wa?"":q.zoomType,u=/x/.test(m),v=/y/.test(m),F=u&&!X||v&&X,t=v&&!X||u&&X;Aa=function(){Wa?(Wa.translate(S,L),X&&Wa.attr({width:l.plotWidth,
height:l.plotHeight}).invert()):l.trackerGroup=Wa=K.g("tracker").attr({zIndex:9}).add()};Aa();if(a.enabled)l.tooltip=sb=d(a),Cb=setInterval(function(){mb&&mb()},32);(function(){G.onmousedown=function(a){a=b(a);!ra&&a.preventDefault&&a.preventDefault();l.mouseIsDown=Ya=!0;l.mouseDownX=i=a.chartX;j=a.chartY;ja(V,ra?"touchend":"mouseup",f)};var d=function(c){if(!c||!(c.touches&&c.touches.length>1)){c=b(c);if(!ra)c.returnValue=!1;var d=c.chartX,e=c.chartY,f=!Eb(d-S,e-L);ra&&c.type==="touchstart"&&(r(c.target,
"isTracker")?l.runTrackerClick||c.preventDefault():!Bb&&!f&&c.preventDefault());f&&(d<S?d=S:d>S+la&&(d=S+la),e<L?e=L:e>L+ma&&(e=L+ma));if(Ya&&c.type!=="touchstart"){if(k=Math.sqrt(Math.pow(i-d,2)+Math.pow(j-e,2)),k>10){var g=Eb(i-S,j-L);if(Ob&&(u||v)&&g)n||(n=K.rect(S,L,F?1:la,t?1:ma,0).attr({fill:q.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add());n&&F&&(c=d-i,n.attr({width:ya(c),x:(c>0?0:c)+i}));n&&t&&(e-=j,n.attr({height:ya(e),y:(e>0?0:e)+j}));g&&!n&&q.panning&&l.pan(d)}}else if(!f){var h,
d=l.hoverPoint,e=l.hoverSeries,m,o,g=qa,x=X?c.chartY:c.chartX-S;if(sb&&a.shared&&(!e||!e.noSharedTooltip)){h=[];m=Y.length;for(o=0;o<m;o++)if(Y[o].visible&&Y[o].options.enableMouseTracking!==!1&&!Y[o].noSharedTooltip&&Y[o].tooltipPoints.length)c=Y[o].tooltipPoints[x],c._dist=ya(x-c.plotX),g=Za(g,c._dist),h.push(c);for(m=h.length;m--;)h[m]._dist>g&&h.splice(m,1);if(h.length&&h[0].plotX!==nb)sb.refresh(h),nb=h[0].plotX}if(e&&e.tracker&&(c=e.tooltipPoints[x])&&c!==d)c.onMouseOver()}return f||!Ob}};G.onmousemove=
d;ja(G,"mouseleave",h);ja(V,"mousemove",g);G.ontouchstart=function(a){if(u||v)G.onmousedown(a);d(a)};G.ontouchmove=d;G.ontouchend=function(){k&&e()};G.onclick=function(a){var d=l.hoverPoint,a=b(a);a.cancelBubble=!0;if(!k)if(d&&r(a.target,"isTracker")){var e=d.plotX,f=d.plotY;N(d,{pageX:Va.left+S+(X?la-f:e),pageY:Va.top+L+(X?ma-e:f)});Z(d.series,"click",N(a,{point:d}));d.firePointEvent("click",a)}else N(a,c(a)),Eb(a.chartX-S,a.chartY-L)&&Z(l,"click",a);k=!1}})();N(this,{zoomX:u,zoomY:v,resetTracker:e,
normalizeMouseEvent:b,destroy:function(){if(l.trackerGroup)l.trackerGroup=Wa=l.trackerGroup.destroy();Na(G,"mouseleave",h);Na(V,"mousemove",g);G.onclick=G.onmousedown=G.onmousemove=G.ontouchstart=G.ontouchend=G.ontouchmove=null}})}function f(a){var b=a.type||q.type||q.defaultSeriesType,c=Ca[b],d=l.hasRendered;if(d)if(X&&b==="column")c=Ca.bar;else if(!X&&b==="bar")c=Ca.column;b=new c;b.init(l,a);!d&&b.inverted&&(X=!0);if(b.isCartesian)Ob=b.isCartesian;Y.push(b);return b}function g(){q.alignTicks!==
!1&&o(va,function(a){a.adjustTickAmount()});hb=null}function h(a){var b=l.isDirtyLegend,c,d=l.isDirtyBox,e=Y.length,f=e,h=l.clipRect;for(Lb(a,l);f--;)if(a=Y[f],a.isDirty&&a.options.stacking){c=!0;break}if(c)for(f=e;f--;)if(a=Y[f],a.options.stacking)a.isDirty=!0;o(Y,function(a){a.isDirty&&a.options.legendType==="point"&&(b=!0)});if(b&&Yb.renderLegend)Yb.renderLegend(),l.isDirtyLegend=!1;Ob&&(Ja||(hb=null,o(va,function(a){a.setScale()})),g(),Zb(),o(va,function(a){Z(a,"afterSetExtremes",a.getExtremes());
a.isDirty&&a.redraw()}));d&&(ob(),Aa(),h&&(Pb(h),h.animate({width:l.plotSizeX,height:l.plotSizeY+1})));o(Y,function(a){a.isDirty&&a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});rb&&rb.resetTracker&&rb.resetTracker();K.draw();Z(l,"redraw")}function i(){var b=a.xAxis||{},d=a.yAxis||{},b=Hb(b);o(b,function(a,b){a.index=b;a.isX=!0});d=Hb(d);o(d,function(a,b){a.index=b});b=b.concat(d);o(b,function(a){new c(a)});g()}function k(){var a=Ba.lang,b=q.resetZoomButton,c=b.theme,d=c.states,e=b.relativeTo===
"chart"?null:{x:S,y:L,width:la,height:ma};l.resetZoomButton=K.button(a.resetZoom,null,null,Ib,c,d&&d.hover).attr({align:b.position.align,title:a.resetZoomTitle}).add().align(b.position,!1,e)}function j(b,c){fa=M(a.title,b);da=M(a.subtitle,c);o([["title",b,fa],["subtitle",c,da]],function(a){var b=a[0],c=l[b],d=a[1],a=a[2];c&&d&&(c=c.destroy());a&&a.text&&!c&&(l[b]=K.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":Da+b,zIndex:1}).css(a.style).add().align(a,!1,R))})}function m(){Ea=q.renderTo;
Oa=Da+lc++;yb(Ea)&&(Ea=V.getElementById(Ea));Ea||jc(13,!0);Ea.innerHTML="";Ea.offsetWidth||(aa=Ea.cloneNode(0),U(aa,{position:tb,top:"-9999px",display:""}),V.body.appendChild(aa));na=(aa||Ea).offsetWidth;za=(aa||Ea).offsetHeight;l.chartWidth=qa=q.width||na||600;l.chartHeight=ta=q.height||(za>19?za:400);l.container=G=xa(db,{className:Da+"container"+(q.className?" "+q.className:""),id:Oa},N({position:yc,overflow:$a,width:qa+ia,height:ta+ia,textAlign:"left",lineHeight:"normal"},q.style),aa||Ea);l.renderer=
K=q.forExport?new Fb(G,qa,ta,!0):new $b(G,qa,ta);wa&&K.create(l,G,qa,ta);var a,b;zc&&G.getBoundingClientRect&&(a=function(){U(G,{left:0,top:0});b=G.getBoundingClientRect();U(G,{left:-(b.left-Q(b.left))+ia,top:-(b.top-Q(b.top))+ia})},a(),ja(ea,"resize",a),ja(l,"destroy",function(){Na(ea,"resize",a)}))}function n(){function a(c){var d=q.width||Ea.offsetWidth,e=q.height||Ea.offsetHeight,c=c.target;if(d&&e&&(c===ea||c===V)){if(d!==na||e!==za)clearTimeout(b),b=setTimeout(function(){zb(d,e,!1)},100);na=
d;za=e}}var b;ja(ea,"resize",a);ja(l,"destroy",function(){Na(ea,"resize",a)})}function u(){l&&Z(l,"endResize",null,function(){Ja-=1})}function t(){for(var b=X||q.inverted||q.type==="bar"||q.defaultSeriesType==="bar",c=a.series,d=c&&c.length;!b&&d--;)c[d].type==="bar"&&(b=!0);l.inverted=X=b}function D(){var b=a.labels,c=a.credits,d;j();Yb=l.legend=new Tb;o(va,function(a){a.setScale()});Zb();o(va,function(a){a.setTickPositions(!0)});g();Zb();ob();Ob&&o(va,function(a){a.render()});if(!l.seriesGroup)l.seriesGroup=
K.g("series-group").attr({zIndex:3}).add();o(Y,function(a){a.translate();a.setTooltipPoints();a.render()});b.items&&o(b.items,function(){var a=N(b.style,this.style),c=Q(a.left)+S,d=Q(a.top)+L+12;delete a.left;delete a.top;K.text(this.html,c,d).attr({zIndex:2}).css(a).add()});if(c.enabled&&!l.credits)d=c.href,l.credits=K.text(c.text,0,0).on("click",function(){if(d)location.href=d}).attr({align:c.position.align,zIndex:8}).css(c.style).add().align(c.position);Aa();l.hasRendered=!0;aa&&(Ea.appendChild(G),
Vb(aa))}function x(){if(!Qb&&ea==ea.top&&V.readyState!=="complete"||wa&&!ea.canvg)wa?Ac.push(x,a.global.canvasToolsURL):V.attachEvent("onreadystatechange",function(){V.detachEvent("onreadystatechange",x);V.readyState==="complete"&&x()});else{m();Z(l,"init");if(Highcharts.RangeSelector&&a.rangeSelector.enabled)l.rangeSelector=new Highcharts.RangeSelector(l);pb();xb();t();i();o(a.series||[],function(a){f(a)});if(Highcharts.Scroller&&(a.navigator.enabled||a.scrollbar.enabled))l.scroller=new Highcharts.Scroller(l);
l.render=D;l.tracker=rb=new e(a.tooltip);D();K.draw();b&&b.apply(l,[l]);o(l.callbacks,function(a){a.apply(l,[l])});Z(l,"load")}}var E=a.series;a.series=null;a=M(Ba,a);a.series=E;var q=a.chart,E=q.margin,E=kb(E)?E:[E,E,E,E],w=p(q.marginTop,E[0]),v=p(q.marginRight,E[1]),Sa=p(q.marginBottom,E[2]),A=p(q.marginLeft,E[3]),C=q.spacingTop,F=q.spacingRight,T=q.spacingBottom,gb=q.spacingLeft,R,fa,da,L,ka,O,S,sa,Ea,aa,G,Oa,na,za,qa,ta,bb,ab,Ha,Pa,Xa,pa,l=this,Bb=(E=q.events)&&!!E.click,Ka,Eb,sb,Ya,ub,wb,Ia,
ma,la,rb,Wa,Aa,Yb,Fa,vb,Va,Ob=q.showAxes,Ja=0,va=[],hb,Y=[],X,K,mb,Cb,nb,ob,Zb,pb,xb,zb,Ab,Ib,Tb=function(){function a(b,c){var d=b.legendItem,e=b.legendLine,g=b.legendSymbol,h=q.color,i=c?f.itemStyle.color:h,h=c?b.color:h;d&&d.css({fill:i});e&&e.attr({stroke:h});g&&g.attr({stroke:h,fill:h})}function b(a){var c=a.legendItem,d=a.legendLine,e=a._legendItemPos,f=e[0],e=e[1],g=a.legendSymbol,a=a.checkbox;c&&c.attr({x:v?f:Fa-f,y:e});d&&d.translate(v?f:Fa-f,e-4);g&&(c=f+g.xOff,g.attr({x:v?c:Fa-c,y:e+g.yOff}));
if(a)a.x=f,a.y=e}function c(){o(j,function(a){var b=a.checkbox,c=r.alignAttr;b&&U(b,{left:c.translateX+a.legendItemWidth+b.x-40+ia,top:c.translateY+b.y-11+ia})})}function d(b){var c,e,j,k,l=b.legendItem;k=b.series||b;var o=k.options,F=o&&o.borderWidth||0;if(!l){k=/^(bar|pie|area|column)$/.test(k.type);b.legendItem=l=K.text(f.labelFormatter.call(b),0,0,f.useHTML).css(b.visible?n:q).on("mouseover",function(){b.setState(Ra);l.css(m)}).on("mouseout",function(){l.css(b.visible?n:q);b.setState()}).on("click",
function(){var a=function(){b.setVisible()};b.firePointEvent?b.firePointEvent("legendItemClick",null,a):Z(b,"legendItemClick",null,a)}).attr({align:v?"left":"right",zIndex:2}).add(r);if(!k&&o&&o.lineWidth){var T={"stroke-width":o.lineWidth,zIndex:2};if(o.dashStyle)T.dashstyle=o.dashStyle;b.legendLine=K.path([ua,(-h-i)*(v?1:-1),0,ha,-i*(v?1:-1),0]).attr(T).add(r)}if(k)j=K.rect(c=-h-i,e=-11,h,12,2).attr({zIndex:3}).add(r),v||(c+=h);else if(o&&o.marker&&o.marker.enabled)j=o.marker.radius,j=K.symbol(b.symbol,
c=-h/2-i-j,e=-4-j,2*j,2*j).attr(b.pointAttr[Ga]).attr({zIndex:3}).add(r),v||(c+=h/2);if(j)j.xOff=c+F%2/2,j.yOff=e+F%2/2;b.legendSymbol=j;a(b,b.visible);if(o&&o.showCheckbox)b.checkbox=xa("input",{type:"checkbox",checked:b.selected,defaultChecked:b.selected},f.itemCheckboxStyle,G),ja(b.checkbox,"click",function(a){Z(b,"checkboxClick",{checked:a.target.checked},function(){b.select()})})}c=l.getBBox();e=b.legendItemWidth=f.itemWidth||h+i+c.width+u;w=c.height;if(g&&x-t+e>(C||qa-2*u-t))x=t,p+=E+w+y;D=
p+y;b._legendItemPos=[x,p];g?x+=e:p+=E+w+y;A=C||$(g?x-t:e,A)}function e(){x=t;p=u+E+F-5;D=A=0;r||(r=K.g("legend").attr({zIndex:10}).add());j=[];o(L,function(a){var b=a.options;b.showInLegend&&(j=j.concat(a.legendItems||(b.legendType==="point"?a.data:a)))});Kc(j,function(a,b){return(a.options.legendIndex||0)-(b.options.legendIndex||0)});O&&j.reverse();o(j,d);Fa=C||A;vb=D-F+w;if(Sa||B){Fa+=2*u;vb+=2*u;if(T){if(Fa>0&&vb>0)T[T.isNew?"attr":"animate"](T.crisp(null,null,null,Fa,vb)),T.isNew=!1}else T=K.rect(0,
0,Fa,vb,f.borderRadius,Sa||0).attr({stroke:f.borderColor,"stroke-width":Sa||0,fill:B||ga}).add(r).shadow(f.shadow),T.isNew=!0;T[j.length?"show":"hide"]()}o(j,b);for(var a=["left","right","top","bottom"],g,h=4;h--;)g=a[h],k[g]&&k[g]!=="auto"&&(f[h<2?"align":"verticalAlign"]=g,f[h<2?"x":"y"]=Q(k[g])*(h%2?-1:1));j.length&&r.align(N(f,{width:Fa,height:vb}),!0,R);Ja||c()}var f=l.options.legend;if(f.enabled){var g=f.layout==="horizontal",h=f.symbolWidth,i=f.symbolPadding,j,k=f.style,n=f.itemStyle,m=f.itemHoverStyle,
q=M(n,f.itemHiddenStyle),u=f.padding||Q(k.padding),v=!f.rtl,F=18,t=4+u+h+i,x,p,D,w=0,E=f.itemMarginTop||0,y=f.itemMarginBottom||0,T,Sa=f.borderWidth,B=f.backgroundColor,r,A,C=f.width,L=l.series,O=f.reversed;e();ja(l,"endResize",c);return{colorizeItem:a,destroyItem:function(a){var b=a.checkbox;o(["legendItem","legendLine","legendSymbol"],function(b){a[b]&&a[b].destroy()});b&&Vb(a.checkbox)},renderLegend:e,destroy:function(){T&&(T=T.destroy());r&&(r=r.destroy())}}}};Eb=function(a,b){return a>=0&&a<=
la&&b>=0&&b<=ma};Ib=function(){var a=l.resetZoomButton;Z(l,"selection",{resetSelection:!0},Ab);if(a)l.resetZoomButton=a.destroy()};Ab=function(a){var b=l.pointCount<100,c;l.resetZoomEnabled!==!1&&!l.resetZoomButton&&k();!a||a.resetSelection?o(va,function(a){a.options.zoomEnabled!==!1&&(a.setExtremes(null,null,!1),c=!0)}):o(a.xAxis.concat(a.yAxis),function(a){var b=a.axis;if(l.tracker[b.isXAxis?"zoomX":"zoomY"])b.setExtremes(a.min,a.max,!1),c=!0});c&&h(!0,b)};l.pan=function(a){var b=l.xAxis[0],c=l.mouseDownX,
d=b.pointRange/2,e=b.getExtremes(),f=b.translate(c-a,!0)+d,c=b.translate(c+la-a,!0)-d;(d=l.hoverPoints)&&o(d,function(a){a.setState()});f>Za(e.dataMin,e.min)&&c<$(e.dataMax,e.max)&&b.setExtremes(f,c,!0,!1);l.mouseDownX=a;U(G,{cursor:"move"})};Zb=function(){var b=a.legend,c=p(b.margin,10),d=b.x,e=b.y,f=b.align,g=b.verticalAlign,h;pb();if((l.title||l.subtitle)&&!y(w))(h=$(l.title&&!fa.floating&&!fa.verticalAlign&&fa.y||0,l.subtitle&&!da.floating&&!da.verticalAlign&&da.y||0))&&(L=$(L,h+p(fa.margin,15)+
C));b.enabled&&!b.floating&&(f==="right"?y(v)||(ka=$(ka,Fa-d+c+F)):f==="left"?y(A)||(S=$(S,Fa+d+c+gb)):g==="top"?y(w)||(L=$(L,vb+e+c+C)):g==="bottom"&&(y(Sa)||(O=$(O,vb-e+c+T))));l.extraBottomMargin&&(O+=l.extraBottomMargin);l.extraTopMargin&&(L+=l.extraTopMargin);Ob&&o(va,function(a){a.getOffset()});y(A)||(S+=sa[3]);y(w)||(L+=sa[0]);y(Sa)||(O+=sa[2]);y(v)||(ka+=sa[1]);xb()};zb=function(a,b,c){var d=l.title,e=l.subtitle;Ja+=1;Lb(c,l);ab=ta;bb=qa;if(y(a))l.chartWidth=qa=B(a);if(y(b))l.chartHeight=
ta=B(b);U(G,{width:qa+ia,height:ta+ia});K.setSize(qa,ta,c);la=qa-S-ka;ma=ta-L-O;hb=null;o(va,function(a){a.isDirty=!0;a.setScale()});o(Y,function(a){a.isDirty=!0});l.isDirtyLegend=!0;l.isDirtyBox=!0;Zb();d&&d.align(null,null,R);e&&e.align(null,null,R);h(c);ab=null;Z(l,"resize");Wb===!1?u():setTimeout(u,Wb&&Wb.duration||500)};xb=function(){l.plotLeft=S=B(S);l.plotTop=L=B(L);l.plotWidth=la=B(qa-S-ka);l.plotHeight=ma=B(ta-L-O);l.plotSizeX=X?ma:la;l.plotSizeY=X?la:ma;R={x:gb,y:C,width:qa-gb-F,height:ta-
C-T};o(va,function(a){a.setAxisSize();a.setAxisTranslation()})};pb=function(){L=p(w,C);ka=p(v,F);O=p(Sa,T);S=p(A,gb);sa=[0,0,0,0]};ob=function(){var a=q.borderWidth||0,b=q.backgroundColor,c=q.plotBackgroundColor,d=q.plotBackgroundImage,e,f={x:S,y:L,width:la,height:ma};e=a+(q.shadow?8:0);if(a||b)Ha?Ha.animate(Ha.crisp(null,null,null,qa-e,ta-e)):Ha=K.rect(e/2,e/2,qa-e,ta-e,q.borderRadius,a).attr({stroke:q.borderColor,"stroke-width":a,fill:b||ga}).add().shadow(q.shadow);c&&(Pa?Pa.animate(f):Pa=K.rect(S,
L,la,ma,0).attr({fill:c}).add().shadow(q.plotShadow));d&&(Xa?Xa.animate(f):Xa=K.image(d,S,L,la,ma).add());q.plotBorderWidth&&(pa?pa.animate(pa.crisp(null,S,L,la,ma)):pa=K.rect(S,L,la,ma,0,q.plotBorderWidth).attr({stroke:q.plotBorderColor,"stroke-width":q.plotBorderWidth,zIndex:4}).add());l.isDirtyBox=!1};q.reflow!==!1&&ja(l,"load",n);if(E)for(Ka in E)ja(l,Ka,E[Ka]);l.options=a;l.series=Y;l.xAxis=[];l.yAxis=[];l.addSeries=function(a,b,c){var d;a&&(Lb(c,l),b=p(b,!0),Z(l,"addSeries",{options:a},function(){d=
f(a);d.isDirty=!0;l.isDirtyLegend=!0;b&&l.redraw()}));return d};l.animation=wa?!1:p(q.animation,!0);l.Axis=c;l.destroy=function(){var b,c=G&&G.parentNode;if(l!==null){Z(l,"destroy");Na(l);for(b=va.length;b--;)va[b]=va[b].destroy();for(b=Y.length;b--;)Y[b]=Y[b].destroy();o("title,subtitle,seriesGroup,clipRect,credits,tracker,scroller,rangeSelector".split(","),function(a){var b=l[a];b&&(l[a]=b.destroy())});o([Ha,pa,Pa,Yb,sb,K,rb],function(a){a&&a.destroy&&a.destroy()});Ha=pa=Pa=Yb=sb=K=rb=null;if(G)G.innerHTML=
"",Na(G),c&&Vb(G),G=null;clearInterval(Cb);for(b in l)delete l[b];a=l=null}};l.get=function(a){var b,c,d;for(b=0;b<va.length;b++)if(va[b].options.id===a)return va[b];for(b=0;b<Y.length;b++)if(Y[b].options.id===a)return Y[b];for(b=0;b<Y.length;b++){d=Y[b].points||[];for(c=0;c<d.length;c++)if(d[c].id===a)return d[c]}return null};l.getSelectedPoints=function(){var a=[];o(Y,function(b){a=a.concat(mc(b.points,function(a){return a.selected}))});return a};l.getSelectedSeries=function(){return mc(Y,function(a){return a.selected})};
l.hideLoading=function(){ub&&ec(ub,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){U(ub,{display:ga})}});Ia=!1};l.initSeries=f;l.isInsidePlot=Eb;l.redraw=h;l.setSize=zb;l.setTitle=j;l.showLoading=function(b){var c=a.loading;ub||(ub=xa(db,{className:Da+"loading"},N(c.style,{left:S+ia,top:L+ia,width:la+ia,height:ma+ia,zIndex:10,display:ga}),G),wb=xa("span",null,c.labelStyle,ub));wb.innerHTML=b||a.lang.loading;Ia||(U(ub,{opacity:0,display:""}),ec(ub,{opacity:c.style.opacity},{duration:c.showDuration||
0}),Ia=!0)};l.pointCount=0;l.counters=new sc;x()}var ba,V=document,ea=window,oa=Math,B=oa.round,Ta=oa.floor,ac=oa.ceil,$=oa.max,Za=oa.min,ya=oa.abs,fa=oa.cos,sa=oa.sin,ab=oa.PI,Bc=ab*2/360,Ha=navigator.userAgent,Sb=/msie/i.test(Ha)&&!ea.opera,wb=V.documentMode===8,Cc=/AppleWebKit/.test(Ha),zc=/Firefox/.test(Ha),Qb=!!V.createElementNS&&!!V.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,Oc=zc&&parseInt(Ha.split("Firefox/")[1],10)<4,wa=!Qb&&!Sb&&!!V.createElement("canvas").getContext,
$b,ra=V.documentElement.ontouchstart!==ba,Dc={},lc=0,pb,Ba,dc,Wb,Ia,C,db="div",tb="absolute",yc="relative",$a="hidden",Da="highcharts-",eb="visible",ia="px",ga="none",ua="M",ha="L",Ec="rgba(192,192,192,"+(Qb?1.0E-6:0.0020)+")",Ga="",Ra="hover",Ab="millisecond",mb="second",Bb="minute",Pa="hour",na="day",Ka="week",Xa="month",za="year",ob,Ib,Tb,ic,Ya,Cb,nb,oc,pc,hc,qc,rc,A=ea.HighchartsAdapter,aa=A||{},Fc=aa.getScript,o=aa.each,mc=aa.grep,xc=aa.offset,Xb=aa.map,M=aa.merge,ja=aa.addEvent,Na=aa.removeEvent,
Z=aa.fireEvent,ec=aa.animate,Pb=aa.stop,Ca={};ea.Highcharts={};dc=function(a,b,c){function d(a,b){a=a.toString().replace(/^([0-9])$/,"0$1");b===3&&(a=a.toString().replace(/^([0-9]{2})$/,"0$1"));return a}if(!y(b)||isNaN(b))return"Invalid date";var a=p(a,"%Y-%m-%d %H:%M:%S"),e=new Date(b),f,g=e[Tb](),h=e[ic](),i=e[Ya](),k=e[Cb](),j=e[nb](),m=Ba.lang,n=m.weekdays,b={a:n[h].substr(0,3),A:n[h],d:d(i),e:i,b:m.shortMonths[k],B:m.months[k],m:d(k+1),y:j.toString().substr(2,2),Y:j,H:d(g),I:d(g%12||12),l:g%
12||12,M:d(e[Ib]()),p:g<12?"AM":"PM",P:g<12?"am":"pm",S:d(e.getSeconds()),L:d(b%1E3,3)};for(f in b)a=a.replace("%"+f,b[f]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};sc.prototype={wrapColor:function(a){if(this.color>=a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};C=Oa(Ab,1,mb,1E3,Bb,6E4,Pa,36E5,na,864E5,Ka,6048E5,Xa,2592E6,za,31556952E3);Ia={init:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),h,i,k=function(a){for(g=
a.length;g--;)a[g]===ua&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(k(b),k(c));a.isArea&&(h=b.splice(b.length-6,6),i=c.splice(c.length-6,6));d===1&&(c=[].concat(c).splice(0,f).concat(c));a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(i));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===b.length&&c<1)for(;f--;)d=parseFloat(a[f]),e[f]=isNaN(d)?a[f]:
c*parseFloat(b[f]-d)+d;else e=b;return e}};A&&A.init&&A.init(Ia);if(!A&&ea.jQuery){var da=jQuery,Fc=da.getScript,o=function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c},mc=da.grep,Xb=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)c[d]=b.call(a[d],a[d],d,a);return c},M=function(){var a=arguments;return da.extend(!0,null,a[0],a[1],a[2],a[3])},xc=function(a){return da(a).offset()},ja=function(a,b,c){da(a).bind(b,c)},Na=function(a,b,c){var d=V.removeEventListener?"removeEventListener":
"detachEvent";V[d]&&!a[d]&&(a[d]=function(){});da(a).unbind(b,c)},Z=function(a,b,c,d){var e=da.Event(b),f="detached"+b,g;N(e,c);a[b]&&(a[f]=a[b],a[b]=null);o(["preventDefault","stopPropagation"],function(a){var b=e[a];e[a]=function(){try{b.call(e)}catch(c){a==="preventDefault"&&(g=!0)}}});da(a).trigger(e);a[f]&&(a[b]=a[f],a[f]=null);d&&!e.isDefaultPrevented()&&!g&&d(e)},ec=function(a,b,c){var d=da(a);if(b.d)a.toD=b.d,b.d=1;d.stop();d.animate(b,c)},Pb=function(a){da(a).stop()};da.extend(da.easing,
{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});var Gc=jQuery.fx,Hc=Gc.step;o(["cur","_default","width","height"],function(a,b){var c=b?Hc:Gc.prototype,d=c[a],e;d&&(c[a]=function(a){a=b?a:this;e=a.elem;return e.attr?e.attr(a.prop,a.now):d.apply(this,arguments)})});Hc.d=function(a){var b=a.elem;if(!a.started){var c=Ia.init(b,b.d,b.toD);a.start=c[0];a.end=c[1];a.started=!0}b.attr("d",Ia.step(a.start,a.end,a.pos,b.toD))}}A={enabled:!0,align:"center",x:0,y:15,style:{color:"#666",fontSize:"11px",
lineHeight:"14px"}};Ba={colors:"#4572A7,#AA4643,#89A54E,#80699B,#3D96AE,#DB843D,#92A8CD,#A47D7C,#B5CA92".split(","),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",resetZoom:"Reset zoom",
resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0,canvasToolsURL:"http://code.highcharts.com/2.2.0/modules/canvas-tools.js"},chart:{borderColor:"#4572A7",borderRadius:5,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacingTop:10,spacingRight:10,spacingBottom:15,spacingLeft:10,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"12px"},backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},
position:{align:"right",x:-10,y:10}}},title:{text:"Chart title",align:"center",y:15,style:{color:"#3E576F",fontSize:"16px"}},subtitle:{text:"",align:"center",y:30,style:{color:"#6D869F"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,shadow:!0,marker:{enabled:!0,lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:M(A,{enabled:!1,y:-6,formatter:function(){return this.y}}),
cropThreshold:300,pointRange:0,showInLegend:!0,states:{hover:{marker:{}},select:{marker:{}}},stickyTracking:!0}},labels:{style:{position:tb,color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderWidth:1,borderColor:"#909090",borderRadius:5,shadow:!1,style:{padding:"5px"},itemStyle:{cursor:"pointer",color:"#3E576F"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#C0C0C0"},itemCheckboxStyle:{position:tb,width:"13px",height:"13px"},
symbolWidth:16,symbolPadding:5,verticalAlign:"bottom",x:0,y:0},loading:{labelStyle:{fontWeight:"bold",position:yc,top:"1em"},style:{position:tb,backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,backgroundColor:"rgba(255, 255, 255, .85)",borderWidth:2,borderRadius:5,headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',shadow:!0,shared:wa,snap:ra?25:10,style:{color:"#333333",
fontSize:"12px",padding:"5px",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"10px"}}};var cc={dateTimeLabelFormats:Oa(Ab,"%H:%M:%S.%L",mb,"%H:%M:%S",Bb,"%H:%M",Pa,"%H:%M",na,"%e. %b",Ka,"%e. %b",Xa,"%b '%y",za,"%Y"),endOnTick:!1,gridLineColor:"#C0C0C0",labels:A,lineColor:"#C0D0E0",lineWidth:1,max:null,min:null,minPadding:0.01,maxPadding:0.01,
minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:5,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#6D869F",fontWeight:"bold"}},type:"linear"},kc=M(cc,{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{align:"right",x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,
tickWidth:0,title:{rotation:270,text:"Y-values"},stackLabels:{enabled:!1,formatter:function(){return this.total},style:A.style}}),Nc={labels:{align:"right",x:-8,y:null},title:{rotation:270}},Mc={labels:{align:"left",x:8,y:null},title:{rotation:90}},wc={labels:{align:"center",x:0,y:14},title:{rotation:0}},Lc=M(wc,{labels:{y:-5}}),ka=Ba.plotOptions,A=ka.line;ka.spline=M(A);ka.scatter=M(A,{lineWidth:0,states:{hover:{lineWidth:0}},tooltip:{headerFormat:'<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',
pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}});ka.area=M(A,{threshold:0});ka.areaspline=M(ka.area);ka.column=M(A,{borderColor:"#FFFFFF",borderWidth:1,borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}},dataLabels:{y:null,verticalAlign:null},threshold:0});ka.bar=M(ka.column,{dataLabels:{align:"left",x:5,y:0}});ka.pie=M(A,{borderColor:"#FFFFFF",
borderWidth:1,center:["50%","50%"],colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return this.point.name},y:5},legendType:"point",marker:null,size:"75%",showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}}});uc();var bb=function(a){var b=[],c;(function(a){(c=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a))?b=[Q(c[1]),Q(c[2]),Q(c[3]),parseFloat(c[4],10)]:(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a))&&
(b=[Q(c[1],16),Q(c[2],16),Q(c[3],16),1])})(a);return{get:function(c){return b&&!isNaN(b[0])?c==="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":c==="a"?b[3]:"rgba("+b.join(",")+")":a},brighten:function(a){if(Ja(a)&&a!==0){var c;for(c=0;c<3;c++)b[c]+=Q(a*255),b[c]<0&&(b[c]=0),b[c]>255&&(b[c]=255)}return this},setOpacity:function(a){b[3]=a;return this}}};pa.prototype={init:function(a,b){this.element=b==="span"?xa(b):V.createElementNS("http://www.w3.org/2000/svg",b);this.renderer=a;this.attrSetters={}},animate:function(a,
b,c){b=p(b,Wb,!0);Pb(this);if(b){b=M(b);if(c)b.complete=c;ec(this,a,b)}else this.attr(a),c&&c()},attr:function(a,b){var c,d,e,f,g=this.element,h=g.nodeName,i=this.renderer,k,j=this.attrSetters,m=this.shadows,n,o=this;yb(a)&&y(b)&&(c=a,a={},a[c]=b);if(yb(a))c=a,h==="circle"?c={x:"cx",y:"cy"}[c]||c:c==="strokeWidth"&&(c="stroke-width"),o=r(g,c)||this[c]||0,c!=="d"&&c!=="visibility"&&(o=parseFloat(o));else for(c in a)if(k=!1,d=a[c],e=j[c]&&j[c](d,c),e!==!1){e!==ba&&(d=e);if(c==="d")d&&d.join&&(d=d.join(" ")),
/(NaN| {2}|^$)/.test(d)&&(d="M 0 0"),this.d=d;else if(c==="x"&&h==="text"){for(e=0;e<g.childNodes.length;e++)f=g.childNodes[e],r(f,"x")===r(g,"x")&&r(f,"x",d);this.rotation&&r(g,"transform","rotate("+this.rotation+" "+d+" "+Q(a.y||r(g,"y"))+")")}else if(c==="fill")d=i.color(d,g,c);else if(h==="circle"&&(c==="x"||c==="y"))c={x:"cx",y:"cy"}[c]||c;else if(h==="rect"&&c==="r")r(g,{rx:d,ry:d}),k=!0;else if(c==="translateX"||c==="translateY"||c==="rotation"||c==="verticalAlign")this[c]=d,this.updateTransform(),
k=!0;else if(c==="stroke")d=i.color(d,g,c);else if(c==="dashstyle")if(c="stroke-dasharray",d=d&&d.toLowerCase(),d==="solid")d=ga;else{if(d){d=d.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(e=d.length;e--;)d[e]=Q(d[e])*a["stroke-width"];d=d.join(",")}}else c==="isTracker"?this[c]=d:c==="width"?d=Q(d):c==="align"?
(c="text-anchor",d={left:"start",center:"middle",right:"end"}[d]):c==="title"&&(e=V.createElementNS("http://www.w3.org/2000/svg","title"),e.appendChild(V.createTextNode(d)),g.appendChild(e));c==="strokeWidth"&&(c="stroke-width");Cc&&c==="stroke-width"&&d===0&&(d=1.0E-6);this.symbolName&&/^(x|y|r|start|end|innerR|anchorX|anchorY)/.test(c)&&(n||(this.symbolAttr(a),n=!0),k=!0);if(m&&/^(width|height|visibility|x|y|d|transform)$/.test(c))for(e=m.length;e--;)r(m[e],c,d);if((c==="width"||c==="height")&&
h==="rect"&&d<0)d=0;c==="text"?(this.textStr=d,this.added&&i.buildText(this)):k||r(g,c,d)}if(Cc&&/Chrome\/(18|19)/.test(Ha)&&h==="text"&&(a.x!==ba||a.y!==ba))c=g.parentNode,d=g.nextSibling,c&&(c.removeChild(g),d?c.insertBefore(g,d):c.appendChild(g));return o},symbolAttr:function(a){var b=this;o("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=p(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",
"url("+this.renderer.url+"#"+a.id+")")},crisp:function(a,b,c,d,e){var f,g={},h={},i,a=a||this.strokeWidth||this.attr&&this.attr("stroke-width")||0;i=B(a)%2/2;h.x=Ta(b||this.x||0)+i;h.y=Ta(c||this.y||0)+i;h.width=Ta((d||this.width||0)-2*i);h.height=Ta((e||this.height||0)-2*i);h.strokeWidth=a;for(f in h)this[f]!==h[f]&&(this[f]=g[f]=h[f]);return g},css:function(a){var b=this.element,b=a&&a.width&&b.nodeName==="text",c,d="",e=function(a,b){return"-"+b.toLowerCase()};if(a&&a.color)a.fill=a.color;this.styles=
a=N(this.styles,a);if(Sb&&!Qb)b&&delete a.width,U(this.element,a);else{for(c in a)d+=c.replace(/([A-Z])/g,e)+":"+a[c]+";";this.attr({style:d})}b&&this.added&&this.renderer.buildText(this);return this},on:function(a,b){var c=b;ra&&a==="click"&&(a="touchstart",c=function(a){a.preventDefault();b()});this.element["on"+a]=c;return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},htmlCss:function(a){var b=
this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();this.styles=N(this.styles,a);U(this.element,a);return this},htmlGetBBox:function(a){var b=this.element,c=this.bBox;if(!c||a){if(b.nodeName==="text")b.style.position=tb;c=this.bBox={x:b.offsetLeft,y:b.offsetTop,width:b.offsetWidth,height:b.offsetHeight}}return c},htmlUpdateTransform:function(){if(this.added){var a=this,b=a.element,c=a.translateX||0,d=a.translateY||0,e=a.x||0,f=a.y||0,g=a.textAlign||
"left",h={left:0,center:0.5,right:1}[g],i=g&&g!=="left",k=a.shadows;if(c||d)U(b,{marginLeft:c,marginTop:d}),k&&o(k,function(a){U(a,{marginLeft:c+1,marginTop:d+1})});a.inverted&&o(b.childNodes,function(c){a.renderer.invertChild(c,b)});if(b.tagName==="SPAN"){var j,m,k=a.rotation,n;j=0;var u=1,t=0,D;n=Q(a.textWidth);var x=a.xCorr||0,E=a.yCorr||0,q=[k,g,b.innerHTML,a.textWidth].join(",");if(q!==a.cTT)y(k)&&(j=k*Bc,u=fa(j),t=sa(j),U(b,{filter:k?["progid:DXImageTransform.Microsoft.Matrix(M11=",u,", M12=",
-t,", M21=",t,", M22=",u,", sizingMethod='auto expand')"].join(""):ga})),j=p(a.elemWidth,b.offsetWidth),m=p(a.elemHeight,b.offsetHeight),j>n&&(U(b,{width:n+ia,display:"block",whiteSpace:"normal"}),j=n),n=B((Q(b.style.fontSize)||12)*1.2),x=u<0&&-j,E=t<0&&-m,D=u*t<0,x+=t*n*(D?1-h:h),E-=u*n*(k?D?h:1-h:1),i&&(x-=j*h*(u<0?-1:1),k&&(E-=m*h*(t<0?-1:1)),U(b,{textAlign:g})),a.xCorr=x,a.yCorr=E;U(b,{left:e+x+ia,top:f+E+ia});a.cTT=q}}else this.alignOnAdd=!0},updateTransform:function(){var a=this.translateX||
0,b=this.translateY||0,c=this.inverted,d=this.rotation,e=[];c&&(a+=this.attr("width"),b+=this.attr("height"));(a||b)&&e.push("translate("+a+","+b+")");c?e.push("rotate(90) scale(-1,1)"):d&&e.push("rotate("+d+" "+this.x+" "+this.y+")");e.length&&r(this.element,"transform",e.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){a?(this.alignOptions=a,this.alignByTranslate=b,c||this.renderer.alignedObjects.push(this)):(a=this.alignOptions,b=
this.alignByTranslate);var c=p(c,this.renderer),d=a.align,e=a.verticalAlign,f=(c.x||0)+(a.x||0),g=(c.y||0)+(a.y||0),h={};/^(right|center)$/.test(d)&&(f+=(c.width-(a.width||0))/{right:1,center:2}[d]);h[b?"translateX":"x"]=B(f);/^(bottom|middle)$/.test(e)&&(g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1));h[b?"translateY":"y"]=B(g);this[this.placed?"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(a){var b,c,d=this.rotation;c=this.element;var e=d*Bc;if(c.namespaceURI===
"http://www.w3.org/2000/svg"){try{b=c.getBBox?N({},c.getBBox()):{width:c.offsetWidth,height:c.offsetHeight}}catch(f){}if(!b||b.width<0)b={width:0,height:0};a=b.width;c=b.height;if(d)b.width=ya(c*sa(e))+ya(a*fa(e)),b.height=ya(c*fa(e))+ya(a*sa(e))}else b=this.htmlGetBBox(a);return b},show:function(){return this.attr({visibility:eb})},hide:function(){return this.attr({visibility:$a})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=d.childNodes,f=this.element,g=r(f,"zIndex"),h;this.parentInverted=
a&&a.inverted;this.textStr!==void 0&&b.buildText(this);if(g)c.handleZ=!0,g=Q(g);if(c.handleZ)for(c=0;c<e.length;c++)if(a=e[c],b=r(a,"zIndex"),a!==f&&(Q(b)>g||!y(g)&&y(b))){d.insertBefore(f,a);h=!0;break}h||d.appendChild(f);this.added=!0;Z(this,"add");return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.box,e,f;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=null;Pb(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();
if(a.stops){for(f=0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);c&&o(c,function(b){a.safeRemoveChild(b)});d&&d.destroy();Gb(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},empty:function(){for(var a=this.element,b=a.childNodes,c=b.length;c--;)a.removeChild(b[c])},shadow:function(a,b){var c=[],d,e,f=this.element,g=this.parentInverted?"(-1,-1)":"(1,1)";if(a){for(d=1;d<=3;d++)e=f.cloneNode(0),r(e,{isShadow:"true",stroke:"rgb(0, 0, 0)","stroke-opacity":0.05*
d,"stroke-width":7-2*d,transform:"translate"+g,fill:ga}),b?b.element.appendChild(e):f.parentNode.insertBefore(e,f),c.push(e);this.shadows=c}return this}};var Fb=function(){this.init.apply(this,arguments)};Fb.prototype={Element:pa,init:function(a,b,c,d){var e=location,f;f=this.createElement("svg").attr({xmlns:"http://www.w3.org/2000/svg",version:"1.1"});a.appendChild(f.element);this.isSVG=!0;this.box=f.element;this.boxWrapper=f;this.alignedObjects=[];this.url=Sb?"":e.href.replace(/#.*?$/,"").replace(/\(/g,
"\\(").replace(/\)/g,"\\)");this.defs=this.createElement("defs").add();this.forExport=d;this.gradients={};this.setSize(b,c,!1)},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Kb(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,a);return b},draw:function(){},buildText:function(a){for(var b=a.element,c=p(a.textStr,"").toString().replace(/<(b|strong)>/g,
'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g),d=b.childNodes,e=/style="([^"]+)"/,f=/href="([^"]+)"/,g=r(b,"x"),h=a.styles,i=h&&Q(h.width),k=h&&h.lineHeight,j,h=d.length;h--;)b.removeChild(d[h]);i&&!a.added&&this.box.appendChild(b);c[c.length-1]===""&&c.pop();o(c,function(c,d){var h,t=0,p,c=c.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");h=c.split("|||");
o(h,function(c){if(c!==""||h.length===1){var m={},o=V.createElementNS("http://www.w3.org/2000/svg","tspan");e.test(c)&&r(o,"style",c.match(e)[1].replace(/(;| |^)color([ :])/,"$1fill$2"));f.test(c)&&(r(o,"onclick",'location.href="'+c.match(f)[1]+'"'),U(o,{cursor:"pointer"}));c=(c.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,">");o.appendChild(V.createTextNode(c));t?m.dx=3:m.x=g;if(!t){if(d){!Qb&&a.renderer.forExport&&U(o,{display:"block"});p=ea.getComputedStyle&&Q(ea.getComputedStyle(j,
null).getPropertyValue("line-height"));if(!p||isNaN(p))p=k||j.offsetHeight||18;r(o,"dy",p)}j=o}r(o,m);b.appendChild(o);t++;if(i)for(var c=c.replace(/-/g,"- ").split(" "),w,v=[];c.length||v.length;)w=a.getBBox().width,m=w>i,!m||c.length===1?(c=v,v=[],c.length&&(o=V.createElementNS("http://www.w3.org/2000/svg","tspan"),r(o,{dy:k||16,x:g}),b.appendChild(o),w>i&&(i=w))):(o.removeChild(o.firstChild),v.unshift(c.pop())),c.length&&o.appendChild(V.createTextNode(c.join(" ").replace(/- /g,"-")))}})})},button:function(a,
b,c,d,e,f,g){var h=this.label(a,b,c),i=0,k,j,m,n,o,a={x1:0,y1:0,x2:0,y2:1},e=M(Oa("stroke-width",1,"stroke","#999","fill",Oa("linearGradient",a,"stops",[[0,"#FFF"],[1,"#DDD"]]),"r",3,"padding",3,"style",Oa("color","black")),e);m=e.style;delete e.style;f=M(e,Oa("stroke","#68A","fill",Oa("linearGradient",a,"stops",[[0,"#FFF"],[1,"#ACF"]])),f);n=f.style;delete f.style;g=M(e,Oa("stroke","#68A","fill",Oa("linearGradient",a,"stops",[[0,"#9BD"],[1,"#CDF"]])),g);o=g.style;delete g.style;ja(h.element,"mouseenter",
function(){h.attr(f).css(n)});ja(h.element,"mouseleave",function(){k=[e,f,g][i];j=[m,n,o][i];h.attr(k).css(j)});h.setState=function(a){(i=a)?a===2&&h.attr(g).css(o):h.attr(e).css(m)};return h.on("click",function(){d.call(h)}).attr(e).css(N({cursor:"default"},m))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=B(a[1])+b%2/2);a[2]===a[5]&&(a[2]=a[5]=B(a[2])+b%2/2);return a},path:function(a){return this.createElement("path").attr({d:a,fill:ga})},circle:function(a,b,c){a=kb(a)?a:{x:a,y:b,r:c};return this.createElement("circle").attr(a)},
arc:function(a,b,c,d,e,f){if(kb(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;return this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0})},rect:function(a,b,c,d,e,f){if(kb(a))b=a.y,c=a.width,d=a.height,e=a.r,f=a.strokeWidth,a=a.x;e=this.createElement("rect").attr({rx:e,ry:e,fill:ga});return e.attr(e.crisp(f,a,b,$(c,0),$(d,0)))},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[p(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},
g:function(a){var b=this.createElement("g");return y(a)?b.attr({"class":Da+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:ga};arguments.length>1&&N(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(B(b),B(c),d,e,f),i=/^url\((.*?)\)$/,k;if(h)g=this.path(h),N(g,{symbolName:a,
x:b,y:c,width:d,height:e}),f&&N(g,f);else if(i.test(a)){var j=function(a,b){a.attr({width:b[0],height:b[1]}).translate(-B(b[0]/2),-B(b[1]/2))};k=a.match(i)[1];a=Dc[k];g=this.image(k).attr({x:b,y:c});a?j(g,a):(g.attr({width:0,height:0}),xa("img",{onload:function(){j(g,Dc[k]=[this.width,this.height])},src:k}))}return g},symbols:{circle:function(a,b,c,d){var e=0.166*c;return[ua,a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return[ua,a,b,ha,a+c,b,a+c,
b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return[ua,a+c/2,b,ha,a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return[ua,a,b,ha,a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return[ua,a+c/2,b,ha,a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-1.0E-6,d=e.innerR,h=fa(f),i=sa(f),k=fa(g),g=sa(g),e=e.end-f<ab?0:1;return[ua,a+c*h,b+c*i,"A",c,c,0,e,1,a+c*k,b+c*g,ha,a+d*k,b+d*g,"A",d,d,0,e,0,a+d*h,b+d*i,"Z"]}},clipRect:function(a,b,c,d){var e=Da+lc++,f=
this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},color:function(a,b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f=this,g=a.linearGradient,b=!zb(g),c=f.gradients,h,i=g.x1||g[0]||0,k=g.y1||g[1]||0,j=g.x2||g[2]||0,m=g.y2||g[3]||0,n,u,t=[b,i,k,j,m,a.stops.join(",")].join(",");c[t]?g=r(c[t].element,"id"):(g=Da+lc++,h=f.createElement("linearGradient").attr(N({id:g,x1:i,y1:k,x2:j,y2:m},b?null:{gradientUnits:"userSpaceOnUse"})).add(f.defs),
h.stops=[],o(a.stops,function(a){e.test(a[1])?(d=bb(a[1]),n=d.get("rgb"),u=d.get("a")):(n=a[1],u=1);a=f.createElement("stop").attr({offset:a[0],"stop-color":n,"stop-opacity":u}).add(h);h.stops.push(a)}),c[t]=h);return"url("+this.url+"#"+g+")"}else return e.test(a)?(d=bb(a),r(b,c+"-opacity",d.get("a")),d.get("rgb")):(b.removeAttribute(c+"-opacity"),a)},text:function(a,b,c,d){var e=Ba.chart.style;if(d&&!this.forExport)return this.html(a,b,c);b=B(p(b,0));c=B(p(c,0));a=this.createElement("text").attr({x:b,
y:c,text:a}).css({fontFamily:e.fontFamily,fontSize:e.fontSize});a.x=b;a.y=c;return a},html:function(a,b,c){var d=Ba.chart.style,e=this.createElement("span"),f=e.attrSetters,g=e.element,h=e.renderer;f.text=function(a){g.innerHTML=a;return!1};f.x=f.y=f.align=function(a,b){b==="align"&&(b="textAlign");e[b]=a;e.htmlUpdateTransform();return!1};e.attr({text:a,x:B(b),y:B(c)}).css({position:tb,whiteSpace:"nowrap",fontFamily:d.fontFamily,fontSize:d.fontSize});e.css=e.htmlCss;if(h.isSVG)e.add=function(a){var b,
c,d=h.box.parentNode;if(a){if(b=a.div,!b)b=a.div=xa(db,{className:r(a.element,"class")},{position:tb,left:a.attr("translateX")+ia,top:a.attr("translateY")+ia},d),c=b.style,N(a.attrSetters,{translateX:function(a){c.left=a+ia},translateY:function(a){c.top=a+ia},visibility:function(a,b){c[b]=a}})}else b=d;b.appendChild(g);e.added=!0;e.alignOnAdd&&e.htmlUpdateTransform();return e};return e},label:function(a,b,c,d,e,f,g){function h(){var a=m.styles,a=a&&a.textAlign,b=x,c=m.element.style,c=x+B(Q(c&&c.fontSize||
11)*1.2);if(y(E)&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(E-t.width);(b!==n.x||c!==n.y)&&n.attr({x:b,y:c});n.x=b;n.y=c}function i(a,b){u?u.attr(a,b):r[a]=b}function k(){m.attr({text:a,x:b,y:c,anchorX:e,anchorY:f})}var j=this,m=j.g(),n=j.text("",0,0,g).attr({zIndex:1}).add(m),u,t,p="left",x=3,E,q,w,v,Sa=0,r={},g=m.attrSetters;ja(m,"add",k);g.width=function(a){E=a;return!1};g.height=function(a){q=a;return!1};g.padding=function(a){x=a;h();return!1};g.align=function(a){p=a;return!1};g.text=
function(a,b){n.attr(b,a);t=(E===void 0||q===void 0||m.styles.textAlign)&&n.getBBox(!0);m.width=(E||t.width)+2*x;m.height=(q||t.height)+2*x;if(!u)m.box=u=d?j.symbol(d,0,0,m.width,m.height):j.rect(0,0,m.width,m.height,0,r["stroke-width"]),u.add(m);u.attr(M({width:m.width,height:m.height},r));r=null;h();return!1};g["stroke-width"]=function(a,b){Sa=a%2/2;i(b,a);return!1};g.stroke=g.fill=g.r=function(a,b){i(b,a);return!1};g.anchorX=function(a,b){e=a;i(b,a+Sa-w);return!1};g.anchorY=function(a,b){f=a;i(b,
a-v);return!1};g.x=function(a){w=a;w-={left:0,center:0.5,right:1}[p]*((E||t.width)+x);m.attr("translateX",B(w));return!1};g.y=function(a){v=a;m.attr("translateY",B(a));return!1};var A=m.css;return N(m,{css:function(a){if(a){var b={},a=M({},a);o("fontSize,fontWeight,fontFamily,color,lineHeight,width".split(","),function(c){a[c]!==ba&&(b[c]=a[c],delete a[c])});n.css(b)}return A.call(m,a)},getBBox:function(){return u.getBBox()},shadow:function(a){u.shadow(a);return m},destroy:function(){Na(m,"add",k);
Na(m.element,"mouseenter");Na(m.element,"mouseleave");n&&(n=n.destroy());pa.prototype.destroy.call(m)}})}};$b=Fb;var Wa;if(!Qb&&!wa)A={Element:O(pa,{init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ",tb,";"];(b==="shape"||b===db)&&d.push("left:0;top:0;width:10px;height:10px;");wb&&d.push("visibility: ",b===db?$a:eb);c.push(' style="',d.join(""),'"/>');if(b)c=b===db||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=xa(c);this.renderer=a;this.attrSetters={}},add:function(a){var b=
this.renderer,c=this.element,d=b.box,d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);wb&&d.gVis===$a&&U(c,{visibility:$a});d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.htmlUpdateTransform();Z(this,"add");return this},toggleChildren:function(a,b){for(var c=a.childNodes,d=c.length;d--;)U(c[d],{visibility:b}),c[d].nodeName==="DIV"&&this.toggleChildren(c[d],b)},attr:function(a,b){var c,d,e,f=this.element||{},g=f.style,h=f.nodeName,i=this.renderer,k=this.symbolName,
j,m=this.shadows,n,o=this.attrSetters,p=this;yb(a)&&y(b)&&(c=a,a={},a[c]=b);if(yb(a))c=a,p=c==="strokeWidth"||c==="stroke-width"?this.strokeweight:this[c];else for(c in a)if(d=a[c],n=!1,e=o[c]&&o[c](d,c),e!==!1&&d!==null){e!==ba&&(d=e);if(k&&/^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(c))j||(this.symbolAttr(a),j=!0),n=!0;else if(c==="d"){d=d||[];this.d=d.join(" ");e=d.length;for(n=[];e--;)n[e]=Ja(d[e])?B(d[e]*10)-5:d[e]==="Z"?"x":d[e];d=n.join(" ")||"x";f.path=d;if(m)for(e=m.length;e--;)m[e].path=
d;n=!0}else if(c==="zIndex"||c==="visibility"){if(wb&&c==="visibility"&&h==="DIV")f.gVis=d,this.toggleChildren(f,d),d===eb&&(d=null);d&&(g[c]=d);n=!0}else if(c==="width"||c==="height")d=$(0,d),this[c]=d,this.updateClipping?(this[c]=d,this.updateClipping()):g[c]=d,n=!0;else if(c==="x"||c==="y")this[c]=d,g[{x:"left",y:"top"}[c]]=d;else if(c==="class")f.className=d;else if(c==="stroke")d=i.color(d,f,c),c="strokecolor";else if(c==="stroke-width"||c==="strokeWidth")f.stroked=d?!0:!1,c="strokeweight",this[c]=
d,Ja(d)&&(d+=ia);else if(c==="dashstyle")(f.getElementsByTagName("stroke")[0]||xa(i.prepVML(["<stroke/>"]),null,null,f))[c]=d||"solid",this.dashstyle=d,n=!0;else if(c==="fill")h==="SPAN"?g.color=d:(f.filled=d!==ga?!0:!1,d=i.color(d,f,c),c="fillcolor");else if(c==="translateX"||c==="translateY"||c==="rotation")this[c]=d,this.htmlUpdateTransform(),n=!0;else if(c==="text")this.bBox=null,f.innerHTML=d,n=!0;if(m&&c==="visibility")for(e=m.length;e--;)m[e].style[c]=d;n||(wb?f[c]=d:r(f,c,d))}return p},clip:function(a){var b=
this,c=a.members;c.push(b);b.destroyClip=function(){Gb(c,b)};return b.css(a.getCSS(b.inverted))},css:pa.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&Vb(a)},destroy:function(){this.destroyClip&&this.destroyClip();return pa.prototype.destroy.apply(this)},empty:function(){for(var a=this.element.childNodes,b=a.length,c;b--;)c=a[b],c.parentNode.removeChild(c)},on:function(a,b){this.element["on"+a]=function(){var a=ea.event;a.target=a.srcElement;b(a)};return this},shadow:function(a,b){var c=
[],d,e=this.element,f=this.renderer,g,h=e.style,i,k=e.path;k&&typeof k.value!=="string"&&(k="x");if(a){for(d=1;d<=3;d++)i=['<shape isShadow="true" strokeweight="',7-2*d,'" filled="false" path="',k,'" coordsize="100,100" style="',e.style.cssText,'" />'],g=xa(f.prepVML(i),null,{left:Q(h.left)+1,top:Q(h.top)+1}),i=['<stroke color="black" opacity="',0.05*d,'"/>'],xa(f.prepVML(i),null,null,g),b?b.element.appendChild(g):e.parentNode.insertBefore(g,e),c.push(g);this.shadows=c}return this}}),isIE8:Ha.indexOf("MSIE 8.0")>
-1,init:function(a,b,c){var d;this.alignedObjects=[];d=this.createElement(db);a.appendChild(d.element);this.box=d.element;this.boxWrapper=d;this.setSize(b,c,!1);if(!V.namespaces.hcv)V.namespaces.add("hcv","urn:schemas-microsoft-com:vml"),V.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "},clipRect:function(a,b,c,d){var e=this.createElement();return N(e,{members:[],left:a,top:b,width:c,height:d,getCSS:function(a){var b=
this.top,c=this.left,d=c+this.width,e=b+this.height,b={clip:"rect("+B(a?c:b)+"px,"+B(a?e:d)+"px,"+B(a?d:e)+"px,"+B(a?b:c)+"px)"};!a&&wb&&N(b,{width:d+ia,height:e+ia});return b},updateClipping:function(){o(e.members,function(a){a.css(e.getCSS(a.inverted))})}})},color:function(a,b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f,g,h=a.linearGradient,i=h.x1||h[0]||0,k=h.y1||h[1]||0,j=h.x2||h[2]||0,h=h.y2||h[3]||0,m,n,p,t;o(a.stops,function(a,b){e.test(a[1])?(d=bb(a[1]),f=d.get("rgb"),g=d.get("a")):(f=
a[1],g=1);b?(p=f,t=g):(m=f,n=g)});if(c==="fill")a=90-oa.atan((h-k)/(j-i))*180/ab,a=['<fill colors="0% ',m,",100% ",p,'" angle="',a,'" opacity="',t,'" o:opacity2="',n,'" type="gradient" focus="100%" method="any" />'],xa(this.prepVML(a),null,null,b);else return f}else if(e.test(a)&&b.tagName!=="IMG")return d=bb(a),a=["<",c,' opacity="',d.get("a"),'"/>'],xa(this.prepVML(a),null,null,b),d.get("rgb");else{b=b.getElementsByTagName(c);if(b.length)b[0].opacity=1;return a}},prepVML:function(a){var b=this.isIE8,
a=a.join("");b?(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:Fb.prototype.html,path:function(a){return this.createElement("shape").attr({coordsize:"100 100",d:a})},circle:function(a,b,c){return this.symbol("circle").attr({x:a-c,y:b-c,width:2*c,height:2*c})},
g:function(a){var b;a&&(b={className:Da+a,"class":Da+a});return this.createElement(db).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.css({left:b,top:c,width:d,height:e});return f},rect:function(a,b,c,d,e,f){if(kb(a))b=a.y,c=a.width,d=a.height,f=a.strokeWidth,a=a.x;var g=this.symbol("rect");g.r=e;return g.attr(g.crisp(f,a,b,$(c,0),$(d,0)))},invertChild:function(a,b){var c=b.style;U(a,{flip:"x",left:Q(c.width)-10,top:Q(c.height)-10,rotation:-90})},
symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,c=e.r||c||d,d=fa(f),h=sa(f),i=fa(g),k=sa(g),e=e.innerR,j=0.07/c,m=e&&0.1/e||0;if(g-f===0)return["x"];else 2*ab-g+f<j?i=-j:g-f<m&&(i=fa(f+m));return["wa",a-c,b-c,a+c,b+c,a+c*d,b+c*h,a+c*i,b+c*k,"at",a-e,b-e,a+e,b+e,a+e*i,b+e*k,a+e*d,b+e*h,"x","e"]},circle:function(a,b,c,d){return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,b+d/2,"e"]},rect:function(a,b,c,d,e){if(!y(e))return[];var f=a+c,g=b+d,c=Za(e.r||0,c,d);return[ua,a+c,b,ha,f-c,b,"wa",f-2*c,b,f,b+2*c,f-
c,b,f,b+c,ha,f,g-c,"wa",f-2*c,g-2*c,f,g,f,g-c,f-c,g,ha,a+c,g,"wa",a,g-2*c,a+2*c,g,a+c,g,a,g-c,ha,a,b+c,"wa",a,b,a+2*c,b+2*c,a,b+c,a+c,b,"x","e"]}}},Wa=function(){this.init.apply(this,arguments)},Wa.prototype=M(Fb.prototype,A),$b=Wa;var nc,Ac;wa&&(nc=function(){},Ac=function(){function a(){var a=b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,d){b.length===0&&Fc(d,a);b.push(c)}}}());$b=Wa||nc||Fb;vc.prototype.callbacks=[];var Aa=function(){};Aa.prototype={init:function(a,b,c){var d=
a.chart.counters;this.series=a;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint){b=a.chart.options.colors;if(!this.options)this.options={};this.color=this.options.color=this.color||b[d.color++];d.wrapColor(b.length)}a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=typeof a;this.config=a;if(d==="number"||a===null)this.y=a;else if(typeof a[0]==="number")this.x=a[0],this.y=a[1];else if(d==="object"&&typeof a.length!=="number"){if(N(this,a),this.options=
a,a.dataLabels)c._hasPointLabels=!0}else if(typeof a[0]==="string")this.name=a[0],this.y=a[1];if(this.x===ba)this.x=b===ba?c.autoIncrement():b},destroy:function(){var a=this.series,b=a.chart.hoverPoints,c;a.chart.pointCount--;b&&(this.setState(),Gb(b,this));if(this===a.chart.hoverPoint)this.onMouseOut();a.chart.hoverPoints=null;if(this.graphic||this.dataLabel)Na(this),this.destroyElements();this.legendItem&&this.series.chart.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a=
"graphic,tracker,dataLabel,group,connector,shadowGroup".split(","),b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},select:function(a,b){var c=this,d=c.series.chart,a=p(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=a;c.setState(a&&"select");b||o(d.getSelectedPoints(),function(a){if(a.selected&&
a!==c)a.selected=!1,a.setState(Ga),a.firePointEvent("unselect")})})},onMouseOver:function(){var a=this.series,b=a.chart,c=b.tooltip,d=b.hoverPoint;if(d&&d!==this)d.onMouseOut();this.firePointEvent("mouseOver");c&&(!c.shared||a.noSharedTooltip)&&c.refresh(this);this.setState(Ra);b.hoverPoint=this},onMouseOut:function(){this.firePointEvent("mouseOut");this.setState();this.series.chart.hoverPoint=null},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=String(this.y).split("."),d=d[1]?
d[1].length:0,e=a.match(/\{(series|point)\.[a-zA-Z]+\}/g),f=/[\.}]/,g,h,i;for(i in e)h=e[i],yb(h)&&h!==a&&(g=h.indexOf("point")===1?this:b,g=h==="{point.y}"?(c.valuePrefix||c.yPrefix||"")+fc(this.y,p(c.valueDecimals,c.yDecimals,d))+(c.valueSuffix||c.ySuffix||""):g[e[i].split(f)[1]],a=a.replace(e[i],g));return a},update:function(a,b,c){var d=this,e=d.series,f=d.graphic,g,h=e.data,i=h.length,k=e.chart,b=p(b,!0);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);kb(a)&&(e.getAttribs(),
f&&f.attr(d.pointAttr[e.state]));for(g=0;g<i;g++)if(h[g]===d){e.xData[g]=d.x;e.yData[g]=d.y;e.options.data[g]=a;break}e.isDirty=!0;e.isDirtyData=!0;b&&k.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.chart,f,g=d.data,h=g.length;Lb(b,e);a=p(a,!0);c.firePointEvent("remove",null,function(){for(f=0;f<h;f++)if(g[f]===c){g.splice(f,1);d.options.data.splice(f,1);d.xData.splice(f,1);d.yData.splice(f,1);break}c.destroy();d.isDirty=!0;d.isDirtyData=!0;a&&e.redraw()})},firePointEvent:function(a,
b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});Z(this,a,b,c)},importEvents:function(){if(!this.hasImportedEvents){var a=M(this.series.options.point,this.options).events,b;this.events=a;for(b in a)ja(this,b,a[b]);this.hasImportedEvents=!0}},setState:function(a){var b=this.plotX,c=this.plotY,d=this.series,e=d.options.states,
f=ka[d.type].marker&&d.options.marker,g=f&&!f.enabled,h=f&&f.states[a],i=h&&h.enabled===!1,k=d.stateMarkerGraphic,j=d.chart,m=this.pointAttr,a=a||Ga;if(!(a===this.state||this.selected&&a!=="select"||e[a]&&e[a].enabled===!1||a&&(i||g&&!h.enabled))){if(this.graphic)e=this.graphic.symbolName&&m[a].r,this.graphic.attr(M(m[a],e?{x:b-e,y:c-e,width:2*e,height:2*e}:{}));else{if(a){if(!k)e=f.radius,d.stateMarkerGraphic=k=j.renderer.symbol(d.symbol,-e,-e,2*e,2*e).attr(m[a]).add(d.group);k.translate(b,c)}if(k)k[a?
"show":"hide"]()}this.state=a}}};var R=function(){};R.prototype={isCartesian:!0,type:"line",pointClass:Aa,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},init:function(a,b){var c,d;d=a.series.length;this.chart=a;this.options=b=this.setOptions(b);this.bindAxes();N(this,{index:d,name:b.name||"Series "+(d+1),state:Ga,pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(wa)b.animation=!1;d=b.events;for(c in d)ja(this,c,d[c]);if(d&&d.click||b.point&&
b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;this.getColor();this.getSymbol();this.setData(b.data,!1)},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;a.isCartesian&&o(["xAxis","yAxis"],function(e){o(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]===ba&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0})})},autoIncrement:function(){var a=this.options,b=this.xIncrement,b=p(b,a.pointStart,0);this.pointInterval=p(this.pointInterval,a.pointInterval,1);this.xIncrement=
b+this.pointInterval;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=e;c--;)d[c].y===null&&d.splice(c,1);b=[d]}else o(d,function(c,g){c.y===null?(g>a+1&&b.push(d.slice(a+1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart.options,c=b.plotOptions,d=a.data;a.data=null;c=M(c[this.type],c.series,a);c.data=a.data=d;this.tooltipOptions=M(b.tooltip,c.tooltip);return c},getColor:function(){var a=
this.chart.options.colors,b=this.chart.counters;this.color=this.options.color||a[b.color++]||"#0000ff";b.wrapColor(a.length)},getSymbol:function(){var a=this.options.marker,b=this.chart,c=b.options.symbols,b=b.counters;this.symbol=a.symbol||c[b.symbol++];if(/^url/.test(this.symbol))a.radius=0;b.wrapSymbol(c.length)},addPoint:function(a,b,c,d){var e=this.data,f=this.graph,g=this.area,h=this.chart,i=this.xData,k=this.yData,j=f&&f.shift||0,m=this.options.data;Lb(d,h);if(f&&c)f.shift=j+1;if(g)g.shift=
j+1,g.isArea=!0;b=p(b,!0);d={series:this};this.pointClass.prototype.applyOptions.apply(d,[a]);i.push(d.x);k.push(this.valueCount===4?[d.open,d.high,d.low,d.close]:d.y);m.push(a);c&&(e[0]?e[0].remove(!1):(e.shift(),i.shift(),k.shift(),m.shift()));this.getAttribs();this.isDirtyData=this.isDirty=!0;b&&h.redraw()},setData:function(a,b){var c=this.points,d=this.options,e=this.initialColor,f=this.chart,g=null;this.xIncrement=null;this.pointRange=this.xAxis&&this.xAxis.categories&&1||d.pointRange;if(y(e))f.counters.color=
e;var h=[],i=[],k=a?a.length:[],j=this.valueCount===4;if(k>(d.turboThreshold||1E3)){for(e=0;g===null&&e<k;)g=a[e],e++;if(Ja(g)){g=p(d.pointStart,0);d=p(d.pointInterval,1);for(e=0;e<k;e++)h[e]=g,i[e]=a[e],g+=d;this.xIncrement=g}else if(zb(g))if(j)for(e=0;e<k;e++)d=a[e],h[e]=d[0],i[e]=d.slice(1,5);else for(e=0;e<k;e++)d=a[e],h[e]=d[0],i[e]=d[1]}else for(e=0;e<k;e++)d={series:this},this.pointClass.prototype.applyOptions.apply(d,[a[e]]),h[e]=d.x,i[e]=j?[d.open,d.high,d.low,d.close]:d.y;this.data=[];this.options.data=
a;this.xData=h;this.yData=i;for(e=c&&c.length||0;e--;)c[e]&&c[e].destroy&&c[e].destroy();this.isDirty=this.isDirtyData=f.isDirtyBox=!0;p(b,!0)&&f.redraw(!1)},remove:function(a,b){var c=this,d=c.chart,a=p(a,!0);if(!c.isRemoving)c.isRemoving=!0,Z(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;a&&d.redraw(b)});c.isRemoving=!1},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e=0,f=d,g,h,i=this.xAxis,k=this.options,j=k.cropThreshold;if(this.isCartesian&&!this.isDirty&&
!i.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(!j||d>j||this.forceCrop)if(a=i.getExtremes(),i=a.min,j=a.max,b[d-1]<i||b[0]>j)b=[],c=[];else if(b[0]<i||b[d-1]>j){for(a=0;a<d;a++)if(b[a]>=i){e=$(0,a-1);break}for(;a<d;a++)if(b[a]>j){f=a+1;break}b=b.slice(e,f);c=c.slice(e,f);g=!0}for(a=b.length-1;a>0;a--)if(d=b[a]-b[a-1],h===ba||d<h)h=d;this.cropped=g;this.cropStart=e;this.processedXData=b;this.processedYData=c;if(k.pointRange===null)this.pointRange=h||1;this.closestPointRange=h},generatePoints:function(){var a=
this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,i,k=this.hasGroupedData,j,m=[],n;if(!b&&!k)b=[],b.length=a.length,b=this.data=b;for(n=0;n<g;n++)i=h+n,k?m[n]=(new f).init(this,[d[n]].concat(Hb(e[n]))):(b[i]?j=b[i]:b[i]=j=(new f).init(this,a[i],d[n]),m[n]=j);if(b&&(g!==(c=b.length)||k))for(n=0;n<c;n++)n===h&&!k&&(n+=g),b[n]&&b[n].destroyElements();this.data=b;this.points=m},translate:function(){this.processedXData||this.processData();
this.generatePoints();for(var a=this.chart,b=this.options,c=b.stacking,d=this.xAxis,e=d.categories,f=this.yAxis,g=this.points,h=g.length,i=!!this.modifyValue,k,j=f.series,m=j.length;m--;)if(j[m].visible){m===this.index&&(k=!0);break}for(m=0;m<h;m++){var j=g[m],n=j.x,o=j.y,p=j.low,D=f.stacks[(o<b.threshold?"-":"")+this.stackKey];j.plotX=B(d.translate(n,0,0,0,1)*10)/10;if(c&&this.visible&&D&&D[n]){p=D[n];n=p.total;p.cum=p=p.cum-o;o=p+o;if(k)p=b.threshold;c==="percent"&&(p=n?p*100/n:0,o=n?o*100/n:0);
j.percentage=n?j.y*100/n:0;j.stackTotal=n}j.yBottom=y(p)?f.translate(p,0,1,0,1):null;i&&(o=this.modifyValue(o,j));if(o!==null)j.plotY=B(f.translate(o,0,1,0,1)*10)/10;j.clientX=a.inverted?a.plotHeight-j.plotX:j.plotX;j.category=e&&e[j.x]!==ba?e[j.x]:j.x}this.getSegments()},setTooltipPoints:function(a){var b=this.chart,c=b.inverted,d=[],b=B((c?b.plotTop:b.plotLeft)+b.plotSizeX),e,f;e=this.xAxis;var g,h,i=[];if(this.options.enableMouseTracking!==!1){if(a)this.tooltipPoints=null;o(this.segments||this.points,
function(a){d=d.concat(a)});e&&e.reversed&&(d=d.reverse());a=d.length;for(h=0;h<a;h++){g=d[h];e=d[h-1]?d[h-1]._high+1:0;for(f=g._high=d[h+1]?Ta((g.plotX+(d[h+1]?d[h+1].plotX:b))/2):b;e<=f;)i[c?b-e++:e++]=g}this.tooltipPoints=i}},tooltipHeaderFormatter:function(a){var b=this.tooltipOptions,c=b.xDateFormat||"%A, %b %e, %Y",d=this.xAxis;return b.headerFormat.replace("{point.key}",d&&d.options.type==="datetime"?dc(c,a):a).replace("{series.name}",this.name).replace("{series.color}",this.color)},onMouseOver:function(){var a=
this.chart,b=a.hoverSeries;if(ra||!a.mouseIsDown){if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&Z(this,"mouseOver");this.setState(Ra);a.hoverSeries=this}},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;if(d)d.onMouseOut();this&&a.events.mouseOut&&Z(this,"mouseOut");c&&!a.stickyTracking&&!c.shared&&c.hide();this.setState();b.hoverSeries=null},animate:function(a){var b=this.chart,c=this.clipRect,d=this.options.animation;d&&!kb(d)&&(d={});if(a){if(!c.isAnimating)c.attr("width",
0),c.isAnimating=!0}else c.animate({width:b.plotSizeX},d),this.animate=null},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,k,j;if(this.options.marker.enabled)for(f=b.length;f--;)if(g=b[f],d=g.plotX,e=g.plotY,j=g.graphic,e!==ba&&!isNaN(e))if(a=g.pointAttr[g.selected?"select":Ga],h=a.r,i=p(g.marker&&g.marker.symbol,this.symbol),k=i.indexOf("url")===0,j)j.animate(N({x:d-h,y:e-h},j.symbolName?{width:2*h,height:2*h}:{}));else if(h>0||k)g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h).attr(a).add(this.group)},
convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=p(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=ka[a.type].marker?a.options.marker:a.options,c=b.states,d=c[Ra],e,f=a.color,g={stroke:f,fill:f},h=a.points,i=[],k,j=a.pointAttrToOptions,m;a.options.marker?(d.radius=d.radius||b.radius+2,d.lineWidth=d.lineWidth||b.lineWidth+1):d.color=d.color||bb(d.color||f).brighten(d.brightness).get();i[Ga]=a.convertAttribs(b,
g);o([Ra,"select"],function(b){i[b]=a.convertAttribs(c[b],i[Ga])});a.pointAttr=i;for(f=h.length;f--;){g=h[f];if((b=g.options&&g.options.marker||g.options)&&b.enabled===!1)b.radius=0;e=!1;if(g.options)for(m in j)y(b[j[m]])&&(e=!0);if(e){k=[];c=b.states||{};e=c[Ra]=c[Ra]||{};if(!a.options.marker)e.color=bb(e.color||g.options.color).brighten(e.brightness||d.brightness).get();k[Ga]=a.convertAttribs(b,i[Ga]);k[Ra]=a.convertAttribs(c[Ra],i[Ra],k[Ga]);k.select=a.convertAttribs(c.select,i.select,k[Ga])}else k=
i;g.pointAttr=k}},destroy:function(){var a=this,b=a.chart,c=a.clipRect,d=/AppleWebKit\/533/.test(Ha),e,f,g=a.data||[],h,i,k;Z(a,"destroy");Na(a);o(["xAxis","yAxis"],function(b){if(k=a[b])Gb(k.series,a),k.isDirty=!0});a.legendItem&&a.chart.legend.destroyItem(a);for(f=g.length;f--;)(h=g[f])&&h.destroy&&h.destroy();a.points=null;if(c&&c!==b.clipRect)a.clipRect=c.destroy();o(["area","graph","dataLabelsGroup","group","tracker"],function(b){a[b]&&(e=d&&b==="group"?"hide":"destroy",a[b][e]())});if(b.hoverSeries===
a)b.hoverSeries=null;Gb(b.series,a);for(i in a)delete a[i]},drawDataLabels:function(){var a=this,b=a.options,c=b.dataLabels;if(c.enabled||a._hasPointLabels){var d,e,f=a.points,g,h,i,k=a.dataLabelsGroup,j=a.chart,m=a.xAxis,m=m?m.left:j.plotLeft,n=a.yAxis,n=n?n.top:j.plotTop,u=j.renderer,t=j.inverted,D=a.type,x=b.stacking,E=D==="column"||D==="bar",q=c.verticalAlign===null,w=c.y===null,v;E&&(x?(q&&(c=M(c,{verticalAlign:"middle"})),w&&(c=M(c,{y:{top:14,middle:4,bottom:-6}[c.verticalAlign]}))):q&&(c=M(c,
{verticalAlign:"top"})));k?k.translate(m,n):k=a.dataLabelsGroup=u.g("data-labels").attr({visibility:a.visible?eb:$a,zIndex:6}).translate(m,n).add();h=c;o(f,function(f){v=f.dataLabel;c=h;(g=f.options)&&g.dataLabels&&(c=M(c,g.dataLabels));if(v&&a.isCartesian&&!j.isInsidePlot(f.plotX,f.plotY))f.dataLabel=v.destroy();else if(c.enabled){i=c.formatter.call(f.getLabelConfig(),c);var n=f.barX,m=n&&n+f.barW/2||f.plotX||-999,o=p(f.plotY,-999),q=c.align,r=w?f.y>=0?-6:12:c.y;d=(t?j.plotWidth-o:m)+c.x;e=(t?j.plotHeight-
m:o)+r;D==="column"&&(d+={left:-1,right:1}[q]*f.barW/2||0);!x&&t&&f.y<0&&(q="right",d-=10);c.style.color=p(c.color,c.style.color,a.color,"black");if(v)t&&!c.y&&(e=e+Q(v.styles.lineHeight)*0.9-v.getBBox().height/2),v.attr({text:i}).animate({x:d,y:e});else if(y(i))v=f.dataLabel=u.text(i,d,e,c.useHTML).attr({align:q,rotation:c.rotation,zIndex:1}).css(c.style).add(k),t&&!c.y&&v.attr({y:e+Q(v.styles.lineHeight)*0.9-v.getBBox().height/2});if(E&&b.stacking&&v)m=f.barY,o=f.barW,f=f.barH,v.align(c,null,{x:t?
j.plotWidth-m-f:n,y:t?j.plotHeight-n-o:m,width:t?f:o,height:t?o:f})}})}},drawGraph:function(){var a=this,b=a.options,c=a.graph,d=[],e,f=a.area,g=a.group,h=b.lineColor||a.color,i=b.lineWidth,k=b.dashStyle,j,m=a.chart.renderer,n=a.yAxis.getThreshold(b.threshold),u=/^area/.test(a.type),t=[],D=[];o(a.segments,function(c){j=[];o(c,function(d,e){a.getPointSpline?j.push.apply(j,a.getPointSpline(c,d,e)):(j.push(e?ha:ua),e&&b.step&&j.push(d.plotX,c[e-1].plotY),j.push(d.plotX,d.plotY))});c.length>1?d=d.concat(j):
t.push(c[0]);if(u){var e=[],f,g=j.length;for(f=0;f<g;f++)e.push(j[f]);g===3&&e.push(ha,j[1],j[2]);if(b.stacking&&a.type!=="areaspline")for(f=c.length-1;f>=0;f--)f<c.length-1&&b.step&&e.push(c[f+1].plotX,c[f].yBottom),e.push(c[f].plotX,c[f].yBottom);else e.push(ha,c[c.length-1].plotX,n,ha,c[0].plotX,n);D=D.concat(e)}});a.graphPath=d;a.singlePoints=t;if(u)e=p(b.fillColor,bb(a.color).setOpacity(b.fillOpacity||0.75).get()),f?f.animate({d:D}):a.area=a.chart.renderer.path(D).attr({fill:e}).add(g);if(c)Pb(c),
c.animate({d:d});else if(i){c={stroke:h,"stroke-width":i};if(k)c.dashstyle=k;a.graph=m.path(d).attr(c).add(g).shadow(b.shadow)}},render:function(){var a=this,b=a.chart,c,d,e=a.options,f=e.clip!==!1,g=e.animation,h=g&&a.animate,g=h?g&&g.duration||500:0,i=a.clipRect,k=b.renderer;if(!i&&(i=a.clipRect=!b.hasRendered&&b.clipRect?b.clipRect:k.clipRect(0,0,b.plotSizeX,b.plotSizeY+1),!b.clipRect))b.clipRect=i;if(!a.group)c=a.group=k.g("series"),b.inverted&&(d=function(){c.attr({width:b.plotWidth,height:b.plotHeight}).invert()},
d(),ja(b,"resize",d),ja(a,"destroy",function(){Na(b,"resize",d)})),f&&c.clip(i),c.attr({visibility:a.visible?eb:$a,zIndex:e.zIndex}).translate(a.xAxis.left,a.yAxis.top).add(b.seriesGroup);a.drawDataLabels();h&&a.animate(!0);a.getAttribs();a.drawGraph&&a.drawGraph();a.drawPoints();a.options.enableMouseTracking!==!1&&a.drawTracker();h&&a.animate();setTimeout(function(){i.isAnimating=!1;if((c=a.group)&&i!==b.clipRect&&i.renderer){if(f)c.clip(a.clipRect=b.clipRect);i.destroy()}},g);a.isDirty=a.isDirtyData=
!1},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.group;c&&(a.inverted&&c.attr({width:a.plotWidth,height:a.plotHeight}),c.animate({translateX:this.xAxis.left,translateY:this.yAxis.top}));this.translate();this.setTooltipPoints(!0);this.render();b&&Z(this,"updatedData")},setState:function(a){var b=this.options,c=this.graph,d=b.states,b=b.lineWidth,a=a||Ga;if(this.state!==a)this.state=a,d[a]&&d[a].enabled===!1||(a&&(b=d[a].lineWidth||b+1),c&&!c.dashstyle&&c.attr({"stroke-width":b},a?0:
500))},setVisible:function(a,b){var c=this.chart,d=this.legendItem,e=this.group,f=this.tracker,g=this.dataLabelsGroup,h,i=this.points,k=c.options.chart.ignoreHiddenSeries;h=this.visible;h=(this.visible=a=a===ba?!h:a)?"show":"hide";if(e)e[h]();if(f)f[h]();else if(i)for(e=i.length;e--;)if(f=i[e],f.tracker)f.tracker[h]();if(g)g[h]();d&&c.legend.colorizeItem(this,a);this.isDirty=!0;this.options.stacking&&o(c.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});if(k)c.isDirtyBox=!0;b!==!1&&
c.redraw();Z(this,h)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===ba?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;Z(this,a?"select":"unselect")},drawTracker:function(){var a=this,b=a.options,c=[].concat(a.graphPath),d=c.length,e=a.chart,f=e.renderer,g=e.options.tooltip.snap,h=a.tracker,i=b.cursor,i=i&&{cursor:i},k=a.singlePoints,j;if(d)for(j=d+1;j--;)c[j]===ua&&c.splice(j+1,0,c[j+1]-g,c[j+2],ha),(j&&c[j]===ua||j===d)&&
c.splice(j,0,ha,c[j-2]+g,c[j-1]);for(j=0;j<k.length;j++)d=k[j],c.push(ua,d.plotX-g,d.plotY,ha,d.plotX+g,d.plotY);h?h.attr({d:c}):(h=f.g().clip(e.clipRect).add(e.trackerGroup),a.tracker=f.path(c).attr({isTracker:!0,stroke:Ec,fill:ga,"stroke-linejoin":"bevel","stroke-width":b.lineWidth+2*g,visibility:a.visible?eb:$a,zIndex:b.zIndex||1}).on(ra?"touchstart":"mouseover",function(){if(e.hoverSeries!==a)a.onMouseOver()}).on("mouseout",function(){if(!b.stickyTracking)a.onMouseOut()}).css(i).add(h))}};A=O(R);
Ca.line=A;A=O(R,{type:"area"});Ca.area=A;A=O(R,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,i,k,j;if(c&&c<a.length-1){a=f.plotY;k=g.plotX;var g=g.plotY,m;h=(1.5*d+f.plotX)/2.5;i=(1.5*e+a)/2.5;k=(1.5*d+k)/2.5;j=(1.5*e+g)/2.5;m=(j-i)*(k-d)/(k-h)+e-j;i+=m;j+=m;i>a&&i>e?(i=$(a,e),j=2*e-i):i<a&&i<e&&(i=Za(a,e),j=2*e-i);j>g&&j>e?(j=$(g,e),i=2*e-j):j<g&&j<e&&(j=Za(g,e),i=2*e-j);b.rightContX=k;b.rightContY=j}c?(b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,
h||d,i||e,d,e],f.rightContX=f.rightContY=null):b=[ua,d,e];return b}});Ca.spline=A;A=O(A,{type:"areaspline"});Ca.areaspline=A;var xb=O(R,{type:"column",tooltipOutsidePlot:!0,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",r:"borderRadius"},init:function(){R.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&o(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},translate:function(){var a=this,b=a.chart,c=a.options,d=c.stacking,e=c.borderWidth,
f=0,g=a.xAxis,h=g.reversed,i={},k,j;R.prototype.translate.apply(a);o(b.series,function(b){if(b.type===a.type&&b.visible&&a.options.group===b.options.group)b.options.stacking?(k=b.stackKey,i[k]===ba&&(i[k]=f++),j=i[k]):j=f++,b.columnIndex=j});var m=a.points,g=ya(g.translationSlope)*(g.ordinalSlope||g.closestPointRange||1),n=g*c.groupPadding,u=(g-2*n)/f,t=c.pointWidth,D=y(t)?(u-t)/2:u*c.pointPadding,x=ac($(p(t,u-2*D),1)),r=D+(n+((h?f-a.columnIndex:a.columnIndex)||0)*u-g/2)*(h?-1:1),q=a.yAxis.getThreshold(c.threshold),
w=p(c.minPointLength,5);o(m,function(f){var g=f.plotY,h=f.yBottom||q,i=f.plotX+r,j=ac(Za(g,h)),k=ac($(g,h)-j),m=a.yAxis.stacks[(f.y<0?"-":"")+a.stackKey];d&&a.visible&&m&&m[f.x]&&m[f.x].setOffset(r,x);ya(k)<w&&w&&(k=w,j=ya(j-q)>w?h-w:q-(g<=q?w:0));N(f,{barX:i,barY:j,barW:x,barH:k});f.shapeType="rect";g=N(b.renderer.Element.prototype.crisp.apply({},[e,i,j,x,k]),{r:c.borderRadius});e%2&&(g.y-=1,g.height+=1);f.shapeArgs=g;f.trackerArgs=ya(k)<3&&M(f.shapeArgs,{height:6,y:j-3})})},getSymbol:function(){},
drawGraph:function(){},drawPoints:function(){var a=this,b=a.options,c=a.chart.renderer,d,e;o(a.points,function(f){var g=f.plotY;if(g!==ba&&!isNaN(g)&&f.y!==null)d=f.graphic,e=f.shapeArgs,d?(Pb(d),d.animate(e)):f.graphic=d=c[f.shapeType](e).attr(f.pointAttr[f.selected?"select":Ga]).add(a.group).shadow(b.shadow)})},drawTracker:function(){var a=this,b=a.chart,c=b.renderer,d,e,f=+new Date,g=a.options,h=g.cursor,i=h&&{cursor:h},k,j;a.isCartesian&&(k=c.g().clip(b.clipRect).add(b.trackerGroup));o(a.points,
function(h){e=h.tracker;d=h.trackerArgs||h.shapeArgs;delete d.strokeWidth;if(h.y!==null)e?e.attr(d):h.tracker=c[h.shapeType](d).attr({isTracker:f,fill:Ec,visibility:a.visible?eb:$a,zIndex:g.zIndex||1}).on(ra?"touchstart":"mouseover",function(c){j=c.relatedTarget||c.fromElement;if(b.hoverSeries!==a&&r(j,"isTracker")!==f)a.onMouseOver();h.onMouseOver()}).on("mouseout",function(b){if(!g.stickyTracking&&(j=b.relatedTarget||b.toElement,r(j,"isTracker")!==f))a.onMouseOut()}).css(i).add(h.group||k)})},animate:function(a){var b=
this,c=b.points,d=b.options;if(!a)o(c,function(a){var c=a.graphic,a=a.shapeArgs,g=b.yAxis,h=d.threshold;c&&(c.attr({height:0,y:y(h)?g.getThreshold(h):g.translate(g.getExtremes().min,0,1,0,1)}),c.animate({height:a.height,y:a.y},d.animation))}),b.animate=null},remove:function(){var a=this,b=a.chart;b.hasRendered&&o(b.series,function(b){if(b.type===a.type)b.isDirty=!0});R.prototype.remove.apply(a,arguments)}});Ca.column=xb;A=O(xb,{type:"bar",init:function(){this.inverted=!0;xb.prototype.init.apply(this,
arguments)}});Ca.bar=A;A=O(R,{type:"scatter",translate:function(){var a=this;R.prototype.translate.apply(a);o(a.points,function(b){b.shapeType="circle";b.shapeArgs={x:b.plotX,y:b.plotY,r:a.chart.options.tooltip.snap}})},drawTracker:function(){for(var a=this,b=a.options.cursor,b=b&&{cursor:b},c=a.points,d=c.length,e;d--;)if(e=c[d].graphic)e.element._index=d;a._hasTracking?a._hasTracking=!0:a.group.on(ra?"touchstart":"mouseover",function(b){a.onMouseOver();c[b.target._index].onMouseOver()}).on("mouseout",
function(){if(!a.options.stickyTracking)a.onMouseOut()}).css(b)}});Ca.scatter=A;A=O(Aa,{init:function(){Aa.prototype.init.apply(this,arguments);var a=this,b;N(a,{visible:a.visible!==!1,name:p(a.name,"Slice")});b=function(){a.slice()};ja(a,"select",b);ja(a,"unselect",b);return a},setVisible:function(a){var b=this.series.chart,c=this.tracker,d=this.dataLabel,e=this.connector,f=this.shadowGroup,g;g=(this.visible=a=a===ba?!this.visible:a)?"show":"hide";this.group[g]();if(c)c[g]();if(d)d[g]();if(e)e[g]();
if(f)f[g]();this.legendItem&&b.legend.colorizeItem(this,a)},slice:function(a,b,c){var d=this.series.chart,e=this.slicedTranslation;Lb(c,d);p(b,!0);a=this.sliced=y(a)?a:!this.sliced;a={translateX:a?e[0]:d.plotLeft,translateY:a?e[1]:d.plotTop};this.group.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)}});A=O(R,{type:"pie",isCartesian:!1,pointClass:A,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},getColor:function(){this.initialColor=this.chart.counters.color},
animate:function(){var a=this;o(a.points,function(b){var c=b.graphic,b=b.shapeArgs,d=-ab/2;c&&(c.attr({r:0,start:d,end:d}),c.animate({r:b.r,start:b.start,end:b.end},a.options.animation))});a.animate=null},setData:function(){R.prototype.setData.apply(this,arguments);this.processData();this.generatePoints()},translate:function(){this.generatePoints();var a=0,b=-0.25,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f=c.center.concat([c.size,c.innerSize||0]),g=this.chart,h=g.plotWidth,i=g.plotHeight,
k,j,m,n=this.points,p=2*ab,t,D=Za(h,i),x,r,q,w=c.dataLabels.distance,f=Xb(f,function(a,b){return(x=/%$/.test(a))?[h,i,D,D][b]*Q(a)/100:a});this.getX=function(a,b){m=oa.asin((a-f[1])/(f[2]/2+w));return f[0]+(b?-1:1)*fa(m)*(f[2]/2+w)};this.center=f;o(n,function(b){a+=b.y});o(n,function(c){t=a?c.y/a:0;k=B(b*p*1E3)/1E3;b+=t;j=B(b*p*1E3)/1E3;c.shapeType="arc";c.shapeArgs={x:f[0],y:f[1],r:f[2]/2,innerR:f[3]/2,start:k,end:j};m=(j+k)/2;c.slicedTranslation=Xb([fa(m)*d+g.plotLeft,sa(m)*d+g.plotTop],B);r=fa(m)*
f[2]/2;q=sa(m)*f[2]/2;c.tooltipPos=[f[0]+r*0.7,f[1]+q*0.7];c.labelPos=[f[0]+r+fa(m)*w,f[1]+q+sa(m)*w,f[0]+r+fa(m)*e,f[1]+q+sa(m)*e,f[0]+r,f[1]+q,w<0?"center":m<p/4?"left":"right",m];c.percentage=t*100;c.total=a});this.setTooltipPoints()},render:function(){this.getAttribs();this.drawPoints();this.options.enableMouseTracking!==!1&&this.drawTracker();this.drawDataLabels();this.options.animation&&this.animate&&this.animate();this.isDirty=!1},drawPoints:function(){var a=this.chart,b=a.renderer,c,d,e,f=
this.options.shadow,g,h;o(this.points,function(i){d=i.graphic;h=i.shapeArgs;e=i.group;g=i.shadowGroup;if(f&&!g)g=i.shadowGroup=b.g("shadow").attr({zIndex:4}).add();if(!e)e=i.group=b.g("point").attr({zIndex:5}).add();c=i.sliced?i.slicedTranslation:[a.plotLeft,a.plotTop];e.translate(c[0],c[1]);g&&g.translate(c[0],c[1]);d?d.animate(h):i.graphic=b.arc(h).attr(N(i.pointAttr[Ga],{"stroke-linejoin":"round"})).add(i.group).shadow(f,g);i.visible===!1&&i.setVisible(!1)})},drawDataLabels:function(){var a=this.data,
b,c=this.chart,d=this.options.dataLabels,e=p(d.connectorPadding,10),f=p(d.connectorWidth,1),g,h,i=p(d.softConnector,!0),k=d.distance,j=this.center,m=j[2]/2,j=j[1],n=k>0,u=[[],[]],t,r,x,y,q=2,w;if(d.enabled){R.prototype.drawDataLabels.apply(this);o(a,function(a){a.dataLabel&&u[a.labelPos[7]<ab/2?0:1].push(a)});u[1].reverse();y=function(a,b){return b.y-a.y};for(a=u[0][0]&&u[0][0].dataLabel&&Q(u[0][0].dataLabel.styles.lineHeight);q--;){var v=[],B=[],A=u[q],C=A.length,F;for(w=j-m-k;w<=j+m+k;w+=a)v.push(w);
x=v.length;if(C>x){h=[].concat(A);h.sort(y);for(w=C;w--;)h[w].rank=w;for(w=C;w--;)A[w].rank>=x&&A.splice(w,1);C=A.length}for(w=0;w<C;w++){b=A[w];h=b.labelPos;b=9999;for(r=0;r<x;r++)g=ya(v[r]-h[1]),g<b&&(b=g,F=r);if(F<w&&v[w]!==null)F=w;else for(x<C-w+F&&v[w]!==null&&(F=x-C+w);v[F]===null;)F++;B.push({i:F,y:v[F]});v[F]=null}B.sort(y);for(w=0;w<C;w++){b=A[w];h=b.labelPos;g=b.dataLabel;r=B.pop();t=h[1];x=b.visible===!1?$a:eb;F=r.i;r=r.y;if(t>r&&v[F+1]!==null||t<r&&v[F-1]!==null)r=t;t=this.getX(F===0||
F===v.length-1?t:r,q);g.attr({visibility:x,align:h[6]})[g.moved?"animate":"attr"]({x:t+d.x+({left:e,right:-e}[h[6]]||0),y:r+d.y});g.moved=!0;if(n&&f)g=b.connector,h=i?[ua,t+(h[6]==="left"?5:-5),r,"C",t,r,2*h[2]-h[4],2*h[3]-h[5],h[2],h[3],ha,h[4],h[5]]:[ua,t+(h[6]==="left"?5:-5),r,ha,h[2],h[3],ha,h[4],h[5]],g?(g.animate({d:h}),g.attr("visibility",x)):b.connector=g=this.chart.renderer.path(h).attr({"stroke-width":f,stroke:d.connectorColor||b.color||"#606060",visibility:x,zIndex:3}).translate(c.plotLeft,
c.plotTop).add()}}}},drawTracker:xb.prototype.drawTracker,getSymbol:function(){}});Ca.pie=A;N(Highcharts,{Chart:vc,dateFormat:dc,pathAnim:Ia,getOptions:function(){return Ba},hasBidiBug:Oc,numberFormat:fc,Point:Aa,Color:bb,Renderer:$b,SVGRenderer:Fb,VMLRenderer:Wa,CanVGRenderer:nc,seriesTypes:Ca,setOptions:function(a){cc=M(cc,a.xAxis);kc=M(kc,a.yAxis);a.xAxis=a.yAxis=ba;Ba=M(Ba,a);uc();return Ba},Series:R,addEvent:ja,removeEvent:Na,createElement:xa,discardElement:Vb,css:U,each:o,extend:N,map:Xb,merge:M,
pick:p,splat:Hb,extendClass:O,placeBox:tc,product:"Highcharts",version:"2.2.0"})})();

//JSHint options
/*global Highcharts*/

/*
 * Name space
 */
var HARSTORAGE = HARSTORAGE || {};

/*
 * Dark green theme for Highcharts
 */
Highcharts.darkGreen = {
    colors: [
        "#DDDF0D",
        "#55BF3B",
        "#DF5353",
        "#7798BF",
        "#6AF9C4",
        "#DB843D",
        "#EEAAEE",
        "#669933",
        "#CC3333",
        "#FF9944",
        "#996633",
        "#4572A7",
        "#80699B",
        "#92A8CD",
        "#A47D7C",
        "#9A48C9",
        "#C99A48",
        "#879D79"
    ],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 0, 500],
            stops: [
                [0, "#498A2D"],
                [1, "#000000"]
            ]
        },
        borderWidth: 0,
        plotBackgroundColor: "rgba(255, 255, 255, .1)",
        plotBorderColor: "#CCCCCC",
        plotBorderWidth: 1
    },
    title: {
        style: {
            color: "#FFFFFF",
            fontWeight: "bold",
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    xAxis: {
        gridLineColor: "#333333",
        gridLineWidth: 1,
        lineWidth: 0,
        labels: {
            style: {
                color: "#FFFFFF",
                font: '11px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        lineColor: "#FFFFFF",
        tickColor: "#FFFFFF"
    },
    yAxis: {
        gridLineColor: "#333333",
        labels: {
            style: {
                color: "#FFFFFF",
                font: '11px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        lineColor: "#FFFFFF",
        minorTickInterval: null,
        tickColor: "#FFFFFF",
        tickWidth: 1,
        title: {
            style: {
                color: "white",
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        }
    },
    tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        style: {
            color: "#F0F0F0"
        }
    },
    toolbar: {
        itemStyle: {
            color: "silver"
        }
    },
    plotOptions: {
        spline: {
            marker: {
                lineColor: "#333333",
                symbol: "diamond"
            }
        },
        pie: {
            allowPointSelect: true,
            cursor: "pointer",
            size: "65%",
            dataLabels: {
                enabled: true,
                color: "#FFFFFF",
                distance: 25,
                connectorColor: "#FFFFFF",
                formatter: function() {
                    return this.point.name;
                }
            }
        },
        column: {
            pointPadding: 0.1,
            borderWidth: 0,
            borderColor: "white",
            dataLabels: {
                enabled: true,
                color: "white",
                align: "left",
                y: -5
            }
        },
        bar: {
            dataLabels: {
                enabled: true,
                color: "#DDDF0D"
            }
        }
    },
    legend: {
        itemStyle: {
            font: '9pt "Trebuchet MS", Verdana, sans-serif',
            color: "#FFFFFF"
        },
        itemHoverStyle: {
            color: "#A0A0A0"
        },
        itemHiddenStyle: {
            color: "#444444"
        },
        borderColor: "#FFFFFF"
    }
};

/*
 * Light theme for Highcharts
 */
Highcharts.light = {
    colors: [
        "#669933",
        "#CC3333",
        "#FF9944",
        "#996633",
        "#4572A7",
        "#80699B",
        "#92A8CD",
        "#EEAAEE",
        "#A47D7C",
        "#DDDF0D",
        "#55BF3B",
        "#DF5353",
        "#7798BF",
        "#6AF9C4",
        "#DB843D",
        "#9A48C9",
        "#C99A48",
        "#879D79"
    ],
    chart: {
        borderWidth: 1,
        borderColor: "#498A2D",
        plotBorderWidth: 1,
        plotBorderColor: "#498A2D"
    },
    title: {
        style: {
            color: "#498A2D",
            fontWeight: "bold",
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    xAxis: {
        gridLineWidth: 1,
        lineColor: "#498A2D",
        tickColor: "#498A2D",
        lineWidth: 0,
        labels: {
            style: {
                color: "#498A2D",
                font: '11px "Trebuchet MS", Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        gridLineWidth: 1,
        lineColor: "#498A2D",
        tickColor: "#498A2D",
        tickWidth: 1,
        labels: {
            style: {
                color: "#498A2D",
                font: '11px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        title: {
            style: {
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        }
    },
    toolbar: {
        itemStyle: {
            color: "silver"
        }
    },
    plotOptions: {
        spline: {
            marker: {
                lineColor: "#FFFFFF",
                symbol: "diamond"
            }
        },
        pie: {
            allowPointSelect: true,
            cursor: "pointer",
            size: "65%",
            dataLabels: {
                enabled: true,
                distance: 25,
                connectorColor: "#498A2D",
                color: "#498A2D",
                formatter: function() {
                    return this.point.name;
                }
            }
        },
        column: {
            pointPadding: 0.1,
            borderWidth: 0,
            borderColor: "white",
            dataLabels: {
                enabled: true,
                color: "#498A2D",
                align: "left",
                y: -5
            }
        },
        bar: {
            dataLabels: {
                enabled: true,
                color: "#669933"
            }
        }
    },
    legend: {
        itemStyle: {
            font: '9pt "Trebuchet MS", Verdana, sans-serif',
            color: "#498A2D"

        },
        itemHoverStyle: {
            color: "#A0A0A0"
        },
        itemHiddenStyle: {
            color: "gray"
        },
        borderWidth: 1,
        borderColor: "#498A2D"
    }
};

/*
 * Light green theme for Highcharts
 */
Highcharts.lightGreen = {
    colors: [
        "#669933",
        "#CC3333",
        "#FF9944",
        "#996633",
        "#4572A7",
        "#80699B",
        "#92A8CD",
        "#EEAAEE",
        "#A47D7C",
        "#DDDF0D",
        "#55BF3B",
        "#DF5353",
        "#7798BF",
        "#6AF9C4",
        "#DB843D",
        "#9A48C9",
        "#C99A48",
        "#879D79"
    ],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 0, 500],
            stops: [
                [0, "#FFFFFF"],
                [1, "#99CC66"]
            ]
        },
        borderWidth: 1,
        borderColor: "#498A2D",
        plotBackgroundColor: "rgba(255, 255, 255, .9)",
        plotBorderWidth: 0
    },
    title: {
        style: {
            color: "#498A2D",
            fontWeight: "bold",
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    xAxis: {
        gridLineWidth: 1,
        lineColor: "#498A2D",
        tickColor: "#498A2D",
        lineWidth: 0,
        labels: {
            style: {
                color: "#498A2D",
                font: '11px "Trebuchet MS", Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        gridLineWidth: 1,
        lineColor: "#498A2D",
        tickColor: "#498A2D",
        tickWidth: 1,
        labels: {
            style: {
                color: "#498A2D",
                font: '11px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        title: {
            style: {
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        }
    },
    toolbar: {
        itemStyle: {
            color: "silver"
        }
    },
    plotOptions: {
        spline: {
            marker: {
                lineColor: "#FFFFFF",
                symbol: "diamond"
            }
        },
        pie: {
            allowPointSelect: true,
            cursor: "pointer",
            size: "65%",
            dataLabels: {
                enabled: true,
                distance: 25,
                connectorColor: "#498A2D",
                color: "#498A2D",
                formatter: function() {
                    return this.point.name;
                }
            }
        },
        column: {
            pointPadding: 0.1,
            borderWidth: 0,
            borderColor: "white",
            dataLabels: {
                enabled: true,
                color: "#498A2D",
                align: "left",
                y: -5
            }
        },
        bar: {
            dataLabels: {
                enabled: true,
                color: "#669933"
            }
        }
    },
    legend: {
        itemStyle: {
            font: '9pt "Trebuchet MS", Verdana, sans-serif',
            color: "#498A2D"

        },
        itemHoverStyle: {
            color: "#000000"
        },
        itemHiddenStyle: {
            color: "gray"
        },
        borderWidth: 1,
        borderColor: "#498A2D"
    }
};

/*
 * Theme setup
 */
HARSTORAGE.setTheme = function() {
    "use strict";

    // Read preference from Cookie
    var theme = HARSTORAGE.read_cookie("chartTheme");

    if (theme) {
        switch (theme) {
        case "light":
            Highcharts.setOptions(Highcharts.light);
            break;
        case "light-green":
            Highcharts.setOptions(Highcharts.lightGreen);
            break;
        default:
            Highcharts.setOptions(Highcharts.darkGreen);
        }
    } else {
        Highcharts.setOptions(Highcharts.darkGreen);
    }
};

HARSTORAGE.setTheme();
/*
 Highcharts JS v2.2.0 (2012-02-16)
 Exporting module

 (c) 2010-2011 Torstein H?nsi

 License: www.highcharts.com/license
*/
(function(){function x(a){for(var b=a.length;b--;)typeof a[b]==="number"&&(a[b]=Math.round(a[b])-0.5);return a}var f=Highcharts,y=f.Chart,z=f.addEvent,B=f.removeEvent,r=f.createElement,u=f.discardElement,t=f.css,s=f.merge,k=f.each,n=f.extend,C=Math.max,h=document,D=window,A=h.documentElement.ontouchstart!==void 0,v=f.getOptions();n(v.lang,{downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",exportButtonTitle:"Export to raster or vector image",
printButtonTitle:"Print the chart"});v.navigation={menuStyle:{border:"1px solid #A0A0A0",background:"#FFFFFF"},menuItemStyle:{padding:"0 5px",background:"none",color:"#303030",fontSize:A?"14px":"11px"},menuItemHoverStyle:{background:"#4572A5",color:"#FFFFFF"},buttonOptions:{align:"right",backgroundColor:{linearGradient:[0,0,0,20],stops:[[0.4,"#F7F7F7"],[0.6,"#E3E3E3"]]},borderColor:"#B0B0B0",borderRadius:3,borderWidth:1,height:20,hoverBorderColor:"#909090",hoverSymbolFill:"#81A7CF",hoverSymbolStroke:"#4572A5",
symbolFill:"#E0E0E0",symbolStroke:"#A0A0A0",symbolX:11.5,symbolY:10.5,verticalAlign:"top",width:24,y:10}};v.exporting={type:"image/png",url:"http://export.highcharts.com/",width:800,buttons:{exportButton:{symbol:"exportIcon",x:-10,symbolFill:"#A8BF77",hoverSymbolFill:"#768F3E",_id:"exportButton",_titleKey:"exportButtonTitle",menuItems:[{textKey:"downloadPNG",onclick:function(){this.exportChart()}},{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",
onclick:function(){this.exportChart({type:"application/pdf"})}},{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}]},printButton:{symbol:"printIcon",x:-36,symbolFill:"#B5C9DF",hoverSymbolFill:"#779ABF",_id:"printButton",_titleKey:"printButtonTitle",onclick:function(){this.print()}}}};n(y.prototype,{getSVG:function(a){var b=this,c,d,e,g=s(b.options,a);if(!h.createElementNS)h.createElementNS=function(a,b){var c=h.createElement(b);c.getBBox=function(){return f.Renderer.prototype.Element.prototype.getBBox.apply({element:c})};
return c};a=r("div",null,{position:"absolute",top:"-9999em",width:b.chartWidth+"px",height:b.chartHeight+"px"},h.body);n(g.chart,{renderTo:a,forExport:!0});g.exporting.enabled=!1;g.chart.plotBackgroundImage=null;g.series=[];k(b.series,function(a){e=s(a.options,{animation:!1,showCheckbox:!1,visible:a.visible});if(!e.isInternal){if(e&&e.marker&&/^url\(/.test(e.marker.symbol))e.marker.symbol="circle";g.series.push(e)}});c=new Highcharts.Chart(g);k(["xAxis","yAxis"],function(a){k(b[a],function(b,d){var e=
c[a][d],g=b.getExtremes(),f=g.userMin,g=g.userMax;(f!==void 0||g!==void 0)&&e.setExtremes(f,g,!0,!1)})});d=c.container.innerHTML;g=null;c.destroy();u(a);d=d.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/isTracker="[^"]+"/g,"").replace(/url\([^#]+#/g,"url(#").replace(/&nbsp;/g,"\u00a0").replace(/&shy;/g,"\u00ad").replace(/id=([^" >]+)/g,'id="$1"').replace(/class=([^" ]+)/g,'class="$1"').replace(/ transform /g,
" ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(a){return a.toLowerCase()});d=d.replace(/(url\(#highcharts-[0-9]+)&quot;/g,"$1").replace(/&quot;/g,"'");d.match(/ xmlns="/g).length===2&&(d=d.replace(/xmlns="[^"]+"/,""));return d},exportChart:function(a,b){var c,d=this.getSVG(s(this.options.exporting.chartOptions,b)),a=s(this.options.exporting,a);c=r("form",{method:"post",action:a.url},{display:"none"},h.body);k(["filename","type","width","svg"],function(b){r("input",{type:"hidden",
name:b,value:{filename:a.filename||"chart",type:a.type,width:a.width,svg:d}[b]},null,c)});c.submit();u(c)},print:function(){var a=this,b=a.container,c=[],d=b.parentNode,e=h.body,g=e.childNodes;if(!a.isPrinting)a.isPrinting=!0,k(g,function(a,b){if(a.nodeType===1)c[b]=a.style.display,a.style.display="none"}),e.appendChild(b),D.print(),setTimeout(function(){d.appendChild(b);k(g,function(a,b){if(a.nodeType===1)a.style.display=c[b]});a.isPrinting=!1},1E3)},contextMenu:function(a,b,c,d,e,g){var i=this,
f=i.options.navigation,h=f.menuItemStyle,o=i.chartWidth,p=i.chartHeight,q="cache-"+a,j=i[q],l=C(e,g),m,w;if(!j)i[q]=j=r("div",{className:"highcharts-"+a},{position:"absolute",zIndex:1E3,padding:l+"px"},i.container),m=r("div",null,n({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},f.menuStyle),j),w=function(){t(j,{display:"none"})},z(j,"mouseleave",w),k(b,function(a){if(a){var b=r("div",{onmouseover:function(){t(this,f.menuItemHoverStyle)},onmouseout:function(){t(this,
h)},innerHTML:a.text||i.options.lang[a.textKey]},n({cursor:"pointer"},h),m);b[A?"ontouchstart":"onclick"]=function(){w();a.onclick.apply(i,arguments)};i.exportDivElements.push(b)}}),i.exportDivElements.push(m,j),i.exportMenuWidth=j.offsetWidth,i.exportMenuHeight=j.offsetHeight;a={display:"block"};c+i.exportMenuWidth>o?a.right=o-c-e-l+"px":a.left=c-l+"px";d+g+i.exportMenuHeight>p?a.bottom=p-d-l+"px":a.top=d+g-l+"px";t(j,a)},addButton:function(a){function b(){p.attr(l);o.attr(j)}var c=this,d=c.renderer,
e=s(c.options.navigation.buttonOptions,a),g=e.onclick,f=e.menuItems,h=e.width,k=e.height,o,p,q,a=e.borderWidth,j={stroke:e.borderColor},l={stroke:e.symbolStroke,fill:e.symbolFill},m=e.symbolSize||12;if(!c.exportDivElements)c.exportDivElements=[],c.exportSVGElements=[];e.enabled!==!1&&(o=d.rect(0,0,h,k,e.borderRadius,a).align(e,!0).attr(n({fill:e.backgroundColor,"stroke-width":a,zIndex:19},j)).add(),q=d.rect(0,0,h,k,0).align(e).attr({id:e._id,fill:"rgba(255, 255, 255, 0.001)",title:c.options.lang[e._titleKey],
zIndex:21}).css({cursor:"pointer"}).on("mouseover",function(){p.attr({stroke:e.hoverSymbolStroke,fill:e.hoverSymbolFill});o.attr({stroke:e.hoverBorderColor})}).on("mouseout",b).on("click",b).add(),f&&(g=function(){b();var a=q.getBBox();c.contextMenu("export-menu",f,a.x,a.y,h,k)}),q.on("click",function(){g.apply(c,arguments)}),p=d.symbol(e.symbol,e.symbolX-m/2,e.symbolY-m/2,m,m).align(e,!0).attr(n(l,{"stroke-width":e.symbolStrokeWidth||1,zIndex:20})).add(),c.exportSVGElements.push(o,q,p))},destroyExport:function(){var a,
b;for(a=0;a<this.exportSVGElements.length;a++)b=this.exportSVGElements[a],b.onclick=b.ontouchstart=null,this.exportSVGElements[a]=b.destroy();for(a=0;a<this.exportDivElements.length;a++)b=this.exportDivElements[a],B(b,"mouseleave"),this.exportDivElements[a]=b.onmouseout=b.onmouseover=b.ontouchstart=b.onclick=null,u(b)}});f.Renderer.prototype.symbols.exportIcon=function(a,b,c,d){return x(["M",a,b+c,"L",a+c,b+d,a+c,b+d*0.8,a,b+d*0.8,"Z","M",a+c*0.5,b+d*0.8,"L",a+c*0.8,b+d*0.4,a+c*0.4,b+d*0.4,a+c*0.4,
b,a+c*0.6,b,a+c*0.6,b+d*0.4,a+c*0.2,b+d*0.4,"Z"])};f.Renderer.prototype.symbols.printIcon=function(a,b,c,d){return x(["M",a,b+d*0.7,"L",a+c,b+d*0.7,a+c,b+d*0.4,a,b+d*0.4,"Z","M",a+c*0.2,b+d*0.4,"L",a+c*0.2,b,a+c*0.8,b,a+c*0.8,b+d*0.4,"Z","M",a+c*0.2,b+d*0.7,"L",a,b+d,a+c,b+d,a+c*0.8,b+d*0.7,"Z"])};y.prototype.callbacks.push(function(a){var b,c=a.options.exporting,d=c.buttons;if(c.enabled!==!1){for(b in d)a.addButton(d[b]);z(a,"destroy",a.destroyExport)}})})();

// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
// 
// Version 0.9.1
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
(function() {
  /*
  Chosen source: generate output using 'cake build'
  Copyright (c) 2011 by Harvest
  */  var $, Chosen, get_side_border_padding, root;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  root = this;
  $ = jQuery;
  $.fn.extend({
    chosen: function(data, options) {
      if ($.browser === "msie" && ($.browser.version === "6.0" || $.browser.version === "7.0")) {
        return this;
      }
      return $(this).each(function(input_field) {
        if (!($(this)).hasClass("chzn-done")) {
          return new Chosen(this, data, options);
        }
      });
    }
  });
  Chosen = (function() {
    function Chosen(elmn) {
      this.set_default_values();
      this.form_field = elmn;
      this.form_field_jq = $(this.form_field);
      this.is_multiple = this.form_field.multiple;
      this.is_rtl = this.form_field_jq.hasClass("chzn-rtl");
      this.default_text_default = this.form_field.multiple ? "Select Some Options" : "Select an Option";
      this.set_up_html();
      this.register_observers();
      this.form_field_jq.addClass("chzn-done");
    }
    Chosen.prototype.set_default_values = function() {
      this.click_test_action = __bind(function(evt) {
        return this.test_active_click(evt);
      }, this);
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      return this.choices = 0;
    };
    Chosen.prototype.set_up_html = function() {
      var container_div, dd_top, dd_width, sf_width;
      this.container_id = this.form_field.id.length ? this.form_field.id.replace(/(:|\.)/g, '_') : this.generate_field_id();
      this.container_id += "_chzn";
      this.f_width = this.form_field_jq.width();
      this.default_text = this.form_field_jq.data('placeholder') ? this.form_field_jq.data('placeholder') : this.default_text_default;
      container_div = $("<div />", {
        id: this.container_id,
        "class": "chzn-container " + (this.is_rtl ? 'chzn-rtl' : ''),
        style: 'width: ' + this.f_width + 'px;'
      });
      if (this.is_multiple) {
        container_div.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>');
      } else {
        container_div.html('<a href="javascript:void(0)" class="chzn-single"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
      }
      this.form_field_jq.hide().after(container_div);
      this.container = $('#' + this.container_id);
      this.container.addClass("chzn-container-" + (this.is_multiple ? "multi" : "single"));
      this.dropdown = this.container.find('div.chzn-drop').first();
      dd_top = this.container.height();
      dd_width = this.f_width - get_side_border_padding(this.dropdown);
      this.dropdown.css({
        "width": dd_width + "px",
        "top": dd_top + "px"
      });
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chzn-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chzn-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chzn-search').first();
        this.selected_item = this.container.find('.chzn-single').first();
        sf_width = dd_width - get_side_border_padding(this.search_container) - get_side_border_padding(this.search_field);
        this.search_field.css({
          "width": sf_width + "px"
        });
      }
      this.results_build();
      return this.set_tab_index();
    };
    Chosen.prototype.register_observers = function() {
      this.container.mousedown(__bind(function(evt) {
        return this.container_mousedown(evt);
      }, this));
      this.container.mouseenter(__bind(function(evt) {
        return this.mouse_enter(evt);
      }, this));
      this.container.mouseleave(__bind(function(evt) {
        return this.mouse_leave(evt);
      }, this));
      this.search_results.mouseup(__bind(function(evt) {
        return this.search_results_mouseup(evt);
      }, this));
      this.search_results.mouseover(__bind(function(evt) {
        return this.search_results_mouseover(evt);
      }, this));
      this.search_results.mouseout(__bind(function(evt) {
        return this.search_results_mouseout(evt);
      }, this));
      this.form_field_jq.bind("liszt:updated", __bind(function(evt) {
        return this.results_update_field(evt);
      }, this));
      this.search_field.blur(__bind(function(evt) {
        return this.input_blur(evt);
      }, this));
      this.search_field.keyup(__bind(function(evt) {
        return this.keyup_checker(evt);
      }, this));
      this.search_field.keydown(__bind(function(evt) {
        return this.keydown_checker(evt);
      }, this));
      if (this.is_multiple) {
        this.search_choices.click(__bind(function(evt) {
          return this.choices_click(evt);
        }, this));
        return this.search_field.focus(__bind(function(evt) {
          return this.input_focus(evt);
        }, this));
      } else {
        return this.selected_item.focus(__bind(function(evt) {
          return this.activate_field(evt);
        }, this));
      }
    };
    Chosen.prototype.container_mousedown = function(evt) {
      if (evt && evt.type === "mousedown") {
        evt.stopPropagation();
      }
      if (!this.pending_destroy_click) {
        if (!this.active_field) {
          if (this.is_multiple) {
            this.search_field.val("");
          }
          $(document).click(this.click_test_action);
          this.results_show();
        } else if (!this.is_multiple && evt && ($(evt.target) === this.selected_item || $(evt.target).parents("a.chzn-single").length)) {
          evt.preventDefault();
          this.results_toggle();
        }
        return this.activate_field();
      } else {
        return this.pending_destroy_click = false;
      }
    };
    Chosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };
    Chosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };
    Chosen.prototype.input_focus = function(evt) {
      if (!this.active_field) {
        return setTimeout((__bind(function() {
          return this.container_mousedown();
        }, this)), 50);
      }
    };
    Chosen.prototype.input_blur = function(evt) {
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((__bind(function() {
          return this.blur_test();
        }, this)), 100);
      }
    };
    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chzn-container-active")) {
        return this.close_field();
      }
    };
    Chosen.prototype.close_field = function() {
      $(document).unbind("click", this.click_test_action);
      if (!this.is_multiple) {
        this.selected_item.attr("tabindex", this.search_field.attr("tabindex"));
        this.search_field.attr("tabindex", -1);
      }
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chzn-container-active");
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };
    Chosen.prototype.activate_field = function() {
      if (!this.is_multiple && !this.active_field) {
        this.search_field.attr("tabindex", this.selected_item.attr("tabindex"));
        this.selected_item.attr("tabindex", -1);
      }
      this.container.addClass("chzn-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };
    Chosen.prototype.test_active_click = function(evt) {
      if ($(evt.target).parents('#' + this.container_id).length) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };
    Chosen.prototype.results_build = function() {
      var content, data, startTime, _i, _len, _ref;
      startTime = new Date();
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.find("li.search-choice").remove();
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.find("span").text(this.default_text);
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.find("span").text(data.text);
          }
        }
      }
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.html(content);
      return this.parsing = false;
    };
    Chosen.prototype.result_add_group = function(group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + "_g_" + group.array_index;
        return '<li id="' + group.dom_id + '" class="group-result">' + $("<div />").text(group.label).html() + '</li>';
      } else {
        return "";
      }
    };
    Chosen.prototype.result_add_option = function(option) {
      var classes;
      if (!option.disabled) {
        option.dom_id = this.container_id + "_o_" + option.array_index;
        classes = option.selected && this.is_multiple ? [] : ["active-result"];
        if (option.selected) {
          classes.push("result-selected");
        }
        if (option.group_array_index != null) {
          classes.push("group-option");
        }
        return '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '">' + option.html + '</li>';
      } else {
        return "";
      }
    };
    Chosen.prototype.results_update_field = function() {
      this.result_clear_highlight();
      this.result_single_selected = null;
      return this.results_build();
    };
    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };
    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };
    Chosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };
    Chosen.prototype.results_show = function() {
      var dd_top;
      if (!this.is_multiple) {
        this.selected_item.addClass("chzn-single-with-drop");
        if (this.result_single_selected) {
          this.result_do_highlight(this.result_single_selected);
        }
      }
      dd_top = this.is_multiple ? this.container.height() : this.container.height() - 1;
      this.dropdown.css({
        "top": dd_top + "px",
        "left": 0
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };
    Chosen.prototype.results_hide = function() {
      if (!this.is_multiple) {
        this.selected_item.removeClass("chzn-single-with-drop");
      }
      this.result_clear_highlight();
      this.dropdown.css({
        "left": "-9000px"
      });
      return this.results_showing = false;
    };
    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field_jq.attr("tabindex")) {
        ti = this.form_field_jq.attr("tabindex");
        this.form_field_jq.attr("tabindex", -1);
        if (this.is_multiple) {
          return this.search_field.attr("tabindex", ti);
        } else {
          this.selected_item.attr("tabindex", ti);
          return this.search_field.attr("tabindex", -1);
        }
      }
    };
    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };
    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        return this.result_select(evt);
      }
    };
    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };
    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };
    Chosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (this.active_field && !($(evt.target).hasClass("search-choice" || $(evt.target).parents('.search-choice').first)) && !this.results_showing) {
        return this.results_show();
      }
    };
    Chosen.prototype.choice_build = function(item) {
      var choice_id, link;
      choice_id = this.container_id + "_c_" + item.array_index;
      this.choices += 1;
      this.search_container.before('<li class="search-choice" id="' + choice_id + '"><span>' + item.html + '</span><a href="javascript:void(0)" class="search-choice-close" rel="' + item.array_index + '"></a></li>');
      link = $('#' + choice_id).find("a").first();
      return link.click(__bind(function(evt) {
        return this.choice_destroy_link_click(evt);
      }, this));
    };
    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      this.pending_destroy_click = true;
      return this.choice_destroy($(evt.target));
    };
    Chosen.prototype.choice_destroy = function(link) {
      this.choices -= 1;
      this.show_search_field_default();
      if (this.is_multiple && this.choices > 0 && this.search_field.val().length < 1) {
        this.results_hide();
      }
      this.result_deselect(link.attr("rel"));
      return link.parents('li').first().remove();
    };
    Chosen.prototype.result_select = function(evt) {
      var high, high_id, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        high_id = high.attr("id");
        this.result_clear_highlight();
        high.addClass("result-selected");
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.result_single_selected = high;
        }
        position = high_id.substr(high_id.lastIndexOf("_") + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.find("span").first().text(item.text);
        }
        if (!(evt.metaKey && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        this.form_field_jq.trigger("change");
        return this.search_field_scale();
      }
    };
    Chosen.prototype.result_activate = function(el) {
      return el.addClass("active-result").show();
    };
    Chosen.prototype.result_deactivate = function(el) {
      return el.removeClass("active-result").hide();
    };
    Chosen.prototype.result_deselect = function(pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      result_data.selected = false;
      this.form_field.options[result_data.options_index].selected = false;
      result = $("#" + this.container_id + "_o_" + pos);
      result.removeClass("result-selected").addClass("active-result").show();
      this.result_clear_highlight();
      this.winnow_results();
      this.form_field_jq.trigger("change");
      return this.search_field_scale();
    };
    Chosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };
    Chosen.prototype.winnow_results = function() {
      var found, option, part, parts, regex, result_id, results, searchText, startTime, startpos, text, zregex, _i, _j, _len, _len2, _ref;
      startTime = new Date();
      this.no_results_clear();
      results = 0;
      searchText = this.search_field.val() === this.default_text ? "" : $('<div/>').text($.trim(this.search_field.val())).html();
      regex = new RegExp('^' + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $('#' + option.dom_id).hide();
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0) {
              parts = option.html.replace(/\[|\]/g, "").split(" ");
              if (parts.length) {
                for (_j = 0, _len2 = parts.length; _j < _len2; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              if ($("#" + result_id).html !== text) {
                $("#" + result_id).html(text);
              }
              this.result_activate($("#" + result_id));
              if (option.group_array_index != null) {
                $("#" + this.results_data[option.group_array_index].dom_id).show();
              }
            } else {
              if (this.result_highlight && result_id === this.result_highlight.attr('id')) {
                this.result_clear_highlight();
              }
              this.result_deactivate($("#" + result_id));
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };
    Chosen.prototype.winnow_results_clear = function() {
      var li, lis, _i, _len, _results;
      this.search_field.val("");
      lis = this.search_results.find("li");
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        li = $(li);
        _results.push(li.hasClass("group-result") ? li.show() : !this.is_multiple || !li.hasClass("result-selected") ? this.result_activate(li) : void 0);
      }
      return _results;
    };
    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      if (!this.result_highlight) {
        selected_results = !this.is_multiple ? this.search_results.find(".result-selected") : [];
        do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
        if (do_high != null) {
          return this.result_do_highlight(do_high);
        }
      }
    };
    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">No results match "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      return this.search_results.append(no_results_html);
    };
    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };
    Chosen.prototype.keydown_arrow = function() {
      var first_active, next_sib;
      if (!this.result_highlight) {
        first_active = this.search_results.find("li.active-result").first();
        if (first_active) {
          this.result_do_highlight($(first_active));
        }
      } else if (this.results_showing) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          this.result_do_highlight(next_sib);
        }
      }
      if (!this.results_showing) {
        return this.results_show();
      }
    };
    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };
    Chosen.prototype.keydown_backstroke = function() {
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        this.pending_backstroke = this.search_container.siblings("li.search-choice").last();
        return this.pending_backstroke.addClass("search-choice-focus");
      }
    };
    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };
    Chosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            return this.results_hide();
          }
          break;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };
    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          this.keydown_arrow();
          break;
      }
    };
    Chosen.prototype.search_field_scale = function() {
      var dd_top, div, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        if (w > this.f_width - 10) {
          w = this.f_width - 10;
        }
        this.search_field.css({
          'width': w + 'px'
        });
        dd_top = this.container.height();
        return this.dropdown.css({
          "top": dd_top + "px"
        });
      }
    };
    Chosen.prototype.generate_field_id = function() {
      var new_id;
      new_id = this.generate_random_id();
      this.form_field.id = new_id;
      return new_id;
    };
    Chosen.prototype.generate_random_id = function() {
      var string;
      string = "sel" + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
      while ($("#" + string).length > 0) {
        string += this.generate_random_char();
      }
      return string;
    };
    Chosen.prototype.generate_random_char = function() {
      var chars, newchar, rand;
      chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
      rand = Math.floor(Math.random() * chars.length);
      return newchar = chars.substring(rand, rand + 1);
    };
    return Chosen;
  })();
  get_side_border_padding = function(elmt) {
    var side_border_padding;
    return side_border_padding = elmt.outerWidth() - elmt.width();
  };
  root.get_side_border_padding = get_side_border_padding;
}).call(this);
(function() {
  var SelectParser;
  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }
    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };
    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };
    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };
    return SelectParser;
  })();
  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };
  this.SelectParser = SelectParser;
}).call(this);

$(".chosen-select").chosen();

/**
 * Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
 * Licensed under the MIT license
 */

(function(window, document, undefined) {
    "use strict";

    var prefixes = ['webkit', 'Moz', 'ms', 'O'], /* Vendor prefixes */
        animations = {}, /* Animation rules keyed by their name */
        useCssAnimations;

    /**
    * Utility function to create elements. If no tag name is given,
    * a DIV is created. Optionally properties can be passed.
    */
    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div'),
            n;

        for (n in prop) {
            if (prop.hasOwnProperty(n)) {
                el[n] = prop[n];
            }
        }
        return el;
    }

    /**
    * Inserts child1 before child2. If child2 is not specified,
    * child1 is appended. If child2 has no parentNode, child2 is
    * appended first.
    */
    function ins(parent, child1, child2) {
        if (child2 && !child2.parentNode) {
            ins(parent, child2);
        }
        parent.insertBefore(child1, child2||null);
        return parent;
    }

    /**
    * Insert a new stylesheet to hold the @keyframe or VML rules.
    */
    var sheet = (function() {
        var el = createEl('style');
        ins(document.getElementsByTagName('head')[0], el);
        return el.sheet || el.styleSheet;
    })();

    /**
    * Creates an opacity keyframe animation rule and returns its name.
    * Since most mobile Webkits have timing issues with animation-delay,
    * we create separate rules for each line/segment.
    */
    function addAnimation(alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-'),
            start = 0.01 + i/lines*100,
            z = Math.max(1-(1-alpha)/trail*(100-start) , alpha),
            prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase(),
            pre = prefix && '-'+prefix+'-' || '';

        if (!animations[name]) {
            sheet.insertRule(
                '@' + pre + 'keyframes ' + name + '{' +
                '0%{opacity:'+z+'}' +
                start + '%{opacity:'+ alpha + '}' +
                (start+0.01) + '%{opacity:1}' +
                (start+trail)%100 + '%{opacity:'+ alpha + '}' +
                '100%{opacity:'+ z + '}' +
                '}', 0
            );
            animations[name] = 1;
        }
        return name;
    }

    /**
    * Tries various vendor prefixes and returns the first supported property.
    **/
    function vendor(el, prop) {
        var s = el.style,
            pp,
            i;

        if (s[prop] !== undefined) {
            return prop;
        }
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (i=0; i<prefixes.length; i++) {
            pp = prefixes[i]+prop;
            if(s[pp] !== undefined) {
                return pp;
            }
        }
    }

    /**
    * Sets multiple style properties at once.
    */
    function css(el, prop) {
        for (var n in prop) {
            if (prop.hasOwnProperty(n)) {
                el.style[vendor(el, n)||n] = prop[n];
            }
        }
        return el;
    }

    /**
    * Fills in default values.
    */
    function merge(obj) {
        for (var i=1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var n in def) {
                if (obj[n] === undefined) {
                    obj[n] = def[n];
                }
            }
        }
        return obj;
    }

    /**
    * Returns the absolute page-offset of the given element.
    */
    function pos(el) {
        var o = {x:el.offsetLeft, y:el.offsetTop};
        while ((el = el.offsetParent)) {
            o.x+=el.offsetLeft;
            o.y+=el.offsetTop;
        }
        return o;
    }

    /** The constructor */
    var Spinner = function Spinner(o) {
        if (!this.spin) {
            return new Spinner(o);
        }
        this.opts = merge(o || {}, Spinner.defaults, defaults);
    };
    
    var defaults = Spinner.defaults = {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 5, // The line thickness
        radius: 10, // The radius of the inner circle
        color: '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 100, // Afterglow percentage
        opacity: 1/4,
        fps: 20
    };
    var proto = Spinner.prototype = {
        spin: function(target) {
            this.stop();
            var self = this,
                el = self.el = css(createEl(), {position: 'relative'}),
                ep, // element position
                tp; // target position

            if (target) {
                tp = pos(ins(target, el, target.firstChild));
                ep = pos(el);
                css(el, {
                    left: (target.offsetWidth >> 1) - ep.x+tp.x + 'px',
                    top: (target.offsetHeight >> 1) - ep.y+tp.y + 'px'
                });
            }
            el.setAttribute('aria-role', 'progressbar');
            self.lines(el, self.opts);
            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var o = self.opts,
                    i = 0,
                    fps = o.fps,
                    f = fps/o.speed,
                    ostep = (1-o.opacity)/(f*o.trail / 100),
                    astep = f/o.lines;

                (function anim() {
                    i++;
                    for (var s=o.lines; s; s--) {
                        var alpha = Math.max(1-(i+s*astep)%f * ostep, o.opacity);
                        self.opacity(el, o.lines-s, alpha, o);
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000/fps));
                })();
            }
            return self;
        },
        stop: function() {
            var el = this.el;
            if (el) {
                clearTimeout(this.timeout);
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
                this.el = undefined;
            }
            return this;
        }
    };

    proto.lines = function(el, o) {
        var i = 0,
            seg;

        function fill(color, shadow) {
            return css(createEl(), {
                position: 'absolute',
                width: (o.length+o.width) + 'px',
                height: o.width + 'px',
                background: color,
                boxShadow: shadow,
                transformOrigin: 'left',
                transform: 'rotate(' + ~~(360/o.lines*i) + 'deg) translate(' + o.radius+'px' +',0)',
                borderRadius: (o.width>>1) + 'px'
            });
        }

        for (; i < o.lines; i++) {
            seg = css(createEl(), {
                position: 'absolute',
                top: 1+~(o.width/2) + 'px',
                transform: 'translate3d(0,0,0)',
                opacity: o.opacity,
                animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1/o.speed + 's linear infinite'
            });
            if (o.shadow) {
                ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}));
            }
            ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
        }
        return el;
    };
  
    proto.opacity = function(el, i, val) {
        if (i < el.childNodes.length) {
            el.childNodes[i].style.opacity = val;
        }
    };

    /////////////////////////////////////////////////////////////////////////
    // VML rendering for IE
    /////////////////////////////////////////////////////////////////////////

    /**
    * Check and init VML support
    */
    (function() {
        var s = css(createEl('group'), {behavior: 'url(#default#VML)'}),
            i;

        if (!vendor(s, 'transform') && s.adj) {
            
            // VML support detected. Insert CSS rules ...
            for (i=4; i--;) {
                sheet.addRule(['group', 'roundrect', 'fill', 'stroke'][i], 'behavior:url(#default#VML)');
            }

            proto.lines = function(el, o) {
                var r = o.length+o.width,
                    s = 2*r;

                function grp() {
                    return css(createEl('group', {coordsize: s +' '+s, coordorigin: -r +' '+-r}), {width: s, height: s});
                }

                var g = grp(),
                    margin = ~(o.length+o.radius+o.width)+'px',
                    i;

                function seg(i, dx, filter) {
                    ins(g,
                        ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
                            ins(css(createEl('roundrect',
                                        {arcsize: 1}), {
                                        width: r,
                                        height: o.width,
                                        left: o.radius,
                                        top: -o.width>>1,
                                        filter: filter}),
                                createEl('fill', {color: o.color, opacity: o.opacity}),
                                createEl('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
                            )
                        )
                    );
                }

                if (o.shadow) {
                    for (i = 1; i <= o.lines; i++) {
                        seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
                    }
                }
                for (i = 1; i <= o.lines; i++) {
                    seg(i);
                }
                return ins(css(el, {
                    margin: margin + ' 0 0 ' + margin,
                    zoom: 1
                }), g);
            };

            proto.opacity = function(el, i, val, o) {
                var c = el.firstChild;
                o = o.shadow && o.lines || 0;
                if (c && i+o < c.childNodes.length) {
                    c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild;
                    if (c) {
                        c.opacity = val;
                    }
                }
            };
        }
        else {
            useCssAnimations = vendor(s, 'animation');
        }
    })();

    window.Spinner = Spinner;

})(window, document);
//JSHint options
/*global Highcharts, Spinner*/

/*
 * Fix missing indexOf in IE8
 */
if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {
         "use strict";

        var len  = this.length >>> 0,
            from = Number(arguments[1]) || 0;

        from = (from < 0) ? Math.ceil(from) : Math.floor(from);

        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }

        return -1;
    };
}

/*
 * Name space
 */
var HARSTORAGE = HARSTORAGE || {};

/*
 * Time metrics
 */
HARSTORAGE.times = [
    "Full Load Time",
    "onLoad Event",
    "Start Render Time",
    "Time to First Byte"
];

/*
 * Units
 */
HARSTORAGE.Units = {
    "Full Load Time": "s",
    "Total Requests": "",
    "Total Size": "kB",
    "Page Speed Score": "",
    "onLoad Event": "s",
    "Start Render Time": "s",
    "Time to First Byte": "s",
    "Total DNS Time": "ms",
    "Total Transfer Time": "ms",
    "Total Server Time": "ms",
    "Avg. Connecting Time": "ms",
    "Avg. Blocking Time": "ms",
    "Text Size": "kB",
    "Media Size": "kB",
    "Cache Size": "kB",
    "Redirects": "",
    "Bad Rquests": "",
    "Domains":  ""
};

/*
 * Data Converter
 */
HARSTORAGE.Converter = function(points) {
    "use strict";

    // Series data
    var splitResults = points.split(";"),
        numberOfSets = splitResults.length - 2,
        dataArray = [];

    // Labels and Timestamps
    var labels = splitResults[0].split("#"),
        categories = splitResults[1].split("#"),
        numberOfPoints = categories.length,
        pointValue;

    for (var dataSetIndex = 0; dataSetIndex < numberOfSets; dataSetIndex += 1 ) {
        dataArray.push(splitResults[dataSetIndex + 2].split("#"));

        // Convert string values to numbers
        for (var pointIndex = 0; pointIndex < numberOfPoints; pointIndex += 1 ) {
            // Original Value
            pointValue = dataArray[dataSetIndex][pointIndex];

            if (HARSTORAGE.times.indexOf(labels[dataSetIndex]) !== -1) {
                // Parsed value
                pointValue = parseFloat(pointValue / 1000, 10);
                // Rounded value
                if (pointValue > 1){
                    pointValue = Math.round(pointValue * 10) / 10;
                }
            } else {
                // Parsed value
                pointValue = parseInt(pointValue, 10);
            }

            dataArray[dataSetIndex][pointIndex] = pointValue;
        }
    }

    // Colors for Y Axis labels
    var colors = HARSTORAGE.Colors();

    // Y Axis and series
    var yAxis = [],
        series = [];

    for (dataSetIndex = 0; dataSetIndex < numberOfSets; dataSetIndex += 1) {
        yAxis.push({
            title: {
                text: labels[dataSetIndex],
                style: {
                    color: colors[dataSetIndex]
                }
            },
            min: 0,
            opposite: (dataSetIndex%2 === 0) ? false : true,
            showEmpty: false
        });

        series.push({
            name: labels[dataSetIndex],
            yAxis: dataSetIndex,
            data: dataArray[dataSetIndex],
            visible: (dataSetIndex < 3) ? true : false
        });
    }

    return {
        "categories": categories,
        "yAxis": yAxis,
        "series": series
    };
};

/*
 * Timeline chart
 */
HARSTORAGE.Timeline = function(run_info) {
    "use strict";

    this.run_info = run_info;
};

// Get data for timeline
HARSTORAGE.Timeline.prototype.get = function(label, mode) {
    "use strict";

    // Pointer
    var that = this;

    // Retrieve data for timeline via XHR call
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            that.draw(this.responseText);
        }
    };

    var URI = "timeline?label=" + encodeURIComponent(label) + "&mode=" + mode;

    xhr.open("GET", URI, true);
    xhr.send();
};

// Draw timeline
HARSTORAGE.Timeline.prototype.draw = function(points) {
    "use strict";

    // Pointer
    var that = this;

    // Convert data from custom format to arrays for chart
    var converter = HARSTORAGE.Converter(points);

    var categories = converter.categories,
        yAxis = converter.yAxis,
        series = converter.series;

    new Highcharts.Chart({
        chart: {
            renderTo: "timeline",
            zoomType: "x",
            defaultSeriesType: "spline"
        },
        credits: {
            enabled: false
        },
        exporting: {
            buttons: {
                printButton: {
                    enabled: false
                },
                exportButton: {
                    menuItems: [
                        {},
                        null,
                        null,
                        {}
                    ]
                }
            },
            url: "/chart/export",
            filename: "timeline",
            width: 960
        },
        title: {
            text: "Performance Trends"
        },
        xAxis: [{
            categories: categories,
            tickInterval: Math.ceil(categories.length / 10),
            tickmarkPlacement: "on"
        }],
        yAxis: yAxis,
        tooltip: {
            formatter: function() {
                var unit = HARSTORAGE.Units[this.series.name];
                return "<b>" + this.y + " " + unit + "</b>" + " (" + this.x + ")";
            }
        },
        plotOptions: {
            series: {
                cursor: "pointer",
                events: {
                    hide: function() {
                        this.yAxis.axisTitle.hide();
                    },
                    show: function() {
                        this.yAxis.axisTitle.show();
                    }
                },
                point: {
                    events: {
                        click: function() {
                            that.run_info.get(this.category);
                        }
                    }
                }
            }
        },
        series: series
    });
};

/*
 * Histogram Chart
 */
HARSTORAGE.Histogram = function() {
    "use strict";
};

HARSTORAGE.Histogram.prototype.draw = function(points, title) {
    "use strict";

    // Series data
    var splitResults = points.split(";"),
        yAxis  = [],
        series = [];

    series = splitResults[0].split("#");

    var temp_array = splitResults[1].split("#");

    for (var i = 0, l = temp_array.length; i < l; i += 1 ) {
        yAxis.push(parseFloat(temp_array[i], 10));
    }

    // Colors for Y Axis labels
    var color = HARSTORAGE.Colors()[0];

    // Chart Object
    new Highcharts.Chart({
        chart: {
            renderTo: "chart",
            defaultSeriesType: "column"
        },
        credits: {
            enabled: false
        },
        exporting: {
            buttons: {
                printButton: {
                    enabled: false
                },
                exportButton: {
                    menuItems: [
                        {},
                        null,
                        null,
                        {}
                    ]
                }
            },
            url: "/chart/export",
            filename: "histogram",
            width: 960
        },
        title: {
            text: title + " (" + HARSTORAGE.Units[title] + ")"
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                cursor: "pointer"
            }
        },
        xAxis: [{
            categories: series
        }],
        yAxis: [{
            title: {
                text: "Percentage of Total",
                style: {
                    color: color
                }
            },
            min: 0
        }],
        tooltip: {
            formatter: function() {
                var unit = HARSTORAGE.Units[title];
                return "<b>" + this.y + " %</b>" + " (" + this.x + " " + unit + ")";
            }
        },
        series: [{
            data: yAxis
        }]
    });
};

/*
 * Column Chart
 */
HARSTORAGE.Columns = function() {
    "use strict";
};

HARSTORAGE.Columns.prototype.draw = function(points, chart_type) {
    "use strict";

    // Chart type
    chart_type = (typeof(chart_type) !== "undefined") ? chart_type : "column";
    
    // Convert data from custom format to arrays for chart
    var converter = HARSTORAGE.Converter(points);

    var categories = converter.categories,
        yAxis = converter.yAxis,
        series = converter.series;

    // Chart Object
    new Highcharts.Chart({
        chart: {
            renderTo: "chart",
            defaultSeriesType: chart_type
        },
        credits: {
            enabled: false
        },
        exporting: {
            buttons: {
                printButton: {
                    enabled: false
                },
                exportButton: {
                    menuItems: [
                        {},
                        null,
                        null,
                        {}
                    ]
                }
            },
            url: "/chart/export",
            filename: "superposed",
            width: 960            
        },
        title: {
            text: "Performance Trends"
        },
        xAxis: [{
            categories: categories,
            tickInterval: Math.ceil(categories.length / 10),
            tickmarkPlacement: "on"
        }],
        yAxis: yAxis,
        tooltip: {
            formatter: function() {
                var unit = HARSTORAGE.Units[this.series.name];
                return "<b>" + this.y + " " + unit + "</b>" + " (" + this.x + ")";
            }
        },
        plotOptions: {
            series: {
                cursor: "pointer",
                events: {
                    hide: function() {
                        this.yAxis.axisTitle.hide();
                    },
                    show: function() {
                        this.yAxis.axisTitle.show();
                    }
                }
            }
        },
        series: series
    });
};

/*
 * Test results
 */
HARSTORAGE.RunInfo = function(mode, label, query, histo) {
    "use strict";

    // Pointer
    var that = this;

    // Initialize cache
    this.cache = {};

    // Add event handler to selector box
    var run_timestamp = document.getElementById("run_timestamp");

    run_timestamp.onchange = function() {
        that.get();
    };

    // Add event handler to delete button
    var del_btn = document.getElementById("del-btn");

    del_btn.onclick = function() {
        that.del(label, mode, false);
    };

    // Add event handler to delete all button
    var del_all_btn = document.getElementById("del-all-btn");

    del_all_btn.onclick = function() {
        that.del(label, mode, true);
    };

    // Add event handler to aggregation button
    var agg_btn = document.getElementById("agg-btn");

    if (query !== "None") {
        agg_btn.style.display = "inline";
        agg_btn.onclick = function() {
            location.href = query.replace(/amp;/g,"") + "&chart=column&table=true";
        };
    }

    // Add event handler to histogram button
    var histo_btn = document.getElementById("histo");

    if (histo === "true") {
        histo_btn.style.display = "inline";
        histo_btn.onclick = function() {
            location.href = "/superposed/histogram?label=" + label + "&metric=full_load_time";
        };
    }
};

//Page Resources
HARSTORAGE.RunInfo.prototype.resources = function (div, title, hash, units, width) {
    "use strict";

    // Extract data
    var data  = [];

    for (var key in hash) {
        if (hash.hasOwnProperty(key)) {
            data.push( [key, hash[key] ]);
        }
    }

    // Chart object
    new Highcharts.Chart({
        chart: {
            renderTo: div,
            defaultSeriesType: "pie",
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            width: width,
            height: 300
        },
        credits: {
            enabled: false
        },
        exporting: {
            buttons: {
                printButton: {
                    enabled: false
                },
                exportButton: {
                    menuItems: [
                        {},
                        null,
                        null,
                        {}
                    ]
                }
            },
            url:"/chart/export",
            filename: "resources",
            width: width
        },
        title: {
            text: title
        },
        tooltip: {
            formatter: function() {
                return "<b>"+ this.point.name +"</b>: "+ this.y + units;
            }
        },
        plotOptions: {            
            series: {
                showInLegend: true
            }
        },
        series: [{
            data: data
        }]
    });
};

//Page Speed details
HARSTORAGE.RunInfo.prototype.pagespeed = function (pagespeed) {
    "use strict";

    // Spliting data for chart
    var rules   = ["Total Score"],
        scores  = [pagespeed["Total Score"]];

    for (var rule in pagespeed) {
        if (pagespeed.hasOwnProperty(rule) && rule !== "Total Score") {
            rules.push(rule);
            scores.push(pagespeed[rule]);
        }
    }

    // Chart height
    var height = Math.max(75 + 20 * rules.length, 100);

    // Chart object
    new Highcharts.Chart({
        chart: {
            renderTo: "pagespeed",
            defaultSeriesType: "bar",
            height: height,
            width: 930
        },
        credits: {
            enabled: false
        },
        exporting: {
            buttons: {
                printButton: {
                    enabled: false
                },
                exportButton: {
                    enabled: false
                }
            }
        },
        title: {
            text: "Page Speed Scores"
        },
        xAxis: {
            title: {
                text: null
            },
            categories: rules,
            labels: {
                formatter: function() {
                    if (this.value === "Total Score") {
                        return "<b>@" + this.value + "</b>";
                    } else {
                        return this.value;
                    }
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            min: 0,
            max: 105,
            endOnTick: false
        },
        tooltip: {
            formatter: function() {
                return this.x +": "+ this.y;
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            series: {
                showInLegend: false,
                animation: false
            }
        },
        series: [{
            data: scores
        }]
    });
};

//Get data for Run Info
HARSTORAGE.RunInfo.prototype.get = function(opt_ts) {
    "use strict";

    // Pointer
    var that = this;

    // Dynamic data
    this.json = [];

    // Show Ajax spinner
    this.spinner.style.display = "block";

    // Formatter
    this.formatter = function(value, units) {
        // Default units
        if (typeof(units) === "undefined") {
            units = "";
        }

        // Formatter
        switch ( typeof(value) ) {
        case "number":
            if (value >= 1000) {
                var seconds = Math.floor(value/1000);
                var milliseconds = value - seconds*1000;

                if (milliseconds < 10) {
                    milliseconds = "00" + milliseconds;
                } else if (milliseconds < 100) {
                    milliseconds = "0" + milliseconds;
                }
                
                return seconds + " " +  milliseconds + " " + units;
            } else {
                return value + " " + units;
            }
            break;
        case "string":
            return value;
        default:
            return "n/a";
        }
    };

    // Update test results
    var set_data = function() {
        // Update cache
        if (typeof(that.cache[that.URI]) === "undefined") {
            that.json = JSON.parse(that.xhr.responseText);
            that.cache[that.URI] = that.json;
        }

        // Summary
        $("#full-load-time").html(that.formatter(that.json.summary.full_load_time, "ms"));
        $("#onload-event").html(that.formatter(that.json.summary.onload_event, "ms"));
        $("#start-render-time").html(that.formatter(that.json.summary.start_render_time, "ms"));
        $("#time-to-first-byte").html(that.formatter(that.json.summary.time_to_first_byte, "ms"));

        $("#total-dns-time").html(that.formatter(that.json.summary.total_dns_time, "ms"));
        $("#total-transfer-time").html(that.formatter(that.json.summary.total_transfer_time, "ms"));
        $("#total-server-time").html(that.formatter(that.json.summary.total_server_time, "ms"));
        $("#avg-connecting-time").html(that.formatter(that.json.summary.avg_connecting_time, "ms"));
        $("#avg-blocking-time").html(that.formatter(that.json.summary.avg_blocking_time, "ms"));

        $("#total-size").html(that.formatter(that.json.summary.total_size, "kB"));
        $("#text-size").html(that.formatter(that.json.summary.text_size, "kB"));
        $("#media-size").html(that.formatter(that.json.summary.media_size, "kB"));
        $("#cache-size").html(that.formatter(that.json.summary.cache_size, "kB"));

        $("#requests").html(that.formatter(that.json.summary.requests));
        $("#redirects").html(that.formatter(that.json.summary.redirects));
        $("#bad-requests").html(that.formatter(that.json.summary.bad_requests));
        $("#domains").html(that.formatter(that.json.summary.domains));

        // HAR Viewer
        var iframe  = document.createElement("iframe");
        var url = "/results/harviewer?inputUrl=/results/download%3Fid%3D";
            url += that.json.har;
            url += "&expand=true";

        iframe.setAttribute("src", url);
        iframe.setAttribute("width", "940");
        iframe.setAttribute("id", "harviewer-iframe");
        iframe.setAttribute("frameBorder", "0");
        iframe.setAttribute("frameBorder", "0");
        iframe.setAttribute("scrolling", "no");

        $("#harviewer").html(iframe);

        window.setTimeout("HARSTORAGE.autoHeight()", 300);

        // New tab feature of HAR Viewer
        var newtab = document.getElementById("newtab");

        newtab.onclick = function () {
            window.open(url);
        };

        // Resources by Size
        setTimeout(
            function() {
                that.resources("by-size", "Resources by Size", that.json.weights, " kB", 450);
            },
            50
        );

        // Resources by Requests
        setTimeout(
            function() {
                that.resources("by-req", "Resources by Requests", that.json.requests, "", 450);
            },
            150
        );

        // Domains by Size
        setTimeout(
            function() {
                that.resources("domains-by-size", "Domains by Size", that.json.d_weights, " kB", 930);
            },
            250
        );

        // Domains by Requests
        setTimeout(
            function() {
                that.resources("domains-by-req", "Domains by Requests", that.json.d_requests, "", 930);
            },
            350
        );

        // Page Speed Details
        setTimeout(
            function() {
                that.pagespeed(that.json.pagespeed);
            },
            450
        );

        // Hide Ajax spinner
        that.spinner.style.display = "none";
    };

    // Request data via XHR or read from cache
    
    // Get timestamp from argument of function or from select box
    var selector = document.getElementById("run_timestamp"),
        timestamp;

    if (typeof(opt_ts) !== "undefined") {
        timestamp = opt_ts;

        // Update select box
        for (var i = 0, len = selector.options.length; i < len; i += 1 ) {
            if (selector.options[i].value === opt_ts) {
                selector.selectedIndex = i;
                $("#run_timestamp").trigger("liszt:updated");
            }
        }
    } else {
        timestamp   = selector.options[selector.selectedIndex].text;
    }

    this.URI = "runinfo?timestamp=" + timestamp;

    this.xhr = new XMLHttpRequest();

    this.xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            set_data();
        }
    };

    if (typeof(this.cache[this.URI]) === "undefined") {
        this.xhr.open("GET", this.URI, true);
        this.xhr.send();
    } else {
        this.json = this.cache[this.URI];
        set_data();
    }
};

//Delete current run from set of test results
HARSTORAGE.RunInfo.prototype.del = function(id, mode, all) {
    "use strict";

    //
    var answer = window.confirm("Are you sure?");

    if (answer === true) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                window.location = this.responseText;
            }
        };

        var ts_selector = document.getElementById("run_timestamp");
        var timestamp   = ts_selector.options[ts_selector.selectedIndex].text;
        var URI = "deleterun?timestamp=" + timestamp;
            URI += "&label=" + id;
            URI += "&mode=" + mode;
            URI += "&all=" + all;

        xhr.open("GET", URI, true);
        xhr.send();
    }
};

// Add delay for async rendering
HARSTORAGE.RunInfo.prototype.changeVisibility = function () {
    "use strict";

    var del_btn     = document.getElementById("del-btn"),
        del_all_btn = document.getElementById("del-all-btn"),
        newtab_btn  = document.getElementById("newtab");
    
    del_btn.style.display       = "inline";
    del_all_btn.style.display   = "inline";
    newtab_btn.style.display    = "inline";
};

HARSTORAGE.RunInfo.prototype.timedStyleChange = function () {
    "use strict";

    setTimeout(this.changeVisibility, 1000);
};

HARSTORAGE.RunInfo.prototype.addSpinner = function() {
    "use strict";

    // Spinner object
    this.spinner = document.getElementById("spinner");
    new Spinner(HARSTORAGE.SpinnerOpts).spin(this.spinner);
};

/*
 * Auto Height module
 */
HARSTORAGE.autoHeight = function() {
    "use strict";

    var iframe = document.getElementById("harviewer-iframe");
    iframe.height = iframe.contentDocument.body.offsetHeight;
};

/*
 * Aggregated Statistics
 */
HARSTORAGE.AggregatedStatistics = function(id) {
    "use strict";

    // Determine metric type from Query string
    var metric,
        href;

    if (location.href.indexOf("metric") === -1) {
        href = location.href + "&metric=";
        metric = "Average";
    } else {
        href = location.href.split("metric")[0] + "metric=";
        metric = location.href.split("metric")[1].split("=")[1];

        if (metric === "90th%20Percentile") {
            metric = "90th Percentile";
        }
    }

    // Update selector box active option
    var selector = document.getElementById(id);

    for (var i = 0, len = selector.options.length; i < len; i += 1 ) {
        if (selector.options[i].value === metric) {
            selector.selectedIndex = i;
            $("#" + id).trigger("liszt:updated");
            break;
        }
    }

    // Add event handler to selector box
    selector.onchange = function() {
        location.href = href + this.value;
    };
};

/*
 * Superpose Form
 */
HARSTORAGE.SuperposeForm = function() {
    "use strict";

    // Pointer
    var that = this;

    // Initialize cache
    this.cache = {};

    // Select box event handler
    var selector = document.getElementById("step_1_label");
    selector.onchange = function() {
        that.setTimestamps(this.name);
    };

    // Submit button event handler
    var submit = document.getElementById("submit");
    submit.onclick = function() {
        return that.submit();
    };

    // Add button event handler
    var add = document.getElementById("step_1_add");
    add.onclick = function() {
        that.add(this);
    };

    // Delete button event handler
    var del = document.getElementById("step_1_del");
    del.onclick = function() {
        that.del(this);
    };
    del.style.display = "none";

    // Chart options
    var checkbox = document.getElementById("column");
    checkbox.onclick = function() {
        that.checkbox(this);
    };

    checkbox = document.getElementById("spline");
    checkbox.onclick = function() {
        that.checkbox(this);
    };
};

// Form validation
HARSTORAGE.SuperposeForm.prototype.submit = function() {
    "use strict";

    var selectors = document.getElementsByTagName("select");

    for (var i = 0, len = selectors.length/3; i < len; i += 1) {
        var id = 1 + i*3;

        var start_ts    = selectors.item(id).options[ selectors.item(id).options.selectedIndex ].value;
        var end_ts      = selectors.item(id+1).options[ selectors.item(id+1).options.selectedIndex ].value;

        if (end_ts < start_ts) {
            window.alert("Invalid timestamps!");
            return false;
        }
    }

    var form = document.getElementById("superpose-form");
    form.onsubmit = "return true;";

    return true;
};

// Add new step
HARSTORAGE.SuperposeForm.prototype.add = function(button) {
    "use strict";

    var i,
        len,
        prev_button;

    var that = this;

    // Find previous and new id
    var prev_id = button.id.split("_")[0] + "_" + button.id.split("_")[1],
        new_id = prev_id.split("_")[0] + "_" + ( parseInt ( prev_id.split("_")[1], 10) +1 );

    // Add new line to container
    var prev_div = document.getElementById(prev_id),
        new_div = prev_div.cloneNode(true);

    new_div.setAttribute("id", new_id);

    var container = document.getElementById("container");
    container.appendChild(new_div);

    // Update name and id of selectors
    var selectors = new_div.getElementsByTagName("select");

    for (i = selectors.length; i -- ; ) {
        switch (selectors.item(i).name) {
        case prev_id + "_label":
            selectors.item(i).name  = new_id + "_label";
            selectors.item(i).id    = new_id + "_label";
            selectors.item(i).onchange = function() {
                that.setTimestamps(this.name);
            };
            break;
        case prev_id + "_start_ts":
            selectors.item(i).name  = new_id + "_start_ts";
            selectors.item(i).id    = new_id + "_start_ts";
            break;
        case prev_id + "_end_ts":
            selectors.item(i).name  = new_id + "_end_ts";
            selectors.item(i).id    = new_id + "_end_ts";
            break;
        default:
            break;
        }
    }

    // Update inputs
    var inputs = new_div.getElementsByTagName("input");

    for (i = 0, len = inputs.length; i < len; i += 1) {
        switch (inputs.item(i).id) {
        case prev_id + "_add":
            // Set new id
            inputs.item(i).id = new_id + "_add";

            // Hide previous button
            prev_button = document.getElementById(prev_id + "_add");
            prev_button.style.display = "none";

            // Set event handler
            inputs.item(i).onclick = function() {
                that.add(this);
            };
            break;
        case prev_id + "_del":
            // Set new id
            inputs.item(i).id = new_id + "_del";

            // Hide previous button
            prev_button = document.getElementById(prev_id + "_del");
            prev_button.style.display = "none";

            // Show current button
            inputs.item(i).style.display = "inline";

            // Set event handler
            inputs.item(i).onclick = function() {
                that.del(this);
            };
            break;
        default:
            break;
        }
    }
    // Update head
    var divs = new_div.getElementsByTagName("div");

    for (i = 0, len = divs.length; i < len; i += 1) {
        if (divs.item(i).id === prev_id + "_head" ) {
            // New id
            divs.item(i).id = new_id + "_head";

            // New label
            divs.item(i).innerHTML = "Set " + new_id.split("_")[1] + " &gt;";
        }
    }

    // Update timestamp
    this.setTimestamps(new_id + "_label");
};

// Delete selected step
HARSTORAGE.SuperposeForm.prototype.del = function(button) {
    "use strict";

    var prev_button;

    // Calculate id
    var id = button.id.split("_")[0] + "_" + button.id.split("_")[1],
        prev_id = button.id.split("_")[0] + "_" + (parseInt( button.id.split("_")[1], 10) - 1);

    // Get DIVs
    var div = document.getElementById(id),
        container = document.getElementById("container");

    // Delete current line
    container.removeChild(div);

    // Show previous button
    prev_button = document.getElementById(prev_id + "_add");
    prev_button.style.display = "inline";

    if (prev_id !== "step_1") {
        prev_button = document.getElementById(prev_id + "_del");
        prev_button.style.display = "inline";
    }
};

// Set timelines for selected label
HARSTORAGE.SuperposeForm.prototype.setTimestamps = function(id) {
    "use strict";

    // Poiner
    var that = this;

    // Dynamic data
    this.dates = [];

    // Show Ajax spinner
    this.spinner.style.display = "block";

    // Update timestamps
    var set_data = function() {
        var i,
            len,
            ts;

        // Calculate id
        id  = id.split("_")[0] + "_" + id.split("_")[1];

        // Hide Ajax spinner
        that.spinner.style.display = "none";

        // Update cache
        if (typeof(that.cache[that.URI]) === "undefined") {
            that.dates = that.xhr.responseText.split(";");
            that.cache[that.URI] = that.dates;
        } else {
            that.dates.reverse();
        }

        // Start timestamps
        var select = document.getElementById(id + "_start_ts");
        select.options.length = 0;

        for (i = 0, len = that.dates.length; i < len; i += 1) {
            ts = that.dates[i];
            select.options[i] = new Option(ts, ts, false, false);
        }

        // End timestamps
        select = document.getElementById(id + "_end_ts");
        select.options.length = 0;
        that.dates.reverse();

        for (i = 0, len = that.dates.length; i < len; i += 1) {
            ts = that.dates[i];
            select.options[i] = new Option(ts, ts, false, false);
        }
    };

    // Request data via XHR or read from cache
    var select = document.getElementById(id);
    var label = select.options[select.selectedIndex].text;
    this.URI = "dates?label=" + label;

    this.xhr = new XMLHttpRequest();

    this.xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            set_data();
        }
    };

    if (typeof(this.cache[this.URI]) === "undefined") {
        this.xhr.open("GET", this.URI, true);
        this.xhr.send();
    } else {
        this.dates = this.cache[this.URI];
        set_data();
    }
};
// Add Ajax spinner
HARSTORAGE.SuperposeForm.prototype.addSpinner = function() {
    "use strict";

    this.spinner = document.getElementById("spinner");
    new Spinner(HARSTORAGE.SpinnerOpts).spin(this.spinner);
};

// Checkbox group
HARSTORAGE.SuperposeForm.prototype.checkbox = function(input) {
    "use strict";

    var id1  = "spline",
        id2  = "column",
        id;

    if (input.checked) {
        id = (input.id === id1) ? id2 : id1;
        var checkbox = document.getElementById(id);
        checkbox.checked = false;
    }
};
/* 
    7/31/2015
    CodeMonkeny : Will Canada
    Description : This script is the js Side of our casperjs/python interface
                  Handles all client side request/response
 */
(function EctoControl($,ecto1){
    
    $(document).ready(function(){
        setTimeout(function(){
            
            ecto1.casper = ecto1.casper ||{};
    
            var scriptSelect = $('#casperScripts'),
                urlText   = $('#harPerfUrls'),
                optionsCont  = $('#scriptOptCont'),
                submitButton = $('#ghostIt'),
                waitTime = $('#waitTime'),
                waitTimeCont = $('#waitTimeCont'),
                timesToExe = $('#timesToExe'),
                timesToExeCont = $('#exeTimeCont'),
                scriptOutputCont = $('#scriptOutput'),
                payLoad = null,
                scriptIsRunning = false,
                testLabel = $('#testLabel'),
                start = null,
                target = null,
                myTimer = null,
                elapsed = '0.0',
                mainContent = $('#mainContent'),
                resultsTab = $('#mainContent ul li:first-child'),
                resultsCont = $('#resultsCont'),
                enableThrottle = $('#enableThrottle'),
                throttleCont   = $('#throttlingCont'),
                throttleSpeed = $('#networkThrottle');


            ecto1.aux = ecto1.aux || {};
            ecto1.wraith = ecto1.wraith ||{};


            // Send a request to python to scan the script directory and return a list
            // of available scripts to be populated in the drop down.
            ecto1.casper.populateAvailableScripts = function(directory){

            };

            enableThrottle.on('click',function(){
                if($(enableThrottle).is(":checked")){
                    throttleSpeed.prop('disabled',false);
                }
                else{
                   throttleSpeed.prop('disabled',true); 
                }

            });


            resultsTab.on('click',function(){
                $.ajax({
                    url: "/results/results",
                    type: "GET",

                    success:function(response){
                        resultsCont.html(response);
                        $('#stats_table').dataTable({
                            "bJQueryUI": true,
                            "sPaginationType": "full_numbers",
                            "sDom": 'R<"H"lfr>t<"F"ip<',
                            "bAutoWidth": false,
                            "iDisplayLength": 100,
                            "aaSorting": [[ 0, "desc" ]]
                        });
                        $('#summary-table').css('visibility', 'visible');
                    },
                    error:function(){
                        resultsCont.prepend("Problem updating results, please refresh the page manually.");
                    }         
                });
            });


            scriptSelect.on('change',function(){


                removeAppendedNodes();


                switch(scriptSelect.val()){
                    case'0':{
                            toggleButtonState(submitButton);
                            break;
                    }
                    case'1':{ //harperf script load additional form fields
                            showCasperOptions();   
                            toggleButtonState(submitButton,'enabled');
                            $('#loadBuffer').load("/casperjs/harJsonFiles",function(){
                                optionsCont.append($(this).html());
                            }); 

                            setTimeout(updateUrlText,2000);

                        break;
                    }
                    case '2':{
                            toggleButtonState(submitButton);
                            hideCasperOptions();
                             $('#loadBuffer').load("/wraith/loadWraithForm",function(){
                                    optionsCont.append($(this).html());
                                }); 
                            setTimeout(ecto1.wraith.attachEventHandlers,1000);

                            break;
                    }
                    default:{
                       break;     
                    }
                }
            });
            submitButton.on('click',function(){
                 scriptOutputCont.html('');
                switch(scriptSelect.val()){
                    case'1':{
                            postHarScript();
                            break;
                    }
                    case'2':{
                            ecto1.wraith.disableControls();
                            ecto1.wraith.getLatestImages();
                            break;
                    }
                    default:{
                            break;
                    }
                }
                toggleButtonState(submitButton);
            });

            function updateUrlText(){
                urlText = $('#harPerfUrls');
                testLabel = $('#testLabel');
            }

            function removeAppendedNodes(){
                var nodes = $('.appendedNode');
                for(i=0; i < nodes.length; i++){

                    nodes[i].remove();
                }
            }


            function postHarScript(){

                scriptOutputCont.append('<div>-------Running the selected Script, Please Wait -------</div></br></br>');
                var tempTime = waitTime.val();
                var speed = 0;
                if(tempTime<1){
                    tempTime=1;
                }

                if(enableThrottle.is(":checked")){
                    speed = throttleSpeed.val();
                }
                tempTime = String(tempTime*1000);

                payLoad = {
                        'script' : scriptSelect.val(),
                        'waitTime' : tempTime ,
                        'timesToExe' : timesToExe.val(),
                        'urls' : urlText.val(),
                        'testLabel': testLabel.val(),
                        'throttleSpeed':speed
                    };

                payLoad = JSON.stringify(payLoad);

                $.ajax({
                    url: "/casperjs/exeScript",
                    type: "POST",
                    data:  payLoad,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                    beforeSend:function(){
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });

                    },

                    success:function(response){
                        response += '</br><div>------- End of Script Output ------</div></br></br>';
                        scriptOutputCont.append(response);
                    },
         
                    error: function (response) {
                       
                       if(response.responseText.length){
                            scriptOutputCont.append("There was a problem executing the script : " + response.responseText);
                       }
                       else{
                           scriptOutputCont.append("There was a problem executing the script : " + JSON.stringify(response)); 
                       }
                    },
                    complete: function(){
                        toggleButtonState(submitButton,'enabled');
                        ecto1.aux.stopTimer();
                    }

                });
            }

            function toggleButtonState(target,arg){
                var button = $(target);

                if(arg==='enabled'){
                   button.prop('disabled',false);
                   button.css('background-color','#498a2d');
                }
                else{
                   button.prop('disabled',true);
                   button.css('background-color','red');
                }
            }


            $(document).ready(function(){
                ecto1.casper.populateAvailableScripts();
                if(scriptSelect.val()==='0'){
                    toggleButtonState(submitButton);
                }
            });


            ecto1.aux.toggleButtonState = function(target,arg){
                return toggleButtonState(target,arg);
            };
            ecto1.aux.startTimer = function(){
                start = new Date().getTime();
                target = $('#timer');
                var hrs=0,mins=0,secs=0;

                myTimer = setInterval(function()
                {
                    var time = new Date().getTime() - start;

                    elapsed = Math.floor(time / 100) / 10;
                    if(Math.round(elapsed) === elapsed) { elapsed += '.0'; }

                    secs = Math.floor(elapsed%60);
                    if(elapsed>3599){
                       hrs = Math.floor(elapsed/3600);
                       mins = Math.floor(elapsed/60)%60;

                    }
                    else if( elapsed > 59){
                      mins = Math.floor(elapsed/60)%60; 
                    }

                    $(target).html(" Script has been running for " +hrs+" :hours " + mins + " :minutes " + secs +" :seconds.");

                }, 100);
            };

            ecto1.aux.stopTimer = function(){
                clearInterval(myTimer);
            };

            function hideCasperOptions(){
                waitTimeCont.hide();
                timesToExeCont.hide();
                throttleCont.hide();

            }

            function showCasperOptions(){
                waitTimeCont.show();
                timesToExeCont.show();
                throttleCont.show();
            }

            ecto1.casper.hideOptions = function(){
                return hideCasperOptions();
            };

            ecto1.casper.showOptions = function(){
                return showCasperOptions();
            };


            return ecto1;
        },3000);
    });
    
})(jQuery,ecto1 = window.ecto1 || {});
/* 
    2/17/2016
    CodeMonkeny(s) : Will Canada, Connor Finholt
    Description : This script is the front end handler for executing wraith from our python web interface.
 */

(function WraithControl($,ecto1){
    
    $(document).ready(function(){
        setTimeout(function(){
    
            //Make sure our namespaces are defined this allows us to access and resuse functionality across scripts.
            ecto1.casper = ecto1.casper ||{};
            ecto1.wraith = ecto1.wraith ||{};
            //Set all of our variables at the top as javascript uses hoisting anyways. http://www.w3schools.com/js/js_hoisting.asp 
            //We also do not have to create mulitple references to the same dom elements this way.
            var pathCheckbox = $("#newPathCheck"),
                 siteCheckbox = $("#newSiteCheck"),
                 siteName = $("#newSiteName"),
                 updateButton = $("#updateData"),
                 pathCheckbox = $("#newPathCheck"),
                 pathSelect = $("#existingPathsSel"),
                 secureCheckbox = $('#secureProtoCheck'),
                 siteSelect = $('#existingSiteSel'),
                 removeButton = $("#removeData"),
                 baseImageCheckbox = $('#newBaselineCheck'),
                 urlText = $('#pathsInput'),
                 resultsCont = $('#resultsCont'),
                 scriptOutputCont = $('#scriptOutputCont'),
                 pathLabel = $('#newPathLabel'),
                 removeSiteCheckbox = $('#removeSiteCheck'),
                 penumbraTab = $('#mainContent ul li:nth-child(3)'),
                 executeButton = $('#ghostIt');


            //Gets our data from the backend
            function getExistingSites(){
                $.ajax({
                    url: "/wraith/getExistingSites",
                    type: "GET",

                    success:function(response){
                       populateExistingSites(response);
                    },
                    error:function(){
                        resultsCont.prepend("Problem updating results, please refresh the page manually.");
                    }         
                });
            }

            function populateExistingSites(response){

                //Removes extra quotes and parses the data
                var temp = JSON.parse(response).slice(0,response.length-1);
                temp = JSON.parse(temp);

                siteSelect.children("option").remove();
                siteSelect.append("<option>Please Choose</option>");
                for (i = 0; i < temp.sites.length; i++) {
                    siteSelect.append("<option value = "+temp.sites[i].siteName+">"+temp.sites[i].siteName+"</option>");
                }
            }

            function getSitePaths(arg){
                $.ajax({
                    url: "/wraith/getExistingSitePaths?siteName="+encodeURI(arg),
                    type: "GET",

                    success:function(response){
                       populatePaths(response);
                    },
                    error:function(){
                        resultsCont.prepend("Problem updating results, please refresh the page manually.");
                    }         
                });
            }

            function populatePaths(response){

                var temp = JSON.parse(response);

                //Removes existing children every time a new site is selected
                pathSelect.children("option").remove();
                pathSelect.append("<option>Existing Paths</option>");

                //Populates path select box with backend data
                for(i = 0; i < temp.paths.length; i++) {
                    pathSelect.append("<option value = "+temp.paths[i].url+">"+temp.paths[i].url+"</option>");
                }
            }

            //Responsible for adding or removing a site path to an existing site   
            function updateSitePaths(arg){


                var delPath = false,
                    update = false,
                    builtPaths = '',
                    payLoad = null,
                    pathLabels=null,
                    pathUrls=null,
                    protocol="https";

                if(arg!==true && arg !==false){
                    arg=false;
                }

                delPath = arg;

                if(delPath){

                    if(pathSelect.children().length<=2 || $('#existingPathsSel :selected').length > pathSelect.children.length-1){
                        alert("You can not delete all paths from a site. Sites require atleast one path.");
                        return;
                    }
                    if(confirm("Delete The Selected Test Paths From The System?")){
                        update = true;
                    }
                }
                else{
                   if(confirm("Add" + urlText.val() + " as paths to site" + siteSelect.val() + " ?")){
                        update = true;
                        ecto1.aux.toggleButtonState(updateButton);
                    } 
                }

                if(update){

                    //Deleting Paths
                    if(delPath){

                        //Build up list of the selected Paths
                        var selectedPaths = [];
                        $("#existingPathsSel :selected").each(function(){
                            selectedPaths.push($(this).val());
                        });

                        //We need to build up our path object
                        for(var i=0; i < selectedPaths.length; i++){
                            if(i===selectedPaths.length-1){
                              builtPaths += '{"url": "' + selectedPaths[i] + '", "label":"removeLabel"}';   
                            }
                            else{
                               builtPaths += '{"url": "' + selectedPaths[i] + '", "label":"removeLabel"},';  
                            }
                        }
                        builtPaths = '{"paths":['+builtPaths+']}';

                    }
                    else{ //Adding Paths
                        //Every Path Entry requires a lable, we need to validate this and inform the user if this requirment is not met.
                        pathLabels = pathLabel.val().split(",");
                        pathUrls   = urlText.val().split(",");

                        if(pathLabels.length!==pathUrls.length||pathLabels[0].valueOf()===""){
                           return alert("Every path entry requires a label. Label 1 is associated with Path 1. Please make sure you have at least one path and each path has a label.");
                        }
                        else{
                             siteCheckbox.trigger('click');
                            //We need to build up our path object
                            for(var i=0; i < pathLabels.length; i++){
                                if(i===pathLabels.length-1){
                                  builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'}';   
                                }
                                else{
                                   builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'},';  
                                }
                            }
                            builtPaths = '{"paths":['+builtPaths+']}';
                        }

                        if(!secureCheckbox.is(':checked')){
                            protocol="http";
                        }
                    }

                    payLoad = {
                        'siteName' : siteSelect.val(),
                        'paths' : builtPaths,
                        'protocol' : protocol,
                        'removePaths': delPath
                    };


                    payLoad = JSON.stringify(payLoad);

                    $.ajax({
                        url: "/wraith/updateSitePaths",
                        type: "POST",
                        data: payLoad,
                        async: true,
                        timeout:0,
                        contentType: 'application/json; charset=utf-8',

                        beforeSend:function(){
                           scriptOutputCont.html('--- Script Output ---');
                           scriptOutputCont.append('<div>------- Updating Site Paths for : ' + siteSelect.val() + ' -------</div></br></br>');
                           scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                             ecto1.aux.startTimer(); 
                           });

                        },

                        success:function(response){
                                response += '</br><div>------- End of Script Output ------</div></br></br>';
                                scriptOutputCont.append(response);
                                getSitePaths(siteSelect.val());
                                if(!delPath){
                                    urlText.val('');
                                    pathLabel.val('');
                                    pathCheckbox.prop('checked',false);
                                    pathCheckbox.trigger('change');
                                    pathCheckbox.prop('checked',false);
                                }
                            },
                        error:function(response){
                            scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                        },
                        complete: function(){
                            ecto1.aux.stopTimer();
                        }
                    });    
                }
            }

            function getLatestTestImages(){
                var protocol = 'https';

                if(!secureCheckbox.is(':checked')){
                    protocol="http";
                }

                var payload = {
                    'siteName' : siteSelect.val(),
                    'protocol' : protocol
                },
                p = '?siteName='+siteSelect.val()+'&num=2';

                payload = JSON.stringify(payload);

                $.ajax({
                    url: "/wraith/getLatestTestImages",
                    type: "POST",
                    data: payload,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                    beforeSend:function(){
                       scriptOutputCont.html('--- Script Output ---');
                       scriptOutputCont.append('<div>------- Getting Latest Images for site : ' + siteSelect.val() + ' -------</div></br></br>');
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });

                    },

                    success: function (response) {

                        $.ajax({
                            url: "wraith/returnProcessOutput"+encodeURI(p),
                            type: "GET",

                            success:function(response){
                                response += '</br><div>------- End of Script Output ------</div></br></br>';
                                scriptOutputCont.append(response);
                                siteSelect.prop('disabled',false);
                                siteSelect.trigger('change');
                                siteCheckbox.prop('disabled',false);
                                pathSelect.prop('disabled',false);
                                setTimeout(function(){
                                    alert("Latest Images Successfully updated");
                                },200);
                            },
                            error:function(response){
                                scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                            }

                        });

                    },
                    error: function (response) {   
                        scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));    
                    },
                    complete: function(){
                        ecto1.aux.stopTimer();
                    }
                });
            }

            function addNewSite(){

               if(siteName.val()===""){
                   alert("Please make sure you have filled out the new site information.");
                   return;
               }

               var builtPaths ='',
                   protocol ='https',
                   payLoad = '',
                   p = '?siteName='+siteName.val()+'&num=1',
                   pathLabels = '',
                   pathUrls = '';

                if(!secureCheckbox.is(':checked')){
                    protocol="http";
                }

                //Every Path Entry requires a lable, we need to validate this and inform the user if this requirment is not met.
                pathLabels = pathLabel.val().split(",");
                pathUrls   = urlText.val().split(",");

                if(pathLabels.length!==pathUrls.length||pathLabels[0].valueOf()===""){
                   return alert("Every path entry requires a label. Label 1 is associated with Path 1. Please make sure you have at least one path and each path has a label.");
                }
                else{
                     disableAllControls();
                    //We need to build up our path object
                    for(var i=0; i < pathLabels.length; i++){
                        if(i===pathLabels.length-1){
                          builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'}';   
                        }
                        else{
                           builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'},';  
                        }
                    }
                    builtPaths = '{"paths":['+builtPaths+']}';
                }

                payLoad = {
                        'siteName' : siteName.val(),
                        'paths' : builtPaths,
                        'protocol' : protocol
                    };


                payLoad = JSON.stringify(payLoad);

                $.ajax({
                    url: "/wraith/generateSiteYaml",
                    type: "POST",
                    data:  payLoad,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                    beforeSend:function(){
                       scriptOutputCont.html("---Script OutPut---");
                       scriptOutputCont.append('<div>------- Adding New Entry for site : ' + siteName.val() + ' -------</div></br></br>');
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });

                    },

                    success: function (response) {

                        scriptOutputCont.append(response);

                        if(!response.includes("already exists")){
                            $.ajax({
                                url: "wraith/returnProcessOutput"+encodeURI(p),
                                type: "GET",

                                success:function(response){
                                    response += '</br><div>------- End of Script Output ------</div></br></br>';
                                    scriptOutputCont.append(response);
                                    getExistingSites();
                                },
                                error:function(){
                                    scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                                }
                            });
                        }
                        else{
                            alert(response);
                        }

                    },
                    error: function (response) {   
                        scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));    
                    },
                    complete: function(){
                        ecto1.aux.stopTimer();                
                        siteSelect.prop('disabled',false);
                        siteSelect.trigger('change');
                        siteCheckbox.prop('disabled',false);
                        pathSelect.prop('disabled',false);
                    }
                });
            }

            function genNewBaseImages(){
                var protocol = 'https';

                if(!secureCheckbox.is(':checked')){
                    protocol="http";
                }

                var payload = {
                    'siteName' : siteSelect.val(),
                    'protocol' : protocol
                },
                p = '?siteName='+siteSelect.val()+'&num=1';

                payload = JSON.stringify(payload);

                $.ajax({
                    url: "/wraith/generateBaseTestImages",
                    type: "POST",
                    data: payload,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                   beforeSend:function(){
                       scriptOutputCont.html('--- Script Output ---');
                       scriptOutputCont.append('<div>------- Regenerating Base Test Images for site : ' + siteSelect.val() + ' -------</div></br></br>');
                       ecto1.aux.toggleButtonState(updateButton);
                       baseImageCheckbox.prop('checked',false);
                       baseImageCheckbox.prop('disabled',true);
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });
                    },

                    success: function (response) {

                        $.ajax({
                            url: "wraith/returnProcessOutput"+encodeURI(p),
                            type: "GET",

                            success:function(response){
                                response += '</br><div>------- End of Script Output ------</div></br></br>';

                                scriptOutputCont.append(response);
                                siteSelect.prop('disabled',false);
                                siteSelect.trigger('change');
                                setTimeout(function(){
                                    alert('Base Images Generated Successfully');
                                },200);
                            },
                            error:function(){
                                scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                            } 
                        }); 
                    },
                    error: function (response) {   
                        scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));    
                    },
                    complete: function(){
                        ecto1.aux.stopTimer();
                    }
                });
            }

            function removeExistingSite(){

                if($('#existingSiteSel').children().length <= 2){
                    alert('The system requires at least one site exists. If you wish to delete this site, add another first.');
                    removeSiteCheckbox.trigger('click');
                    return;
                }

                if(confirm("Are you sure you wish to delete the site " + siteSelect.val() + "? \n This will completely remove all paths and images from the system.")){

                    ecto1.aux.toggleButtonState(updateButton);

                    $.ajax({
                        url: "/wraith/removeExistingSite?siteName="+encodeURI(siteSelect.val()),
                        type: "PUT",
                        beforeSend:function(){
                            scriptOutputCont.html("---Script Output---");
                            scriptOutputCont.append('<div>------- Attempting to Delete : ' + siteSelect.val() + ' -------</div></br></br>');
                            scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                              ecto1.aux.startTimer(); 
                            });
                         },

                        success:function(response){
                           scriptOutputCont.append(response);
                           getExistingSites();
                        },
                        error:function(response){
                             scriptOutputCont.append("Problem removing the site : " + response);
                            ;
                        },
                        complete: function(){
                            ecto1.aux.stopTimer();
                            removeSiteCheckbox.trigger('click');

                        }
                    });
                }
            }

            function getWraithGalleries(){
                $.ajax({
                     url: "/wraith/loadWraithGalleryIndex",
                     type: "GET",

                     success:function(response){
                        $('#linkCont').html(response);
                     },
                     error:function(){
                         $('#linkCont').prepend("Problem updating results, please refresh the page manually.");
                     }         
                });
            }

            penumbraTab.on('click',function(){
                getWraithGalleries();
            });

            function disableAllControls(){
                pathCheckbox.prop('disabled',true);
                pathCheckbox.prop('checked',false);
                siteCheckbox.prop('disabled',true);
                siteCheckbox.prop('checked',false);
                siteName.prop('disabled',true);
                pathSelect.prop('disabled',true);
                siteSelect.prop('disabled',true);
                secureCheckbox.prop('disabled',true);
                secureCheckbox.prop('checked',false);
                baseImageCheckbox.prop('disabled',true);
                baseImageCheckbox.prop('checked',false);
                urlText.prop('disabled',true);
                removeSiteCheckbox.prop('disabled',true);
                removeSiteCheckbox.prop('checked',false);
                pathLabel.prop('disabled',true);
                ecto1.aux.toggleButtonState(updateButton);
                ecto1.aux.toggleButtonState(removeButton);

            }



            //Allows our event handlers to be assigned dynamically/ at load time.

            function attachEventHandlers(){
                pathCheckbox = $("#newPathCheck"),
                siteCheckbox = $("#newSiteCheck"),
                siteName = $("#newSiteName"),
                updateButton = $("#updateData"),
                pathCheckbox = $("#newPathCheck"),
                pathSelect = $("#existingPathsSel"),
                siteSelect = $('#existingSiteSel'),
                removeButton = $("#removeData"),
                secureCheckbox = $('#secureProtoCheck'),
                baseImageCheckbox = $('#newBaselineCheck'),
                urlText = $('#pathsInput'),
                removeSiteCheckbox = $('#removeSiteCheck'),
                pathLabel = $('#newPathLabel');

                 //Was once newSiteChecked()
                siteCheckbox.on('change',function(e){

                    e.stopImmediatePropagation();

                    //Enables button and textbox when checked
                    if ($(siteCheckbox).is(':checked')) {
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        siteName.prop('disabled',false);
                        secureCheckbox.prop('disabled',false);
                        secureCheckbox.prop('checked',true);
                        baseImageCheckbox.prop('disabled',true);
                        baseImageCheckbox.prop('checked',true);
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',true);
                        urlText.prop('disabled',false);
                        pathLabel.prop('disabled',false);
                        siteSelect.prop('disabled',true);
                        siteSelect.prop('selectedIndex',0);
                        //Removes existing children every time a new site is selected
                        pathSelect.children("option").remove();
                        pathSelect.append("<option>Existing Paths</option>");
                        ecto1.aux.toggleButtonState(executeButton);
                        removeSiteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('checked',false);
                    }

                    //Disables button and textbox when unchecked
                    else {
                        siteName.prop('disabled',true);
                        ecto1.aux.toggleButtonState(updateButton);
                        siteSelect.prop('disabled',false);
                        secureCheckbox.prop('disabled',true);
                        secureCheckbox.prop('checked',false);
                        baseImageCheckbox.prop('disabled',true);
                        baseImageCheckbox.prop('checked',false);
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',false);
                        urlText.prop('disabled',true);
                        pathLabel.prop('disabled',true);
                        if(siteSelect.prop('selectedIndex')>0){
                            removeSiteCheckbox.prop('disabled',false);
                        }   
                    }
                });


                baseImageCheckbox.on('click', function() {
                    if ($(baseImageCheckbox).is(':checked')) {
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        ecto1.aux.toggleButtonState(executeButton);
                        pathSelect.prop('disabled',true);
                        pathCheckbox.prop('disabled',true);
                        siteSelect.prop('disabled',true);
                        siteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('disabled',true);
                    }
                    else {
                        ecto1.aux.toggleButtonState(updateButton);
                        pathSelect.prop('disabled',false);
                        pathCheckbox.prop('disabled',false);
                        siteCheckbox.prop('disabled',false);
                        siteSelect.prop('disabled',false);
                        removeSiteCheckbox.prop('disabled',false);
                    }
                });

                //Enables/disables specific form elements when a selection is made.
                siteSelect.on('change', function(){
                    if(siteSelect.val() !== '' && siteSelect.val() !== 'Please Choose'){
                        //If we have a selection, disabled everything else, except for path alteration options, gen new base images, and the run script button
                        getSitePaths(siteSelect.val());
                        baseImageCheckbox.prop('disabled',false);
                        baseImageCheckbox.prop('checked',false);
                        ecto1.aux.toggleButtonState(executeButton,'enabled');
                        pathCheckbox.prop('disabled',false);
                        removeSiteCheckbox.prop('disabled',false);
                    }
                    else {
                        baseImageCheckbox.prop('checked',false);
                        baseImageCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('checked',false);
                        ecto1.aux.toggleButtonState(executeButton);
                        ecto1.aux.toggleButtonState(updateButton);
                        //Removes existing children every time a new site is selected
                        pathSelect.children("option").remove();
                        pathSelect.append("<option>Existing Paths</option>");
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',false);
                    }
                });

                removeSiteCheckbox.on("change",function(){
                    if(removeSiteCheckbox.is(':checked')){
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        ecto1.aux.toggleButtonState(executeButton);
                        siteName.prop('disabled',true);
                        secureCheckbox.prop('disabled',true);
                        secureCheckbox.prop('checked',false);
                        baseImageCheckbox.prop('disabled',true);
                        baseImageCheckbox.prop('checked',false);
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',false);
                        urlText.prop('disabled',true);
                        pathLabel.prop('disabled',true);
                        siteSelect.prop('disabled',true);
                        pathSelect.prop('disabled',true);
                        siteCheckbox.prop('disabled',true);
                    }
                    else{
                        ecto1.aux.toggleButtonState(updateButton);
                        siteName.prop('disabled',true);
                        baseImageCheckbox.prop('disabled',false);
                        pathCheckbox.prop('disabled',false);
                        siteSelect.prop('disabled',false);
                        pathSelect.prop('disabled',false);
                        siteCheckbox.prop('disabled',false);
                    }

                });

                //Was removePathChecked
                pathSelect.on('change', function(){
                    //All this event handler needs to do is enable the submit button to remove the path if a value is selected.
                    //The data will be manipulated on the backend and returned to the front end.
                    if(pathSelect.val() !== null && pathSelect.val() !="Existing Paths"){
                        ecto1.aux.toggleButtonState(removeButton,'enabled');
                    }
                    else{
                       ecto1.aux.toggleButtonState(removeButton); 
                    }
                });

                //Remove selections if the user selects outside.
                pathSelect.on('blur',function(){  
                    setTimeout(function(){
                       pathSelect.prop('selectedIndex',0); 
                       ecto1.aux.toggleButtonState(removeButton); 
                    },450);

                });

                updateButton.on('click',function() {
                    //This method should build a payload to be submitted to the back end. The data will be updated there and returned to front end.
                    //We are adding a new site
                    if(siteCheckbox.is(":checked")){
                        setTimeout(function(){
                            addNewSite();
                        },200);

                    }
                    else if(baseImageCheckbox.is(":checked")){

                        genNewBaseImages();
                    }
                    else if(pathCheckbox.is(":checked")){
                        updateSitePaths(); 
                    }
                    else if(removeSiteCheckbox.is(":checked")){
                        removeExistingSite();
                    }
                });

                removeButton.on('click',function() {
                    updateSitePaths(true);
                });

                pathCheckbox.on('change',function(){
                    if(pathCheckbox.is(':checked')){
                        secureCheckbox.prop('disabled',false);
                        urlText.prop('disabled',false);
                        pathLabel.prop('disabled',false);
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        pathSelect.prop('disabled',true);
                        baseImageCheckbox.prop('disabled',true);
                        siteCheckbox.prop('disabled',true);
                        siteSelect.prop('disabled',true);
                        removeSiteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('checked',false);
                    }
                    else{
                        secureCheckbox.prop('disabled',true);
                        urlText.prop('disabled',true);
                        pathLabel.prop('disabled',true);
                        ecto1.aux.toggleButtonState(updateButton);
                        pathSelect.prop('disabled',false);
                        baseImageCheckbox.prop('disabled',false);
                        siteCheckbox.prop('disabled',false);
                        removeSiteCheckbox.prop('disabled',false);
                        siteSelect.prop('disabled',false);
                    }

                });

                getExistingSites();
            }

            ecto1.wraith.attachEventHandlers = function(){
                return attachEventHandlers();
            };

            ecto1.wraith.getLatestImages = function(){
                return getLatestTestImages();
            };

            ecto1.wraith.disableControls = function(){
                return disableAllControls();
            };

            $(document).ready(function(){
                getWraithGalleries(); 
            });


            return ecto1;
        },1000);
        
    });
    
})(jQuery,ecto1 = window.ecto1 || {});
/*==================================================
    License (http://www.opensource.org/licenses/mit-license.php)

    Copyright (c) 2006 Patrick Fitzgerald

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation files
    (the "Software"), to deal in the Software without restriction,
    including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software,
    and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    ==================================================*/

function TabberObj(argsObj) {
    "use strict";

    var arg; /* name of an argument to override */

    /* Element for the main tabber div. If you supply this in argsObj,
       then the init() method will be called.
    */
    this.div = null;

    /* Class of the main tabber div */
    this.classMain = "tabber";

    /* Rename classMain to classMainLive after tabifying
       (so a different style can be applied)
    */
    this.classMainLive = "tabberlive";

    /* Class of each DIV that contains a tab */
    this.classTab = "tabbertab";

    /* Class to indicate which tab should be active on startup */
    this.classTabDefault = "tabbertabdefault";

    /* Class for the navigation UL */
    this.classNav = "tabbernav";

    /* When a tab is to be hidden, instead of setting display='none', we
       set the class of the div to classTabHide. In your screen
       stylesheet you should set classTabHide to display:none.  In your
       print stylesheet you should set display:block to ensure that all
       the information is printed.
    */
    this.classTabHide = "tabbertabhide";

    /* Class to set the navigation LI when the tab is active, so you can
       use a different style on the active tab.
    */
    this.classNavActive = "tabberactive";

    /* Elements that might contain the title for the tab, only used if a
       title is not specified in the TITLE attribute of DIV classTab.
    */
    this.titleElements = ['h2','h3','h4','h5','h6'];

    /* Should we strip out the HTML from the innerHTML of the title elements?
       This should usually be true.
    */
    this.titleElementsStripHTML = true;

    /* If the user specified the tab names using a TITLE attribute on
       the DIV, then the browser will display a tooltip whenever the
       mouse is over the DIV. To prevent this tooltip, we can remove the
       TITLE attribute after getting the tab name.
    */
    this.removeTitle = true;

    /* If you want to add an id to each link set this to true */
    this.addLinkId = false;

    /* If addIds==true, then you can set a format for the ids.
       <tabberid> will be replaced with the id of the main tabber div.
       <tabnumberzero> will be replaced with the tab number
           (tab numbers starting at zero)
       <tabnumberone> will be replaced with the tab number
           (tab numbers starting at one)
       <tabtitle> will be replaced by the tab title
           (with all non-alphanumeric characters removed)
     */
    this.linkIdFormat = '<tabberid>nav<tabnumberone>';

    /* You can override the defaults listed above by passing in an object:
         var mytab = new tabber({property:value,property:value});
    */
    for (arg in argsObj) {
        if (argsObj.hasOwnProperty(arg)) {
            this[arg] = argsObj[arg];
        }
    }

    /* Create regular expressions for the class names; Note: if you
       change the class names after a new object is created you must
       also change these regular expressions.
    */
    this.REclassMain = new RegExp('\\b' + this.classMain + '\\b', 'gi');
    this.REclassMainLive = new RegExp('\\b' + this.classMainLive + '\\b', 'gi');
    this.REclassTab = new RegExp('\\b' + this.classTab + '\\b', 'gi');
    this.REclassTabDefault = new RegExp('\\b' + this.classTabDefault + '\\b', 'gi');
    this.REclassTabHide = new RegExp('\\b' + this.classTabHide + '\\b', 'gi');

    /* Array of objects holding info about each tab */
    this.tabs = [];

    /* If the main tabber div was specified, call init() now */
    if (this.div) {
        this.init(this.div);

        /* We don't need the main div anymore, and to prevent a memory leak
           in IE, we must remove the circular reference between the div
           and the tabber object. */
        this.div = null;
    }
}

/*--------------------------------------------------
    Methods for TabberObj
  --------------------------------------------------*/

TabberObj.prototype.init = function(e) {
    "use strict";

    /* Set up the tabber interface.

       e = element (the main containing div)

       Example:
       init(document.getElementById('mytabberdiv'))
    */

    var childNodes, /* child nodes of the tabber div */
        i, i2, /* loop indices */
        t, /* object to store info about a single tab */
        defaultTab=0, /* which tab to select by default */
        DOM_ul, /* tabbernav list */
        DOM_li, /* tabbernav list item */
        DOM_a, /* tabbernav link */
        aId, /* A unique id for DOM_a */
        headingElement; /* searching for text to use in the tab */

    /* Verify that the browser supports DOM scripting */
    if (!document.getElementsByTagName) {
        return false;
    }

    /* If the main DIV has an ID then save it. */
    if (e.id) {
        this.id = e.id;
    }

    /* Clear the tabs array (but it should normally be empty) */
    this.tabs.length = 0;

    /* Loop through an array of all the child nodes within our tabber element. */
    childNodes = e.childNodes;
    for (i=0; i < childNodes.length; i++) {
        
        /* Find the nodes where class="tabbertab" */
        if(childNodes[i].className &&
             childNodes[i].className.match(this.REclassTab)) {

            /* Create a new object to save info about this tab */
            t = {};

            /* Save a pointer to the div for this tab */
            t.div = childNodes[i];

            /* Add the new object to the array of tabs */
            this.tabs[this.tabs.length] = t;

            /* If the class name contains classTabDefault,
               then select this tab by default.
            */
            if (childNodes[i].className.match(this.REclassTabDefault)) {
                defaultTab = this.tabs.length-1;
            }
        }
    }

    /* Create a new UL list to hold the tab headings */
    DOM_ul = document.createElement("ul");
    DOM_ul.className = this.classNav;

    /* Loop through each tab we found */
    for (i=0; i < this.tabs.length; i++) {

        t = this.tabs[i];

        /* Get the label to use for this tab:
             From the title attribute on the DIV,
             Or from one of the this.titleElements[] elements,
             Or use an automatically generated number.
         */
        t.headingText = t.div.title;

        /* Remove the title attribute to prevent a tooltip from appearing */
        if (this.removeTitle) { t.div.title = ''; }

        if (!t.headingText) {

            /* Title was not defined in the title of the DIV,
               So try to get the title from an element within the DIV.
               Go through the list of elements in this.titleElements
               (typically heading elements ['h2','h3','h4'])
            */
            for (i2=0; i2<this.titleElements.length; i2++) {
                headingElement = t.div.getElementsByTagName(this.titleElements[i2])[0];
                if (headingElement) {
                    t.headingText = headingElement.innerHTML;
                    if (this.titleElementsStripHTML) {
                        t.headingText.replace(/<br>/gi," ");
                        t.headingText = t.headingText.replace(/<[^>]+>/g,"");
                    }
                    break;
                }
            }
        }

        if (!t.headingText) {
            /* Title was not found (or is blank) so automatically generate a
               number for the tab.
            */
            t.headingText = i + 1;
        }

        /* Create a list element for the tab */
        DOM_li = document.createElement("li");

        /* Save a reference to this list item so we can later change it to
             the "active" class */
        t.li = DOM_li;

        /* Create a link to activate the tab */
        DOM_a = document.createElement("a");
        DOM_a.appendChild(document.createTextNode(t.headingText));
        DOM_a.href = "javascript:void(null);";
        DOM_a.title = t.headingText;
        DOM_a.onclick = this.navClick;

        /* Add some properties to the link so we can identify which tab
             was clicked. Later the navClick method will need this.
        */
        DOM_a.tabber = this;
        DOM_a.tabberIndex = i;

        /* Do we need to add an id to DOM_a? */
        if (this.addLinkId && this.linkIdFormat) {

            /* Determine the id name */
            aId = this.linkIdFormat;
            aId = aId.replace(/<tabberid>/gi, this.id);
            aId = aId.replace(/<tabnumberzero>/gi, i);
            aId = aId.replace(/<tabnumberone>/gi, i+1);
            aId = aId.replace(/<tabtitle>/gi, t.headingText.replace(/[^a-zA-Z0-9\-]/gi, ''));

            DOM_a.id = aId;
        }

        /* Add the link to the list element */
        DOM_li.appendChild(DOM_a);

        /* Add the list element to the list */
        DOM_ul.appendChild(DOM_li);
    }

    /* Add the UL list to the beginning of the tabber div */
    e.insertBefore(DOM_ul, e.firstChild);

    /* Make the tabber div "live" so different CSS can be applied */
    e.className = e.className.replace(this.REclassMain, this.classMainLive);

    /* Activate the default tab, and do not call the onclick handler */
    this.tabShow(defaultTab);

    return this;
};


TabberObj.prototype.navClick = function(event) {
    "use strict";

    /* This method should only be called by the onClick event of an <A>
       element, in which case we will determine which tab was clicked by
       examining a property that we previously attached to the <A>
       element.

       Since this was triggered from an onClick event, the variable
       "this" refers to the <A> element that triggered the onClick
       event (and not to the TabberObj).

       When TabberObj was initialized, we added some extra properties
       to the <A> element, for the purpose of retrieving them now. Get
       the TabberObj object, plus the tab number that was clicked.
    */

    var rVal, /* Return value from the user onclick function */
        a, /* element that triggered the onclick event */
        self, /* the tabber object */
        tabberIndex, /* index of the tab that triggered the event */
        onClickArgs; /* args to send the onclick function */

    a = this;

    if (!a.tabber) {
        return false;
    }

    self = a.tabber;
    tabberIndex = a.tabberIndex;

    /* Remove focus from the link because it looks ugly.
       I don't know if this is a good idea...
    */
    a.blur();

    /* If the user specified an onClick function, call it now.
       If the function returns false then do not continue.
    */
    if (typeof self.onClick === 'function') {
        onClickArgs = {'tabber':self, 'index':tabberIndex, 'event':event};

        /* IE uses a different way to access the event object */
        if (!event) {
            onClickArgs.event = window.event;
        }

        rVal = self.onClick(onClickArgs);
        if (rVal === false) { return false; }
    }

    self.tabShow(tabberIndex);

    return false;
};


TabberObj.prototype.tabHideAll = function() {
    "use strict";

    var i; /* counter */

    /* Hide all tabs and make all navigation links inactive */
    for (i = 0; i < this.tabs.length; i++) {
        this.tabHide(i);
    }
};


TabberObj.prototype.tabHide = function(tabberIndex) {
    "use strict";

    var div;

    if (!this.tabs[tabberIndex]) {
        return false;
    }

    /* Hide a single tab and make its navigation link inactive */
    div = this.tabs[tabberIndex].div;

    /* Hide the tab contents by adding classTabHide to the div */
    if (!div.className.match(this.REclassTabHide)) {
        div.className += ' ' + this.classTabHide;
    }
    this.navClearActive(tabberIndex);

    return this;
};


TabberObj.prototype.tabShow = function(tabberIndex) {
    "use strict";

    /* Show the tabberIndex tab and hide all the other tabs */

    var div;

    if (!this.tabs[tabberIndex]) {
        return false;
    }

    /* Hide all the tabs first */
    this.tabHideAll();

    /* Get the div that holds this tab */
    div = this.tabs[tabberIndex].div;

    /* Remove classTabHide from the div */
    div.className = div.className.replace(this.REclassTabHide, '');

    /* Mark this tab navigation link as "active" */
    this.navSetActive(tabberIndex);

    /* If the user specified an onTabDisplay function, call it now. */
    if (typeof this.onTabDisplay === 'function') {
        this.onTabDisplay({'tabber':this, 'index':tabberIndex});
    }

    return this;
};

TabberObj.prototype.navSetActive = function(tabberIndex) {
    "use strict";

    /* Note: this method does *not* enforce the rule
       that only one nav item can be active at a time.
    */

    /* Set classNavActive for the navigation list item */
    this.tabs[tabberIndex].li.className = this.classNavActive;

    return this;
};


TabberObj.prototype.navClearActive = function(tabberIndex) {
    "use strict";

    /* Note: this method does *not* enforce the rule
       that one nav should always be active.
    */

    /* Remove classNavActive from the navigation list item */
    this.tabs[tabberIndex].li.className = '';

    return this;
};

(function tabberAutomatic() {
    "use strict";

    /* This function finds all DIV elements in the document where
       class=tabber.classMain, then converts them to use the tabber
       interface.

       tabberArgs = an object to send to "new tabber()"
    */
    var tempObj, /* Temporary tabber object */
        divs, /* Array of all divs on the page */
        i, /* Loop index */
        tabberArgs = {};

    /* Create a tabber object so we can get the value of classMain */
    tempObj = new TabberObj(tabberArgs);

    /* Find all DIV elements in the document that have class=tabber */

    /* First get an array of all DIV elements and loop through them */
    setTimeout(function(){
       divs = document.getElementsByTagName("div");
        for (i=0; i < divs.length; i++) {

            /* Is this DIV the correct class? */
            if (divs[i].className &&
            divs[i].className.match(tempObj.REclassMain)) {

                /* Now tabify the DIV */
                tabberArgs.div = divs[i];
                divs[i].tabber = new TabberObj(tabberArgs);
            }
        } 
    },100);
    
})();
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Need to put all init code from the jsloader.html files in here.
 */

(function initTemplates($,ecto1,HARSTORAGE){
    var superpose_form = null;
    
   
    ecto1.initCreate = function(){
        superpose_form = new HARSTORAGE.SuperposeForm();
        superpose_form.addSpinner();
        superpose_form.setTimestamps("step_1_label"); 
    };
    
    
    ecto1.initHome = function(){
       $('#stats_table').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "sDom": 'R<"H"lfr>t<"F"ip<',
                "bAutoWidth": false,
                "iDisplayLength": 100,
                "aaSorting": [[ 0, "desc" ]]
            });

        $('#summary-table').css('visibility', 'visible'); 
    };
    
    
    return ecto1;
})(jQuery,ecto1 = window.ecto1 || {},HARSTORAGE = window.HARSTORAGE || {});
