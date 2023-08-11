const express = require("express");
const routerHandler = require("../router_handler/user");

const router = express.Router();

router.post("/reguser", routerHandler.regUser);

router.post("/login", routerHandler.login);

module.exports = router;
