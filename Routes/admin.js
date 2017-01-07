var express = require('express');
var app = express();
var loger = require('../libs/loger')(module);
var bodyParser = require('body-parser');
var path = require('path');
var BL = require('../BL');
var router = express.Router();
var bl = new BL();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

router.get('/messages', requestMessages);
router.post('/admin/change-status', changeRouteStatus);
router.post('/admin/change-message-status', changeMessageStatus);

function changeMessageStatus(req,res) {
    loger.info(req.headers);
    loger.info(req.params);
    loger.info(req.body);
    loger.info(req.query);
    res.sendStatus(200);
}

function changeRouteStatus(req, res) {
    loger.info(req.body);
    loger.info(req.file);
    if (bl.sendMessage(req.body, req.file)) {
        res.status(200).send("ok");
    }
    else {
        res.status(500).send("error");
    }
}

function requestMessages(req, res) {
    //if all req undifined
    var date = req.query.from_date ? new Date(req.query.from_date).toISOString() : undefined;
    let filter = { 'shift': req.query.shift,
        'count': req.query.count,
        'filter': req.query.filter,
        'from_date': date };
    bl.getMessages(filter,function (error, response) {
        if (error) {
            res.status(error.error).send(error);
        }
        else {
            res.status(200).send(response);
        }
    });
}

module.exports = router;