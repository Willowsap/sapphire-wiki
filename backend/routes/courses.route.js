const express = require('express');

const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')
const CoursesController = require('../controllers/courses.controller');
const router = express.Router();

router.post('', checkAuth, extractFile, CoursesController.addCourse);
router.put('/:id', checkAuth, extractFile, CoursesController.updateCourse);
router.get('', CoursesController.getCourses);
router.get('/:id', CoursesController.getCourse);
router.delete('/:id', checkAuth, CoursesController.deleteCourse);

module.exports = router;