'use strict';

let express = require('express');
let multer  = require('multer');
let async   = require('async');
let wrap    = require('co-express');

let storage = multer.memoryStorage()
let router  = express.Router();

module.exports = (app) => {

  let Song = app.get('SongModel');

  router.use(multer({
    storage: storage
  }).array('files'));

  router.get('/', wrap(function *(req, res){
    let songs = yield Song.find();
    return res.json(songs);
  }));

  router.delete('/:id', wrap(function *(req, res){
    yield Song.findOneAndRemove({_id:req.params.id});
    return res.json({deleted:req.params.id});
  }));

  router.get('/play/:id', wrap(function *(req, res){
    let song = yield Song.findOne({_id:req.params.id});
    let stream = song.getFile();

    res.set('Content-Type', "audio/mpeg");
    return stream.pipe(res);
  }));

  router.post('/', wrap(function *(req, res){
    let createSong = (file) => new Promise((resolve, reject) => {
      Song.createSong(file.buffer, (err, song) => {
        if (err) return reject(err);
        resolve(song);
      })
    });

    let asyncTasks = req.files.map(createSong);
    let files = yield asyncTasks;
    return res.json({files: files});
  }));

  router.use(function(err, req, res, next) {
    console.log(err.message);
    console.log(err.stack);
    next(err);
  });

  router.use(function(err, req, res, next){
    if (req.xhr) {
      res.status(500).send({error: 'Server error'});
    } else {
      next(err);
    }
  });

  return router;
}
