var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var EventEmitter = require('events');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//Initialize models
require('./model')(app);

var routes = require('./routes/index');
var songs  = require('./routes/songs')(app);

app.use('/', routes);
app.use('/songs', songs);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.log(err.message);
  if (err.causedBy) {
    console.log(err.causedBy.message);
    console.log(err.causedBy.stack);
  }
  next(err);
});

app.use(function(err,req,res,next){
    if (req.xhr) {
      res.status(500).send({error: err.message});
    } else {
      next(err);
    }
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
