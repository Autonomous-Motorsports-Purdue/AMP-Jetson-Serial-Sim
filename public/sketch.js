//used this tutorial: https://www.youtube.com/watch?v=i6eP1Lw4gZk

let socket;
const divs = 3;
let pix = new Array(divs);
let w;
let h;
let mode = "draw";
let toggleMode;

function setup() {
	createCanvas(400, 400);
	socket = io.connect("http://localhost:3000");
	toggleMode = createButton("toggle mode");
	toggleMode.mousePressed(toggleModeCallback);
	clearCanvas = createButton("clear");
	clearCanvas.mousePressed(clearCanvasCallback);
	getImage = createButton("get image");
	getImage.mousePressed(getImageCallback);
	w = width / divs;
	h = height / divs;

	for (let i = 0; i < pix.length; i++) {
		pix[i] = new Array(divs);

		for (let j = 0; j < pix[i].length; j++) {
			pix[i][j] = new Pixel(i * w, j * h, w, h);
		}
	}

	setInterval(getImageCallback, 100);
}

function draw() {
	background(220);

	for (let i = 0; i < pix.length; i++) {
		for (let j = 0; j < pix[i].length; j++) {
			pix[i][j].show();
		}
	}
}

function mouseDragged() {
	let i = Math.floor(mouseX / w);
	let j = Math.floor(mouseY / h);

	if (i >= pix.length || j >= pix[0].length) {
		return;
	}

	if (i < 0 || j < 0) {
		return;
	}
	if (mode == "draw") {
		pix[i][j].press();
	} else if (mode == "erase") {
		pix[i][j].clear();
	}
}

// function mouseDragged() {
// 	console.log("Sending: " + mouseX + ", " + mouseY);
// 	let data = {
// 		x: mouseX,
// 		y: mouseY,
// 	};

// 	socket.emit("mouse", data);
// }

function toggleModeCallback() {
	if (mode == "draw") {
		mode = "erase";
	} else if (mode == "erase") {
		mode = "draw";
	}
}

function clearCanvasCallback() {
	for (let i = 0; i < pix.length; i++) {
		for (let j = 0; j < pix[i].length; j++) {
			pix[i][j].clear();
		}
	}
}

function getImageCallback() {
	let str = "";
	let img = [];

	for (let i = 0; i < pix.length; i++) {
		let pow = 1;
		let int = 0;
		for (let j = pix[i].length - 1; j >= 0; j--) {
			str += pix[pix[i].length - j - 1][i].isPressed() + ", ";
			int += pix[j][i].isPressed() * pow;
			pow *= 2;
		}
		img.push(int);
		str += "\n";
	}

	data = {
		string: str,
		array: img,
	};

	socket.emit("img", data);
	console.log(`sending: str: ${data.string}, array: ${data.array}`);

	// console.log(img);
}
