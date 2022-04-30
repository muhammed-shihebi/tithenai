const express = require("express");
const router = express.Router();
const db = require('../database/db.js');

// =========================================================== Endpoints 

router.post("/addNewUser", function (req, res, next) {
    db.addNewUser(req.body)
        .then((status) => {
            if (status === false) {
                return res.sendStatus(500)
            } else {
                return res.sendStatus(200)
            }
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(500)
        })
});

router.post("/updateUser", function (req, res, next) {
    db.updateUser(req.body)
        .then((status) => {
            return status ? res.sendStatus(200) : res.sendStatus(500);
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(500)
        })
});

router.get("/getUserInfo", function (req, res, next) {
    const uid = req.query.uid;
    db.getUserInfo(uid)
        .then((userInfo) => {
            if (userInfo) {
                res.send(userInfo)
            } else {
                return res.sendStatus(500)
            }
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(500)
        })
});

router.post("/updateUserImage", function (req, res, next) {
    db.updateUserImage(req.body)
        .then((status) => {
            return status ? res.sendStatus(200) : res.sendStatus(500);
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(500)
        })
});

router.get("/getUserTheses", function (req, res, next) {
    const uid = req.query.uid;
    db.getUserTheses(uid)
        .then((theses) => {
            if (theses) {
                res.send(theses)
            } else {
                return res.sendStatus(500)
            }
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(500)
        })
});


// =========================================================== Testing endpoints 

router.get("/deleteAllUsers", function (req, res, next) {
    db.deleteAllUsers();
    res.sendStatus(200);
});

// ===========================================================

module.exports = router;