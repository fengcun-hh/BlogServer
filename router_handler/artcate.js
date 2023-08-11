const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = require("../config/config");

function validToken(token, secretKey) {
    let validToken = true;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) validToken = false;
    })
    return validToken;
  }
  
exports.getCates = (req, res) => {
    let token = req.header("Authorization");
    token = token.split(" ")[1];
    let info = validToken(token, jwtKey.jwtSecretKey);
    if(info) {
        const sql = 'select * from ev_article_cate where is_delete = 0 order by id asc'
        db.query(sql, (err, result) => {
            if(err) return res.send({status: 1,message: err.message})
            else {
                return res.send({
                    status: 0,message: "获取文章分类成功",
                    data: result
                })
            }
        })
    }else {
        return res.send({
            status: 1,message: "认证失败",
        })
    }
};

exports.addCates = (req, res) => {
    let token = req.header("Authorization");
    token = token.split(" ")[1];
    let info = validToken(token, jwtKey.jwtSecretKey);
    if(info) {
        let data = req.body
        let sql = 'insert into table ev_article_cate (name, alias, is_delete) values (?,?,0);'
        db.query(sql, [data.name,data.alias], (err, result) => {
            if(err) return res.send({status: 1,message: err.message,}) 
            else {
                return res.send({status: 0,message: "修改成功",}) 
            }
        })
    }
    else {
        return res.send({
            status: 1,message: "认证失败",
        }) 
    }
}

exports.deletecatesbyid = (req,res) => {
    const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
    db.query(sql, [req.params.id], (err, result) => {
        if(err) return res.send({status:1, message: err.message})
        else if(result.affectedRows !== 1) {
            return res.send({status:1, message: '删除文字分类失败'})
        } else {
            return res.send({status:0, message: '删除文字分类成功'})
        }
    })
}

exports.getcatesbyid = (req, res) => {
   let sql = 'select * from ev_article_cate where id =?'
   db.query(sql, [req.params.id], (err, result) => {
        if(err) return res.send({status:1, message: err.message})
        else return res.send({status:0, message: '获取文字分类成功', data: result})
   })
}

exports.updatecate = (req,res) => {
   let sql = 'update ev_article_cate set name = ?, alias = ? where id =?'
   let info = req.body
   db.query(sql, [info.name, info.alias, info.id], (err, result) => {
        if(err) return res.send({status:1, message: err.message})
        if(result.affectedRows !== 1) return res.send({status:1, message: "修改文字分类失败"})
        else return res.send({status:0, message: '修改文字分类成功', data: result})
   })
}

exports.addArticle = (req,res) => {
    
}