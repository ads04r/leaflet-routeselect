L.Control.RouteSelect = L.Control.extend(
{
	includes: L.Mixin.Events,
	options: { routes: [] },

	initialize: function(options) {
		L.setOptions(this, options);
	},

	onAdd: function(map)
	{
		var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
		container.style.backgroundColor = 'white';
		this._updateControl(container);
		return container;
	},
	_updateControl: function(ctrl)
	{
		var html = '<div></div>';
		ctrl.innerHTML = html;

		for(var i = 0; i < this.options.routes.length; i++)
		{
			var item = this.options.routes[i];
			var node = L.DomUtil.create('div', '', ctrl);
			node.setAttribute('style', 'clear: both; border-radius: 5px; min-width: 60px; padding: 5px; margin: 5px; float: left; color: ' + item.text + ' ; background-color: ' + item.colour);
			var nodeinput = L.DomUtil.create('input', '', node);
			nodeinput.setAttribute('type', 'checkbox');
			nodeinput.setAttribute('checked', 'checked');
			nodeinput.setAttribute('id', 'route_click_cb' + i);
			var nodelabel = L.DomUtil.create('label', '', node);
			nodelabel.setAttribute('for', 'route_click_cb' + i);
			nodelabel.innerHTML = '&nbsp;' + item.name;

			var parent = this;
			L.DomEvent.addListener(nodeinput, 'change', function()
			{
				var id = parseInt(this.id.replace('route_click_cb', ''));
				var item = parent.options.routes[id];
				var layers = item.layers;
				var checked = this.checked;

				for(var i = 0; i < layers.length; i++)
				{
					if(checked) { map.addLayer(layers[i]); }
					if(!(checked)) { map.removeLayer(layers[i]); }
				}
			} );
		}
	},
	addRoute: function(name, colour, text, layer)
	{
		for(var i = 0; i < this.options.routes.length; i++)
		{
			if(this.options.routes[i].name != name) { continue; }
			this.options.routes[i].layers.push(layer);
			return false;
		}

		var item = {};
		item['name'] = name;
		item['colour'] = colour;
		item['text'] = text;
		item['layers'] = [];
		item['layers'].push(layer);
		this.options.routes.push(item);
	}
});


L.Control.routeselect = function (options) {
	return new L.Control.RouteSelect(options);
};
