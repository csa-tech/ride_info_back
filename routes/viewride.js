var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET ride info */

var secret = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
}

router.get('/', function(req, res) {

    var connection = mysql.createConnection(secret);
    var ride_id = req.body.ride_id;

    var checkride = 'SELECT COUNT(ride_id) AS num FROM rideshare.ride WHERE ride_id = ' + ride_id, // 检查ride表里有多少个符合ride_id条件，应该只有一个
        select = `SELECT *, rideshare.ride.status AS ride_status, rideshare.ride.note AS ride_note, rideshare.application.status AS app_status, rideshare.application.note AS app_note
                  FROM rideshare.ride
                  JOIN rideshare.user ON rideshare.user.user_id = rideshare.ride.driver_id
                  LEFT JOIN rideshare.application ON rideshare.application.ride_id = rideshare.ride.ride_id
                  WHERE rideshare.ride.ride_id = ` + ride_id +
                  ` UNION
                  SELECT *, rideshare.ride.status AS ride_status, rideshare.ride.note AS ride_note, rideshare.application.status AS app_status, rideshare.application.note AS app_note
                  FROM rideshare.ride
                  JOIN rideshare.user ON rideshare.user.user_id = rideshare.ride.driver_id
                  RIGHT JOIN rideshare.application ON rideshare.application.ride_id = rideshare.ride.ride_id
                  WHERE rideshare.ride.ride_id = ` + ride_id;

             
    connection.connect();
    connection.query(checkride, function(err, result, fields) {
            if(result[0].num == 0) { 
                return res.status(500).send('SERVER ERROR: ride_id not found');
                connection.end();
            } else if(result[0].num != 1) {
                return res.status(500).send('SERVER ERROR: multiple rides found for ride_id=' + ride_id);
                connection.end(); 
            } else {
                connection.query(select2, function(err, result, fields) {
                    if (err) {
                        return res.status(500).send('SERVER ERROR: ' + err);
                        connection.end();
                    }

                    /* R.I.P. 一位后端狗的自动化梦想
                     * 它还太年轻，走得太早 ┭┮﹏┭┮
                     * 与2020年惨死于某叶姓组长之手
                     * 2020 - 2020
                     */

                    var d = result[0];
                    var out = {
                        ride_id : d.ride_id,
                        driver_id : d.driver_id,
                        departure : d.departure,
                        destination : d.destination,
                        date : d.date,
                        price : parseInt(d.price),
                        num_seat : parseInt(d.num_seat),
                        num_approved : parseInt(d.num_approved),
                        status : d.ride_status,
                        note : d.ride_note,
                        
                        driver : {
                            user_id : d.user_id,
                            name : d.name,
                            contact : d.contact,
                            avatar_url : d.avatar_url
                        },

                        applications : []
                    }

                    if (result[0].application_id) {
                        for (var i = 0; i < result.length; i++) {
                            var ad = result[i];
                            out.applications[i] = {
                                application_id : ad.application_id,
                                ride_id : ad.ride_id,
                                passenger_id : ad.passenger_id,
                                driver_id : ad.driver_id,
                                status : ad.app_status,
                                num_passenger : parseInt(ad.num_passenger),
                                note : ad.app_note
                            }
                        }
                    }

                    return res.send(out);
                  
                    connection.end();
                });  
            }
    });    
});

module.exports = router;
