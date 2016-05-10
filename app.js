var Wemo               = require('wemo-client');
var async              = require('async');

var lightSwitchName    = "Front Porch Switch";
var outletSwitchName   = "Front Porch";

var lightSwitchClient;
var outletSwitchClient;

var wemo               = new Wemo();


async.waterfall([
  function(callback){

    var clientCheck = function(foundDevice) {
      if (
        ((lightSwitchClient !== undefined) && (outletSwitchClient !== undefined))
      ) {
        console.log('Both found, progressing.');
        callback(null, [lightSwitchClient, outletSwitchClient]);
      } else {
        console.log("Failed to find device(s). Retrying...");
        setTimeout(function(){
          wemo.discover(foundDevice);
        }, 3000);
      }
    }

    var foundDevice = function(device) {
      console.log(device.friendlyName);
      if(device.friendlyName === lightSwitchName) {
        console.log(lightSwitchName + " found.");
        lightSwitchClient = wemo.client(device);
        clientCheck();
      }
      if(device.friendlyName === outletSwitchName) {
        console.log(outletSwitchName + " found.");
        outletSwitchClient = wemo.client(device);
        clientCheck();
      }
    };
    console.log('start');
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
