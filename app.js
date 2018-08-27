const express = require('express'),
    app = express(),
    token = require('./token'),
    pug = require('pug');



app.listen(process.env.PORT || 80);