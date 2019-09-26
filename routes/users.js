var express = require('express');
var router = express.Router();

var userDao=require('../dao/userDao');

/* GET users listing. */

router.post('/',(req,res,next)=>{
    console.log(req.body);

    var mysql      = require('mysql');


    var connection = mysql.createConnection({host:'mydatabase.c9ukuxyqda4n.us-west-1.rds.amazonaws.com',user:'CSAUser',password:'Csa666!!',database: 'rideshare'});
    connection.connect();

    console.log(req.body);
    try {
          // connection.query('INSERT INTO rideshare.application(ride_id,passenger_id,status,num_passenger,note) VALUES(\''+req.body.ride_id+'\',\''+req.body.passenger_id+'\',\''+req.body.status+'\',\''+req.body.wechat_id+'\',\''+req.body.note+'\'); ', function(err, rows, fields) 
          connection.query('INSERT INTO rideshare.application(ride_id,passenger_id,status,num_passenger,note) VALUES ?',
            [
            [
              [req.body.ride_id,
              req.body.user_id,
              "PENDING",
              req.body.num_passenger,
              req.body.note]
            ]
            ],
           function(err, rows, fields){ //这里写SQL query
            if (err) { throw err; } //出错时交给后面的finally去处理      

            // 成功时的处理
            // rows = [ RowDataPacket { count: 0, update_time: 2019-01-15T23:34:59.000Z } ]
            res.status(200).send('OK');
          });
        } catch(err) { // 这里使用try...catch语法，即使出bug也可以正常应答，并且断开和数据库的连接
          res.status(500).send('SERVER ERROR:' + err); // SQL出错时的处理
          connection.end();
        }
})



module.exports = router;
