/**
 * Created by priv on 26.01.16.
 */

Meteor.startup(function () {

    if (Clients.find().count() === 0) {
        for(var i=1;i<20;i++) {
            Clients.insert({companyName:'Company Name ' + i, firstName:'First Name ' + i,
                lastName:'Last Name ' + i, phoneNumber:'604767701',email:'example@xyz.com',
                logo:'', createdAt:new Date(), updatedAt:new Date()});
        }
    }

});
