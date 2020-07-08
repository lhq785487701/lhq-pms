(function(w) {
	"use strict";
	if (!Array.prototype.findIndex) {
		Object.defineProperty(Array.prototype, 'findIndex', {
			value : function(predicate) {
				// 1. Let O be ? ToObject(this value).
				if (this == null) {
					throw new TypeError('"this" is null or not defined');
				}

				var o = Object(this);

				// 2. Let len be ? ToLength(? Get(O, "length")).
				var len = o.length >>> 0;

				// 3. If IsCallable(predicate) is false, throw a TypeError
				// exception.
				if (typeof predicate !== 'function') {
					throw new TypeError('predicate must be a function');
				}

				// 4. If thisArg was supplied, let T be thisArg; else let T be
				// undefined.
				var thisArg = arguments[1];

				// 5. Let k be 0.
				var k = 0;

				// 6. Repeat, while k < len
				while (k < len) {
					// a. Let Pk be ! ToString(k).
					// b. Let kValue be ? Get(O, Pk).
					// c. Let testResult be ToBoolean(? Call(predicate, T, «
					// kValue, k, O »)).
					// d. If testResult is true, return k.
					var kValue = o[k];
					if (predicate.call(thisArg, kValue, k, o)) {
						return k;
					}
					// e. Increase k by 1.
					k++;
				}

				// 7. Return -1.
				return -1;
			}
		});
	}

	if (!Array.prototype.find) {
		Object.defineProperty(Array.prototype, 'find', {
			value : function(predicate) {
				// 1. Let O be ? ToObject(this value).
				if (this == null) {
					throw new TypeError('"this" is null or not defined');
				}

				var o = Object(this);

				// 2. Let len be ? ToLength(? Get(O, "length")).
				var len = o.length >>> 0;

				// 3. If IsCallable(predicate) is false, throw a TypeError
				// exception.
				if (typeof predicate !== 'function') {
					throw new TypeError('predicate must be a function');
				}

				// 4. If thisArg was supplied, let T be thisArg; else let T be
				// undefined.
				var thisArg = arguments[1];

				// 5. Let k be 0.
				var k = 0;

				// 6. Repeat, while k < len
				while (k < len) {
					// a. Let Pk be ! ToString(k).
					// b. Let kValue be ? Get(O, Pk).
					// c. Let testResult be ToBoolean(? Call(predicate, T, «
					// kValue, k, O »)).
					// d. If testResult is true, return kValue.
					var kValue = o[k];
					if (predicate.call(thisArg, kValue, k, o)) {
						return kValue;
					}
					// e. Increase k by 1.
					k++;
				}

				// 7. Return undefined.
				return undefined;
			}
		});
	}
	
	if (!Array.prototype.includes) {
		  Object.defineProperty(Array.prototype, 'includes', {
		    value: function(searchElement, fromIndex) {

		      // 1. Let O be ? ToObject(this value).
		      if (this == null) {
		        throw new TypeError('"this" is null or not defined');
		      }

		      var o = Object(this);

		      // 2. Let len be ? ToLength(? Get(O, "length")).
		      var len = o.length >>> 0;

		      // 3. If len is 0, return false.
		      if (len === 0) {
		        return false;
		      }

		      // 4. Let n be ? ToInteger(fromIndex).
		      //    (If fromIndex is undefined, this step produces the value 0.)
		      var n = fromIndex | 0;

		      // 5. If n ≥ 0, then
		      //  a. Let k be n.
		      // 6. Else n < 0,
		      //  a. Let k be len + n.
		      //  b. If k < 0, let k be 0.
		      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		      // 7. Repeat, while k < len
		      while (k < len) {
		        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
		        // b. If SameValueZero(searchElement, elementK) is true, return true.
		        // c. Increase k by 1.
		        // NOTE: === provides the correct "SameValueZero" comparison needed here.
		        if (o[k] === searchElement) {
		          return true;
		        }
		        k++;
		      }

		      // 8. Return false
		      return false;
		    }
		  });
	}
	
	if (!String.prototype.includes) {
		  String.prototype.includes = function(search, start) {
		    'use strict';
		    if (typeof start !== 'number') {
		      start = 0;
		    }
		    
		    if (start + search.length > this.length) {
		      return false;
		    } else {
		      return this.indexOf(search, start) !== -1;
		    }
		  };
	}
	
	if (window.HTMLElement) {
	    if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
	        Object.defineProperty(HTMLElement.prototype, 'dataset', {
	            get: function () {
	                var attributes = this.attributes; //获取节点的所有属性
	                var name = [],
	                    value = []; //定义两个数组保存属性名和属性值
	                var obj = {}; //定义一个空对象
	                for (var i = 0; i < attributes.length; i++) { //遍历节点的所有属性
	                    if (attributes[i].nodeName.slice(0, 5) == 'data-') { //如果属性名的前面5个字符符合"data-"
	                        // 取出属性名的"data-"的后面的字符串放入name数组中
	                        name.push(attributes[i].nodeName.slice(5));
	                        //取出对应的属性值放入value数组中
	                        value.push(attributes[i].nodeValue);
	                    }
	                }
	                for (var j = 0; j < name.length; j++) { //遍历name和value数组
	                    obj[name[j]] = value[j]; //将属性名和属性值保存到obj中
	                }
	                return obj; //返回对象
	            }
	        });
	    }
	}
	
	if(window.performance && !window.performance.now){
		window.performance.now=function(){
			return ((+new Date()) - performance.timing.navigationStart);
		};
	}
	
})(this);