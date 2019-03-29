const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const withAuth = require('./middleware');

const app = express();

const secret = 'mysecretsshhh';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongo_uri = 'mongodb+srv://adm:passw0rd@skiapp-mxoxw.mongodb.net/test?retryWrites=true';
mongoose.connect(mongo_uri, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.js'));
});

app.get('/api/home', function(req, res) {
  res.send('Welcome!');
});

app.get('/api/secret', withAuth, function(req, res) {
  res.send('The password is potato');
});
app.post('/api/register', function(req, res) {
  const { email, password, username,image,skis,level,trophies} = req.body;
  
  var user = new User({ email, password, username,skis});
  if(image == null & level==null & trophies == null)
  {
    user = new User({ email, password, username,skis});
  }
  else if (image == null & password==null)
  {
    user = new User({ email, password, username,skis,trophies});
  }
  else if (image == null & trophies==null)
  {
    user = new User({ email, password, username,skis,password});
  }
  else if (password == null & trophies==null)
  {
    user = new User({ email, password, username,skis,image});
  }
  else if (password == null)
  {
    user = new User({ email, password, username,skis,image,trophies});
  }
  else if (image == null)
  {
    user = new User({ email, password, username,skis,trophies,password});
  }
  else
  {
    user = new User({ email, password, username,skis,image,password});
  }
  
  user.save(function(err) 
  {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});


app.post('/api/authenticate', function(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
        error: 'Incorrect email or password'
      });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
            error: 'Incorrect email or password'
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});




app.get('/api/getUserByLogin',(req,res)=>
{
  //var usernameR = "user"
  var usernameR = req.body
  var select = req.query.select
  User.find({username:usernameR}, (err,foundData)=>
  {
    if(err)
    {
      console.log(err);
      res.status(500).send()
    }
    else
    {
      if(foundData.length == 0)
      {
        var responseObject = undefined;
        if(select && select=='count')
        {
          responseObject={count:0}
        }
        res.status(404).send(responseObject)
      }
      else
      {
        var responseObject = foundData;

        if(select && select=='count')
        {
          responseObject = {count: foundData.length}
        }
        res.send(responseObject)
      }
    }
  })

});


app.get('/api/getUsers',(req,res)=>
{
  var select = req.query.select

  User.find({}, (err,foundData)=>
  {
    if(err)
    {
      console.log(err);
      res.status(500).send()
    }
    else
    {
      if(foundData.length == 0)
      {
        var responseObject = undefined;
        if(select && select=='count')
        {
          responseObject={count:0}
        }
        res.status(404).send(responseObject)
      }
      else
      {
        var responseObject = foundData;

        if(select && select=='count')
        {
          responseObject = {count: foundData.length}
        }
        res.send(responseObject)
      }
    }
  })

});



app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

app.post('/api/logout', function(req, res){
    res.clearCookie('token').sendStatus(200);
});

app.listen(process.env.PORT || 8080);


