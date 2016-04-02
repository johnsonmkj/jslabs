
if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('EdmundsLogo', function (color) {
    return new Handlebars.SafeString("<a href='http://wwww.edmunds.com/?id=apis'><div class='logo " + color + "'></div></a>");
  });
  Handlebars.registerHelper('Edmunds', function (opts) {

    Template.edmunds.logo = function (color) {
      if (!color) color = 'white';
      return new Handlebars.SafeString("<a href='http://wwww.edmunds.com/?id=apis'><div class='logo " + color + "'></div></a>");
    };

    return Template['edmunds'];
  });
}

Edmunds = {
  key: '',
  detailsVisibilityDep: new Deps.Dependency,
  detailsVisibility: false,

  // Constants
  detailsSessionKey: 'edmunds.trimDetails',
  maintenanceSessionKey: 'edmunds.maintenance',

  APICalls: [
    function() {
      Edmunds.callEdmunds('/api/vehicle/v2/makes', Edmunds.parseMakes);
    },
    function() {
      var make = Edmunds.getMake();
      Edmunds.callEdmunds('/api/vehicle/v2/' + make.niceName + '/models', Edmunds.parseModels);
    },
    function() {
      var make = Edmunds.getMake();
      var model = Edmunds.getModel();
      var year = Edmunds.getYear();

      Edmunds.callEdmunds('/api/vehicle/v2/'+make.niceName+'/'+model.niceName+'/'+year, Edmunds.parseModelYearId);

      //Edmunds.callEdmunds('/api/vehicle/v2/' + make.niceName + '/' + model.niceName, Edmunds.parseTrims);
    },
    function() {
      var trim = Edmunds.getTrim();
      Edmunds.callEdmunds('/api/vehicle/v2/styles/' + trim.id, Edmunds.parseDetails, 'full');
    },
  ],
  // Select and their corresponding API call
  selectListIds: ["#yearsList", "#makesList", "#modelsList", "#trimList"],

  getDetailsVisibility: function () {
    this.detailsVisibilityDep.depend()
    return this.detailsVisibility;
  },

  hideCarDetails: function () {
    this.detailsVisibility = false;
    this.detailsVisibilityDep.changed();
  },
  showCarDetails: function () {
    this.detailsVisibility = true;
    this.detailsVisibilityDep.changed();
  },

  // Local (client-only) collection
  Makes: new Meteor.Collection(null),
  Models: new Meteor.Collection(null),
  Trims: new Meteor.Collection(null),
  
  getYear: function() {
    return $(Edmunds.selectListIds[0]).val();
  },
  getMake: function() {
    return Edmunds.Makes.findOne({id: $(Edmunds.selectListIds[1]).val()});
  },
  getModel: function() {
    return Edmunds.Models.findOne({id: $(Edmunds.selectListIds[2]).val()});
  },
  getTrim: function() {
    return Edmunds.Trims.findOne({id: $(Edmunds.selectListIds[3]).val()});
  },

  parseError: function(data) {
    //TODO: display something to user
    console.log('error');
    console.log(data);
  },

  parseMakes: function(res) {
    Edmunds.Makes.remove({});
    Edmunds.Makes.insert({});
    _.each(res.makes, function (itm) {
      itm.id = itm.id.toString();
      Edmunds.Makes.insert(itm);
    });
  },

  parseModels: function(res) {
    Edmunds.Models.remove({});
    Edmunds.Models.insert({});
    _.each(res.models, function (itm) {
      itm.id = itm.id.toString()
      Edmunds.Models.insert(itm);
    });
  },

  parseTrims: function(res) {
    Edmunds.Trims.remove({});
    Edmunds.Trims.insert({});
    _.each(res.years, function (itmYears) {
      _.each(itmYears.styles, function (itm) {
        itm.id = itm.id.toString()
        Edmunds.Trims.insert(itm);
      });
    });
  },

  parseModelYearId:function(res) {
    console.log(res.id);
    Edmunds.callEdmunds('/v1/api/maintenance/actionrepository/findbymodelyearid', Edmunds.parseMaintenance, res.id);
  },

  parseMaintenance:function(res) {
    console.log('maintenance');
    console.log(res);
    Session.set(Edmunds.maintenanceSessionKey,res)
  },

  parseDetails: function(res) {
    console.log(res);
    Session.set( Edmunds.detailsSessionKey, res );
  },

  callEdmunds: function(apiPath, parseFunction, modelyearid) {
    // Instantiate the SDK
    var res;
    if (Edmunds.key instanceof Array) {
      var key = Edmunds.key[Math.floor(Math.random() * Edmunds.key.length)];
      res = new EDMUNDSAPI(key);
    } else {
      res = new EDMUNDSAPI(Edmunds.key);
    }

    var options
    if(modelyearid) {
      options = { "modelyearid" : modelyearid };
    } else {
      options = { "view": "full" };
    }
    
    // Fire the API call
    res.api(apiPath, options, parseFunction, Edmunds.parseError);
  },

  resetFields: function(startDepth) {

    for (var i=1;i<4;i++) {
      // Reset following select 
      if (startDepth < i) {
        $(Edmunds.selectListIds[i]).val(undefined);      
      }
    }

    if (startDepth < 4) {
      Session.set( Edmunds.detailsSessionKey, undefined );
    }

  },

};

if (Meteor.isClient) {

  Template.edmunds.helpers({
    years : function () {
      // liste des années descendante
      var years = _.range(new Date().getFullYear(), 1980, -1);
      years.splice(0,0, '');
      return years;
    },
    makes : function () {
      return Edmunds.Makes.find();
    },
    models : function () {
      return Edmunds.Models.find();
    },
    trims : function () {
      return Edmunds.Trims.find();
    },
    details : function() {
      return Session.get('edmunds.trimDetails');
    },
    displayDetails: function() {
      return Edmunds.getDetailsVisibility();
    },
    maintenance: function() {
      return Session.get('edmunds.maintenance');
    }
  });

  Template.edmunds.rendered = function() {
    Edmunds.resetFields(0);

    for (var i=0;i<Edmunds.APICalls.length;i++) {
      // We need a closure to remember the index
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
      (function(i) {
        $( Edmunds.selectListIds[i] ).change(function() {
          Edmunds.resetFields(i);
          Edmunds.APICalls[i]();
        });
      }(i));
    }

  };

}
