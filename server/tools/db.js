/**
 * Created by Jeffrey on 2017/10/24.
 */

/**
 *  此接口封装了mongodb数据库的连接、初始化、增删改查以及其他自定义操作
 *      需要引入 mongodb 数据库接口模块
 *      需要引入 setting 数据库基本设置模块（自定义）
 * */

var MongoClient = require('mongodb').MongoClient;
var settings = require('./setting');

/**
 *  封装一个 连接数据库 的方法（内置，不公开）
 *
 *  @param {Function}  callback   连接后的回调函数
 * */
function _connectDB(callback) {
    var url = settings.dbUrl;

    MongoClient.connect(url, function (err, db) {
        if(err){
            console.log('连接数据库失败！');
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}

/**
 *  闭包 初始化数据库 方法（不公开）
 *      自调用方法 在数据库的用户信息集合中创建一个管理员数据
 *
 *  @variation {Object}  json   设置用户数据的字段和值（自定义）
 *
 *  initDB();   初始化完成后不再调用，需注释掉！
 * */
(function () {

    // initDB();

    function initDB() {
        var setInfo = settings.adminInfo;
        var json = {
            "username": setInfo.name,
            "password": setInfo.psw,
            "otherInfo": setInfo.otherInfo
        };

        _connectDB(function (err, db) {
            var usersCollection = db.collection("users");

            usersCollection.find({ "username": setInfo.name }).toArray(function (err, result) {
                if(err){
                    console.log('初始化查询管理员失败！');
                    db.close();
                    return;
                }
                if(result.length !== 0){
                    // console.log('初始化管理员信息已存在！');
                    db.close();
                    return;
                }
                usersCollection.insertOne(json, function (err, result) {
                    if(err){
                        console.log('管理员信息初始化失败！');
                        db.close();
                        return;
                    }
                    console.log('管理员信息初始化成功！');
                    db.close();
                });
            });
        });
    }

})();

/**
 *  增 —— 插入数据（公开）
 *      在数据库中插入一条数据的操作
 *
 *  @param {String}    collectionName   进行插入操作的集合名
 *  @param {Object}    json             插入的数据对象
 *  @param {Function}  callback         插入操作后的回调函数
 *
 *  @callback {Object}  result   回调函数的第二个参数是返回一个操作结果对象
 * */
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            if (err) {
                console.log('增加操作失败！');
                callback(err, null);
                db.close();
                return;
            }
            callback(err, result);
            db.close();
        });
    });
};

/**
 *  删 —— 删除一条数据（公开）
 *      在数据库中删除一条数据的操作
 *
 *  @param {String}    collectionName   进行删除操作的集合名
 *  @param {Object}    json             符合删除条件的对象
 *  @param {Function}  callback         删除操作后的回调函数
 *
 *  @callback {Object}  result   回调函数的第二个参数是返回一个操作结果对象
 * */
exports.deleteOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).deleteOne(json, function (err, result) {
            if (err) {
                console.log('删除操作失败！');
                callback(err, null);
                db.close();
                return;
            }
            callback(err, result);
            db.close();
        });
    });
};

/**
 *  删 —— 删除多个符合条件的数据（公开）
 *      在数据库中删除多个符合条件的数据的操作
 *
 *  @param {String}    collectionName   进行删除操作的集合名
 *  @param {Object}    json             所有符合删除条件的对象
 *  @param {Function}  callback         删除操作后的回调函数
 *
 *  @callback {Object}  result   回调函数的第二个参数是返回一个操作结果对象
 * */
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).deleteMany(json, function (err, result) {
            if (err) {
                console.log('删除操作失败！');
                callback(err, null);
                db.close();
                return;
            }
            callback(err, result);
            db.close();
        });
    });
};

/**
 *  改 —— 更改一条数据（公开）
 *      在数据库中更改一条数据的操作
 *
 *  @param {String}    collectionName   进行更改操作的集合名
 *  @param {Object}    oldJson          符合更改条件的对象
 *  @param {Object}    newJson          新的更改数据对象
 *  @param {Function}  callback         更改操作后的回调函数
 *
 *  @callback {Object}  result   回调函数的第二个参数是返回一个操作结果对象
 *
 *  @variation {Object}  $currentDate: { "lastModified": false }   设置保存最后更改数据的时间
 * */
exports.updateOne = function (collectionName, oldJson, newJson, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateOne(oldJson, {
            $set: newJson,
            $currentDate: { "lastModified": false }
        },function (err, result) {
            if (err) {
                console.log('更新操作失败！');
                callback(err, null);
                db.close();
                return;
            }
            callback(err, result);
            db.close();
        });
    });
};

/**
 *  改 —— 更改多条符合条件的数据（公开）
 *      在数据库中更改多条符合条件的数据的操作
 *
 *  @param {String}    collectionName   进行更改操作的集合名
 *  @param {Object}    oldJson          所有符合更改条件的对象
 *  @param {Object}    newJson          新的更改数据对象
 *  @param {Function}  callback         更改操作后的回调函数
 *
 *  @callback {Object}  result   回调函数的第二个参数是返回一个操作结果对象
 *
 *  @variation {Object}  $currentDate: { "lastModified": false }   设置保存最后更改数据的时间
 * */
exports.updateMany = function (collectionName, oldJson, newJson, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(oldJson, {
                $set: newJson,
                $currentDate: { "lastModified": false }
            },function (err, result) {
                if (err) {
                    console.log('更新操作失败！');
                    callback(err, null);
                    db.close();
                    return;
                }
                callback(err, result);
                db.close();
        });
    });
};

