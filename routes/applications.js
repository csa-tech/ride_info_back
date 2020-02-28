var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET application listing */

var secret = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
}

router.get('/', function(req, res) {

    var connection = mysql.createConnection(secret);
    var app_id = req.body.application_id;
    var check = "SELECT COUNT(application_id) AS num FROM rideshare.application WHERE application_id = " + app_id,
        select = 'SELECT * FROM rideshare.application WHERE application_id=' + app_id;
    connection.connect();

    connection.query(check, function(err, result, fields) {
            if(result[0].num == 0) { 
                console.log("zero");
                return res.status(500).send('SERVER ERROR: application_id not found')
                connection.end();
            } else {
                connection.query(select, function(err, result, fields) {
                    if (err) {
                        return res.status(500).send('SERVER ERROR: ' + err);
                        connection.end();
                    } 
                    return res.send(result[0]); // 每个application_id只应对应一行
                });  
            }
    });    
});

module.exports = router;
