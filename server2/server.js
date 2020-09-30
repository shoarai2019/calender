'use strict';

const http = require('http');
// const https = require('https');
const cluster = require('cluster');
const os = require('os');
const accessLogger = require("./lib/log/accessLogger");
const logger = require("./lib/log/logger").application;
const systemLogger = require("./lib/log/systemLogger");
const express = require('express');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const sim = require('./service/SimHandler');
const net = require('net');

const numCPUs = os.cpus().length;
if(cluster.isMaster) {
    console.log('Master');

    // Worker を生成する
    // for(let i = 0; i < numCPUs; i++) {
    //   console.log(`Master : Cluster Fork ${i}`);
      cluster.fork();
    // }

    // Worker がクラッシュしたら再生成する
    cluster.on('exit', (worker, code, signal) => {
      console.warn(`[${worker.id}] Worker died : [PID ${worker.process.pid}] [Signal ${signal}] [Code ${code}]`);
      cluster.fork();
    });
} else {
    console.log(`[${cluster.worker.id}] [PID ${cluster.worker.process.pid}] Worker`);
    // Express サーバの実装は元のまま変更なし (コンソール出力の内容だけ加工)


    // const options = {
    //     key: fs.readFileSync('./key/server.rsa'),
    //     cert: fs.readFileSync('./key/server.crt')
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

    app.use(systemLogger());
    app.use(accessLogger());

    // app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.urlencoded({extended: true}));

    app.use("/", express.static(__dirname + '/public'));

    app.use('/api/sim', sim);

    app.get('/api/getSchedule', (req, res) => {
        let url = '';
        if(req.query.id) {
            url = '/' + req.query.id;
        }
        // アクセストークン取得
        const options = {
            method: 'POST',
            url: "https://account-dev4.jorte.com/api/oauth2/token",
            form: {
                "grant_type":"password",
                "username":"katsuta_demo_asset2",
                "password":"katsuta_demo",
                "client_id":"hitachi-chronolink"
            },
            json: true
        }
        request(options, function(error, response, body) {
            // アクセストークン取得後、イベント情報取得
            // 5d847d8fe4b02583028a5e1b 1
            // 5d847d90e4b02583028a5e1d 2
            const options = {
                method: 'GET',
                url: 'https://dev4.jorte.com/api/v1/calendars/5d847d90e4b02583028a5e1d/events' + url,
                headers: {
                    'Authorization': `Bearer ${body['access_token']}`
                }
            }
            request(options, function(error, response, body) {
                if(error) {
                    logger.error("schedule-api", 'getSchedule: ' + error);
                    next(error)
                } else {
                    logger.debug('getgetSchedule');
                    res.header('Access-Control-Allow-Origin', req.headers.origin);
                    res.send(body);
                }
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
                "username":"katsuta_demo_asset2",
                "password":"katsuta_demo",
                "client_id":"hitachi-chronolink"
            },
            json: true
        }

        request(options, function(error, response, body) {
            // アクセストークン取得後、イベント情報登録
            // console.log(req.body);
            const options = {
                method: 'POST',
                url: 'https://dev4.jorte.com/api/v1/calendars/5d847d90e4b02583028a5e1d/events',
                headers: {
                    'Authorization': `Bearer ${body['access_token']}`,
                    'Content-Type': 'application/json'
                },
                json: req.body
            }

            request(options, function(error, response, body) {
                if(error) {
                    next(error);
                    logger.error("schedule-api", 'postSchedule: ' + error);
                } else {
                    logger.debug('post');
                    res.header('Access-Control-Allow-Origin', req.headers.origin);
                    res.send(response);
                }
            })
            // res.send(body['access_token']);
        })
    })

    app.post('/api/updateSchedule/:id', (req, res) => {
        // アクセストークン取得
        const options = {
            method: 'POST',
            url: "https://account-dev4.jorte.com/api/oauth2/token",
            form: {
                "grant_type":"password",
                "username":"katsuta_demo_asset2",
                "password":"katsuta_demo",
                "client_id":"hitachi-chronolink"
            },
            json: true
        }

        request(options, function(error, response, body) {
            // アクセストークン取得後、イベント情報更新
            const options = {
                method: 'PUT',
                url: `https://dev4.jorte.com/api/v1/calendars/5d847d90e4b02583028a5e1d/events/${req.params.id}`,
                headers: {
                    'Authorization': `Bearer ${body['access_token']}`,
                    'Content-Type': 'application/json'
                },
                json: req.body
            }

            request(options, function(error, response, body) {
                if(error) {
                    next(error);
                    logger.error("schedule-api", 'updateSchedule: ' + error);
                } else {
                    logger.debug('update');
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
                "username":"katsuta_demo_asset2",
                "password":"katsuta_demo",
                "client_id":"hitachi-chronolink"
            },
            json: true
        }

        request(options, function(error, response, body) {
            // アクセストークン取得後、イベント情報削除
            const options = {
                method: 'DELETE',
                url: `https://dev4.jorte.com/api/v1/calendars/5d847d90e4b02583028a5e1d/events/${req.params.id}`,
                headers: {
                    'Authorization': `Bearer ${body['access_token']}`,
                },
            }

            request(options, function(error, response, body) {
                if(error) {
                    next(error);
                    logger.error("schedule-api", 'deleteSchedule: ' + error);
                } else {
                    logger.debug('delete');
                    res.header('Access-Control-Allow-Origin', req.headers.origin);
                    res.send(response);
                }
            })
            // res.send(body['access_token']);
        })
    })

    app.post('/api/wagon', (req, res) => {
        // console.log('通信開始');

        //. 接続先 IP アドレスとポート番号
        var host = '210.156.168.73';
        var port = 50010;

        //. 接続
        var client = new net.Socket();
        client.connect( port, host, function(){
            logger.debug( 'Socket接続: ' + host + ':' + port );

            //. サーバーへメッセージを送信
            client.write(JSON.stringify(req.body));
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.send('Socket通信で送信');
        });

        client.on('error', function(error) {
            logger.error('wagon-socket', 'connection error: ' + error);
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.send('Socket通信失敗:' + error);
        });

        //. サーバーからメッセージを受信したら、その内容を表示する
        client.on( 'data', function( data ){
            logger.debug( data );
        });

        //. 接続が切断されたら、その旨をメッセージで表示する
        client.on( 'close', function(){
            logger.error('wagon-socket', 'connection is close: ' + error);
        })

        res.header('Access-Control-Allow-Origin', req.headers.origin);
    })

    const port = '3000';
    app.set('port', port);

    const server = http.createServer(app);
    server.listen(port, () => {
        console.log('To view your app, open this link in your browser:' + port);
    });

}
