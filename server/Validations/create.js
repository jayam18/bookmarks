/* eslint-disable new-cap, no-param-reassign, consistent-return */

// import express from 'express';
// import Bookmark from '../models/bookmark';
import joi from 'joi';
// const router = module.exports = express.Router();

const schema = {
  title: joi.string().required(),
  url: joi.string().uri().required(),
  description: joi.string(),
  isProtected: joi.boolean(),
  datePublished: joi.date().min('1995-01-01'),
  dateCreated: joi.date(),
  stars: joi.number().min(1).max(5),
  tags: joi.array().items(joi.string()).min(1),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    next();
  }
};
