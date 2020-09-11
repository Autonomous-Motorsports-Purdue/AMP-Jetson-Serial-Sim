const START_BYTE = Buffer.from([0x02]);
const STOP_BYTE = Buffer.from([0x03]);
const ID_ENABLE = Buffer.from([0xf0]);
const ID_CONTROL = 0xf1;
const ID_KILL = 0xf2;
const RESET_SERIAL_STATE = 0xdd;
const DATA_LEN_1 = 0xe1;
const DATA_LEN_2 = 0xe2;
const DATA_LEN_3 = 0xe3;

module.exports = {
	start: START_BYTE,
	stop: STOP_BYTE,
	enable: ID_ENABLE,
};
