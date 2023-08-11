const express = require("express");
const routerHandler = require("../router_handler/artcate");

const router = express.Router();

router.get("/cates", routerHandler.getCates);

router.get("/addcates", routerHandler.addCates);

router.get("/deletecatesbyid/:id", routerHandler.deletecatesbyid);

router.get("/getcatesbyid", routerHandler.getcatesbyid);

router.post("/cates/:id", routerHandler.getcatesbyid);

router.post("/updatecate", routerHandler.updatecate);

router.post("/add", routerHandler.addArticle);
module.exports = router;
