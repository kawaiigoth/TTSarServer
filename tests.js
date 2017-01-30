var server = require('../server');
var loger = require('./libs/loger')(module);
var request = require('request');
var expect = require('Chai').expect;
const addContext = require('mochawesome/addContext');

describe('server response', function () {
    before(function () {
        server.run();
    });

    after(function () {
        server.close();
    });
    describe('GET requests', function () {

        describe('should return 200', function () {

            it('http://localhost:8080/api/messages?shift=0&count=10&filter=unreaded&from_date=2010-10-10 - список сообщений, отфильтрованных по переданным параметрам.', function (done) {
                request('http://localhost:8080/api/messages?shift=0&count=10&filter=unreaded&from_date=2010-10-10', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });
            });

            it('http://localhost:8080/api/status - список всех маршрутов', function (done) {
                request('http://localhost:8080/api/status', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });
            });

            it('http://localhost:8080/api/get-status-info?id=1 - информация о маршруте с ID = 1', function (done) {
                request('http://localhost:8080/api/get-status-info?id=1', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });
            });

            it('http://localhost:8080/api/messages - выдает значения по умолчанию', function (done) {
                request('http://localhost:8080/api/messages', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });
            });

        });
        describe('should return 500', function () {

            it('Error - cant find with this id', function (done) {
                request('http://localhost:8080/api/get-status-info?id=100 - ошибка, маршрута с таким ID несуществует', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });
            });

            it('http://localhost:8080/api/get-status-info - ошибка, параметр ID обязателен', function (done) {
                request('http://localhost:8080/api/get-status-info', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });
            });



            it('http://localhost:8080/api/messages?shift=0&count=10&filter=unreaded&from_date=2020-10-10 - ошибка, ибо не верная дата', function (done) {
                request('http://localhost:8080/api/messages?shift=0&count=10&filter=unreaded&from_date=2020-10-10', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });
            });
        })

    });

    describe('POST requests', function () {
        describe('should return 200', function () {

            it('http://localhost:8080/api/admin/change-message-status - изменение состояния cообщения 4, на непрочитанное', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json : true,
                    body: { "message_id": 4,
                        "status": "unreaded" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-message-status - изменение состояния cообщения 4, на прочитанное', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json : true,
                    body: { "message_id": 4,
                        "status": "readed" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-status - изменение состояния троллейбуса 4 маршрута, на дежурный, и изменение его описания', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json : true,
                    body: { "route": {"type": 1, "way": 4},
                        "status": 2,
                        "message": "Some information about route status" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/user/send-message - отправка сообщения, где сожержится только сообщение', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json : true,
                    body: { "message": "description of problem"}
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/user/send-message - отправка сообщения, где кроме сообщения есть геотэги', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json : true,
                    body: { "message": "description of problem",
                        "geotag": [48,97] }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/user/send-message - отправка сообщения с текстом, геотэгами и картинкой( заместо картинки  у нас строка с текстом)', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json : true,
                    body: { "message": "description of problem",
                        "geotag": [48,97], "photo" : "Im not a photo, but here Im, like a photo =)" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    loger.info(res.body);
                    done();
                });

            });


        });
        describe('should return 500', function () {

            it('http://localhost:8080/api/admin/change-message-status - Ошибка, такого сообщения нет', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json : true,
                    body: { "message_id": 3400,
                        "status": "unreaded" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-message-status - Ошибка, отсуствует ключ message-id', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json : true,
                    body: {"status": "unreaded" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-message-status - Ошибка, неправильный статус', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json : true,
                    body: { "message_id": 4,
                        "status": "pizza" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-message-status - Ошибка, отсуствует ключ status', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json : true,
                    body: { "message_id": 4}
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-status - Ошибка, описание пустое', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json : true,
                    body: { "route": {"type": 1, "way": 4},
                        "status": 1,
                        "message": "" }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });
            it('http://localhost:8080/api/admin/change-status - Ошибка, отстуствует ключ пути/маршрута', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json : true,
                    body: { "status": 3, "message" : "Some message here"}
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-status - Ошибка, пустое тело', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json : true,
                    body: { }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-status - Ошибка, отстуствует ключ сообщения', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json : true,
                    body: { "route": {"type": 1, "way": 4},
                        "status": 3}
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/admin/change-status - Ошибка, отсуствует ключ состояния', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json : true,
                    body: { "route": {"type": 1, "way": 4},
                        "message" : "Some message here"}
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/user/send-message - Ошибка, пустое тело', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json : true,
                    body: { }
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });

            it('http://localhost:8080/api/user/send-message - Ошибка, пустое сообщение', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json : true,
                    body: { "message": ""}
                }, function (err, res, body) {
                    if(err){
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(500);
                    loger.info(res.body);
                    done();
                });

            });
        })

    })

});