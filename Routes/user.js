var express = require('express');
var app = express();
var loger = require('../libs/loger')(module);
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var BL = require('../BL');
var router = express.Router();
var pattExt = /\.[0-9a-z]{1,5}$/i;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploaded_images')
    },
    filename: function (req, file, cb) {
        let fileExt = file.originalname.match(pattExt);
        cb(null, file.fieldname + '-' + Date.now() + fileExt)
    }
});
var upload = multer({storage: storage}).single('photo');
var bl = new BL();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



router.get('/status', requestStatus);
router.get('/get-status-info', requestInfo);
router.post('/user/send-message', upload, sendMessage);

function requestStatus(req, res) {
    bl.getRoutes(function (error, response) {
        if (error) {
            res.status(error.error).send(error);
        }
        else {
            res.status(200).send(response);
        }
    });
}

function requestInfo(req, res) {
    //if req.query.id == undifined
    bl.getRoute(req.query.id, function (error, response) {
        if (error) {
            res.status(error.error).send(error);
        }
        else {
            res.status(200).send(response);
        }
    });
}

function sendMessage(req, res) {

    loger.info('sending');
    loger.info(req.body);
    loger.info(req.file);
    if (bl.sendMessage(req.body, req.file)) {
        res.status(200).send("ok");
    }
    else {
        res.status(500).send("error");
    }
}
module.exports = router;