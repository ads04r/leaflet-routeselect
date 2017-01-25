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
			node.setAttribute('style', 'clear: both; min-width: 60px; padding-left: 5px; padding-right: 5px; float: left;');
			var nodeinput = L.DomUtil.create('input', '', node);
			nodeinput.setAttribute('type', 'checkbox');
			nodeinput.setAttribute('checked', 'checked');
			nodeinput.setAttribute('id', 'route_click_cb' + i);
			var nodelabel = L.DomUtil.create('label', '', node);
			nodelabel.setAttribute('for', 'route_click_cb' + i);
			nodelabel.setAttribute('style', item.style);
			nodelabel.innerHTML = '&nbsp;' + item.name;
			this.options.routes[i].control = nodeinput;

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
	serialize: function()
	{
		var l = Math.pow(2, (this.options.routes.length - 1));
		var t = 0;
		for(var i = 0; i < this.options.routes.length; i++)
		{
			if(this.options.routes[i].control.checked) { t = t + l; }
			l = l / 2;
		}
		return t;
	},
	addRoute: function(name, layer, style)
	{
		for(var i = 0; i < this.options.routes.length; i++)
		{
			if(this.options.routes[i].name != name) { continue; }
			this.options.routes[i].layers.push(layer);
			return false;
		}

		var item = {};
		item['name'] = name;
		item['style'] = style;
		item['layers'] = [];
		item['layers'].push(layer);
		this.options.routes.push(item);
	}
});


L.Control.routeselect = function (options) {
	return new L.Control.RouteSelect(options);
};
