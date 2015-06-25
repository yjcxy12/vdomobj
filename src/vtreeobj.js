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