/**
 * Created by priv on 08.02.16.
 */

Meteor.publish('clients', function() {
    return Clients.find({});
});

Clients.allow({
    insert: function(userId, client) {
        return userId != null;
    },
    update: function(userId, document, fieldNames, modifier) {
        return userId != null;
    }
});