const mongoose = require('mongoose');

const sapSchema = mongoose.Schema({
  question:  { type: String, required: true },
  answers: { type: Array, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Sap', sapSchema);