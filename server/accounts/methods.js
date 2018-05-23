import { Accounts } from 'meteor/accounts-base';
import { Check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles'
export default {
    create(values){
        check(values, Object);
        check(values.username, String);
        check(values.password, String);
        const _id = Accounts.createUser({
            username: values.username,
            password: values.password
        });
        Roles.addUsersToRoles(_id, 'user', Roles.GLOBAL_GROUP);
        return _id;
    },
    sendResetEmail(email){
        check(email, String);
        const user = Meteor.users.findOne({
            "emails.0.address":email
        });
        //don't throw error if user not found to avoid username farming
        if(user)
            Accounts.sendResetPasswordEmail(user._id, email);
    },

    toggleVerification(_id){
        check(_id,String);
        if(Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)){
            const user = Meteor.users.findOne({
                _id
            });
            if(user){
                Meteor.users.update({
                    _id
                }, {
                    $set:{
                        "emails.0.verified":! user.emails[0].verified
                    }
                });
            }
        } else {
            throw new Meteor.Error(401, "You are not an admin");
        }

    },
    deleteUser(_id){
        check(_id, String);
        if(Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
            Meteor.users.remove({_id});
        }
    }
}