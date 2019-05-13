const nodemailer = require('nodemailer')
const FuzzySearch = require('fuzzy-search');
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';




module.exports = function(app,User,withAuth)
{
    
app.post('/api/register', function(req, res) {
    const { email, password, username} = req.body;
  
    var activation_hash ="";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    var length=40;
  
    for (var i = 0; i < length; i++)
    {
      activation_hash += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    var user = new User({ email, password, username, activation_hash});
  
    user.save(function(err) 
    {
      if (err) 
      {
          if (err.code === 11000) {
            if(err.message.includes("email_1"))
            {
              console.log(err.message);
              res.status(409).send("email");
            }
            else
            {
              console.log(err.message);
              res.status(409).send("username");
            }
    
          }
          else{
            res.status(500).send("Internal server error!");
      }
    } 
      
      else {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth:{
            user: 'wintervibesactivation@gmail.com',
            pass: 'Vibes_19'
          }
        })
      
        var mailOptions = {
          from: 'wintervibesactivation@gmail.com',
          to: email,
          subject: 'Aktywacja konta',
          text: 'Aby aktywować, kliknij tutaj:  http://localhost:3000/activate/'+activation_hash+' lub tutaj: http://localhost:8080/api/activate/'+activation_hash
        }
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.status(500).send("email not sent")
            console.log(error);
          } else {
            res.status(201).send("Welcome to the club!");
            console.log('Email sent: ' + info.response);
          }
        });
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
            if(user.activated===true)
            {
                        // Issue token
            const payload = { email };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            res.cookie('token', token, { httpOnly: false }).sendStatus(200);
            }
            else{
              res.status(401)
              .json({
              error: 'Incorrect email or password'
            });
            }
  
          }
        });
      }
    });
  });
  
  app.get('/api/activate/:activation_hash', (req,res)=>
  {
    var activation_hash_to_find=req.params.activation_hash;
    User.findOneAndUpdate({activation_hash:activation_hash_to_find}, {$set:{activated:true}}, (err,user)=>{
      if(err){
        console.log("Couldn't activate.");
        res.status(500).send("Error, couldn't activate!");
      }
      res.status(200).send("Activated!");
    })
  
  });
  
  
  app.post('/api/resendActivation', (req,res)=>
  {
    var {email} = req.body
    User.findOne({email:email}, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      }else if(!user)
      {
        res.status(200).send("If user exists email sent.");
      } 
      else if(user.activated == false)
        {
          res.status(200).send("If user exists email sent.");
  
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
              user: 'wintervibesactivation@gmail.com',
              pass: 'Vibes_19'
            }
          })
        
          var mailOptions = {
            from: 'wintervibesactivation@gmail.com',
            to: email,
            subject: 'Aktywacja konta',
            text: 'Aby aktywować, kliknij tutaj:  http://localhost:3000/activate/'+user.activation_hash
          }
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        } else {res.status(200).send("If user exists email sent.");}
    })
  });
  
  
  
  app.post('/api/userSearch',(req,res) =>
  {
    var {username} = req.body
  
    var select = req.query.select
  
    User.find({}, (err,foundData)=>
    {
      if(err)
      {
        console.log(err);
        res.status(500).send("Internal server error")
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
          
          var searcherUsername = new FuzzySearch(responseObject, ['username'],
           {caseSensitive: false});
          
          var result = searcherUsername.search(username)
          res.status(200).send(result)
        }
        }
      }
  
    )
  })



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
  
  
  app.post('/api/editUser', (req,res)=>
  {
    User.findOneAndUpdate({ username: req.body.username }, req.body,
    function(err) {
       if (err)
       res.send(500)
       else{
       res.sendStatus(200)
      }
     });
   });
  
  
  
  app.get('/api/getCurrentUser', withAuth, function(req, res){
    User.findOne({email:req.email}, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
          error: 'Incorrect email'
        });
      } else 
        {
          var result = JSON.parse('{}');
  
          result.username = user.username;
          result.image = user.image;
          result.town = user.town;
          result.skis = user.skis;
          result.level = user.level;
          result.trophies = user.trophies;
  
          var to_return = [];
          to_return[0] = result;
          res.json(to_return);
        }
    })
  });
  
app.post('/api/getUserByLogin',(req,res)=>
{
  var {username} = req.body
  var select = req.query.select
  User.find({username:username}, (err,foundData)=>
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
}