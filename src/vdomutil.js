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