const { Schema , model } = require('mongoose');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: new Schema.Types.ObjectId
    },
    reactionBody: {
      type: Schema.Types.String,
      required: true,
      maxLength: 280
    },
    username: {
      type: Schema.Types.String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    }
  }
);

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: Schema.Types.String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    username: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    }
  }
);

ThoughtSchema.virtual('reactionCount').get(function() {
  return 
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;