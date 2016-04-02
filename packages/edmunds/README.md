Meteor Edmund's API
==========

[Meteor](https://www.meteor.com/) package for [Edmund's Javscript SDK](https://github.com/EdmundsAPI/sdk-javascript).

Tested with Meteor 0.8.0

Edmund's [API doc](http://developer.edmunds.com/)


To install package
```sh
$ meteor add edmunds
```

Set your API Key
``` javascript
if (Meteor.isClient) {
  Meteor.startup(function () {
    Edmunds.key = 'YOUR API KEY';
  });
}
```

Usage example (client)
``` HTML
{{> Edmunds color="grey"}}
```
As defined in their [Terms Of Service](http://developer.edmunds.com/terms_of_service/index.html), point 7.5, we must include an Edmunds Web Logo within our app, so the color parameter is optionnal and define which image to pick from their [API branding guide](http://developer.edmunds.com/api_branding_guide/)

Possible color values: `white` (default), `grey`, `red`


Usage example within a modal
``` HTML
<template name="testEdmunds">
	<div class="modal show fade in" id="edmunds-modal" data-backdrop="true" style="width:auto">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">×</button>
			<h3>Select a car</h3>
		</div>
		<div class="modal-body">
			<form class="form-horizontal">
				{{> Edmunds color="grey"}}
			</form>
		</div>
		<div class="modal-footer">
			<a href="#" class="btn" data-dismiss="modal">Close</a><!-- note the use of "data-dismiss" -->
			<a href="#" class="btn btn-primary" id="save-profile">Save</a>
		</div>
		
	</div>
</template>
```

Display our modal test
``` HTML
{{> testEdmunds}}
```

Example result

![](https://farm8.staticflickr.com/7240/13523891855_96706a3200.jpg)
