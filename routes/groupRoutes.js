module.exports = function(app,Group)
{
    app.post('/api/groups',(req,res) =>
    {
        var {name,owner,isPrivate,description} = req.body

        var group = new Group({name,owner,isPrivate,description})

        group.save(function(err)
        {
            if(err)
            {
                console.log(err)
                res.status(409).send("Wrong input")
            }
            else
            {
                res.status(201).send("Group has been added")
            }
        })
    })

    app.get('/api/groups',(req,res) =>
    {
        var select = req.query.select   

        Group.find({}, (err,foundData)=>
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

    //  w body id  jako id grupy i member jako username do dodania {id,member}
    app.post('/api/groups-add-member',(req,res) =>
    {
        var {id,member}=req.body

        Group.findOneAndUpdate({id:id},{ $push: {otherMembers: member } }, (err,foundData)=>
        {
          if(err)
          {
            res.status(409).send("Wrong input")
          }
          else
          {
            res.send(200).send()
          }
        })
    })

    app.post('/api/delete-user',(req,res) =>
    {
      var {id} = req.body

      Group.remove({id:id}, (err)=>{
        if(err)
        {
          res.status(409).send("Failed to delete")
        }
        else
        {
          res.status(200).send("Deleted")
        }
      })
    })
  
}