var Wemo               = require('wemo-client');
var async              = require('async');

var lightSwitchName    = "Front Porch Switch";
var outletSwitchName   = "Front Porch";
var wemo               = new Wemo();



async.waterfall([
  function(callback){
    function foundDevice(device) {
      if(device.friendlyName === lightSwitchName) {
        var lightSwitch = device;
        var lightSwitchClient = this.client(device);
        callback(null, lightSwitchClient);
      }
    };
    wemo.discover(foundDevice);
  },
  function(lightSwitchClient, callback){
    function foundDevice(device) {
      if(device.friendlyName === outletSwitchName) {
        var outletSwitch = device;
        var outletSwitchClient = this.client(device);
        callback(null, [lightSwitchClient, outletSwitchClient]);
        lightSwitchClient.on('binaryState', function(value) {
          outletSwitchClient.setBinaryState(value);
        });
      }
    };
    wemo.discover(foundDevice);
  },
  function(clients, callback){
    var lightSwitchClient = clients[0];
    var outletSwitchClient = clients[1];
    outletSwitchClient.on('binaryState', function(value) {
      lightSwitchClient.setBinaryState(value);
    });
   callback(null, clients); 
  }
], function(err, clients){
  if (err) {
    console.log(err);
  } else {
    console.log('Switch and Outlet Linked. Go play outside.');
  }
});
