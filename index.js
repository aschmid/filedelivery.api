var express    = require('express')
var app        = express()
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var links   = require('./mockdata');
var NetWork = require('./network');

var FileDeliveryNetwork = new NetWork();

app.get('/', function(req, res) {
  res.send('File Delivery App');
})

app.post('/hosts', function(req, res) {
  // create a new host.
  // Hosts need a name.
  var hostName = req.body.name;
  if (!hostName) {
    return res.status(400).send('Property name is required!');
  };

  FileDeliveryNetwork.addHost(hostName);
  res.status(201).send('created: '+hostName);
})

app.get('/hosts', function(req, res) {
  // get a listing of all hosts.
  var hosts = FileDeliveryNetwork.getHosts();
  res.send(hosts);
})

app.post('/links', function(req, res) {
  // create a link between two hosts.
  // Links need the names of the two hosts being connected and a description of the link.
  var link = req.body;

  if (!link.hostA || !link.hostB || !link.description) {
    return res.status(400).send('Missing property! Expected keys: "hostA", "hostB", "description"')
  };

  FileDeliveryNetwork.addLink(link.hostA, link.hostB, link.description);
  res.status(201).send('link created');
})

app.get('/links', function(req, res) {
  // get a listing of all links.
  res.send(FileDeliveryNetwork.getLinks());
})

app.get('/path/:source/to/:target', function (req, res) {
  // retrieve the easiest way to transfer a file between host A and host B.
  res.send(FileDeliveryNetwork.findPath(req.params.source, req.params.target));
})

app.post('/populate', function(req, res) {
  for (i = 0; i < links.length; i++) {
    var link = links[i];
    FileDeliveryNetwork.addLink(link.hostA, link.hostB, link.description);
  };
  console.log(FileDeliveryNetwork.networkGraph);
  res.send('Host network was populated');
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
})

