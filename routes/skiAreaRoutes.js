
module.exports = function(app,SkiArea)
{

    
app.post('/api/skiArenaSearch',(req,res) =>
{
  var {name,country,minSum,snowpark,nightRide,skiRental,skiSchool,dragLift,chairLift,gondolas} = req.body

  var attributes = {minSum,snowpark,nightRide,skiRental,skiSchool,dragLift,chairLift,gondolas}

  var select = req.query.select

  SkiArea.find(
    { "name": { "$regex":name,"$options":"i"},
      "country": { "$regex":country,"$options":"i"}},
    
  (err,foundData)=>
  {

    filteredData = filterSkiAreas(foundData,attributes)
    
    if(err)
    {
      console.log(err);
      res.status(500).send()
    }
    else
    {
      if(filteredData.length == 0)
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
        var responseObject = filteredData;

        if(select && select=='count')
        {
          responseObject = {count: filteredData.length}
        }
      
        res.status(200).send(responseObject)
      }
      }
    }
  )
})


function filterSkiAreas(dataToFilter,requiredAttribut)
{

  var filteredData = [];
  for(var i=0;i<dataToFilter.length;i++)
        {

        var shouldAdd = true;
       
        var data = dataToFilter[i]  
    for (var property in requiredAttribut) 
    {
        
      if (requiredAttribut.hasOwnProperty(property) && requiredAttribut[property] != undefined) 
        {
          
          if(property=="snowpark" &&  requiredAttribut[property]==true)
          {
            if(data[property].length == 0)
            {
              shouldAdd = false;
            }
          }
          else if(property=="skiRental" || property=="skiSchool" || property=='nightRide' &&  requiredAttribut[property]==true)
          {
            if(data[property] == "")
            {
              shouldAdd = false
            }
          }
      
          else if (property == "dragLift" || property == "chairLift" || property == 'gondolas') {
            if (data[property] == 0) {
              shouldAdd = false
            }
          }

          else if(property=="minSum")
          {
            // TODO
            //console.log(data["hardRoute"].split("km")[0])
          }

          else if(typeof requiredAttribut[property] == "number")
          {
            if(requiredAttribut[property] > data[property])
            {
              shouldAdd = false;
            }
          }
          else if (typeof requiredAttribut[property] == "boolean")
          {
              if(requiredAttribut[property] != requiredAttribut[property])
              {
                shouldAdd = false;
              }
          }
         
        }
       
    }
    if(shouldAdd)
    {
      filteredData.push(data)
    }
  
}
return filteredData
}



app.post('/api/getSkiArenaByCountry',(req,res) =>
{
  var {country} = req.body

  var select = req.query.select

  SkiArea.find({country:country}, (err,foundData)=>
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
        
        res.status(200).send(responseObject)
      }
      }
    }

  )
})





// A z tym cos zrobic?? bo za bardzo nie wiem o co chodzi
//ja to dałem bo do wyświetlania pojedynczej ski areny po pierwsze chciałem uniknąć problemów z polskimi znakami,
//a po drugie powtarzały się te nazwy w bazie, a Ola chciała ten endpoint do wyświetlania na gwałt
app.post('/api/getArenaById',(req,res)=>
{
  var {id} = req.body
  var select = req.query.select
  SkiArea.find({_id:id}, (err,foundData)=>
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