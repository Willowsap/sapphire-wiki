const express = require('express');
const checkAuth = require('../middleware/check-auth')

const TopicsController = require('../controllers/topics.controller');
const router = express.Router();

router.post('', checkAuth, TopicsController.addTopic);
router.put('/:id', checkAuth, TopicsController.updateTopic);
router.get('/:id', TopicsController.getTopic);
router.delete('/:id', checkAuth, TopicsController.deleteTopic);

module.exports = router;