'use strict';

var vdomutil = require('./vdomutil');
var vdomdiff = require('./vdomdiff');
var VnodeObj = require('./vnodeobj');

function VtreeObj() {}

VtreeObj.prototype = {

	_vnode: undefined,

	_element: undefined,

	_parent: undefined,

	props: undefined,

	render: undefined,

	node: function (tag) {
		var	vnode = new VnodeObj(tag);
		return vnode;
	},

	updateNode: function () {
		// var operations = vdomdiff.diff(this._vnode, this.render());
		var newEle = this.render();
		this._parent.removeChild(this._element);
		this._parent.appendChild(this.toDomElement(newEle));
	},

	appendElement: function (vdom, parent) {
		if (!this.isVdom(vdom)) {
			vdomutil.throwError('Element is not an instance of VdomObj');
		}
		vdom._parent = parent;
		if (vdom._vnode === undefined) {
			vdom._vnode = vdom.render.call(vdom);
		}
		parent.appendChild(vdom.toDomElement(vdom._vnode));
	},

	createElement: function (obj) {
		var vdom = new VtreeObj();
		vdomutil.extend(vdom, obj);
		return vdom;
	},

	toDomElement: function (vnode) {
		var self = this;

		self.checkSchema(vnode);

		var element = document.createElement(vnode.tag);

		self.asignAttr(element, vnode.attribute);
		self.asignStyle(element, vnode.style);
		self.asignClass(element, vnode.className);
		self.asignFunction(element, vnode.funcDic, vnode);
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

	asignFunction: function (element, funcDic, vnode) {
		var self = this;
		vdomutil.iterObj(funcDic, function (callbackLst, name) {
			callbackLst.map(function (callback) {
				element.addEventListener(name, callback.bind(self, vnode, element));
			});
		});
	},

	asignClass: function (element, classes) {
		if (classes.length > 0) {
			element.className = classes.join(' ');
		}
	},

	isVdom: function (obj) {
		return obj instanceof VtreeObj;
	}
};

module.exports = VtreeObj;