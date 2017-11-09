/**
 * Created by Jeffrey on 2017/10/24.
 */

/**
 * 此接口公开加密方法
 *      需要引入 crypto 加密模块（node内置）
 * */

var crypto = require('crypto');

module.exports = function (pwd) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(pwd).digest('base64');

    return password;
};
