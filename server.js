const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const SkiArea = require('./models/skiarea');
const Group = require('./models/Group');
const Event = require('./models/Event')
const withAuth = require('./middleware');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
require('./routes/userRoutes')(app,User,withAuth)
require('./routes/skiAreaRoutes')(app,SkiArea)
require('./routes/groupRoutes')(app,Group)
require('./routes/eventRoutes')(app, Event, SkiArea, Group)

const mongo_uri = 'mongodb+srv://adm:passw0rd@skiapp-mxoxw.mongodb.net/test?retryWrites=true';
mongoose.connect(mongo_uri, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

//?????
var clearingUnactivatedUsers = setInterval(clearUnactivated, 60000); //userów nieaktywowanych od 30 minut czyścimy co minute
 // var movingOldEventsToPast = setInterval(moveEventsToPast, 3600000); //eventy, których data wydarzenia jest starsza od obecnej daty o więcej niż doba są przenoszone 
                                                                        //do pastevents w grupach i usuwane z skiaren -- jeszcze nietestowane




app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.js'));
});

app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

app.post('/api/logout', function(req, res){
    res.clearCookie('token').sendStatus(200);
});

app.listen(process.env.PORT || 8080);


function clearUnactivated()
{
  var deleted = 0;
  now = new Date();

  now.setMinutes(now.getMinutes()-30);

  User.countDocuments({activated: false, created: {$lte : now}}, function (err, count){
    if(err)
    {
      console.log("Error counting users to delete.")
    }
    else
    {
      deleted = count;
    }
  })

  User.deleteMany({activated: false, created: {$lte : now}}, function (err, user)
  {
    if(err)
    {
      console.log("Error clearing unactivated users.")
    }
    else
    {
      if(deleted!=0)
      {
        console.log("Cleared "+deleted+" unactivated users.")
      }    
    }
  })
}

function moveEventsToPast()
{
    now = new Date();
    now.setDay(now.getDay()-1);

    var eventsToMove = [];

    Event.find({date: {$lte:now}, isCurrent: true}, function (err,array){
        if(err)
        {
            console.log(err);
            res.status(500).send()
        }
        else{
            eventsToMove = array;
        }
    })

    for(var i = 0; i < eventsToMove.length; i++)
    {
        SkiArea.findOneAndUpdate({_id: eventsToMove[i].skiArena}, {$pull:{events:eventsToMove[i].id}});
        Group.findOneAndUpdate({_id: eventsToMove[i].group}, {$push: {pastEvents:eventsToMove[i].id}, $pull:{currentEvents:eventsToMove[i].id}});
        Event.findOneAndUpdate({id: eventsToMove[i].id}, {isCurrent: false});
    }
}


