const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9000;
const path = require('path');
const mysql = require('mysql');
const querystring = require('querystring');
const https = require('https');
const request = require("request")
const striptags = require('striptags');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use("/assets", express.static(__dirname + '/public'));


app.get('/', (req, res) => {

    siteData = {title: "Kampus KIT"};
    res.render('index', siteData);

});
app.get('/event', (req, res) => {
    request('https://unikom.ac.id/api/v1/event', {json: true}, (e, r, b) => {
        if (e) {
            return console.log(err);
        }
        siteData = {title: "Event", data: b, striptag: striptags};
        res.render('event', siteData);
    });
});
app.get('/frs', (req, res) => {
    res.render('frs', {title: "FRS", data: {header:[]}});
});
app.post('/frs', (req, res) => {
    var nim = req.body.nim;
    if (typeof nim != "undefined") {
        request('https://app.phpina.net/?nim=' + nim, {json: true}, (e, r, b) => {
            if (e) {
                return console.log(err);
            }
            siteData = {title: "FRS", data:b};
            res.render('frs', siteData);
        });
    } else {
        console.log("NIM Undefined "+nim);
        res.render('frs', {title: "FRS", data: {header:[]}});
    }

});
app.get('/absen', (req, res) => {
    res.render('absen', {title: "Absen"});
});
app.listen(port, () => {
    console.log("Server Running on Port : " + port);
})