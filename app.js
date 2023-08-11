const express = require("express");
const cors = require("cors");
const router = require("./router/user");
const userinfoRouter = require("./router/userinfo");
const articleRouter = require("./router/artcate")
const config = require("./config/config");
const expressJwt = require("express-jwt");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(
  expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] })
);

app.use("/api", router);
app.use("/my", userinfoRouter);
app.use("/article", articleRouter);


app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: 1,
      message: "认证失败",
    });
  }
});

app.listen(8080, () => {
  console.log("listen at http://127.0.0.1:8080");
});
