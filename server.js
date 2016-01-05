var express = require("express");
var app = express();
var mongojs = require('mongojs')
var db = mongojs('url', ['url'])
var http = require("http");
var baseUrl = "https://url-shortener-akiralaine.c9users.io"

app.get("/new/http\://:url", function (req, res) {
    var url = "http://" + req.params.url;
    var regex = /^(http?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (regex.test(url) === true) {
        db.url.findOne({original: url}, function(err, doc) {
            if (err === null && doc !== null) {
                res.json({original_url: doc.original, short_url: baseUrl + "/" + doc.short});
            } else {
                db.url.find().count(function(err, num) {
                    db.url.insert({original: url, short: num + 1});
                    res.json({original_url: url, short_url: baseUrl + "/" + (num + 1)});
                });
            }
        });
    } else{
        res.json({"error": "Invalid URL."});
    }
});

app.get("/new/https\://:url", function(req, res) {
    var url = "https://" + req.params.url;
    var regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (regex.test(url) === true) {
        db.url.findOne({original: url}, function(err, doc) {
            if (err === null && doc !== null) {
                res.json({original_url: doc.original, short_url: baseUrl + "/" + doc.short});
            } else {
                db.url.find().count(function(err, num) {
                    db.url.insert({original: url, short: num + 1});
                    res.json({original_url: url, short_url: baseUrl + "/" + (num + 1)});
                });
            }
        });
    } else{
        res.json({"error": "Invalid URL."});
    }
});

app.get("/:num", function(req,res){
    console.log("-" + req.params.num + "-");
    var num = Number(req.params.num);
    console.log(num, typeof num);
    db.url.findOne({"short": num}, function(err, doc) {
        //console.log("THIS IS ME: " + doc.original);
        if (err === null && doc !== null) {
            console.log(doc);
            res.writeHead(301, {Location: doc.original});
            res.end()
        } else {
            res.json({error: "Could not find a url with that value."});
            res.end();
        }
    })
})

app.listen(process.env.PORT || 80);