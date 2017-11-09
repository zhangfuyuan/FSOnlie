/**
 * Created by Jeffrey on 2017/10/24.
 */

/**
 * 此接口设置并公开mongodb数据库连接的库名、管理员数据
 *      需要引入 md5 加密模块（自定义）
 *
 *  Administrator  {Object}   初始化管理员数据的一些信息（自定义）
 *  dbUrl          {String}   路径中，路由为连接的数据库名
 * */

var md5 = require('./md5');
var Administrator = {
    name: 'admin',
    psw: md5('123456'),
    otherInfo: 'Some information.'
};

module.exports = {
    dbUrl: 'mongodb://localhost:27017/test',
    adminInfo: Administrator
};
