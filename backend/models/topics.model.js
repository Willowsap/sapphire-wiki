const mongoose = require('mongoose');

const topicsSchema = mongoose.Schema({
  title:  { type: String, required: true },
  lecture: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Topic', topicsSchema);