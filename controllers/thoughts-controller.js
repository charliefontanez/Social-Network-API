const { Thought, User } = require('../models');

const thoughtController = {

  getAllThoughts(req, res) {
    Thought.find({})
      .then(thoughts => res.json(thoughts))
      .catch(err => res.status(400).json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findById({ _id: params.id })
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id!'})
          return;
        }
        res.json(though);
      })
      .catch(err => res.status(400).json(err));
  },

  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({_id}) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id.'});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err)); 
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
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
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No though found with this id.'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;