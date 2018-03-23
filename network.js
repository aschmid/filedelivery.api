
var NetWork = function() {
  this.networkGraph = {};
};

NetWork.prototype.addHost = function (name) {
  // add a host only if the host does not exist
  // in the networkGraph already
  var name = name.toUpperCase();

  // if only add the host if
  if (!this.networkGraph[name]) {
    this.networkGraph[name] = {};
  };
};

NetWork.prototype.getHosts = function() {
  // get all hosts in this network
  return Object.keys(this.networkGraph).sort();
};

NetWork.prototype.addLink = function(hostA, hostB, description) {
  // this function adds a link between two hosts

  var hostA = hostA.toUpperCase(); // normalize hostA
  var hostB = hostB.toUpperCase(); // normalize hostB

  // first make sure both hosts have an entry in the networkGraph
  // this way there is no need to create a host before adding a link
  // between two hosts.
  this.addHost(hostA);
  this.addHost(hostB);

  // add a link between hostA and hostB
  this.networkGraph[hostA][hostB] = description;
  this.networkGraph[hostB][hostA] = description;
};

NetWork.prototype.getLinks = function() {

  // get all links between containers

  var links   = []; // the links array which will be returned by this function
  var visited = new Set(); // a set of visited links. this will avoid duplicates
  var hosts   = Object.keys(this.networkGraph).sort(); // all hosts in the network


  while (hosts.length > 0) {
    var host  = hosts.shift(); // take a host out of the array
    var edges = Object.keys(this.networkGraph[host]); // get the hosts directly connected hosts

    // loop over each direct connection of the host
    for (i = 0; i < edges.length; i++) {

      var linkedHost = edges[i]; // the linked host
      var linkId     = [host, linkedHost].sort().join(''); // a sorted string representing 2 hosts

      // if the linkId is not present in the visited set
      if (!visited.has(linkId)) {
        // add the linkId to the visited set
        visited.add(linkId);
        // add an object representing the link between two hosts to the links array
        links.push({'hostA': host,
                    'hostB': linkedHost,
                    'description': this.networkGraph[host][linkedHost]});
      };
    };
  };
  return links;
};

NetWork.prototype.findPath = function(source, target) {

  // lets perform a BFS on the network graph

  var source = source.toUpperCase(); // normalize source host
  var target = target.toUpperCase(); // normalize target host

  if (!this.networkGraph.hasOwnProperty(source)) {
    // return an empty array if the requested source path does not exist
    return [];
  };

  // create the first queue nested array
  // where each element will be composed by:
  // [hostname, set of previousely visited hosts, links between hosts]
  var queue  = [[source, new Set([source]), [source]]];


  while (queue.length) {
    var elem    = queue.shift(); // get the first array in the queue
    var vertex  = elem[0]; // the host we ar at
    var visited = elem[1]; // hosts we visited already
    var links   = elem[2]; // a sorted array of hosts and links

    var edges     = [];
    var neighbors = Object.keys(this.networkGraph[vertex]); // the vertex (host) direct connections

    // loop over the neighbors and add each connected host
    // to the edges we want to explore if the neighbor wanst visited already
    for (i = 0; i < neighbors.length; i++) {
      var host = neighbors[i];
      if (!visited.has(host)) {
        edges.push(host);
      };
    };

    // loop over each edge
    for (i = 0; i < edges.length; i++) {
      var edge = edges[i];
      if (edge === target) {
        // if the edge is the target host we reached our goal
        // return a sorted array of hosts and description of their
        // connection method
        return links.concat([this.networkGraph[vertex][edge], edge]);
      } else {
        // we still want to explore further to see if there is a connection
        // between the source and the target host
        // push a new element to the queue representing the last step in he graph search
        queue.push([edge, visited.add(edge), links.concat([this.networkGraph[vertex][edge], edge])]);
      };
    };
  };
  return [];
};


module.exports = NetWork
