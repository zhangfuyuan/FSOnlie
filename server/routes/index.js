var express = require('express');
var router = express.Router();
var db = require('../tools/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET 信息 */
router.get('/getData', function(req, res, next) {
    res.json({
        'code': 200,
        'message': '获取数据成功',
        'data': '这是全栈项目的客户端！'
    });
    // res.type('text/javascript');
    // res.send(req.query.callback + '("这是全栈项目的客户端！")');
});

/* GET 数据库数据 */
router.get('/getDBData', function(req, res, next) {
    var queryData = req.query.data;

    console.log(queryData);

    db.find("dbData", { query: { "user": queryData } }, function(err, result) {
        if(err){
            console.log(err);
            return res.json({
                'code': 500,
                'message': '内部服务器错误'
            });
        }
        if (result.length === 0) {
            return res.json({
                'code': 401,
                'message': '找不到数据'
            });
        }

        res.json({
            'code': 200,
            'message': '获取数据成功',
            'data': result[0].info
        });
        // res.type('text/javascript');
        // res.send(req.query.callback + '(' + JSON.stringify(result[0].info) + ')');
    });
});

module.exports = router;
