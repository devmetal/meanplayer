'use strict';

let express = require('express');
let multer  = require('multer');
let async = require('async');
let storage = multer.memoryStorage()

let router = express.Router();

module.exports = (app) => {

  let Song = app.get('SongModel');

  router.use(multer({
    storage: storage
  }).array('files'));

  router.get('/', (req, res, next) => {
    Song.find((err, songs) => {
      if (err) {
        return next(err);
      }
      res.json(songs);
    });
  });

  router.get('/:id', (req, res) => {
    Song.find({_id:req.id}, (err, song) => {
      if (err) {
        return next(err);
      }
      res.json(song);
    })
  });

  router.post('/', (req, res) => {
    console.log(req.files);
    async.map(req.files, (file, cb) => {
      let buffer = file.buffer;
      Song.createSong(buffer, (err, songData) => {
        if (err) {
          cb(err, null);
        } else {
          console.log('you');
          console.log(songData);
          let song = new Song();
          song.meta = songData.meta;
          song._fsId = songData.file;
          song.save(function(err){
            console.log('happening');
            if (!err) {
              console.log('saved');
              console.log(song);
              cb(null, song);
            } else {
              console.log(err);
              cb(err, null);
            }
          });
        }
      });
    }, (errors, results) => {
      console.log(errors);
      console.log(results);
      res.json({files: results});
    })
  });

  return router;
}
