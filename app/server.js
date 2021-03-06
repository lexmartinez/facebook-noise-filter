'use strict'

const express = require('express')
const app = express()
const scraper = require('./scraper')
const bodyParser = require('body-parser')
const join = require('path').join;
const datastore = require('nedb')
const db = new datastore({ filename: join(__dirname, '../data.db'), autoload: true })

const handleScraping = (req, res) => {
 db.findOne({}, (err, doc) => {
  const keywords = (doc) ? doc.keywords : []
  scraper(req.query.username, req.query.password, keywords).then((posts) => {
   res.render('feed', { posts, username:req.query.username, password:req.query.password})
  })
  if (!doc) {
   db.insert({keywords:[]}, (err, newDocs) => {});
  }
 })
}

const handleLogin = (req, res) => {
 res.render('index', {})
}

module.exports = () => {

 app.use(bodyParser())
 app.set('views', join(__dirname, '../views'));
 app.set('view engine', 'pug')

 app.get('/', (req, res) => {
  handleLogin(req,res)
 });

 app.get('/feed', (req, res) => {
  handleScraping(req, res)
 });

 app.get('/draggable.css', (req, res) => {
  res.send(`body {
      -ms-overflow-style: scrollbar;
      -webkit-app-region:drag;
    }
    input[type="submit"],
    input[type="reset"],
    input[type="button"],
    input[type="text"],
    button, .card,
    textarea {
      -webkit-app-region: no-drag;
    }
   .input-field input[type=text]:focus {
      border-bottom: 1px solid #000;
      box-shadow: 0 1px 0 0 #000
   }`)
 });

 return app.listen(8888);

}
