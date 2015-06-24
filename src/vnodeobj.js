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

		append: function (vdom, props) {
			var vchild;
			if (vdomutil.isVdomObj(vdom)) {
				//todo: bug, should be different objects, not changing properties on the same object.
				vdom.props = props;
				vdom._vnode = vdom.render();
				vchild = vdom._vnode;
			}
			else if (typeof vdom === 'string'){
				vchild = new VnodeObj(vdom);
			}
			this.children.push(vchild);
			return vchild;
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