'use strict';

const http = require('http');
const https = require('https');
const express = require('express');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const sim = require('./service/SimHandler');
// const options = {
//     key: fs.readFileSync('../lets_encript.key'),
//     cert: fs.readFileSync('../lets_encript_fullchain.crt')
// };
const app = express();
// function logErrors(err, req, res, next) {
//     console.error(err.stack);
//     next(err);
// }
// function errorHandler(err, req, res, next) {
//     res.status(500);
//     res.send({ error: err });
// }

// app.use(logErrors);
// app.use(errorHandler);

// app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", express.static(__dirname + '/public'));

app.use('/api/sim', sim);

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With');
// });

app.get('/api/getSchedule', (req, res) => {
    console.log('アクセス中');
    // アクセストークン取得
    const options = {
        method: 'POST',
        url: "https://account-dev4.jorte.com/api/oauth2/token",
        form: {
            "grant_type":"password",
            "username":"katsuta_demo_asset1",
            "password":"katsuta_demo",
            "client_id":"hitachi-chronolink"
        },
        json: true
    }
    request(options, function(error, response, body) {
        // アクセストークン取得後、イベント情報取得
        const options = {
            method: 'GET',
            url: 'https://dev4.jorte.com/api/v1/calendars/5d847d8fe4b02583028a5e1b/events',
            headers: {
                'Authorization': `Bearer ${body['access_token']}`
            }
        }
        request(options, function(error, response, body) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.send(body);
        })
        // res.send(body['access_token']);
    })
})

app.post('/api/postSchedule', (req, res) => {
    // アクセストークン取得
    const options = {
        method: 'POST',
        url: "https://account-dev4.jorte.com/api/oauth2/token",
        form: {
            "grant_type":"password",
            "username":"katsuta_demo_asset1",
            "password":"katsuta_demo",
            "client_id":"hitachi-chronolink"
        },
        json: true
    }

    request(options, function(error, response, body) {
        // アクセストークン取得後、イベント情報登録
        console.log(req.body);
        const options = {
            method: 'POST',
            url: 'https://dev4.jorte.com/api/v1/calendars/5d847d8fe4b02583028a5e1b/events',
            headers: {
                'Authorization': `Bearer ${body['access_token']}`,
                'Content-Type': 'application/json'
            },
            json: req.body
        }

        request(options, function(error, response, body) {
            if(error) {
                next(error)
            } else {
                res.header('Access-Control-Allow-Origin', req.headers.origin);
                res.send(response);
            }
        })
        // res.send(body['access_token']);
    })
})

app.post('api/updateSchedule/:id', (req, res) => {
    // アクセストークン取得
    const options = {
        method: 'POST',
        url: "https://account-dev4.jorte.com/api/oauth2/token",
        form: {
            "grant_type":"password",
            "username":"katsuta_demo_asset1",
            "password":"katsuta_demo",
            "client_id":"hitachi-chronolink"
        },
        json: true
    }

    request(options, function(error, response, body) {
        // アクセストークン取得後、イベント情報更新
        const options = {
            method: 'PUT',
            url: `https://dev4.jorte.com/api/v1/calendars/5d847d8fe4b02583028a5e1b/events/${req.params.id}`,
            headers: {
                'Authorization': `Bearer ${body['access_token']}`,
                'Content-Type': 'application/json'
            },
            json: req.body
        }

        request(options, function(error, response, body) {
            if(error) {
                next(error);
            } else {
                res.header('Access-Control-Allow-Origin', req.headers.origin);
                res.send(body);
            }
        })
        // res.send(body['access_token']);
    })
})

app.get('/api/deleteSchedule/:id', (req, res) => {
    // アクセストークン取得
    const options = {
        method: 'POST',
        url: 'https://account-dev4.jorte.com/api/oauth2/token',
        form: {
            "grant_type":"password",
            "username":"katsuta_demo_asset1",
            "password":"katsuta_demo",
            "client_id":"hitachi-chronolink"
        },
        json: true
    }

    request(options, function(error, response, body) {
        // アクセストークン取得後、イベント情報削除
        const options = {
            method: 'DELETE',
            url: `https://dev4.jorte.com/api/v1/calendars/5d847d8fe4b02583028a5e1b/events/${req.params.id}`,
            headers: {
                'Authorization': `Bearer ${body['access_token']}`,
            },
        }

        request(options, function(error, response, body) {
            if(error) {
                next(error);
            } else {
                res.header('Access-Control-Allow-Origin', req.headers.origin);
                res.send(response);
            }
        })
        // res.send(body['access_token']);
    })
})

// const server = http.createServer(function (req, res) {
//     let url = 'public' + (req.url.endsWith('/') ? req.url + 'index.html' : req.url);
//     if (fs.existsSync(url)) {
//         fs.readFile(url, (err, data) => {
//             if(!err) {
//                 res.writeHead(200, {'Content-Type': getType(url)});
//                 res.end(data);
//             } else {
//                 res.statusCode = 500;
//                 res.end();
//             }
//         });
//     } else {
//         res.statusCode = 404;
//         res.end();
//     }
// });

const port = '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log('To view your app, open this link in your browser: http://localhost:' + port);
});
