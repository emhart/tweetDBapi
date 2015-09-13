var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var restapi = express();

/*
Setting up our endpoints.  At the moment the idea is a basic api
- All tweets by user by year
- All tweets by date by year
- All tweets by user by date by year
- Lastly a limit term to any of these queries
- all valid screen names
- all valid dates
*/



/* All tweets by screen_name by year
*/
restapi.get('/tweets/:source/:year', function(req, res){
  var sn = 0;
  var date = 0;

  var db = new sqlite3.Database('data/'+req.params.source+req.params.year+'.db');
  console.log(db)
  baseQ = "SELECT *  FROM tweets "

  if(req.query.limit !== undefined){
            limit = " limit "+ req.query.limit;
  } else {
    limit = "";
  }

  if(req.query.sn !== undefined){
    sn = "screen_name = '" + req.query.sn + "'";
  }

  if(req.query.date !== undefined){
    date = "rptg_dt = '" + req.query.date + "'";
  }
  console.log(sn)
  console.log(date)
  /* now assemble the query */

    if(sn !== 0 && date !== 0 ){
      q = baseQ + "WHERE " + sn + " AND " + date
    } else if(sn !== 0 && date === 0 ){
          q = baseQ + "WHERE " + sn
    } else if(sn === 0 && date !== 0 ){
          q = baseQ + "WHERE " + date
    }


    /* Add in the limit parameter */
    q = q + limit
    console.log(q)

      db.all(q, function(err, rows){
        res.json(rows);
    });
});

/* list all users for that year */

restapi.get('/screen_name/:source/:year', function(req, res){
var db = new sqlite3.Database('data/'+req.params.source+req.params.year+'.db');
      q = "SELECT distinct(screen_name) from tweets"

      db.all(q, function(err, rows){
        res.json(rows);

    });
});

/* list all users for that year */

restapi.get('/dates/:source/:year', function(req, res){
var db = new sqlite3.Database('data/'+req.params.source+req.params.year+'.db');
      q = "SELECT distinct(rptg_dt) from tweets"

      db.all(q, function(err, rows){
        res.json(rows);

    });
});



restapi.listen(3000);

console.log("Submit GET or POST to http://localhost:3000/data");
