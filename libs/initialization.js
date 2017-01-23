var BL = require('../BL');
var loger = require('../libs/loger')(module);
var schedule = require('node-schedule');
var bl = new BL();
var rule = new schedule.RecurrenceRule();
rule.second = new schedule.Range(0, 59, 1);

var TTS = {
    trolls: {
        1: {
            way: 1,
            start: [17, 58],
            end: [17, 59],
            hasDuty: false
        },
        2: {
            way: 2,
            start: [17, 59],
            end: [18, 0],
            hasDuty: true
        }
    }
};

class ScheObject {
    constructor(prop, type) {
        var way = prop.way,
            start = prop.start,
            end = prop.end,
            hasDuty = prop.hasDuty,
            selfType;
        this.request = {type: undefined, way: undefined, status: undefined, message: undefined};
        if (type == "trolls") {
            selfType = 1;
        } else {
            selfType = 2;
        }

        this.initiateState(start, end, selfType, way, hasDuty);
        this.createEvent(start, end, selfType, way, hasDuty);
    }


    setRequest(obj) {
        for (var key in obj) {
            this.request[key] = obj[key];
            loger.info("SetRequest", this.request[key]);
        }
    }

    sendRequest(request) {
        loger.info("REQUEST", request);
    }

    createEvent(start, end, type, way, hasDuty) {
        loger.info(this.request);
        let Stimer = "0 " + start[1] + " " + start[0] + " * * *";
        let Etimer = "0 " + end[1] + " " + end[0] + " * * *";
        var s = schedule.scheduleJob(Stimer, function () {
            loger.info("STARTED AT 17-15!", start, end);
            this.setRequest({
                type: type,
                way: way,
                status: 1,
                message: "Автоматически созданное сообщение. Троллейбус на линии."
            });
            this.sendRequest(this.request);
        });
        var e = schedule.scheduleJob(Etimer, function () {
            loger.info("FINISHED AT 17-20!", start, end);
            if (hasDuty) {
                this.setRequest({
                    type: type,
                    way: way,
                    status: 2,
                    message: "Автоматически созданное сообщение. Троллейбус на линии."
                });
                this.sendRequest(this.request);
            }
            else {
                this.setRequest({
                    type: type,
                    way: way,
                    status: 3,
                    message: "Автоматически созданное сообщение. Троллейбус не ходит."
                });
                this.sendRequest(this.request);
            }
        });

    }

    initiateState(start, end, type, way, hasDuty) {
        let nowDate = new Date(Date.now());
        let startDate = new Date();
        let endDate = new Date();
        startDate.setHours(start[0]);
        startDate.setMinutes(start[1]);
        endDate.setHours(end[0]);
        endDate.setMinutes(end[1]);
        if (nowDate.getTime() > startDate.getTime() && nowDate.getTime() < endDate.getTime()) {
            this.setRequest({
                type: type,
                way: way,
                status: 1,
                message: "Автоматически созданное сообщение. Троллейбус на линии."
            })
        }
        else if (hasDuty) {
            this.setRequest({
                type: type,
                way: way,
                status: 2,
                message: "Автоматически созданное сообщение. Троллейбус на линии."
            })
        }
        else {
            this.setRequest({
                type: type,
                way: way,
                status: 3,
                message: "Автоматически созданное сообщение. Троллейбус не ходит."
            })
        }
    }
}


var ScheObjects = [];
var obj = TTS.trolls;

for (var prop in obj) {
    let newSwitcher = new ScheObject(obj[prop], 'trolls');
    ScheObjects.push(newSwitcher);
}


