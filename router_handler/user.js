const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = require("../config/config");

exports.regUser = (req, res) => {
  const userInfo = req.body;
  if (!userInfo.username || !userInfo.password) {
    return res.send({
      status: 1,
      message: "用户名或者密码为空",
    });
  }

  // 定义sql语句
  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, [userInfo.username], (err, results) => {
    if (err) {
      return res.send({
        status: 1,
        message: "err.message",
      });
    }
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: "用户名被占用",
      });
    }
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);

    const sql = "insert into ev_users set ?";
    db.query(
      sql,
      { username: userInfo.username, password: userInfo.password },
      (err, results) => {
        if (err) return res.send({ status: 1, message: "注册用户失败" });
        if (results.affectedRows !== 1)
          return res.send({ status: 1, message: "注册用户失败" });
        res.send({ status: 0, message: "注册成功" });
      }
    );
  });
};

function validToken(token, secretKey) {
  let validToken = true;
  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) validToken = false;
  })
  return validToken;
}

exports.login = (req, res) => {
  const userInfo = req.body;
  if (req.header("Authorization")) {
    let token = req.header("Authorization").split(" ")[1];
    console.log(token);
    if (validToken(token, jwtKey.jwtSecretKey)) {
      return res.send({ status: 0, message: "认证成功" });
    } else {
      return res.send({ status: 1, message: "认证失败" });
    }
  }
  const sql = "select * from ev_users where username = ?";
  db.query(sql, userInfo.username, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: "登录失败" });
    }
    if (results.length !== 1)
      return res.send({ status: 1, message: "登录失败" });
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );
    if (!compareResult) {
      return res.send({ status: 1, message: "登录失败" });
    }
    const user = { ...results[0], password: "", user_pic: "" };
    const tokenStr = jwt.sign(user, jwtKey.jwtSecretKey, { expiresIn: "10h" });
    res.send({
      status: 0,
      message: "登录成功",
      token: "Bearer" + " " + tokenStr,
    });
  });
};
