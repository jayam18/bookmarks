/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const Bookmark = require('../../dst/models/bookmark');

// const mongoose = require('mongoose');

describe('bookmarks', () => {
  // beforeEach((done) => {
  //   mongoose.connection.db.dropDatabase(() => {
  //     done();
  //   });
  // });

  describe('post /bookmarks', () => {
    it('should create a bookmark', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'http://google.com', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.bookmark.__v).to.not.be.null;
        expect(rsp.body.bookmark._id).to.not.be.null;
        expect(rsp.body.bookmark.url).to.equal('http://google.com');
        done();
      });
    });

    it('should NOT create a bookmark - missing title', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ url: 'http://google.com', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"title" is required']);
        done();
      });
    });

    it('should NOT create a bookmark - date published problem', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'http://google.com', description: 'c',
              isProtected: true, datePublished: '1816-03-15',
              stars: 3, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"datePublished" must be larger than or equal to "Sat Dec 31 1994 18:00:00 GMT-0600 (CST)"']);
        done();
      });
    });

    it('should NOT create a bookmark - url is malformed', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'garbage', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"url" must be a valid uri']);
        done();
      });
    });

    it('should NOT create a bookmark - stars has wrong number', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'http://google.com', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 20, tags: ['d', 'e'] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"stars" must be less than or equal to 5']);
        done();
      });
    });

    it('should NOT create a bookmark - must have at least one tag', (done) => {
      request(app)
      .post('/bookmarks')
      .send({ title: 'a', url: 'http://google.com', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 3, tags: [] })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"tags" must contain at least 1 items']);
        done();
      });
    });

    it('should should delete a bookmark', (done) => {
      Bookmark.create({ title: 'a', url: 'http://google.com', description: 'c',
              isProtected: true, datePublished: '2016-03-15',
              stars: 20, tags: ['d', 'e'] }, (dberr, bookmark) => {
        request(app)
        .delete(/bookmarks/ + bookmark._id)
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.message).to.equal('delete success');
          done();
        });
      });
    });
  });
});
