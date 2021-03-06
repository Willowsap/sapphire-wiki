const express = require('express');
const UsersController = require('../controllers/users.controller');
const router = express.Router();

router.post("/signup", UsersController.createUser);
router.post("/login", UsersController.userLogin);

module.exports = router;