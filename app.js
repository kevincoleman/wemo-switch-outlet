var Wemo               = require('wemo-client');
var async              = require('async');

var lightSwitchName    = "Front Porch Switch";
var outletSwitchName   = "Front Porch";
var wemo               = new Wemo();



async.waterfall([
  function(callback){
    function foundDevice(device) {
      if(device.friendlyName === lightSwitchName) {
        var lightSwitchClient = this.client(device);
      }
      if(device.friendlyName === outletSwitchName) {
        var outletSwitchClient = this.client(device);
      }
      setTimeout(function(){
        if (
          (typeof lightSwitchClient !== 'undefined') &&
          (typeof outletSwitchClient !== 'undefined')
        ) {
          callback(null, [lightSwitchClient, outletSwitchClient]);
        } else {
          console.log("Failed to find device(s). Retrying...");
          wemo.discover(foundDevice);
        }
      }, 3000);
    };
    wemo.discover(foundDevice);
  },
  function(clients, callback){
    var lightSwitchClient = clients[0];
    var outletSwitchClient = clients[1];
    
    lightSwitchClient.on('binaryState', function(value) {
      outletSwitchClient.setBinaryState(value);
    });
    outletSwitchClient.on('binaryState', function(value) {
      lightSwitchClient.setBinaryState(value);
    });
    if (err) {
      console.log(err);
    } else {
      console.log('Switch and Outlet Linked. Go play outside.');
    }
  }
]);
