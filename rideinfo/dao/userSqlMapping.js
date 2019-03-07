var ride_info = {
    insert:'INSERT INTO ride_info(ride_id,pick,`drop`,people_num,wechat_id,note) VALUES(?,?,?,?,?,?);'
    // update:'update ride_info set name=?,age=? where id=?;',
    // delete:'delete from ride_info where id=?;',
    // queryById:'select * from ride_info where id=?;',
    // queryAll: 'select * from ride_info;'
};

module.exports = ride_info;