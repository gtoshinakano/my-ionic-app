var restify = require('restify');
var colors  = ['#FA8C19', '#4994BE', '#649D6A', '#AF2C4B', '#79AAA6', '#E6C021', '#75497A'];


function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

// Inicia o server com RESTify
var server = restify.createServer();

// Permitir Access-Control-Allow-Headers e Origin
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

// Faz teste em Dashboard.
server.get('/testGET', function(req, res){

  res.send({sendData : 'testGET data'}); // JSON enviado ao client

});

// Envia informações de Array para View
server.get('/getREST', function(req, res){

  var rest = ["GET /api/post - Lists all posts", "POST /api/post - Creates a new Post",
              "GET /api/post/:id - Returns the data for that specific post with the id of :id",
              "PUT /api/post/:id - Updates the information for a specific post",
              "DELETE /api/post/:id - Deletes the specific post" ];
  res.send(rest);

});

/*
 * Envia eventos de datas
 */
 server.get('/getCalendarEvents/:month', function(req, res){

   var monthToGet = (parseInt(req.params.month)) ? parseInt(req.params.month) : new Date().getMonth();
   var calendarEvents = ["nada"];
   console.log(req.params.month);
   if(req.params.month == 10){
     calendarEvents = [
                          {type : "hokkaido", data: new Date('2015-11-30'), title: "Bingo : 8h"},
                          {type : "higuma", data: new Date('2015-11-26'), title: "Reunião : 20h"},
                          {type : "hokkaido", data: new Date('2015-11-20'), title: "Reunião Diretoria : 20h"}
                        ] ;
  }
  res.send(calendarEvents);

 });
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
