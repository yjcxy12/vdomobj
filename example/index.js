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

		deleteItem: function (item, vnode) {
			this.props.items.map(function (val, i) {
				if (item === val) {
					this.props.items.splice(i, 1);
				}
			}, this);
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
				ul.append('li')
					.addClass('list-group-item')
					.text(item.name)
					.append('button')
						.addClass('btn btn-danger pull-right')
						.css('margin-top', '-8px')
						.css('margin-right', '-12px')
						.on('click', self.deleteItem.bind(self, item))
						.append('span')
							.addClass('glyphicon glyphicon-minus');
			});

			return node;
		}
	});

	VdomObj.appendElement(Vdiv, document.getElementById('main-display'));
});