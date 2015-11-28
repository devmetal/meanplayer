'use strict';

let express = require('express');
let multer  = require('multer');
let Song    = require('../model/song.schema').Model;

let router = express.Router();

router.use((req, res, next) => {
  let handler = multer({
    inMemory: true,
    onFileUploadComplete(file) {
      console.log(file);
      let buffer = file.buffer;
      Song.createSong(buffer, (err, song) => {
        req.song = song;
        next();
      });
    },

    onError(err) {
      console.log(err);
      next(err);
    }
  });

  handler(req, res, next);
});

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
  res.json(req.song);
});
