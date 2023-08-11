const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = require("../config/config");

function validToken(token, secretKey) {
  let obj = {};
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) obj = { valid: false, message: null };
    else obj = { valid: true, message: decoded };
  });
  return obj;
}

exports.getUserInfo = (req, res) => {
  let token = req.header("Authorization");
  token = token.split(" ")[1];
  let info = validToken(token, jwtKey.jwtSecretKey);
  if (info.valid) {
    return res.send(info);
  } else {
    return res.send({ status: 1, message: "认证失败" });
  }
};

exports.updateUserInfo = (req, res) => {
  let token = req.header("Authorization");
  token = token.split(" ")[1];
  let info = validToken(token, jwtKey.jwtSecretKey);
  let updateinfo = req.body;
  if (info.valid) {
    let id = info.message.id;
    let sql = "update ev_users set nickname = ?, email = ? where id=?";
    db.query(
      sql,
      [updateinfo.nikename, updateinfo.email, id],
      (err, results) => {
        if (err) {
          return res.send({
            status: 1,
            message: err.message,
          });
        } else {
          return res.send({ status: 0, message: "修改成功" });
        }
      }
    );
  } else {
    return res.send({
      status: 1,
      message: "修改用户信息失败",
    });
  }
};

exports.updatepwd = (req, res) => {
  let token = req.header("Authorization");
  token = token.split(" ")[1];
  let info = validToken(token, jwtKey.jwtSecretKey);
  let newPassword = req.body.password;
  if (info.valid) {
    let id = info.message.id;
    let sql = "select password from ev_users where id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        return res.send({status: 1,message: err.message,});
      } else {
        let compareResult = bcrypt.compareSync(newPassword,results[0].password);
        if (compareResult) {
          return res.send({status: 1,message: "密码相同",});
        } else {
          newPassword = bcrypt.hashSync(newPassword, 10);
          let sql = "update ev_users set password = ? where id = ?";
          db.query(sql,[newPassword,id],(err, results) => {
              if (err) {
                return res.send({status: 1,message: err.message,});
              } else {
                return res.send({ status: 0, message: "修改成功" });
              }
            }
          );
        }
      }
    });
  } else {
    return res.send({
      status: 1,
      message: "修改用户信息失败",
    });
  }
};

exports.updateuserpic = (req, res) => {
  let token = req.header("Authorization");
  token = token.split(" ")[1];
  let info = validToken(token, jwtKey.jwtSecretKey);
  if(info) {
    let pic = req.body.pic
    let sql = 'update ev_users set user_pic = ? where id = ?'
    db.query(sql, [pic,id], (err, results) => {
      if (err) {
        return res.send({status: 1,message: err.message,});
      } else {
        return res.send({status: 0,message: "头像修改成功"});
      }
    });
  }
}