function data_length_callback(val) {
	const data_length_label = document.getElementById('data_length_label');
	data_length_label.innerHTML = val;

	const brake = document.getElementById('brake');
	const throttle = document.getElementById('throttle');

	if (val <= 2) {
		brake.disabled = true;
	} else {
		brake.disabled = false;
	}

	if (val <= 1) {
		throttle.disabled = true;
	} else {
		throttle.disabled = false;
	}
}
