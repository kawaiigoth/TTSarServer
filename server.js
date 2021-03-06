var express = require('express');
var app = express();
var path = require('path');
var loger = require('./libs/loger')(module);
var user_api = require('./Routes/user');
var admin_api = require('./Routes/admin');
var fs = require('fs');
/*var init = require('./libs/initialization');*/
var config = require('./config/index');
var server;
var createImgFolder = require('./libs/createImageFolder');

createImgFolder();


app.use(express.static(__dirname + '/api'));
app.set('port', process.env.PORT || config.get('port'));


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

function run() {
    server = app.listen(config.get('port'));
    loger.info("Running at Port " + config.get('port'));
}

function close() {
    server.close();
}

if(module.parent){
    exports.run = run;
    exports.close = close;
} else{
    run();
}