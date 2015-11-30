'use strict';

let express = require('express');
let multer  = require('multer');
let async   = require('async');
let utils   = require('../utils');

let sb      = utils.streamBuffer;
let storage = multer.memoryStorage()
let router  = express.Router();

module.exports = (app) => {

  let Song = app.get('SongModel');

  router.use(multer({
    storage: storage
  }).array('files'));

  router.get('/', (req, res, next) => {
    Song.find((err, songs) => {
      if (!err) {
        return res.json(songs);
      }
      next(err);
    });
  });

  router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Song.findOneAndRemove({_id:id}, (err) => {
      if (!err) {
        return res.json({deleted:id});
      }
      return next(err);
    });
  });

  router.get('/play/:id', (req, res, next) => {
    let id = req.params.id;
    async.waterfall([
      function getSong(callback) {
        Song.findOne({_id:id}, callback);
      },
      function buffer(song, callback) {
        let stream = song.getFile();
        streambuffer(stream, callback);
      }
    ], function(err, buffer) {
      if (!err) {
        res.set('Content-Type', 'audio/mpeg');
        return res.send(buffer);
      }
      next(err);
    });
  });

  router.post('/', (req, res, next) => {
    let asyncTasks = [];

    req.files.forEach(file => {
      asyncTasks.push((callback) => {
        Song.createSong(file.buffer, callback);
      });
    });

    async.parallel(asyncTasks, (error, results) => {
      if (!error) {
        return res.json({files: results});
      }
      next(error);
    });
  });

  return router;
}
