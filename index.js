var VdomObj = function () {};

require('./src/vtreeobj')(VdomObj.prototype);

module.exports = new VdomObj();