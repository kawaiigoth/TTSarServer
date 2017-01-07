var DAL = require('../DAL');
var Message = require('../Models/message');
var loger = require('../libs/loger')(module);
class BL {
    constructor() {
        this.dal = new DAL();
    }

    getRoutes(done) {
        loger.info('BL - GetRoutes');
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

    getMessages(filter,done) {
        if(!filter.shift){
            filter.shift = 0;
        }
        if(!filter.count){
            filter.count = 'ALL';
        }
        if(!filter.from_date){
            let tempDate = new Date();
            filter.from_date = new Date(tempDate.getFullYear(),tempDate.getMonth(), tempDate.getDate()).toISOString();
        }
        if(!filter.filter){
            filter.filter = 'ALL';
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

    getMessagesByRouteID(id) {

    }

    getRouteFromId(id) {

    }

    getTypeFromId(id) {

    }

    sendMessage(body, file) {
        let filePath = file ? file.path : undefined;
        let message = new Message(body.message, [body.geotag[0], body.geotag[1]], new Date().toISOString(), filePath, 'unreaded');

        return this.dal.insertMessage(message);
    }

    changeMessageStatus(message, status) {

    }

    changeRouteStatus(id, statusMessage) {

    }
}

module.exports = BL;