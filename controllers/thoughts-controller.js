const { Thought, User } = require('../models');

const thoughtController = {

  getAllThoughts(req, res) {
    Thought.find({})
      .then(thoughts => res.json(thoughts))
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