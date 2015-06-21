(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var VdomObj = require('../index');

document.addEventListener("DOMContentLoaded", function() { 

	var element = VdomObj.createElement( {
		props: {
			items: 5
		},

		render: function () {
			var self = this;
			var node = VdomObj
				.node('div')
				.addClass('btn btn-default')
				.on('click', function (vnode) {
					vnode.addClass('pull-right list-group-item');
					VdomObj.updateNode();
				});

			var input_group = node.append('div');
			var input = input_group
				.append('input');

			var addBtn = input_group
				.append('button')
				.addClass('btn btn-primary')
				.on('click', function (vnode) {
					self.props.items++;
					VdomObj.updateNode();
				})

			var ul = node.append('ul')
				.addClass('list-group');

			for (var i = 0; i < this.props.items; i++) {
				ul.append('li')
					.addClass('list-group-item')
					.text('this is the ' + i + 'th item');
			}

			return node;
		}
	});

	VdomObj.appendElement(element, document.getElementById('main-display'));
});
},{"../index":2}],2:[function(require,module,exports){
var VdomObj = function () {};

require('./src/vtreeobj')(VdomObj.prototype);

module.exports = new VdomObj();
},{"./src/vtreeobj":5}],3:[function(require,module,exports){
module.exports = {

	throwError: function (err) {
		throw new Error(err);
	},

	extend: function (orig, ext) {
		for (var i in ext) {
          if (ext.hasOwnProperty(i)) {
             orig[i] = ext[i];
          }
       }
       return orig;
	},

	iterObj: function (obj, callback) {
		for (var attr in obj) {
			if (!obj.hasOwnProperty(attr)) continue;

			var attrVal = obj[attr];
			callback(attrVal, attr);
		}
	}
};
},{}],4:[function(require,module,exports){
'use strict';

var vdomutil = require('./vdomutil');

function VnodeObj(tag) {

	return {
		tag: tag,

		innerText: '',

		className: [],

		attribute: {},

		children: [],

		funcDic: {},

		append: function (tag) {
			var vchild = new VnodeObj(tag);
			this.children.push(vchild);
			return vchild;
		},

		attr: function (attr, val) {
			if (val === undefined) {
				return this.attribute[attr];
			}
			else {
				this.attribute[attr] = val;
			}
			return this;
		},

		addClass: function (className) {
			var lst = className.trim().split(' ');
			lst.map(function (singleClass) {
				var hasClass = false;
				this.className.map(function (val) {
					if (val === singleClass) {
						hasClass = true;
					}
				});
				if (!hasClass) {
					this.className.push(singleClass);
				}
			}, this);
			return this;
		},

		removeClass: function (className) {
			var lst = className.trim().split(' ');
			lst.map(function (singleClass) {
				this.className.map(function (val, i) {
					if (val === singleClass) {
						this.splice(i, 1);
					}
				}, this.className);
			}, this);
			return this;
		},

		text: function (text) {
			this.innerText = text;
			return this;
		},

		on: function (event, callback) {
			this.funcDic[event] = this.funcDic[event]? this.funcDic[event] : [];
			this.funcDic[event].push(callback);
			return this;
		},

		off: function (event, callback) {
			if (event === undefined) {
				this.funcDic = {};
			}
			else if (callback === undefined) {
				this.funcDic[event] = [];
			}
			else {
				vdomutil.iterObj(this.funcDic, function (val, key) {
					if (key !== event) {
						return;
					}
					val.map(function (fun, i) {
						if (fun === callback) {
							this.splice(i, 1);
						}
					}, val);
				});
			}
			return this;
		}
	};
};

module.exports = VnodeObj;
},{"./vdomutil":3}],5:[function(require,module,exports){
'use strict';

var vdomutil = require('./vdomutil');
var VnodeObj = require('./vnodeobj');

function VtreeObj(VdomObj) {
	
	var ext = {

		_vnode: {},

		_element: {},

		_parent: {},

		props: {},

		render: function () {

		},

		node: function (tag) {
			var vnode = new VnodeObj(tag);
			return vnode;
		},

		updateNode: function () {
			var newEle = this.toDomElement(this.render());
			this._parent.removeChild(this._element);
			this.appendElement(newEle, this._parent);
		},

		appendElement: function (element, parent) {
			this._element = element;
			this._parent = parent;
			parent.appendChild(element);
		},

		createElement: function (obj) {
			this.props = obj.props;
			this.render = obj.render.bind(this);
			this._vnode = this.render();
			return this.toDomElement(this._vnode);
		},

		toDomElement: function (vnode) {
			var self = this;

			self.checkSchema(vnode);

			var element = document.createElement(vnode.tag);

			self.asignAttr(element, vnode.attribute);

			self.asignClass(element, vnode.className);

			self.asignFunction(element, vnode.funcDic, vnode);

			element.innerHTML = vnode.innerText;

			vnode.children.map(function (childNode) {
				var childEle = self.toDomElement(childNode);
				if (childEle) {
					element.appendChild(childEle);
				}
			});

			return element;
		},

		checkSchema: function (vnode) {
			if (vnode.tag === undefined) {
				vdomutil.throwError("tag undefined");
			}
			if (vnode.attribute === undefined || typeof vnode.attribute !== 'object') {
				vdomutil.throwError("attr undefined");
			}
			if (vnode.children === undefined) {
				vnode.children = [];
			}
		},

		asignAttr: function (element, attrObj) {
			vdomutil.iterObj(attrObj, function (val, key) {
				element.setAttribute(key, val);
			});
		},

		asignFunction: function (element, funcDic, vnode) {
			var self = this;
			vdomutil.iterObj(funcDic, function (callbackLst, name) {
				callbackLst.map(function (callback) {
					element.addEventListener(name, callback.bind(element, vnode, self._vnode));
				});
			});
		},

		asignClass: function (element, classes) {
			element.className = classes.join(' ');
		}
	};

	vdomutil.extend(VdomObj, ext);
}

module.exports = VtreeObj;
},{"./vdomutil":3,"./vnodeobj":4}]},{},[1]);
