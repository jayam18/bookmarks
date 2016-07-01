/* eslint-disable new-cap, no-param-reassign, consistent-return */

import express from 'express';
import Bookmark from '../models/bookmark';
const router = module.exports = express.Router();
import createValidator from '../Validations/create';

router.post('/', createValidator, (req, res) => {
  Bookmark.create(res.locals, (err, bookmark) => {
    res.send({ bookmark });
  });
});

router.delete('/:id', (req, res) => {
  Bookmark.remove({ _id: req.params.id }, (err) => {
    if (!err) {
      res.send({ message: 'delete success' });
    }
  });
});
