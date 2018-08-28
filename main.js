const express = require('express');
const bodyParser = require('body-parser');
var dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT;
const path = require('path');
const mysql = require('mysql');
const querystring = require('querystring');
const https = require('https');
const request = require("request");
const striptags = require('striptags');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'primajasa'
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use("/assets", express.static(__dirname + '/public'));


app.get('/', (req, res) => {

  siteData = {
    title: "Kampus KIT"
  };
  res.render('index', siteData);

});
app.get('/event', (req, res) => {
  request('https://unikom.ac.id/api/v1/event', {
    json: true
  }, (e, r, b) => {
    if (e) {
      return console.log(err);
    }
    siteData = {
      title: "Event",
      data: b,
      striptag: striptags
    };
    res.render('event', siteData);
  });
});
app.get('/frs', (req, res) => {
  res.render('frs', {
    title: "FRS",
    data: {
      header: []
    }
  });
});
app.post('/frs', (req, res) => {
  var nim = req.body.nim;
  if (typeof nim != "undefined") {
    request('https://sms.unikom.ac.id/ridwan/keuangan_mhs.php?showdetail=mahasiswa&nim=' + nim, {
      json: true
    }, (e, r, b) => {
      if (e) {
        return console.log(err);
      }
      siteData = {
        title: "FRS",
        data: b
      };
      res.render('frs', siteData);
    });
  } else {
    console.log("NIM Undefined " + nim);
    res.render('frs', {
      title: "FRS",
      data: {
        header: []
      }
    });
  }

});
app.get('/absen', (req, res) => {
  res.render('absen', {
    title: "Absen"
  });
});
app.get("/contohjson/:id", (req, res) => { //3
  var id = req.params.id;
  connection.connect()
  connection.query('INSERT INTO terminal(nama_terminal) VALUES("'+id+'")', function(err, rows, fields) {
    if (err) throw err
    console.log('The solution is: ', rows);
  })
  if (id == "Contoh 1") {
    res.json({
      text: "Contoh 1"
    });
  } else {
    res.json({
      text: "Contoh 2"
    });
  }
});
app.get('/contoh', (req, res) => { // 1
  res.render('contoh', {
    title: "Contoh Halaman"
  });
});
app.listen(port, () => {
  console.log("Server Running on Port : " + port);
})
