const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/      
    },
    thoughts: [{
        type: Types.ObjectId,
        ref: "Thoughts"
    }],
    friends: [{
        type: Types.ObjectId,
        ref: "User"
    }]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
})

const User = model('User', UserSchema);

module.exports = User;