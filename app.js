var Wemo               = require('wemo-client');
var async              = require('async');

var lightSwitchName    = "Front Porch Switch";
var outletSwitchName   = "Front Porch";
var wemo               = new Wemo();


async.waterfall([
  function(callback){
  
    var clientCheck = function() {
      setTimeout(function(){
        if (
          (typeof this.lightSwitchClient !== 'undefined') &&
          (typeof this.outletSwitchClient !== 'undefined')
        ) {
          callback(null, [this.lightSwitchClient, this.outletSwitchClient]);
        } else {
          console.log("Failed to find device(s). Retrying...");
          wemo.discover(foundDevice);
        }
      }, 3000);
    }.bind(this);
    
    var foundDevice = function(device) {
      if(device.friendlyName === lightSwitchName) {
        console.log(lightSwitchName + " found.");
        this.lightSwitchClient = this.client(device);
        clientCheck();
      }
      if(device.friendlyName === outletSwitchName) {
        console.log(outletSwitchName + " found.");
        this.outletSwitchClient = this.client(device);
        clientCheck();
      }
    }.bind(this);
    
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
    
    console.log('Switch and Outlet Linked. Go play outside.');
  }
]);
