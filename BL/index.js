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

                    if (route.message == null) {
                        route.message = "Добавьте информацию по маршруту";
                    }
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
        loger.info("SENDMESSAGE", body);
        if ('message' in body && body.message.length > 0)  {
            let message = new Message(body.message, 'geotag' in body? [body.geotag[0], body.geotag[1]] : null, new Date().toISOString(), 'photo' in body &&  body.photo.length > 0? body.photo : null, 'unreaded');
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
            let err = {
                'result': false,
                'data': 'Empty body',
                'error': '01'
            };
            done(err);
        }

    }

    changeMessageStatus(request, done) {
        if(!"status" in request || !request.status > 0){
            let err = {
                'result': false,
                'data': "Отсуствует ключ status",
                'error': "02"
            };
            done(err);
        }
        let message_id = request.message_id;
        let message_status = request.status;
        if(message_status === "readed" || message_status === "unreaded") {


            loger.info("Change this message satatus - ", message_id, message_status);
            this.dal.changeMessageStatus(message_id, message_status, function (error) {
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
        else
        {
            let err = {
                'result': false,
                'data': "Неправильный статус" + message_status,
                'error': "02"
            };
            done(err);
        }
    }

    changeRouteStatus(request, done) {
        if(request.status && request.message) {


            let route = new Route(request.route.type, request.route.way, request.status, request.message);
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
        else {
            let err = {
                'result': false,
                'data': "Отсуствует состояие или сообщение",
                'error': '02'
            };
            done(err);
        }
    }
}

module.exports = BL;