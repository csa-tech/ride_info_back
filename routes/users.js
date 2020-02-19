var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET users listing. */

var secret = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
}

router.post('/', (req, res, next)=>{

    console.log(req.body);

    var connection = mysql.createConnection(secret);
    connection.connect();

    console.log(req.body);
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

        function(err, rows, fields) {
            if (err) {
                return res.status(500).send('SERVER ERROR: ' + err.code);
                connection.end();
            }
            return res.status(200).send('OK');
        }); 

                // 成功时的处理
                // rows = [ RowDataPacket { count: 0, update_time: 2019-01-15T23:34:59.000Z } ]
        
});

module.exports = router;
