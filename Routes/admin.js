var express = require('express');
var loger = require('../libs/loger')(module);
var bodyParser = require('body-parser');
var path = require('path');
var BL = require('../BL');
var router = express.Router();
var bl = new BL();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.get('/messages', requestMessages);
router.post('/admin/change-status', changeRouteStatus);
router.post('/admin/change-message-status', changeMessageStatus);

function changeMessageStatus(req,res) {
    bl.changeMessageStatus(req.body,function (error, response) {
        if (error) {
            res.status(500).send(error);
        }
        else {
            res.status(200).send(response);
        }
    });
}

function changeRouteStatus(req, res) {
    bl.changeRouteStatus(req.body,function (error, response) {
        if (error) {
            res.status(500).send(error);
        }
        else {
            res.status(200).send(response);
        }
    });
}

function requestMessages(req, res) {
    var date = req.query.from_date ? new Date(req.query.from_date).toISOString() : undefined;
    let filter = { 'shift': req.query.shift,
        'count': req.query.count,
        'filter': req.query.filter,
        'from_date': date };
    bl.getMessages(filter,function (error, response) {
        if (error) {
            res.status(500).send(error);
        }
        else {
            res.status(200).send(response);
        }
    });
}

module.exports = router;