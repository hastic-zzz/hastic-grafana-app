define(["angular","app/core/config","app/core/core","app/core/core_module","app/core/time_series2","app/core/utils/kbn","app/core/utils/ticks","app/plugins/sdk","jquery","lodash","moment"], function(__WEBPACK_EXTERNAL_MODULE_angular__, __WEBPACK_EXTERNAL_MODULE_grafana_app_core_config__, __WEBPACK_EXTERNAL_MODULE_grafana_app_core_core__, __WEBPACK_EXTERNAL_MODULE_grafana_app_core_core_module__, __WEBPACK_EXTERNAL_MODULE_grafana_app_core_time_series2__, __WEBPACK_EXTERNAL_MODULE_grafana_app_core_utils_kbn__, __WEBPACK_EXTERNAL_MODULE_grafana_app_core_utils_ticks__, __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__, __WEBPACK_EXTERNAL_MODULE_jquery__, __WEBPACK_EXTERNAL_MODULE_lodash__, __WEBPACK_EXTERNAL_MODULE_moment__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/charenc/charenc.js":
/*!******************************************!*\
  !*** ../node_modules/charenc/charenc.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "../node_modules/crypt/crypt.js":
/*!**************************************!*\
  !*** ../node_modules/crypt/crypt.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "../node_modules/is-buffer/index.js":
/*!******************************************!*\
  !*** ../node_modules/is-buffer/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "../node_modules/md5/md5.js":
/*!**********************************!*\
  !*** ../node_modules/md5/md5.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "../node_modules/crypt/crypt.js"),
      utf8 = __webpack_require__(/*! charenc */ "../node_modules/charenc/charenc.js").utf8,
      isBuffer = __webpack_require__(/*! is-buffer */ "../node_modules/is-buffer/index.js"),
      bin = __webpack_require__(/*! charenc */ "../node_modules/charenc/charenc.js").bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "../node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js":
/*!***********************************************************************!*\
  !*** ../node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*!
 * perfect-scrollbar v1.3.0
 * (c) 2017 Hyunje Jun
 * @license MIT
 */
function get(element) {
  return getComputedStyle(element);
}

function set(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val + "px";
    }
    element.style[key] = val;
  }
  return element;
}

function div(className) {
  var div = document.createElement('div');
  div.className = className;
  return div;
}

var elMatches =
  typeof Element !== 'undefined' &&
  (Element.prototype.matches ||
    Element.prototype.webkitMatchesSelector ||
    Element.prototype.msMatchesSelector);

function matches(element, query) {
  if (!elMatches) {
    throw new Error('No element matching method supported');
  }

  return elMatches.call(element, query);
}

function remove(element) {
  if (element.remove) {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

function queryChildren(element, selector) {
  return Array.prototype.filter.call(element.children, function (child) { return matches(child, selector); }
  );
}

var cls = {
  main: 'ps',
  element: {
    thumb: function (x) { return ("ps__thumb-" + x); },
    rail: function (x) { return ("ps__rail-" + x); },
    consuming: 'ps__child--consume',
  },
  state: {
    focus: 'ps--focus',
    active: function (x) { return ("ps--active-" + x); },
    scrolling: function (x) { return ("ps--scrolling-" + x); },
  },
};

/*
 * Helper methods
 */
var scrollingClassTimeout = { x: null, y: null };

function addScrollingClass(i, x) {
  var classList = i.element.classList;
  var className = cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]);
  } else {
    classList.add(className);
  }
}

function removeScrollingClass(i, x) {
  scrollingClassTimeout[x] = setTimeout(
    function () { return i.isAlive && i.element.classList.remove(cls.state.scrolling(x)); },
    i.settings.scrollingThreshold
  );
}

function setScrollingClassInstantly(i, x) {
  addScrollingClass(i, x);
  removeScrollingClass(i, x);
}

var EventElement = function EventElement(element) {
  this.element = element;
  this.handlers = {};
};

var prototypeAccessors = { isEmpty: { configurable: true } };

EventElement.prototype.bind = function bind (eventName, handler) {
  if (typeof this.handlers[eventName] === 'undefined') {
    this.handlers[eventName] = [];
  }
  this.handlers[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function unbind (eventName, target) {
    var this$1 = this;

  this.handlers[eventName] = this.handlers[eventName].filter(function (handler) {
    if (target && handler !== target) {
      return true;
    }
    this$1.element.removeEventListener(eventName, handler, false);
    return false;
  });
};

EventElement.prototype.unbindAll = function unbindAll () {
    var this$1 = this;

  for (var name in this$1.handlers) {
    this$1.unbind(name);
  }
};

prototypeAccessors.isEmpty.get = function () {
    var this$1 = this;

  return Object.keys(this.handlers).every(
    function (key) { return this$1.handlers[key].length === 0; }
  );
};

Object.defineProperties( EventElement.prototype, prototypeAccessors );

var EventManager = function EventManager() {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function eventElement (element) {
  var ee = this.eventElements.filter(function (ee) { return ee.element === element; })[0];
  if (!ee) {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function bind (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function unbind (element, eventName, handler) {
  var ee = this.eventElement(element);
  ee.unbind(eventName, handler);

  if (ee.isEmpty) {
    // remove
    this.eventElements.splice(this.eventElements.indexOf(ee), 1);
  }
};

EventManager.prototype.unbindAll = function unbindAll () {
  this.eventElements.forEach(function (e) { return e.unbindAll(); });
  this.eventElements = [];
};

EventManager.prototype.once = function once (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (evt) {
    ee.unbind(eventName, onceHandler);
    handler(evt);
  };
  ee.bind(eventName, onceHandler);
};

function createEvent(name) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  } else {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
  }
}

var processScrollDiff = function(
  i,
  axis,
  diff,
  useScrollingClass,
  forceFireReachEvent
) {
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var fields;
  if (axis === 'top') {
    fields = [
      'contentHeight',
      'containerHeight',
      'scrollTop',
      'y',
      'up',
      'down' ];
  } else if (axis === 'left') {
    fields = [
      'contentWidth',
      'containerWidth',
      'scrollLeft',
      'x',
      'left',
      'right' ];
  } else {
    throw new Error('A proper axis should be provided');
  }

  processScrollDiff$1(i, diff, fields, useScrollingClass, forceFireReachEvent);
};

function processScrollDiff$1(
  i,
  diff,
  ref,
  useScrollingClass,
  forceFireReachEvent
) {
  var contentHeight = ref[0];
  var containerHeight = ref[1];
  var scrollTop = ref[2];
  var y = ref[3];
  var up = ref[4];
  var down = ref[5];
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var element = i.element;

  // reset reach
  i.reach[y] = null;

  // 1 for subpixel rounding
  if (element[scrollTop] < 1) {
    i.reach[y] = 'start';
  }

  // 1 for subpixel rounding
  if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
    i.reach[y] = 'end';
  }

  if (diff) {
    element.dispatchEvent(createEvent(("ps-scroll-" + y)));

    if (diff < 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + up)));
    } else if (diff > 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + down)));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }

  if (i.reach[y] && (diff || forceFireReachEvent)) {
    element.dispatchEvent(createEvent(("ps-" + y + "-reach-" + (i.reach[y]))));
  }
}

function toInt(x) {
  return parseInt(x, 10) || 0;
}

function isEditable(el) {
  return (
    matches(el, 'input,[contenteditable]') ||
    matches(el, 'select,[contenteditable]') ||
    matches(el, 'textarea,[contenteditable]') ||
    matches(el, 'button,[contenteditable]')
  );
}

function outerWidth(element) {
  var styles = get(element);
  return (
    toInt(styles.width) +
    toInt(styles.paddingLeft) +
    toInt(styles.paddingRight) +
    toInt(styles.borderLeftWidth) +
    toInt(styles.borderRightWidth)
  );
}

var env = {
  isWebKit:
    typeof document !== 'undefined' &&
    'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)),
  supportsIePointer:
    typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
  isChrome:
    typeof navigator !== 'undefined' &&
    /Chrome/i.test(navigator && navigator.userAgent),
};

var updateGeometry = function(i) {
  var element = i.element;

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  if (!element.contains(i.scrollbarXRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('x')).forEach(function (el) { return remove(el); }
    );
    element.appendChild(i.scrollbarXRail);
  }
  if (!element.contains(i.scrollbarYRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('y')).forEach(function (el) { return remove(el); }
    );
    element.appendChild(i.scrollbarYRail);
  }

  if (
    !i.settings.suppressScrollX &&
    i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth
  ) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(
      i,
      toInt(i.railXWidth * i.containerWidth / i.contentWidth)
    );
    i.scrollbarXLeft = toInt(
      (i.negativeScrollAdjustment + element.scrollLeft) *
        (i.railXWidth - i.scrollbarXWidth) /
        (i.contentWidth - i.containerWidth)
    );
  } else {
    i.scrollbarXActive = false;
  }

  if (
    !i.settings.suppressScrollY &&
    i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight
  ) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(
      i,
      toInt(i.railYHeight * i.containerHeight / i.contentHeight)
    );
    i.scrollbarYTop = toInt(
      element.scrollTop *
        (i.railYHeight - i.scrollbarYHeight) /
        (i.contentHeight - i.containerHeight)
    );
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    element.classList.add(cls.state.active('x'));
  } else {
    element.classList.remove(cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = 0;
  }
  if (i.scrollbarYActive) {
    element.classList.add(cls.state.active('y'));
  } else {
    element.classList.remove(cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }
};

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = { width: i.railXWidth };
  if (i.isRtl) {
    xRailOffset.left =
      i.negativeScrollAdjustment +
      element.scrollLeft +
      i.containerWidth -
      i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  set(i.scrollbarXRail, xRailOffset);

  var yRailOffset = { top: element.scrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right =
        i.contentWidth -
        (i.negativeScrollAdjustment + element.scrollLeft) -
        i.scrollbarYRight -
        i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left =
        i.negativeScrollAdjustment +
        element.scrollLeft +
        i.containerWidth * 2 -
        i.contentWidth -
        i.scrollbarYLeft -
        i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  set(i.scrollbarYRail, yRailOffset);

  set(i.scrollbarX, {
    left: i.scrollbarXLeft,
    width: i.scrollbarXWidth - i.railBorderXWidth,
  });
  set(i.scrollbarY, {
    top: i.scrollbarYTop,
    height: i.scrollbarYHeight - i.railBorderYWidth,
  });
}

var clickRail = function(i) {
  i.event.bind(i.scrollbarY, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarYRail, 'mousedown', function (e) {
    var positionTop =
      e.pageY -
      window.pageYOffset -
      i.scrollbarYRail.getBoundingClientRect().top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    i.element.scrollTop += direction * i.containerHeight;
    updateGeometry(i);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarXRail, 'mousedown', function (e) {
    var positionLeft =
      e.pageX -
      window.pageXOffset -
      i.scrollbarXRail.getBoundingClientRect().left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    i.element.scrollLeft += direction * i.containerWidth;
    updateGeometry(i);

    e.stopPropagation();
  });
};

var dragThumb = function(i) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x' ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y' ]);
};

function bindMouseScrollHandler(
  i,
  ref
) {
  var containerHeight = ref[0];
  var contentHeight = ref[1];
  var pageY = ref[2];
  var railYHeight = ref[3];
  var scrollbarY = ref[4];
  var scrollbarYHeight = ref[5];
  var scrollTop = ref[6];
  var y = ref[7];

  var element = i.element;

  var startingScrollTop = null;
  var startingMousePageY = null;
  var scrollBy = null;

  function mouseMoveHandler(e) {
    element[scrollTop] =
      startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  i.event.bind(i[scrollbarY], 'mousedown', function (e) {
    startingScrollTop = element[scrollTop];
    startingMousePageY = e[pageY];
    scrollBy =
      (i[contentHeight] - i[containerHeight]) /
      (i[railYHeight] - i[scrollbarYHeight]);

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

var keyboard = function(i) {
  var element = i.element;

  var elementHovered = function () { return matches(element, ':hover'); };
  var scrollbarFocused = function () { return matches(i.scrollbarX, ':focus') || matches(i.scrollbarY, ':focus'); };

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (
        (scrollTop === 0 && deltaY > 0) ||
        (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (
        (scrollLeft === 0 && deltaX < 0) ||
        (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (
      (e.isDefaultPrevented && e.isDefaultPrevented()) ||
      e.defaultPrevented
    ) {
      return;
    }

    if (!elementHovered() && !scrollbarFocused()) {
      return;
    }

    var activeElement = document.activeElement
      ? document.activeElement
      : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
      case 37: // left
        if (e.metaKey) {
          deltaX = -i.contentWidth;
        } else if (e.altKey) {
          deltaX = -i.containerWidth;
        } else {
          deltaX = -30;
        }
        break;
      case 38: // up
        if (e.metaKey) {
          deltaY = i.contentHeight;
        } else if (e.altKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = 30;
        }
        break;
      case 39: // right
        if (e.metaKey) {
          deltaX = i.contentWidth;
        } else if (e.altKey) {
          deltaX = i.containerWidth;
        } else {
          deltaX = 30;
        }
        break;
      case 40: // down
        if (e.metaKey) {
          deltaY = -i.contentHeight;
        } else if (e.altKey) {
          deltaY = -i.containerHeight;
        } else {
          deltaY = -30;
        }
        break;
      case 32: // space bar
        if (e.shiftKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = -i.containerHeight;
        }
        break;
      case 33: // page up
        deltaY = i.containerHeight;
        break;
      case 34: // page down
        deltaY = -i.containerHeight;
        break;
      case 36: // home
        deltaY = i.contentHeight;
        break;
      case 35: // end
        deltaY = -i.contentHeight;
        break;
      default:
        return;
    }

    if (i.settings.suppressScrollX && deltaX !== 0) {
      return;
    }
    if (i.settings.suppressScrollY && deltaY !== 0) {
      return;
    }

    element.scrollTop -= deltaY;
    element.scrollLeft += deltaX;
    updateGeometry(i);

    if (shouldPreventDefault(deltaX, deltaY)) {
      e.preventDefault();
    }
  });
};

var wheel = function(i) {
  var element = i.element;

  function shouldPreventDefault(deltaX, deltaY) {
    var isTop = element.scrollTop === 0;
    var isBottom =
      element.scrollTop + element.offsetHeight === element.scrollHeight;
    var isLeft = element.scrollLeft === 0;
    var isRight =
      element.scrollLeft + element.offsetWidth === element.offsetWidth;

    var hitsBound;

    // pick axis with primary direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      hitsBound = isTop || isBottom;
    } else {
      hitsBound = isLeft || isRight;
    }

    return hitsBound ? !i.settings.wheelPropagation : true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    // FIXME: this is a workaround for <select> issue in FF and IE #571
    if (!env.isWebKit && element.querySelector('select:focus')) {
      return true;
    }

    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);
      var overflow = [style.overflow, style.overflowX, style.overflowY].join(
        ''
      );

      // if scrollable
      if (overflow.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            !(cursor.scrollTop === 0 && deltaY > 0) &&
            !(cursor.scrollTop === maxScrollTop && deltaY < 0)
          ) {
            return true;
          }
        }
        var maxScrollLeft = cursor.scrollLeft - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            !(cursor.scrollLeft === 0 && deltaX < 0) &&
            !(cursor.scrollLeft === maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function mousewheelHandler(e) {
    var ref = getDeltaFromEvent(e);
    var deltaX = ref[0];
    var deltaY = ref[1];

    if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
      return;
    }

    var shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      element.scrollTop -= deltaY * i.settings.wheelSpeed;
      element.scrollLeft += deltaX * i.settings.wheelSpeed;
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        element.scrollTop -= deltaY * i.settings.wheelSpeed;
      } else {
        element.scrollTop += deltaX * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        element.scrollLeft += deltaX * i.settings.wheelSpeed;
      } else {
        element.scrollLeft -= deltaY * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    }

    updateGeometry(i);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent && !e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
};

var touch = function(i) {
  if (!env.supportsTouch && !env.supportsIePointer) {
    return;
  }

  var element = i.element;

  function shouldPrevent(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (
        (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight) ||
        (deltaY > 0 && scrollTop === 0)
      ) {
        // set prevent for mobile Chrome refresh
        return window.scrollY === 0 && deltaY > 0 && env.isChrome;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (
        (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth) ||
        (deltaX > 0 && scrollLeft === 0)
      ) {
        return true;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    element.scrollTop -= differenceY;
    element.scrollLeft -= differenceX;

    updateGeometry(i);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }

  function shouldHandle(e) {
    if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
      return false;
    }
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (
      e.pointerType &&
      e.pointerType !== 'mouse' &&
      e.pointerType !== e.MSPOINTER_TYPE_MOUSE
    ) {
      return true;
    }
    return false;
  }

  function touchStart(e) {
    if (!shouldHandle(e)) {
      return;
    }

    var touch = getTouch(e);

    startOffset.pageX = touch.pageX;
    startOffset.pageY = touch.pageY;

    startTime = new Date().getTime();

    if (easingLoop !== null) {
      clearInterval(easingLoop);
    }
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);
      var overflow = [style.overflow, style.overflowX, style.overflowY].join(
        ''
      );

      // if scrollable
      if (overflow.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            !(cursor.scrollTop === 0 && deltaY > 0) &&
            !(cursor.scrollTop === maxScrollTop && deltaY < 0)
          ) {
            return true;
          }
        }
        var maxScrollLeft = cursor.scrollLeft - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            !(cursor.scrollLeft === 0 && deltaX < 0) &&
            !(cursor.scrollLeft === maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function touchMove(e) {
    if (shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = { pageX: touch.pageX, pageY: touch.pageY };

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
        return;
      }

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = new Date().getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPrevent(differenceX, differenceY)) {
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (i.settings.swipeEasing) {
      clearInterval(easingLoop);
      easingLoop = setInterval(function() {
        if (i.isInitialized) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (env.supportsTouch) {
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (env.supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
};

var defaultSettings = function () { return ({
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollingThreshold: 1000,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
}); };

var handlers = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard: keyboard,
  wheel: wheel,
  touch: touch,
};

var PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
  var this$1 = this;
  if ( userSettings === void 0 ) userSettings = {};

  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (!element || !element.nodeName) {
    throw new Error('no element is specified to initialize PerfectScrollbar');
  }

  this.element = element;

  element.classList.add(cls.main);

  this.settings = defaultSettings();
  for (var key in userSettings) {
    this$1.settings[key] = userSettings[key];
  }

  this.containerWidth = null;
  this.containerHeight = null;
  this.contentWidth = null;
  this.contentHeight = null;

  var focus = function () { return element.classList.add(cls.state.focus); };
  var blur = function () { return element.classList.remove(cls.state.focus); };

  this.isRtl = get(element).direction === 'rtl';
  this.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? element.scrollWidth - element.clientWidth
    : 0;
  this.event = new EventManager();
  this.ownerDocument = element.ownerDocument || document;

  this.scrollbarXRail = div(cls.element.rail('x'));
  element.appendChild(this.scrollbarXRail);
  this.scrollbarX = div(cls.element.thumb('x'));
  this.scrollbarXRail.appendChild(this.scrollbarX);
  this.scrollbarX.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarX, 'focus', focus);
  this.event.bind(this.scrollbarX, 'blur', blur);
  this.scrollbarXActive = null;
  this.scrollbarXWidth = null;
  this.scrollbarXLeft = null;
  var railXStyle = get(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
  if (isNaN(this.scrollbarXBottom)) {
    this.isScrollbarXUsingBottom = false;
    this.scrollbarXTop = toInt(railXStyle.top);
  } else {
    this.isScrollbarXUsingBottom = true;
  }
  this.railBorderXWidth =
    toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
  // Set rail to display:block to calculate margins
  set(this.scrollbarXRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
  set(this.scrollbarXRail, { display: '' });
  this.railXWidth = null;
  this.railXRatio = null;

  this.scrollbarYRail = div(cls.element.rail('y'));
  element.appendChild(this.scrollbarYRail);
  this.scrollbarY = div(cls.element.thumb('y'));
  this.scrollbarYRail.appendChild(this.scrollbarY);
  this.scrollbarY.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarY, 'focus', focus);
  this.event.bind(this.scrollbarY, 'blur', blur);
  this.scrollbarYActive = null;
  this.scrollbarYHeight = null;
  this.scrollbarYTop = null;
  var railYStyle = get(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(railYStyle.right, 10);
  if (isNaN(this.scrollbarYRight)) {
    this.isScrollbarYUsingRight = false;
    this.scrollbarYLeft = toInt(railYStyle.left);
  } else {
    this.isScrollbarYUsingRight = true;
  }
  this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
  this.railBorderYWidth =
    toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
  set(this.scrollbarYRail, { display: 'block' });
  this.railYMarginHeight =
    toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
  set(this.scrollbarYRail, { display: '' });
  this.railYHeight = null;
  this.railYRatio = null;

  this.reach = {
    x:
      element.scrollLeft <= 0
        ? 'start'
        : element.scrollLeft >= this.contentWidth - this.containerWidth
          ? 'end'
          : null,
    y:
      element.scrollTop <= 0
        ? 'start'
        : element.scrollTop >= this.contentHeight - this.containerHeight
          ? 'end'
          : null,
  };

  this.isAlive = true;

  this.settings.handlers.forEach(function (handlerName) { return handlers[handlerName](this$1); });

  this.lastScrollTop = element.scrollTop; // for onScroll only
  this.lastScrollLeft = element.scrollLeft; // for onScroll only
  this.event.bind(this.element, 'scroll', function (e) { return this$1.onScroll(e); });
  updateGeometry(this);
};

PerfectScrollbar.prototype.update = function update () {
  if (!this.isAlive) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? this.element.scrollWidth - this.element.clientWidth
    : 0;

  // Recalculate rail margins
  set(this.scrollbarXRail, { display: 'block' });
  set(this.scrollbarYRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(get(this.scrollbarXRail).marginLeft) +
    toInt(get(this.scrollbarXRail).marginRight);
  this.railYMarginHeight =
    toInt(get(this.scrollbarYRail).marginTop) +
    toInt(get(this.scrollbarYRail).marginBottom);

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  set(this.scrollbarXRail, { display: 'none' });
  set(this.scrollbarYRail, { display: 'none' });

  updateGeometry(this);

  processScrollDiff(this, 'top', 0, false, true);
  processScrollDiff(this, 'left', 0, false, true);

  set(this.scrollbarXRail, { display: '' });
  set(this.scrollbarYRail, { display: '' });
};

PerfectScrollbar.prototype.onScroll = function onScroll (e) {
  if (!this.isAlive) {
    return;
  }

  updateGeometry(this);
  processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop);
  processScrollDiff(
    this,
    'left',
    this.element.scrollLeft - this.lastScrollLeft
  );

  this.lastScrollTop = this.element.scrollTop;
  this.lastScrollLeft = this.element.scrollLeft;
};

PerfectScrollbar.prototype.destroy = function destroy () {
  if (!this.isAlive) {
    return;
  }

  this.event.unbindAll();
  remove(this.scrollbarX);
  remove(this.scrollbarY);
  remove(this.scrollbarXRail);
  remove(this.scrollbarYRail);
  this.removePsClasses();

  // unset elements
  this.element = null;
  this.scrollbarX = null;
  this.scrollbarY = null;
  this.scrollbarXRail = null;
  this.scrollbarYRail = null;

  this.isAlive = false;
};

PerfectScrollbar.prototype.removePsClasses = function removePsClasses () {
  this.element.className = this.element.className
    .split(' ')
    .filter(function (name) { return !name.match(/^ps([-_].+|)$/); })
    .join(' ');
};

/* harmony default export */ __webpack_exports__["default"] = (PerfectScrollbar);


/***/ }),

/***/ "../node_modules/tether-drop/dist/js/drop.js":
/*!***************************************************!*\
  !*** ../node_modules/tether-drop/dist/js/drop.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! tether-drop 1.4.1 */

(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! tether */ "../node_modules/tether/dist/js/tether.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function(Tether) {

/* global Tether */
'use strict';

var _bind = Function.prototype.bind;

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Tether$Utils = Tether.Utils;
var extend = _Tether$Utils.extend;
var addClass = _Tether$Utils.addClass;
var removeClass = _Tether$Utils.removeClass;
var hasClass = _Tether$Utils.hasClass;
var Evented = _Tether$Utils.Evented;

function sortAttach(str) {
  var _str$split = str.split(' ');

  var _str$split2 = _slicedToArray(_str$split, 2);

  var first = _str$split2[0];
  var second = _str$split2[1];

  if (['left', 'right'].indexOf(first) >= 0) {
    var _ref = [second, first];
    first = _ref[0];
    second = _ref[1];
  }
  return [first, second].join(' ');
}

function removeFromArray(arr, item) {
  var index = undefined;
  var results = [];
  while ((index = arr.indexOf(item)) !== -1) {
    results.push(arr.splice(index, 1));
  }
  return results;
}

var clickEvents = ['click'];
if ('ontouchstart' in document.documentElement) {
  clickEvents.push('touchstart');
}

var transitionEndEvents = {
  'WebkitTransition': 'webkitTransitionEnd',
  'MozTransition': 'transitionend',
  'OTransition': 'otransitionend',
  'transition': 'transitionend'
};

var transitionEndEvent = '';
for (var _name in transitionEndEvents) {
  if (({}).hasOwnProperty.call(transitionEndEvents, _name)) {
    var tempEl = document.createElement('p');
    if (typeof tempEl.style[_name] !== 'undefined') {
      transitionEndEvent = transitionEndEvents[_name];
    }
  }
}

var MIRROR_ATTACH = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
  middle: 'middle',
  center: 'center'
};

var allDrops = {};

// Drop can be included in external libraries.  Calling createContext gives you a fresh
// copy of drop which won't interact with other copies on the page (beyond calling the document events).

function createContext() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var drop = function drop() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (_bind.apply(DropInstance, [null].concat(args)))();
  };

  extend(drop, {
    createContext: createContext,
    drops: [],
    defaults: {}
  });

  var defaultOptions = {
    classPrefix: 'drop',
    defaults: {
      position: 'bottom left',
      openOn: 'click',
      beforeClose: null,
      constrainToScrollParent: true,
      constrainToWindow: true,
      classes: '',
      remove: false,
      openDelay: 0,
      closeDelay: 50,
      // inherited from openDelay and closeDelay if not explicitly defined
      focusDelay: null,
      blurDelay: null,
      hoverOpenDelay: null,
      hoverCloseDelay: null,
      tetherOptions: {}
    }
  };

  extend(drop, defaultOptions, options);
  extend(drop.defaults, defaultOptions.defaults, options.defaults);

  if (typeof allDrops[drop.classPrefix] === 'undefined') {
    allDrops[drop.classPrefix] = [];
  }

  drop.updateBodyClasses = function () {
    // There is only one body, so despite the context concept, we still iterate through all
    // drops which share our classPrefix.

    var anyOpen = false;
    var drops = allDrops[drop.classPrefix];
    var len = drops.length;
    for (var i = 0; i < len; ++i) {
      if (drops[i].isOpened()) {
        anyOpen = true;
        break;
      }
    }

    if (anyOpen) {
      addClass(document.body, drop.classPrefix + '-open');
    } else {
      removeClass(document.body, drop.classPrefix + '-open');
    }
  };

  var DropInstance = (function (_Evented) {
    _inherits(DropInstance, _Evented);

    function DropInstance(opts) {
      _classCallCheck(this, DropInstance);

      _get(Object.getPrototypeOf(DropInstance.prototype), 'constructor', this).call(this);
      this.options = extend({}, drop.defaults, opts);
      this.target = this.options.target;

      if (typeof this.target === 'undefined') {
        throw new Error('Drop Error: You must provide a target.');
      }

      var dataPrefix = 'data-' + drop.classPrefix;

      var contentAttr = this.target.getAttribute(dataPrefix);
      if (contentAttr && this.options.content == null) {
        this.options.content = contentAttr;
      }

      var attrsOverride = ['position', 'openOn'];
      for (var i = 0; i < attrsOverride.length; ++i) {

        var override = this.target.getAttribute(dataPrefix + '-' + attrsOverride[i]);
        if (override && this.options[attrsOverride[i]] == null) {
          this.options[attrsOverride[i]] = override;
        }
      }

      if (this.options.classes && this.options.addTargetClasses !== false) {
        addClass(this.target, this.options.classes);
      }

      drop.drops.push(this);
      allDrops[drop.classPrefix].push(this);

      this._boundEvents = [];
      this.bindMethods();
      this.setupElements();
      this.setupEvents();
      this.setupTether();
    }

    _createClass(DropInstance, [{
      key: '_on',
      value: function _on(element, event, handler) {
        this._boundEvents.push({ element: element, event: event, handler: handler });
        element.addEventListener(event, handler);
      }
    }, {
      key: 'bindMethods',
      value: function bindMethods() {
        this.transitionEndHandler = this._transitionEndHandler.bind(this);
      }
    }, {
      key: 'setupElements',
      value: function setupElements() {
        var _this = this;

        this.drop = document.createElement('div');
        addClass(this.drop, drop.classPrefix);

        if (this.options.classes) {
          addClass(this.drop, this.options.classes);
        }

        this.content = document.createElement('div');
        addClass(this.content, drop.classPrefix + '-content');

        if (typeof this.options.content === 'function') {
          var generateAndSetContent = function generateAndSetContent() {
            // content function might return a string or an element
            var contentElementOrHTML = _this.options.content.call(_this, _this);

            if (typeof contentElementOrHTML === 'string') {
              _this.content.innerHTML = contentElementOrHTML;
            } else if (typeof contentElementOrHTML === 'object') {
              _this.content.innerHTML = '';
              _this.content.appendChild(contentElementOrHTML);
            } else {
              throw new Error('Drop Error: Content function should return a string or HTMLElement.');
            }
          };

          generateAndSetContent();
          this.on('open', generateAndSetContent.bind(this));
        } else if (typeof this.options.content === 'object') {
          this.content.appendChild(this.options.content);
        } else {
          this.content.innerHTML = this.options.content;
        }

        this.drop.appendChild(this.content);
      }
    }, {
      key: 'setupTether',
      value: function setupTether() {
        // Tether expects two attachment points, one in the target element, one in the
        // drop.  We use a single one, and use the order as well, to allow us to put
        // the drop on either side of any of the four corners.  This magic converts between
        // the two:
        var dropAttach = this.options.position.split(' ');
        dropAttach[0] = MIRROR_ATTACH[dropAttach[0]];
        dropAttach = dropAttach.join(' ');

        var constraints = [];
        if (this.options.constrainToScrollParent) {
          constraints.push({
            to: 'scrollParent',
            pin: 'top, bottom',
            attachment: 'together none'
          });
        } else {
          // To get 'out of bounds' classes
          constraints.push({
            to: 'scrollParent'
          });
        }

        if (this.options.constrainToWindow !== false) {
          constraints.push({
            to: 'window',
            attachment: 'together'
          });
        } else {
          // To get 'out of bounds' classes
          constraints.push({
            to: 'window'
          });
        }

        var opts = {
          element: this.drop,
          target: this.target,
          attachment: sortAttach(dropAttach),
          targetAttachment: sortAttach(this.options.position),
          classPrefix: drop.classPrefix,
          offset: '0 0',
          targetOffset: '0 0',
          enabled: false,
          constraints: constraints,
          addTargetClasses: this.options.addTargetClasses
        };

        if (this.options.tetherOptions !== false) {
          this.tether = new Tether(extend({}, opts, this.options.tetherOptions));
        }
      }
    }, {
      key: 'setupEvents',
      value: function setupEvents() {
        var _this2 = this;

        if (!this.options.openOn) {
          return;
        }

        if (this.options.openOn === 'always') {
          setTimeout(this.open.bind(this));
          return;
        }

        var events = this.options.openOn.split(' ');

        if (events.indexOf('click') >= 0) {
          var openHandler = function openHandler(event) {
            _this2.toggle(event);
            event.preventDefault();
          };

          var closeHandler = function closeHandler(event) {
            if (!_this2.isOpened()) {
              return;
            }

            // Clicking inside dropdown
            if (event.target === _this2.drop || _this2.drop.contains(event.target)) {
              return;
            }

            // Clicking target
            if (event.target === _this2.target || _this2.target.contains(event.target)) {
              return;
            }

            _this2.close(event);
          };

          for (var i = 0; i < clickEvents.length; ++i) {
            var clickEvent = clickEvents[i];
            this._on(this.target, clickEvent, openHandler);
            this._on(document, clickEvent, closeHandler);
          }
        }

        var inTimeout = null;
        var outTimeout = null;

        var inHandler = function inHandler(event) {
          if (outTimeout !== null) {
            clearTimeout(outTimeout);
          } else {
            inTimeout = setTimeout(function () {
              _this2.open(event);
              inTimeout = null;
            }, (event.type === 'focus' ? _this2.options.focusDelay : _this2.options.hoverOpenDelay) || _this2.options.openDelay);
          }
        };

        var outHandler = function outHandler(event) {
          if (inTimeout !== null) {
            clearTimeout(inTimeout);
          } else {
            outTimeout = setTimeout(function () {
              _this2.close(event);
              outTimeout = null;
            }, (event.type === 'blur' ? _this2.options.blurDelay : _this2.options.hoverCloseDelay) || _this2.options.closeDelay);
          }
        };

        if (events.indexOf('hover') >= 0) {
          this._on(this.target, 'mouseover', inHandler);
          this._on(this.drop, 'mouseover', inHandler);
          this._on(this.target, 'mouseout', outHandler);
          this._on(this.drop, 'mouseout', outHandler);
        }

        if (events.indexOf('focus') >= 0) {
          this._on(this.target, 'focus', inHandler);
          this._on(this.drop, 'focus', inHandler);
          this._on(this.target, 'blur', outHandler);
          this._on(this.drop, 'blur', outHandler);
        }
      }
    }, {
      key: 'isOpened',
      value: function isOpened() {
        if (this.drop) {
          return hasClass(this.drop, drop.classPrefix + '-open');
        }
      }
    }, {
      key: 'toggle',
      value: function toggle(event) {
        if (this.isOpened()) {
          this.close(event);
        } else {
          this.open(event);
        }
      }
    }, {
      key: 'open',
      value: function open(event) {
        var _this3 = this;

        /* eslint no-unused-vars: 0 */
        if (this.isOpened()) {
          return;
        }

        if (!this.drop.parentNode) {
          document.body.appendChild(this.drop);
        }

        if (typeof this.tether !== 'undefined') {
          this.tether.enable();
        }

        addClass(this.drop, drop.classPrefix + '-open');
        addClass(this.drop, drop.classPrefix + '-open-transitionend');

        setTimeout(function () {
          if (_this3.drop) {
            addClass(_this3.drop, drop.classPrefix + '-after-open');
          }
        });

        if (typeof this.tether !== 'undefined') {
          this.tether.position();
        }

        this.trigger('open');

        drop.updateBodyClasses();
      }
    }, {
      key: '_transitionEndHandler',
      value: function _transitionEndHandler(e) {
        if (e.target !== e.currentTarget) {
          return;
        }

        if (!hasClass(this.drop, drop.classPrefix + '-open')) {
          removeClass(this.drop, drop.classPrefix + '-open-transitionend');
        }
        this.drop.removeEventListener(transitionEndEvent, this.transitionEndHandler);
      }
    }, {
      key: 'beforeCloseHandler',
      value: function beforeCloseHandler(event) {
        var shouldClose = true;

        if (!this.isClosing && typeof this.options.beforeClose === 'function') {
          this.isClosing = true;
          shouldClose = this.options.beforeClose(event, this) !== false;
        }

        this.isClosing = false;

        return shouldClose;
      }
    }, {
      key: 'close',
      value: function close(event) {
        if (!this.isOpened()) {
          return;
        }

        if (!this.beforeCloseHandler(event)) {
          return;
        }

        removeClass(this.drop, drop.classPrefix + '-open');
        removeClass(this.drop, drop.classPrefix + '-after-open');

        this.drop.addEventListener(transitionEndEvent, this.transitionEndHandler);

        this.trigger('close');

        if (typeof this.tether !== 'undefined') {
          this.tether.disable();
        }

        drop.updateBodyClasses();

        if (this.options.remove) {
          this.remove(event);
        }
      }
    }, {
      key: 'remove',
      value: function remove(event) {
        this.close(event);
        if (this.drop.parentNode) {
          this.drop.parentNode.removeChild(this.drop);
        }
      }
    }, {
      key: 'position',
      value: function position() {
        if (this.isOpened() && typeof this.tether !== 'undefined') {
          this.tether.position();
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.remove();

        if (typeof this.tether !== 'undefined') {
          this.tether.destroy();
        }

        for (var i = 0; i < this._boundEvents.length; ++i) {
          var _boundEvents$i = this._boundEvents[i];
          var element = _boundEvents$i.element;
          var _event = _boundEvents$i.event;
          var handler = _boundEvents$i.handler;

          element.removeEventListener(_event, handler);
        }

        this._boundEvents = [];

        this.tether = null;
        this.drop = null;
        this.content = null;
        this.target = null;

        removeFromArray(allDrops[drop.classPrefix], this);
        removeFromArray(drop.drops, this);
      }
    }]);

    return DropInstance;
  })(Evented);

  return drop;
}

var Drop = createContext();

document.addEventListener('DOMContentLoaded', function () {
  Drop.updateBodyClasses();
});
return Drop;

}));


/***/ }),

/***/ "../node_modules/tether/dist/js/tether.js":
/*!************************************************!*\
  !*** ../node_modules/tether/dist/js/tether.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! tether 1.4.3 */

(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function(require, exports, module) {

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TetherBase = undefined;
if (typeof TetherBase === 'undefined') {
  TetherBase = { modules: [] };
}

var zeroElement = null;

// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
// if the element lies within a nested document (<frame> or <iframe>-like).
function getActualBoundingClientRect(node) {
  var boundingRect = node.getBoundingClientRect();

  // The original object returned by getBoundingClientRect is immutable, so we clone it
  // We can't use extend because the properties are not considered part of the object by hasOwnProperty in IE9
  var rect = {};
  for (var k in boundingRect) {
    rect[k] = boundingRect[k];
  }

  if (node.ownerDocument !== document) {
    var _frameElement = node.ownerDocument.defaultView.frameElement;
    if (_frameElement) {
      var frameRect = getActualBoundingClientRect(_frameElement);
      rect.top += frameRect.top;
      rect.bottom += frameRect.top;
      rect.left += frameRect.left;
      rect.right += frameRect.left;
    }
  }

  return rect;
}

function getScrollParents(el) {
  // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  var computedStyle = getComputedStyle(el) || {};
  var position = computedStyle.position;
  var parents = [];

  if (position === 'fixed') {
    return [el];
  }

  var parent = el;
  while ((parent = parent.parentNode) && parent && parent.nodeType === 1) {
    var style = undefined;
    try {
      style = getComputedStyle(parent);
    } catch (err) {}

    if (typeof style === 'undefined' || style === null) {
      parents.push(parent);
      return parents;
    }

    var _style = style;
    var overflow = _style.overflow;
    var overflowX = _style.overflowX;
    var overflowY = _style.overflowY;

    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
        parents.push(parent);
      }
    }
  }

  parents.push(el.ownerDocument.body);

  // If the node is within a frame, account for the parent window scroll
  if (el.ownerDocument !== document) {
    parents.push(el.ownerDocument.defaultView);
  }

  return parents;
}

var uniqueId = (function () {
  var id = 0;
  return function () {
    return ++id;
  };
})();

var zeroPosCache = {};
var getOrigin = function getOrigin() {
  // getBoundingClientRect is unfortunately too accurate.  It introduces a pixel or two of
  // jitter as the user scrolls that messes with our ability to detect if two positions
  // are equivilant or not.  We place an element at the top left of the page that will
  // get the same jitter, so we can cancel the two out.
  var node = zeroElement;
  if (!node || !document.body.contains(node)) {
    node = document.createElement('div');
    node.setAttribute('data-tether-id', uniqueId());
    extend(node.style, {
      top: 0,
      left: 0,
      position: 'absolute'
    });

    document.body.appendChild(node);

    zeroElement = node;
  }

  var id = node.getAttribute('data-tether-id');
  if (typeof zeroPosCache[id] === 'undefined') {
    zeroPosCache[id] = getActualBoundingClientRect(node);

    // Clear the cache when this position call is done
    defer(function () {
      delete zeroPosCache[id];
    });
  }

  return zeroPosCache[id];
};

function removeUtilElements() {
  if (zeroElement) {
    document.body.removeChild(zeroElement);
  }
  zeroElement = null;
};

function getBounds(el) {
  var doc = undefined;
  if (el === document) {
    doc = document;
    el = document.documentElement;
  } else {
    doc = el.ownerDocument;
  }

  var docEl = doc.documentElement;

  var box = getActualBoundingClientRect(el);

  var origin = getOrigin();

  box.top -= origin.top;
  box.left -= origin.left;

  if (typeof box.width === 'undefined') {
    box.width = document.body.scrollWidth - box.left - box.right;
  }
  if (typeof box.height === 'undefined') {
    box.height = document.body.scrollHeight - box.top - box.bottom;
  }

  box.top = box.top - docEl.clientTop;
  box.left = box.left - docEl.clientLeft;
  box.right = doc.body.clientWidth - box.width - box.left;
  box.bottom = doc.body.clientHeight - box.height - box.top;

  return box;
}

function getOffsetParent(el) {
  return el.offsetParent || document.documentElement;
}

var _scrollBarSize = null;
function getScrollBarSize() {
  if (_scrollBarSize) {
    return _scrollBarSize;
  }
  var inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '200px';

  var outer = document.createElement('div');
  extend(outer.style, {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  var widthContained = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  var width = widthContained - widthScroll;

  _scrollBarSize = { width: width, height: width };
  return _scrollBarSize;
}

function extend() {
  var out = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var args = [];

  Array.prototype.push.apply(args, arguments);

  args.slice(1).forEach(function (obj) {
    if (obj) {
      for (var key in obj) {
        if (({}).hasOwnProperty.call(obj, key)) {
          out[key] = obj[key];
        }
      }
    }
  });

  return out;
}

function removeClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.remove(cls);
      }
    });
  } else {
    var regex = new RegExp('(^| )' + name.split(' ').join('|') + '( |$)', 'gi');
    var className = getClassName(el).replace(regex, ' ');
    setClassName(el, className);
  }
}

function addClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.add(cls);
      }
    });
  } else {
    removeClass(el, name);
    var cls = getClassName(el) + (' ' + name);
    setClassName(el, cls);
  }
}

function hasClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    return el.classList.contains(name);
  }
  var className = getClassName(el);
  return new RegExp('(^| )' + name + '( |$)', 'gi').test(className);
}

function getClassName(el) {
  // Can't use just SVGAnimatedString here since nodes within a Frame in IE have
  // completely separately SVGAnimatedString base classes
  if (el.className instanceof el.ownerDocument.defaultView.SVGAnimatedString) {
    return el.className.baseVal;
  }
  return el.className;
}

function setClassName(el, className) {
  el.setAttribute('class', className);
}

function updateClasses(el, add, all) {
  // Of the set of 'all' classes, we need the 'add' classes, and only the
  // 'add' classes to be set.
  all.forEach(function (cls) {
    if (add.indexOf(cls) === -1 && hasClass(el, cls)) {
      removeClass(el, cls);
    }
  });

  add.forEach(function (cls) {
    if (!hasClass(el, cls)) {
      addClass(el, cls);
    }
  });
}

var deferred = [];

var defer = function defer(fn) {
  deferred.push(fn);
};

var flush = function flush() {
  var fn = undefined;
  while (fn = deferred.pop()) {
    fn();
  }
};

var Evented = (function () {
  function Evented() {
    _classCallCheck(this, Evented);
  }

  _createClass(Evented, [{
    key: 'on',
    value: function on(event, handler, ctx) {
      var once = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      if (typeof this.bindings === 'undefined') {
        this.bindings = {};
      }
      if (typeof this.bindings[event] === 'undefined') {
        this.bindings[event] = [];
      }
      this.bindings[event].push({ handler: handler, ctx: ctx, once: once });
    }
  }, {
    key: 'once',
    value: function once(event, handler, ctx) {
      this.on(event, handler, ctx, true);
    }
  }, {
    key: 'off',
    value: function off(event, handler) {
      if (typeof this.bindings === 'undefined' || typeof this.bindings[event] === 'undefined') {
        return;
      }

      if (typeof handler === 'undefined') {
        delete this.bindings[event];
      } else {
        var i = 0;
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(event) {
      if (typeof this.bindings !== 'undefined' && this.bindings[event]) {
        var i = 0;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        while (i < this.bindings[event].length) {
          var _bindings$event$i = this.bindings[event][i];
          var handler = _bindings$event$i.handler;
          var ctx = _bindings$event$i.ctx;
          var once = _bindings$event$i.once;

          var context = ctx;
          if (typeof context === 'undefined') {
            context = this;
          }

          handler.apply(context, args);

          if (once) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }]);

  return Evented;
})();

TetherBase.Utils = {
  getActualBoundingClientRect: getActualBoundingClientRect,
  getScrollParents: getScrollParents,
  getBounds: getBounds,
  getOffsetParent: getOffsetParent,
  extend: extend,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  updateClasses: updateClasses,
  defer: defer,
  flush: flush,
  uniqueId: uniqueId,
  Evented: Evented,
  getScrollBarSize: getScrollBarSize,
  removeUtilElements: removeUtilElements
};
/* globals TetherBase, performance */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (typeof TetherBase === 'undefined') {
  throw new Error('You must include the utils.js file before tether.js');
}

var _TetherBase$Utils = TetherBase.Utils;
var getScrollParents = _TetherBase$Utils.getScrollParents;
var getBounds = _TetherBase$Utils.getBounds;
var getOffsetParent = _TetherBase$Utils.getOffsetParent;
var extend = _TetherBase$Utils.extend;
var addClass = _TetherBase$Utils.addClass;
var removeClass = _TetherBase$Utils.removeClass;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;
var flush = _TetherBase$Utils.flush;
var getScrollBarSize = _TetherBase$Utils.getScrollBarSize;
var removeUtilElements = _TetherBase$Utils.removeUtilElements;

function within(a, b) {
  var diff = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  return a + diff >= b && b >= a - diff;
}

var transformKey = (function () {
  if (typeof document === 'undefined') {
    return '';
  }
  var el = document.createElement('div');

  var transforms = ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
  for (var i = 0; i < transforms.length; ++i) {
    var key = transforms[i];
    if (el.style[key] !== undefined) {
      return key;
    }
  }
})();

var tethers = [];

var position = function position() {
  tethers.forEach(function (tether) {
    tether.position(false);
  });
  flush();
};

function now() {
  if (typeof performance === 'object' && typeof performance.now === 'function') {
    return performance.now();
  }
  return +new Date();
}

(function () {
  var lastCall = null;
  var lastDuration = null;
  var pendingTimeout = null;

  var tick = function tick() {
    if (typeof lastDuration !== 'undefined' && lastDuration > 16) {
      // We voluntarily throttle ourselves if we can't manage 60fps
      lastDuration = Math.min(lastDuration - 16, 250);

      // Just in case this is the last event, remember to position just once more
      pendingTimeout = setTimeout(tick, 250);
      return;
    }

    if (typeof lastCall !== 'undefined' && now() - lastCall < 10) {
      // Some browsers call events a little too frequently, refuse to run more than is reasonable
      return;
    }

    if (pendingTimeout != null) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }

    lastCall = now();
    position();
    lastDuration = now() - lastCall;
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    ['resize', 'scroll', 'touchmove'].forEach(function (event) {
      window.addEventListener(event, tick);
    });
  }
})();

var MIRROR_LR = {
  center: 'center',
  left: 'right',
  right: 'left'
};

var MIRROR_TB = {
  middle: 'middle',
  top: 'bottom',
  bottom: 'top'
};

var OFFSET_MAP = {
  top: 0,
  left: 0,
  middle: '50%',
  center: '50%',
  bottom: '100%',
  right: '100%'
};

var autoToFixedAttachment = function autoToFixedAttachment(attachment, relativeToAttachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (left === 'auto') {
    left = MIRROR_LR[relativeToAttachment.left];
  }

  if (top === 'auto') {
    top = MIRROR_TB[relativeToAttachment.top];
  }

  return { left: left, top: top };
};

var attachmentToOffset = function attachmentToOffset(attachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (typeof OFFSET_MAP[attachment.left] !== 'undefined') {
    left = OFFSET_MAP[attachment.left];
  }

  if (typeof OFFSET_MAP[attachment.top] !== 'undefined') {
    top = OFFSET_MAP[attachment.top];
  }

  return { left: left, top: top };
};

function addOffset() {
  var out = { top: 0, left: 0 };

  for (var _len = arguments.length, offsets = Array(_len), _key = 0; _key < _len; _key++) {
    offsets[_key] = arguments[_key];
  }

  offsets.forEach(function (_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (typeof top === 'string') {
      top = parseFloat(top, 10);
    }
    if (typeof left === 'string') {
      left = parseFloat(left, 10);
    }

    out.top += top;
    out.left += left;
  });

  return out;
}

function offsetToPx(offset, size) {
  if (typeof offset.left === 'string' && offset.left.indexOf('%') !== -1) {
    offset.left = parseFloat(offset.left, 10) / 100 * size.width;
  }
  if (typeof offset.top === 'string' && offset.top.indexOf('%') !== -1) {
    offset.top = parseFloat(offset.top, 10) / 100 * size.height;
  }

  return offset;
}

var parseOffset = function parseOffset(value) {
  var _value$split = value.split(' ');

  var _value$split2 = _slicedToArray(_value$split, 2);

  var top = _value$split2[0];
  var left = _value$split2[1];

  return { top: top, left: left };
};
var parseAttachment = parseOffset;

var TetherClass = (function (_Evented) {
  _inherits(TetherClass, _Evented);

  function TetherClass(options) {
    var _this = this;

    _classCallCheck(this, TetherClass);

    _get(Object.getPrototypeOf(TetherClass.prototype), 'constructor', this).call(this);
    this.position = this.position.bind(this);

    tethers.push(this);

    this.history = [];

    this.setOptions(options, false);

    TetherBase.modules.forEach(function (module) {
      if (typeof module.initialize !== 'undefined') {
        module.initialize.call(_this);
      }
    });

    this.position();
  }

  _createClass(TetherClass, [{
    key: 'getClass',
    value: function getClass() {
      var key = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var classes = this.options.classes;

      if (typeof classes !== 'undefined' && classes[key]) {
        return this.options.classes[key];
      } else if (this.options.classPrefix) {
        return this.options.classPrefix + '-' + key;
      } else {
        return key;
      }
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      var _this2 = this;

      var pos = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var defaults = {
        offset: '0 0',
        targetOffset: '0 0',
        targetAttachment: 'auto auto',
        classPrefix: 'tether'
      };

      this.options = extend(defaults, options);

      var _options = this.options;
      var element = _options.element;
      var target = _options.target;
      var targetModifier = _options.targetModifier;

      this.element = element;
      this.target = target;
      this.targetModifier = targetModifier;

      if (this.target === 'viewport') {
        this.target = document.body;
        this.targetModifier = 'visible';
      } else if (this.target === 'scroll-handle') {
        this.target = document.body;
        this.targetModifier = 'scroll-handle';
      }

      ['element', 'target'].forEach(function (key) {
        if (typeof _this2[key] === 'undefined') {
          throw new Error('Tether Error: Both element and target must be defined');
        }

        if (typeof _this2[key].jquery !== 'undefined') {
          _this2[key] = _this2[key][0];
        } else if (typeof _this2[key] === 'string') {
          _this2[key] = document.querySelector(_this2[key]);
        }
      });

      addClass(this.element, this.getClass('element'));
      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('target'));
      }

      if (!this.options.attachment) {
        throw new Error('Tether Error: You must provide an attachment');
      }

      this.targetAttachment = parseAttachment(this.options.targetAttachment);
      this.attachment = parseAttachment(this.options.attachment);
      this.offset = parseOffset(this.options.offset);
      this.targetOffset = parseOffset(this.options.targetOffset);

      if (typeof this.scrollParents !== 'undefined') {
        this.disable();
      }

      if (this.targetModifier === 'scroll-handle') {
        this.scrollParents = [this.target];
      } else {
        this.scrollParents = getScrollParents(this.target);
      }

      if (!(this.options.enabled === false)) {
        this.enable(pos);
      }
    }
  }, {
    key: 'getTargetBounds',
    value: function getTargetBounds() {
      if (typeof this.targetModifier !== 'undefined') {
        if (this.targetModifier === 'visible') {
          if (this.target === document.body) {
            return { top: pageYOffset, left: pageXOffset, height: innerHeight, width: innerWidth };
          } else {
            var bounds = getBounds(this.target);

            var out = {
              height: bounds.height,
              width: bounds.width,
              top: bounds.top,
              left: bounds.left
            };

            out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top));
            out.height = Math.min(out.height, bounds.height - (bounds.top + bounds.height - (pageYOffset + innerHeight)));
            out.height = Math.min(innerHeight, out.height);
            out.height -= 2;

            out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left));
            out.width = Math.min(out.width, bounds.width - (bounds.left + bounds.width - (pageXOffset + innerWidth)));
            out.width = Math.min(innerWidth, out.width);
            out.width -= 2;

            if (out.top < pageYOffset) {
              out.top = pageYOffset;
            }
            if (out.left < pageXOffset) {
              out.left = pageXOffset;
            }

            return out;
          }
        } else if (this.targetModifier === 'scroll-handle') {
          var bounds = undefined;
          var target = this.target;
          if (target === document.body) {
            target = document.documentElement;

            bounds = {
              left: pageXOffset,
              top: pageYOffset,
              height: innerHeight,
              width: innerWidth
            };
          } else {
            bounds = getBounds(target);
          }

          var style = getComputedStyle(target);

          var hasBottomScroll = target.scrollWidth > target.clientWidth || [style.overflow, style.overflowX].indexOf('scroll') >= 0 || this.target !== document.body;

          var scrollBottom = 0;
          if (hasBottomScroll) {
            scrollBottom = 15;
          }

          var height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom;

          var out = {
            width: 15,
            height: height * 0.975 * (height / target.scrollHeight),
            left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15
          };

          var fitAdj = 0;
          if (height < 408 && this.target === document.body) {
            fitAdj = -0.00011 * Math.pow(height, 2) - 0.00727 * height + 22.58;
          }

          if (this.target !== document.body) {
            out.height = Math.max(out.height, 24);
          }

          var scrollPercentage = this.target.scrollTop / (target.scrollHeight - height);
          out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth);

          if (this.target === document.body) {
            out.height = Math.max(out.height, 24);
          }

          return out;
        }
      } else {
        return getBounds(this.target);
      }
    }
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this._cache = {};
    }
  }, {
    key: 'cache',
    value: function cache(k, getter) {
      // More than one module will often need the same DOM info, so
      // we keep a cache which is cleared on each position call
      if (typeof this._cache === 'undefined') {
        this._cache = {};
      }

      if (typeof this._cache[k] === 'undefined') {
        this._cache[k] = getter.call(this);
      }

      return this._cache[k];
    }
  }, {
    key: 'enable',
    value: function enable() {
      var _this3 = this;

      var pos = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('enabled'));
      }
      addClass(this.element, this.getClass('enabled'));
      this.enabled = true;

      this.scrollParents.forEach(function (parent) {
        if (parent !== _this3.target.ownerDocument) {
          parent.addEventListener('scroll', _this3.position);
        }
      });

      if (pos) {
        this.position();
      }
    }
  }, {
    key: 'disable',
    value: function disable() {
      var _this4 = this;

      removeClass(this.target, this.getClass('enabled'));
      removeClass(this.element, this.getClass('enabled'));
      this.enabled = false;

      if (typeof this.scrollParents !== 'undefined') {
        this.scrollParents.forEach(function (parent) {
          parent.removeEventListener('scroll', _this4.position);
        });
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this5 = this;

      this.disable();

      tethers.forEach(function (tether, i) {
        if (tether === _this5) {
          tethers.splice(i, 1);
        }
      });

      // Remove any elements we were using for convenience from the DOM
      if (tethers.length === 0) {
        removeUtilElements();
      }
    }
  }, {
    key: 'updateAttachClasses',
    value: function updateAttachClasses(elementAttach, targetAttach) {
      var _this6 = this;

      elementAttach = elementAttach || this.attachment;
      targetAttach = targetAttach || this.targetAttachment;
      var sides = ['left', 'top', 'bottom', 'right', 'middle', 'center'];

      if (typeof this._addAttachClasses !== 'undefined' && this._addAttachClasses.length) {
        // updateAttachClasses can be called more than once in a position call, so
        // we need to clean up after ourselves such that when the last defer gets
        // ran it doesn't add any extra classes from previous calls.
        this._addAttachClasses.splice(0, this._addAttachClasses.length);
      }

      if (typeof this._addAttachClasses === 'undefined') {
        this._addAttachClasses = [];
      }
      var add = this._addAttachClasses;

      if (elementAttach.top) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.top);
      }
      if (elementAttach.left) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.left);
      }
      if (targetAttach.top) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.top);
      }
      if (targetAttach.left) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.left);
      }

      var all = [];
      sides.forEach(function (side) {
        all.push(_this6.getClass('element-attached') + '-' + side);
        all.push(_this6.getClass('target-attached') + '-' + side);
      });

      defer(function () {
        if (!(typeof _this6._addAttachClasses !== 'undefined')) {
          return;
        }

        updateClasses(_this6.element, _this6._addAttachClasses, all);
        if (!(_this6.options.addTargetClasses === false)) {
          updateClasses(_this6.target, _this6._addAttachClasses, all);
        }

        delete _this6._addAttachClasses;
      });
    }
  }, {
    key: 'position',
    value: function position() {
      var _this7 = this;

      var flushChanges = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      // flushChanges commits the changes immediately, leave true unless you are positioning multiple
      // tethers (in which case call Tether.Utils.flush yourself when you're done)

      if (!this.enabled) {
        return;
      }

      this.clearCache();

      // Turn 'auto' attachments into the appropriate corner or edge
      var targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment);

      this.updateAttachClasses(this.attachment, targetAttachment);

      var elementPos = this.cache('element-bounds', function () {
        return getBounds(_this7.element);
      });

      var width = elementPos.width;
      var height = elementPos.height;

      if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
        var _lastSize = this.lastSize;

        // We cache the height and width to make it possible to position elements that are
        // getting hidden.
        width = _lastSize.width;
        height = _lastSize.height;
      } else {
        this.lastSize = { width: width, height: height };
      }

      var targetPos = this.cache('target-bounds', function () {
        return _this7.getTargetBounds();
      });
      var targetSize = targetPos;

      // Get an actual px offset from the attachment
      var offset = offsetToPx(attachmentToOffset(this.attachment), { width: width, height: height });
      var targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize);

      var manualOffset = offsetToPx(this.offset, { width: width, height: height });
      var manualTargetOffset = offsetToPx(this.targetOffset, targetSize);

      // Add the manually provided offset
      offset = addOffset(offset, manualOffset);
      targetOffset = addOffset(targetOffset, manualTargetOffset);

      // It's now our goal to make (element position + offset) == (target position + target offset)
      var left = targetPos.left + targetOffset.left - offset.left;
      var top = targetPos.top + targetOffset.top - offset.top;

      for (var i = 0; i < TetherBase.modules.length; ++i) {
        var _module2 = TetherBase.modules[i];
        var ret = _module2.position.call(this, {
          left: left,
          top: top,
          targetAttachment: targetAttachment,
          targetPos: targetPos,
          elementPos: elementPos,
          offset: offset,
          targetOffset: targetOffset,
          manualOffset: manualOffset,
          manualTargetOffset: manualTargetOffset,
          scrollbarSize: scrollbarSize,
          attachment: this.attachment
        });

        if (ret === false) {
          return false;
        } else if (typeof ret === 'undefined' || typeof ret !== 'object') {
          continue;
        } else {
          top = ret.top;
          left = ret.left;
        }
      }

      // We describe the position three different ways to give the optimizer
      // a chance to decide the best possible way to position the element
      // with the fewest repaints.
      var next = {
        // It's position relative to the page (absolute positioning when
        // the element is a child of the body)
        page: {
          top: top,
          left: left
        },

        // It's position relative to the viewport (fixed positioning)
        viewport: {
          top: top - pageYOffset,
          bottom: pageYOffset - top - height + innerHeight,
          left: left - pageXOffset,
          right: pageXOffset - left - width + innerWidth
        }
      };

      var doc = this.target.ownerDocument;
      var win = doc.defaultView;

      var scrollbarSize = undefined;
      if (win.innerHeight > doc.documentElement.clientHeight) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.bottom -= scrollbarSize.height;
      }

      if (win.innerWidth > doc.documentElement.clientWidth) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.right -= scrollbarSize.width;
      }

      if (['', 'static'].indexOf(doc.body.style.position) === -1 || ['', 'static'].indexOf(doc.body.parentElement.style.position) === -1) {
        // Absolute positioning in the body will be relative to the page, not the 'initial containing block'
        next.page.bottom = doc.body.scrollHeight - top - height;
        next.page.right = doc.body.scrollWidth - left - width;
      }

      if (typeof this.options.optimizations !== 'undefined' && this.options.optimizations.moveElement !== false && !(typeof this.targetModifier !== 'undefined')) {
        (function () {
          var offsetParent = _this7.cache('target-offsetparent', function () {
            return getOffsetParent(_this7.target);
          });
          var offsetPosition = _this7.cache('target-offsetparent-bounds', function () {
            return getBounds(offsetParent);
          });
          var offsetParentStyle = getComputedStyle(offsetParent);
          var offsetParentSize = offsetPosition;

          var offsetBorder = {};
          ['Top', 'Left', 'Bottom', 'Right'].forEach(function (side) {
            offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle['border' + side + 'Width']);
          });

          offsetPosition.right = doc.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right;
          offsetPosition.bottom = doc.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom;

          if (next.page.top >= offsetPosition.top + offsetBorder.top && next.page.bottom >= offsetPosition.bottom) {
            if (next.page.left >= offsetPosition.left + offsetBorder.left && next.page.right >= offsetPosition.right) {
              // We're within the visible part of the target's scroll parent
              var scrollTop = offsetParent.scrollTop;
              var scrollLeft = offsetParent.scrollLeft;

              // It's position relative to the target's offset parent (absolute positioning when
              // the element is moved to be a child of the target's offset parent).
              next.offset = {
                top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top,
                left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left
              };
            }
          }
        })();
      }

      // We could also travel up the DOM and try each containing context, rather than only
      // looking at the body, but we're gonna get diminishing returns.

      this.move(next);

      this.history.unshift(next);

      if (this.history.length > 3) {
        this.history.pop();
      }

      if (flushChanges) {
        flush();
      }

      return true;
    }

    // THE ISSUE
  }, {
    key: 'move',
    value: function move(pos) {
      var _this8 = this;

      if (!(typeof this.element.parentNode !== 'undefined')) {
        return;
      }

      var same = {};

      for (var type in pos) {
        same[type] = {};

        for (var key in pos[type]) {
          var found = false;

          for (var i = 0; i < this.history.length; ++i) {
            var point = this.history[i];
            if (typeof point[type] !== 'undefined' && !within(point[type][key], pos[type][key])) {
              found = true;
              break;
            }
          }

          if (!found) {
            same[type][key] = true;
          }
        }
      }

      var css = { top: '', left: '', right: '', bottom: '' };

      var transcribe = function transcribe(_same, _pos) {
        var hasOptimizations = typeof _this8.options.optimizations !== 'undefined';
        var gpu = hasOptimizations ? _this8.options.optimizations.gpu : null;
        if (gpu !== false) {
          var yPos = undefined,
              xPos = undefined;
          if (_same.top) {
            css.top = 0;
            yPos = _pos.top;
          } else {
            css.bottom = 0;
            yPos = -_pos.bottom;
          }

          if (_same.left) {
            css.left = 0;
            xPos = _pos.left;
          } else {
            css.right = 0;
            xPos = -_pos.right;
          }

          if (window.matchMedia) {
            // HubSpot/tether#207
            var retina = window.matchMedia('only screen and (min-resolution: 1.3dppx)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3)').matches;
            if (!retina) {
              xPos = Math.round(xPos);
              yPos = Math.round(yPos);
            }
          }

          css[transformKey] = 'translateX(' + xPos + 'px) translateY(' + yPos + 'px)';

          if (transformKey !== 'msTransform') {
            // The Z transform will keep this in the GPU (faster, and prevents artifacts),
            // but IE9 doesn't support 3d transforms and will choke.
            css[transformKey] += " translateZ(0)";
          }
        } else {
          if (_same.top) {
            css.top = _pos.top + 'px';
          } else {
            css.bottom = _pos.bottom + 'px';
          }

          if (_same.left) {
            css.left = _pos.left + 'px';
          } else {
            css.right = _pos.right + 'px';
          }
        }
      };

      var moved = false;
      if ((same.page.top || same.page.bottom) && (same.page.left || same.page.right)) {
        css.position = 'absolute';
        transcribe(same.page, pos.page);
      } else if ((same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right)) {
        css.position = 'fixed';
        transcribe(same.viewport, pos.viewport);
      } else if (typeof same.offset !== 'undefined' && same.offset.top && same.offset.left) {
        (function () {
          css.position = 'absolute';
          var offsetParent = _this8.cache('target-offsetparent', function () {
            return getOffsetParent(_this8.target);
          });

          if (getOffsetParent(_this8.element) !== offsetParent) {
            defer(function () {
              _this8.element.parentNode.removeChild(_this8.element);
              offsetParent.appendChild(_this8.element);
            });
          }

          transcribe(same.offset, pos.offset);
          moved = true;
        })();
      } else {
        css.position = 'absolute';
        transcribe({ top: true, left: true }, pos.page);
      }

      if (!moved) {
        if (this.options.bodyElement) {
          if (this.element.parentNode !== this.options.bodyElement) {
            this.options.bodyElement.appendChild(this.element);
          }
        } else {
          var offsetParentIsBody = true;
          var currentNode = this.element.parentNode;
          while (currentNode && currentNode.nodeType === 1 && currentNode.tagName !== 'BODY') {
            if (getComputedStyle(currentNode).position !== 'static') {
              offsetParentIsBody = false;
              break;
            }

            currentNode = currentNode.parentNode;
          }

          if (!offsetParentIsBody) {
            this.element.parentNode.removeChild(this.element);
            this.element.ownerDocument.body.appendChild(this.element);
          }
        }
      }

      // Any css change will trigger a repaint, so let's avoid one if nothing changed
      var writeCSS = {};
      var write = false;
      for (var key in css) {
        var val = css[key];
        var elVal = this.element.style[key];

        if (elVal !== val) {
          write = true;
          writeCSS[key] = val;
        }
      }

      if (write) {
        defer(function () {
          extend(_this8.element.style, writeCSS);
          _this8.trigger('repositioned');
        });
      }
    }
  }]);

  return TetherClass;
})(Evented);

TetherClass.modules = [];

TetherBase.position = position;

var Tether = extend(TetherClass, TetherBase);
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var extend = _TetherBase$Utils.extend;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

var BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

function getBoundingRect(tether, to) {
  if (to === 'scrollParent') {
    to = tether.scrollParents[0];
  } else if (to === 'window') {
    to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
  }

  if (to === document) {
    to = to.documentElement;
  }

  if (typeof to.nodeType !== 'undefined') {
    (function () {
      var node = to;
      var size = getBounds(to);
      var pos = size;
      var style = getComputedStyle(to);

      to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top];

      // Account any parent Frames scroll offset
      if (node.ownerDocument !== document) {
        var win = node.ownerDocument.defaultView;
        to[0] += win.pageXOffset;
        to[1] += win.pageYOffset;
        to[2] += win.pageXOffset;
        to[3] += win.pageYOffset;
      }

      BOUNDS_FORMAT.forEach(function (side, i) {
        side = side[0].toUpperCase() + side.substr(1);
        if (side === 'Top' || side === 'Left') {
          to[i] += parseFloat(style['border' + side + 'Width']);
        } else {
          to[i] -= parseFloat(style['border' + side + 'Width']);
        }
      });
    })();
  }

  return to;
}

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;
    var targetAttachment = _ref.targetAttachment;

    if (!this.options.constraints) {
      return true;
    }

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
      var _lastSize = this.lastSize;

      // Handle the item getting hidden as a result of our positioning without glitching
      // the classes in and out
      width = _lastSize.width;
      height = _lastSize.height;
    }

    var targetSize = this.cache('target-bounds', function () {
      return _this.getTargetBounds();
    });

    var targetHeight = targetSize.height;
    var targetWidth = targetSize.width;

    var allClasses = [this.getClass('pinned'), this.getClass('out-of-bounds')];

    this.options.constraints.forEach(function (constraint) {
      var outOfBoundsClass = constraint.outOfBoundsClass;
      var pinnedClass = constraint.pinnedClass;

      if (outOfBoundsClass) {
        allClasses.push(outOfBoundsClass);
      }
      if (pinnedClass) {
        allClasses.push(pinnedClass);
      }
    });

    allClasses.forEach(function (cls) {
      ['left', 'top', 'right', 'bottom'].forEach(function (side) {
        allClasses.push(cls + '-' + side);
      });
    });

    var addClasses = [];

    var tAttachment = extend({}, targetAttachment);
    var eAttachment = extend({}, this.attachment);

    this.options.constraints.forEach(function (constraint) {
      var to = constraint.to;
      var attachment = constraint.attachment;
      var pin = constraint.pin;

      if (typeof attachment === 'undefined') {
        attachment = '';
      }

      var changeAttachX = undefined,
          changeAttachY = undefined;
      if (attachment.indexOf(' ') >= 0) {
        var _attachment$split = attachment.split(' ');

        var _attachment$split2 = _slicedToArray(_attachment$split, 2);

        changeAttachY = _attachment$split2[0];
        changeAttachX = _attachment$split2[1];
      } else {
        changeAttachX = changeAttachY = attachment;
      }

      var bounds = getBoundingRect(_this, to);

      if (changeAttachY === 'target' || changeAttachY === 'both') {
        if (top < bounds[1] && tAttachment.top === 'top') {
          top += targetHeight;
          tAttachment.top = 'bottom';
        }

        if (top + height > bounds[3] && tAttachment.top === 'bottom') {
          top -= targetHeight;
          tAttachment.top = 'top';
        }
      }

      if (changeAttachY === 'together') {
        if (tAttachment.top === 'top') {
          if (eAttachment.top === 'bottom' && top < bounds[1]) {
            top += targetHeight;
            tAttachment.top = 'bottom';

            top += height;
            eAttachment.top = 'top';
          } else if (eAttachment.top === 'top' && top + height > bounds[3] && top - (height - targetHeight) >= bounds[1]) {
            top -= height - targetHeight;
            tAttachment.top = 'bottom';

            eAttachment.top = 'bottom';
          }
        }

        if (tAttachment.top === 'bottom') {
          if (eAttachment.top === 'top' && top + height > bounds[3]) {
            top -= targetHeight;
            tAttachment.top = 'top';

            top -= height;
            eAttachment.top = 'bottom';
          } else if (eAttachment.top === 'bottom' && top < bounds[1] && top + (height * 2 - targetHeight) <= bounds[3]) {
            top += height - targetHeight;
            tAttachment.top = 'top';

            eAttachment.top = 'top';
          }
        }

        if (tAttachment.top === 'middle') {
          if (top + height > bounds[3] && eAttachment.top === 'top') {
            top -= height;
            eAttachment.top = 'bottom';
          } else if (top < bounds[1] && eAttachment.top === 'bottom') {
            top += height;
            eAttachment.top = 'top';
          }
        }
      }

      if (changeAttachX === 'target' || changeAttachX === 'both') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          left += targetWidth;
          tAttachment.left = 'right';
        }

        if (left + width > bounds[2] && tAttachment.left === 'right') {
          left -= targetWidth;
          tAttachment.left = 'left';
        }
      }

      if (changeAttachX === 'together') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          if (eAttachment.left === 'right') {
            left += targetWidth;
            tAttachment.left = 'right';

            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'left') {
            left += targetWidth;
            tAttachment.left = 'right';

            left -= width;
            eAttachment.left = 'right';
          }
        } else if (left + width > bounds[2] && tAttachment.left === 'right') {
          if (eAttachment.left === 'left') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'right') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left += width;
            eAttachment.left = 'left';
          }
        } else if (tAttachment.left === 'center') {
          if (left + width > bounds[2] && eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (left < bounds[0] && eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          }
        }
      }

      if (changeAttachY === 'element' || changeAttachY === 'both') {
        if (top < bounds[1] && eAttachment.top === 'bottom') {
          top += height;
          eAttachment.top = 'top';
        }

        if (top + height > bounds[3] && eAttachment.top === 'top') {
          top -= height;
          eAttachment.top = 'bottom';
        }
      }

      if (changeAttachX === 'element' || changeAttachX === 'both') {
        if (left < bounds[0]) {
          if (eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'center') {
            left += width / 2;
            eAttachment.left = 'left';
          }
        }

        if (left + width > bounds[2]) {
          if (eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'center') {
            left -= width / 2;
            eAttachment.left = 'right';
          }
        }
      }

      if (typeof pin === 'string') {
        pin = pin.split(',').map(function (p) {
          return p.trim();
        });
      } else if (pin === true) {
        pin = ['top', 'left', 'right', 'bottom'];
      }

      pin = pin || [];

      var pinned = [];
      var oob = [];

      if (top < bounds[1]) {
        if (pin.indexOf('top') >= 0) {
          top = bounds[1];
          pinned.push('top');
        } else {
          oob.push('top');
        }
      }

      if (top + height > bounds[3]) {
        if (pin.indexOf('bottom') >= 0) {
          top = bounds[3] - height;
          pinned.push('bottom');
        } else {
          oob.push('bottom');
        }
      }

      if (left < bounds[0]) {
        if (pin.indexOf('left') >= 0) {
          left = bounds[0];
          pinned.push('left');
        } else {
          oob.push('left');
        }
      }

      if (left + width > bounds[2]) {
        if (pin.indexOf('right') >= 0) {
          left = bounds[2] - width;
          pinned.push('right');
        } else {
          oob.push('right');
        }
      }

      if (pinned.length) {
        (function () {
          var pinnedClass = undefined;
          if (typeof _this.options.pinnedClass !== 'undefined') {
            pinnedClass = _this.options.pinnedClass;
          } else {
            pinnedClass = _this.getClass('pinned');
          }

          addClasses.push(pinnedClass);
          pinned.forEach(function (side) {
            addClasses.push(pinnedClass + '-' + side);
          });
        })();
      }

      if (oob.length) {
        (function () {
          var oobClass = undefined;
          if (typeof _this.options.outOfBoundsClass !== 'undefined') {
            oobClass = _this.options.outOfBoundsClass;
          } else {
            oobClass = _this.getClass('out-of-bounds');
          }

          addClasses.push(oobClass);
          oob.forEach(function (side) {
            addClasses.push(oobClass + '-' + side);
          });
        })();
      }

      if (pinned.indexOf('left') >= 0 || pinned.indexOf('right') >= 0) {
        eAttachment.left = tAttachment.left = false;
      }
      if (pinned.indexOf('top') >= 0 || pinned.indexOf('bottom') >= 0) {
        eAttachment.top = tAttachment.top = false;
      }

      if (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== _this.attachment.top || eAttachment.left !== _this.attachment.left) {
        _this.updateAttachClasses(eAttachment, tAttachment);
        _this.trigger('update', {
          attachment: eAttachment,
          targetAttachment: tAttachment
        });
      }
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return { top: top, left: left };
  }
});
/* globals TetherBase */

'use strict';

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    var targetPos = this.getTargetBounds();

    var bottom = top + height;
    var right = left + width;

    var abutted = [];
    if (top <= targetPos.bottom && bottom >= targetPos.top) {
      ['left', 'right'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === left || targetPosSide === right) {
          abutted.push(side);
        }
      });
    }

    if (left <= targetPos.right && right >= targetPos.left) {
      ['top', 'bottom'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === top || targetPosSide === bottom) {
          abutted.push(side);
        }
      });
    }

    var allClasses = [];
    var addClasses = [];

    var sides = ['left', 'top', 'right', 'bottom'];
    allClasses.push(this.getClass('abutted'));
    sides.forEach(function (side) {
      allClasses.push(_this.getClass('abutted') + '-' + side);
    });

    if (abutted.length) {
      addClasses.push(this.getClass('abutted'));
    }

    abutted.forEach(function (side) {
      addClasses.push(_this.getClass('abutted') + '-' + side);
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return true;
  }
});
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

TetherBase.modules.push({
  position: function position(_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (!this.options.shift) {
      return;
    }

    var shift = this.options.shift;
    if (typeof this.options.shift === 'function') {
      shift = this.options.shift.call(this, { top: top, left: left });
    }

    var shiftTop = undefined,
        shiftLeft = undefined;
    if (typeof shift === 'string') {
      shift = shift.split(' ');
      shift[1] = shift[1] || shift[0];

      var _shift = shift;

      var _shift2 = _slicedToArray(_shift, 2);

      shiftTop = _shift2[0];
      shiftLeft = _shift2[1];

      shiftTop = parseFloat(shiftTop, 10);
      shiftLeft = parseFloat(shiftLeft, 10);
    } else {
      shiftTop = shift.top;
      shiftLeft = shift.left;
    }

    top += shiftTop;
    left += shiftLeft;

    return { top: top, left: left };
  }
});
return Tether;

}));


/***/ }),

/***/ "../node_modules/tinycolor2/tinycolor.js":
/*!***********************************************!*\
  !*** ../node_modules/tinycolor2/tinycolor.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {return tinycolor;}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
// Browser: Expose to window
else {}

})(Math);


/***/ }),

/***/ "./axes_editor.ts":
/*!************************!*\
  !*** ./axes_editor.ts ***!
  \************************/
/*! exports provided: AxesEditorCtrl, axesEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AxesEditorCtrl", function() { return AxesEditorCtrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axesEditorComponent", function() { return axesEditorComponent; });
/* harmony import */ var grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! grafana/app/core/utils/kbn */ "grafana/app/core/utils/kbn");
/* harmony import */ var grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_0__);

var AxesEditorCtrl = /** @class */ (function () {
    /** @ngInject **/
    function AxesEditorCtrl($scope, $q) {
        this.$scope = $scope;
        this.$q = $q;
        this.panelCtrl = $scope.ctrl;
        this.panel = this.panelCtrl.panel;
        this.$scope.ctrl = this;
        this.unitFormats = grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_0___default.a.getUnitFormats();
        this.logScales = {
            linear: 1,
            'log (base 2)': 2,
            'log (base 10)': 10,
            'log (base 32)': 32,
            'log (base 1024)': 1024,
        };
        this.xAxisModes = {
            Time: 'time',
            Series: 'series',
            Histogram: 'histogram',
        };
        this.xAxisStatOptions = [
            { text: 'Avg', value: 'avg' },
            { text: 'Min', value: 'min' },
            { text: 'Max', value: 'max' },
            { text: 'Total', value: 'total' },
            { text: 'Count', value: 'count' },
            { text: 'Current', value: 'current' },
        ];
        if (this.panel.xaxis.mode === 'custom') {
            if (!this.panel.xaxis.name) {
                this.panel.xaxis.name = 'specify field';
            }
        }
    }
    AxesEditorCtrl.prototype.setUnitFormat = function (axis, subItem) {
        axis.format = subItem.value;
        this.panelCtrl.render();
    };
    AxesEditorCtrl.prototype.render = function () {
        this.panelCtrl.render();
    };
    AxesEditorCtrl.prototype.xAxisModeChanged = function () {
        this.panelCtrl.processor.setPanelDefaultsForNewXAxisMode();
        this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
    };
    AxesEditorCtrl.prototype.xAxisValueChanged = function () {
        this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
    };
    AxesEditorCtrl.prototype.getDataFieldNames = function (onlyNumbers) {
        var props = this.panelCtrl.processor.getDataFieldNames(this.panelCtrl.dataList, onlyNumbers);
        var items = props.map(function (prop) {
            return { text: prop, value: prop };
        });
        return this.$q.when(items);
    };
    return AxesEditorCtrl;
}());

/** @ngInject **/
function axesEditorComponent() {
    'use strict';
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'public/plugins/hastic-graph-panel/partials/axes_editor.html',
        controller: AxesEditorCtrl,
    };
}


/***/ }),

/***/ "./colors.ts":
/*!*******************!*\
  !*** ./colors.ts ***!
  \*******************/
/*! exports provided: PALETTE_ROWS, PALETTE_COLUMNS, DEFAULT_ANNOTATION_COLOR, OK_COLOR, ALERTING_COLOR, NO_DATA_COLOR, REGION_FILL_ALPHA, hexToHsl, hslToHex, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PALETTE_ROWS", function() { return PALETTE_ROWS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PALETTE_COLUMNS", function() { return PALETTE_COLUMNS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_ANNOTATION_COLOR", function() { return DEFAULT_ANNOTATION_COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OK_COLOR", function() { return OK_COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ALERTING_COLOR", function() { return ALERTING_COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NO_DATA_COLOR", function() { return NO_DATA_COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGION_FILL_ALPHA", function() { return REGION_FILL_ALPHA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hexToHsl", function() { return hexToHsl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hslToHex", function() { return hslToHex; });
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tinycolor2 */ "../node_modules/tinycolor2/tinycolor.js");
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tinycolor2__WEBPACK_IMPORTED_MODULE_0__);

var PALETTE_ROWS = 4;
var PALETTE_COLUMNS = 14;
var DEFAULT_ANNOTATION_COLOR = 'rgba(0, 211, 255, 1)';
var OK_COLOR = 'rgba(11, 237, 50, 1)';
var ALERTING_COLOR = 'rgba(237, 46, 24, 1)';
var NO_DATA_COLOR = 'rgba(150, 150, 150, 1)';
var REGION_FILL_ALPHA = 0.09;
var colors = [
    '#7EB26D',
    '#EAB839',
    '#6ED0E0',
    '#EF843C',
    '#E24D42',
    '#1F78C1',
    '#BA43A9',
    '#705DA0',
    '#508642',
    '#CCA300',
    '#447EBC',
    '#C15C17',
    '#890F02',
    '#0A437C',
    '#6D1F62',
    '#584477',
    '#B7DBAB',
    '#F4D598',
    '#70DBED',
    '#F9BA8F',
    '#F29191',
    '#82B5D8',
    '#E5A8E2',
    '#AEA2E0',
    '#629E51',
    '#E5AC0E',
    '#64B0C8',
    '#E0752D',
    '#BF1B00',
    '#0A50A1',
    '#962D82',
    '#614D93',
    '#9AC48A',
    '#F2C96D',
    '#65C5DB',
    '#F9934E',
    '#EA6460',
    '#5195CE',
    '#D683CE',
    '#806EB7',
    '#3F6833',
    '#967302',
    '#2F575E',
    '#99440A',
    '#58140C',
    '#052B51',
    '#511749',
    '#3F2B5B',
    '#E0F9D7',
    '#FCEACA',
    '#CFFAFF',
    '#F9E2D2',
    '#FCE2DE',
    '#BADFF4',
    '#F9D9F9',
    '#DEDAF7',
];
function hexToHsl(color) {
    return tinycolor2__WEBPACK_IMPORTED_MODULE_0___default()(color).toHsl();
}
function hslToHex(color) {
    return tinycolor2__WEBPACK_IMPORTED_MODULE_0___default()(color).toHexString();
}
/* harmony default export */ __webpack_exports__["default"] = (colors);


/***/ }),

/***/ "./controllers/analytic_controller.ts":
/*!********************************************!*\
  !*** ./controllers/analytic_controller.ts ***!
  \********************************************/
/*! exports provided: REGION_FILL_ALPHA, REGION_STROKE_ALPHA, REGION_DELETE_COLOR_LIGHT, REGION_DELETE_COLOR_DARK, AnalyticController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGION_FILL_ALPHA", function() { return REGION_FILL_ALPHA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGION_STROKE_ALPHA", function() { return REGION_STROKE_ALPHA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGION_DELETE_COLOR_LIGHT", function() { return REGION_DELETE_COLOR_LIGHT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGION_DELETE_COLOR_DARK", function() { return REGION_DELETE_COLOR_DARK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnalyticController", function() { return AnalyticController; });
/* harmony import */ var _models_analytic_unit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/analytic_unit */ "./models/analytic_unit.ts");
/* harmony import */ var _models_segment_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/segment_array */ "./models/segment_array.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
// Corresponds to https://github.com/hastic/hastic-server/blob/master/server/src/models/analytic_unit.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};



var REGION_FILL_ALPHA = 0.7;
var REGION_STROKE_ALPHA = 0.9;
var REGION_DELETE_COLOR_LIGHT = '#d1d1d1';
var REGION_DELETE_COLOR_DARK = 'white';
var AnalyticController = /** @class */ (function () {
    function AnalyticController(_panelObject, _analyticService, _emitter) {
        var _this = this;
        this._panelObject = _panelObject;
        this._analyticService = _analyticService;
        this._emitter = _emitter;
        this._selectedAnalyticUnitKey = null;
        this._newAnalyticUnit = null;
        this._creatingNewAnalyticType = false;
        this._savingNewAnalyticUnit = false;
        this._tempIdCounted = -1;
        this._graphLocked = false;
        this._statusRunners = new Set();
        if (_panelObject.anomalyTypes === undefined) {
            _panelObject.anomalyTypes = [];
        }
        this._labelingDataAddedSegments = new _models_segment_array__WEBPACK_IMPORTED_MODULE_1__["SegmentArray"]();
        this._labelingDataDeletedSegments = new _models_segment_array__WEBPACK_IMPORTED_MODULE_1__["SegmentArray"]();
        this._analyticUnitsSet = new _models_analytic_unit__WEBPACK_IMPORTED_MODULE_0__["AnalyticUnitsSet"](this._panelObject.anomalyTypes);
        this.analyticUnits.forEach(function (a) { return _this.runEnabledWaiter(a); });
    }
    AnalyticController.prototype.getSegmentsSearcher = function () {
        return this._segmentsSearcher.bind(this);
    };
    AnalyticController.prototype._segmentsSearcher = function (point, rangeDist) {
        var result = [];
        this._analyticUnitsSet.items.forEach(function (at) {
            var segs = at.segments.findSegments(point, rangeDist);
            segs.forEach(function (s) {
                result.push({ anomalyType: at, segment: s });
            });
        });
        return result;
    };
    AnalyticController.prototype.createNew = function () {
        this._newAnalyticUnit = new _models_analytic_unit__WEBPACK_IMPORTED_MODULE_0__["AnalyticUnit"]();
        this._creatingNewAnalyticType = true;
        this._savingNewAnalyticUnit = false;
    };
    AnalyticController.prototype.saveNew = function (metricExpanded, datasourceRequest, panelId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._savingNewAnalyticUnit = true;
                        _a = this._newAnalyticUnit;
                        return [4 /*yield*/, this._analyticService.postNewItem(metricExpanded, datasourceRequest, this._newAnalyticUnit, panelId)];
                    case 1:
                        _a.id = _b.sent();
                        this._analyticUnitsSet.addItem(this._newAnalyticUnit);
                        this._creatingNewAnalyticType = false;
                        this._savingNewAnalyticUnit = false;
                        this.runEnabledWaiter(this._newAnalyticUnit);
                        this._runStatusWaiter(this._newAnalyticUnit);
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(AnalyticController.prototype, "creatingNew", {
        get: function () { return this._creatingNewAnalyticType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticController.prototype, "saving", {
        get: function () { return this._savingNewAnalyticUnit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticController.prototype, "newAnalyticUnit", {
        get: function () { return this._newAnalyticUnit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticController.prototype, "graphLocked", {
        get: function () { return this._graphLocked; },
        set: function (value) { this._graphLocked = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticController.prototype, "labelingAnomaly", {
        get: function () {
            if (this._selectedAnalyticUnitKey === null) {
                return null;
            }
            return this._analyticUnitsSet.byId(this._selectedAnalyticUnitKey);
        },
        enumerable: true,
        configurable: true
    });
    AnalyticController.prototype.toggleAnomalyTypeLabelingMode = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.labelingAnomaly && this.labelingAnomaly.saving) {
                            throw new Error('Can`t toggel during saving');
                        }
                        if (this._selectedAnalyticUnitKey === key) {
                            return [2 /*return*/, this.disableLabeling()];
                        }
                        return [4 /*yield*/, this.disableLabeling()];
                    case 1:
                        _a.sent();
                        this._selectedAnalyticUnitKey = key;
                        this.labelingAnomaly.selected = true;
                        this.toggleVisibility(key, true);
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticController.prototype.disableLabeling = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var newIds, anomaly;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._selectedAnalyticUnitKey === null) {
                            return [2 /*return*/];
                        }
                        this.labelingAnomaly.saving = true;
                        return [4 /*yield*/, this._saveLabelingData()];
                    case 1:
                        newIds = _a.sent();
                        this._labelingDataAddedSegments.getSegments().forEach(function (s, i) {
                            _this.labelingAnomaly.segments.updateId(s.id, newIds[i]);
                        });
                        this.labelingAnomaly.saving = false;
                        anomaly = this.labelingAnomaly;
                        this.dropLabeling();
                        this._runStatusWaiter(anomaly);
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticController.prototype.undoLabeling = function () {
        var _this = this;
        this._labelingDataAddedSegments.getSegments().forEach(function (s) {
            _this.labelingAnomaly.segments.remove(s.id);
        });
        this._labelingDataDeletedSegments.getSegments().forEach(function (s) {
            _this.labelingAnomaly.segments.addSegment(s);
        });
        this.dropLabeling();
    };
    AnalyticController.prototype.dropLabeling = function () {
        this._labelingDataAddedSegments.clear();
        this._labelingDataDeletedSegments.clear();
        this.labelingAnomaly.selected = false;
        this._selectedAnalyticUnitKey = null;
        this._tempIdCounted = -1;
    };
    Object.defineProperty(AnalyticController.prototype, "labelingMode", {
        get: function () {
            return this._selectedAnalyticUnitKey !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticController.prototype, "labelingDeleteMode", {
        get: function () {
            if (!this.labelingMode) {
                return false;
            }
            return this.labelingAnomaly.deleteMode;
        },
        enumerable: true,
        configurable: true
    });
    AnalyticController.prototype.addLabelSegment = function (segment) {
        var asegment = this.labelingAnomaly.addLabeledSegment(segment);
        this._labelingDataAddedSegments.addSegment(asegment);
    };
    Object.defineProperty(AnalyticController.prototype, "analyticUnits", {
        get: function () {
            return this._analyticUnitsSet.items;
        },
        enumerable: true,
        configurable: true
    });
    AnalyticController.prototype.onAnomalyColorChange = function (key, value) {
        this._analyticUnitsSet.byId(key).color = value;
    };
    AnalyticController.prototype.fetchAnomalyTypesStatuses = function () {
        var _this = this;
        this.analyticUnits.forEach(function (a) { return _this._runStatusWaiter(a); });
    };
    AnalyticController.prototype.fetchAnomalyTypesSegments = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var tasks;
            return __generator(this, function (_a) {
                if (!lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isNumber(+from)) {
                    throw new Error('from isn`t number');
                }
                if (!lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isNumber(+to)) {
                    throw new Error('to isn`t number');
                }
                tasks = this.analyticUnits.map(function (a) { return _this.fetchSegments(a, from, to); });
                return [2 /*return*/, Promise.all(tasks)];
            });
        });
    };
    AnalyticController.prototype.fetchSegments = function (anomalyType, from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var allSegmentsList, allSegmentsSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isNumber(+from)) {
                            throw new Error('from isn`t number');
                        }
                        if (!lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isNumber(+to)) {
                            throw new Error('to isn`t number');
                        }
                        return [4 /*yield*/, this._analyticService.getSegments(anomalyType.id, from, to)];
                    case 1:
                        allSegmentsList = _a.sent();
                        allSegmentsSet = new _models_segment_array__WEBPACK_IMPORTED_MODULE_1__["SegmentArray"](allSegmentsList);
                        if (anomalyType.selected) {
                            this._labelingDataAddedSegments.getSegments().forEach(function (s) { return allSegmentsSet.addSegment(s); });
                            this._labelingDataDeletedSegments.getSegments().forEach(function (s) { return allSegmentsSet.remove(s.id); });
                        }
                        anomalyType.segments = allSegmentsSet;
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticController.prototype._saveLabelingData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var anomaly;
            return __generator(this, function (_a) {
                anomaly = this.labelingAnomaly;
                if (anomaly === null) {
                    throw new Error('anomaly is not selected');
                }
                if (this._labelingDataAddedSegments.length === 0 &&
                    this._labelingDataDeletedSegments.length === 0) {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, this._analyticService.updateSegments(anomaly.id, this._labelingDataAddedSegments, this._labelingDataDeletedSegments)];
            });
        });
    };
    // TODO: move to renderer
    AnalyticController.prototype.updateFlotEvents = function (isEditMode, options) {
        if (options.grid.markings === undefined) {
            options.markings = [];
        }
        for (var i = 0; i < this.analyticUnits.length; i++) {
            var anomalyType = this.analyticUnits[i];
            var borderColor = addAlphaToRGB(anomalyType.color, REGION_STROKE_ALPHA);
            var fillColor = addAlphaToRGB(anomalyType.color, REGION_FILL_ALPHA);
            var segments = anomalyType.segments.getSegments();
            if (!anomalyType.visible) {
                continue;
            }
            if (isEditMode && this.labelingMode) {
                if (anomalyType.selected) {
                    borderColor = addAlphaToRGB(borderColor, 0.7);
                    fillColor = addAlphaToRGB(borderColor, 0.7);
                }
                else {
                    continue;
                }
            }
            var rangeDist = +options.xaxis.max - +options.xaxis.min;
            segments.forEach(function (s) {
                var expanded = s.expandDist(rangeDist, 0.01);
                options.grid.markings.push({
                    xaxis: { from: expanded.from, to: expanded.to },
                    color: fillColor
                });
                options.grid.markings.push({
                    xaxis: { from: expanded.from, to: expanded.from },
                    color: borderColor
                });
                options.grid.markings.push({
                    xaxis: { from: expanded.to, to: expanded.to },
                    color: borderColor
                });
            });
        }
    };
    AnalyticController.prototype.deleteLabelingAnomalySegmentsInRange = function (from, to) {
        var _this = this;
        var allRemovedSegs = this.labelingAnomaly.removeSegmentsInRange(from, to);
        allRemovedSegs.forEach(function (s) {
            if (!_this._labelingDataAddedSegments.has(s.id)) {
                _this._labelingDataDeletedSegments.addSegment(s);
            }
        });
        this._labelingDataAddedSegments.removeInRange(from, to);
    };
    AnalyticController.prototype.toggleDeleteMode = function () {
        if (!this.labelingMode) {
            throw new Error('Cant enter delete mode is labeling mode disabled');
        }
        this.labelingAnomaly.deleteMode = !this.labelingAnomaly.deleteMode;
    };
    AnalyticController.prototype.removeAnomalyType = function (key) {
        if (key === this._selectedAnalyticUnitKey) {
            this.dropLabeling();
        }
        this._analyticUnitsSet.removeItem(key);
    };
    AnalyticController.prototype._runStatusWaiter = function (anomalyType) {
        return __awaiter(this, void 0, void 0, function () {
            var statusGenerator, statusGenerator_1, statusGenerator_1_1, data, status_1, error, e_1_1, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (anomalyType === undefined || anomalyType === null) {
                            throw new Error('anomalyType not defined');
                        }
                        if (anomalyType.id === undefined) {
                            throw new Error('anomalyType.id is undefined');
                        }
                        if (this._statusRunners.has(anomalyType.id)) {
                            return [2 /*return*/];
                        }
                        this._statusRunners.add(anomalyType.id);
                        statusGenerator = this._analyticService.getStatusGenerator(anomalyType.id, 1000);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 13]);
                        statusGenerator_1 = __asyncValues(statusGenerator);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, statusGenerator_1.next()];
                    case 3:
                        if (!(statusGenerator_1_1 = _b.sent(), !statusGenerator_1_1.done)) return [3 /*break*/, 6];
                        return [4 /*yield*/, statusGenerator_1_1.value];
                    case 4:
                        data = _b.sent();
                        status_1 = data.status;
                        error = data.errorMessage;
                        if (anomalyType.status !== status_1) {
                            anomalyType.status = status_1;
                            if (error !== undefined) {
                                anomalyType.error = error;
                            }
                            this._emitter.emit('anomaly-type-status-change', anomalyType);
                        }
                        if (!anomalyType.isActiveStatus) {
                            return [3 /*break*/, 6];
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(statusGenerator_1_1 && !statusGenerator_1_1.done && (_a = statusGenerator_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(statusGenerator_1)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13:
                        this._statusRunners.delete(anomalyType.id);
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticController.prototype.runEnabledWaiter = function (anomalyType) {
        return __awaiter(this, void 0, void 0, function () {
            var enabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._analyticService.getAlertEnabled(anomalyType.id)];
                    case 1:
                        enabled = _a.sent();
                        if (anomalyType.alertEnabled !== enabled) {
                            anomalyType.alertEnabled = enabled;
                            this._emitter.emit('anomaly-type-alert-change', anomalyType);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticController.prototype.toggleAlertEnabled = function (anomalyType) {
        return __awaiter(this, void 0, void 0, function () {
            var enabled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enabled = anomalyType.alertEnabled;
                        anomalyType.alertEnabled = undefined;
                        return [4 /*yield*/, this._analyticService.setAlertEnabled(anomalyType.id, enabled)];
                    case 1:
                        _a.sent();
                        anomalyType.alertEnabled = enabled;
                        this._emitter.emit('anomaly-type-alert-change', anomalyType);
                        return [2 /*return*/];
                }
            });
        });
    };
    AnalyticController.prototype.getIdForNewLabelSegment = function () {
        this._tempIdCounted--;
        return this._tempIdCounted;
    };
    AnalyticController.prototype.toggleVisibility = function (key, value) {
        var anomaly = this._analyticUnitsSet.byId(key);
        if (value !== undefined) {
            anomaly.visible = value;
        }
        else {
            anomaly.visible = !anomaly.visible;
        }
    };
    return AnalyticController;
}());

function addAlphaToRGB(colorString, alpha) {
    var color = tinycolor(colorString);
    if (color.isValid()) {
        color.setAlpha(color.getAlpha() * alpha);
        return color.toRgbString();
    }
    else {
        return colorString;
    }
}


/***/ }),

/***/ "./data_processor.ts":
/*!***************************!*\
  !*** ./data_processor.ts ***!
  \***************************/
/*! exports provided: DataProcessor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataProcessor", function() { return DataProcessor; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var grafana_app_core_time_series2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! grafana/app/core/time_series2 */ "grafana/app/core/time_series2");
/* harmony import */ var grafana_app_core_time_series2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_time_series2__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _colors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./colors */ "./colors.ts");



var DataProcessor = /** @class */ (function () {
    function DataProcessor(panel) {
        this.panel = panel;
    }
    DataProcessor.prototype.getSeriesList = function (options) {
        var _this = this;
        if (!options.dataList || options.dataList.length === 0) {
            return [];
        }
        // auto detect xaxis mode
        var firstItem;
        if (options.dataList && options.dataList.length > 0) {
            firstItem = options.dataList[0];
            var autoDetectMode = this.getAutoDetectXAxisMode(firstItem);
            if (this.panel.xaxis.mode !== autoDetectMode) {
                this.panel.xaxis.mode = autoDetectMode;
                this.setPanelDefaultsForNewXAxisMode();
            }
        }
        switch (this.panel.xaxis.mode) {
            case 'series':
            case 'time': {
                return options.dataList.map(function (item, index) {
                    return _this.timeSeriesHandler(item, index, options);
                });
            }
            case 'histogram': {
                var histogramDataList = [
                    {
                        target: 'count',
                        datapoints: lodash__WEBPACK_IMPORTED_MODULE_0___default.a.concat([], lodash__WEBPACK_IMPORTED_MODULE_0___default.a.flatten(lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(options.dataList, 'datapoints'))),
                    },
                ];
                return histogramDataList.map(function (item, index) {
                    return _this.timeSeriesHandler(item, index, options);
                });
            }
            case 'field': {
                return this.customHandler(firstItem);
            }
        }
    };
    DataProcessor.prototype.getAutoDetectXAxisMode = function (firstItem) {
        switch (firstItem.type) {
            case 'docs':
                return 'field';
            case 'table':
                return 'field';
            default: {
                if (this.panel.xaxis.mode === 'series') {
                    return 'series';
                }
                if (this.panel.xaxis.mode === 'histogram') {
                    return 'histogram';
                }
                return 'time';
            }
        }
    };
    DataProcessor.prototype.setPanelDefaultsForNewXAxisMode = function () {
        switch (this.panel.xaxis.mode) {
            case 'time': {
                this.panel.bars = false;
                this.panel.lines = true;
                this.panel.points = false;
                this.panel.legend.show = true;
                this.panel.tooltip.shared = true;
                this.panel.xaxis.values = [];
                break;
            }
            case 'series': {
                this.panel.bars = true;
                this.panel.lines = false;
                this.panel.points = false;
                this.panel.stack = false;
                this.panel.legend.show = false;
                this.panel.tooltip.shared = false;
                this.panel.xaxis.values = ['total'];
                break;
            }
            case 'histogram': {
                this.panel.bars = true;
                this.panel.lines = false;
                this.panel.points = false;
                this.panel.stack = false;
                this.panel.legend.show = false;
                this.panel.tooltip.shared = false;
                break;
            }
        }
    };
    DataProcessor.prototype.timeSeriesHandler = function (seriesData, index, options) {
        var datapoints = seriesData.datapoints || [];
        var alias = seriesData.target;
        var colorIndex = index % _colors__WEBPACK_IMPORTED_MODULE_2__["default"].length;
        var color = seriesData.color || this.panel.aliasColors[alias] || _colors__WEBPACK_IMPORTED_MODULE_2__["default"][colorIndex];
        var series = new grafana_app_core_time_series2__WEBPACK_IMPORTED_MODULE_1___default.a({
            datapoints: datapoints,
            alias: alias,
            color: color,
            unit: seriesData.unit,
        });
        if (datapoints && datapoints.length > 0) {
            var last = datapoints[datapoints.length - 1][1];
            var from = options.range.from;
            if (last - from < -10000) {
                series.isOutsideRange = true;
            }
        }
        return series;
    };
    DataProcessor.prototype.customHandler = function (dataItem) {
        var nameField = this.panel.xaxis.name;
        if (!nameField) {
            throw {
                message: 'No field name specified to use for x-axis, check your axes settings',
            };
        }
        return [];
    };
    DataProcessor.prototype.validateXAxisSeriesValue = function () {
        switch (this.panel.xaxis.mode) {
            case 'series': {
                if (this.panel.xaxis.values.length === 0) {
                    this.panel.xaxis.values = ['total'];
                    return;
                }
                var validOptions = this.getXAxisValueOptions({});
                var found = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.find(validOptions, { value: this.panel.xaxis.values[0] });
                if (!found) {
                    this.panel.xaxis.values = ['total'];
                }
                return;
            }
        }
    };
    DataProcessor.prototype.getDataFieldNames = function (dataList, onlyNumbers) {
        if (dataList.length === 0) {
            return [];
        }
        var fields = [];
        var firstItem = dataList[0];
        var fieldParts = [];
        function getPropertiesRecursive(obj) {
            lodash__WEBPACK_IMPORTED_MODULE_0___default.a.forEach(obj, function (value, key) {
                if (lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(value)) {
                    fieldParts.push(key);
                    getPropertiesRecursive(value);
                }
                else {
                    if (!onlyNumbers || lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isNumber(value)) {
                        var field = fieldParts.concat(key).join('.');
                        fields.push(field);
                    }
                }
            });
            fieldParts.pop();
        }
        if (firstItem.type === 'docs') {
            if (firstItem.datapoints.length === 0) {
                return [];
            }
            getPropertiesRecursive(firstItem.datapoints[0]);
        }
        return fields;
    };
    DataProcessor.prototype.getXAxisValueOptions = function (options) {
        switch (this.panel.xaxis.mode) {
            case 'series': {
                return [
                    { text: 'Avg', value: 'avg' },
                    { text: 'Min', value: 'min' },
                    { text: 'Max', value: 'max' },
                    { text: 'Total', value: 'total' },
                    { text: 'Count', value: 'count' },
                ];
            }
        }
        return [];
    };
    DataProcessor.prototype.pluckDeep = function (obj, property) {
        var propertyParts = property.split('.');
        var value = obj;
        for (var i = 0; i < propertyParts.length; ++i) {
            if (value[propertyParts[i]]) {
                value = value[propertyParts[i]];
            }
            else {
                return undefined;
            }
        }
        return value;
    };
    return DataProcessor;
}());



/***/ }),

/***/ "./graph_legend.ts":
/*!*************************!*\
  !*** ./graph_legend.ts ***!
  \*************************/
/*! exports provided: GraphLegend */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphLegend", function() { return GraphLegend; });
/* harmony import */ var perfect_scrollbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! perfect-scrollbar */ "../node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);



var GraphLegend = /** @class */ (function () {
    function GraphLegend($elem, popoverSrv, scope) {
        var _this = this;
        this.$elem = $elem;
        this.popoverSrv = popoverSrv;
        this.scope = scope;
        this.firstRender = true;
        this.ctrl = scope.ctrl;
        this.panel = this.ctrl.panel;
        scope.$on('$destroy', function () {
            if (_this.legendScrollbar) {
                _this.legendScrollbar.destroy();
            }
        });
    }
    GraphLegend.prototype.getSeriesIndexForElement = function (el) {
        return el.parents('[data-series-index]').data('series-index');
    };
    GraphLegend.prototype.openColorSelector = function (e) {
        var _this = this;
        // if we clicked inside poup container ignore click
        if (jquery__WEBPACK_IMPORTED_MODULE_1__(e.target).parents('.popover').length) {
            return;
        }
        var el = jquery__WEBPACK_IMPORTED_MODULE_1__(e.currentTarget).find('.fa-minus');
        var index = this.getSeriesIndexForElement(el);
        var series = this.seriesList[index];
        this.popoverSrv.show({
            element: el[0],
            position: 'bottom left',
            targetAttachment: 'top left',
            template: '<series-color-picker series="series" onToggleAxis="toggleAxis" onColorChange="colorSelected"/>',
            openOn: 'hover',
            model: {
                series: series,
                toggleAxis: function () {
                    _this.ctrl.toggleAxis(series);
                },
                colorSelected: function (color) {
                    _this.ctrl.changeSeriesColor(series, color);
                },
            },
        });
    };
    GraphLegend.prototype.toggleSeries = function (e) {
        var el = jquery__WEBPACK_IMPORTED_MODULE_1__(e.currentTarget);
        var index = this.getSeriesIndexForElement(el);
        var seriesInfo = this.seriesList[index];
        var scrollPosition = this.$elem.find('tbody').scrollTop();
        this.ctrl.toggleSeries(seriesInfo, e);
        this.$elem.find('tbody').scrollTop(scrollPosition);
    };
    GraphLegend.prototype.sortLegend = function (e) {
        var el = jquery__WEBPACK_IMPORTED_MODULE_1__(e.currentTarget);
        var stat = el.data('stat');
        if (stat !== this.panel.legend.sort) {
            this.panel.legend.sortDesc = null;
        }
        // if already sort ascending, disable sorting
        if (this.panel.legend.sortDesc === false) {
            this.panel.legend.sort = null;
            this.panel.legend.sortDesc = null;
            this.ctrl.render();
            return;
        }
        this.panel.legend.sortDesc = !this.panel.legend.sortDesc;
        this.panel.legend.sort = stat;
        this.ctrl.render();
    };
    GraphLegend.prototype.getTableHeaderHtml = function (statName) {
        if (!this.panel.legend[statName]) {
            return '';
        }
        var html = '<th class="pointer" data-stat="' + statName + '">' + statName;
        if (this.panel.legend.sort === statName) {
            var cssClass = this.panel.legend.sortDesc ? 'fa fa-caret-down' : 'fa fa-caret-up';
            html += ' <span class="' + cssClass + '"></span>';
        }
        return html + '</th>';
    };
    GraphLegend.prototype.render = function () {
        this.data = this.ctrl.seriesList;
        if (!this.ctrl.panel.legend.show) {
            this.$elem.empty();
            this.firstRender = true;
            return;
        }
        if (this.firstRender) {
            this.$elem.on('click', '.graph-legend-icon', this.openColorSelector.bind(this));
            this.$elem.on('click', '.graph-legend-alias', this.toggleSeries.bind(this));
            this.$elem.on('click', 'th', this.sortLegend.bind(this));
            this.firstRender = false;
        }
        this.seriesList = this.data;
        this.$elem.empty();
        // Set min-width if side style and there is a value, otherwise remove the CSS propery
        var width = this.panel.legend.rightSide && this.panel.legend.sideWidth ? this.panel.legend.sideWidth + 'px' : '';
        this.$elem.css('min-width', width);
        this.$elem.toggleClass('graph-legend-table', this.panel.legend.alignAsTable === true);
        var tableHeaderElem;
        if (this.panel.legend.alignAsTable) {
            var header = '<tr>';
            header += '<th colspan="2" style="text-align:left"></th>';
            if (this.panel.legend.values) {
                header += this.getTableHeaderHtml('min');
                header += this.getTableHeaderHtml('max');
                header += this.getTableHeaderHtml('avg');
                header += this.getTableHeaderHtml('current');
                header += this.getTableHeaderHtml('total');
            }
            header += '</tr>';
            tableHeaderElem = jquery__WEBPACK_IMPORTED_MODULE_1__(header);
        }
        if (this.panel.legend.sort) {
            this.seriesList = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.sortBy(this.seriesList, function (series) {
                return series.stats[this.panel.legend.sort];
            });
            if (this.panel.legend.sortDesc) {
                this.seriesList = this.seriesList.reverse();
            }
        }
        // render first time for getting proper legend height
        if (!this.panel.legend.rightSide) {
            this.renderLegendElement(tableHeaderElem);
            this.$elem.empty();
        }
        this.renderLegendElement(tableHeaderElem);
    };
    GraphLegend.prototype.renderSeriesLegendElements = function () {
        var seriesElements = [];
        for (var i = 0; i < this.seriesList.length; i++) {
            var series = this.seriesList[i];
            if (series.hideFromLegend(this.panel.legend)) {
                continue;
            }
            var html = '<div class="graph-legend-series';
            if (series.yaxis === 2) {
                html += ' graph-legend-series--right-y';
            }
            if (this.ctrl.hiddenSeries[series.alias]) {
                html += ' graph-legend-series-hidden';
            }
            html += '" data-series-index="' + i + '">';
            html += '<div class="graph-legend-icon">';
            html += '<i class="fa fa-minus pointer" style="color:' + series.color + '"></i>';
            html += '</div>';
            html +=
                '<a class="graph-legend-alias pointer" title="' + series.aliasEscaped + '">' + series.aliasEscaped + '</a>';
            if (this.panel.legend.values) {
                var avg = series.formatValue(series.stats.avg);
                var current = series.formatValue(series.stats.current);
                var min = series.formatValue(series.stats.min);
                var max = series.formatValue(series.stats.max);
                var total = series.formatValue(series.stats.total);
                if (this.panel.legend.min) {
                    html += '<div class="graph-legend-value min">' + min + '</div>';
                }
                if (this.panel.legend.max) {
                    html += '<div class="graph-legend-value max">' + max + '</div>';
                }
                if (this.panel.legend.avg) {
                    html += '<div class="graph-legend-value avg">' + avg + '</div>';
                }
                if (this.panel.legend.current) {
                    html += '<div class="graph-legend-value current">' + current + '</div>';
                }
                if (this.panel.legend.total) {
                    html += '<div class="graph-legend-value total">' + total + '</div>';
                }
            }
            html += '</div>';
            seriesElements.push(jquery__WEBPACK_IMPORTED_MODULE_1__(html));
        }
        return seriesElements;
    };
    GraphLegend.prototype.renderLegendElement = function (tableHeaderElem) {
        var seriesElements = this.renderSeriesLegendElements();
        if (this.panel.legend.alignAsTable) {
            var tbodyElem = jquery__WEBPACK_IMPORTED_MODULE_1__('<tbody></tbody>');
            tbodyElem.append(tableHeaderElem);
            tbodyElem.append(seriesElements);
            this.$elem.append(tbodyElem);
        }
        else {
            this.$elem.append(seriesElements);
        }
        if (!this.panel.legend.rightSide) {
            this.addScrollbar();
        }
        else {
            this.destroyScrollbar();
        }
    };
    GraphLegend.prototype.addScrollbar = function () {
        var scrollbarOptions = {
            // Number of pixels the content height can surpass the container height without enabling the scroll bar.
            scrollYMarginOffset: 2,
            suppressScrollX: true,
        };
        if (!this.legendScrollbar) {
            this.legendScrollbar = new perfect_scrollbar__WEBPACK_IMPORTED_MODULE_0__["default"](this.$elem[0], scrollbarOptions);
        }
        else {
            this.legendScrollbar.update();
        }
    };
    GraphLegend.prototype.destroyScrollbar = function () {
        if (this.legendScrollbar) {
            this.legendScrollbar.destroy();
        }
    };
    return GraphLegend;
}());



/***/ }),

/***/ "./graph_renderer.ts":
/*!***************************!*\
  !*** ./graph_renderer.ts ***!
  \***************************/
/*! exports provided: GraphRenderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphRenderer", function() { return GraphRenderer; });
/* harmony import */ var _models_segment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/segment */ "./models/segment.ts");
/* harmony import */ var _graph_tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./graph_tooltip */ "./graph_tooltip.ts");
/* harmony import */ var _threshold_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./threshold_manager */ "./threshold_manager.ts");
/* harmony import */ var _histogram__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./histogram */ "./histogram.ts");
/* harmony import */ var _controllers_analytic_controller__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./controllers/analytic_controller */ "./controllers/analytic_controller.ts");
/* harmony import */ var _vendor_flot_jquery_flot__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./vendor/flot/jquery.flot */ "./vendor/flot/jquery.flot.js");
/* harmony import */ var _vendor_flot_jquery_flot__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _vendor_flot_jquery_flot_time__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.time */ "./vendor/flot/jquery.flot.time.js");
/* harmony import */ var _vendor_flot_jquery_flot_time__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_time__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _vendor_flot_jquery_flot_selection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.selection */ "./vendor/flot/jquery.flot.selection.js");
/* harmony import */ var _vendor_flot_jquery_flot_selection__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_selection__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _vendor_flot_jquery_flot_stack__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.stack */ "./vendor/flot/jquery.flot.stack.js");
/* harmony import */ var _vendor_flot_jquery_flot_stack__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_stack__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _vendor_flot_jquery_flot_stackpercent__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.stackpercent */ "./vendor/flot/jquery.flot.stackpercent.js");
/* harmony import */ var _vendor_flot_jquery_flot_stackpercent__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_stackpercent__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _vendor_flot_jquery_flot_fillbelow__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.fillbelow */ "./vendor/flot/jquery.flot.fillbelow.js");
/* harmony import */ var _vendor_flot_jquery_flot_fillbelow__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_fillbelow__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _vendor_flot_jquery_flot_crosshair__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.crosshair */ "./vendor/flot/jquery.flot.crosshair.js");
/* harmony import */ var _vendor_flot_jquery_flot_crosshair__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_crosshair__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _vendor_flot_jquery_flot_dashes__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.dashes */ "./vendor/flot/jquery.flot.dashes.js");
/* harmony import */ var _vendor_flot_jquery_flot_dashes__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_dashes__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _vendor_flot_jquery_flot_events__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./vendor/flot/jquery.flot.events */ "./vendor/flot/jquery.flot.events.js");
/* harmony import */ var _vendor_flot_jquery_flot_events__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot_events__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var grafana_app_core_utils_ticks__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! grafana/app/core/utils/ticks */ "grafana/app/core/utils/ticks");
/* harmony import */ var grafana_app_core_utils_ticks__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_utils_ticks__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! grafana/app/core/core */ "grafana/app/core/core");
/* harmony import */ var grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! grafana/app/core/utils/kbn */ "grafana/app/core/utils/kbn");
/* harmony import */ var grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_19__);





















var COLOR_SELECTION = '#666';
var GraphRenderer = /** @class */ (function () {
    function GraphRenderer($elem, timeSrv, popoverSrv, contextSrv, scope) {
        var _this = this;
        // private eventManager;
        this.flotOptions = {};
        var self = this;
        this.$elem = $elem;
        this.ctrl = scope.ctrl;
        this.dashboard = this.ctrl.dashboard;
        this.panel = this.ctrl.panel;
        this.timeSrv = timeSrv;
        this.popoverSrv = popoverSrv;
        this.contextSrv = contextSrv;
        this.scope = scope;
        this._ananlyticController = this.ctrl.analyticsController;
        if (this._ananlyticController === undefined) {
            throw new Error('ananlyticController is undefined');
        }
        this.annotations = [];
        this.panelWidth = 0;
        // this.eventManager = new EventManager(this.ctrl);
        this.flotOptions = {};
        this.thresholdManager = new _threshold_manager__WEBPACK_IMPORTED_MODULE_2__["ThresholdManager"](this.ctrl);
        this.tooltip = new _graph_tooltip__WEBPACK_IMPORTED_MODULE_1__["GraphTooltip"]($elem, this.dashboard, scope, function () { return _this.sortedSeries; }, this._ananlyticController.getSegmentsSearcher());
        // panel events
        this.ctrl.events.on('panel-teardown', function () {
            _this.thresholdManager = null;
            if (_this.plot) {
                _this.plot.destroy();
                _this.plot = null;
            }
        });
        // global events
        grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15__["appEvents"].on('graph-hover', this._onGraphHover.bind(this), scope);
        grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15__["appEvents"].on('graph-hover-clear', this._onGraphHoverClear.bind(this), scope);
        $elem.bind('plotselected', function (event, selectionEvent) {
            if (_this.panel.xaxis.mode !== 'time') {
                // Skip if panel in histogram or series mode
                _this.plot.clearSelection();
                return;
            }
            if (_this._isAnomalyEvent(selectionEvent)) {
                _this.plot.clearSelection();
                var id = _this._ananlyticController.getIdForNewLabelSegment();
                var segment = new _models_segment__WEBPACK_IMPORTED_MODULE_0__["Segment"](id, Math.round(selectionEvent.xaxis.from), Math.round(selectionEvent.xaxis.to));
                if (_this._ananlyticController.labelingDeleteMode) {
                    _this._ananlyticController.deleteLabelingAnomalySegmentsInRange(segment.from, segment.to);
                }
                else {
                    _this._ananlyticController.addLabelSegment(segment);
                }
                _this._renderPanel();
                return;
            }
            if ((selectionEvent.ctrlKey || selectionEvent.metaKey) && contextSrv.isEditor) {
                // Add annotation
                setTimeout(function () {
                    // this.eventManager.updateTime(selectionEvent.xaxis);
                }, 100);
            }
            else {
                scope.$apply(function () {
                    timeSrv.setTime({
                        from: moment__WEBPACK_IMPORTED_MODULE_19___default.a.utc(selectionEvent.xaxis.from),
                        to: moment__WEBPACK_IMPORTED_MODULE_19___default.a.utc(selectionEvent.xaxis.to),
                    });
                });
            }
        });
        $elem.bind('plotclick', function (event, flotEvent, item) {
            if (_this.panel.xaxis.mode !== 'time') {
                // Skip if panel in histogram or series mode
                return;
            }
            if (_this._isAnomalyEvent(flotEvent)) {
                return;
            }
            if ((flotEvent.ctrlKey || flotEvent.metaKey) && contextSrv.isEditor) {
                // Skip if range selected (added in "plotselected" event handler)
                var isRangeSelection = flotEvent.x !== flotEvent.x1;
                if (!isRangeSelection) {
                    setTimeout(function () {
                        // this.eventManager.updateTime({ from: flotEvent.x, to: null });
                    }, 100);
                }
            }
        });
        $elem.mouseleave(function () {
            if (_this.panel.tooltip.shared) {
                var plot = $elem.data().plot;
                if (plot) {
                    _this.tooltip.clear(plot);
                }
            }
            grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15__["appEvents"].emit('graph-hover-clear');
        });
        $elem.bind("plothover", function (event, pos, item) {
            self.tooltip.show(pos, item);
            pos.panelRelY = (pos.pageY - $elem.offset().top) / $elem.height();
            self._graphMousePosition = _this.plot.p2c(pos);
            grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15__["appEvents"].emit('graph-hover', { pos: pos, panel: _this.panel });
        });
        $elem.bind("plotclick", function (event, pos, item) {
            grafana_app_core_core__WEBPACK_IMPORTED_MODULE_15__["appEvents"].emit('graph-click', { pos: pos, panel: _this.panel, item: item });
        });
        $elem.mousedown(function (e) {
            _this._ananlyticController.graphLocked = true;
            _this._chooseSelectionColor(e);
        });
        jquery__WEBPACK_IMPORTED_MODULE_17__(document).mouseup(function (e) {
            _this._ananlyticController.graphLocked = false;
        });
    }
    GraphRenderer.prototype.render = function (renderData) {
        this.data = renderData || this.data;
        if (!this.data) {
            return;
        }
        this.annotations = this.ctrl.annotations || [];
        this._buildFlotPairs(this.data);
        updateLegendValues(this.data, this.panel);
        this._renderPanel();
        if (this.tooltip.visible) {
            var pos = this.plot.c2p(this._graphMousePosition);
            var canvasOffset = this.$elem.find('.flot-overlay').offset();
            this.tooltip.show(pos);
            this.plot.setCrosshair(pos);
        }
    };
    GraphRenderer.prototype._onGraphHover = function (evt) {
        if (!this.dashboard.sharedTooltipModeEnabled()) {
            return;
        }
        // ignore if we are the emitter
        if (!this.plot || evt.panel.id === this.panel.id || this.ctrl.otherPanelInFullscreenMode()) {
            return;
        }
        this._graphMousePosition = this.plot.p2c(evt.pos);
        this.tooltip.show(evt.pos);
    };
    GraphRenderer.prototype._onGraphHoverClear = function () {
        if (this.plot) {
            this.tooltip.clear(this.plot);
        }
    };
    GraphRenderer.prototype._shouldAbortRender = function () {
        if (!this.data) {
            return true;
        }
        if (this.panelWidth === 0) {
            return true;
        }
        return false;
    };
    GraphRenderer.prototype._drawHook = function (plot) {
        // add left axis labels
        if (this.panel.yaxes[0].label && this.panel.yaxes[0].show) {
            jquery__WEBPACK_IMPORTED_MODULE_17__("<div class='axisLabel left-yaxis-label flot-temp-elem'></div>")
                .text(this.panel.yaxes[0].label)
                .appendTo(this.$elem);
        }
        // add right axis labels
        if (this.panel.yaxes[1].label && this.panel.yaxes[1].show) {
            jquery__WEBPACK_IMPORTED_MODULE_17__("<div class='axisLabel right-yaxis-label flot-temp-elem'></div>")
                .text(this.panel.yaxes[1].label)
                .appendTo(this.$elem);
        }
        if (this.ctrl.dataWarning) {
            jquery__WEBPACK_IMPORTED_MODULE_17__("<div class=\"datapoints-warning flot-temp-elem\">" + this.ctrl.dataWarning.title + "</div>").appendTo(this.$elem);
        }
        this.thresholdManager.draw(plot);
    };
    GraphRenderer.prototype._processOffsetHook = function (plot, gridMargin) {
        var left = this.panel.yaxes[0];
        var right = this.panel.yaxes[1];
        if (left.show && left.label) {
            gridMargin.left = 20;
        }
        if (right.show && right.label) {
            gridMargin.right = 20;
        }
        // apply y-axis min/max options
        var yaxis = plot.getYAxes();
        for (var i = 0; i < yaxis.length; i++) {
            var axis = yaxis[i];
            var panelOptions = this.panel.yaxes[i];
            axis.options.max = axis.options.max !== null ? axis.options.max : panelOptions.max;
            axis.options.min = axis.options.min !== null ? axis.options.min : panelOptions.min;
        }
    };
    // Series could have different timeSteps,
    // let's find the smallest one so that bars are correctly rendered.
    // In addition, only take series which are rendered as bars for this.
    GraphRenderer.prototype._getMinTimeStepOfSeries = function (data) {
        var min = Number.MAX_VALUE;
        for (var i = 0; i < data.length; i++) {
            if (!data[i].stats.timeStep) {
                continue;
            }
            if (this.panel.bars) {
                if (data[i].bars && data[i].bars.show === false) {
                    continue;
                }
            }
            else {
                if (typeof data[i].bars === 'undefined' || typeof data[i].bars.show === 'undefined' || !data[i].bars.show) {
                    continue;
                }
            }
            if (data[i].stats.timeStep < min) {
                min = data[i].stats.timeStep;
            }
        }
        return min;
    };
    // Function for rendering panel
    GraphRenderer.prototype._renderPanel = function () {
        this.panelWidth = this.$elem.width();
        if (this._shouldAbortRender()) {
            return;
        }
        // give space to alert editing
        this.thresholdManager.prepare(this.$elem, this.data);
        // un-check dashes if lines are unchecked
        this.panel.dashes = this.panel.lines ? this.panel.dashes : false;
        // Populate element
        this._buildFlotOptions(this.panel);
        this._prepareXAxis(this.panel);
        this._configureYAxisOptions(this.data);
        this.thresholdManager.addFlotOptions(this.flotOptions, this.panel);
        // this.eventManager.addFlotEvents(this.annotations, this.flotOptions);
        this._ananlyticController.updateFlotEvents(this.contextSrv.isEditor, this.flotOptions);
        this.sortedSeries = this._sortSeries(this.data, this.panel);
        this._callPlot(true);
    };
    GraphRenderer.prototype._chooseSelectionColor = function (e) {
        var color = COLOR_SELECTION;
        var fillAlpha = 0.4;
        var strokeAlpha = 0.4;
        if (this._isAnomalyEvent(e)) {
            if (this._ananlyticController.labelingDeleteMode) {
                color = this.contextSrv.user.lightTheme ?
                    _controllers_analytic_controller__WEBPACK_IMPORTED_MODULE_4__["REGION_DELETE_COLOR_LIGHT"] :
                    _controllers_analytic_controller__WEBPACK_IMPORTED_MODULE_4__["REGION_DELETE_COLOR_DARK"];
            }
            else {
                color = this._ananlyticController.labelingAnomaly.color;
            }
            fillAlpha = _controllers_analytic_controller__WEBPACK_IMPORTED_MODULE_4__["REGION_FILL_ALPHA"];
            strokeAlpha = _controllers_analytic_controller__WEBPACK_IMPORTED_MODULE_4__["REGION_STROKE_ALPHA"];
        }
        this.plot.getOptions().selection.color = color;
    };
    GraphRenderer.prototype._buildFlotPairs = function (data) {
        for (var i = 0; i < data.length; i++) {
            var series = data[i];
            series.data = series.getFlotPairs(series.nullPointMode || this.panel.nullPointMode);
            // if hidden remove points and disable stack
            if (this.ctrl.hiddenSeries[series.alias]) {
                series.data = [];
                series.stack = false;
            }
        }
    };
    GraphRenderer.prototype._prepareXAxis = function (panel) {
        switch (panel.xaxis.mode) {
            case 'series': {
                this.flotOptions.series.bars.barWidth = 0.7;
                this.flotOptions.series.bars.align = 'center';
                for (var i = 0; i < this.data.length; i++) {
                    var series = this.data[i];
                    series.data = [[i + 1, series.stats[panel.xaxis.values[0]]]];
                }
                this._addXSeriesAxis();
                break;
            }
            case 'histogram': {
                var bucketSize = void 0;
                var values = Object(_histogram__WEBPACK_IMPORTED_MODULE_3__["getSeriesValues"])(this.data);
                if (this.data.length && values.length) {
                    var histMin = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.min(lodash__WEBPACK_IMPORTED_MODULE_18___default.a.map(this.data, function (s) { return s.stats.min; }));
                    var histMax = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.max(lodash__WEBPACK_IMPORTED_MODULE_18___default.a.map(this.data, function (s) { return s.stats.max; }));
                    var ticks = panel.xaxis.buckets || this.panelWidth / 50;
                    bucketSize = Object(grafana_app_core_utils_ticks__WEBPACK_IMPORTED_MODULE_14__["tickStep"])(histMin, histMax, ticks);
                    var histogram = Object(_histogram__WEBPACK_IMPORTED_MODULE_3__["convertValuesToHistogram"])(values, bucketSize);
                    this.data[0].data = histogram;
                    this.flotOptions.series.bars.barWidth = bucketSize * 0.8;
                }
                else {
                    bucketSize = 0;
                }
                this._addXHistogramAxis(bucketSize);
                break;
            }
            case 'table': {
                this.flotOptions.series.bars.barWidth = 0.7;
                this.flotOptions.series.bars.align = 'center';
                this._addXTableAxis();
                break;
            }
            default: {
                this.flotOptions.series.bars.barWidth = this._getMinTimeStepOfSeries(this.data) / 1.5;
                this._addTimeAxis();
                break;
            }
        }
    };
    GraphRenderer.prototype._callPlot = function (incrementRenderCounter) {
        try {
            this.plot = jquery__WEBPACK_IMPORTED_MODULE_17__["plot"](this.$elem, this.sortedSeries, this.flotOptions);
            if (this.ctrl.renderError) {
                delete this.ctrl.error;
                delete this.ctrl.inspector;
            }
        }
        catch (e) {
            console.log('flotcharts error', e);
            this.ctrl.error = e.message || 'Render Error';
            this.ctrl.renderError = true;
            this.ctrl.inspector = { error: e };
        }
        if (incrementRenderCounter) {
            this.ctrl.renderingCompleted();
        }
    };
    GraphRenderer.prototype._buildFlotOptions = function (panel) {
        var stack = panel.stack ? true : null;
        this.flotOptions = {
            hooks: {
                draw: [this._drawHook.bind(this)],
                processOffset: [this._processOffsetHook.bind(this)],
            },
            legend: { show: false },
            series: {
                stackpercent: panel.stack ? panel.percentage : false,
                stack: panel.percentage ? null : stack,
                lines: {
                    show: panel.lines,
                    zero: false,
                    fill: this._translateFillOption(panel.fill),
                    lineWidth: panel.dashes ? 0 : panel.linewidth,
                    steps: panel.steppedLine,
                },
                dashes: {
                    show: panel.dashes,
                    lineWidth: panel.linewidth,
                    dashLength: [panel.dashLength, panel.spaceLength],
                },
                bars: {
                    show: panel.bars,
                    fill: 1,
                    barWidth: 1,
                    zero: false,
                    lineWidth: 0,
                },
                points: {
                    show: panel.points,
                    fill: 1,
                    fillColor: false,
                    radius: panel.points ? panel.pointradius : 2,
                },
                shadowSize: 0,
            },
            yaxes: [],
            xaxis: {},
            grid: {
                minBorderMargin: 0,
                markings: [],
                backgroundColor: null,
                borderWidth: 0,
                hoverable: true,
                clickable: true,
                color: '#c8c8c8',
                margin: { left: 0, right: 0 },
                labelMarginX: 0,
            },
            selection: {
                mode: 'x'
            },
            crosshair: {
                mode: 'x',
            },
        };
    };
    GraphRenderer.prototype._sortSeries = function (series, panel) {
        var sortBy = panel.legend.sort;
        var sortOrder = panel.legend.sortDesc;
        var haveSortBy = sortBy !== null || sortBy !== undefined;
        var haveSortOrder = sortOrder !== null || sortOrder !== undefined;
        var shouldSortBy = panel.stack && haveSortBy && haveSortOrder;
        var sortDesc = panel.legend.sortDesc === true ? -1 : 1;
        series.sort(function (x, y) {
            if (x.zindex > y.zindex) {
                return 1;
            }
            if (x.zindex < y.zindex) {
                return -1;
            }
            if (shouldSortBy) {
                if (x.stats[sortBy] > y.stats[sortBy]) {
                    return 1 * sortDesc;
                }
                if (x.stats[sortBy] < y.stats[sortBy]) {
                    return -1 * sortDesc;
                }
            }
            return 0;
        });
        return series;
    };
    GraphRenderer.prototype._translateFillOption = function (fill) {
        if (this.panel.percentage && this.panel.stack) {
            return fill === 0 ? 0.001 : fill / 10;
        }
        else {
            return fill / 10;
        }
    };
    GraphRenderer.prototype._addTimeAxis = function () {
        var ticks = this.panelWidth / 100;
        var min = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.isUndefined(this.ctrl.range.from) ? null : this.ctrl.range.from.valueOf();
        var max = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.isUndefined(this.ctrl.range.to) ? null : this.ctrl.range.to.valueOf();
        this.flotOptions.xaxis = {
            timezone: this.dashboard.getTimezone(),
            show: this.panel.xaxis.show,
            mode: 'time',
            min: min,
            max: max,
            label: 'Datetime',
            ticks: ticks,
            timeformat: this._timeFormat(ticks, min, max),
        };
    };
    GraphRenderer.prototype._addXSeriesAxis = function () {
        var ticks = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.map(this.data, function (series, index) {
            return [index + 1, series.alias];
        });
        this.flotOptions.xaxis = {
            timezone: this.dashboard.getTimezone(),
            show: this.panel.xaxis.show,
            mode: null,
            min: 0,
            max: ticks.length + 1,
            label: 'Datetime',
            ticks: ticks,
        };
    };
    GraphRenderer.prototype._addXHistogramAxis = function (bucketSize) {
        var ticks, min, max;
        var defaultTicks = this.panelWidth / 50;
        if (this.data.length && bucketSize) {
            ticks = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.map(this.data[0].data, function (point) { return point[0]; });
            min = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.min(ticks);
            max = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.max(ticks);
            // Adjust tick step
            var tickStep_1 = bucketSize;
            var ticks_num = Math.floor((max - min) / tickStep_1);
            while (ticks_num > defaultTicks) {
                tickStep_1 = tickStep_1 * 2;
                ticks_num = Math.ceil((max - min) / tickStep_1);
            }
            // Expand ticks for pretty view
            min = Math.floor(min / tickStep_1) * tickStep_1;
            max = Math.ceil(max / tickStep_1) * tickStep_1;
            ticks = [];
            for (var i = min; i <= max; i += tickStep_1) {
                ticks.push(i);
            }
        }
        else {
            // Set defaults if no data
            ticks = defaultTicks / 2;
            min = 0;
            max = 1;
        }
        this.flotOptions.xaxis = {
            timezone: this.dashboard.getTimezone(),
            show: this.panel.xaxis.show,
            mode: null,
            min: min,
            max: max,
            label: 'Histogram',
            ticks: ticks,
        };
        // Use 'short' format for histogram values
        this._configureAxisMode(this.flotOptions.xaxis, 'short');
    };
    GraphRenderer.prototype._addXTableAxis = function () {
        var ticks = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.map(this.data, function (series, seriesIndex) {
            return lodash__WEBPACK_IMPORTED_MODULE_18___default.a.map(series.datapoints, function (point, pointIndex) {
                var tickIndex = seriesIndex * series.datapoints.length + pointIndex;
                return [tickIndex + 1, point[1]];
            });
        });
        ticks = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.flatten(ticks, true);
        this.flotOptions.xaxis = {
            timezone: this.dashboard.getTimezone(),
            show: this.panel.xaxis.show,
            mode: null,
            min: 0,
            max: ticks.length + 1,
            label: 'Datetime',
            ticks: ticks,
        };
    };
    GraphRenderer.prototype._configureYAxisOptions = function (data) {
        var defaults = {
            position: 'left',
            show: this.panel.yaxes[0].show,
            index: 1,
            logBase: this.panel.yaxes[0].logBase || 1,
            min: this._parseNumber(this.panel.yaxes[0].min),
            max: this._parseNumber(this.panel.yaxes[0].max),
            tickDecimals: this.panel.yaxes[0].decimals,
        };
        this.flotOptions.yaxes.push(defaults);
        if (lodash__WEBPACK_IMPORTED_MODULE_18___default.a.find(data, { yaxis: 2 })) {
            var secondY = lodash__WEBPACK_IMPORTED_MODULE_18___default.a.clone(defaults);
            secondY.index = 2;
            secondY.show = this.panel.yaxes[1].show;
            secondY.logBase = this.panel.yaxes[1].logBase || 1;
            secondY.position = 'right';
            secondY.min = this._parseNumber(this.panel.yaxes[1].min);
            secondY.max = this._parseNumber(this.panel.yaxes[1].max);
            secondY.tickDecimals = this.panel.yaxes[1].decimals;
            this.flotOptions.yaxes.push(secondY);
            this._applyLogScale(this.flotOptions.yaxes[1], data);
            this._configureAxisMode(this.flotOptions.yaxes[1], this.panel.percentage && this.panel.stack ? 'percent' : this.panel.yaxes[1].format);
        }
        this._applyLogScale(this.flotOptions.yaxes[0], data);
        this._configureAxisMode(this.flotOptions.yaxes[0], this.panel.percentage && this.panel.stack ? 'percent' : this.panel.yaxes[0].format);
    };
    GraphRenderer.prototype._parseNumber = function (value) {
        if (value === null || typeof value === 'undefined') {
            return null;
        }
        return lodash__WEBPACK_IMPORTED_MODULE_18___default.a.toNumber(value);
    };
    GraphRenderer.prototype._applyLogScale = function (axis, data) {
        if (axis.logBase === 1) {
            return;
        }
        var minSetToZero = axis.min === 0;
        if (axis.min < Number.MIN_VALUE) {
            axis.min = null;
        }
        if (axis.max < Number.MIN_VALUE) {
            axis.max = null;
        }
        var series, i;
        var max = axis.max, min = axis.min;
        for (i = 0; i < data.length; i++) {
            series = data[i];
            if (series.yaxis === axis.index) {
                if (!max || max < series.stats.max) {
                    max = series.stats.max;
                }
                if (!min || min > series.stats.logmin) {
                    min = series.stats.logmin;
                }
            }
        }
        axis.transform = function (v) {
            return v < Number.MIN_VALUE ? null : Math.log(v) / Math.log(axis.logBase);
        };
        axis.inverseTransform = function (v) {
            return Math.pow(axis.logBase, v);
        };
        if (!max && !min) {
            max = axis.inverseTransform(+2);
            min = axis.inverseTransform(-2);
        }
        else if (!max) {
            max = min * axis.inverseTransform(+4);
        }
        else if (!min) {
            min = max * axis.inverseTransform(-4);
        }
        if (axis.min) {
            min = axis.inverseTransform(Math.ceil(axis.transform(axis.min)));
        }
        else {
            min = axis.min = axis.inverseTransform(Math.floor(axis.transform(min)));
        }
        if (axis.max) {
            max = axis.inverseTransform(Math.floor(axis.transform(axis.max)));
        }
        else {
            max = axis.max = axis.inverseTransform(Math.ceil(axis.transform(max)));
        }
        if (!min || min < Number.MIN_VALUE || !max || max < Number.MIN_VALUE) {
            return;
        }
        if (Number.isFinite(min) && Number.isFinite(max)) {
            if (minSetToZero) {
                axis.min = 0.1;
                min = 1;
            }
            axis.ticks = this._generateTicksForLogScaleYAxis(min, max, axis.logBase);
            if (minSetToZero) {
                axis.ticks.unshift(0.1);
            }
            if (axis.ticks[axis.ticks.length - 1] > axis.max) {
                axis.max = axis.ticks[axis.ticks.length - 1];
            }
        }
        else {
            axis.ticks = [1, 2];
            delete axis.min;
            delete axis.max;
        }
    };
    GraphRenderer.prototype._generateTicksForLogScaleYAxis = function (min, max, logBase) {
        var ticks = [];
        var nextTick;
        for (nextTick = min; nextTick <= max; nextTick *= logBase) {
            ticks.push(nextTick);
        }
        var maxNumTicks = Math.ceil(this.ctrl.height / 25);
        var numTicks = ticks.length;
        if (numTicks > maxNumTicks) {
            var factor = Math.ceil(numTicks / maxNumTicks) * logBase;
            ticks = [];
            for (nextTick = min; nextTick <= max * factor; nextTick *= factor) {
                ticks.push(nextTick);
            }
        }
        return ticks;
    };
    GraphRenderer.prototype._configureAxisMode = function (axis, format) {
        axis.tickFormatter = function (val, axis) {
            return grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_16___default.a.valueFormats[format](val, axis.tickDecimals, axis.scaledDecimals);
        };
    };
    GraphRenderer.prototype._timeFormat = function (ticks, min, max) {
        if (min && max && ticks) {
            var range = max - min;
            var secPerTick = range / ticks / 1000;
            var oneDay = 86400000;
            var oneYear = 31536000000;
            if (secPerTick <= 45) {
                return '%H:%M:%S';
            }
            if (secPerTick <= 7200 || range <= oneDay) {
                return '%H:%M';
            }
            if (secPerTick <= 80000) {
                return '%m/%d %H:%M';
            }
            if (secPerTick <= 2419200 || range <= oneYear) {
                return '%m/%d';
            }
            return '%Y-%m';
        }
        return '%H:%M';
    };
    GraphRenderer.prototype._isAnomalyEvent = function (obj) {
        return (obj.ctrlKey || obj.metaKey) &&
            this.contextSrv.isEditor &&
            this._ananlyticController.labelingMode;
    };
    return GraphRenderer;
}());

function updateLegendValues(data, panel) {
    for (var i = 0; i < data.length; i++) {
        var series = data[i];
        var yaxes = panel.yaxes;
        var seriesYAxis = series.yaxis || 1;
        var axis = yaxes[seriesYAxis - 1];
        var _a = Object(grafana_app_core_utils_ticks__WEBPACK_IMPORTED_MODULE_14__["getFlotTickDecimals"])(data, axis), tickDecimals = _a.tickDecimals, scaledDecimals = _a.scaledDecimals;
        var formater = grafana_app_core_utils_kbn__WEBPACK_IMPORTED_MODULE_16___default.a.valueFormats[panel.yaxes[seriesYAxis - 1].format];
        // decimal override
        if (lodash__WEBPACK_IMPORTED_MODULE_18___default.a.isNumber(panel.decimals)) {
            series.updateLegendValues(formater, panel.decimals, null);
        }
        else {
            // auto decimals
            // legend and tooltip gets one more decimal precision
            // than graph legend ticks
            tickDecimals = (tickDecimals || -1) + 1;
            series.updateLegendValues(formater, tickDecimals, scaledDecimals + 2);
        }
    }
}


/***/ }),

/***/ "./graph_tooltip.ts":
/*!**************************!*\
  !*** ./graph_tooltip.ts ***!
  \**************************/
/*! exports provided: GraphTooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphTooltip", function() { return GraphTooltip; });
var GraphTooltip = /** @class */ (function () {
    function GraphTooltip($elem, dashboard, scope, getSeriesFn, _anomalySegmentsSearcher) {
        this.$elem = $elem;
        this.dashboard = dashboard;
        this.scope = scope;
        this.getSeriesFn = getSeriesFn;
        this._anomalySegmentsSearcher = _anomalySegmentsSearcher;
        this._visible = false;
        this._lastItem = undefined;
        this.ctrl = scope.ctrl;
        this.panel = this.ctrl.panel;
        this.$tooltip = $('<div class="graph-tooltip">');
    }
    GraphTooltip.prototype.clear = function (plot) {
        this._visible = false;
        this.$tooltip.detach();
        plot.clearCrosshair();
        plot.unhighlight();
    };
    ;
    GraphTooltip.prototype.show = function (pos, item) {
        if (item === undefined) {
            item = this._lastItem;
        }
        else {
            this._lastItem = item;
        }
        this._visible = true;
        var plot = this.$elem.data().plot;
        var plotData = plot.getData();
        var xAxes = plot.getXAxes();
        var xMode = xAxes[0].options.mode;
        var seriesList = this.getSeriesFn();
        var allSeriesMode = this.panel.tooltip.shared;
        var group, value, absoluteTime, hoverInfo, i, series, seriesHtml, tooltipFormat;
        var rangeDist = Math.abs(xAxes[0].max - xAxes[0].min);
        // if panelRelY is defined another panel wants us to show a tooltip
        // get pageX from position on x axis and pageY from relative position in original panel
        if (pos.panelRelY) {
            var pointOffset = plot.pointOffset({ x: pos.x });
            if (Number.isNaN(pointOffset.left) || pointOffset.left < 0 || pointOffset.left > this.$elem.width()) {
                this.clear(plot);
                return;
            }
            pos.pageX = this.$elem.offset().left + pointOffset.left;
            pos.pageY = this.$elem.offset().top + this.$elem.height() * pos.panelRelY;
            var isVisible = pos.pageY >= $(window).scrollTop() &&
                pos.pageY <= $(window).innerHeight() + $(window).scrollTop();
            if (!isVisible) {
                this.clear(plot);
                return;
            }
            plot.setCrosshair(pos);
            allSeriesMode = true;
            if (this.dashboard.sharedCrosshairModeOnly()) {
                // if only crosshair mode we are done
                return;
            }
        }
        if (seriesList.length === 0) {
            return;
        }
        if (seriesList[0].hasMsResolution) {
            tooltipFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
        }
        else {
            tooltipFormat = 'YYYY-MM-DD HH:mm:ss';
        }
        if (allSeriesMode) {
            plot.unhighlight();
            var seriesHoverInfo = this._getMultiSeriesPlotHoverInfo(plotData, pos);
            seriesHtml = '';
            absoluteTime = this.dashboard.formatDate(seriesHoverInfo.time, tooltipFormat);
            // Dynamically reorder the hovercard for the current time point if the
            // option is enabled.
            if (this.panel.tooltip.sort === 2) {
                seriesHoverInfo.series.sort(function (a, b) { return b.value - a.value; });
            }
            else if (this.panel.tooltip.sort === 1) {
                seriesHoverInfo.series.sort(function (a, b) { return a.value - b.value; });
            }
            for (i = 0; i < seriesHoverInfo.series.length; i++) {
                hoverInfo = seriesHoverInfo.series[i];
                if (hoverInfo.hidden) {
                    continue;
                }
                var highlightClass = '';
                if (item && hoverInfo.index === item.seriesIndex) {
                    highlightClass = 'graph-tooltip-list-item--highlight';
                }
                series = seriesList[hoverInfo.index];
                value = series.formatValue(hoverInfo.value);
                seriesHtml += '<div class="graph-tooltip-list-item ' + highlightClass + '"><div class="graph-tooltip-series-name">';
                seriesHtml += '<i class="fa fa-minus" style="color:' + hoverInfo.color + ';"></i> ' + hoverInfo.label + ':</div>';
                seriesHtml += '<div class="graph-tooltip-value">' + value + '</div></div>';
                plot.highlight(hoverInfo.index, hoverInfo.hoverIndex);
            }
            seriesHtml += this._appendAnomaliesHTML(pos.x, rangeDist);
            this._renderAndShow(absoluteTime, seriesHtml, pos, xMode);
        }
        // single series tooltip
        else if (item) {
            series = seriesList[item.seriesIndex];
            group = '<div class="graph-tooltip-list-item"><div class="graph-tooltip-series-name">';
            group += '<i class="fa fa-minus" style="color:' + item.series.color + ';"></i> ' + series.aliasEscaped + ':</div>';
            if (this.panel.stack && this.panel.tooltip.value_type === 'individual') {
                value = item.datapoint[1] - item.datapoint[2];
            }
            else {
                value = item.datapoint[1];
            }
            value = series.formatValue(value);
            absoluteTime = this.dashboard.formatDate(item.datapoint[0], tooltipFormat);
            group += '<div class="graph-tooltip-value">' + value + '</div>';
            group += this._appendAnomaliesHTML(pos.x, rangeDist);
            this._renderAndShow(absoluteTime, group, pos, xMode);
        }
        // no hit
        else {
            this.$tooltip.detach();
        }
    };
    ;
    GraphTooltip.prototype.destroy = function () {
        this._visible = false;
        this.$tooltip.remove();
    };
    ;
    Object.defineProperty(GraphTooltip.prototype, "visible", {
        get: function () { return this._visible; },
        enumerable: true,
        configurable: true
    });
    GraphTooltip.prototype._findHoverIndexFromDataPoints = function (posX, series, last) {
        var ps = series.datapoints.pointsize;
        var initial = last * ps;
        var len = series.datapoints.points.length;
        for (var j = initial; j < len; j += ps) {
            // Special case of a non stepped line, highlight the very last point just before a null point
            if ((!series.lines.steps && series.datapoints.points[initial] != null && series.datapoints.points[j] == null)
                //normal case
                || series.datapoints.points[j] > posX) {
                return Math.max(j - ps, 0) / ps;
            }
        }
        return j / ps - 1;
    };
    ;
    GraphTooltip.prototype._findHoverIndexFromData = function (posX, series) {
        var lower = 0;
        var upper = series.data.length - 1;
        var middle;
        while (true) {
            if (lower > upper) {
                return Math.max(upper, 0);
            }
            middle = Math.floor((lower + upper) / 2);
            if (series.data[middle][0] === posX) {
                return middle;
            }
            else if (series.data[middle][0] < posX) {
                lower = middle + 1;
            }
            else {
                upper = middle - 1;
            }
        }
    };
    ;
    GraphTooltip.prototype._appendAnomaliesHTML = function (pos, rangeDist) {
        var _this = this;
        var result = '';
        var segments = this._anomalySegmentsSearcher(pos, rangeDist);
        if (segments.length === 0) {
            return '';
        }
        segments.forEach(function (s) {
            var from = _this.dashboard.formatDate(s.segment.from, 'HH:mm:ss.SSS');
            var to = _this.dashboard.formatDate(s.segment.to, 'HH:mm:ss.SSS');
            result += "\n        <div class=\"graph-tooltip-list-item\">\n          <div class=\"graph-tooltip-series-name\">\n            <i class=\"fa fa-exclamation\" style=\"color:" + s.anomalyType.color + "\"></i>\n            " + s.anomalyType.id + ":\n          </div>\n          <div class=\"graph-tooltip-value\">\n            <i class=\"fa " + (s.segment.labeled ? "fa-thumb-tack" : "fa-search-plus") + "\" aria-hidden=\"true\"></i>\n            " + from + " \u2014 " + to + "\n          </div>\n        </div>\n      ";
        });
        return result;
    };
    GraphTooltip.prototype._renderAndShow = function (absoluteTime, innerHtml, pos, xMode) {
        if (xMode === 'time') {
            innerHtml = '<div class="graph-tooltip-time">' + absoluteTime + '</div>' + innerHtml;
        }
        this.$tooltip.html(innerHtml).place_tt(pos.pageX + 20, pos.pageY);
    };
    ;
    GraphTooltip.prototype._getMultiSeriesPlotHoverInfo = function (seriesList, pos) {
        var value, series, hoverIndex, hoverDistance, pointTime, yaxis;
        // 3 sub-arrays, 1st for hidden series, 2nd for left yaxis, 3rd for right yaxis.
        var results = [[], [], []];
        //now we know the current X (j) position for X and Y values
        var lastValue = 0; //needed for stacked values
        var minDistance, minTime;
        for (var i = 0; i < seriesList.length; i++) {
            series = seriesList[i];
            if (!series.data.length || (this.panel.legend.hideEmpty && series.allIsNull)) {
                // Init value so that it does not brake series sorting
                results[0].push({ hidden: true, value: 0 });
                continue;
            }
            if (!series.data.length || (this.panel.legend.hideZero && series.allIsZero)) {
                // Init value so that it does not brake series sorting
                results[0].push({ hidden: true, value: 0 });
                continue;
            }
            hoverIndex = this._findHoverIndexFromData(pos.x, series);
            hoverDistance = pos.x - series.data[hoverIndex][0];
            pointTime = series.data[hoverIndex][0];
            // Take the closest point before the cursor, or if it does not exist, the closest after
            if (!minDistance
                || (hoverDistance >= 0 && (hoverDistance < minDistance || minDistance < 0))
                || (hoverDistance < 0 && hoverDistance > minDistance)) {
                minDistance = hoverDistance;
                minTime = pointTime;
            }
            if (series.stack) {
                if (this.panel.tooltip.value_type === 'individual') {
                    value = series.data[hoverIndex][1];
                }
                else if (!series.stack) {
                    value = series.data[hoverIndex][1];
                }
                else {
                    lastValue += series.data[hoverIndex][1];
                    value = lastValue;
                }
            }
            else {
                value = series.data[hoverIndex][1];
            }
            // Highlighting multiple Points depending on the plot type
            if (series.lines.steps || series.stack) {
                // stacked and steppedLine plots can have series with different length.
                // Stacked series can increase its length on each new stacked serie if null points found,
                // to speed the index search we begin always on the last found hoverIndex.
                hoverIndex = this._findHoverIndexFromDataPoints(pos.x, series, hoverIndex);
            }
            // Be sure we have a yaxis so that it does not brake series sorting
            yaxis = 0;
            if (series.yaxis) {
                yaxis = series.yaxis.n;
            }
            results[yaxis].push({
                value: value,
                hoverIndex: hoverIndex,
                color: series.color,
                label: series.aliasEscaped,
                time: pointTime,
                distance: hoverDistance,
                index: i
            });
        }
        // Contat the 3 sub-arrays
        results = results[0].concat(results[1], results[2]);
        // Time of the point closer to pointer
        return { series: results, time: minTime };
    };
    ;
    return GraphTooltip;
}());



/***/ }),

/***/ "./histogram.ts":
/*!**********************!*\
  !*** ./histogram.ts ***!
  \**********************/
/*! exports provided: getSeriesValues, convertValuesToHistogram */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSeriesValues", function() { return getSeriesValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertValuesToHistogram", function() { return convertValuesToHistogram; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Convert series into array of series values.
 * @param data Array of series
 */
function getSeriesValues(dataList) {
    var VALUE_INDEX = 0;
    var values = [];
    // Count histogam stats
    for (var i = 0; i < dataList.length; i++) {
        var series = dataList[i];
        var datapoints = series.datapoints;
        for (var j = 0; j < datapoints.length; j++) {
            if (datapoints[j][VALUE_INDEX] !== null) {
                values.push(datapoints[j][VALUE_INDEX]);
            }
        }
    }
    return values;
}
/**
 * Convert array of values into timeseries-like histogram:
 * [[val_1, count_1], [val_2, count_2], ..., [val_n, count_n]]
 * @param values
 * @param bucketSize
 */
function convertValuesToHistogram(values, bucketSize) {
    var histogram = {};
    for (var i = 0; i < values.length; i++) {
        var bound = getBucketBound(values[i], bucketSize);
        if (histogram[bound]) {
            histogram[bound] = histogram[bound] + 1;
        }
        else {
            histogram[bound] = 1;
        }
    }
    var histogam_series = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(histogram, function (count, bound) {
        return [Number(bound), count];
    });
    // Sort by Y axis values
    return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.sortBy(histogam_series, function (point) { return point[0]; });
}
function getBucketBound(value, bucketSize) {
    return Math.floor(value / bucketSize) * bucketSize;
}


/***/ }),

/***/ "./models/analytic_unit.ts":
/*!*********************************!*\
  !*** ./models/analytic_unit.ts ***!
  \*********************************/
/*! exports provided: AnalyticSegment, AnalyticUnit, AnalyticUnitsSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnalyticSegment", function() { return AnalyticSegment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnalyticUnit", function() { return AnalyticUnit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnalyticUnitsSet", function() { return AnalyticUnitsSet; });
/* harmony import */ var _segment_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./segment_array */ "./models/segment_array.ts");
/* harmony import */ var _segment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./segment */ "./models/segment.ts");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var AnalyticSegment = /** @class */ (function (_super) {
    __extends(AnalyticSegment, _super);
    function AnalyticSegment(labeled, key, from, to) {
        var _this = _super.call(this, key, from, to) || this;
        _this.labeled = labeled;
        if (!lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isBoolean(labeled)) {
            throw new Error('labeled value is not boolean');
        }
        return _this;
    }
    return AnalyticSegment;
}(_segment__WEBPACK_IMPORTED_MODULE_1__["Segment"]));

var AnalyticUnit = /** @class */ (function () {
    function AnalyticUnit(_panelObject) {
        this._panelObject = _panelObject;
        this._selected = false;
        this._deleteMode = false;
        this._saving = false;
        this._segmentSet = new _segment_array__WEBPACK_IMPORTED_MODULE_0__["SegmentArray"]();
        if (_panelObject === undefined) {
            this._panelObject = {};
        }
        lodash__WEBPACK_IMPORTED_MODULE_2___default.a.defaults(this._panelObject, {
            name: 'AnalyticUnitName', confidence: 0.2, color: 'red', type: 'General'
        });
        //this._metric = new Metric(_panelObject.metric);
    }
    Object.defineProperty(AnalyticUnit.prototype, "id", {
        get: function () { return this._panelObject.id; },
        set: function (value) { this._panelObject.id = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "name", {
        get: function () { return this._panelObject.name; },
        set: function (value) { this._panelObject.name = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "type", {
        get: function () { return this._panelObject.type; },
        set: function (value) { this._panelObject.type = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "confidence", {
        get: function () { return this._panelObject.confidence; },
        set: function (value) { this._panelObject.confidence = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "color", {
        get: function () { return this._panelObject.color; },
        set: function (value) { this._panelObject.color = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "selected", {
        get: function () { return this._selected; },
        set: function (value) { this._selected = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "deleteMode", {
        get: function () { return this._deleteMode; },
        set: function (value) { this._deleteMode = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "saving", {
        get: function () { return this._saving; },
        set: function (value) { this._saving = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "visible", {
        get: function () {
            return (this._panelObject.visible === undefined) ? true : this._panelObject.visible;
        },
        set: function (value) {
            this._panelObject.visible = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "metric", {
        get: function () { return this._metric; },
        enumerable: true,
        configurable: true
    });
    AnalyticUnit.prototype.addLabeledSegment = function (segment) {
        var asegment = new AnalyticSegment(true, segment.id, segment.from, segment.to);
        this._segmentSet.addSegment(asegment);
        return asegment;
    };
    AnalyticUnit.prototype.removeSegmentsInRange = function (from, to) {
        return this._segmentSet.removeInRange(from, to);
    };
    Object.defineProperty(AnalyticUnit.prototype, "segments", {
        get: function () { return this._segmentSet; },
        set: function (value) {
            this._segmentSet.setSegments(value.getSegments());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "status", {
        get: function () { return this._status; },
        set: function (value) {
            if (value !== 'ready' &&
                value !== 'learning' &&
                value !== 'pending' &&
                value !== 'failed') {
                throw new Error('Unsupported status value: ' + value);
            }
            this._status = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "error", {
        get: function () { return this._error; },
        set: function (value) { this._error = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "isActiveStatus", {
        get: function () {
            return this.status !== 'ready' && this.status !== 'failed';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "panelObject", {
        get: function () { return this._panelObject; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticUnit.prototype, "alertEnabled", {
        get: function () { return this._alertEnabled; },
        set: function (value) { this._alertEnabled = value; },
        enumerable: true,
        configurable: true
    });
    return AnalyticUnit;
}());

var AnalyticUnitsSet = /** @class */ (function () {
    function AnalyticUnitsSet(_panelObject) {
        this._panelObject = _panelObject;
        if (_panelObject === undefined) {
            throw new Error('panel object can`t be undefined');
        }
        this._mapIdIndex = new Map();
        this._items = _panelObject.map(function (p) { return new AnalyticUnit(p); });
        this._rebuildIndex();
    }
    Object.defineProperty(AnalyticUnitsSet.prototype, "items", {
        get: function () { return this._items; },
        enumerable: true,
        configurable: true
    });
    AnalyticUnitsSet.prototype.addItem = function (item) {
        this._panelObject.push(item.panelObject);
        this._mapIdIndex[item.name] = this._items.length;
        this._items.push(item);
    };
    AnalyticUnitsSet.prototype.removeItem = function (id) {
        var index = this._mapIdIndex[id];
        this._panelObject.splice(index, 1);
        this._items.splice(index, 1);
        this._rebuildIndex();
    };
    AnalyticUnitsSet.prototype._rebuildIndex = function () {
        var _this = this;
        this._items.forEach(function (a, i) {
            _this._mapIdIndex[a.id] = i;
        });
    };
    AnalyticUnitsSet.prototype.byId = function (id) {
        return this._items[this._mapIdIndex[id]];
    };
    AnalyticUnitsSet.prototype.byIndex = function (index) {
        return this._items[index];
    };
    return AnalyticUnitsSet;
}());



/***/ }),

/***/ "./models/metric.ts":
/*!**************************!*\
  !*** ./models/metric.ts ***!
  \**************************/
/*! exports provided: Target, Metric, MetricExpanded, MetricMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Target", function() { return Target; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Metric", function() { return Metric; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetricExpanded", function() { return MetricExpanded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetricMap", function() { return MetricMap; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! md5 */ "../node_modules/md5/md5.js");
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(md5__WEBPACK_IMPORTED_MODULE_1__);


var Target = /** @class */ (function () {
    function Target(any) {
        this._data = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.cloneDeep(any);
        this._strip();
    }
    Target.prototype._strip = function () {
        delete this._data.alias;
    };
    Target.prototype.getHash = function () {
        return md5__WEBPACK_IMPORTED_MODULE_1___default()(JSON.stringify(this._data));
    };
    Target.prototype.getJSON = function () {
        return this._data;
    };
    return Target;
}());

var Metric = /** @class */ (function () {
    function Metric(_panelObj) {
        this._panelObj = _panelObj;
        if (_panelObj === undefined) {
            throw new Error('_panelObj is undefined');
        }
    }
    Object.defineProperty(Metric.prototype, "datasource", {
        get: function () { return this._panelObj.datasource; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Metric.prototype, "targetHashs", {
        get: function () { return this._panelObj.targetHashs; },
        enumerable: true,
        configurable: true
    });
    return Metric;
}());

var MetricExpanded = /** @class */ (function () {
    function MetricExpanded(datasource, targets) {
        this.datasource = datasource;
        this._targets = targets.map(function (t) { return new Target(t); });
    }
    MetricExpanded.prototype.toJSON = function () {
        return {
            datasource: this.datasource,
            targets: this._targets.map(function (t) { return t.getJSON(); })
        };
    };
    return MetricExpanded;
}());

var MetricMap = /** @class */ (function () {
    function MetricMap(datasource, targets) {
        var _this = this;
        this._cache = new Map();
        targets.forEach(function (t) {
            _this._cache.set(t.getHash(), t);
        });
    }
    return MetricMap;
}());



/***/ }),

/***/ "./models/segment.ts":
/*!***************************!*\
  !*** ./models/segment.ts ***!
  \***************************/
/*! exports provided: Segment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Segment", function() { return Segment; });
var Segment = /** @class */ (function () {
    function Segment(_id, from, to) {
        this._id = _id;
        this.from = from;
        this.to = to;
        if (isNaN(this._id)) {
            throw new Error('Key can`t be NaN');
        }
        if (isNaN(+from)) {
            throw new Error('from can`t be NaN');
        }
        if (isNaN(+to)) {
            throw new Error('to can`t be NaN');
        }
    }
    Object.defineProperty(Segment.prototype, "id", {
        get: function () { return this._id; },
        set: function (value) { this._id = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Segment.prototype, "middle", {
        get: function () { return (this.from + this.to) / 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Segment.prototype, "length", {
        get: function () {
            return Math.max(this.from, this.to) - Math.min(this.from, this.to);
        },
        enumerable: true,
        configurable: true
    });
    Segment.prototype.expandDist = function (allDist, portion) {
        var p = Math.round(this.middle - allDist * portion / 2);
        var q = Math.round(this.middle + allDist * portion / 2);
        p = Math.min(p, this.from);
        q = Math.max(q, this.to);
        return new Segment(this._id, p, q);
    };
    Segment.prototype.equals = function (segment) {
        return this._id === segment._id;
    };
    return Segment;
}());



/***/ }),

/***/ "./models/segment_array.ts":
/*!*********************************!*\
  !*** ./models/segment_array.ts ***!
  \*********************************/
/*! exports provided: SegmentArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SegmentArray", function() { return SegmentArray; });
var SegmentArray = /** @class */ (function () {
    function SegmentArray(segments) {
        this.segments = segments;
        this._keyToSegment = new Map();
        this.setSegments(segments);
    }
    SegmentArray.prototype.getSegments = function (from, to) {
        if (from === undefined) {
            from = -Infinity;
        }
        if (to === undefined) {
            to = Infinity;
        }
        var result = [];
        for (var i = 0; i < this._segments.length; i++) {
            var s = this._segments[i];
            if (from <= s.from && s.to <= to) {
                result.push(s);
            }
        }
        return result;
    };
    SegmentArray.prototype.setSegments = function (segments) {
        var _this = this;
        this._segments = [];
        this._keyToSegment.clear();
        if (segments) {
            segments.forEach(function (s) {
                _this.addSegment(s);
            });
        }
    };
    SegmentArray.prototype.addSegment = function (segment) {
        if (this.has(segment.id)) {
            throw new Error("Segment with key " + segment.id + " exists in set");
        }
        this._keyToSegment.set(segment.id, segment);
        this._segments.push(segment);
    };
    SegmentArray.prototype.findSegments = function (point, rangeDist) {
        return this._segments.filter(function (s) {
            var expanded = s.expandDist(rangeDist, 0.01);
            return (expanded.from <= point) && (point <= expanded.to);
        });
    };
    SegmentArray.prototype.removeInRange = function (from, to) {
        var deleted = [];
        var newSegments = [];
        for (var i = 0; i < this._segments.length; i++) {
            var s = this._segments[i];
            if (from <= s.from && s.to <= to) {
                this._keyToSegment.delete(s.id);
                deleted.push(s);
            }
            else {
                newSegments.push(s);
            }
        }
        this._segments = newSegments;
        return deleted;
    };
    Object.defineProperty(SegmentArray.prototype, "length", {
        get: function () {
            return this._segments.length;
        },
        enumerable: true,
        configurable: true
    });
    SegmentArray.prototype.clear = function () {
        this._segments = [];
        this._keyToSegment.clear();
    };
    SegmentArray.prototype.has = function (key) {
        return this._keyToSegment.has(key);
    };
    SegmentArray.prototype.remove = function (key) {
        if (!this.has(key)) {
            return false;
        }
        var index = this._segments.findIndex(function (s) { return s.id === key; });
        this._segments.splice(index, 1);
        this._keyToSegment.delete(key);
        return true;
    };
    SegmentArray.prototype.updateId = function (fromKey, toKey) {
        var segment = this._keyToSegment.get(fromKey);
        this._keyToSegment.delete(fromKey);
        segment.id = toKey;
        this._keyToSegment.set(toKey, segment);
    };
    return SegmentArray;
}());



/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! exports provided: GraphCtrl, PanelCtrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphCtrl", function() { return GraphCtrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PanelCtrl", function() { return GraphCtrl; });
/* harmony import */ var _series_overrides_ctrl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./series_overrides_ctrl */ "./series_overrides_ctrl.ts");
/* harmony import */ var _thresholds_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./thresholds_form */ "./thresholds_form.ts");
/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./template */ "./template.ts");
/* harmony import */ var _graph_renderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./graph_renderer */ "./graph_renderer.ts");
/* harmony import */ var _graph_legend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graph_legend */ "./graph_legend.ts");
/* harmony import */ var _data_processor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./data_processor */ "./data_processor.ts");
/* harmony import */ var _models_metric__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/metric */ "./models/metric.ts");
/* harmony import */ var _services_analytic_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./services/analytic_service */ "./services/analytic_service.ts");
/* harmony import */ var _controllers_analytic_controller__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./controllers/analytic_controller */ "./controllers/analytic_controller.ts");
/* harmony import */ var _axes_editor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./axes_editor */ "./axes_editor.ts");
/* harmony import */ var grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! grafana/app/plugins/sdk */ "grafana/app/plugins/sdk");
/* harmony import */ var grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var grafana_app_core_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! grafana/app/core/core */ "grafana/app/core/core");
/* harmony import */ var grafana_app_core_core__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_core__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var grafana_app_core_config__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! grafana/app/core/config */ "grafana/app/core/config");
/* harmony import */ var grafana_app_core_config__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_config__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_13__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};














var BACKEND_VARIABLE_NAME = 'HASTIC_SERVER_URL';
var GraphCtrl = /** @class */ (function (_super) {
    __extends(GraphCtrl, _super);
    /** @ngInject */
    function GraphCtrl($scope, $injector, annotationsSrv, keybindingSrv, backendSrv, popoverSrv, contextSrv, alertSrv) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.annotationsSrv = annotationsSrv;
        _this.keybindingSrv = keybindingSrv;
        _this.backendSrv = backendSrv;
        _this.popoverSrv = popoverSrv;
        _this.contextSrv = contextSrv;
        _this.alertSrv = alertSrv;
        _this.ANALYTIC_TYPES = ['General', 'Drops', 'Peaks'];
        _this.hiddenSeries = {};
        _this.seriesList = [];
        _this.dataList = [];
        _this.annotations = [];
        _this._renderError = false;
        _this.colors = [];
        _this.anomalyTypes = []; // TODO: remove it later. Only for alert tab
        _this.panelDefaults = {
            // datasource name, null = default datasource
            datasource: null,
            // sets client side (flot) or native graphite png renderer (png)
            renderer: 'flot',
            yaxes: [
                {
                    label: null,
                    show: true,
                    logBase: 1,
                    min: null,
                    max: null,
                    format: 'short',
                },
                {
                    label: null,
                    show: true,
                    logBase: 1,
                    min: null,
                    max: null,
                    format: 'short',
                },
            ],
            xaxis: {
                show: true,
                mode: 'time',
                name: null,
                values: [],
                buckets: null,
            },
            // show/hide lines
            lines: true,
            // fill factor
            fill: 1,
            // line width in pixels
            linewidth: 1,
            // show/hide dashed line
            dashes: false,
            // length of a dash
            dashLength: 10,
            // length of space between two dashes
            spaceLength: 10,
            // show hide points
            points: false,
            // point radius in pixels
            pointradius: 5,
            // show hide bars
            bars: false,
            // enable/disable stacking
            stack: false,
            // stack percentage mode
            percentage: false,
            // legend options
            legend: {
                show: true,
                values: false,
                min: false,
                max: false,
                current: false,
                total: false,
                avg: false,
            },
            // how null points should be handled
            nullPointMode: 'null',
            // staircase line mode
            steppedLine: false,
            // tooltip options
            tooltip: {
                value_type: 'individual',
                shared: true,
                sort: 0,
            },
            // time overrides
            timeFrom: null,
            timeShift: null,
            // metric queries
            targets: [{}],
            // series color overrides
            aliasColors: {},
            // other style overrides
            seriesOverrides: [],
            thresholds: [],
            anomalyType: '',
        };
        lodash__WEBPACK_IMPORTED_MODULE_13___default.a.defaults(_this.panel, _this.panelDefaults);
        lodash__WEBPACK_IMPORTED_MODULE_13___default.a.defaults(_this.panel.tooltip, _this.panelDefaults.tooltip);
        lodash__WEBPACK_IMPORTED_MODULE_13___default.a.defaults(_this.panel.legend, _this.panelDefaults.legend);
        lodash__WEBPACK_IMPORTED_MODULE_13___default.a.defaults(_this.panel.xaxis, _this.panelDefaults.xaxis);
        _this.processor = new _data_processor__WEBPACK_IMPORTED_MODULE_5__["DataProcessor"](_this.panel);
        var anomalyService = new _services_analytic_service__WEBPACK_IMPORTED_MODULE_7__["AnalyticService"](_this.backendURL, backendSrv);
        _this.runBackendConnectivityCheck();
        _this.analyticsController = new _controllers_analytic_controller__WEBPACK_IMPORTED_MODULE_8__["AnalyticController"](_this.panel, anomalyService, _this.events);
        _this.anomalyTypes = _this.panel.anomalyTypes;
        keybindingSrv.bind('d', _this.onDKey.bind(_this));
        _this.events.on('render', _this.onRender.bind(_this));
        _this.events.on('data-received', _this.onDataReceived.bind(_this));
        _this.events.on('data-error', _this.onDataError.bind(_this));
        _this.events.on('data-snapshot-load', _this.onDataSnapshotLoad.bind(_this));
        _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
        _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));
        _this.events.on('anomaly-type-alert-change', function () {
            _this.$scope.$digest();
        });
        _this.events.on('anomaly-type-status-change', function (anomalyType) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (anomalyType === undefined) {
                            throw new Error('anomalyType is undefined');
                        }
                        if (!(anomalyType.status === 'ready')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.analyticsController.fetchSegments(anomalyType, +this.range.from, +this.range.to)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.render(this.seriesList);
                        this.$scope.$digest();
                        return [2 /*return*/];
                }
            });
        }); });
        grafana_app_core_core__WEBPACK_IMPORTED_MODULE_11__["appEvents"].on('ds-request-response', function (data) {
            var requestConfig = data.config;
            _this.datasourceRequest = {
                url: requestConfig.url,
                type: requestConfig.inspect.type,
                method: requestConfig.method,
                data: requestConfig.data,
                params: requestConfig.params
            };
        });
        _this.analyticsController.fetchAnomalyTypesStatuses();
        return _this;
    }
    Object.defineProperty(GraphCtrl.prototype, "backendURL", {
        get: function () {
            if (this.templateSrv.index[BACKEND_VARIABLE_NAME] === undefined) {
                return undefined;
            }
            return this.templateSrv.index[BACKEND_VARIABLE_NAME].current.value;
        },
        enumerable: true,
        configurable: true
    });
    GraphCtrl.prototype.runBackendConnectivityCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var as, isOK;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.backendURL === '' || this.backendURL === undefined) {
                            this.alertSrv.set("Dashboard variable $" + BACKEND_VARIABLE_NAME + " is missing", "Please set $" + BACKEND_VARIABLE_NAME, 'warning', 4000);
                            return [2 /*return*/];
                        }
                        as = new _services_analytic_service__WEBPACK_IMPORTED_MODULE_7__["AnalyticService"](this.backendURL, this.backendSrv);
                        return [4 /*yield*/, as.isBackendOk()];
                    case 1:
                        isOK = _a.sent();
                        if (!isOK) {
                            this.alertSrv.set('Can`t connect to Hastic server', "Hastic server: \"" + this.backendURL + "\"", 'warning', 4000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GraphCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
        var $graphElem = $(elem[0]).find('#graphPanel');
        var $legendElem = $(elem[0]).find('#graphLegend');
        this._graphRenderer = new _graph_renderer__WEBPACK_IMPORTED_MODULE_3__["GraphRenderer"]($graphElem, this.timeSrv, this.popoverSrv, this.contextSrv, this.$scope);
        this._graphLegend = new _graph_legend__WEBPACK_IMPORTED_MODULE_4__["GraphLegend"]($legendElem, this.popoverSrv, this.$scope);
    };
    GraphCtrl.prototype.onInitEditMode = function () {
        var partialPath = this.panelPath + 'partials';
        this.addEditorTab('Analytics', partialPath + "/tab_analytics.html", 2);
        this.addEditorTab('Axes', _axes_editor__WEBPACK_IMPORTED_MODULE_9__["axesEditorComponent"], 3);
        this.addEditorTab('Legend', partialPath + "/tab_legend.html", 4);
        this.addEditorTab('Display', partialPath + "/tab_display.html", 5);
        if (grafana_app_core_config__WEBPACK_IMPORTED_MODULE_12___default.a.alertingEnabled) {
            this.addEditorTab('Alert', grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_10__["alertTab"], 6);
        }
        this.subTabIndex = 0;
    };
    GraphCtrl.prototype.onInitPanelActions = function (actions) {
        actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' });
        actions.push({ text: 'Toggle legend', click: 'ctrl.toggleLegend()' });
    };
    GraphCtrl.prototype.issueQueries = function (datasource) {
        this.annotationsPromise = this.annotationsSrv.getAnnotations({
            dashboard: this.dashboard,
            panel: this.panel,
            range: this.range,
        });
        return _super.prototype.issueQueries.call(this, datasource);
    };
    GraphCtrl.prototype.zoomOut = function (evt) {
        this.publishAppEvent('zoom-out', 2);
    };
    GraphCtrl.prototype.onDataSnapshotLoad = function (snapshotData) {
        this.annotationsPromise = this.annotationsSrv.getAnnotations({
            dashboard: this.dashboard,
            panel: this.panel,
            range: this.range,
        });
        this.onDataReceived(snapshotData);
    };
    GraphCtrl.prototype.onDataError = function (err) {
        this.seriesList = [];
        this.annotations = [];
        this.render([]);
    };
    GraphCtrl.prototype.onDataReceived = function (dataList) {
        return __awaiter(this, void 0, void 0, function () {
            var hasSomePoint, _i, _a, series, loadTasks, results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.dataList = dataList;
                        this.seriesList = this.processor.getSeriesList({
                            dataList: dataList,
                            range: this.range,
                        });
                        //this.onPredictionReceived(this.seriesList);
                        this.dataWarning = null;
                        hasSomePoint = this.seriesList.some(function (s) { return s.datapoints.length > 0; });
                        if (!hasSomePoint) {
                            this.dataWarning = {
                                title: 'No data points',
                                tip: 'No datapoints returned from data query',
                            };
                        }
                        else {
                            for (_i = 0, _a = this.seriesList; _i < _a.length; _i++) {
                                series = _a[_i];
                                if (series.isOutsideRange) {
                                    this.dataWarning = {
                                        title: 'Data points outside time range',
                                        tip: 'Can be caused by timezone mismatch or missing time filter in query',
                                    };
                                    break;
                                }
                            }
                        }
                        loadTasks = [
                            this.annotationsPromise,
                            this.analyticsController.fetchAnomalyTypesSegments(+this.range.from, +this.range.to)
                        ];
                        return [4 /*yield*/, Promise.all(loadTasks)];
                    case 1:
                        results = _b.sent();
                        this.loading = false;
                        this.alertState = results[0].alertState;
                        this.annotations = results[0].annotations;
                        this.render(this.seriesList);
                        return [2 /*return*/];
                }
            });
        });
    };
    GraphCtrl.prototype.onPredictionReceived = function (spanList) {
        var predictions = [];
        for (var _i = 0, spanList_1 = spanList; _i < spanList_1.length; _i++) {
            var span = spanList_1[_i];
            var predictionLow = {
                target: '',
                color: '',
                datapoints: []
            };
            var predictionHigh = {
                target: '',
                color: '',
                datapoints: []
            };
            for (var _a = 0, _b = span.datapoints; _a < _b.length; _a++) {
                var datapoint = _b[_a];
                predictionHigh.datapoints.push([datapoint[0] + 2, datapoint[1]]);
                predictionLow.datapoints.push([datapoint[0] - 2, datapoint[1]]);
            }
            predictionHigh.target = span.label + " high";
            predictionLow.target = span.label + " low";
            predictionHigh.color = span.color;
            predictionLow.color = span.color;
            predictions.push(predictionHigh, predictionLow);
        }
        var predictionSeries = this.processor.getSeriesList({
            dataList: predictions,
            range: this.range
        });
        for (var _c = 0, predictionSeries_1 = predictionSeries; _c < predictionSeries_1.length; _c++) {
            var serie = predictionSeries_1[_c];
            serie.prediction = true;
            this.seriesList.push(serie);
        }
    };
    GraphCtrl.prototype.onRender = function (data) {
        if (!this.seriesList) {
            return;
        }
        var _loop_1 = function (series) {
            if (series.prediction) {
                overrideItem = lodash__WEBPACK_IMPORTED_MODULE_13___default.a.find(this_1.panel.seriesOverrides, function (el) { return el.alias === series.alias; });
                if (overrideItem !== undefined) {
                    this_1.addSeriesOverride({
                        alias: series.alias,
                        linewidth: 0,
                        legend: false,
                        // if pointradius === 0 -> point still shows, that's why pointradius === -1
                        pointradius: -1,
                        fill: 3
                    });
                }
            }
            series.applySeriesOverrides(this_1.panel.seriesOverrides);
            if (series.unit) {
                this_1.panel.yaxes[series.yaxis - 1].format = series.unit;
            }
        };
        var this_1 = this, overrideItem;
        for (var _i = 0, _a = this.seriesList; _i < _a.length; _i++) {
            var series = _a[_i];
            _loop_1(series);
        }
        if (!this.analyticsController.graphLocked) {
            this._graphLegend.render();
            this._graphRenderer.render(data);
        }
    };
    GraphCtrl.prototype.changeSeriesColor = function (series, color) {
        series.color = color;
        this.panel.aliasColors[series.alias] = series.color;
        this.render();
    };
    GraphCtrl.prototype.toggleSeries = function (serie, event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
            if (this.hiddenSeries[serie.alias]) {
                delete this.hiddenSeries[serie.alias];
            }
            else {
                this.hiddenSeries[serie.alias] = true;
            }
        }
        else {
            this.toggleSeriesExclusiveMode(serie);
        }
        this.render();
    };
    GraphCtrl.prototype.toggleSeriesExclusiveMode = function (serie) {
        var _this = this;
        var hidden = this.hiddenSeries;
        if (hidden[serie.alias]) {
            delete hidden[serie.alias];
        }
        // check if every other series is hidden
        var alreadyExclusive = lodash__WEBPACK_IMPORTED_MODULE_13___default.a.every(this.seriesList, function (value) {
            if (value.alias === serie.alias) {
                return true;
            }
            return hidden[value.alias];
        });
        if (alreadyExclusive) {
            // remove all hidden series
            lodash__WEBPACK_IMPORTED_MODULE_13___default.a.each(this.seriesList, function (value) {
                delete _this.hiddenSeries[value.alias];
            });
        }
        else {
            // hide all but this serie
            lodash__WEBPACK_IMPORTED_MODULE_13___default.a.each(this.seriesList, function (value) {
                if (value.alias === serie.alias) {
                    return;
                }
                _this.hiddenSeries[value.alias] = true;
            });
        }
    };
    GraphCtrl.prototype.toggleAxis = function (info) {
        var override = lodash__WEBPACK_IMPORTED_MODULE_13___default.a.find(this.panel.seriesOverrides, { alias: info.alias });
        if (!override) {
            override = { alias: info.alias };
            this.panel.seriesOverrides.push(override);
        }
        info.yaxis = override.yaxis = info.yaxis === 2 ? 1 : 2;
        this.render();
    };
    GraphCtrl.prototype.addSeriesOverride = function (override) {
        this.panel.seriesOverrides.push(override || {});
    };
    GraphCtrl.prototype.removeSeriesOverride = function (override) {
        this.panel.seriesOverrides = lodash__WEBPACK_IMPORTED_MODULE_13___default.a.without(this.panel.seriesOverrides, override);
        this.render();
    };
    GraphCtrl.prototype.toggleLegend = function () {
        this.panel.legend.show = !this.panel.legend.show;
        this.refresh();
    };
    GraphCtrl.prototype.legendValuesOptionChanged = function () {
        var legend = this.panel.legend;
        legend.values = legend.min || legend.max || legend.avg || legend.current || legend.total;
        this.render();
    };
    GraphCtrl.prototype.exportCsv = function () {
        var scope = this.$scope.$new(true);
        scope.seriesList = this.seriesList;
        this.publishAppEvent('show-modal', {
            templateHtml: '<export-data-modal data="seriesList"></export-data-modal>',
            scope: scope,
            modalClass: 'modal--narrow',
        });
    };
    GraphCtrl.prototype.getAnnotationsByTag = function (tag) {
        var res = [];
        for (var _i = 0, _a = this.annotations; _i < _a.length; _i++) {
            var annotation = _a[_i];
            if (annotation.tags.indexOf(tag) >= 0) {
                res.push(annotation);
            }
        }
        return res;
    };
    Object.defineProperty(GraphCtrl.prototype, "annotationTags", {
        get: function () {
            var res = [];
            for (var _i = 0, _a = this.annotations; _i < _a.length; _i++) {
                var annotation = _a[_i];
                for (var _b = 0, _c = annotation.tags; _b < _c.length; _b++) {
                    var tag = _c[_b];
                    if (res.indexOf(tag) < 0) {
                        res.push(tag);
                    }
                }
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphCtrl.prototype, "panelPath", {
        get: function () {
            if (this._panelPath === undefined) {
                this._panelPath = '/public/plugins/' + this.pluginId + '/';
            }
            return this._panelPath;
        },
        enumerable: true,
        configurable: true
    });
    GraphCtrl.prototype.createNew = function () {
        this.analyticsController.createNew();
    };
    GraphCtrl.prototype.saveNew = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.refresh();
                        return [4 /*yield*/, this.analyticsController.saveNew(new _models_metric__WEBPACK_IMPORTED_MODULE_6__["MetricExpanded"](this.panel.datasource, this.panel.targets), this.datasourceRequest, this.panel.id)];
                    case 1:
                        _a.sent();
                        this.$scope.$digest();
                        this.render(this.seriesList);
                        return [2 /*return*/];
                }
            });
        });
    };
    GraphCtrl.prototype.onColorChange = function (key, value) {
        this.analyticsController.onAnomalyColorChange(key, value);
        this.render();
    };
    GraphCtrl.prototype.onRemove = function (key) {
        this.analyticsController.removeAnomalyType(key);
        this.render();
    };
    GraphCtrl.prototype.onCancelLabeling = function (key) {
        var _this = this;
        this.$scope.$root.appEvent('confirm-modal', {
            title: 'Clear anomaly labeling',
            text2: 'Your changes will be lost.',
            yesText: 'Clear',
            icon: 'fa-warning',
            altActionText: 'Save',
            onAltAction: function () {
                _this.onToggleLabelingMode(key);
            },
            onConfirm: function () {
                _this.analyticsController.undoLabeling();
                _this.render();
            },
        });
    };
    GraphCtrl.prototype.onToggleLabelingMode = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.analyticsController.toggleAnomalyTypeLabelingMode(key)];
                    case 1:
                        _a.sent();
                        this.$scope.$digest();
                        this.render();
                        return [2 /*return*/];
                }
            });
        });
    };
    GraphCtrl.prototype.onDKey = function () {
        if (!this.analyticsController.labelingMode) {
            return;
        }
        this.analyticsController.toggleDeleteMode();
    };
    GraphCtrl.prototype.onAnomalyAlertChange = function (anomalyType) {
        this.analyticsController.toggleAlertEnabled(anomalyType);
    };
    GraphCtrl.prototype.onToggleVisibility = function (key) {
        this.analyticsController.toggleVisibility(key);
        this.render();
    };
    Object.defineProperty(GraphCtrl.prototype, "renderError", {
        get: function () { return this._renderError; },
        set: function (value) { this._renderError = value; },
        enumerable: true,
        configurable: true
    });
    GraphCtrl.template = _template__WEBPACK_IMPORTED_MODULE_2__["default"];
    return GraphCtrl;
}(grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_10__["MetricsPanelCtrl"]));



/***/ }),

/***/ "./series_overrides_ctrl.ts":
/*!**********************************!*\
  !*** ./series_overrides_ctrl.ts ***!
  \**********************************/
/*! exports provided: SeriesOverridesCtrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesOverridesCtrl", function() { return SeriesOverridesCtrl; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular */ "angular");
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_1__);


var SeriesOverridesCtrl = /** @class */ (function () {
    /** @ngInject */
    function SeriesOverridesCtrl($scope, $element, popoverSrv) {
        $scope.overrideMenu = [];
        $scope.currentOverrides = [];
        $scope.override = $scope.override || {};
        $scope.addOverrideOption = function (name, propertyName, values) {
            var option = {
                text: name,
                propertyName: propertyName,
                index: $scope.overrideMenu.lenght,
                values: values,
                submenu: lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(values, function (value) {
                    return { text: String(value), value: value };
                }),
            };
            $scope.overrideMenu.push(option);
        };
        $scope.setOverride = function (item, subItem) {
            // handle color overrides
            if (item.propertyName === 'color') {
                $scope.openColorSelector($scope.override['color']);
                return;
            }
            $scope.override[item.propertyName] = subItem.value;
            // automatically disable lines for this series and the fill bellow to series
            // can be removed by the user if they still want lines
            if (item.propertyName === 'fillBelowTo') {
                $scope.override['lines'] = false;
                $scope.ctrl.addSeriesOverride({ alias: subItem.value, lines: false });
            }
            $scope.updateCurrentOverrides();
            $scope.ctrl.render();
        };
        $scope.colorSelected = function (color) {
            $scope.override['color'] = color;
            $scope.updateCurrentOverrides();
            $scope.ctrl.render();
        };
        $scope.openColorSelector = function (color) {
            var fakeSeries = { color: color };
            popoverSrv.show({
                element: $element.find('.dropdown')[0],
                position: 'top center',
                openOn: 'click',
                template: '<series-color-picker series="series" onColorChange="colorSelected" />',
                model: {
                    autoClose: true,
                    colorSelected: $scope.colorSelected,
                    series: fakeSeries,
                },
                onClose: function () {
                    $scope.ctrl.render();
                },
            });
        };
        $scope.removeOverride = function (option) {
            delete $scope.override[option.propertyName];
            $scope.updateCurrentOverrides();
            $scope.ctrl.refresh();
        };
        $scope.getSeriesNames = function () {
            return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map($scope.ctrl.seriesList, function (series) {
                return series.alias;
            });
        };
        $scope.updateCurrentOverrides = function () {
            $scope.currentOverrides = [];
            lodash__WEBPACK_IMPORTED_MODULE_0___default.a.each($scope.overrideMenu, function (option) {
                var value = $scope.override[option.propertyName];
                if (lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isUndefined(value)) {
                    return;
                }
                $scope.currentOverrides.push({
                    name: option.text,
                    propertyName: option.propertyName,
                    value: String(value),
                });
            });
        };
        $scope.addOverrideOption('Bars', 'bars', [true, false]);
        $scope.addOverrideOption('Lines', 'lines', [true, false]);
        $scope.addOverrideOption('Line fill', 'fill', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        $scope.addOverrideOption('Line width', 'linewidth', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        $scope.addOverrideOption('Null point mode', 'nullPointMode', ['connected', 'null', 'null as zero']);
        $scope.addOverrideOption('Fill below to', 'fillBelowTo', $scope.getSeriesNames());
        $scope.addOverrideOption('Staircase line', 'steppedLine', [true, false]);
        $scope.addOverrideOption('Dashes', 'dashes', [true, false]);
        $scope.addOverrideOption('Dash Length', 'dashLength', [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
        ]);
        $scope.addOverrideOption('Dash Space', 'spaceLength', [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
        ]);
        $scope.addOverrideOption('Points', 'points', [true, false]);
        $scope.addOverrideOption('Points Radius', 'pointradius', [1, 2, 3, 4, 5]);
        $scope.addOverrideOption('Stack', 'stack', [true, false, 'A', 'B', 'C', 'D']);
        $scope.addOverrideOption('Color', 'color', ['change']);
        $scope.addOverrideOption('Y-axis', 'yaxis', [1, 2]);
        $scope.addOverrideOption('Z-index', 'zindex', [-3, -2, -1, 0, 1, 2, 3]);
        $scope.addOverrideOption('Transform', 'transform', ['negative-Y']);
        $scope.addOverrideOption('Legend', 'legend', [true, false]);
        $scope.updateCurrentOverrides();
    }
    return SeriesOverridesCtrl;
}());

angular__WEBPACK_IMPORTED_MODULE_1___default.a.module('grafana.controllers').controller('SeriesOverridesCtrl', SeriesOverridesCtrl);


/***/ }),

/***/ "./services/analytic_service.ts":
/*!**************************************!*\
  !*** ./services/analytic_service.ts ***!
  \**************************************/
/*! exports provided: AnalyticService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnalyticService", function() { return AnalyticService; });
/* harmony import */ var _models_analytic_unit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/analytic_unit */ "./models/analytic_unit.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (undefined && undefined.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (undefined && undefined.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};

var AnalyticService = /** @class */ (function () {
    function AnalyticService(_backendURL, _backendSrv) {
        this._backendURL = _backendURL;
        this._backendSrv = _backendSrv;
    }
    AnalyticService.prototype.postNewItem = function (metric, datasourceRequest, newItem, panelId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._backendSrv.post(this._backendURL + '/analyticUnits', {
                        name: newItem.name,
                        metric: metric.toJSON(),
                        panelUrl: window.location.origin + window.location.pathname + ("?panelId=" + panelId + "&fullscreen"),
                        datasource: datasourceRequest,
                        type: newItem.type
                    }).then(function (res) { return res.id; })];
            });
        });
    };
    ;
    AnalyticService.prototype.isBackendOk = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._backendSrv.get(this._backendURL)];
                    case 1:
                        data = _a.sent();
                        // TODO: check version
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticService.prototype.updateSegments = function (id, addedSegments, removedSegments) {
        return __awaiter(this, void 0, void 0, function () {
            var getJSONs, payload, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getJSONs = function (segs) { return segs.getSegments().map(function (segment) { return ({
                            "start": segment.from,
                            "finish": segment.to
                        }); }); };
                        payload = {
                            id: id,
                            addedSegments: getJSONs(addedSegments),
                            removedSegments: removedSegments.getSegments().map(function (s) { return s.id; })
                        };
                        return [4 /*yield*/, this._backendSrv.patch(this._backendURL + '/segments', payload)];
                    case 1:
                        data = _a.sent();
                        if (data.addedIds === undefined) {
                            throw new Error('Server didn`t send addedIds');
                        }
                        return [2 /*return*/, data.addedIds];
                }
            });
        });
    };
    AnalyticService.prototype.getSegments = function (id, from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, data, segments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (id === undefined) {
                            throw new Error('id is undefined');
                        }
                        payload = { id: id };
                        if (from !== undefined) {
                            payload['from'] = from;
                        }
                        if (to !== undefined) {
                            payload['to'] = to;
                        }
                        return [4 /*yield*/, this._backendSrv.get(this._backendURL + '/segments', payload)];
                    case 1:
                        data = _a.sent();
                        if (data.segments === undefined) {
                            throw new Error('Server didn`t return segments array');
                        }
                        segments = data.segments;
                        return [2 /*return*/, segments.map(function (s) { return new _models_analytic_unit__WEBPACK_IMPORTED_MODULE_0__["AnalyticSegment"](s.labeled, s.id, s.start, s.finish); })];
                }
            });
        });
    };
    AnalyticService.prototype.getStatusGenerator = function (id, duration) {
        return __asyncGenerator(this, arguments, function getStatusGenerator_1() {
            var _this = this;
            var statusCheck, timeout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (id === undefined) {
                            throw new Error('id is undefined');
                        }
                        statusCheck = function () { return __awaiter(_this, void 0, void 0, function () {
                            var data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this._backendSrv.get(this._backendURL + '/analyticUnits/status', { id: id })];
                                    case 1:
                                        data = _a.sent();
                                        return [2 /*return*/, data];
                                }
                            });
                        }); };
                        timeout = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, duration); })];
                            });
                        }); };
                        _a.label = 1;
                    case 1:
                        if (false) {}
                        return [4 /*yield*/, __await(statusCheck())];
                    case 2: return [4 /*yield*/, _a.sent()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, __await(timeout())];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AnalyticService.prototype.getAlertEnabled = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (id === undefined) {
                            throw new Error('id is undefined');
                        }
                        return [4 /*yield*/, this._backendSrv.get(this._backendURL + '/alerts', { id: id })];
                    case 1:
                        data = _a.sent();
                        if (data.enabled === undefined) {
                            throw new Error('Server didn`t return "enabled"');
                        }
                        return [2 /*return*/, data.enabled];
                }
            });
        });
    };
    AnalyticService.prototype.setAlertEnabled = function (id, enabled) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (id === undefined) {
                    throw new Error('id is undefined');
                }
                return [2 /*return*/, this._backendSrv.post(this._backendURL + '/alerts', { id: id, enabled: enabled })];
            });
        });
    };
    return AnalyticService;
}());



/***/ }),

/***/ "./template.ts":
/*!*********************!*\
  !*** ./template.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var template = "\n<div class=\"graph-panel\" ng-class=\"{'graph-panel--legend-right': ctrl.panel.legend.rightSide}\">\n  <div class=\"graph-panel__chart\" id=\"graphPanel\" ng-dblclick=\"ctrl.zoomOut()\" />\n  <div class=\"hastic-graph-legend\" id=\"graphLegend\" />\n</div>\n";
/* harmony default export */ __webpack_exports__["default"] = (template);


/***/ }),

/***/ "./threshold_manager.ts":
/*!******************************!*\
  !*** ./threshold_manager.ts ***!
  \******************************/
/*! exports provided: ThresholdManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThresholdManager", function() { return ThresholdManager; });
/* harmony import */ var _vendor_flot_jquery_flot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vendor/flot/jquery.flot */ "./vendor/flot/jquery.flot.js");
/* harmony import */ var _vendor_flot_jquery_flot__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vendor_flot_jquery_flot__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);



var ThresholdManager = /** @class */ (function () {
    function ThresholdManager(panelCtrl) {
        this.panelCtrl = panelCtrl;
    }
    ThresholdManager.prototype.getHandleHtml = function (handleIndex, model, valueStr) {
        var stateClass = model.colorMode;
        if (model.colorMode === 'custom') {
            stateClass = 'critical';
        }
        return "\n    <div class=\"alert-handle-wrapper alert-handle-wrapper--T" + handleIndex + "\">\n      <div class=\"alert-handle-line alert-handle-line--" + stateClass + "\">\n      </div>\n      <div class=\"alert-handle\" data-handle-index=\"" + handleIndex + "\">\n        <i class=\"icon-gf icon-gf-" + stateClass + " alert-state-" + stateClass + "\"></i>\n        <span class=\"alert-handle-value\">" + valueStr + "<i class=\"alert-handle-grip\"></i></span>\n      </div>\n    </div>";
    };
    ThresholdManager.prototype.initDragging = function (evt) {
        var handleElem = jquery__WEBPACK_IMPORTED_MODULE_1__(evt.currentTarget).parents('.alert-handle-wrapper');
        var handleIndex = jquery__WEBPACK_IMPORTED_MODULE_1__(evt.currentTarget).data('handleIndex');
        var lastY = null;
        var posTop;
        var plot = this.plot;
        var panelCtrl = this.panelCtrl;
        var model = this.thresholds[handleIndex];
        function dragging(evt) {
            if (lastY === null) {
                lastY = evt.clientY;
            }
            else {
                var diff = evt.clientY - lastY;
                posTop = posTop + diff;
                lastY = evt.clientY;
                handleElem.css({ top: posTop + diff });
            }
        }
        function stopped() {
            // calculate graph level
            var graphValue = plot.c2p({ left: 0, top: posTop }).y;
            graphValue = parseInt(graphValue.toFixed(0));
            model.value = graphValue;
            handleElem.off('mousemove', dragging);
            handleElem.off('mouseup', dragging);
            handleElem.off('mouseleave', dragging);
            // trigger digest and render
            panelCtrl.$scope.$apply(function () {
                panelCtrl.render();
                panelCtrl.events.emit('threshold-changed', {
                    threshold: model,
                    handleIndex: handleIndex,
                });
            });
        }
        lastY = null;
        posTop = handleElem.position().top;
        handleElem.on('mousemove', dragging);
        handleElem.on('mouseup', stopped);
        handleElem.on('mouseleave', stopped);
    };
    ThresholdManager.prototype.cleanUp = function () {
        this.placeholder.find('.alert-handle-wrapper').remove();
        this.needsCleanup = false;
    };
    ThresholdManager.prototype.renderHandle = function (handleIndex, defaultHandleTopPos) {
        var model = this.thresholds[handleIndex];
        var value = model.value;
        var valueStr = value;
        var handleTopPos = 0;
        // handle no value
        if (!lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isNumber(value)) {
            valueStr = '';
            handleTopPos = defaultHandleTopPos;
        }
        else {
            var valueCanvasPos = this.plot.p2c({ x: 0, y: value });
            handleTopPos = Math.round(Math.min(Math.max(valueCanvasPos.top, 0), this.height) - 6);
        }
        var handleElem = jquery__WEBPACK_IMPORTED_MODULE_1__(this.getHandleHtml(handleIndex, model, valueStr));
        this.placeholder.append(handleElem);
        handleElem.toggleClass('alert-handle-wrapper--no-value', valueStr === '');
        handleElem.css({ top: handleTopPos });
    };
    ThresholdManager.prototype.shouldDrawHandles = function () {
        return !this.hasSecondYAxis && this.panelCtrl.editingThresholds && this.panelCtrl.panel.thresholds.length > 0;
    };
    ThresholdManager.prototype.prepare = function (elem, data) {
        this.hasSecondYAxis = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i].yaxis > 1) {
                this.hasSecondYAxis = true;
                break;
            }
        }
        if (this.shouldDrawHandles()) {
            var thresholdMargin = this.panelCtrl.panel.thresholds.length > 1 ? '220px' : '110px';
            elem.css('margin-right', thresholdMargin);
        }
        else if (this.needsCleanup) {
            elem.css('margin-right', '0');
        }
    };
    ThresholdManager.prototype.draw = function (plot) {
        this.thresholds = this.panelCtrl.panel.thresholds;
        this.plot = plot;
        this.placeholder = plot.getPlaceholder();
        if (this.needsCleanup) {
            this.cleanUp();
        }
        if (!this.shouldDrawHandles()) {
            return;
        }
        this.height = plot.height();
        if (this.thresholds.length > 0) {
            this.renderHandle(0, 10);
        }
        if (this.thresholds.length > 1) {
            this.renderHandle(1, this.height - 30);
        }
        this.placeholder.off('mousedown', '.alert-handle');
        this.placeholder.on('mousedown', '.alert-handle', this.initDragging.bind(this));
        this.needsCleanup = true;
    };
    ThresholdManager.prototype.addFlotOptions = function (options, panel) {
        if (!panel.thresholds || panel.thresholds.length === 0) {
            return;
        }
        var gtLimit = Infinity;
        var ltLimit = -Infinity;
        var i, threshold, other;
        for (i = 0; i < panel.thresholds.length; i++) {
            threshold = panel.thresholds[i];
            if (!lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isNumber(threshold.value)) {
                continue;
            }
            var limit;
            switch (threshold.op) {
                case 'gt': {
                    limit = gtLimit;
                    // if next threshold is less then op and greater value, then use that as limit
                    if (panel.thresholds.length > i + 1) {
                        other = panel.thresholds[i + 1];
                        if (other.value > threshold.value) {
                            limit = other.value;
                            ltLimit = limit;
                        }
                    }
                    break;
                }
                case 'lt': {
                    limit = ltLimit;
                    // if next threshold is less then op and greater value, then use that as limit
                    if (panel.thresholds.length > i + 1) {
                        other = panel.thresholds[i + 1];
                        if (other.value < threshold.value) {
                            limit = other.value;
                            gtLimit = limit;
                        }
                    }
                    break;
                }
            }
            var fillColor, lineColor;
            switch (threshold.colorMode) {
                case 'critical': {
                    fillColor = 'rgba(234, 112, 112, 0.12)';
                    lineColor = 'rgba(237, 46, 24, 0.60)';
                    break;
                }
                case 'warning': {
                    fillColor = 'rgba(235, 138, 14, 0.12)';
                    lineColor = 'rgba(247, 149, 32, 0.60)';
                    break;
                }
                case 'ok': {
                    fillColor = 'rgba(11, 237, 50, 0.090)';
                    lineColor = 'rgba(6,163,69, 0.60)';
                    break;
                }
                case 'custom': {
                    fillColor = threshold.fillColor;
                    lineColor = threshold.lineColor;
                    break;
                }
            }
            // fill
            if (threshold.fill) {
                options.grid.markings.push({
                    yaxis: { from: threshold.value, to: limit },
                    color: fillColor,
                });
            }
            if (threshold.line) {
                options.grid.markings.push({
                    yaxis: { from: threshold.value, to: threshold.value },
                    color: lineColor,
                });
            }
        }
    };
    return ThresholdManager;
}());



/***/ }),

/***/ "./thresholds_form.ts":
/*!****************************!*\
  !*** ./thresholds_form.ts ***!
  \****************************/
/*! exports provided: ThresholdFormCtrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThresholdFormCtrl", function() { return ThresholdFormCtrl; });
/* harmony import */ var grafana_app_core_core_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! grafana/app/core/core_module */ "grafana/app/core/core_module");
/* harmony import */ var grafana_app_core_core_module__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(grafana_app_core_core_module__WEBPACK_IMPORTED_MODULE_0__);

var ThresholdFormCtrl = /** @class */ (function () {
    /** @ngInject */
    function ThresholdFormCtrl($scope) {
        var _this = this;
        this.panel = this.panelCtrl.panel;
        if (this.panel.alert) {
            this.disabled = true;
        }
        var unbindDestroy = $scope.$on('$destroy', function () {
            _this.panelCtrl.editingThresholds = false;
            _this.panelCtrl.render();
            unbindDestroy();
        });
        this.panelCtrl.editingThresholds = true;
    }
    ThresholdFormCtrl.prototype.addThreshold = function () {
        this.panel.thresholds.push({
            value: undefined,
            colorMode: 'critical',
            op: 'gt',
            fill: true,
            line: true,
        });
        this.panelCtrl.render();
    };
    ThresholdFormCtrl.prototype.removeThreshold = function (index) {
        this.panel.thresholds.splice(index, 1);
        this.panelCtrl.render();
    };
    ThresholdFormCtrl.prototype.render = function () {
        this.panelCtrl.render();
    };
    ThresholdFormCtrl.prototype.onFillColorChange = function (index) {
        var _this = this;
        return function (newColor) {
            _this.panel.thresholds[index].fillColor = newColor;
            _this.render();
        };
    };
    ThresholdFormCtrl.prototype.onLineColorChange = function (index) {
        var _this = this;
        return function (newColor) {
            _this.panel.thresholds[index].lineColor = newColor;
            _this.render();
        };
    };
    return ThresholdFormCtrl;
}());

var template = "\n<div class=\"gf-form-group\">\n  <h5>Thresholds</h5>\n  <p class=\"muted\" ng-show=\"ctrl.disabled\">\n    Visual thresholds options <strong>disabled.</strong>\n    Visit the Alert tab update your thresholds. <br>\n    To re-enable thresholds, the alert rule must be deleted from this panel.\n  </p>\n  <div ng-class=\"{'thresholds-form-disabled': ctrl.disabled}\">\n    <div class=\"gf-form-inline\" ng-repeat=\"threshold in ctrl.panel.thresholds\">\n      <div class=\"gf-form\">\n        <label class=\"gf-form-label\">T{{$index+1}}</label>\n      </div>\n\n      <div class=\"gf-form\">\n        <div class=\"gf-form-select-wrapper\">\n          <select class=\"gf-form-input\" ng-model=\"threshold.op\"\n                  ng-options=\"f for f in ['gt', 'lt']\" ng-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\"></select>\n        </div>\n        <input type=\"number\" ng-model=\"threshold.value\" class=\"gf-form-input width-8\"\n               ng-change=\"ctrl.render()\" placeholder=\"value\" ng-disabled=\"ctrl.disabled\">\n      </div>\n\n      <div class=\"gf-form\">\n        <label class=\"gf-form-label\">Color</label>\n        <div class=\"gf-form-select-wrapper\">\n          <select class=\"gf-form-input\" ng-model=\"threshold.colorMode\"\n                  ng-options=\"f for f in ['custom', 'critical', 'warning', 'ok']\" ng-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\">\n          </select>\n        </div>\n      </div>\n\n      <gf-form-switch class=\"gf-form\" label=\"Fill\" checked=\"threshold.fill\"\n                      on-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\"></gf-form-switch>\n\n      <div class=\"gf-form\" ng-if=\"threshold.fill && threshold.colorMode === 'custom'\">\n        <label class=\"gf-form-label\">Fill color</label>\n        <span class=\"gf-form-label\">\n          <color-picker color=\"threshold.fillColor\" onChange=\"ctrl.onFillColorChange($index)\"></color-picker>\n        </span>\n      </div>\n\n      <gf-form-switch class=\"gf-form\" label=\"Line\" checked=\"threshold.line\"\n                      on-change=\"ctrl.render()\" ng-disabled=\"ctrl.disabled\"></gf-form-switch>\n\n      <div class=\"gf-form\" ng-if=\"threshold.line && threshold.colorMode === 'custom'\">\n        <label class=\"gf-form-label\">Line color</label>\n        <span class=\"gf-form-label\">\n          <color-picker color=\"threshold.lineColor\" onChange=\"ctrl.onLineColorChange($index)\"></color-picker>\n        </span>\n      </div>\n\n      <div class=\"gf-form\">\n        <label class=\"gf-form-label\">\n          <a class=\"pointer\" ng-click=\"ctrl.removeThreshold($index)\" ng-disabled=\"ctrl.disabled\">\n            <i class=\"fa fa-trash\"></i>\n          </a>\n        </label>\n      </div>\n    </div>\n\n    <div class=\"gf-form-button-row\">\n      <button class=\"btn btn-inverse\" ng-click=\"ctrl.addThreshold()\" ng-disabled=\"ctrl.disabled\">\n        <i class=\"fa fa-plus\"></i>&nbsp;Add Threshold\n      </button>\n    </div>\n  </div>\n</div>\n";
grafana_app_core_core_module__WEBPACK_IMPORTED_MODULE_0___default.a.directive('hasticGraphThresholdForm', function () {
    return {
        restrict: 'E',
        template: template,
        controller: ThresholdFormCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            panelCtrl: '=',
        },
    };
});


/***/ }),

/***/ "./vendor/flot/jquery.flot.crosshair.js":
/*!**********************************************!*\
  !*** ./vendor/flot/jquery.flot.crosshair.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Flot plugin for showing crosshairs when the mouse hovers over the plot.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin supports these options:

	crosshair: {
		mode: null or "x" or "y" or "xy"
		color: color
		lineWidth: number
	}

Set the mode to one of "x", "y" or "xy". The "x" mode enables a vertical
crosshair that lets you trace the values on the x axis, "y" enables a
horizontal crosshair and "xy" enables them both. "color" is the color of the
crosshair (default is "rgba(170, 0, 0, 0.80)"), "lineWidth" is the width of
the drawn lines (default is 1).

The plugin also adds four public methods:

  - setCrosshair( pos )

    Set the position of the crosshair. Note that this is cleared if the user
    moves the mouse. "pos" is in coordinates of the plot and should be on the
    form { x: xpos, y: ypos } (you can use x2/x3/... if you're using multiple
    axes), which is coincidentally the same format as what you get from a
    "plothover" event. If "pos" is null, the crosshair is cleared.

  - clearCrosshair()

    Clear the crosshair.

  - lockCrosshair(pos)

    Cause the crosshair to lock to the current location, no longer updating if
    the user moves the mouse. Optionally supply a position (passed on to
    setCrosshair()) to move it to.

    Example usage:

	var myFlot = $.plot( $("#graph"), ..., { crosshair: { mode: "x" } } };
	$("#graph").bind( "plothover", function ( evt, position, item ) {
		if ( item ) {
			// Lock the crosshair to the data point being hovered
			myFlot.lockCrosshair({
				x: item.datapoint[ 0 ],
				y: item.datapoint[ 1 ]
			});
		} else {
			// Return normal crosshair operation
			myFlot.unlockCrosshair();
		}
	});

  - unlockCrosshair()

    Free the crosshair to move again after locking it.
*/

(function ($) {
    var options = {
        crosshair: {
            mode: null, // one of null, "x", "y" or "xy",
            color: "rgba(170, 0, 0, 0.80)",
            lineWidth: 1
        }
    };
    
    function init(plot) {
        // position of crosshair in pixels
        var crosshair = { x: -1, y: -1, locked: false };

        plot.setCrosshair = function setCrosshair(pos) {
            if (!pos)
                crosshair.x = -1;
            else {
                var o = plot.p2c(pos);
                crosshair.x = Math.max(0, Math.min(o.left, plot.width()));
                crosshair.y = Math.max(0, Math.min(o.top, plot.height()));
            }
            
            plot.triggerRedrawOverlay();
        };
        
        plot.clearCrosshair = plot.setCrosshair; // passes null for pos
        
        plot.lockCrosshair = function lockCrosshair(pos) {
            if (pos)
                plot.setCrosshair(pos);
            crosshair.locked = true;
        };

        plot.unlockCrosshair = function unlockCrosshair() {
            crosshair.locked = false;
        };

        function onMouseOut(e) {
            if (crosshair.locked)
                return;

            if (crosshair.x != -1) {
                crosshair.x = -1;
                plot.triggerRedrawOverlay();
            }
        }

        function onMouseMove(e) {
            if (crosshair.locked)
                return;
                
            if (plot.getSelection && plot.getSelection()) {
                crosshair.x = -1; // hide the crosshair while selecting
                return;
            }
                
            var offset = plot.offset();
            crosshair.x = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
            crosshair.y = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));
            plot.triggerRedrawOverlay();
        }
        
        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            if (!plot.getOptions().crosshair.mode)
                return;

            eventHolder.mouseout(onMouseOut);
            eventHolder.mousemove(onMouseMove);
        });

        plot.hooks.drawOverlay.push(function (plot, ctx) {
            var c = plot.getOptions().crosshair;
            if (!c.mode)
                return;

            var plotOffset = plot.getPlotOffset();
            
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            if (crosshair.x != -1) {
                var adj = plot.getOptions().crosshair.lineWidth % 2 ? 0.5 : 0;

                ctx.strokeStyle = c.color;
                ctx.lineWidth = c.lineWidth;
                ctx.lineJoin = "round";

                ctx.beginPath();
                if (c.mode.indexOf("x") != -1) {
                    var drawX = Math.floor(crosshair.x) + adj;
                    ctx.moveTo(drawX, 0);
                    ctx.lineTo(drawX, plot.height());
                }
                if (c.mode.indexOf("y") != -1) {
                    var drawY = Math.floor(crosshair.y) + adj;
                    ctx.moveTo(0, drawY);
                    ctx.lineTo(plot.width(), drawY);
                }
                ctx.stroke();
            }
            ctx.restore();
        });

        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind("mouseout", onMouseOut);
            eventHolder.unbind("mousemove", onMouseMove);
        });
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'crosshair',
        version: '1.0'
    });
})(jQuery);


/***/ }),

/***/ "./vendor/flot/jquery.flot.dashes.js":
/*!*******************************************!*\
  !*** ./vendor/flot/jquery.flot.dashes.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * jQuery.flot.dashes
 *
 * options = {
 *   series: {
 *     dashes: {
 *
 *       // show
 *       // default: false
 *       // Whether to show dashes for the series.
 *       show: <boolean>,
 *
 *       // lineWidth
 *       // default: 2
 *       // The width of the dashed line in pixels.
 *       lineWidth: <number>,
 *
 *       // dashLength
 *       // default: 10
 *       // Controls the length of the individual dashes and the amount of
 *       // space between them.
 *       // If this is a number, the dashes and spaces will have that length.
 *       // If this is an array, it is read as [ dashLength, spaceLength ]
 *       dashLength: <number> or <array[2]>
 *     }
 *   }
 * }
 */
(function($){

  function init(plot) {

    plot.hooks.processDatapoints.push(function(plot, series, datapoints) {

      if (!series.dashes.show) return;

      plot.hooks.draw.push(function(plot, ctx) {

        var plotOffset = plot.getPlotOffset(),
          axisx = series.xaxis,
          axisy = series.yaxis;

        function plotDashes(xoffset, yoffset) {

          var points = datapoints.points,
            ps = datapoints.pointsize,
            prevx = null,
            prevy = null,
            dashRemainder = 0,
            dashOn = true,
            dashOnLength,
            dashOffLength;

          if (series.dashes.dashLength[0]) {
            dashOnLength = series.dashes.dashLength[0];
            if (series.dashes.dashLength[1]) {
              dashOffLength = series.dashes.dashLength[1];
            } else {
              dashOffLength = dashOnLength;
            }
          } else {
            dashOffLength = dashOnLength = series.dashes.dashLength;
          }

          ctx.beginPath();

          for (var i = ps; i < points.length; i += ps) {

            var x1 = points[i - ps],
              y1 = points[i - ps + 1],
              x2 = points[i],
              y2 = points[i + 1];

            if (x1 == null || x2 == null) continue;

            // clip with ymin
            if (y1 <= y2 && y1 < axisy.min) {
              if (y2 < axisy.min) continue;   // line segment is outside
              // compute new intersection point
              x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
              y1 = axisy.min;
            } else if (y2 <= y1 && y2 < axisy.min) {
              if (y1 < axisy.min) continue;
              x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
              y2 = axisy.min;
            }

            // clip with ymax
            if (y1 >= y2 && y1 > axisy.max) {
              if (y2 > axisy.max) continue;
              x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
              y1 = axisy.max;
            } else if (y2 >= y1 && y2 > axisy.max) {
              if (y1 > axisy.max) continue;
              x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
              y2 = axisy.max;
            }

            // clip with xmin
            if (x1 <= x2 && x1 < axisx.min) {
              if (x2 < axisx.min) continue;
              y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
              x1 = axisx.min;
            } else if (x2 <= x1 && x2 < axisx.min) {
              if (x1 < axisx.min) continue;
              y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
              x2 = axisx.min;
            }

            // clip with xmax
            if (x1 >= x2 && x1 > axisx.max) {
              if (x2 > axisx.max) continue;
              y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
              x1 = axisx.max;
            } else if (x2 >= x1 && x2 > axisx.max) {
              if (x1 > axisx.max) continue;
              y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
              x2 = axisx.max;
            }

            if (x1 != prevx || y1 != prevy) {
              ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);
            }

            var ax1 = axisx.p2c(x1) + xoffset,
              ay1 = axisy.p2c(y1) + yoffset,
              ax2 = axisx.p2c(x2) + xoffset,
              ay2 = axisy.p2c(y2) + yoffset,
              dashOffset;

            function lineSegmentOffset(segmentLength) {

              var c = Math.sqrt(Math.pow(ax2 - ax1, 2) + Math.pow(ay2 - ay1, 2));

              if (c <= segmentLength) {
                return {
                  deltaX: ax2 - ax1,
                  deltaY: ay2 - ay1,
                  distance: c,
                  remainder: segmentLength - c
                }
              } else {
                var xsign = ax2 > ax1 ? 1 : -1,
                  ysign = ay2 > ay1 ? 1 : -1;
                return {
                  deltaX: xsign * Math.sqrt(Math.pow(segmentLength, 2) / (1 + Math.pow((ay2 - ay1)/(ax2 - ax1), 2))),
                  deltaY: ysign * Math.sqrt(Math.pow(segmentLength, 2) - Math.pow(segmentLength, 2) / (1 + Math.pow((ay2 - ay1)/(ax2 - ax1), 2))),
                  distance: segmentLength,
                  remainder: 0
                };
              }
            }
            //-end lineSegmentOffset

            do {

              dashOffset = lineSegmentOffset(
                dashRemainder > 0 ? dashRemainder :
                  dashOn ? dashOnLength : dashOffLength);

              if (dashOffset.deltaX != 0 || dashOffset.deltaY != 0) {
                if (dashOn) {
                  ctx.lineTo(ax1 + dashOffset.deltaX, ay1 + dashOffset.deltaY);
                } else {
                  ctx.moveTo(ax1 + dashOffset.deltaX, ay1 + dashOffset.deltaY);
                }
              }

              dashOn = !dashOn;
              dashRemainder = dashOffset.remainder;
              ax1 += dashOffset.deltaX;
              ay1 += dashOffset.deltaY;

            } while (dashOffset.distance > 0);

            prevx = x2;
            prevy = y2;
          }

          ctx.stroke();
        }
        //-end plotDashes

        ctx.save();
        ctx.translate(plotOffset.left, plotOffset.top);
        ctx.lineJoin = 'round';

        var lw = series.dashes.lineWidth,
          sw = series.shadowSize;

        // FIXME: consider another form of shadow when filling is turned on
        if (lw > 0 && sw > 0) {
          // draw shadow as a thick and thin line with transparency
          ctx.lineWidth = sw;
          ctx.strokeStyle = "rgba(0,0,0,0.1)";
          // position shadow at angle from the mid of line
          var angle = Math.PI/18;
          plotDashes(Math.sin(angle) * (lw/2 + sw/2), Math.cos(angle) * (lw/2 + sw/2));
          ctx.lineWidth = sw/2;
          plotDashes(Math.sin(angle) * (lw/2 + sw/4), Math.cos(angle) * (lw/2 + sw/4));
        }

        ctx.lineWidth = lw;
        ctx.strokeStyle = series.color;

        if (lw > 0) {
          plotDashes(0, 0);
        }

        ctx.restore();

      });
      //-end draw hook

    });
    //-end processDatapoints hook

  }
  //-end init

  $.plot.plugins.push({
    init: init,
    options: {
      series: {
        dashes: {
          show: false,
          lineWidth: 2,
          dashLength: 10
        }
      }
    },
    name: 'dashes',
    version: '0.1'
  });

})(jQuery)


/***/ }),

/***/ "./vendor/flot/jquery.flot.events.js":
/*!*******************************************!*\
  !*** ./vendor/flot/jquery.flot.events.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(/*! jquery */ "jquery"),
  __webpack_require__(/*! lodash */ "lodash"),
  __webpack_require__(/*! angular */ "angular"),
  __webpack_require__(/*! tether-drop */ "../node_modules/tether-drop/dist/js/drop.js"),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, _, angular, Drop) {
  'use strict';

  function createAnnotationToolip(element, event, plot) {
    var injector = angular.element(document).injector();
    var content = document.createElement('div');
    content.innerHTML = '<annotation-tooltip event="event" on-edit="onEdit()"></annotation-tooltip>';

    injector.invoke(["$compile", "$rootScope", function($compile, $rootScope) {
      var eventManager = plot.getOptions().events.manager;
      var tmpScope = $rootScope.$new(true);
      tmpScope.event = event;
      tmpScope.onEdit = function() {
        eventManager.editEvent(event);
      };

      $compile(content)(tmpScope);
      tmpScope.$digest();
      tmpScope.$destroy();

      var drop = new Drop({
        target: element[0],
        content: content,
        position: "bottom center",
        classes: 'drop-popover drop-popover--annotation',
        openOn: 'hover',
        hoverCloseDelay: 200,
        tetherOptions: {
          constraints: [{to: 'window', pin: true, attachment: "both"}]
        }
      });

      drop.open();

      drop.on('close', function() {
        setTimeout(function() {
          drop.destroy();
        });
      });
    }]);
  }

  var markerElementToAttachTo = null;

  function createEditPopover(element, event, plot) {
    var eventManager = plot.getOptions().events.manager;
    if (eventManager.editorOpen) {
      // update marker element to attach to (needed in case of legend on the right
      // when there is a double render pass and the inital marker element is removed)
      markerElementToAttachTo = element;
      return;
    }

    // mark as openend
    eventManager.editorOpened();
    // set marker elment to attache to
    markerElementToAttachTo = element;

    // wait for element to be attached and positioned
    setTimeout(function() {

      var injector = angular.element(document).injector();
      var content = document.createElement('div');
      content.innerHTML = '<event-editor panel-ctrl="panelCtrl" event="event" close="close()"></event-editor>';

      injector.invoke(["$compile", "$rootScope", function($compile, $rootScope) {
        var scope = $rootScope.$new(true);
        var drop;

        scope.event = event;
        scope.panelCtrl = eventManager.panelCtrl;
        scope.close = function() {
          drop.close();
        };

        $compile(content)(scope);
        scope.$digest();

        drop = new Drop({
          target: markerElementToAttachTo[0],
          content: content,
          position: "bottom center",
          classes: 'drop-popover drop-popover--form',
          openOn: 'click',
          tetherOptions: {
            constraints: [{to: 'window', pin: true, attachment: "both"}]
          }
        });

        drop.open();
        eventManager.editorOpened();

        drop.on('close', function() {
          // need timeout here in order call drop.destroy
          setTimeout(function() {
            eventManager.editorClosed();
            scope.$destroy();
            drop.destroy();
          });
        });
      }]);

    }, 100);
  }

  /*
   * jquery.flot.events
   *
   * description: Flot plugin for adding events/markers to the plot
   * version: 0.2.5
   * authors:
   *    Alexander Wunschik <alex@wunschik.net>
   *    Joel Oughton <joeloughton@gmail.com>
   *    Nicolas Joseph <www.nicolasjoseph.com>
   *
   * website: https://github.com/mojoaxel/flot-events
   *
   * released under MIT License and GPLv2+
   */

  /**
   * A class that allows for the drawing an remove of some object
   */
  var DrawableEvent = function(object, drawFunc, clearFunc, moveFunc, left, top, width, height) {
    var _object = object;
    var	_drawFunc = drawFunc;
    var	_clearFunc = clearFunc;
    var	_moveFunc = moveFunc;
    var	_position = { left: left, top: top };
    var	_width = width;
    var	_height = height;

    this.width = function() { return _width; };
    this.height = function() { return _height; };
    this.position = function() { return _position; };
    this.draw = function() { _drawFunc(_object); };
    this.clear = function() { _clearFunc(_object); };
    this.getObject = function() { return _object; };
    this.moveTo = function(position) {
      _position = position;
      _moveFunc(_object, _position);
    };
  };

  /**
   * Event class that stores options (eventType, min, max, title, description) and the object to draw.
   */
  var VisualEvent = function(options, drawableEvent) {
    var _parent;
    var _options = options;
    var _drawableEvent = drawableEvent;
    var _hidden = false;

    this.visual = function() { return _drawableEvent; };
    this.getOptions = function() { return _options; };
    this.getParent = function() { return _parent; };
    this.isHidden = function() { return _hidden; };
    this.hide = function() { _hidden = true; };
    this.unhide = function() { _hidden = false; };
  };

  /**
   * A Class that handles the event-markers inside the given plot
   */
  var EventMarkers = function(plot) {
    var _events = [];

    this._types = [];
    this._plot = plot;
    this.eventsEnabled = false;

    this.getEvents = function() {
      return _events;
    };

    this.setTypes = function(types) {
      return this._types = types;
    };

    /**
     * create internal objects for the given events
     */
    this.setupEvents = function(events) {
      var that = this;
      var parts = _.partition(events, 'isRegion');
      var regions = parts[0];
      events = parts[1];

      $.each(events, function(index, event) {
        var ve = new VisualEvent(event, that._buildDiv(event));
        _events.push(ve);
      });

      $.each(regions, function (index, event) {
        var vre = new VisualEvent(event, that._buildRegDiv(event));
        _events.push(vre);
      });

      _events.sort(function(a, b) {
        var ao = a.getOptions(), bo = b.getOptions();
        if (ao.min > bo.min) { return 1; }
        if (ao.min < bo.min) { return -1; }
        return 0;
      });
    };

    /**
     * draw the events to the plot
     */
    this.drawEvents = function() {
      var that = this;
      // var o = this._plot.getPlotOffset();

      $.each(_events, function(index, event) {
        // check event is inside the graph range
        if (that._insidePlot(event.getOptions().min) && !event.isHidden()) {
          event.visual().draw();
        }  else {
          event.visual().getObject().hide();
        }
      });
    };

    /**
     * update the position of the event-markers (e.g. after scrolling or zooming)
     */
    this.updateEvents = function() {
      var that = this;
      var o = this._plot.getPlotOffset(), left, top;
      var xaxis = this._plot.getXAxes()[this._plot.getOptions().events.xaxis - 1];

      $.each(_events, function(index, event) {
        top = o.top + that._plot.height() - event.visual().height();
        left = xaxis.p2c(event.getOptions().min) + o.left - event.visual().width() / 2;
        event.visual().moveTo({ top: top, left: left });
      });
    };

    /**
     * remove all events from the plot
     */
    this._clearEvents = function() {
      $.each(_events, function(index, val) {
        val.visual().clear();
      });
      _events = [];
    };

    /**
     * create a DOM element for the given event
     */
    this._buildDiv = function(event) {
      var that = this;

      var container = this._plot.getPlaceholder();
      var o = this._plot.getPlotOffset();
      var axes = this._plot.getAxes();
      var xaxis = this._plot.getXAxes()[this._plot.getOptions().events.xaxis - 1];
      var yaxis, top, left, color, markerSize, markerShow, lineStyle, lineWidth;
      var markerTooltip;

      // determine the y axis used
      if (axes.yaxis && axes.yaxis.used) { yaxis = axes.yaxis; }
      if (axes.yaxis2 && axes.yaxis2.used) { yaxis = axes.yaxis2; }

      // map the eventType to a types object
      var eventTypeId = event.eventType;

      if (this._types === null || !this._types[eventTypeId] || !this._types[eventTypeId].color) {
        color = '#666';
      } else {
        color = this._types[eventTypeId].color;
      }

      if (this._types === null || !this._types[eventTypeId] || !this._types[eventTypeId].markerSize) {
        markerSize = 8; //default marker size
      } else {
        markerSize = this._types[eventTypeId].markerSize;
      }

      if (this._types === null || !this._types[eventTypeId] || this._types[eventTypeId].markerShow === undefined) {
        markerShow = true;
      } else {
        markerShow = this._types[eventTypeId].markerShow;
      }

      if (this._types === null || !this._types[eventTypeId] || this._types[eventTypeId].markerTooltip === undefined) {
        markerTooltip = true;
      } else {
        markerTooltip = this._types[eventTypeId].markerTooltip;
      }

      if (this._types == null || !this._types[eventTypeId] || !this._types[eventTypeId].lineStyle) {
        lineStyle = 'dashed'; //default line style
      } else {
        lineStyle = this._types[eventTypeId].lineStyle.toLowerCase();
      }

      if (this._types == null || !this._types[eventTypeId] || this._types[eventTypeId].lineWidth === undefined) {
        lineWidth = 1; //default line width
      } else {
        lineWidth = this._types[eventTypeId].lineWidth;
      }

      var topOffset = xaxis.options.eventSectionHeight || 0;
      topOffset = topOffset / 3;

      top = o.top + this._plot.height() + topOffset;
      left = xaxis.p2c(event.min) + o.left;

      var line = $('<div class="events_line flot-temp-elem"></div>').css({
        "position": "absolute",
        "opacity": 0.8,
        "left": left + 'px',
        "top": 8,
        "width": lineWidth + "px",
        "height": this._plot.height() + topOffset * 0.8,
        "border-left-width": lineWidth + "px",
        "border-left-style": lineStyle,
        "border-left-color": color,
        "color": color
      })
      .appendTo(container);

      if (markerShow) {
        var marker = $('<div class="events_marker"></div>').css({
          "position": "absolute",
          "left": (-markerSize - Math.round(lineWidth / 2)) + "px",
          "font-size": 0,
          "line-height": 0,
          "width": 0,
          "height": 0,
          "border-left": markerSize+"px solid transparent",
          "border-right": markerSize+"px solid transparent"
        });

        marker.appendTo(line);

        if (this._types[eventTypeId] && this._types[eventTypeId].position && this._types[eventTypeId].position.toUpperCase() === 'BOTTOM') {
          marker.css({
            "top": top-markerSize-8 +"px",
            "border-top": "none",
            "border-bottom": markerSize+"px solid " + color
          });
        } else {
          marker.css({
            "top": "0px",
            "border-top": markerSize+"px solid " + color,
            "border-bottom": "none"
          });
        }

        marker.data({
          "event": event
        });

        var mouseenter = function() {
          createAnnotationToolip(marker, $(this).data("event"), that._plot);
        };

        if (event.editModel) {
          createEditPopover(marker, event.editModel, that._plot);
        }

        var mouseleave = function() {
          that._plot.clearSelection();
        };

        if (markerTooltip) {
          marker.css({ "cursor": "help" });
          marker.hover(mouseenter, mouseleave);
        }
      }

      var drawableEvent = new DrawableEvent(
        line,
        function drawFunc(obj) { obj.show(); },
        function(obj) { obj.remove(); },
        function(obj, position) {
          obj.css({
            top: position.top,
            left: position.left
          });
        },
        left,
        top,
        line.width(),
        line.height()
      );

      return drawableEvent;
    };

    /**
     * create a DOM element for the given region
     */
    this._buildRegDiv = function (event) {
      var that = this;

      var container = this._plot.getPlaceholder();
      var o = this._plot.getPlotOffset();
      var axes = this._plot.getAxes();
      var xaxis = this._plot.getXAxes()[this._plot.getOptions().events.xaxis - 1];
      var yaxis, top, left, lineWidth, regionWidth, lineStyle, color, markerTooltip;

      // determine the y axis used
      if (axes.yaxis && axes.yaxis.used) { yaxis = axes.yaxis; }
      if (axes.yaxis2 && axes.yaxis2.used) { yaxis = axes.yaxis2; }

      // map the eventType to a types object
      var eventTypeId = event.eventType;

      if (this._types === null || !this._types[eventTypeId] || !this._types[eventTypeId].color) {
        color = '#666';
      } else {
        color = this._types[eventTypeId].color;
      }

      if (this._types === null || !this._types[eventTypeId] || this._types[eventTypeId].markerTooltip === undefined) {
        markerTooltip = true;
      } else {
        markerTooltip = this._types[eventTypeId].markerTooltip;
      }

      if (this._types == null || !this._types[eventTypeId] || this._types[eventTypeId].lineWidth === undefined) {
        lineWidth = 1; //default line width
      } else {
        lineWidth = this._types[eventTypeId].lineWidth;
      }

      if (this._types == null || !this._types[eventTypeId] || !this._types[eventTypeId].lineStyle) {
        lineStyle = 'dashed'; //default line style
      } else {
        lineStyle = this._types[eventTypeId].lineStyle.toLowerCase();
      }

      var topOffset = 2;
      top = o.top + this._plot.height() + topOffset;

      var timeFrom = Math.min(event.min, event.timeEnd);
      var timeTo = Math.max(event.min, event.timeEnd);
      left = xaxis.p2c(timeFrom) + o.left;
      var right = xaxis.p2c(timeTo) + o.left;
      regionWidth = right - left;

      _.each([left, right], function(position) {
        var line = $('<div class="events_line flot-temp-elem"></div>').css({
          "position": "absolute",
          "opacity": 0.8,
          "left": position + 'px',
          "top": 8,
          "width": lineWidth + "px",
          "height": that._plot.height() + topOffset,
          "border-left-width": lineWidth + "px",
          "border-left-style": lineStyle,
          "border-left-color": color,
          "color": color
        });
        line.appendTo(container);
      });

      var region = $('<div class="events_marker region_marker flot-temp-elem"></div>').css({
        "position": "absolute",
        "opacity": 0.5,
        "left": left + 'px',
        "top": top,
        "width": Math.round(regionWidth + lineWidth) + "px",
        "height": "0.5rem",
        "border-left-color": color,
        "color": color,
        "background-color": color
      });
      region.appendTo(container);

      region.data({
        "event": event
      });

      var mouseenter = function () {
        createAnnotationToolip(region, $(this).data("event"), that._plot);
      };

      if (event.editModel) {
        createEditPopover(region, event.editModel, that._plot);
      }

      var mouseleave = function () {
        that._plot.clearSelection();
      };

      if (markerTooltip) {
        region.css({ "cursor": "help" });
        region.hover(mouseenter, mouseleave);
      }

      var drawableEvent = new DrawableEvent(
        region,
        function drawFunc(obj) { obj.show(); },
        function (obj) { obj.remove(); },
        function (obj, position) {
          obj.css({
            top: position.top,
            left: position.left
          });
        },
        left,
        top,
        region.width(),
        region.height()
      );

      return drawableEvent;
    };

    /**
     * check if the event is inside visible range
     */
    this._insidePlot = function(x) {
      var xaxis = this._plot.getXAxes()[this._plot.getOptions().events.xaxis - 1];
      var xc = xaxis.p2c(x);
      return xc > 0 && xc < xaxis.p2c(xaxis.max);
    };
  };

  /**
   * initialize the plugin for the given plot
   */
  function init(plot) {
    /*jshint validthis:true */
    var that = this;
    var eventMarkers = new EventMarkers(plot);

    plot.getEvents = function() {
      return eventMarkers._events;
    };

    plot.hideEvents = function() {
      $.each(eventMarkers._events, function(index, event) {
        event.visual().getObject().hide();
      });
    };

    plot.showEvents = function() {
      plot.hideEvents();
      $.each(eventMarkers._events, function(index, event) {
        event.hide();
      });

      that.eventMarkers.drawEvents();
    };

    // change events on an existing plot
    plot.setEvents = function(events) {
      if (eventMarkers.eventsEnabled) {
        eventMarkers.setupEvents(events);
      }
    };

    plot.hooks.processOptions.push(function(plot, options) {
      // enable the plugin
      if (options.events.data != null) {
        eventMarkers.eventsEnabled = true;
      }
    });

    plot.hooks.draw.push(function(plot) {
      var options = plot.getOptions();

      if (eventMarkers.eventsEnabled) {
        // check for first run
        if (eventMarkers.getEvents().length < 1) {
          eventMarkers.setTypes(options.events.types);
          eventMarkers.setupEvents(options.events.data);
        } else {
          eventMarkers.updateEvents();
        }
      }

      eventMarkers.drawEvents();
    });
  }

  var defaultOptions = {
    events: {
      data: null,
      types: null,
      xaxis: 1,
      position: 'BOTTOM'
    }
  };

  $.plot.plugins.push({
    init: init,
    options: defaultOptions,
    name: "events",
    version: "0.2.5"
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./vendor/flot/jquery.flot.fillbelow.js":
/*!**********************************************!*\
  !*** ./vendor/flot/jquery.flot.fillbelow.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function($) {
    "use strict";

    var options = {
        series: {
            fillBelowTo: null
        }
    };

    function init(plot) {
        function findBelowSeries( series, allseries ) {

            var i;

            for ( i = 0; i < allseries.length; ++i ) {
                if ( allseries[ i ].id === series.fillBelowTo ) {
                    return allseries[ i ];
                }
            }

            return null;
        }

        /* top and bottom doesn't actually matter for this, we're just using it to help make this easier to think about */
        /* this is a vector cross product operation */
        function segmentIntersection(top_left_x, top_left_y, top_right_x, top_right_y, bottom_left_x, bottom_left_y, bottom_right_x, bottom_right_y) {
            var top_delta_x, top_delta_y, bottom_delta_x, bottom_delta_y,
                s, t;

            top_delta_x = top_right_x - top_left_x;
            top_delta_y = top_right_y - top_left_y;
            bottom_delta_x = bottom_right_x - bottom_left_x;
            bottom_delta_y = bottom_right_y - bottom_left_y;

            s = (
                (-top_delta_y * (top_left_x - bottom_left_x)) + (top_delta_x * (top_left_y - bottom_left_y))
            ) / (
                -bottom_delta_x * top_delta_y + top_delta_x * bottom_delta_y
            );

            t = (
                (bottom_delta_x * (top_left_y - bottom_left_y)) - (bottom_delta_y * (top_left_x - bottom_left_x))
            ) / (
                -bottom_delta_x * top_delta_y + top_delta_x * bottom_delta_y
            );

            // Collision detected
            if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                return [
                    top_left_x + (t * top_delta_x), // X
                    top_left_y + (t * top_delta_y) // Y
                ];
            }

            // No collision
            return null;
        }

        function plotDifferenceArea(plot, ctx, series) {
            if ( series.fillBelowTo === null ) {
                return;
            }

            var otherseries,

                ps,
                points,

                otherps,
                otherpoints,

                plotOffset,
                fillStyle;

            function openPolygon(x, y) {
                ctx.beginPath();
                ctx.moveTo(
                    series.xaxis.p2c(x) + plotOffset.left,
                    series.yaxis.p2c(y) + plotOffset.top
                );

            }

            function closePolygon() {
                ctx.closePath();
                ctx.fill();
            }

            function validateInput() {
                if (points.length/ps !== otherpoints.length/otherps) {
                    console.error("Refusing to graph inconsistent number of points");
                    return false;
                }

                var i;
                for (i = 0; i < (points.length / ps); i++) {
                    if (
                        points[i * ps] !== null &&
                        otherpoints[i * otherps] !== null &&
                        points[i * ps] !== otherpoints[i * otherps]
                    ) {
                        console.error("Refusing to graph points without matching value");
                        return false;
                    }
                }

                return true;
            }

            function findNextStart(start_i, end_i) {
                console.assert(end_i > start_i, "expects the end index to be greater than the start index");

                var start = (
                        start_i === 0 ||
                        points[start_i - 1] === null ||
                        otherpoints[start_i - 1] === null
                    ),
                    equal = false,
                    i,
                    intersect;

                for (i = start_i; i < end_i; i++) {
                    // Take note of null points
                    if (
                        points[(i * ps) + 1] === null ||
                        otherpoints[(i * ps) + 1] === null
                    ) {
                        equal = false;
                        start = true;
                    }

                    // Take note of equal points
                    else if (points[(i * ps) + 1] === otherpoints[(i * otherps) + 1]) {
                        equal = true;
                        start = false;
                    }


                    else if (points[(i * ps) + 1] > otherpoints[(i * otherps) + 1]) {
                        // If we begin above the desired point
                        if (start) {
                            openPolygon(points[i * ps], points[(i * ps) + 1]);
                        }

                        // If an equal point preceeds this, start the polygon at that equal point
                        else if (equal) {
                            openPolygon(points[(i - 1) * ps], points[((i - 1) * ps) + 1]);
                        }

                        // Otherwise, find the intersection point, and start it there
                        else {
                            intersect = intersectionPoint(i);
                            openPolygon(intersect[0], intersect[1]);
                        }

                        topTraversal(i, end_i);
                        return;
                    }

                    // If we go below equal, equal at any preceeding point is irrelevant
                    else {
                        start = false;
                        equal = false;
                    }
                }
            }

            function intersectionPoint(right_i) {
                console.assert(right_i > 0, "expects the second point in the series line segment");

                var i, intersect;

                for (i = 1; i < (otherpoints.length/otherps); i++) {
                    intersect = segmentIntersection(
                        points[(right_i - 1) * ps], points[((right_i - 1) * ps) + 1],
                        points[right_i * ps], points[(right_i * ps) + 1],

                        otherpoints[(i - 1) * otherps], otherpoints[((i - 1) * otherps) + 1],
                        otherpoints[i * otherps], otherpoints[(i * otherps) + 1]
                    );

                    if (intersect !== null) {
                        return intersect;
                    }
                }

                console.error("intersectionPoint() should only be called when an intersection happens");
            }

            function bottomTraversal(start_i, end_i) {
                console.assert(start_i >= end_i, "the start should be the rightmost point, and the end should be the leftmost (excluding the equal or intersecting point)");

                var i;

                for (i = start_i; i >= end_i; i--) {
                    ctx.lineTo(
                        otherseries.xaxis.p2c(otherpoints[i * otherps]) + plotOffset.left,
                        otherseries.yaxis.p2c(otherpoints[(i * otherps) + 1]) + plotOffset.top
                    );
                }

                closePolygon();
            }

            function topTraversal(start_i, end_i) {
                console.assert(start_i <= end_i, "the start should be the rightmost point, and the end should be the leftmost (excluding the equal or intersecting point)");

                var i,
                    intersect;

                for (i = start_i; i < end_i; i++) {
                    if (points[(i * ps) + 1] === null && i > start_i) {
                        bottomTraversal(i - 1, start_i);
                        findNextStart(i, end_i);
                        return;
                    }

                    else if (points[(i * ps) + 1] === otherpoints[(i * otherps) + 1]) {
                        bottomTraversal(i, start_i);
                        findNextStart(i, end_i);
                        return;
                    }

                    else if (points[(i * ps) + 1] < otherpoints[(i * otherps) + 1]) {
                        intersect = intersectionPoint(i);
                        ctx.lineTo(
                            series.xaxis.p2c(intersect[0]) + plotOffset.left,
                            series.yaxis.p2c(intersect[1]) + plotOffset.top
                        );
                        bottomTraversal(i, start_i);
                        findNextStart(i, end_i);
                        return;

                    }

                    else {
                        ctx.lineTo(
                            series.xaxis.p2c(points[i * ps]) + plotOffset.left,
                            series.yaxis.p2c(points[(i * ps) + 1]) + plotOffset.top
                        );
                    }
                }

                bottomTraversal(end_i, start_i);
            }


            // Begin processing

            otherseries = findBelowSeries( series, plot.getData() );

            if ( !otherseries ) {
                return;
            }

            ps = series.datapoints.pointsize;
            points = series.datapoints.points;
            otherps = otherseries.datapoints.pointsize;
            otherpoints = otherseries.datapoints.points;
            plotOffset = plot.getPlotOffset();

            if (!validateInput()) {
                return;
            }


            // Flot's getFillStyle() should probably be exposed somewhere
            fillStyle = $.color.parse(series.color);
            fillStyle.a = 0.4;
            fillStyle.normalize();
            ctx.fillStyle = fillStyle.toString();


            // Begin recursive bi-directional traversal
            findNextStart(0, points.length/ps);
        }

        plot.hooks.drawSeries.push(plotDifferenceArea);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "fillbelow",
        version: "0.1.0"
    });

})(jQuery);


/***/ }),

/***/ "./vendor/flot/jquery.flot.js":
/*!************************************!*\
  !*** ./vendor/flot/jquery.flot.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Javascript plotting library for jQuery, version 0.8.3.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

*/

// first an inline dependency, jquery.colorhelpers.js, we inline it here
// for convenience

/* Plugin for jQuery for working with colors.
 *
 * Version 1.1.
 *
 * Inspiration from jQuery color animation plugin by John Resig.
 *
 * Released under the MIT license by Ole Laursen, October 2009.
 *
 * Examples:
 *
 *   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
 *   var c = $.color.extract($("#mydiv"), 'background-color');
 *   console.log(c.r, c.g, c.b, c.a);
 *   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
 *
 * Note that .scale() and .add() return the same modified object
 * instead of making a new one.
 *
 * V. 1.1: Fix error handling so e.g. parsing an empty string does
 * produce a color rather than just crashing.
 */
(function($){$.color={};$.color.make=function(r,g,b,a){var o={};o.r=r||0;o.g=g||0;o.b=b||0;o.a=a!=null?a:1;o.add=function(c,d){for(var i=0;i<c.length;++i)o[c.charAt(i)]+=d;return o.normalize()};o.scale=function(c,f){for(var i=0;i<c.length;++i)o[c.charAt(i)]*=f;return o.normalize()};o.toString=function(){if(o.a>=1){return"rgb("+[o.r,o.g,o.b].join(",")+")"}else{return"rgba("+[o.r,o.g,o.b,o.a].join(",")+")"}};o.normalize=function(){function clamp(min,value,max){return value<min?min:value>max?max:value}o.r=clamp(0,parseInt(o.r),255);o.g=clamp(0,parseInt(o.g),255);o.b=clamp(0,parseInt(o.b),255);o.a=clamp(0,o.a,1);return o};o.clone=function(){return $.color.make(o.r,o.b,o.g,o.a)};return o.normalize()};$.color.extract=function(elem,css){var c;do{c=elem.css(css).toLowerCase();if(c!=""&&c!="transparent")break;elem=elem.parent()}while(elem.length&&!$.nodeName(elem.get(0),"body"));if(c=="rgba(0, 0, 0, 0)")c="transparent";return $.color.parse(c)};$.color.parse=function(str){var res,m=$.color.make;if(res=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10));if(res=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10),parseFloat(res[4]));if(res=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55);if(res=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55,parseFloat(res[4]));if(res=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))return m(parseInt(res[1],16),parseInt(res[2],16),parseInt(res[3],16));if(res=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))return m(parseInt(res[1]+res[1],16),parseInt(res[2]+res[2],16),parseInt(res[3]+res[3],16));var name=$.trim(str).toLowerCase();if(name=="transparent")return m(255,255,255,0);else{res=lookupColors[name]||[0,0,0];return m(res[0],res[1],res[2])}};var lookupColors={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);

// the actual Flot code
(function($) {

	// Cache the prototype hasOwnProperty for faster access

	var hasOwnProperty = Object.prototype.hasOwnProperty;

    // A shim to provide 'detach' to jQuery versions prior to 1.4.  Using a DOM
    // operation produces the same effect as detach, i.e. removing the element
    // without touching its jQuery data.

    // Do not merge this into Flot 0.9, since it requires jQuery 1.4.4+.

    if (!$.fn.detach) {
        $.fn.detach = function() {
            return this.each(function() {
                if (this.parentNode) {
                    this.parentNode.removeChild( this );
                }
            });
        };
    }

	///////////////////////////////////////////////////////////////////////////
	// The Canvas object is a wrapper around an HTML5 <canvas> tag.
	//
	// @constructor
	// @param {string} cls List of classes to apply to the canvas.
	// @param {element} container Element onto which to append the canvas.
	//
	// Requiring a container is a little iffy, but unfortunately canvas
	// operations don't work unless the canvas is attached to the DOM.

	function Canvas(cls, container) {

		var element = container.children("." + cls)[0];

		if (element == null) {

			element = document.createElement("canvas");
			element.className = cls;

			$(element).css({ direction: "ltr", position: "absolute", left: 0, top: 0 })
				.appendTo(container);

			// If HTML5 Canvas isn't available, fall back to [Ex|Flash]canvas

			if (!element.getContext) {
				if (window.G_vmlCanvasManager) {
					element = window.G_vmlCanvasManager.initElement(element);
				} else {
					throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");
				}
			}
		}

		this.element = element;

		var context = this.context = element.getContext("2d");

		// Determine the screen's ratio of physical to device-independent
		// pixels.  This is the ratio between the canvas width that the browser
		// advertises and the number of pixels actually present in that space.

		// The iPhone 4, for example, has a device-independent width of 320px,
		// but its screen is actually 640px wide.  It therefore has a pixel
		// ratio of 2, while most normal devices have a ratio of 1.

		var devicePixelRatio = window.devicePixelRatio || 1,
			backingStoreRatio =
				context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio || 1;

		this.pixelRatio = devicePixelRatio / backingStoreRatio;

		// Size the canvas to match the internal dimensions of its container

		this.resize(container.width(), container.height());

		// Collection of HTML div layers for text overlaid onto the canvas

		this.textContainer = null;
		this.text = {};

		// Cache of text fragments and metrics, so we can avoid expensively
		// re-calculating them when the plot is re-rendered in a loop.

		this._textCache = {};
		this._textSizeCache = window.flotTextSizeCache = window.flotTextSizeCache || {};
	}

	// Resizes the canvas to the given dimensions.
	//
	// @param {number} width New width of the canvas, in pixels.
	// @param {number} width New height of the canvas, in pixels.

	Canvas.prototype.resize = function(width, height) {

		if (width <= 0 || height <= 0) {
			throw new Error("Invalid dimensions for plot, width = " + width + ", height = " + height);
		}

		var element = this.element,
			context = this.context,
			pixelRatio = this.pixelRatio;

		// Resize the canvas, increasing its density based on the display's
		// pixel ratio; basically giving it more pixels without increasing the
		// size of its element, to take advantage of the fact that retina
		// displays have that many more pixels in the same advertised space.

		// Resizing should reset the state (excanvas seems to be buggy though)

		if (this.width != width) {
			element.width = width * pixelRatio;
			element.style.width = width + "px";
			this.width = width;
		}

		if (this.height != height) {
			element.height = height * pixelRatio;
			element.style.height = height + "px";
			this.height = height;
		}

		// Save the context, so we can reset in case we get replotted.  The
		// restore ensure that we're really back at the initial state, and
		// should be safe even if we haven't saved the initial state yet.

		context.restore();
		context.save();

		// Scale the coordinate space to match the display density; so even though we
		// may have twice as many pixels, we still want lines and other drawing to
		// appear at the same size; the extra pixels will just make them crisper.

		context.scale(pixelRatio, pixelRatio);
	};

	// Clears the entire canvas area, not including any overlaid HTML text

	Canvas.prototype.clear = function() {
		this.context.clearRect(0, 0, this.width, this.height);
	};

	// Finishes rendering the canvas, including managing the text overlay.

	Canvas.prototype.render = function() {

		var cache = this._textCache;

		// For each text layer, add elements marked as active that haven't
		// already been rendered, and remove those that are no longer active.

		for (var layerKey in cache) {
			if (hasOwnProperty.call(cache, layerKey)) {

				var layer = this.getTextLayer(layerKey),
					layerCache = cache[layerKey];

				layer.hide();

				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {

								var positions = styleCache[key].positions;

								for (var i = 0, position; position = positions[i]; i++) {
									if (position.active) {
										if (!position.rendered) {
											layer.append(position.element);
											position.rendered = true;
										}
									} else {
										positions.splice(i--, 1);
										if (position.rendered) {
											position.element.detach();
										}
									}
								}

								if (positions.length == 0) {
									delete styleCache[key];
								}
							}
						}
					}
				}

				layer.show();
			}
		}
	};

	// Creates (if necessary) and returns the text overlay container.
	//
	// @param {string} classes String of space-separated CSS classes used to
	//     uniquely identify the text layer.
	// @return {object} The jQuery-wrapped text-layer div.

	Canvas.prototype.getTextLayer = function(classes) {

		var layer = this.text[classes];

		// Create the text layer if it doesn't exist

		if (layer == null) {

			// Create the text layer container, if it doesn't exist

			if (this.textContainer == null) {
				this.textContainer = $("<div class='flot-text flot-temp-elem'></div>")
					.css({
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						'font-size': "smaller",
						color: "#545454"
					})
					.insertAfter(this.element);
			}

			layer = this.text[classes] = $("<div></div>")
				.addClass(classes)
				.css({
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0
				})
				.appendTo(this.textContainer);
		}

		return layer;
	};

	// Creates (if necessary) and returns a text info object.
	//
	// The object looks like this:
	//
	// {
	//     width: Width of the text's wrapper div.
	//     height: Height of the text's wrapper div.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     positions: Array of positions at which this text is drawn.
	// }
	//
	// The positions array contains objects that look like this:
	//
	// {
	//     active: Flag indicating whether the text should be visible.
	//     rendered: Flag indicating whether the text is currently visible.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     x: X coordinate at which to draw the text.
	//     y: Y coordinate at which to draw the text.
	// }
	//
	// Each position after the first receives a clone of the original element.
	//
	// The idea is that that the width, height, and general 'identity' of the
	// text is constant no matter where it is placed; the placements are a
	// secondary property.
	//
	// Canvas maintains a cache of recently-used text info objects; getTextInfo
	// either returns the cached element or creates a new entry.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {string} text Text string to retrieve info for.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @return {object} a text info object.

	Canvas.prototype.getTextInfo = function(layer, text, font, angle, width) {

		var textStyle, layerCache, styleCache, info;

		// Cast the value to a string, in case we were given a number or such

		text = "" + text;

		// If the font is a font-spec object, generate a CSS font definition

		if (typeof font === "object") {
			textStyle = font.style + " " + font.variant + " " + font.weight + " " + font.size + "px/" + font.lineHeight + "px " + font.family;
		} else {
			textStyle = font;
		}

		// Retrieve (or create) the cache for the text's layer and styles

		layerCache = this._textCache[layer];

		if (layerCache == null) {
			layerCache = this._textCache[layer] = {};
		}

		styleCache = layerCache[textStyle];

		if (styleCache == null) {
			styleCache = layerCache[textStyle] = {};
		}

		info = styleCache[text];

		// If we can't find a matching element in our cache, create a new one

		if (info == null) {

			var element = $("<div></div>").html(text)
				.css({
					position: "absolute",
					'max-width': width,
					top: -9999
				})
				.appendTo(this.getTextLayer(layer));

			if (typeof font === "object") {
				element.css({
					font: textStyle,
					color: font.color
				});
			} else if (typeof font === "string") {
				element.addClass(font);
			}

      info = styleCache[text] = { element: element, positions: [] };

      var size = this._textSizeCache[text];
			if (size) {
        info.width = size.width;
        info.height = size.height;
			} else {
        info.width = element.outerWidth(true);
        info.height = element.outerHeight(true);
        this._textSizeCache[text] = { width: info.width, height: info.height };
			}
			element.detach();
		}

		return info;
	};

	// Adds a text string to the canvas text overlay.
	//
	// The text isn't drawn immediately; it is marked as rendering, which will
	// result in its addition to the canvas on the next render pass.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number} x X coordinate at which to draw the text.
	// @param {number} y Y coordinate at which to draw the text.
	// @param {string} text Text string to draw.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @param {string=} halign Horizontal alignment of the text; either "left",
	//     "center" or "right".
	// @param {string=} valign Vertical alignment of the text; either "top",
	//     "middle" or "bottom".

	Canvas.prototype.addText = function(layer, x, y, text, font, angle, width, halign, valign) {

		var info = this.getTextInfo(layer, text, font, angle, width),
			positions = info.positions;

		// Tweak the div's position to match the text's alignment

		if (halign == "center") {
			x -= info.width / 2;
		} else if (halign == "right") {
			x -= info.width;
		}

		if (valign == "middle") {
			y -= info.height / 2;
		} else if (valign == "bottom") {
			y -= info.height;
		}

		// Determine whether this text already exists at this position.
		// If so, mark it for inclusion in the next render pass.

		for (var i = 0, position; position = positions[i]; i++) {
			if (position.x == x && position.y == y) {
				position.active = true;
				return;
			}
		}

		// If the text doesn't exist at this position, create a new entry

		// For the very first position we'll re-use the original element,
		// while for subsequent ones we'll clone it.

		position = {
			active: true,
			rendered: false,
			element: positions.length ? info.element.clone() : info.element,
			x: x,
			y: y
		};

		positions.push(position);

		// Move the element to its final position within the container

		position.element.css({
			top: Math.round(y),
			left: Math.round(x),
			'text-align': halign	// In case the text wraps
		});
	};

	// Removes one or more text strings from the canvas text overlay.
	//
	// If no parameters are given, all text within the layer is removed.
	//
	// Note that the text is not immediately removed; it is simply marked as
	// inactive, which will result in its removal on the next render pass.
	// This avoids the performance penalty for 'clear and redraw' behavior,
	// where we potentially get rid of all text on a layer, but will likely
	// add back most or all of it later, as when redrawing axes, for example.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number=} x X coordinate of the text.
	// @param {number=} y Y coordinate of the text.
	// @param {string=} text Text string to remove.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which the text is rotated, in degrees.
	//     Angle is currently unused, it will be implemented in the future.

	Canvas.prototype.removeText = function(layer, x, y, text, font, angle) {
		if (text == null) {
			var layerCache = this._textCache[layer];
			if (layerCache != null) {
				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {
								var positions = styleCache[key].positions;
								for (var i = 0, position; position = positions[i]; i++) {
									position.active = false;
								}
							}
						}
					}
				}
			}
		} else {
			var positions = this.getTextInfo(layer, text, font, angle).positions;
			for (var i = 0, position; position = positions[i]; i++) {
				if (position.x == x && position.y == y) {
					position.active = false;
				}
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////
	// The top-level container for the entire plot.

    function Plot(placeholder, data_, options_, plugins) {
        // data is on the form:
        //   [ series1, series2 ... ]
        // where series is either just the data as [ [x1, y1], [x2, y2], ... ]
        // or { data: [ [x1, y1], [x2, y2], ... ], label: "some label", ... }

        var series = [],
            options = {
                // the color theme used for graphs
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: true,
                    noColumns: 1, // number of colums in legend table
                    labelFormatter: null, // fn: string -> string
                    labelBoxBorderColor: "#ccc", // border color for the little label boxes
                    container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                    position: "ne", // position of default legend container within plot
                    margin: 5, // distance from grid edge to default legend container within plot
                    backgroundColor: null, // null means auto-detect
                    backgroundOpacity: 0.85, // set to 0 to avoid background
                    sorted: null    // default to no legend sorting
                },
                xaxis: {
                    show: null, // null = auto-detect, true = always, false = never
                    position: "bottom", // or "top"
                    mode: null, // null or "time"
                    font: null, // null (derived from CSS in placeholder) or object like { size: 11, lineHeight: 13, style: "italic", weight: "bold", family: "sans-serif", variant: "small-caps" }
                    color: null, // base color, labels, ticks
                    tickColor: null, // possibly different color of ticks, e.g. "rgba(0,0,0,0.15)"
                    transform: null, // null or f: number -> number to transform axis
                    inverseTransform: null, // if transform is set, this should be the inverse function
                    min: null, // min. value to show, null means set automatically
                    max: null, // max. value to show, null means set automatically
                    autoscaleMargin: null, // margin in % to add if auto-setting min/max
                    ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
                    tickFormatter: null, // fn: number -> string
                    labelWidth: null, // size of tick labels in pixels
                    labelHeight: null,
                    reserveSpace: null, // whether to reserve space even if axis isn't shown
                    tickLength: null, // size in pixels of ticks, or "full" for whole line
                    alignTicksWithAxis: null, // axis number or null for no sync
                    tickDecimals: null, // no. of decimals, null means auto
                    tickSize: null, // number or [number, "unit"]
                    minTickSize: null // number or [number, "unit"]
                },
                yaxis: {
                    autoscaleMargin: 0.02,
                    position: "left" // or "right"
                },
                xaxes: [],
                yaxes: [],
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2, // in pixels
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle" // or callback
                    },
                    lines: {
                        // we don't put in show: false so we can see
                        // whether lines were actively disabled
                        lineWidth: 2, // in pixels
                        fill: false,
                        fillColor: null,
                        steps: false
                        // Omit 'zero', so we can later default its value to
                        // match that of the 'fill' option.
                    },
                    bars: {
                        show: false,
                        lineWidth: 2, // in pixels
                        barWidth: 1, // in units of the x axis
                        fill: true,
                        fillColor: null,
                        align: "left", // "left", "right", or "center"
                        horizontal: false,
                        zero: true
                    },
                    shadowSize: 3,
                    highlightColor: null
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454", // primary color used for outline and labels
                    backgroundColor: null, // null for transparent, else color
                    borderColor: null, // set if different from the grid color
                    tickColor: null, // color for the ticks, e.g. "rgba(0,0,0,0.15)"
                    margin: 0, // distance from the canvas edge to the grid
                    labelMargin: 5, // in pixels
                    eventSectionHeight: 0, // space for event section
                    axisMargin: 8, // in pixels
                    borderWidth: 2, // in pixels
                    minBorderMargin: null, // in pixels, null means taken from points radius
                    markings: null, // array of ranges or fn: axes -> array of ranges
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    // interactive stuff
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true, // highlight in case mouse is near
                    mouseActiveRadius: 10 // how far the mouse can be away to activate an item
                },
                interaction: {
                    redrawOverlayInterval: 1000/60 // time between updates, -1 means in same flow
                },
                hooks: {}
            },
        surface = null,     // the canvas for the plot itself
        overlay = null,     // canvas for interactive stuff on top of plot
        eventHolder = null, // jQuery object that events should be bound to
        ctx = null, octx = null,
        xaxes = [], yaxes = [],
        plotOffset = { left: 0, right: 0, top: 0, bottom: 0},
        plotWidth = 0, plotHeight = 0,
        hooks = {
            processOptions: [],
            processRawData: [],
            processDatapoints: [],
            processOffset: [],
            drawBackground: [],
            drawSeries: [],
            draw: [],
            bindEvents: [],
            drawOverlay: [],
            shutdown: []
        },
        plot = this;

        // public functions
        plot.setData = setData;
        plot.setupGrid = setupGrid;
        plot.draw = draw;
        plot.getPlaceholder = function() { return placeholder; };
        plot.getCanvas = function() { return surface.element; };
        plot.getPlotOffset = function() { return plotOffset; };
        plot.width = function () { return plotWidth; };
        plot.height = function () { return plotHeight; };
        plot.offset = function () {
            var o = eventHolder.offset();
            o.left += plotOffset.left;
            o.top += plotOffset.top;
            return o;
        };
        plot.getData = function () { return series; };
        plot.getAxes = function () {
            var res = {}, i;
            $.each(xaxes.concat(yaxes), function (_, axis) {
                if (axis)
                    res[axis.direction + (axis.n != 1 ? axis.n : "") + "axis"] = axis;
            });
            return res;
        };
        plot.getXAxes = function () { return xaxes; };
        plot.getYAxes = function () { return yaxes; };
        plot.c2p = canvasToAxisCoords;
        plot.p2c = axisToCanvasCoords;
        plot.getOptions = function () { return options; };
        plot.highlight = highlight;
        plot.unhighlight = unhighlight;
        plot.triggerRedrawOverlay = triggerRedrawOverlay;
        plot.pointOffset = function(point) {
            return {
                left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left, 10),
                top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top, 10)
            };
        };
        plot.shutdown = shutdown;
        plot.destroy = function () {
            shutdown();
            placeholder.removeData("plot").empty();

            series = [];
            options = null;
            surface = null;
            overlay = null;
            eventHolder = null;
            ctx = null;
            octx = null;
            xaxes = [];
            yaxes = [];
            hooks = null;
            highlights = [];
            plot = null;
        };
        plot.resize = function () {
        	var width = placeholder.width(),
        		height = placeholder.height();
            surface.resize(width, height);
            overlay.resize(width, height);
        };

        // public attributes
        plot.hooks = hooks;

        // initialize
        initPlugins(plot);
        parseOptions(options_);
        setupCanvases();
        setData(data_);
        setupGrid();
        draw();
        bindEvents();


        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i)
                hook[i].apply(this, args);
        }

        function initPlugins() {

            // References to key classes, allowing plugins to modify them

            var classes = {
                Canvas: Canvas
            };

            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                p.init(plot, classes);
                if (p.options)
                    $.extend(true, options, p.options);
            }
        }

        function parseOptions(opts) {

            $.extend(true, options, opts);

            // $.extend merges arrays, rather than replacing them.  When less
            // colors are provided than the size of the default palette, we
            // end up with those colors plus the remaining defaults, which is
            // not expected behavior; avoid it by replacing them here.

            if (opts && opts.colors) {
            	options.colors = opts.colors;
            }

            if (options.xaxis.color == null)
                options.xaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            if (options.yaxis.color == null)
                options.yaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            if (options.xaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.xaxis.tickColor = options.grid.tickColor || options.xaxis.color;
            if (options.yaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.yaxis.tickColor = options.grid.tickColor || options.yaxis.color;

            if (options.grid.borderColor == null)
                options.grid.borderColor = options.grid.color;
            if (options.grid.tickColor == null)
                options.grid.tickColor = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            // Fill in defaults for axis options, including any unspecified
            // font-spec fields, if a font-spec was provided.

            // If no x/y axis options were provided, create one of each anyway,
            // since the rest of the code assumes that they exist.

            var i, axisOptions, axisCount,
                fontSize = placeholder.css("font-size"),
                fontSizeDefault = fontSize ? +fontSize.replace("px", "") : 13,
                fontDefaults = {
                    style: placeholder.css("font-style"),
                    size: Math.round(0.8 * fontSizeDefault),
                    variant: placeholder.css("font-variant"),
                    weight: placeholder.css("font-weight"),
                    family: placeholder.css("font-family")
                };

            axisCount = options.xaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.xaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.xaxis, axisOptions);
                options.xaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            axisCount = options.yaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.yaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.yaxis, axisOptions);
                options.yaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            // backwards compatibility, to be removed in future
            if (options.xaxis.noTicks && options.xaxis.ticks == null)
                options.xaxis.ticks = options.xaxis.noTicks;
            if (options.yaxis.noTicks && options.yaxis.ticks == null)
                options.yaxis.ticks = options.yaxis.noTicks;
            if (options.x2axis) {
                options.xaxes[1] = $.extend(true, {}, options.xaxis, options.x2axis);
                options.xaxes[1].position = "top";
                // Override the inherit to allow the axis to auto-scale
                if (options.x2axis.min == null) {
                    options.xaxes[1].min = null;
                }
                if (options.x2axis.max == null) {
                    options.xaxes[1].max = null;
                }
            }
            if (options.y2axis) {
                options.yaxes[1] = $.extend(true, {}, options.yaxis, options.y2axis);
                options.yaxes[1].position = "right";
                // Override the inherit to allow the axis to auto-scale
                if (options.y2axis.min == null) {
                    options.yaxes[1].min = null;
                }
                if (options.y2axis.max == null) {
                    options.yaxes[1].max = null;
                }
            }
            if (options.grid.coloredAreas)
                options.grid.markings = options.grid.coloredAreas;
            if (options.grid.coloredAreasColor)
                options.grid.markingsColor = options.grid.coloredAreasColor;
            if (options.lines)
                $.extend(true, options.series.lines, options.lines);
            if (options.points)
                $.extend(true, options.series.points, options.points);
            if (options.bars)
                $.extend(true, options.series.bars, options.bars);
            if (options.shadowSize != null)
                options.series.shadowSize = options.shadowSize;
            if (options.highlightColor != null)
                options.series.highlightColor = options.highlightColor;

            // save options on axes for future reference
            for (i = 0; i < options.xaxes.length; ++i)
                getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i];
            for (i = 0; i < options.yaxes.length; ++i)
                getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i];

            // add hooks from options
            for (var n in hooks)
                if (options.hooks[n] && options.hooks[n].length)
                    hooks[n] = hooks[n].concat(options.hooks[n]);

            executeHooks(hooks.processOptions, [options]);
        }

        function setData(d) {
            series = parseData(d);
            fillInSeriesOptions();
            processData();
        }

        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);

                if (d[i].data != null) {
                    s.data = d[i].data; // move the data instead of deep-copy
                    delete d[i].data;

                    $.extend(true, s, d[i]);

                    d[i].data = s.data;
                }
                else
                    s.data = d[i];
                res.push(s);
            }

            return res;
        }

        function axisNumber(obj, coord) {
            var a = obj[coord + "axis"];
            if (typeof a == "object") // if we got a real axis, extract number
                a = a.n;
            if (typeof a != "number")
                a = 1; // default to first axis
            return a;
        }

        function allAxes() {
            // return flat array without annoying null entries
            return $.grep(xaxes.concat(yaxes), function (a) { return a; });
        }

        function canvasToAxisCoords(pos) {
            // return an object with x/y corresponding to all used axes
            var res = {}, i, axis;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used)
                    res["x" + axis.n] = axis.c2p(pos.left);
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used)
                    res["y" + axis.n] = axis.c2p(pos.top);
            }

            if (res.x1 !== undefined)
                res.x = res.x1;
            if (res.y1 !== undefined)
                res.y = res.y1;

            return res;
        }

        function axisToCanvasCoords(pos) {
            // get canvas coords from the first pair of x/y found in pos
            var res = {}, i, axis, key;

            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    key = "x" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "x";

                    if (pos[key] != null) {
                        res.left = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {
                    key = "y" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "y";

                    if (pos[key] != null) {
                        res.top = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            return res;
        }

        function getOrCreateAxis(axes, number) {
            if (!axes[number - 1])
                axes[number - 1] = {
                    n: number, // save the number for future reference
                    direction: axes == xaxes ? "x" : "y",
                    options: $.extend(true, {}, axes == xaxes ? options.xaxis : options.yaxis)
                };

            return axes[number - 1];
        }

        function fillInSeriesOptions() {

            var neededColors = series.length, maxIndex = -1, i;

            // Subtract the number of series that already have fixed colors or
            // color indexes from the number that we still need to generate.

            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    neededColors--;
                    if (typeof sc == "number" && sc > maxIndex) {
                        maxIndex = sc;
                    }
                }
            }

            // If any of the series have fixed color indexes, then we need to
            // generate at least as many colors as the highest index.

            if (neededColors <= maxIndex) {
                neededColors = maxIndex + 1;
            }

            // Generate all the colors, using first the option colors and then
            // variations on those colors once they're exhausted.

            var c, colors = [], colorPool = options.colors,
                colorPoolSize = colorPool.length, variation = 0;

            for (i = 0; i < neededColors; i++) {

                c = $.color.parse(colorPool[i % colorPoolSize] || "#666");

                // Each time we exhaust the colors in the pool we adjust
                // a scaling factor used to produce more variations on
                // those colors. The factor alternates negative/positive
                // to produce lighter/darker colors.

                // Reset the variation after every few cycles, or else
                // it will end up producing only white or black colors.

                if (i % colorPoolSize == 0 && i) {
                    if (variation >= 0) {
                        if (variation < 0.5) {
                            variation = -variation - 0.2;
                        } else variation = 0;
                    } else variation = -variation;
                }

                colors[i] = c.scale('rgb', 1 + variation);
            }

            // Finalize the series options, filling in their colors

            var colori = 0, s;
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                // assign colors
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                }
                else if (typeof s.color == "number")
                    s.color = colors[s.color].toString();

                // turn on lines automatically in case nothing is set
                if (s.lines.show == null) {
                    var v, show = true;
                    for (v in s)
                        if (s[v] && s[v].show) {
                            show = false;
                            break;
                        }
                    if (show)
                        s.lines.show = true;
                }

                // If nothing was provided for lines.zero, default it to match
                // lines.fill, since areas by default should extend to zero.

                if (s.lines.zero == null) {
                    s.lines.zero = !!s.lines.fill;
                }

                // setup axes
                s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
                s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));
            }
        }

        function processData() {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                fakeInfinity = Number.MAX_VALUE,
                i, j, k, m, length,
                s, points, ps, x, y, axis, val, f, p,
                data, format;

            function updateAxis(axis, min, max) {
                if (min < axis.datamin && min != -fakeInfinity)
                    axis.datamin = min;
                if (max > axis.datamax && max != fakeInfinity)
                    axis.datamax = max;
            }

            $.each(allAxes(), function (_, axis) {
                // init axis
                axis.datamin = topSentry;
                axis.datamax = bottomSentry;
                axis.used = false;
            });

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = { points: [] };

                executeHooks(hooks.processRawData, [ s, s.data, s.datapoints ]);
            }

            // first pass: clean and copy data
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                data = s.data;
                format = s.datapoints.format;

                if (!format) {
                    format = [];
                    // find out how to copy
                    format.push({ x: true, number: true, required: true });
                    format.push({ y: true, number: true, required: true });

                    if (s.bars.show || (s.lines.show && s.lines.fill)) {
                        var autoscale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                        format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale });
                        if (s.bars.horizontal) {
                            delete format[format.length - 1].y;
                            format[format.length - 1].x = true;
                        }
                    }

                    s.datapoints.format = format;
                }

                if (s.datapoints.pointsize != null)
                    continue; // already filled in

                s.datapoints.pointsize = format.length;

                ps = s.datapoints.pointsize;
                points = s.datapoints.points;

                var insertSteps = s.lines.show && s.lines.steps;
                s.xaxis.used = s.yaxis.used = true;

                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];

                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];

                            if (f) {
                                if (f.number && val != null) {
                                    val = +val; // convert to number
                                    if (isNaN(val))
                                        val = null;
                                    else if (val == Infinity)
                                        val = fakeInfinity;
                                    else if (val == -Infinity)
                                        val = -fakeInfinity;
                                }

                                if (val == null) {
                                    if (f.required)
                                        nullify = true;

                                    if (f.defaultValue != null)
                                        val = f.defaultValue;
                                }
                            }

                            points[k + m] = val;
                        }
                    }

                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                // extract min/max info
                                if (f.autoscale !== false) {
                                    if (f.x) {
                                        updateAxis(s.xaxis, val, val);
                                    }
                                    if (f.y) {
                                        updateAxis(s.yaxis, val, val);
                                    }
                                }
                            }
                            points[k + m] = null;
                        }
                    }

                    if (insertSteps && k > 0 && (!nullify || points[k - ps] != null)) {
                        // copy the point to make room for a middle point
                        for (m = 0; m < ps; ++m)
                            points[k + ps + m] = points[k + m];

                        // middle point has same y
                        points[k + 1] = points[k - ps + 1] || 0;

                        // if series has null values, let's give the last !null value a nice step
                        if(nullify)
                        	points[k] = p[0];

                        // we've added a point, better reflect that
                        k += ps;
                    }
                }
            }

            // give the hooks a chance to run
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points;
                ps = s.datapoints.pointsize;

                // grafana
                if (s.transform === 'negative-Y') {
                  for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;

                      val = points[j + 1];
                      points[j + 1] = -val;
                  }
                }

                executeHooks(hooks.processDatapoints, [ s, s.datapoints]);
            }

            // second pass: find datamax/datamin for auto-scaling
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points;
                ps = s.datapoints.pointsize;
                format = s.datapoints.format;

                var xmin = topSentry, ymin = topSentry,
                    xmax = bottomSentry, ymax = bottomSentry;

                for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;

                    for (m = 0; m < ps; ++m) {
                        val = points[j + m];
                        f = format[m];
                        if (!f || f.autoscale === false || val == fakeInfinity || val == -fakeInfinity)
                            continue;

                        if (f.x) {
                            if (val < xmin)
                                xmin = val;
                            if (val > xmax)
                                xmax = val;
                        }
                        if (f.y) {
                            if (val < ymin)
                                ymin = val;
                            if (val > ymax)
                                ymax = val;
                        }
                    }
                }

                if (s.bars.show) {
                    // make sure we got room for the bar on the dancing floor
                    var delta;

                    switch (s.bars.align) {
                        case "left":
                            delta = 0;
                            break;
                        case "right":
                            delta = -s.bars.barWidth;
                            break;
                        default:
                            delta = -s.bars.barWidth / 2;
                    }

                    if (s.bars.horizontal) {
                        ymin += delta;
                        ymax += delta + s.bars.barWidth;
                    }
                    else {
                        xmin += delta;
                        xmax += delta + s.bars.barWidth;
                    }
                }

                updateAxis(s.xaxis, xmin, xmax);
                updateAxis(s.yaxis, ymin, ymax);
            }

            $.each(allAxes(), function (_, axis) {
                if (axis.datamin == topSentry)
                    axis.datamin = null;
                if (axis.datamax == bottomSentry)
                    axis.datamax = null;
            });
        }

        function setupCanvases() {
            // Make sure the placeholder is clear of everything except canvases
            // from a previous plot in this container that we'll try to re-use.

            placeholder.find(".flot-temp-elem").remove();

            if (placeholder.css("position") == 'static')
                placeholder.css("position", "relative"); // for positioning labels and overlay

            surface = new Canvas("flot-base", placeholder);
            overlay = new Canvas("flot-overlay", placeholder); // overlay canvas for interactive features

            ctx = surface.context;
            octx = overlay.context;

            // define which element we're listening for events on
            eventHolder = $(overlay.element).unbind();

            // If we're re-using a plot object, shut down the old one

            var existing = placeholder.data("plot");

            if (existing) {
                existing.shutdown();
                overlay.clear();
            }

            // save in case we get replotted
            placeholder.data("plot", plot);
        }

        function bindEvents() {
            // bind events
            if (options.grid.hoverable) {
                eventHolder.mousemove(onMouseMove);

                // Use bind, rather than .mouseleave, because we officially
                // still support jQuery 1.2.6, which doesn't define a shortcut
                // for mouseenter or mouseleave.  This was a bug/oversight that
                // was fixed somewhere around 1.3.x.  We can return to using
                // .mouseleave when we drop support for 1.2.6.

                eventHolder.bind("mouseleave", onMouseLeave);
            }

            if (options.grid.clickable)
                eventHolder.click(onClick);

            executeHooks(hooks.bindEvents, [eventHolder]);
        }

        function shutdown() {
            if (redrawTimeout)
                clearTimeout(redrawTimeout);

            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mouseleave", onMouseLeave);
            eventHolder.unbind("click", onClick);

            executeHooks(hooks.shutdown, [eventHolder]);
        }

        function setTransformationHelpers(axis) {
            // set helper functions on the axis, assumes plot area
            // has been computed already

            function identity(x) { return x; }

            var s, m, t = axis.options.transform || identity,
                it = axis.options.inverseTransform;

            // precompute how much the axis is scaling a point
            // in canvas space
            if (axis.direction == "x") {
                s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min));
                m = Math.min(t(axis.max), t(axis.min));
            }
            else {
                s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min));
                s = -s;
                m = Math.max(t(axis.max), t(axis.min));
            }

            // data point to canvas coordinate
            if (t == identity) // slight optimization
                axis.p2c = function (p) { return (p - m) * s; };
            else
                axis.p2c = function (p) { return (t(p) - m) * s; };
            // canvas coordinate to data point
            if (!it)
                axis.c2p = function (c) { return m + c / s; };
            else
                axis.c2p = function (c) { return it(m + c / s); };
        }

        function measureTickLabels(axis) {

            var opts = axis.options,
                ticks = axis.ticks || [],
                labelWidth = opts.labelWidth || 0,
                labelHeight = opts.labelHeight || 0,
                maxWidth = labelWidth || (axis.direction == "x" ? Math.floor(surface.width / (ticks.length || 1)) : null),
                legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                font = opts.font || "flot-tick-label tickLabel";

            for (var i = 0; i < ticks.length; ++i) {

                var t = ticks[i];

                if (!t.label)
                    continue;

                var info = surface.getTextInfo(layer, t.label, font, null, maxWidth);

                /// Grafana fix, add +1 to label width
                labelWidth = Math.max(labelWidth, info.width + 1);
                labelHeight = Math.max(labelHeight, info.height);
            }

            axis.labelWidth = opts.labelWidth || labelWidth;
            axis.labelHeight = opts.labelHeight || labelHeight;
        }

        function allocateAxisBoxFirstPhase(axis) {
            // find the bounding box of the axis by looking at label
            // widths/heights and ticks, make room by diminishing the
            // plotOffset; this first phase only looks at one
            // dimension per axis, the other dimension depends on the
            // other axes so will have to wait

            var lw = axis.labelWidth,
                lh = axis.labelHeight,
                pos = axis.options.position,
                isXAxis = axis.direction === "x",
                tickLength = axis.options.tickLength,
                axisMargin = options.grid.axisMargin,
                padding = options.grid.labelMargin,
                eventSectionPadding = options.grid.eventSectionHeight,
                innermost = true,
                outermost = true,
                first = true,
                found = false;

            // Determine the axis's position in its direction and on its side

            $.each(isXAxis ? xaxes : yaxes, function(i, a) {
                if (a && (a.show || a.reserveSpace)) {
                    if (a === axis) {
                        found = true;
                    } else if (a.options.position === pos) {
                        if (found) {
                            outermost = false;
                        } else {
                            innermost = false;
                        }
                    }
                    if (!found) {
                        first = false;
                    }
                }
            });

            // The outermost axis on each side has no margin

            if (outermost) {
                axisMargin = 0;
            }

            // The ticks for the first axis in each direction stretch across

            if (tickLength == null) {
                tickLength = first ? "full" : 5;
            }

            if (!isNaN(+tickLength))
                padding += +tickLength;

            if (isXAxis) {
                // Add space for event section
                lh += padding;
                lh += eventSectionPadding;

                if (pos == "bottom") {
                    plotOffset.bottom += lh + axisMargin;
                    axis.box = { top: surface.height - plotOffset.bottom, height: lh };
                }
                else {
                    axis.box = { top: plotOffset.top + axisMargin, height: lh };
                    plotOffset.top += lh + axisMargin;
                }
            }
            else {
                lw += padding;

                if (pos == "left") {
                    axis.box = { left: plotOffset.left + axisMargin, width: lw };
                    plotOffset.left += lw + axisMargin;
                }
                else {
                    plotOffset.right += lw + axisMargin;
                    axis.box = { left: surface.width - plotOffset.right, width: lw };
                }
            }

             // save for future reference
            axis.position = pos;
            axis.tickLength = tickLength;
            axis.box.padding = padding;
            axis.box.eventSectionPadding = eventSectionPadding;
            axis.innermost = innermost;
        }

        function allocateAxisBoxSecondPhase(axis) {
            // now that all axis boxes have been placed in one
            // dimension, we can set the remaining dimension coordinates
            if (axis.direction == "x") {
                axis.box.left = plotOffset.left - axis.labelWidth / 2;
                axis.box.width = surface.width - plotOffset.left - plotOffset.right + axis.labelWidth;
            }
            else {
                axis.box.top = plotOffset.top - axis.labelHeight / 2;
                axis.box.height = surface.height - plotOffset.bottom - plotOffset.top + axis.labelHeight;
            }
        }

        function adjustLayoutForThingsStickingOut() {
            // possibly adjust plot offset to ensure everything stays
            // inside the canvas and isn't clipped off

            var minMargin = options.grid.minBorderMargin,
                axis, i;

            // check stuff from the plot (FIXME: this should just read
            // a value from the series, otherwise it's impossible to
            // customize)
            if (minMargin == null) {
                minMargin = 0;
                for (i = 0; i < series.length; ++i)
                    minMargin = Math.max(minMargin, 2 * (series[i].points.radius + series[i].points.lineWidth/2));
            }

            var margins = {
                left: minMargin,
                right: minMargin,
                top: minMargin,
                bottom: minMargin
            };

            // check axis labels, note we don't check the actual
            // labels but instead use the overall width/height to not
            // jump as much around with replots
            $.each(allAxes(), function (_, axis) {
                if (axis.reserveSpace && axis.ticks && axis.ticks.length) {
                    if (axis.direction === "x") {
                        margins.left = Math.max(margins.left, axis.labelWidth / 2);
                        margins.right = Math.max(margins.right, axis.labelWidth / 2);
                    } else {
                        margins.bottom = Math.max(margins.bottom, axis.labelHeight / 2);
                        margins.top = Math.max(margins.top, axis.labelHeight / 2);
                    }
                }
            });

            plotOffset.left = Math.ceil(Math.max(margins.left, plotOffset.left));
            plotOffset.right = Math.ceil(Math.max(margins.right, plotOffset.right));
            plotOffset.top = Math.ceil(Math.max(margins.top, plotOffset.top));
            plotOffset.bottom = Math.ceil(Math.max(margins.bottom, plotOffset.bottom));
        }

        function setupGrid() {
            var i, axes = allAxes(), showGrid = options.grid.show;

            // Initialize the plot's offset from the edge of the canvas

            for (var a in plotOffset) {
                var margin = options.grid.margin || 0;
                plotOffset[a] = typeof margin == "number" ? margin : margin[a] || 0;
            }

            executeHooks(hooks.processOffset, [plotOffset]);

            // If the grid is visible, add its border width to the offset

            for (var a in plotOffset) {
                if(typeof(options.grid.borderWidth) == "object") {
                    plotOffset[a] += showGrid ? options.grid.borderWidth[a] : 0;
                }
                else {
                    plotOffset[a] += showGrid ? options.grid.borderWidth : 0;
                }
            }

            $.each(axes, function (_, axis) {
                var axisOpts = axis.options;
                axis.show = axisOpts.show == null ? axis.used : axisOpts.show;
                axis.reserveSpace = axisOpts.reserveSpace == null ? axis.show : axisOpts.reserveSpace;
                setRange(axis);
            });

            if (showGrid) {

                var allocatedAxes = $.grep(axes, function (axis) {
                    return axis.show || axis.reserveSpace;
                });

                $.each(allocatedAxes, function (_, axis) {
                    // make the ticks
                    setupTickGeneration(axis);
                    setTicks(axis);
                    snapRangeToTicks(axis, axis.ticks);
                    // find labelWidth/Height for axis
                    measureTickLabels(axis);
                });

                // with all dimensions calculated, we can compute the
                // axis bounding boxes, start from the outside
                // (reverse order)
                for (i = allocatedAxes.length - 1; i >= 0; --i)
                    allocateAxisBoxFirstPhase(allocatedAxes[i]);

                // make sure we've got enough space for things that
                // might stick out
                adjustLayoutForThingsStickingOut();

                $.each(allocatedAxes, function (_, axis) {
                    allocateAxisBoxSecondPhase(axis);
                });
            }

            plotWidth = surface.width - plotOffset.left - plotOffset.right;
            plotHeight = surface.height - plotOffset.bottom - plotOffset.top;

            // now we got the proper plot dimensions, we can compute the scaling
            $.each(axes, function (_, axis) {
                setTransformationHelpers(axis);
            });

            if (showGrid) {
                drawAxisLabels();
            }

            insertLegend();
        }

        function setRange(axis) {
            var opts = axis.options,
                min = +(opts.min != null ? opts.min : axis.datamin),
                max = +(opts.max != null ? opts.max : axis.datamax),
                delta = max - min;

            if (delta == 0.0) {
                // Grafana fix: wide Y min and max using increased wideFactor
                // when all series values are the same
                var wideFactor = 0.25;
                var widen = Math.abs(max == 0 ? 1 : max * wideFactor);

                if (opts.min == null) {
                  min -= widen;
                }
                // always widen max if we couldn't widen min to ensure we
                // don't fall into min == max which doesn't work
                if (opts.max == null || opts.min != null) {
                  max += widen;
                }
            }
            else {
                // consider autoscaling
                var margin = opts.autoscaleMargin;
                if (margin != null) {
                    if (opts.min == null) {
                        min -= delta * margin;
                        // make sure we don't go below zero if all values
                        // are positive
                        if (min < 0 && axis.datamin != null && axis.datamin >= 0)
                            min = 0;
                    }
                    if (opts.max == null) {
                        max += delta * margin;
                        if (max > 0 && axis.datamax != null && axis.datamax <= 0)
                            max = 0;
                    }
                }
            }
            axis.min = min;
            axis.max = max;
        }

        function setupTickGeneration(axis) {
            var opts = axis.options;

            // estimate number of ticks
            var noTicks;
            if (typeof opts.ticks == "number" && opts.ticks > 0)
                noTicks = opts.ticks;
            else
                // heuristic based on the model a*sqrt(x) fitted to
                // some data points that seemed reasonable
                noTicks = 0.3 * Math.sqrt(axis.direction == "x" ? surface.width : surface.height);

            var delta = (axis.max - axis.min) / noTicks,
                dec = -Math.floor(Math.log(delta) / Math.LN10),
                maxDec = opts.tickDecimals;

            if (maxDec != null && dec > maxDec) {
                dec = maxDec;
            }

            var magn = Math.pow(10, -dec),
                norm = delta / magn, // norm is between 1.0 and 10.0
                size;

            if (norm < 1.5) {
                size = 1;
            } else if (norm < 3) {
                size = 2;
                // special case for 2.5, requires an extra decimal
                if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
                    size = 2.5;
                    ++dec;
                }
            } else if (norm < 7.5) {
                size = 5;
            } else {
                size = 10;
            }

            size *= magn;

            if (opts.minTickSize != null && size < opts.minTickSize) {
                size = opts.minTickSize;
            }

            axis.delta = delta;
            axis.tickDecimals = Math.max(0, maxDec != null ? maxDec : dec);
            axis.tickSize = opts.tickSize || size;
            // grafana addition
            axis.scaledDecimals = axis.tickDecimals - Math.floor(Math.log(axis.tickSize) / Math.LN10);

            // Time mode was moved to a plug-in in 0.8, and since so many people use it
            // we'll add an especially friendly reminder to make sure they included it.

            if (opts.mode == "time" && !axis.tickGenerator) {
                throw new Error("Time mode requires the flot.time plugin.");
            }

            // Flot supports base-10 axes; any other mode else is handled by a plug-in,
            // like flot.time.js.

            if (!axis.tickGenerator) {

                axis.tickGenerator = function (axis) {

                    var ticks = [],
                        start = floorInBase(axis.min, axis.tickSize),
                        i = 0,
                        v = Number.NaN,
                        prev;

                    do {
                        prev = v;
                        v = start + i * axis.tickSize;
                        ticks.push(v);
                        ++i;
                    } while (v < axis.max && v != prev);
                    return ticks;
                };

				axis.tickFormatter = function (value, axis) {

					var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
					var formatted = "" + Math.round(value * factor) / factor;

					// If tickDecimals was specified, ensure that we have exactly that
					// much precision; otherwise default to the value's own precision.

					if (axis.tickDecimals != null) {
						var decimal = formatted.indexOf(".");
						var precision = decimal == -1 ? 0 : formatted.length - decimal - 1;
						if (precision < axis.tickDecimals) {
							return (precision ? formatted : formatted + ".") + ("" + factor).substr(1, axis.tickDecimals - precision);
						}
					}

                    return formatted;
                };
            }

            if ($.isFunction(opts.tickFormatter))
                axis.tickFormatter = function (v, axis) { return "" + opts.tickFormatter(v, axis); };

            if (opts.alignTicksWithAxis != null) {
                var otherAxis = (axis.direction == "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1];
                if (otherAxis && otherAxis.used && otherAxis != axis) {
                    // consider snapping min/max to outermost nice ticks
                    var niceTicks = axis.tickGenerator(axis);
                    if (niceTicks.length > 0) {
                        if (opts.min == null)
                            axis.min = Math.min(axis.min, niceTicks[0]);
                        if (opts.max == null && niceTicks.length > 1)
                            axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]);
                    }

                    axis.tickGenerator = function (axis) {
                        // copy ticks, scaled to this axis
                        var ticks = [], v, i;
                        for (i = 0; i < otherAxis.ticks.length; ++i) {
                            v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min);
                            v = axis.min + v * (axis.max - axis.min);
                            ticks.push(v);
                        }
                        return ticks;
                    };

                    // we might need an extra decimal since forced
                    // ticks don't necessarily fit naturally
                    if (!axis.mode && opts.tickDecimals == null) {
                        var extraDec = Math.max(0, -Math.floor(Math.log(axis.delta) / Math.LN10) + 1),
                            ts = axis.tickGenerator(axis);

                        // only proceed if the tick interval rounded
                        // with an extra decimal doesn't give us a
                        // zero at end
                        if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec))))
                            axis.tickDecimals = extraDec;
                    }
                }
            }
        }

        function setTicks(axis) {
            var oticks = axis.options.ticks, ticks = [];
            if (oticks == null || (typeof oticks == "number" && oticks > 0))
                ticks = axis.tickGenerator(axis);
            else if (oticks) {
                if ($.isFunction(oticks))
                    // generate the ticks
                    ticks = oticks(axis);
                else
                    ticks = oticks;
            }

            // clean up/labelify the supplied ticks, copy them over
            var i, v;
            axis.ticks = [];
            for (i = 0; i < ticks.length; ++i) {
                var label = null;
                var t = ticks[i];
                if (typeof t == "object") {
                    v = +t[0];
                    if (t.length > 1)
                        label = t[1];
                }
                else
                    v = +t;
                if (label == null)
                    label = axis.tickFormatter(v, axis);
                if (!isNaN(v))
                    axis.ticks.push({ v: v, label: label });
            }
        }

        function snapRangeToTicks(axis, ticks) {
            if (axis.options.autoscaleMargin && ticks.length > 0) {
                // snap to ticks
                if (axis.options.min == null)
                    axis.min = Math.min(axis.min, ticks[0].v);
                if (axis.options.max == null && ticks.length > 1)
                    axis.max = Math.max(axis.max, ticks[ticks.length - 1].v);
            }
        }

        function draw() {

            surface.clear();

            executeHooks(hooks.drawBackground, [ctx]);

            var grid = options.grid;

            // draw background, if any
            if (grid.show && grid.backgroundColor)
                drawBackground();

            if (grid.show && !grid.aboveData) {
                drawGrid();
            }

            for (var i = 0; i < series.length; ++i) {
                executeHooks(hooks.drawSeries, [ctx, series[i]]);
                drawSeries(series[i]);
            }

            executeHooks(hooks.draw, [ctx]);

            if (grid.show && grid.aboveData) {
                drawGrid();
            }

            surface.render();

            // A draw implies that either the axes or data have changed, so we
            // should probably update the overlay highlights as well.

            triggerRedrawOverlay();
        }

        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = allAxes();

            for (var i = 0; i < axes.length; ++i) {
                axis = axes[i];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? xaxes[0] : yaxes[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function drawBackground() {
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)");
            ctx.fillRect(0, 0, plotWidth, plotHeight);
            ctx.restore();
        }

        function drawGrid() {
            var i, axes, bw, bc;

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // draw markings
            var markings = options.grid.markings;
            if (markings) {
                if ($.isFunction(markings)) {
                    axes = plot.getAxes();
                    // xmin etc. is backwards compatibility, to be
                    // removed in the future
                    axes.xmin = axes.xaxis.min;
                    axes.xmax = axes.xaxis.max;
                    axes.ymin = axes.yaxis.min;
                    axes.ymax = axes.yaxis.max;

                    markings = markings(axes);
                }

                for (i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");

                    // fill in missing
                    if (xrange.from == null)
                        xrange.from = xrange.axis.min;
                    if (xrange.to == null)
                        xrange.to = xrange.axis.max;
                    if (yrange.from == null)
                        yrange.from = yrange.axis.min;
                    if (yrange.to == null)
                        yrange.to = yrange.axis.max;

                    // clip
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max ||
                        yrange.to < yrange.axis.min || yrange.from > yrange.axis.max)
                        continue;

                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);

                    var xequal = xrange.from === xrange.to,
                        yequal = yrange.from === yrange.to;

                    if (xequal && yequal) {
                        continue;
                    }

                    // then draw
                    xrange.from = Math.floor(xrange.axis.p2c(xrange.from));
                    xrange.to = Math.floor(xrange.axis.p2c(xrange.to));
                    yrange.from = Math.floor(yrange.axis.p2c(yrange.from));
                    yrange.to = Math.floor(yrange.axis.p2c(yrange.to));

                    if (xequal || yequal) {
                        var lineWidth = m.lineWidth || options.grid.markingsLineWidth,
                            subPixel = lineWidth % 2 ? 0.5 : 0;
                        ctx.beginPath();
                        ctx.strokeStyle = m.color || options.grid.markingsColor;
                        ctx.lineWidth = lineWidth;
                        if (xequal) {
                            ctx.moveTo(xrange.to + subPixel, yrange.from);
                            ctx.lineTo(xrange.to + subPixel, yrange.to);
                        } else {
                            ctx.moveTo(xrange.from, yrange.to + subPixel);
                            ctx.lineTo(xrange.to, yrange.to + subPixel);
                        }
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = m.color || options.grid.markingsColor;
                        ctx.fillRect(xrange.from, yrange.to,
                                     xrange.to - xrange.from,
                                     yrange.from - yrange.to);
                    }
                }
            }

            // draw the ticks
            axes = allAxes();
            bw = options.grid.borderWidth;

            for (var j = 0; j < axes.length; ++j) {
                var axis = axes[j], box = axis.box,
                    t = axis.tickLength, x, y, xoff, yoff;
                if (!axis.show || axis.ticks.length == 0)
                    continue;

                ctx.lineWidth = 1;

                // find the edges
                if (axis.direction == "x") {
                    x = 0;
                    if (t == "full")
                        y = (axis.position == "top" ? 0 : plotHeight);
                    else
                        y = box.top - plotOffset.top + (axis.position == "top" ? box.height : 0);
                }
                else {
                    y = 0;
                    if (t == "full")
                        x = (axis.position == "left" ? 0 : plotWidth);
                    else
                        x = box.left - plotOffset.left + (axis.position == "left" ? box.width : 0);
                }

                // draw tick bar
                if (!axis.innermost) {
                    ctx.strokeStyle = axis.options.color;
                    ctx.beginPath();
                    xoff = yoff = 0;
                    if (axis.direction == "x")
                        xoff = plotWidth + 1;
                    else
                        yoff = plotHeight + 1;

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x") {
                            y = Math.floor(y) + 0.5;
                        } else {
                            x = Math.floor(x) + 0.5;
                        }
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                    ctx.stroke();
                }

                // draw ticks

                ctx.strokeStyle = axis.options.tickColor;

                ctx.beginPath();
                for (i = 0; i < axis.ticks.length; ++i) {
                    var v = axis.ticks[i].v;

                    xoff = yoff = 0;

                    if (isNaN(v) || v < axis.min || v > axis.max
                        // skip those lying on the axes if we got a border
                        || (t == "full"
                            && ((typeof bw == "object" && bw[axis.position] > 0) || bw > 0)
                            && (v == axis.min || v == axis.max)))
                        continue;

                    if (axis.direction == "x") {
                        x = axis.p2c(v);
                        yoff = t == "full" ? -plotHeight : t;

                        if (axis.position == "top")
                            yoff = -yoff;
                    }
                    else {
                        y = axis.p2c(v);
                        xoff = t == "full" ? -plotWidth : t;

                        if (axis.position == "left")
                            xoff = -xoff;
                    }

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x")
                            x = Math.floor(x) + 0.5;
                        else
                            y = Math.floor(y) + 0.5;
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                }

                ctx.stroke();
            }


            // draw border
            if (bw) {
                // If either borderWidth or borderColor is an object, then draw the border
                // line by line instead of as one rectangle
                bc = options.grid.borderColor;
                if(typeof bw == "object" || typeof bc == "object") {
                    if (typeof bw !== "object") {
                        bw = {top: bw, right: bw, bottom: bw, left: bw};
                    }
                    if (typeof bc !== "object") {
                        bc = {top: bc, right: bc, bottom: bc, left: bc};
                    }

                    if (bw.top > 0) {
                        ctx.strokeStyle = bc.top;
                        ctx.lineWidth = bw.top;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left, 0 - bw.top/2);
                        ctx.lineTo(plotWidth, 0 - bw.top/2);
                        ctx.stroke();
                    }

                    if (bw.right > 0) {
                        ctx.strokeStyle = bc.right;
                        ctx.lineWidth = bw.right;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right / 2, 0 - bw.top);
                        ctx.lineTo(plotWidth + bw.right / 2, plotHeight);
                        ctx.stroke();
                    }

                    if (bw.bottom > 0) {
                        ctx.strokeStyle = bc.bottom;
                        ctx.lineWidth = bw.bottom;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right, plotHeight + bw.bottom / 2);
                        ctx.lineTo(0, plotHeight + bw.bottom / 2);
                        ctx.stroke();
                    }

                    if (bw.left > 0) {
                        ctx.strokeStyle = bc.left;
                        ctx.lineWidth = bw.left;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left/2, plotHeight + bw.bottom);
                        ctx.lineTo(0- bw.left/2, 0);
                        ctx.stroke();
                    }
                }
                else {
                    ctx.lineWidth = bw;
                    ctx.strokeStyle = options.grid.borderColor;
                    ctx.strokeRect(-bw/2, -bw/2, plotWidth + bw, plotHeight + bw);
                }
            }

            ctx.restore();
        }

        function drawAxisLabels() {

            $.each(allAxes(), function (_, axis) {
                var box = axis.box,
                    legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                    layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                    font = axis.options.font || "flot-tick-label tickLabel",
                    tick, x, y, halign, valign;

                // Remove text before checking for axis.show and ticks.length;
                // otherwise plugins, like flot-tickrotor, that draw their own
                // tick labels will end up with both theirs and the defaults.

                surface.removeText(layer);

                if (!axis.show || axis.ticks.length == 0)
                    return;

                for (var i = 0; i < axis.ticks.length; ++i) {

                    tick = axis.ticks[i];
                    if (!tick.label || tick.v < axis.min || tick.v > axis.max)
                        continue;

                    if (axis.direction == "x") {
                        halign = "center";
                        x = plotOffset.left + axis.p2c(tick.v);
                        if (axis.position == "bottom") {
                            y = box.top + box.padding + box.eventSectionPadding;
                        } else {
                            y = box.top + box.height - box.padding;
                            valign = "bottom";
                        }
                    } else {
                        valign = "middle";
                        y = plotOffset.top + axis.p2c(tick.v);
                        if (axis.position == "left") {
                            x = box.left + box.width - box.padding;
                            halign = "right";
                        } else {
                            x = box.left + box.padding;
                        }
                    }

                    surface.addText(layer, x, y, tick.label, font, null, null, halign, valign);
                }
            });
        }

        function drawSeries(series) {
            if (series.lines.show)
                drawSeriesLines(series);
            if (series.bars.show)
                drawSeriesBars(series);
            if (series.points.show)
                drawSeriesPoints(series);
        }

        function drawSeriesLines(series) {
            function plotLine(datapoints, xoffset, yoffset, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    prevx = null, prevy = null;

                ctx.beginPath();
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps], y1 = points[i - ps + 1],
                        x2 = points[i], y2 = points[i + 1];

                    if (x1 == null || x2 == null)
                        continue;

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min) {
                        if (y2 < axisy.min)
                            continue;   // line segment is outside
                        // compute new intersection point
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min) {
                        if (y1 < axisy.min)
                            continue;
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max) {
                        if (y2 > axisy.max)
                            continue;
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max) {
                        if (y1 > axisy.max)
                            continue;
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (x1 != prevx || y1 != prevy)
                        ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);

                    prevx = x2;
                    prevy = y2;
                    ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset);
                }
                ctx.stroke();
            }

            function plotLineArea(datapoints, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    bottom = Math.min(Math.max(0, axisy.min), axisy.max),
                    i = 0, top, areaOpen = false,
                    ypos = 1, segmentStart = 0, segmentEnd = 0;

                // we process each segment in two turns, first forward
                // direction to sketch out top, then once we hit the
                // end we go backwards to sketch the bottom
                while (true) {
                    if (ps > 0 && i > points.length + ps)
                        break;

                    i += ps; // ps is negative if going backwards

                    var x1 = points[i - ps],
                        y1 = points[i - ps + ypos],
                        x2 = points[i], y2 = points[i + ypos];

                    if (areaOpen) {
                        if (ps > 0 && x1 != null && x2 == null) {
                            // at turning point
                            segmentEnd = i;
                            ps = -ps;
                            ypos = 2;
                            continue;
                        }

                        if (ps < 0 && i == segmentStart + ps) {
                            // done with the reverse sweep
                            ctx.fill();
                            areaOpen = false;
                            ps = -ps;
                            ypos = 1;
                            i = segmentStart = segmentEnd + ps;
                            continue;
                        }
                    }

                    if (x1 == null || x2 == null)
                        continue;

                    // clip x values

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (!areaOpen) {
                        // open area
                        ctx.beginPath();
                        ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom));
                        areaOpen = true;
                    }

                    // now first check the case where both is outside
                    if (y1 >= axisy.max && y2 >= axisy.max) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max));
                        continue;
                    }
                    else if (y1 <= axisy.min && y2 <= axisy.min) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min));
                        continue;
                    }

                    // else it's a bit more complicated, there might
                    // be a flat maxed out rectangle first, then a
                    // triangular cutout or reverse; to find these
                    // keep track of the current x values
                    var x1old = x1, x2old = x2;

                    // clip the y values, without shortcutting, we
                    // go through all cases in turn

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) {
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) {
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) {
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) {
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // if the x value was changed we got a rectangle
                    // to fill
                    if (x1 != x1old) {
                        ctx.lineTo(axisx.p2c(x1old), axisy.p2c(y1));
                        // it goes to (x1, y1), but we fill that below
                    }

                    // fill triangular section, this sometimes result
                    // in redundant points if (x1, y1) hasn't changed
                    // from previous line to, but we just ignore that
                    ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1));
                    ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));

                    // fill the other rectangle if it's there
                    if (x2 != x2old) {
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));
                        ctx.lineTo(axisx.p2c(x2old), axisy.p2c(y2));
                    }
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineJoin = "round";

            var lw = series.lines.lineWidth,
                sw = series.shadowSize;
            // FIXME: consider another form of shadow when filling is turned on
            if (lw > 0 && sw > 0) {
                // draw shadow as a thick and thin line with transparency
                ctx.lineWidth = sw;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                // position shadow at angle from the mid of line
                var angle = Math.PI/18;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/2), Math.cos(angle) * (lw/2 + sw/2), series.xaxis, series.yaxis);
                ctx.lineWidth = sw/2;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/4), Math.cos(angle) * (lw/2 + sw/4), series.xaxis, series.yaxis);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight);
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                plotLineArea(series.datapoints, series.xaxis, series.yaxis);
            }

            if (lw > 0)
                plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawSeriesPoints(series) {
            function plotPoints(datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    var x = points[i], y = points[i + 1];
                    if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                        continue;

                    ctx.beginPath();
                    x = axisx.p2c(x);
                    y = axisy.p2c(y) + offset;
                    if (symbol == "circle")
                        ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                    else
                        symbol(ctx, x, y, radius, shadow);
                    ctx.closePath();

                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            var lw = series.points.lineWidth,
                sw = series.shadowSize,
                radius = series.points.radius,
                symbol = series.points.symbol;

            // If the user sets the line width to 0, we change it to a very
            // small value. A line width of 0 seems to force the default of 1.
            // Doing the conditional here allows the shadow setting to still be
            // optional even with a lineWidth of 0.

            if( lw == 0 )
                lw = 0.0001;

            if (lw > 0 && sw > 0) {
                // draw shadow in two steps
                var w = sw / 2;
                ctx.lineWidth = w;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                plotPoints(series.datapoints, radius, null, w + w/2, true,
                           series.xaxis, series.yaxis, symbol);

                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                plotPoints(series.datapoints, radius, null, w/2, true,
                           series.xaxis, series.yaxis, symbol);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            plotPoints(series.datapoints, radius,
                       getFillStyle(series.points, series.color), 0, false,
                       series.xaxis, series.yaxis, symbol);
            ctx.restore();
        }

        function drawBar(x, y, b, barLeft, barRight, fillStyleCallback, axisx, axisy, c, horizontal, lineWidth) {
            var left, right, bottom, top,
                drawLeft, drawRight, drawTop, drawBottom,
                tmp;

            // in horizontal mode, we start the bar from the left
            // instead of from the bottom so it appears to be
            // horizontal rather than vertical
            if (horizontal) {
                drawBottom = drawRight = drawTop = true;
                drawLeft = false;
                left = b;
                right = x;
                top = y + barLeft;
                bottom = y + barRight;

                // account for negative bars
                if (right < left) {
                    tmp = right;
                    right = left;
                    left = tmp;
                    drawLeft = true;
                    drawRight = false;
                }
            }
            else {
                drawLeft = drawRight = drawTop = true;
                drawBottom = false;
                left = x + barLeft;
                right = x + barRight;
                bottom = b;
                top = y;

                // account for negative bars
                if (top < bottom) {
                    tmp = top;
                    top = bottom;
                    bottom = tmp;
                    drawBottom = true;
                    drawTop = false;
                }
            }

            // clip
            if (right < axisx.min || left > axisx.max ||
                top < axisy.min || bottom > axisy.max)
                return;

            if (left < axisx.min) {
                left = axisx.min;
                drawLeft = false;
            }

            if (right > axisx.max) {
                right = axisx.max;
                drawRight = false;
            }

            if (bottom < axisy.min) {
                bottom = axisy.min;
                drawBottom = false;
            }

            if (top > axisy.max) {
                top = axisy.max;
                drawTop = false;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);

            // fill the bar
            if (fillStyleCallback) {
                c.fillStyle = fillStyleCallback(bottom, top);
                c.fillRect(left, top, right - left, bottom - top)
            }

            // draw outline
            if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) {
                c.beginPath();

                // FIXME: inline moveTo is buggy with excanvas
                c.moveTo(left, bottom);
                if (drawLeft)
                    c.lineTo(left, top);
                else
                    c.moveTo(left, top);
                if (drawTop)
                    c.lineTo(right, top);
                else
                    c.moveTo(right, top);
                if (drawRight)
                    c.lineTo(right, bottom);
                else
                    c.moveTo(right, bottom);
                if (drawBottom)
                    c.lineTo(left, bottom);
                else
                    c.moveTo(left, bottom);
                c.stroke();
            }
        }

        function drawSeriesBars(series) {
            function plotBars(datapoints, barLeft, barRight, fillStyleCallback, axisx, axisy) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, series.bars.lineWidth);
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // FIXME: figure out a way to add shadows (for instance along the right edge)
            ctx.lineWidth = series.bars.lineWidth;
            ctx.strokeStyle = series.color;

            var barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                default:
                    barLeft = -series.bars.barWidth / 2;
            }

            var fillStyleCallback = series.bars.fill ? function (bottom, top) { return getFillStyle(series.bars, series.color, bottom, top); } : null;
            plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, fillStyleCallback, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function getFillStyle(filloptions, seriesColor, bottom, top) {
            var fill = filloptions.fill;
            if (!fill)
                return null;

            if (filloptions.fillColor)
                return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor);

            var c = $.color.parse(seriesColor);
            c.a = typeof fill == "number" ? fill : 0.4;
            c.normalize();
            return c.toString();
        }

        function insertLegend() {

            if (options.legend.container != null) {
                $(options.legend.container).html("");
            } else {
                placeholder.find(".legend").remove();
            }

            if (!options.legend.show) {
                return;
            }

            var fragments = [], entries = [], rowStarted = false,
                lf = options.legend.labelFormatter, s, label;

            // Build a list of legend entries, with each having a label and a color

            for (var i = 0; i < series.length; ++i) {
                s = series[i];
                if (s.label) {
                    label = lf ? lf(s.label, s) : s.label;
                    if (label) {
                        entries.push({
                            label: label,
                            color: s.color
                        });
                    }
                }
            }

            // Sort the legend using either the default or a custom comparator

            if (options.legend.sorted) {
                if ($.isFunction(options.legend.sorted)) {
                    entries.sort(options.legend.sorted);
                } else if (options.legend.sorted == "reverse") {
                	entries.reverse();
                } else {
                    var ascending = options.legend.sorted != "descending";
                    entries.sort(function(a, b) {
                        return a.label == b.label ? 0 : (
                            (a.label < b.label) != ascending ? 1 : -1   // Logical XOR
                        );
                    });
                }
            }

            // Generate markup for the list of entries, in their final order

            for (var i = 0; i < entries.length; ++i) {

                var entry = entries[i];

                if (i % options.legend.noColumns == 0) {
                    if (rowStarted)
                        fragments.push('</tr>');
                    fragments.push('<tr>');
                    rowStarted = true;
                }

                fragments.push(
                    '<td class="legendColorBox"><div style="border:1px solid ' + options.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + entry.color + ';overflow:hidden"></div></div></td>' +
                    '<td class="legendLabel">' + entry.label + '</td>'
                );
            }

            if (rowStarted)
                fragments.push('</tr>');

            if (fragments.length == 0)
                return;

            var table = '<table style="font-size:smaller;color:' + options.grid.color + '">' + fragments.join("") + '</table>';
            if (options.legend.container != null)
                $(options.legend.container).html(table);
            else {
                var pos = "",
                    p = options.legend.position,
                    m = options.legend.margin;
                if (m[0] == null)
                    m = [m, m];
                if (p.charAt(0) == "n")
                    pos += 'top:' + (m[1] + plotOffset.top) + 'px;';
                else if (p.charAt(0) == "s")
                    pos += 'bottom:' + (m[1] + plotOffset.bottom) + 'px;';
                if (p.charAt(1) == "e")
                    pos += 'right:' + (m[0] + plotOffset.right) + 'px;';
                else if (p.charAt(1) == "w")
                    pos += 'left:' + (m[0] + plotOffset.left) + 'px;';
                var legend = $('<div class="legend">' + table.replace('style="', 'style="position:absolute;' + pos +';') + '</div>').appendTo(placeholder);
                if (options.legend.backgroundOpacity != 0.0) {
                    // put in the transparent background
                    // separately to avoid blended labels and
                    // label boxes
                    var c = options.legend.backgroundColor;
                    if (c == null) {
                        c = options.grid.backgroundColor;
                        if (c && typeof c == "string")
                            c = $.color.parse(c);
                        else
                            c = $.color.extract(legend, 'background-color');
                        c.a = 1;
                        c = c.toString();
                    }
                    var div = legend.children();
                    $('<div style="position:absolute;width:' + div.width() + 'px;height:' + div.height() + 'px;' + pos +'background-color:' + c + ';"> </div>').prependTo(legend).css('opacity', options.legend.backgroundOpacity);
                }
            }
        }


        // interactive features

        var highlights = [],
            redrawTimeout = null;

        // returns the data item the mouse is over, or null if none is found
        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var maxDistance = options.grid.mouseActiveRadius,
                smallestDistance = maxDistance * maxDistance + 1,
                item = null, foundPoint = false, i, j, ps;

            for (i = series.length - 1; i >= 0; --i) {
                if (!seriesFilter(series[i]))
                    continue;

                var s = series[i],
                    axisx = s.xaxis,
                    axisy = s.yaxis,
                    points = s.datapoints.points,
                    mx = axisx.c2p(mouseX), // precompute some stuff to make the loop faster
                    my = axisy.c2p(mouseY),
                    maxx = maxDistance / axisx.scale,
                    maxy = maxDistance / axisy.scale;

                ps = s.datapoints.pointsize;
                // with inverse transforms, we can't use the maxx/maxy
                // optimization, sadly
                if (axisx.options.inverseTransform)
                    maxx = Number.MAX_VALUE;
                if (axisy.options.inverseTransform)
                    maxy = Number.MAX_VALUE;

                if (s.lines.show || s.points.show) {
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1];
                        if (x == null)
                            continue;

                        // For points and lines, the cursor must be within a
                        // certain distance to the data point
                        if (x - mx > maxx || x - mx < -maxx ||
                            y - my > maxy || y - my < -maxy)
                            continue;

                        // We have to calculate distances in pixels, not in
                        // data units, because the scales of the axes may be different
                        var dx = Math.abs(axisx.p2c(x) - mouseX),
                            dy = Math.abs(axisy.p2c(y) - mouseY),
                            dist = dx * dx + dy * dy; // we save the sqrt

                        // use <= to ensure last point takes precedence
                        // (last generally means on top of)
                        if (dist < smallestDistance) {
                            smallestDistance = dist;
                            item = [i, j / ps];
                        }
                    }
                }

                if (s.bars.show && !item) { // no other point can be nearby

                    var barLeft, barRight;

                    switch (s.bars.align) {
                        case "left":
                            barLeft = 0;
                            break;
                        case "right":
                            barLeft = -s.bars.barWidth;
                            break;
                        default:
                            barLeft = -s.bars.barWidth / 2;
                    }

                    barRight = barLeft + s.bars.barWidth;

                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1], b = points[j + 2];
                        if (x == null)
                            continue;

                        // for a bar graph, the cursor must be inside the bar
                        if (series[i].bars.horizontal ?
                            (mx <= Math.max(b, x) && mx >= Math.min(b, x) &&
                             my >= y + barLeft && my <= y + barRight) :
                            (mx >= x + barLeft && mx <= x + barRight &&
                             my >= Math.min(b, y) && my <= Math.max(b, y)))
                                item = [i, j / ps];
                    }
                }
            }

            if (item) {
                i = item[0];
                j = item[1];
                ps = series[i].datapoints.pointsize;

                return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                         dataIndex: j,
                         series: series[i],
                         seriesIndex: i };
            }

            return null;
        }

        function onMouseMove(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return s["hoverable"] != false; });
        }

        function onMouseLeave(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return false; });
        }

        function onClick(e) {
          if (plot.isSelecting) {
            return;
          }

          triggerClickHoverEvent("plotclick", e, function (s) { return s["clickable"] != false; });
        }

        // trigger click or hover event (they send the same parameters
        // so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter) {
            var offset = eventHolder.offset(),
                canvasX = event.pageX - offset.left - plotOffset.left,
                canvasY = event.pageY - offset.top - plotOffset.top,
            pos = canvasToAxisCoords({ left: canvasX, top: canvasY });

            pos.pageX = event.pageX;
            pos.pageY = event.pageY;

            // Add ctrlKey and metaKey to event
            pos.ctrlKey = event.ctrlKey;
            pos.metaKey = event.metaKey;

            var item = findNearbyItem(canvasX, canvasY, seriesFilter);

            if (item) {
                // fill in mouse pos for any listeners out there
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left, 10);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top, 10);
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname &&
                        !(item && h.series == item.series &&
                          h.point[0] == item.datapoint[0] &&
                          h.point[1] == item.datapoint[1]))
                        unhighlight(h.series, h.point);
                }

                if (item)
                    highlight(item.series, item.datapoint, eventname);
            }

            placeholder.trigger(eventname, [ pos, item ]);
        }

        function triggerRedrawOverlay() {
            var t = options.interaction.redrawOverlayInterval;
            if (t == -1) {      // skip event queue
                drawOverlay();
                return;
            }

            if (!redrawTimeout)
                redrawTimeout = setTimeout(drawOverlay, t);
        }

        function drawOverlay() {
            redrawTimeout = null;

            // draw highlights
            octx.save();
            overlay.clear();
            octx.translate(plotOffset.left, plotOffset.top);

            var i, hi;
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];

                if (hi.series.bars.show)
                    drawBarHighlight(hi.series, hi.point);
                else
                    drawPointHighlight(hi.series, hi.point);
            }
            octx.restore();

            executeHooks(hooks.drawOverlay, [octx]);
        }

        function highlight(s, point, auto) {
            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i == -1) {
                highlights.push({ series: s, point: point, auto: auto });

                triggerRedrawOverlay();
            }
            else if (!auto)
                highlights[i].auto = false;
        }

        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                triggerRedrawOverlay();
                return;
            }

            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i != -1) {
                highlights.splice(i, 1);

                triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s && h.point[0] == p[0]
                    && h.point[1] == p[1])
                    return i;
            }
            return -1;
        }

        function drawPointHighlight(series, point) {
            var x = point[0], y = point[1],
                axisx = series.xaxis, axisy = series.yaxis,
                highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString();

            if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                return;

            var pointRadius = series.points.radius + series.points.lineWidth / 2;
            octx.lineWidth = pointRadius;
            octx.strokeStyle = highlightColor;
            var radius = 1.5 * pointRadius;
            x = axisx.p2c(x);
            y = axisy.p2c(y);

            octx.beginPath();
            if (series.points.symbol == "circle")
                octx.arc(x, y, radius, 0, 2 * Math.PI, false);
            else
                series.points.symbol(octx, x, y, radius, false);
            octx.closePath();
            octx.stroke();
        }

        function drawBarHighlight(series, point) {
            var highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString(),
                fillStyle = highlightColor,
                barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                default:
                    barLeft = -series.bars.barWidth / 2;
            }

            octx.lineWidth = series.bars.lineWidth;
            octx.strokeStyle = highlightColor;

            drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth,
                    function () { return fillStyle; }, series.xaxis, series.yaxis, octx, series.bars.horizontal, series.bars.lineWidth);
        }

        function getColorOrGradient(spec, bottom, top, defaultColor) {
            if (typeof spec == "string")
                return spec;
            else {
                // assume this is a gradient spec; IE currently only
                // supports a simple vertical gradient properly, so that's
                // what we support too
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);

                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c != "string") {
                        var co = $.color.parse(defaultColor);
                        if (c.brightness != null)
                            co = co.scale('rgb', c.brightness);
                        if (c.opacity != null)
                            co.a *= c.opacity;
                        c = co.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }

                return gradient;
            }
        }
    }

    // Add the plot function to the top level of the jQuery object

    $.plot = function(placeholder, data, options) {
        //var t0 = new Date();
        var plot = new Plot($(placeholder), data, options, $.plot.plugins);
        //(window.console ? console.log : alert)("time used (msecs): " + ((new Date()).getTime() - t0.getTime()));
        return plot;
    };

    $.plot.version = "0.8.3";

    $.plot.plugins = [];

    // Also add the plot function as a chainable property

    $.fn.plot = function(data, options) {
        return this.each(function() {
            $.plot(this, data, options);
        });
    };

    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

})(jQuery);


/***/ }),

/***/ "./vendor/flot/jquery.flot.selection.js":
/*!**********************************************!*\
  !*** ./vendor/flot/jquery.flot.selection.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Flot plugin for selecting regions of a plot.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin supports these options:

selection: {
	mode: null or "x" or "y" or "xy",
	color: color,
	shape: "round" or "miter" or "bevel",
	minSize: number of pixels
}

Selection support is enabled by setting the mode to one of "x", "y" or "xy".
In "x" mode, the user will only be able to specify the x range, similarly for
"y" mode. For "xy", the selection becomes a rectangle where both ranges can be
specified. "color" is color of the selection (if you need to change the color
later on, you can get to it with plot.getOptions().selection.color). "shape"
is the shape of the corners of the selection.

"minSize" is the minimum size a selection can be in pixels. This value can
be customized to determine the smallest size a selection can be and still
have the selection rectangle be displayed. When customizing this value, the
fact that it refers to pixels, not axis units must be taken into account.
Thus, for example, if there is a bar graph in time mode with BarWidth set to 1
minute, setting "minSize" to 1 will not make the minimum selection size 1
minute, but rather 1 pixel. Note also that setting "minSize" to 0 will prevent
"plotunselected" events from being fired when the user clicks the mouse without
dragging.

When selection support is enabled, a "plotselected" event will be emitted on
the DOM element you passed into the plot function. The event handler gets a
parameter with the ranges selected on the axes, like this:

	placeholder.bind( "plotselected", function( event, ranges ) {
		alert("You selected " + ranges.xaxis.from + " to " + ranges.xaxis.to)
		// similar for yaxis - with multiple axes, the extra ones are in
		// x2axis, x3axis, ...
	});

The "plotselected" event is only fired when the user has finished making the
selection. A "plotselecting" event is fired during the process with the same
parameters as the "plotselected" event, in case you want to know what's
happening while it's happening,

A "plotunselected" event with no arguments is emitted when the user clicks the
mouse to remove the selection. As stated above, setting "minSize" to 0 will
destroy this behavior.

The plugin allso adds the following methods to the plot object:

- setSelection( ranges, preventEvent )

  Set the selection rectangle. The passed in ranges is on the same form as
  returned in the "plotselected" event. If the selection mode is "x", you
  should put in either an xaxis range, if the mode is "y" you need to put in
  an yaxis range and both xaxis and yaxis if the selection mode is "xy", like
  this:

	setSelection({ xaxis: { from: 0, to: 10 }, yaxis: { from: 40, to: 60 } });

  setSelection will trigger the "plotselected" event when called. If you don't
  want that to happen, e.g. if you're inside a "plotselected" handler, pass
  true as the second parameter. If you are using multiple axes, you can
  specify the ranges on any of those, e.g. as x2axis/x3axis/... instead of
  xaxis, the plugin picks the first one it sees.

- clearSelection( preventEvent )

  Clear the selection rectangle. Pass in true to avoid getting a
  "plotunselected" event.

- getSelection()

  Returns the current selection in the same format as the "plotselected"
  event. If there's currently no selection, the function returns null.

*/

(function ($) {
    function init(plot) {
        var selection = {
                first: { x: -1, y: -1}, second: { x: -1, y: -1},
                show: false,
                active: false
            };

        // FIXME: The drag handling implemented here should be
        // abstracted out, there's some similar code from a library in
        // the navigation plugin, this should be massaged a bit to fit
        // the Flot cases here better and reused. Doing this would
        // make this plugin much slimmer.
        var savedhandlers = {};

        var mouseUpHandler = null;

        function onMouseMove(e) {
            if (selection.active) {
                updateSelection(e);

                plot.getPlaceholder().trigger("plotselecting", [ getSelection() ]);
            }
        }

        function onMouseDown(e) {
            if (e.which != 1)  // only accept left-click
                return;

            // cancel out any text selections
            document.body.focus();

            // prevent text selection and drag in old-school browsers
            if (document.onselectstart !== undefined && savedhandlers.onselectstart == null) {
                savedhandlers.onselectstart = document.onselectstart;
                document.onselectstart = function () { return false; };
            }
            if (document.ondrag !== undefined && savedhandlers.ondrag == null) {
                savedhandlers.ondrag = document.ondrag;
                document.ondrag = function () { return false; };
            }

            setSelectionPos(selection.first, e);

            selection.active = true;

            // this is a bit silly, but we have to use a closure to be
            // able to whack the same handler again
            mouseUpHandler = function (e) { onMouseUp(e); };

            $(document).one("mouseup", mouseUpHandler);
        }

        function onMouseUp(e) {
            mouseUpHandler = null;

            // revert drag stuff for old-school browsers
            if (document.onselectstart !== undefined)
                document.onselectstart = savedhandlers.onselectstart;
            if (document.ondrag !== undefined)
                document.ondrag = savedhandlers.ondrag;

            // no more dragging
            selection.active = false;
            updateSelection(e);

            if (selectionIsSane())
                triggerSelectedEvent(e);
            else {
                // this counts as a clear
                plot.getPlaceholder().trigger("plotunselected", [ ]);
                plot.getPlaceholder().trigger("plotselecting", [ null ]);
            }

            setTimeout(function() {
              plot.isSelecting = false;
            }, 10);

            return false;
        }

        function getSelection() {
            if (!selectionIsSane())
                return null;

            if (!selection.show) return null;

            var r = {}, c1 = selection.first, c2 = selection.second;
            var axes = plot.getAxes();
            // look if no axis is used
            var noAxisInUse = true;
            $.each(axes, function (name, axis) {
              if (axis.used) {
                anyUsed = false;
              }
            })

            $.each(axes, function (name, axis) {
                if (axis.used || noAxisInUse) {
                    var p1 = axis.c2p(c1[axis.direction]), p2 = axis.c2p(c2[axis.direction]);
                    r[name] = { from: Math.min(p1, p2), to: Math.max(p1, p2) };
                }
            });
            return r;
        }

        function triggerSelectedEvent(event) {
            var r = getSelection();

            // Add ctrlKey and metaKey to event
            r.ctrlKey = event.ctrlKey;
            r.metaKey = event.metaKey;

            plot.getPlaceholder().trigger("plotselected", [ r ]);

            // backwards-compat stuff, to be removed in future
            if (r.xaxis && r.yaxis)
                plot.getPlaceholder().trigger("selected", [ { x1: r.xaxis.from, y1: r.yaxis.from, x2: r.xaxis.to, y2: r.yaxis.to } ]);
        }

        function clamp(min, value, max) {
            return value < min ? min: (value > max ? max: value);
        }

        function setSelectionPos(pos, e) {
            var o = plot.getOptions();
            var offset = plot.getPlaceholder().offset();
            var plotOffset = plot.getPlotOffset();
            pos.x = clamp(0, e.pageX - offset.left - plotOffset.left, plot.width());
            pos.y = clamp(0, e.pageY - offset.top - plotOffset.top, plot.height());

            if (o.selection.mode == "y")
                pos.x = pos == selection.first ? 0 : plot.width();

            if (o.selection.mode == "x")
                pos.y = pos == selection.first ? 0 : plot.height();
        }

        function updateSelection(pos) {
            if (pos.pageX == null)
                return;

            setSelectionPos(selection.second, pos);
            if (selectionIsSane()) {
                plot.isSelecting = true;
                selection.show = true;
                plot.triggerRedrawOverlay();
            }
            else
                clearSelection(true);
        }

        function clearSelection(preventEvent) {
            if (selection.show) {
                selection.show = false;
                plot.triggerRedrawOverlay();
                if (!preventEvent)
                    plot.getPlaceholder().trigger("plotunselected", [ ]);
            }
        }

        // function taken from markings support in Flot
        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = plot.getAxes();

            for (var k in axes) {
                axis = axes[k];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? plot.getXAxes()[0] : plot.getYAxes()[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function setSelection(ranges, preventEvent) {
            var axis, range, o = plot.getOptions();

            if (o.selection.mode == "y") {
                selection.first.x = 0;
                selection.second.x = plot.width();
            }
            else {
                range = extractRange(ranges, "x");

                selection.first.x = range.axis.p2c(range.from);
                selection.second.x = range.axis.p2c(range.to);
            }

            if (o.selection.mode == "x") {
                selection.first.y = 0;
                selection.second.y = plot.height();
            }
            else {
                range = extractRange(ranges, "y");

                selection.first.y = range.axis.p2c(range.from);
                selection.second.y = range.axis.p2c(range.to);
            }

            selection.show = true;
            plot.triggerRedrawOverlay();
            if (!preventEvent && selectionIsSane())
                triggerSelectedEvent();
        }

        function selectionIsSane() {
            var minSize = plot.getOptions().selection.minSize;
            return Math.abs(selection.second.x - selection.first.x) >= minSize &&
                Math.abs(selection.second.y - selection.first.y) >= minSize;
        }

        plot.clearSelection = clearSelection;
        plot.setSelection = setSelection;
        plot.getSelection = getSelection;

        plot.hooks.bindEvents.push(function(plot, eventHolder) {
            var o = plot.getOptions();
            if (o.selection.mode != null) {
                eventHolder.mousemove(onMouseMove);
                eventHolder.mousedown(onMouseDown);
            }
        });


        plot.hooks.drawOverlay.push(function (plot, ctx) {
            // draw selection
            if (selection.show && selectionIsSane()) {
                var plotOffset = plot.getPlotOffset();
                var o = plot.getOptions();

                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);

                var c = $.color.parse(o.selection.color);

                ctx.strokeStyle = c.scale('a', o.selection.strokeAlpha).toString();
                ctx.lineWidth = 1;
                ctx.lineJoin = o.selection.shape;
                ctx.fillStyle = c.scale('a', o.selection.fillAlpha).toString();

                var x = Math.min(selection.first.x, selection.second.x) + 0.5,
                    y = Math.min(selection.first.y, selection.second.y) + 0.5,
                    w = Math.abs(selection.second.x - selection.first.x) - 1,
                    h = Math.abs(selection.second.y - selection.first.y) - 1;

                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);

                ctx.restore();
            }
        });

        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mousedown", onMouseDown);

            if (mouseUpHandler)
                $(document).unbind("mouseup", mouseUpHandler);
        });

    }

    $.plot.plugins.push({
        init: init,
        options: {
            selection: {
                mode: null, // one of null, "x", "y" or "xy"
                color: "#e8cfac",
                shape: "round", // one of "round", "miter", or "bevel"
                minSize: 5, // minimum number of pixels
                strokeAlpha: 0.8,
                fillAlpha: 0.4,
            }
        },
        name: 'selection',
        version: '1.1'
    });
})(jQuery);


/***/ }),

/***/ "./vendor/flot/jquery.flot.stack.js":
/*!******************************************!*\
  !*** ./vendor/flot/jquery.flot.stack.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Flot plugin for stacking data sets rather than overlyaing them.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin assumes the data is sorted on x (or y if stacking horizontally).
For line charts, it is assumed that if a line has an undefined gap (from a
null point), then the line above it should have the same gap - insert zeros
instead of "null" if you want another behaviour. This also holds for the start
and end of the chart. Note that stacking a mix of positive and negative values
in most instances doesn't make sense (so it looks weird).

Two or more series are stacked when their "stack" attribute is set to the same
key (which can be any number or string or just "true"). To specify the default
stack, you can set the stack option like this:

    series: {
        stack: null/false, true, or a key (number/string)
    }

You can also specify it for a single series, like this:

    $.plot( $("#placeholder"), [{
        data: [ ... ],
        stack: true
    }])

The stacking order is determined by the order of the data series in the array
(later series end up on top of the previous).

Internally, the plugin modifies the datapoints in each series, adding an
offset to the y value. For line series, extra data points are inserted through
interpolation. If there's a second y value, it's also adjusted (e.g for bar
charts or filled areas).

*/

(function ($) {
    var options = {
        series: { stack: null } // or number/string
    };

    function init(plot) {
        function findMatchingSeries(s, allseries) {
            var res = null;
            for (var i = 0; i < allseries.length; ++i) {
                if (s == allseries[i])
                    break;

                if (allseries[i].stack == s.stack)
                    res = allseries[i];
            }

            return res;
        }

        function stackData(plot, s, datapoints) {
            if (s.stack == null || s.stack === false)
                return;

            var other = findMatchingSeries(s, plot.getData());
            if (!other)
                return;

            var ps = datapoints.pointsize,
                points = datapoints.points,
                otherps = other.datapoints.pointsize,
                otherpoints = other.datapoints.points,
                newpoints = [],
                px, py, intery, qx, qy, bottom,
                withlines = s.lines.show,
                horizontal = s.bars.horizontal,
                withbottom = ps > 2 && (horizontal ? datapoints.format[2].x : datapoints.format[2].y),
                withsteps = withlines && s.lines.steps,
                keyOffset = horizontal ? 1 : 0,
                accumulateOffset = horizontal ? 0 : 1,
                i = 0, j = 0, l, m;

            while (true) {
                if (i >= points.length && j >= otherpoints.length)
                    break;

                l = newpoints.length;

                if (i < points.length && points[i] == null) {
                    // copy gaps
                    for (m = 0; m < ps; ++m)
                        newpoints.push(points[i + m]);
                    i += ps;
                }
                else if (i >= points.length) {
                    // take the remaining points from the previous series
                    for (m = 0; m < ps; ++m)
                        newpoints.push(otherpoints[j + m]);
                    if (withbottom)
                        newpoints[l + 2] = otherpoints[j + accumulateOffset];
                    j += otherps;
                }
                else if (j >= otherpoints.length) {
                    // take the remaining points from the current series
                    for (m = 0; m < ps; ++m)
                        newpoints.push(points[i + m]);
                    i += ps;
                }
                else if (j < otherpoints.length && otherpoints[j] == null) {
                    // ignore point
                    j += otherps;
                }
                else {
                    // cases where we actually got two points
                    px = points[i + keyOffset];
                    py = points[i + accumulateOffset];
                    qx = otherpoints[j + keyOffset];
                    qy = otherpoints[j + accumulateOffset];
                    bottom = 0;

                    if (px == qx) {
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);

                        newpoints[l + accumulateOffset] += qy;
                        bottom = qy;

                        i += ps;
                        j += otherps;
                    }
                    else if (px > qx) {
                        // take the point from the previous series so that next series will correctly stack
                        if (i == 0) {
                            for (m = 0; m < ps; ++m)
                                newpoints.push(otherpoints[j + m]);
                            bottom = qy;
                        }
                        // we got past point below, might need to
                        // insert interpolated extra point
                        if (i > 0 && points[i - ps] != null) {
                            intery = py + (points[i - ps + accumulateOffset] - py) * (qx - px) / (points[i - ps + keyOffset] - px);
                            newpoints.push(qx);
                            newpoints.push(intery + qy);
                            for (m = 2; m < ps; ++m)
                                newpoints.push(points[i + m]);
                            bottom = qy;
                        }

                        j += otherps;
                    }
                    else { // px < qx
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);

                        // we might be able to interpolate a point below,
                        // this can give us a better y
                        if (j > 0 && otherpoints[j - otherps] != null)
                            bottom = qy + (otherpoints[j - otherps + accumulateOffset] - qy) * (px - qx) / (otherpoints[j - otherps + keyOffset] - qx);

                        newpoints[l + accumulateOffset] += bottom;

                        i += ps;
                    }

                    fromgap = false;

                    if (l != newpoints.length && withbottom)
                        newpoints[l + 2] = bottom;
                }

                // maintain the line steps invariant
                if (withsteps && l != newpoints.length && l > 0
                    && newpoints[l] != null
                    && newpoints[l] != newpoints[l - ps]
                    && newpoints[l + 1] != newpoints[l - ps + 1]) {
                    for (m = 0; m < ps; ++m)
                        newpoints[l + ps + m] = newpoints[l + m];
                    newpoints[l + 1] = newpoints[l - ps + 1];
                }
            }

            datapoints.points = newpoints;
        }

        plot.hooks.processDatapoints.push(stackData);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stack',
        version: '1.2'
    });
})(jQuery);


/***/ }),

/***/ "./vendor/flot/jquery.flot.stackpercent.js":
/*!*************************************************!*\
  !*** ./vendor/flot/jquery.flot.stackpercent.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function ($) {
    var options = {
        series: {
            stackpercent: null
        } // or number/string
    };

    function init(plot) {

        // will be built up dynamically as a hash from x-value, or y-value if horizontal
        var stackBases = {};
        var processed = false;
        var stackSums = {};

        //set percentage for stacked chart
        function processRawData(plot, series, data, datapoints) {
            if (!processed) {
                processed = true;
                stackSums = getStackSums(plot.getData());
            }
			if (series.stackpercent == true) {
				var num = data.length;
				series.percents = [];
				var key_idx = 0;
				var value_idx = 1;
				if (series.bars && series.bars.horizontal && series.bars.horizontal === true) {
					key_idx = 1;
					value_idx = 0;
				}
				for (var j = 0; j < num; j++) {
					var sum = stackSums[data[j][key_idx] + ""];
					if (sum > 0) {
						series.percents.push(data[j][value_idx] * 100 / sum);
					} else {
						series.percents.push(0);
					}
				}
			}
        }

        //calculate summary
        function getStackSums(_data) {
            var data_len = _data.length;
            var sums = {};
            if (data_len > 0) {
                //caculate summary
                for (var i = 0; i < data_len; i++) {
                    if (_data[i].stackpercent) {
						var key_idx = 0;
						var value_idx = 1;
						if (_data[i].bars && _data[i].bars.horizontal && _data[i].bars.horizontal === true) {
							key_idx = 1;
							value_idx = 0;
						}
                        var num = _data[i].data.length;
                        for (var j = 0; j < num; j++) {
                            var value = 0;
                            if (_data[i].data[j][1] != null) {
                                value = _data[i].data[j][value_idx];
                            }
                            if (sums[_data[i].data[j][key_idx] + ""]) {
                                sums[_data[i].data[j][key_idx] + ""] += value;
                            } else {
                                sums[_data[i].data[j][key_idx] + ""] = value;
                            }

                        }
                    }
                }
            }
            return sums;
        }

        function stackData(plot, s, datapoints) {
            if (!s.stackpercent) return;
            if (!processed) {
                stackSums = getStackSums(plot.getData());
            }
            var newPoints = [];


			var key_idx = 0;
			var value_idx = 1;
			if (s.bars && s.bars.horizontal && s.bars.horizontal === true) {
				key_idx = 1;
				value_idx = 0;
			}

			for (var i = 0; i < datapoints.points.length; i += 3) {
				// note that the values need to be turned into absolute y-values.
				// in other words, if you were to stack (x, y1), (x, y2), and (x, y3),
				// (each from different series, which is where stackBases comes in),
				// you'd want the new points to be (x, y1, 0), (x, y1+y2, y1), (x, y1+y2+y3, y1+y2)
				// generally, (x, thisValue + (base up to this point), + (base up to this point))
				if (!stackBases[datapoints.points[i + key_idx]]) {
					stackBases[datapoints.points[i + key_idx]] = 0;
				}
				newPoints[i + key_idx] = datapoints.points[i + key_idx];
				newPoints[i + value_idx] = datapoints.points[i + value_idx] + stackBases[datapoints.points[i + key_idx]];
				newPoints[i + 2] = stackBases[datapoints.points[i + key_idx]];
				stackBases[datapoints.points[i + key_idx]] += datapoints.points[i + value_idx];
				// change points to percentage values
				// you may need to set yaxis:{ max = 100 }
				if ( stackSums[newPoints[i+key_idx]+""] > 0 ){
					newPoints[i + value_idx] = newPoints[i + value_idx] * 100 / stackSums[newPoints[i + key_idx] + ""];
					newPoints[i + 2] = newPoints[i + 2] * 100 / stackSums[newPoints[i + key_idx] + ""];
				} else {
					newPoints[i + value_idx] = 0;
					newPoints[i + 2] = 0;
				}
			}

            datapoints.points = newPoints;
        }

		plot.hooks.processRawData.push(processRawData);
        plot.hooks.processDatapoints.push(stackData);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stackpercent',
        version: '0.1'
    });
})(jQuery);


/***/ }),

/***/ "./vendor/flot/jquery.flot.time.js":
/*!*****************************************!*\
  !*** ./vendor/flot/jquery.flot.time.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Pretty handling of time axes.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

Set axis.mode to "time" to enable. See the section "Time series data" in
API.txt for details.

*/

(function($) {

	var options = {
		xaxis: {
			timezone: null,		// "browser" for local to the client or timezone for timezone-js
			timeformat: null,	// format string to use
			twelveHourClock: false,	// 12 or 24 time in time mode
			monthNames: null	// list of names of months
		}
	};

	// round to nearby lower multiple of base

	function floorInBase(n, base) {
		return base * Math.floor(n / base);
	}

	// Returns a string with the date d formatted according to fmt.
	// A subset of the Open Group's strftime format is supported.

	function formatDate(d, fmt, monthNames, dayNames) {

		if (typeof d.strftime == "function") {
			return d.strftime(fmt);
		}

		var leftPad = function(n, pad) {
			n = "" + n;
			pad = "" + (pad == null ? "0" : pad);
			return n.length == 1 ? pad + n : n;
		};

		var r = [];
		var escape = false;
		var hours = d.getHours();
		var isAM = hours < 12;

		if (monthNames == null) {
			monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		}

		if (dayNames == null) {
			dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		}

		var hours12;

		if (hours > 12) {
			hours12 = hours - 12;
		} else if (hours == 0) {
			hours12 = 12;
		} else {
			hours12 = hours;
		}

		for (var i = 0; i < fmt.length; ++i) {

			var c = fmt.charAt(i);

			if (escape) {
				switch (c) {
					case 'a': c = "" + dayNames[d.getDay()]; break;
					case 'b': c = "" + monthNames[d.getMonth()]; break;
					case 'd': c = leftPad(d.getDate(), ""); break;
					case 'e': c = leftPad(d.getDate(), " "); break;
					case 'h':	// For back-compat with 0.7; remove in 1.0
					case 'H': c = leftPad(hours); break;
					case 'I': c = leftPad(hours12); break;
					case 'l': c = leftPad(hours12, " "); break;
					case 'm': c = leftPad(d.getMonth() + 1, ""); break;
					case 'M': c = leftPad(d.getMinutes()); break;
					// quarters not in Open Group's strftime specification
					case 'q':
						c = "" + (Math.floor(d.getMonth() / 3) + 1); break;
					case 'S': c = leftPad(d.getSeconds()); break;
					case 'y': c = leftPad(d.getFullYear() % 100); break;
					case 'Y': c = "" + d.getFullYear(); break;
					case 'p': c = (isAM) ? ("" + "am") : ("" + "pm"); break;
					case 'P': c = (isAM) ? ("" + "AM") : ("" + "PM"); break;
					case 'w': c = "" + d.getDay(); break;
				}
				r.push(c);
				escape = false;
			} else {
				if (c == "%") {
					escape = true;
				} else {
					r.push(c);
				}
			}
		}

		return r.join("");
	}

	// To have a consistent view of time-based data independent of which time
	// zone the client happens to be in we need a date-like object independent
	// of time zones.  This is done through a wrapper that only calls the UTC
	// versions of the accessor methods.

	function makeUtcWrapper(d) {

		function addProxyMethod(sourceObj, sourceMethod, targetObj, targetMethod) {
			sourceObj[sourceMethod] = function() {
				return targetObj[targetMethod].apply(targetObj, arguments);
			};
		};

		var utc = {
			date: d
		};

		// support strftime, if found

		if (d.strftime != undefined) {
			addProxyMethod(utc, "strftime", d, "strftime");
		}

		addProxyMethod(utc, "getTime", d, "getTime");
		addProxyMethod(utc, "setTime", d, "setTime");

		var props = ["Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds"];

		for (var p = 0; p < props.length; p++) {
			addProxyMethod(utc, "get" + props[p], d, "getUTC" + props[p]);
			addProxyMethod(utc, "set" + props[p], d, "setUTC" + props[p]);
		}

		return utc;
	};

	// select time zone strategy.  This returns a date-like object tied to the
	// desired timezone

	function dateGenerator(ts, opts) {
		if (opts.timezone == "browser") {
			return new Date(ts);
		} else if (!opts.timezone || opts.timezone == "utc") {
			return makeUtcWrapper(new Date(ts));
		} else if (typeof timezoneJS != "undefined" && typeof timezoneJS.Date != "undefined") {
			var d = new timezoneJS.Date();
			// timezone-js is fickle, so be sure to set the time zone before
			// setting the time.
			d.setTimezone(opts.timezone);
			d.setTime(ts);
			return d;
		} else {
			return makeUtcWrapper(new Date(ts));
		}
	}

	// map of app. size of time units in milliseconds

	var timeUnitSize = {
		"second": 1000,
		"minute": 60 * 1000,
		"hour": 60 * 60 * 1000,
		"day": 24 * 60 * 60 * 1000,
		"month": 30 * 24 * 60 * 60 * 1000,
		"quarter": 3 * 30 * 24 * 60 * 60 * 1000,
		"year": 365.2425 * 24 * 60 * 60 * 1000
	};

	// the allowed tick sizes, after 1 year we use
	// an integer algorithm

	var baseSpec = [
		[1, "second"], [2, "second"], [5, "second"], [10, "second"],
		[30, "second"],
		[1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"],
		[30, "minute"],
		[1, "hour"], [2, "hour"], [4, "hour"],
		[8, "hour"], [12, "hour"],
		[1, "day"], [2, "day"], [3, "day"],
		[0.25, "month"], [0.5, "month"], [1, "month"],
		[2, "month"]
	];

	// we don't know which variant(s) we'll need yet, but generating both is
	// cheap

	var specMonths = baseSpec.concat([[3, "month"], [6, "month"],
		[1, "year"]]);
	var specQuarters = baseSpec.concat([[1, "quarter"], [2, "quarter"],
		[1, "year"]]);

	function init(plot) {
		plot.hooks.processOptions.push(function (plot, options) {
			$.each(plot.getAxes(), function(axisName, axis) {

				var opts = axis.options;

				if (opts.mode == "time") {
					axis.tickGenerator = function(axis) {

						var ticks = [];
						var d = dateGenerator(axis.min, opts);
						var minSize = 0;

						// make quarter use a possibility if quarters are
						// mentioned in either of these options

						var spec = (opts.tickSize && opts.tickSize[1] ===
							"quarter") ||
							(opts.minTickSize && opts.minTickSize[1] ===
							"quarter") ? specQuarters : specMonths;

						if (opts.minTickSize != null) {
							if (typeof opts.tickSize == "number") {
								minSize = opts.tickSize;
							} else {
								minSize = opts.minTickSize[0] * timeUnitSize[opts.minTickSize[1]];
							}
						}

						for (var i = 0; i < spec.length - 1; ++i) {
							if (axis.delta < (spec[i][0] * timeUnitSize[spec[i][1]]
											  + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2
								&& spec[i][0] * timeUnitSize[spec[i][1]] >= minSize) {
								break;
							}
						}

						var size = spec[i][0];
						var unit = spec[i][1];

						// special-case the possibility of several years

						if (unit == "year") {

							// if given a minTickSize in years, just use it,
							// ensuring that it's an integer

							if (opts.minTickSize != null && opts.minTickSize[1] == "year") {
								size = Math.floor(opts.minTickSize[0]);
							} else {

								var magn = Math.pow(10, Math.floor(Math.log(axis.delta / timeUnitSize.year) / Math.LN10));
								var norm = (axis.delta / timeUnitSize.year) / magn;

								if (norm < 1.5) {
									size = 1;
								} else if (norm < 3) {
									size = 2;
								} else if (norm < 7.5) {
									size = 5;
								} else {
									size = 10;
								}

								size *= magn;
							}

							// minimum size for years is 1

							if (size < 1) {
								size = 1;
							}
						}

						axis.tickSize = opts.tickSize || [size, unit];
						var tickSize = axis.tickSize[0];
						unit = axis.tickSize[1];

						var step = tickSize * timeUnitSize[unit];

						if (unit == "second") {
							d.setSeconds(floorInBase(d.getSeconds(), tickSize));
						} else if (unit == "minute") {
							d.setMinutes(floorInBase(d.getMinutes(), tickSize));
						} else if (unit == "hour") {
							d.setHours(floorInBase(d.getHours(), tickSize));
						} else if (unit == "month") {
							d.setMonth(floorInBase(d.getMonth(), tickSize));
						} else if (unit == "quarter") {
							d.setMonth(3 * floorInBase(d.getMonth() / 3,
								tickSize));
						} else if (unit == "year") {
							d.setFullYear(floorInBase(d.getFullYear(), tickSize));
						}

						// reset smaller components

						d.setMilliseconds(0);

						if (step >= timeUnitSize.minute) {
							d.setSeconds(0);
						}
						if (step >= timeUnitSize.hour) {
							d.setMinutes(0);
						}
						if (step >= timeUnitSize.day) {
							d.setHours(0);
						}
						if (step >= timeUnitSize.day * 4) {
							d.setDate(1);
						}
						if (step >= timeUnitSize.month * 2) {
							d.setMonth(floorInBase(d.getMonth(), 3));
						}
						if (step >= timeUnitSize.quarter * 2) {
							d.setMonth(floorInBase(d.getMonth(), 6));
						}
						if (step >= timeUnitSize.year) {
							d.setMonth(0);
						}

						var carry = 0;
						var v = Number.NaN;
						var prev;

						do {

							prev = v;
							v = d.getTime();
							ticks.push(v);

							if (unit == "month" || unit == "quarter") {
								if (tickSize < 1) {

									// a bit complicated - we'll divide the
									// month/quarter up but we need to take
									// care of fractions so we don't end up in
									// the middle of a day

									d.setDate(1);
									var start = d.getTime();
									d.setMonth(d.getMonth() +
										(unit == "quarter" ? 3 : 1));
									var end = d.getTime();
									d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
									carry = d.getHours();
									d.setHours(0);
								} else {
									d.setMonth(d.getMonth() +
										tickSize * (unit == "quarter" ? 3 : 1));
								}
							} else if (unit == "year") {
								d.setFullYear(d.getFullYear() + tickSize);
							} else {
								d.setTime(v + step);
							}
						} while (v < axis.max && v != prev);

						return ticks;
					};

					axis.tickFormatter = function (v, axis) {

						var d = dateGenerator(v, axis.options);

						// first check global format

						if (opts.timeformat != null) {
							return formatDate(d, opts.timeformat, opts.monthNames, opts.dayNames);
						}

						// possibly use quarters if quarters are mentioned in
						// any of these places

						var useQuarters = (axis.options.tickSize &&
								axis.options.tickSize[1] == "quarter") ||
							(axis.options.minTickSize &&
								axis.options.minTickSize[1] == "quarter");

						var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
						var span = axis.max - axis.min;
						var suffix = (opts.twelveHourClock) ? " %p" : "";
						var hourCode = (opts.twelveHourClock) ? "%I" : "%H";
						var fmt;

						if (t < timeUnitSize.minute) {
							fmt = hourCode + ":%M:%S" + suffix;
						} else if (t < timeUnitSize.day) {
							if (span < 2 * timeUnitSize.day) {
								fmt = hourCode + ":%M" + suffix;
							} else {
								fmt = "%b %d " + hourCode + ":%M" + suffix;
							}
						} else if (t < timeUnitSize.month) {
							fmt = "%b %d";
						} else if ((useQuarters && t < timeUnitSize.quarter) ||
							(!useQuarters && t < timeUnitSize.year)) {
							if (span < timeUnitSize.year) {
								fmt = "%b";
							} else {
								fmt = "%b %Y";
							}
						} else if (useQuarters && t < timeUnitSize.year) {
							if (span < timeUnitSize.year) {
								fmt = "Q%q";
							} else {
								fmt = "Q%q %Y";
							}
						} else {
							fmt = "%Y";
						}

						var rt = formatDate(d, fmt, opts.monthNames, opts.dayNames);

						return rt;
					};
				}
			});
		});
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: 'time',
		version: '1.0'
	});

	// Time-axis support used to be in Flot core, which exposed the
	// formatDate function on the plot object.  Various plugins depend
	// on the function, so we need to re-expose it here.

	$.plot.formatDate = formatDate;

})(jQuery);


/***/ }),

/***/ "angular":
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_angular__;

/***/ }),

/***/ "grafana/app/core/config":
/*!**********************************!*\
  !*** external "app/core/config" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_config__;

/***/ }),

/***/ "grafana/app/core/core":
/*!********************************!*\
  !*** external "app/core/core" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_core__;

/***/ }),

/***/ "grafana/app/core/core_module":
/*!***************************************!*\
  !*** external "app/core/core_module" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_core_module__;

/***/ }),

/***/ "grafana/app/core/time_series2":
/*!****************************************!*\
  !*** external "app/core/time_series2" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_time_series2__;

/***/ }),

/***/ "grafana/app/core/utils/kbn":
/*!*************************************!*\
  !*** external "app/core/utils/kbn" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_utils_kbn__;

/***/ }),

/***/ "grafana/app/core/utils/ticks":
/*!***************************************!*\
  !*** external "app/core/utils/ticks" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_utils_ticks__;

/***/ }),

/***/ "grafana/app/plugins/sdk":
/*!**********************************!*\
  !*** external "app/plugins/sdk" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jquery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_jquery__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_moment__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map