var pg = require('pg');
var loger = require('../libs/loger')(module);
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

    getMessages(filter,done) {
        let messages = [];
        var client = new Client(config);
        var messagesQuery = client.query({
            text: 'SELECT "Messages".id, "Messages".geo, "Messages".status, "Messages".datetime, "Messages".photo, "Messages".message   FROM public."Messages"' +
            ' WHERE status = $1 AND datetime > $2 LIMIT $3 OFFSET $4;',
            values:[filter.filter,filter.from_date,filter.count,filter.shift]
        });
        client.on('drain', function () {
            client.end.bind(client);
        });

        messagesQuery.on('end', function (result) {
            done(null,messages);
        });

        messagesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data' : err,
                'code' : 500
            };
            done(error);
        });
        client.connect();
        messagesQuery.on('row', function (row){
            messages.push({message_id: row.id, datetime: row.datetime, message: row.message, status: row.status, geotag: row.geo, photo: row.photo});
        });
    }

    insertMessage(message) {
        if (Object.keys(message).length === 0) {
            return false;
        }
        else {
            var client = new Client(config);
            var routesQuery = client.query({
                text: 'INSERT INTO "Messages"(message, photo, geo, datetime, status) VALUES ($1,$2,$3,$4,$5)',
                values: [message.message, message.photo, message.geotag, message.datetime, message.status]
            }, function (err, result) {
                if (err) {
                    loger.error(err);
                    return false;
                }

            });
            client.on('drain', function () {
                client.end.bind(client);
            });
            client.connect();
            return true;
        }

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
            done(null,routes);
        });

        routesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data' : err,
                'code' : 500
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
            done(null,route);
        });

        routesQuery.on('error', function (err) {
            loger.error(err);
            let error = {
                'data' : err,
                'code' : 500
            };
            done(error);
        });

        client.connect();
        routesQuery.on('row', function (row) {
            route = {route: {type: row.type, way: row.way}, status: row.status, message: row.message};
        });
    }
}

module.exports = DAL;