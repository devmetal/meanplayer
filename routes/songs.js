'use strict';

let express = require('express');
let multer  = require('multer');
let async   = require('async');

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
      next({
        message: 'Server error',
        causedBy: err
      });
    });
  });

  router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Song.findOneAndRemove({_id:id}, (err) => {
      if (!err) {
        return res.json({deleted:id});
      }
      return next({
        message: 'Server error',
        causedBy: err
      });
    });
  });

  router.get('/play/:id', (req, res, next) => {
    let id = req.params.id;
    async.waterfall([
      function getSong(callback) {
        Song.findOne({_id:id}, callback);
      },
      function getStream(song, callback) {
        let stream = song.getFile();
        callback(null, stream);
      }
    ], function(err, stream) {
      if (!err) {
        res.set('Content-Type', "audio/mpeg");
        return stream.pipe(res);
      }
      next({
        message: 'Server error',
        causedBy: err
      });
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
      next({
        message: 'Server error',
        causedBy: err
      });
    });
  });

  return router;
}
