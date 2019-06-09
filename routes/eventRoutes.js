module.exports = function (app, Event, SkiArea, Group, mongoose) {
  app.post('/api/add_event', (req, res) => {
    var { group, name, owner, skiArena, isPrivate, description, startDate, endDate } = req.body

    //var id_to_save = Event.estimatedDocumentCount();

    //var id = id.toString();

    var event = new Event({ group, name, owner, skiArena, isPrivate, description, startDate, endDate })

    event.save(function (err, saved) {
      if (err) {
        console.log(err)
        res.status(409).send("Wrong input")
      }
      else {
        Group.findOneAndUpdate({ _id: saved.group }, { $push: { currentEvents: saved._id } }, function (err, group) {
          if (err) {
            console.log("Error adding event to group");
          }
          else {
            console.log("Event added to group");
          }
        })
        if (isPrivate == false) {
          SkiArea.findOneAndUpdate({ _id: skiArena }, { $push: { events: saved._id } }, function (err, skiarena) {
            if (!skiarena) {
              console.log("not found");
            }
            else {
              if (err) {
                console.log("Error adding event to skiarena");
              }
              else {
                console.log("Event added to skiarena");
              }
            }

          })
        }
        res.status(201).send("Event has been added")
      }
    })
  })

  app.post('/api/delete_event', (req, res) => {
    var { eventId } = req.body

    Event.findOne({ _id: eventId }, function (err, event) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
            error: 'Internal error please try again'
          });
      }
      else {
        if (!event) {
          console.log("event not found")
          res.status(404)
            .json({
              error: 'Event not found'
            });
        }
        else {
          SkiArea.findOneAndUpdate({ _id: event.skiArena }, { $pull: { events: eventId } }, function (err, skiarena) {
            if (err) {
              console.log("Couldn't remove from skiarena");
            }
            else {
              console.log("Removed from skiarena");
            }
          });
          Group.findOneAndUpdate({ _id: event.group }, { $pull: { currentEvents: eventId, pastEvents: eventId } }, function (err, skiarena) {
            if (err) {
              console.log("Couldn't remove from group");
            }
            else {
              console.log("Removed from group");
            }
          });
          event.remove();
          res.status(200).send("Event removed.");
        }

      }
    });
  })


  app.post('/api/list_group_events', (req, res) => {
    var {groupId} = req.body;
    var select = req.query.select

    Event.find({ "group": groupId }, (err, foundData) => {
      if (err) {
        console.log(err);
        res.status(500).send()
      }
      else {
        if (foundData.length == 0) {
          var responseObject = undefined;
          if (select && select == 'count') {
            responseObject = { count: 0 }
          }
          res.status(404).send(responseObject)
        }
        else {
          var responseObject = foundData;

          if (select && select == 'count') {
            responseObject = { count: foundData.length }
          }
          res.send(responseObject)
        }
      }
    })
  })

  app.get('/api/list_public_events', (req, res) => {
    var select = req.query.select

    Event.find({ "isPrivate": false }, (err, foundData) => {
      if (err) {
        console.log(err);
        res.status(500).send()
      }
      else {
        if (foundData.length == 0) {
          var responseObject = undefined;
          if (select && select == 'count') {
            responseObject = { count: 0 }
          }
          res.status(404).send(responseObject)
        }
        else {
          var responseObject = foundData;

          if (select && select == 'count') {
            responseObject = { count: foundData.length }
          }
          res.send(responseObject)
        }
      }
    })
  })

  app.post('/api/getEventById', (req, res) => {
    var { eventId } = req.body

    var select = req.query.select
    Event.find({ _id: eventId }, (err, foundData) => {
      if (err) {
        console.log(err);
        res.status(500).send()
      }
      else {
        if (foundData.length == 0) {
          var responseObject = undefined;
          if (select && select == 'count') {
            responseObject = { count: 0 }
          }
          res.status(404).send(responseObject)
        }
        else {
          var responseObject = foundData;

          if (select && select == 'count') {
            responseObject = { count: foundData.length }
          }
          res.send(responseObject)
        }
      }
    })
  });

  app.post('/api/')

}