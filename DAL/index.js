var pg = require('pg');
var loger = require('../libs/loger')(module);
var fs = require('fs');
var Client = pg.Client;
var config = {
    user: 'postgres', //env var: PGUSER
    database: 'TTSar', //env var: PGDATABASE
    password: '123456789', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432 //env var: PGPORT

};

class DAL {
    constructor() {

    }

    getMessages(filter, done) {
        let messages = [];
        var client = new Client(config);
        var messagesQuery = client.query({
            text: 'SELECT "Messages".id, "Messages".geo, "Messages".status, "Messages".datetime, "Messages".photo, "Messages".message   FROM public."Messages"' +
            ' WHERE status = $1 AND datetime > $2 LIMIT $3 OFFSET $4;',
            values: [filter.filter, filter.from_date, filter.count, filter.shift]
        });
        client.on('drain', function () {
            client.end.bind(client);
        });

        messagesQuery.on('end', function (result) {
            if (result.rowCount == 0) {
                let error = {
                    'data': "Не найдено ни одной строки. Скорее всего фильтр задан не правильно.",
                    'code': 11
                };
                done(error);
            } else {
                done(null);
            }
        });

        messagesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data': err,
                'code': 10
            };
            done(error);
        });
        client.connect();
        messagesQuery.on('row', function (row) {
            messages.push({
                message_id: row.id,
                datetime: row.datetime,
                message: row.message,
                status: row.status,
                geotag: row.geo,
                photo: row.photo
            });
        });
    }

    getRoutes(done) {
        loger.info('DAL - GetRoutes');
        let routes = [];
        var client = new Client(config);
        var routesQuery = client.query({
            text: 'SELECT "Routes".id, "Routes".type, "Routes".way, "Routes".status   FROM public."Routes";'
        });
        client.on('drain', function () {
            client.end.bind(client);
        });

        routesQuery.on('end', function (result) {
            done(null, routes);
        });

        routesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data': err,
                'code': 10
            };
            done(error);
        });
        client.connect();
        routesQuery.on('row', function (row) {
            routes.push({id: row.id, type: row.type, way: row.way, status: row.status});
        });

    }

    getRoute(id, done) {
        let route = {};
        var client = new Client(config);
        var routesQuery = client.query({
            text: 'SELECT "Routes".type, "Routes".way, "Routes".status, "Routes".message FROM public."Routes" WHERE "Routes".id = $1',
            values: [id]
        });

        client.on('drain', function () {
            client.end.bind(client);
        });

        routesQuery.on('end', function (result) {
            if (result.rowCount == 0) {
                let error = {
                    'data': "Не найдено такой строки. Скорее всего такого маршрута не существует.",
                    'code': 11
                };
                done(error);
            } else {
                done(null, route);
            }
        });

        routesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data': err,
                'code': 10
            };
            done(error);
        });

        client.connect();
        routesQuery.on('row', function (row) {
            route = {route: {type: row.type, way: row.way}, status: row.status, message: row.message};
        });
    }

    changeRouteStatus(route, done) {
        var client = new Client(config);

        var routesQuery = client.query({
            text: "UPDATE " + '"Routes"' + " SET  status=$3, message=$4 WHERE type=$1 AND way=$2;",
            values: [route.Type, route.Way, route.Status, route.Message]

        });
        client.on('drain', function () {
            client.end.bind(client);
        });

        routesQuery.on('end', function (result) {
            if (result.rowCount == 0) {
                let error = {
                    'data': "Ни одна строка не подверглась изменению. Скорее всего такого маршрута не существует.",
                    'code': 31
                };
                done(error);
            } else {
                done(null);
            }

        });

        routesQuery.on('row', function (row, result) {

        });

        routesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data': err,
                'code': 30
            };
            done(error);
        });
        client.connect();
    }

    changeMessageStatus(id, status, done) {
        var client = new Client(config);
        var routesQuery = client.query({
            text: "UPDATE " + '"Messages"' + " SET  status = $2 WHERE id=$1;",
            values: [id, status]

        });
        client.on('drain', function () {
            client.end.bind(client);
        });

        routesQuery.on('end', function (result) {
            if (result.rowCount == 0) {
                let error = {
                    'data': "Ни одна строка не подверглась изменению. Скорее всего такого cообщения не существует.",
                    'code': 31
                };
                done(error);
            } else {
                done(null);
            }
        });

        routesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data': err,
                'code': 30
            };
            done(error);
        });
        client.connect();
    }

    imageSave(message, done) {
        let base64image = message.photo;
        let filePath = "./uploaded_images/";
        let file = filePath + Date.now() + ".base64";
        fs.writeFile(file, base64image, 'base64', (err) => {
            if (err) {
                loger.error(err);
                let error = {
                    'data': err,
                    'code': 30  //Image upload Error
                };
                done(error);
            } else {
                this.insertMessage(message, file, done);
            }
        });
    }

    sendMessage(message, done) {
        this.imageSave(message, done)
    }

    insertMessage(message, filePath, done) {
        loger.info("DAl sendimg", message);
        var client = new Client(config);
        var routesQuery = client.query({
            text: "INSERT INTO " + '"Messages"' + " (message,photo,datetime,status,geo)  VALUES ($1, $2, $3, $4, $5)",
            values: [message.message, filePath, message.datetime, message.status, message.geotag]

        });
        client.on('drain', function () {
            client.end.bind(client);
        });

        routesQuery.on('end', function (result) {
            done(null);
        });

        routesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data': err,
                'code': 20
            };
            done(error);
        });
        client.connect();
    }
}

module.exports = DAL;