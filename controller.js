var socket = require('socket.io-client')('http://racer.eu-gb.mybluemix.net:80');

socket.on('connect', function(){
    console.log('connected to socket');
});


var SensorTag = require('sensortag');
console.log('starts');
SensorTag.discover(function(st) {

    var sensorTag = st;

    console.log('discovered');
    sensorTag.connect(function() {
        console.log('connected to sensor tag');
        sensorTag.discoverServicesAndCharacteristics(function() {
            console.log('discovered services and charcteristics');
            sensorTag.readDeviceName(function(name) {
                console.log('Name ' + name);
            });

            sensorTag.enableAccelerometer(function() {
                sensorTag.notifyAccelerometer(function() {
                    console.log('notify');
                });

                sensorTag.setAccelerometerPeriod(20, function() {
                    sensorTag.on('accelerometerChange', function(x, y, z) {
                        console.log(x + ', ' + y + ', ' + z);
                        if (y < -0.05) {
                            console.log('right')
                            socket.emit('move', {x: 1, y: 0});
                        } else if (y > 0.05) {
                            console.log('left')
                            socket.emit('move', {x: -1, y: 0});
                        } else {
                            console.log('center');
                        }

                        if (x < -0.05) {
                            console.log('backward')
                            socket.emit('move', {x: 0, y: 1});
                        } else if (x > 0.05) {
                            console.log('forward')
                            socket.emit('move', {x: 0, y: -1});
                        } else {
                            console.log('middle');
                        }
                    });

                });
            });

        });

    });
});