/**
 *  查 —— 查询数据（公开）
 *      在数据库中查询数据的操作
 *      特别注意：传递的数据类型均为字符串，所以代入参数前需要转换数据类型！！！
 *
 *  @param {String}    collectionName   进行查询操作的集合名
 *  @param {Object}    option           所有符合查询条件的对象
 *      @param {Object}    option.query     请求查询的json数据
 *      @param {Number}    option.limit     请求查询的数目限制
 *      @param {Number}    option.page      请求查询返回结果的页数
 *      @param {Object}    option.sort      请求查询返回结果的排序方式
 *  @param {Function}  callback         查询操作后的回调函数
 *
 *  @callback {Array}  result   回调函数的第二个参数是返回一个符合条件的数据数组
 *
 *  @variation {Number}  count          应该省略的条数，只显示第一页的数目
 * */
exports.find = function (collectionName, option, callback) {
    _connectDB(function (err, db) {
        var json = option.query || {},
            limit = Number(option.limit) || 0,
            page = Number(option.page) - 1,
            sort = option.sort || {};
        var count = page<= 0 ? 0 : page*limit;
        var cursor = db.collection(collectionName).find(json).limit(limit).skip(count).sort(sort);

        cursor.toArray(function (err, result) {
            if (err) {
                console.log('查询操作失败！',err);
                callback(err, null);
                db.close();
                return;
            }
            callback(err, result);
            db.close();
        });
    });
};

/**
 *  针对全文搜索功能的查询方法（公开）
 *      在数据库中全文搜索的操作
 *      特别注意：传递的数据类型均为字符串，所以代入参数前需要转换数据类型！！！
 *
 *  @param {String}    collectionName   进行查询操作的集合名
 *  @param {Object}    option           所有符合查询条件的对象
 *      @param {Object}    option.query       请求查询的json数据
 *      @param {Number}    option.limit       请求查询的数目限制
 *      @param {Number}    option.page        请求查询返回结果的页数
 *      @param {Object}    option.sort        请求查询返回结果的排序方式
 *      @param {Array}     option.indexList   设置搜索重要字段，在数组越前面权重越大（只能两个，多出无效）
 *      @param {Boolean}   option.isFuzzy     判断采取全局 模糊搜索/精确搜索 方式（模糊搜索时 创建全文索引进行搜索）
 *  @param {Function}  callback         查询操作后的回调函数
 *
 *  @callback {Object}  resultObj   回调函数的第二个参数是返回一个结果对象
 *      @callback {Number}  resultObj.totalLength   满足条件的所有数据总长度
 *      @callback {Array}   resultObj.data          10条满足条件的数据数组
 *
 *  @variation {Number}  count         应该省略的条数，只显示第一页的数目
 *  @variation {Object}  totalCursor   满足搜索条件的全局数据结果
 *  @variation {Object}  cursor        返回10条满足搜索条件的数据结果
 *
 *  db.collection(collectionName).dropIndexes();   删除一个集合中的所有索引
 * */
exports.search = function (collectionName, option, callback) {
    _connectDB(function (err, db) {
        var json = option.query || {},
            limit = Number(option.limit) || 0,
            page = Number(option.page) - 1,
            sort = option.sort || {},
            indexList = option.indexList && option.indexList.length>0 ? option.indexList : ['$**'];
        var count = page<= 0 ? 0 : page*limit;
        var indexText = {},indexWeight = {};

        if(option.isFuzzy){
            for(var i=0; i<(indexList.length<=2? indexList.length : 2); i++){
                indexText[indexList[i]] = 'text';
                indexWeight[indexList[i]] = i+1;
            }
            if(!indexWeight.hasOwnProperty('$**')) indexWeight['$**'] = 3;
            // db.collection(collectionName).dropIndexes();
            db.collection(collectionName).createIndex(indexText, { background: true, weights: indexWeight });
        }

        var totalCursor = db.collection(collectionName).find(json);
        totalCursor.toArray(function (err, total) {

            var cursor = db.collection(collectionName).find(json).limit(limit).skip(count).sort(sort);
            cursor.toArray(function (err, result) {
                if (err) {
                    console.log('查询操作失败！',err);
                    callback(err, null);
                    db.close();
                    return;
                }

                var resultObj = {
                    totalLength: total.length,
                    data: result
                };

                callback(err, resultObj);
                db.close();
            });
        });
    });
};

/**
 *  获取数据库中某集合（表）的长度（即id个数）（公开）
 *
 *  @param {String}    collectionName   进行查询操作的集合名
 *  @param {Function}  callback         查询操作后的回调函数
 *
 *  @callback {Number}   count   回调函数的第二个参数是返回集合的总长度
 * */
exports.getAllCount = function (collectionName, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    });
};

/**
 *  查找某集合表的最后一项数据指定属性的值（公开）
 *      结合上面的 getAllCount() 方法获得数据总长度 进行最后一项数据的查询操作
 *
 *  @param {String}    collectionName   进行查询操作的集合名
 *  @param {String}    key              指定属性
 *  @param {Function}  callback         查询操作后的回调函数
 *
 *  @callback {String}   value   回调函数的第二个参数是返回集合的最后一项数据指定属性的值
 * */
exports.findLastData = function (collectionName, key, callback) {
    exports.getAllCount(collectionName, function (count) {
        _connectDB(function (err, db) {
            var cursor = db.collection(collectionName).find({}).limit(1).skip(count-1);

            cursor.toArray(function (err, result) {
                if (err) {
                    console.log('查询操作失败！',err);
                    callback(err, null);
                    db.close();
                    return;
                }
                callback(err, result[0][key]);
                db.close();
            });
        });
    });
};
