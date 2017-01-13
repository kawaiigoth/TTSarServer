var express = require('express');
var app = express();
var path = require('path');
var loger = require('./libs/loger')(module);
var user_api = require('./Routes/user');
var admin_api = require('./Routes/admin');
var fs = require('fs');
var createImgFolder =require('./libs/createImageFolder');

createImgFolder();

app.use(express.static(__dirname + '/api'));
app.set('port', process.env.PORT || "8080");


app.use('/api', user_api);
app.use('/api', admin_api);

app.use(function (req, res) {
    res.status(404).send('not found');
});
app.use(function (err, req, res, next) {
    "use strict";
    if (process.env.NODE_ENV == 'development') {

        loger.error(err.stack);
        next(err);
    } else {
        loger.error(err.stack);
        res.sendStatus(500);
    }

});

app.listen(app.get('port'));
loger.info("Running at Port " + app.get('port'));
