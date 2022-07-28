const { Thought, User } = require('../models');

const thoughtController = {

  getAllThoughts(req, res) {
    Thought.find({})
      .then(dbThoughtData => {
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findById({ _id: params.thoughtId })
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id!'})
          return;
        }
        res.json(thought);
      })
      .catch(err => res.status(400).json(err));
  },

  createThought({ body }, res) {
    var userId = body.userId;
    Thought.create(body)
      .then(({_id}) => {
        return User.findOneAndUpdate(
          { _id: userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          res.json(err);
        }
      )
  },

  addReaction({ params , body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body }},
      { new: true }
      )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with id.'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));

  },

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { _id: params.reactionId }} },
      { new: true }
      )
      .then(dbThoughtData => {
        if (dbThoughtData) {
          res.status(404).json({ message: 'No thought found with id.' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      body,
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id.'});
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id.'});
          return;
        }
        else {
          return User.findOneAndUpdate(
            { thoughts: params.thoughtId },
            { $pull: { thoughts: params.thoughtId } },
            { new: true }
          );
        }
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;