var expect = require("chai").expect;
var links   = require('../mockdata')
var NetWork = require('../network')


describe("FileDeliveryNetwork", function() {
  it("should create a network with an empty networkGraph", function() {
    var fdn = new NetWork();
    expect(fdn.networkGraph).to.be.instanceOf(Object);
    expect(fdn.networkGraph).to.be.empty;
  });

  it("it should be able to add new hosts", function() {
    var fdn = new NetWork();
    fdn.addHost('A')
    expect(fdn.networkGraph).to.have.property('A');
    expect(fdn.networkGraph['A']).to.be.empty;
  });

  it("it should add new hosts no matter if the hostname the case of the hostname", function() {
    var fdn = new NetWork();
    fdn.addHost('Aa')
    fdn.addHost('aa')
    fdn.addHost('AA')
    expect(fdn.networkGraph).to.have.property('AA');
    expect(fdn.networkGraph['AA']).to.be.empty;
    expect(Object.keys(fdn.networkGraph).length).to.equal(1)
  });

  it("it should be able to add links between hosts", function() {
    var fdn = new NetWork();
    fdn.addHost('A')
    fdn.addHost('B')
    fdn.addLink('A', 'B', 'ftp')
    expect(fdn.networkGraph).to.have.property('A')
    expect(fdn.networkGraph).to.have.property('B')
    expect(fdn.networkGraph).to.have.deep.property('A.B', 'ftp')
    expect(fdn.networkGraph).to.have.deep.property('B.A', 'ftp')
  });

  it("it should be able to add a host twice without overwriting previous entries", function() {
    var fdn = new NetWork();
    fdn.addHost('A');
    fdn.addLink('A', 'B', 'ftp');
    fdn.addHost('A');
    fdn.addLink('A', 'B', 'ftp');
    expect(fdn.networkGraph).to.have.property('A');
    expect(fdn.networkGraph).to.have.property('B')
    expect(fdn.networkGraph).to.have.deep.property('A.B', 'ftp')
    expect(fdn.networkGraph).to.have.deep.property('B.A', 'ftp')
  });

  it("it should be able to add links between hosts without adding a host first", function() {
    var fdn = new NetWork();
    fdn.addLink('F', 'G', 'ftp')
    expect(fdn.networkGraph).to.have.property('F')
    expect(fdn.networkGraph).to.have.property('G')
    expect(fdn.networkGraph).to.have.deep.property('F.G', 'ftp')
    expect(fdn.networkGraph).to.have.deep.property('G.F', 'ftp')
  });


  it("it should be able to return all hosts in the network", function() {
    var fdn = new NetWork();
    fdn.addLink('F', 'G', 'ftp')
    fdn.addHost('X')
    fdn.addHost('G')
    expect(fdn.getHosts().length).to.equal(3)
    expect(fdn.getHosts()).to.eql(['F', 'G', 'X'])
  });

  it("it should be able to return all unique links in the network", function() {
    var fdn = new NetWork();
    fdn.addLink('F', 'G', 'ftp');
    fdn.addHost('X');
    fdn.addLink('A', 'G', 'smb');

    expect(fdn.getLinks().length).to.equal(2);

    expectedLinks = [
      {'hostA': 'A', 'hostB': 'G', 'description': 'smb'},
      {'hostA': 'F', 'hostB': 'G', 'description': 'ftp'}
    ]
    expect(fdn.getLinks()).to.eql(expectedLinks)
  });

  it("it should be able to return the quickest path between 2 hosts", function() {
    var fdn = new NetWork();
    for (i = 0; i < links.length; i++) {
      var link = links[i]
      fdn.addLink(link.hostA, link.hostB, link.description);
    };
    expect(fdn.getHosts().length).to.equal(7) // A to G

    var path = fdn.findPath('A', 'F');
    expect(path).to.eql([ 'A', 'pony express', 'G', 'samba', 'F' ])

    // lets add a shorter link between A and F
    fdn.addLink('A', 'F', 'scp')
    var path = fdn.findPath('A', 'F');
    // the returned path should be a direkt link between A and F
    expect(path).to.eql([ 'A', 'scp', 'F' ])

  });
  it("it should be return an empty array if there is no path between hosts", function() {
    var fdn = new NetWork();
    expect(fdn.getHosts().length).to.equal(0) // no hosts or links were added

    var path = fdn.findPath('A', 'F');
    expect(path).to.eql([])

    fdn.addLink('A', 'F', 'scp')
    var path = fdn.findPath('A', 'Z');
    // the returned path should be a direkt link between A and F
    expect(path).to.eql([])
  });



});