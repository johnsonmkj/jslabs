Package.describe({
  summary: "Meteor Edmund's API."
});

Package.on_use(function (api) {
	api.use(['deps', 'underscore', 'handlebars', 'templating', 'jquery'], 'client');

	var path = Npm.require('path');
	api.add_files(path.join('lib', 'edmunds.api.sdk.js'), 'client');

	//var asset_path = path.join('client');
	api.add_files(path.join('edmunds.html'), 'client');
	api.add_files(path.join('edmunds.js'), 'client');
	api.add_files(path.join('edmunds.css'), 'client');

	if (api.export) {
		api.export("Edmunds", "client");
	}
});

