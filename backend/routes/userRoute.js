const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword } = require('../controllers/userController');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route('/logout').get(logoutUser)


router.route("/me").get(isAuthenticateUser, getUserDetails);
router.route("/password/update").put(isAuthenticateUser, updatePassword );

module.exports = router
