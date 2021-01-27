const Topic = require('../models/topics.model');

exports.updateTopic = (req, res, next) => {
  const topic = new Topic({
    _id: req.body.id,
    title: req.body.title,
    lecture: req.body.lecture,
    course: req.body.course
  });
  Topic.updateOne({_id: req.params.id, creator: req.userData.userId}, topic).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: 'Update successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Couldn\'t update topic!'
    });
  });
}

exports.addTopic = (req, res, next) => {
  const topic = new Topic({
    title: req.body.title,
    lecture: req.body.lecture,
    course: req.body.course,
    creator: req.userData.userId
  });
  topic.save().then(createdTopic => {
    res.status(201).json({
      message: 'Topic posted successfully!',
      topic: {
        ...createdTopic,
        id: createdTopic._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Creating a topic failed"
    });
  });
}

exports.getTopic = (req, res, next) => {
  if (req.query.courseId) {
    Topic.find({course: req.params.id}).then(documents => {
      if (documents) {
        res.status(200).json({
          message: 'Topic fetched successfully!',
          topics: documents
        });
      } else {
        res.status(404).json({message: 'Topic not found!'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Fetching topic failed!"
      });
    });
  } else {
    Topic.findById(req.params.id).then(document => {
      if (document) {
        res.status(200).json({
          message: 'Topic fetched successfully!',
          topic: document
        });
      } else {
        res.status(404).json({message: 'Topic not found!'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Fetching topic failed!"
      });
    });
  }
}

exports.deleteTopic = (req, res, next) => {
  Topic.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion Successful!"});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Deletion failed!"
    });
  });
}
