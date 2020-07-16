require('dotenv').config();

var express = require('express');
var router = express.Router();
var path = process.env.PATH_TO_FAKEDATA
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { route } = require('./register');
const data = require("../data").FakeData;

// GET home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Event Scheduler' });
});

//GENERATOR OF ACCESS TOKEN
function generateAccesToken(user, remember) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: remember ? '365d' : '30m' })
}

//AUTHENTICATION OF USER
function authencticateToken(req, res, next) {
  const token = req.cookies.accessToken
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

//RETURN LOGGED USER
router.get('/api/logged', authencticateToken, (req, res) => {
  res.json(req.user)
})

//CHECK IF LOGGING USER IS VALID, IF IT IS, LOGGING WITH JWT
router.post('/api/login', (req, res) => {
  let username = req.body.username;
  let logUser = { username: username, password: crypto.createHash('sha1').update(req.body.password).digest('hex') };
  let result = data.getItem(path, logUser);
  if (result == null) return res.json(null)
  let obj = { _id: result._id, username: username }
  const accessToken = generateAccesToken(obj, JSON.parse(req.body.rememberMe))
  //STORING ACCESS TOKEN IN HTTPONLY COOKIE
  res.cookie("accessToken", accessToken, { httpOnly: true })
  res.json({ accessToken: accessToken })
})

//LOGGOUT USER
router.get('/logout', (req, res) => {
  res.clearCookie('accessToken')
  res.render('index', { title: 'Event Scheduler' });
})

//GETTING ALL USERS ROUTE
router.get('/api/get/users', (req, res) => {
  res.send(data.getAll(path, { _id: 0, username: "", events: [] },))
});

//INSERTING USER ROUTE
router.post('/api/insert/user', (req, res) => {
  data.insertUser(path, { username: req.body.username, password: req.body.password })
  res.end();
})

//INSERTING EVENT ROUTE
router.get('/api/insert/event', authencticateToken, (req, res) => {
  let obj = data.getItem(
    process.env.PATH_TO_FAKEDATA,
    { _id: req.user._id, username: req.user.username },
    { _id: 0, username: "" });
  obj.title = req.query.title
  obj.description = req.query.description;
  obj.date = req.query.date
  data.insertEvent(process.env.PATH_TO_FAKEDATA, obj)
  res.json("Event successfully added")
})

//UPDATE EVENT ROUTE
router.get('/api/update/event', authencticateToken, (req, res) => {
  let obj = data.getItem(
    process.env.PATH_TO_FAKEDATA,
    { _id: req.user._id, username: req.user.username },
    { _id: 0, username: "" });
  obj.title = req.query.title
  obj.description = req.query.description;
  obj.date = req.query.date
  data.updateEvent(process.env.PATH_TO_FAKEDATA, obj)
  res.json("Event successfully updated")
})

//DELETE EVENT ROUTE
router.get('/api/delete/event', authencticateToken, (req, res) => {
  let obj = req.query;
  obj._id = req.user._id
  obj.username = req.user.username
  data.deleteEvent(process.env.PATH_TO_FAKEDATA, obj)
  res.json("Event successfully deleted")
})

module.exports = router;
