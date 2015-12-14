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
    let id = req.params.id;
    yield Song.findOneAndRemove({_id:id});
    return res.json({deleted:id});
  }));

  router.get('/play/:id', wrap(function *(req, res, next){
    let id = req.params.id;
    let song = yield Song.findOne({_id:id});
    let stream = song.getFile();

    res.set('Content-Type', "audio/mpeg");
    return stream.pipe(res);
  }));

  router.post('/', wrap(function *(req, res, next){
    let asyncTasks = req.files.map(file => Song.createSong(file.buffer));
    let files = yield asyncTasks;
    return res.json({files: results});
  }));

  return router;
}
