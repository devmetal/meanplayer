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
      console.log(songs);
      res.json(songs);
    });
  });

  router.delete('/:id', (req, res) => {
    console.log('request delete');
    let id = req.params.id;
    Song.findOneAndRemove({_id:id}, (err) => {
      if (err) {
        return next(err);
      }
      res.json({deleted:id});
    });
  });

  router.get('/play/:id', (req, res) => {
    let id = req.params.id;
    Song.findOne({_id:id}, (err, song) => {
      if (err) {
        return next(err);
      }
      song.getFile().pipe(res);
    });
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
