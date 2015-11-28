'use strict';

let express = require('express');
let multer  = require('multer');
let storage = multer.memoryStorage()
let Song    = require('../model/song.schema').Model;

let router = express.Router();

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
  console.log('something');
  console.log(req.files);
  /*let buffer = req.file.buffer;
  Song.createSong(buffer, (err, song) => {
    res.json(song);
  });*/
  res.json({ok:true});
});

module.exports = router;
