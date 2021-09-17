var port = process.env.PORT,
express = require('express'),
app = express().use(express.static(__dirname + '/')),
http = require('http').Server(app),
io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/landing_page.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(port, function(){
    console.log("Node server listening on port " + port);
});