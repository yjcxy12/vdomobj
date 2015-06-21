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
			// var operations = this.diff(this._vnode, this.render());
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