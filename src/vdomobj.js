
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