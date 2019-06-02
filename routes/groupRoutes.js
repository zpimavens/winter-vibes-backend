const FuzzySearch = require('fuzzy-search');

module.exports = function(app,Group)
{
    app.post('/api/groups',(req,res) =>
    {
        var {name,owner,isPrivate,description} = req.body

        var members = []
        members.push(owner)
        var group = new Group({name,owner,isPrivate,description,"otherMembers":members})
        console.log(group)

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
        console.log(id)
        console.log(member)
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

    app.post('/api/delete-group',(req,res) =>
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

    app.post('/api/groups-of-user',(req,res)=>
    {
        var{username} = req.body
        Group.find({otherMembers:username},(err,foundData)=>
        {
          if(err)
          {
            res.status(409).send("Failed to find")
          }
          else
          {
            res.status(200).send(foundData)
          }
        })
    })

    app.post('/api/delete-user',(req,res)=>
    {
        var{id,username} = req.body

        Group.update({id:id},{ '$pull': {otherMembers:username}},(err,foundData)=>
        {
          if(err)
          {
            res.status(409).send("Failed to find")
          }
          else
          {
            res.status(200).send("Deleted")
          }
        })
    })




app.get('/api/group/:name',(req,res) =>
{
      var groupName = req.params.name
      Group.find({name:groupName}, (err,foundData)=>
      {
        if(err)
        {
          console.log(err);
          res.status(500).send("Internal server error")
        }
        else
        {
            res.status(200).send(foundData)
        }
      }
      )
    })


    app.get('/api/group-by-id/:id',(req,res) =>
{
      var id = req.params.id
      console.log(id)
      Group.find({_id:id}, (err,foundData)=>
      {
        if(err)
        {
          console.log(err);
          res.status(500).send("Internal server error")
        }
        else
        {
            res.status(200).send(foundData)
        }
      }
      )
    })


  app.get('/api/groups/search/:name',(req,res) =>
    {
          var groupName = req.params.name
          Group.find({}, (err,foundData)=>
          {
            if(err)
            {
              console.log(err);
              res.status(500).send("Internal server error")
            }
            else
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
               
                  res.status(404).send(responseObject)
                }
                else
                {
                  var responseObject = foundData;
                  
                  var searcherUsername = new FuzzySearch(responseObject, ['name'],
                   {caseSensitive: false});
                  
                  var result = searcherUsername.search(groupName)
                  res.status(200).send(result)
                }
                }
            }
          }
          )
        })

}