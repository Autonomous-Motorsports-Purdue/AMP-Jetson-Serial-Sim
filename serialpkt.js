const serial_start = '02';
const serial_stop = '03';
const serial_id_enable = 'f0';
const serial_id_control = 'f1';
const serial_id_kill = 'f2';
const serial_id_data_len_1 = 'e1';
const serial_id_data_len_2 = 'e2';
const serial_id_data_len_3 = 'e3';

const enable_ack = 'ENABLE_ACK';
const control_ack = 'CONTROL_ACK';
const kill_ack = 'KILL_ACK';

function SerialPkt() {
	this.start = false;
	this.id = null;
	this.data_len = null;
	this.data = []; //for control data
	this.crc = null;
	this.parsed = null;
	this.stop = false;

	this.reset = function () {
		console.log('reset parser vars');
		this.start = false;
		this.id = null;
		this.data_len = null;
		this.data = [];
		this.crc = null;
		this.parsed = null;
		this.stop = false;
	};

	this.addbyte = function (byte) {
		let res;
		if (this.start == false) {
			res = this.getStart(byte);
		} else if (this.id == null) {
			res = this.getID(byte);
		} else if (this.id == control_ack && this.data_len == null) {
			res = this.getDataLength(byte);
		} else if (this.id == control_ack && this.data_len > this.data.length) {
			res = this.getData(byte);
		} else if (this.crc == null) {
			res = this.getCRC(byte);
		} else if (this.stop == false) {
			res = this.getStop(byte);
		}

		if (res != true) {
			console.log('Error during Parsing: ', res);
			this.reset();
		}
	};

	this.getStart = function (byte) {
		if (byte == serial_start) {
			this.start = true;
			return true;
		} else {
			return 'invalid start byte';
		}
	};

	this.getID = function (byte) {
		if (byte == serial_id_enable) {
			this.id = enable_ack;
		} else if (byte == serial_id_control) {
			this.id = control_ack;
		} else if (byte == serial_id_kill) {
			this.id = kill_ack;
		} else {
			return 'invalid id byte';
		}
		return true;
	};

	this.getDataLength = function (byte) {
		if (byte == serial_id_data_len_1) {
			this.data_len = 1;
		} else if (byte == serial_id_data_len_2) {
			this.data_len = 2;
		} else if (byte == serial_id_data_len_3) {
			this.data_len = 3;
		} else {
			return 'invalid data length';
		}
		return true;
	};

	this.getData = function (byte) {
		let percent = parseInt(byte, 16);
		percent = (percent / 0xff) * 100;
		percent = percent.toFixed(2);
		percent += '% ';

		this.data.push(percent);

		return true;
	};

	this.getCRC = function (byte) {
		this.crc = 'no implementation';
		return true;
	};

	this.getStop = function (byte) {
		if (byte == serial_stop) {
			this.stop = true;
			return true;
		} else {
			return 'invalid stop byte';
		}
	};

	this.getParsedPkt = function () {
		if (this.stop == true) {
			let res;
			if (this.id == enable_ack || this.id == kill_ack) {
				res = this.id;
			} else if (this.id == control_ack) {
				res = `${this.id} [${this.data}]`;
			} else {
				return 'parser err';
			}
			this.reset();
			return res;
		} else {
			return '';
		}
	};
}

module.exports = {
	SerialPkt,
	serial_start,
	serial_stop,
	serial_id_enable,
	serial_id_control,
	serial_id_kill,
	serial_id_data_len_1,
	serial_id_data_len_2,
	serial_id_data_len_3,
};
