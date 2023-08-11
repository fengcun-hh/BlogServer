const express = require("express");
const userInfoHandler = require("../router_handler/userinfo")
const router = express.Router();

router.get('/userinfo', userInfoHandler.getUserInfo)
router.post('/updateuserinfo', userInfoHandler.updateUserInfo)
router.post('/updatepwd', userInfoHandler.updatepwd)
router.post('/updateuserpic', userInfoHandler.updateuserpic)
module.exports = router