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