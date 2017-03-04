var DAL = require('../DAL');
var Message = require('../Models/message');
var Route = require('../Models/route');

var loger = require('../libs/loger')(module);
class BL {
    constructor() {
        this.dal = new DAL();
    }

    getRoutes(done) {
        this.dal.getRoutes(function (error, routes) {
            if (error) {
                let err = {
                    'result': false,
                    'data': error.data,
                    'error': error.code
                };
                done(err);
            }
            else {
                let res = {
                    'result': true,
                    'data': routes
                };
                done(null, res);
            }

        });
    }

    getRoute(id, done) {
        this.dal.getRoute(id,
            function (error, route) {
                if (error) {
                    let err = {
                        'result': false,
                        'data': error.data,
                        'error': error.code
                    };

                    done(err);
                }
                else {
                    let res = {
                        'result': true,
                        'data': route
                    };
                    done(null, res);
                }
            });
    }

    getMessages(filter, done) {
        if (!filter.shift) {
            filter.shift = 0;
        }
        if (!filter.count) {
            filter.count = '25';
        }
        if (!filter.from_date) {
            let tempDate = new Date();
            filter.from_date = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()).toISOString();
        }
        if (!filter.filter) {
            filter.filter = 'unreaded';
        }
        this.dal.getMessages(filter,
            function (error, messages) {
                if (error) {
                    let err = {
                        'result': false,
                        'data': error.data,
                        'error': error.code
                    };

                    done(err);
                }
                else {


                    let res = {
                        'result': true,
                        'data': messages
                    };
                    done(null, res);
                }
            });
    }

    sendMessage(body, done) {
        if ('message' in body && body.message.length > 0) {
            let message = new Message(body.message, 'geotag' in body ? [body.geotag[0], body.geotag[1]] : null, new Date().toISOString(), 'photo' in body && body.photo.length > 0 ? body.photo : null, 'unreaded');
            this.dal.sendMessage(message, function (error) {
                if (error) {
                    let err = {
                        'result': false,
                        'data': error.data,
                        'error': error.code
                    };
                    done(err);
                }
                else {
                    let res = {
                        'result': true
                    };
                    done(null, res);
                }

            });
        }
        else {
            let res = {
                'result': false,
                'data': 'Empty body',
                "error": "02"
            };
            done(null, res);
        }

    }

    changeMessageStatus(request, done) {
        if (!"status" in request || !request.status > 0) {
            let res = {
                'result': false,
                'data': "Отсуствует ключ status",
                'error': "02"
            };
            done(null, res);
        } else if (!"message_id" in request || !request.message_id > 0) {
            let res = {
                'result': false,
                'data': "Отсуствует или пустой ID",
                'error': "02"
            };
            done(null, res);
        } else if (request.status != "readed" && request.status != "unreaded") {
            let res = {
                'result': false,
                'data': "Неправильный статус " + request.status,
                'error': "02"
            };
            done(null, res);
        } else {
            let message_id = request.message_id;
            let message_status = request.status;
            this.dal.changeMessageStatus(message_id, message_status, function (error, res) {
                if (error) {
                    let err = {
                        'result': false,
                        'data': error.data,
                        'error': error.code
                    };
                    done(err);
                } else if (res) {
                    let resp = {
                        'result': false,
                        'data': res.data,
                        'error': res.code
                    };
                    done(null, resp);
                }
                else {
                    let res = {
                        'result': true
                    };
                    done(null, res);
                }

            });
        }

    }

    changeRouteStatus(request, done) {
        if (!"status" in request || !request.status > 0) {
            let res = {
                'result': false,
                'data': "Отсуствует ключ status",
                'error': "02"
            };
            done(null, res);
        } else if (!request.route) {
            let res = {
                'result': false,
                'data': "Отсуствует ключ type или way",
                'error': "02"
            };
            done(null, res);
        } else {
            let route = new Route(request.route.type, request.route.way, request.status, request.message? request.message : null);
            this.dal.changeRouteStatus(route, function (error) {
                if (error) {
                    let err = {
                        'result': false,
                        'data': error.data,
                        'error': error.code
                    };
                    done(err);
                }
                else {
                    let res = {
                        'result': true
                    };
                    done(null, res);
                }

            });
        }
    }
}


module.exports = BL;