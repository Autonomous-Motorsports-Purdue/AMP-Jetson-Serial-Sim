function Pixel(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.pressed = false;

	this.press = function () {
		this.pressed = true;
	};

	this.clear = function () {
		this.pressed = false;
	};

	this.show = function () {
		if (this.pressed) {
			fill(200, 0, 0);
		} else {
			fill(220);
		}
		rect(this.x, this.y, this.w, this.h);
	};

	this.isPressed = function () {
		if (this.pressed) {
			return 1;
		} else {
			return 0;
		}
	};
}
