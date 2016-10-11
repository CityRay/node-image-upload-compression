/*
* @Author: RayLin
* @Date:   2016-10-06 15:42:23
* @Last Modified by:   RayLin
* @Last Modified time: 2016-10-11 14:48:25
*/

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
// const util = require('util');
const logger = require('morgan');

// customization
const routerv1 = require('./router_v1');

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

// create a write stream (in append mode)
const today = new Date();
const accesslogname = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
const accessLogStream = fs.createWriteStream(__dirname + '/access-' + accesslogname + '.log', {flags: 'a'});
app.use(logger('combined', {stream: accessLogStream})); // for log

app.use(bodyParser.json());
app.use('/v1', routerv1);



const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, function() {
    console.log("Listening on", HOST, PORT);
});
