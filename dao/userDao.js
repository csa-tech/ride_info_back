var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./userSqlMapping');

var pool=mysql.createPool($conf.mysql);

var jsonWrite = function(res,ret){
    if(typeof ret == 'undefined'){
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else{
        res.json(ret);
    }
};

module.exports = {
    add: function (req,res,next){
        pool.getConnection(function(err,connection){
            if (err) {console.log(err); throw err;}
            var param = req.query || req.params;

            connection.query($sql.insert,[param.ride_id,param.pick, param.drop,param.people_num,param.wechat_id,param.note],function(err,result){
                // connection.query($sql.insert,[1,"ucsb", "lax",4,"kevin","handsome"],function(err,result){
                if (err) {console.log(err); throw err;}
                // console.log(param.pick);
                // console.log(param.drop);
                // console.log(param.people_num);
                // console.log(param.wechat_id);
                // console.log(param.note);
                if(result){
                    result={
                        code: 200,
                        msg:'增加成功'
                    };
                }
                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);

                // 释放连接
                connection.release();
            });
        });
    }
};