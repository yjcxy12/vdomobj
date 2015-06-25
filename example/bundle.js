(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var VdomObj = require('../index');

document.addEventListener("DOMContentLoaded", function() { 

	var todoItems = [
		{
			name: 'first item'
		}, {
			name: 'second item'
		}, {
			name: 'third item'
		}, {
			name: 'fouth item'
		}, {
			name: 'fifth item'
		},
	];

	var Vitem = VdomObj.createElement( {

		deleteItem: function (item, vnode) {
			todoItems.map(function (val, i) {
				if (item === val) {
					todoItems.splice(i, 1);
				}
			}, this);
			this.ref.updateNode();
		},

		render: function () {
			var node = VdomObj.node('li')
				.addClass('list-group-item')
				.text(this.props.item.name);

			node.append('button')
				.addClass('btn btn-danger pull-right')
				.css('margin-top', '-8px')
				.css('margin-right', '-12px')
				.on('click', this.deleteItem.bind(this, this.props.item))
				.append('span')
					.addClass('glyphicon glyphicon-minus');
			return node;
		}
	});

	var Vdiv = VdomObj.createElement( {

		props: {
			items: todoItems,
			newItem: ''
		},

		addItem: function (vnode) {
			if (this.props.newItem.trim() === '') {
				alert('please enter text');
				return;
			}
			this.props.items.push({
				name: this.props.newItem
			});
			this.updateNode();
		},

		inputChanged: function (vnode, elem) {
			this.props.newItem = elem.value;
		},

		render: function () {
			var self = this;
			var node = VdomObj
				.node('div')
				.addClass('container');

			var input_group = node.append('div')
				.addClass('input-group');

			var input = input_group
				.append('input')
				.addClass('form-control')
				.on('change', this.inputChanged);

			var addBtn = input_group
				.append('span')
					.addClass('input-group-btn')
					.append('button')
						.addClass('btn btn-primary')
						.on('click', this.addItem)
						.append('span')
							.addClass('glyphicon glyphicon-plus');

			var ul = node.append('ul')
				.addClass('list-group');

			this.props.items.map(function (item) {
				ul.appendVdom(Vitem, {item: item}, this);
			}, this);

			return node;
		}
	});

	VdomObj.appendElement(Vdiv, document.getElementById('main-display'));
});
},{"../index":2}],2:[function(require,module,exports){
var VdomObj = require('./src/vdomobj');

module.exports = new VdomObj();
},{"./src/vdomobj":4}],3:[function(require,module,exports){
'use strict';

module.exports = {
	diff: function (old, current) {
		
	}
};
},{}],4:[function(require,module,exports){

'use strict';

var vdomutil = require('./vdomutil');
var vdomdiff = require('./vdomdiff');
var VnodeObj = require('./vnodeobj');
var VtreeObj = require('./vtreeobj');

function VdomObj() {}

VdomObj.prototype = {
	node: function (tag) {
		var	vnode = VnodeObj(tag);
		return vnode;
	},

	createElement: function (obj) {
		var vtree = VtreeObj();
		vdomutil.extend(vtree, obj);
		return vtree;
	},

	appendElement: function (vtree, parent) {
		if (!vdomutil.isVdomObj(vtree)) {
			vdomutil.throwError('Element is not an instance of VdomObj');
		}
		vtree._parent = parent;
		if (vtree._vnode === undefined) {
			vtree._vnode = vtree.render(vtree);
		}
		parent.appendChild(vtree.toDomElement(vtree._vnode));
	},
};

module.exports = VdomObj;
},{"./vdomdiff":3,"./vdomutil":5,"./vnodeobj":6,"./vtreeobj":7}],5:[function(require,module,exports){
'use strict';

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
	},

	//duck typing
	isVdomObj: function (obj) {
		return typeof obj.updateNode === 'function';
	}
};
},{}],6:[function(require,module,exports){
'use strict';

var vdomutil = require('./vdomutil');

function VnodeObj(tag) {
	return {

		tag: tag,

		innerText: '',

		className: [],

		attribute: {},

		style: {},

		children: [],

		funcDic: {},

		_element: undefined,

		append: function (vtree, props) {
			var vchild = new VnodeObj(vtree);
			this.children.push(vchild);
			return vchild;
		},

		appendVdom: function (vtree, props, parent) {
			if (vdomutil.isVdomObj(vtree)) {
				vtree.props = props;
				vtree.ref = parent;
				vtree._vnode = vtree.render();
				this.children.push(vtree._vnode);
				return vtree._vnode;
			}
			else {
				vdomutil.throwError('Appending node is not an instance of VtreeObj');
			}
		},

		attr: function (attr, val) {
			if (val === undefined) {
				return this.attribute[attr];
			}
			this.attribute[attr] = val;
			return this;
		},

		css: function (css, val) {
			if (val === undefined) {
				return this.style[css];
			}
			this.style[css] = val;
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
			if (text === undefined) {
				return this.text;
			}
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
}

module.exports = VnodeObj;
},{"./vdomutil":5}],7:[function(require,module,exports){
'use strict';

var vdomutil = require('./vdomutil');

function VtreeObj(props) {

	return {
		props: props,

		_vnode: undefined,

		_parent: undefined,

		refs: undefined,

		render: undefined,

		updateNode: function () {
			// var operations = vdomdiff.diff(this._vnode, this.render());
			var newVnode = this.render();
			this._parent.removeChild(this._element);
			this._parent.appendChild(this.toDomElement(newVnode));
		},

		toDomElement: function (vnode) {
			var self = this;
			this.checkSchema(vnode);

			var element = document.createElement(vnode.tag);

			this.asignAttr(element, vnode.attribute);
			this.asignStyle(element, vnode.style);
			this.asignClass(element, vnode.className);
			this.asignFunction(element, vnode);
			element.innerHTML = vnode.innerText;
			vnode.children.map(function (childNode) {
				var childEle = self.toDomElement(childNode);
				if (childEle) {
					element.appendChild(childEle);
				}
			});

			this._element = element;
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

		asignStyle: function (element, styleObj) {
			vdomutil.iterObj(styleObj, function (val, key) {
				element.style[key] = val;
			});
		},

		asignFunction: function (element, vnode) {
			var self = this;
			vdomutil.iterObj(vnode.funcDic, function (callbackLst, name) {
				callbackLst.map(function (callback) {
					element.addEventListener(name, callback.bind(self, vnode, element));
				});
			});
		},

		asignClass: function (element, classes) {
			if (classes.length > 0) {
				element.className = classes.join(' ');
			}
		}
	};
}

module.exports = VtreeObj;
},{"./vdomutil":5}]},{},[1])