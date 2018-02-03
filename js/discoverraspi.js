var dgram = require('dgram');
var udpclient = dgram.createSocket('udp4');

const RECVPORT = 8001;
const SENDPORT = 8002;

var discoverMsg = new Buffer('[RendererBitteMelden!]');

const raspiDAC = () => {

    var raspiIP = '0.0.0.0';
    var raspiPort = 0;

    udpclient.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        udpclient.close();
        return {
            ip: raspiIP,
            port: raspiPort
        };
    });

    udpclient.on('listening', function () {
        udpclient.setBroadcast(true);
        var address = udpclient.address();
        console.log('UDP Client listening on ' + address.address + ":" + address.port);
        udpclient.send(discoverMsg, 0, discoverMsg.length, SENDPORT, '255.255.255.255');
    });

    udpclient.on('message', function (message, rinfo) {
        console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
        if (message.indexOf('[RaspiDAC]') > -1) {
            var msg = message.toString().replace('[RaspiDAC]', '');
            var msgList = msg.split(';');
            raspiPort = msgList[5];
            raspiIP = rinfo.address;
        };
        udpclient.close();
        return {
            ip: raspiIP,
            port: raspiPort
        };
    });

    udpclient.bind(RECVPORT);
};

module.exports = {
    raspiDAC
}