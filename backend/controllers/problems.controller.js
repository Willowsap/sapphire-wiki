const Sap = require('../models/sap.model');

exports.updateProblem = (req, res, next) => {
  const sap = new Sap({
    _id: req.body.id,
    question: req.body.question,
    answers: req.body.answers,
    topic: req.body.topic
  });
  Sap.updateOne({_id: req.params.id, creator: req.userData.userId}, sap).then(result => {
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

exports.addProblem = (req, res, next) => {
  if (req.query.type === 'sap') {
    const sap = new Sap({
      question: req.body.question,
      answers: req.body.answers,
      topic: req.body.topic,
      creator: req.userData.userId
    });
    sap.save().then(createdSap => {
      res.status(201).json({
        message: 'Sap posted successfully!',
        sap: {
          ...createdSap,
          id: createdSap._id
        }
      });
    }).catch(error => {
      res.status(500).json({
        message: "Creating a sap failed (1)"
      });
    });
  } else {
    res.status(500).json({
      message: "Creating a sap failed (2)"
    });
  }
}

exports.getProblems = (req, res, next) => {
  if (req.query.type === 'sap') {
    Sap.find({topic: req.params.id}).then(document => {
      res.status(200).json({
        message: 'Sap fetched successfully!',
        saps: document
      });
    }).catch(error => {
      res.status(500).json({
        message: "Fetching sap failed!"
      });
    });
  }
}

exports.getProblem = (req, res, next) => {
  if (req.query.type === 'sap') {
    Sap.findById(req.params.id).then(document => {
      if (document) {
        res.status(200).json({
          message: 'Sap fetched successfully!',
          sap: document
        });
      } else {
        res.status(404).json({message: 'Sap not found!'});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Fetching sap failed!"
      });
    });
  }
}

exports.deleteProblem = (req, res, next) => {
}