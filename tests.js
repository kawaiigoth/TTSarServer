var server = require('../server');
var loger = require('./libs/loger')(module);
var request = require('request');
var expect = require('Chai').expect;
let should = require('Chai').should();
const addContext = require('mochawesome/addContext');

describe('server response', function () {
    before(function () {
        server.run();
    });

    after(function () {
        server.close();
    });
    describe('GET requests', function () {

        describe('res 200', function () {

            it('Должен вернуть список всех маршрутов', function (done) {
                request('http://localhost:8080/api/status', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = JSON.parse(res.body);
                    data.should.have.property('result');
                    data.should.have.property('data');
                    expect(data.data).to.be.a('array');
                    done();
                });
            });

            it('Должен вернуть информацию о первом маршруте', function (done) {
                request('http://localhost:8080/api/get-status-info?id=1', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = JSON.parse(res.body);
                    data.should.have.property('result');
                    data.should.have.property('data');
                    data.data.should.have.property('route');
                    data.data.should.have.property('status');
                    data.data.should.have.property('message');
                    expect(data.data.route.way).to.be.equal(1);
                    done();
                });
            });

            it('Должен вернуть пустой объект data при несуществующем ID', function (done) {
                request('http://localhost:8080/api/get-status-info?id=10000', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = JSON.parse(res.body);
                    data.should.have.property('result');
                    data.should.have.property('data');
                    expect(data.data).to.be.empty;
                    done();
                });
            });

            it('Должен вернуть пустой объект data при отсутствующем ID', function (done) {
                request('http://localhost:8080/api/get-status-info', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = JSON.parse(res.body);
                    data.should.have.property('result');
                    data.should.have.property('data');
                    expect(data.data).to.be.empty;
                    done();
                });
            });

            it('Должен вернуть список сообщений по-умолчанию', function (done) {
                request('http://localhost:8080/api/messages', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = JSON.parse(res.body);
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.have.property('data');
                    expect(data.data).to.be.a('array');
                    done();
                });
            });

            it('Должен вернуть список сообщений, по заданным параметрам( одно сообщение )', function (done) {
                request('http://localhost:8080/api/messages?shift=0&count=1&filter=unreaded&from_date=2010-10-10', function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = JSON.parse(res.body);
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.have.property('data');
                    expect(data.data).to.be.a('array');
                    expect(data.data).to.have.lengthOf(1);
                    done();
                });
            });

        });

    });

    describe('POST requests', function () {
        describe('res 200', function () {

            it('Должен вернуть result = true, при изменении состояния сообщения на не прочитаное', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json: true,
                    body: {
                        "message_id": 4,
                        "status": "unreaded"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.not.have.property('error');
                    done();
                });

            });

            it('Должен вернуть result = true, при изменении состоянияя сообщения на прочитаное', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json: true,
                    body: {
                        "message_id": 4,
                        "status": "readed"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.not.have.property('error');
                    done();
                });

            });

            it('Должен вернуть result = true, при изменении статуса маршрута', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json: true,
                    body: {
                        "route": {"type": 1, "way": 4},
                        "status": 2,
                        "message": "Some information about route status"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.not.have.property('error');
                    done();
                });

            });

            it('Должен вернуть result = true, при отправке сообщения', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json: true,
                    body: {"message": "description of problem"}
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.not.have.property('data');
                    done();
                });

            });

            it('Должен вернуть result = true, при отправке сообщения с геоданными', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json: true,
                    body: {
                        "message": "description of problem",
                        "geotag": [48, 97]
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.not.have.property('data');
                    done();
                });

            });

            it('Должен вернуть result = true, при отправке сообщения с картинкой', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json: true,
                    body: {
                        "message": "description of problem",
                        "photo": "Im not a photo, but here Im, like a photo =)"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.not.have.property('data');
                    done();
                });

            });

            it('Должен вернуть result = true, при отправке сообщения с геоданными и картинкой', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json: true,
                    body: {
                        "message": "description of problem",
                        "geotag": [48, 97],
                        "photo": "Im not a photo, but here Im, like a photo =)"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(true);
                    data.should.not.have.property('data');
                    done();
                });

            });

            it('Должен вернуть result = false, при отпрвке сообщения с пустым body', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json: true,
                    body: {}
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

            it('Должен вернуть result = false, при отпрвке сообщения с пустым message', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/user/send-message',
                    json: true,
                    body: {"message": ""}
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

            it('Должен вернуть result = false, такого сообщения нет', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json: true,
                    body: {
                        "message_id": 340000,
                        "status": "unreaded"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

            it('Должен вернуть result = false, отсуствует ключ message-id', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json: true,
                    body: {"status": "unreaded"}
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

            it('Должен вернуть result = false, неправильный статус', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json: true,
                    body: {
                        "message_id": 4,
                        "status": "pizza"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

            it('Должен вернуть result = false, отсуствует ключ status', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-message-status',
                    json: true,
                    body: {"message_id": 4}
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });


            it('Должен вернуть result = false, отстуствует ключ пути/маршрута', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json: true,
                    body: {"status": 3, "message": "Some message here"}
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

            it('Должен вернуть result = false, пустое тело', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json: true,
                    body: {}
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

            it('Должен вернуть result = false, отсуствует ключ состояния', function (done) {
                request.post({
                    headers: {'Content-Type': 'application/json'},
                    url: 'http://localhost:8080/api/admin/change-status',
                    json: true,
                    body: {
                        "route": {"type": 1, "way": 4},
                        "message": "Some message here"
                    }
                }, function (err, res, body) {
                    if (err) {
                        loger.info(err);
                    }
                    expect(res.statusCode).to.equal(200);
                    let data = res.body;
                    data.should.have.property('result');
                    expect(data.result).to.equal(false);
                    data.should.have.property('data');
                    data.should.have.property('error');
                    expect(data.error).to.equal('02');
                    done();
                });

            });

        });

    })

});