const express = require('express');
const checkAuth = require('../middleware/check-auth')

const ProblemsController = require('../controllers/problems.controller');
const router = express.Router();

router.post('', checkAuth, ProblemsController.addProblem);
router.put('/:id', checkAuth, ProblemsController.updateProblem);
router.get('/:id', ProblemsController.getProblem);
router.get('/topic/:id', ProblemsController.getProblems);
router.delete('/:id', checkAuth, ProblemsController.deleteProblem);

module.exports = router;