/**
 * Created by priv on 26.01.16.
 */

Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
        var user = Accounts.createUser({username: "User", email: 'user@xyz.com', password: 'user'});
        Roles.addUsersToRoles(user, ['user']);
        var admin = Accounts.createUser({username: "Admin", email: 'admin@xyz.com', password: 'admin'});
        Roles.addUsersToRoles(admin, ['admin']);
    }
});