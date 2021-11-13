const usbPortName = '/dev/cu.usbmodem14401';
const SerialPort = require('serialport');
let port = new SerialPort(usbPortName, 4800);
const ByteLength = require('@serialport/parser-byte-length');
let parser = port.pipe(new ByteLength({ length: 1 }));
const serial = require('./serial.js');


const $ = require('jQuery');

const SerialPkt = require('./serialpkt');
const pkt = new SerialPkt.SerialPkt();
