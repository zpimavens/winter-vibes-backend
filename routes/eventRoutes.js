module.exports = function(app,Event,SkiArea, Group)
{
    app.post('/api/add_event',(req,res) =>
    {
        var {group,name,owner,skiArena,isPrivate,description,date} = req.body

        var id = Event.estimatedDocumentCount();

        var event = new Event({id,group,name,owner,skiArena,isPrivate,description,date})

        event.save(function(err)
        {
            if(err)
            {
                console.log(err)
                res.status(409).send("Wrong input")
            }
            else
            {
                Group.findOneAndUpdate({_id: group}, {$push: {currentEvents:id}})
                if(isPrivate==false)
                {
                    SkiArea.findOneAndUpdate({_id: skiArena}, {$push: {events:id}})
                }
                res.status(201).send("Event has been added")
            }
        })
    })

    app.post('/api/delete_event',(req,res) =>
    {
        var eventId = req.body

        Event.findOne({id:eventId}, function(err, event) {
            if (err) {
              console.error(err);
              res.status(500)
                .json({
                error: 'Internal error please try again'
              });}
              else
              {
                if(!event)
                {
                    console.log("event not found")
                    res.status(404)
                    .json({
                    error: 'Event not found'
                  });
                }
                else
                {
                SkiArea.findOneAndUpdate({_id: event.skiArena}, {$pull:{events:eventId}});
                Group.findOneAndUpdate({_id: event.group}, {$pull:{currentEvents:eventId, pastEvents:eventId}});
                event.remove();
                }

              }
            });
        })


    app.post('/api/list_group_events',(req,res) =>
    {
        var groupId = req.body;  

        Event.find({"group": groupId}, (err,foundData)=>
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
    })

    app.get('/api/list_public_events',(req,res) =>
    {
        Event.find({"isPrivate": false}, (err,foundData)=>
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
    })

    app.post('/api/getEventById',(req,res)=>
{
  var {eventId} = req.body

  var select = req.query.select
  Event.find({id:eventId}, (err,foundData)=>
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

    app.post('/api/')
  
}