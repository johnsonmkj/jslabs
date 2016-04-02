/**
 * Created by priv on 09.02.16.
 */

Meteor.publish('images', function() {
    return Images.find({});
});

Meteor.methods({
    'uploadImage':function(buffer, name, size) {
        return Images.insert({
            name:name,
            size:size,
            image:buffer,
            createdAt:new Date()
        });
    }
});
