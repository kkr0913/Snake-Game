var game;
var menu, sel, bgm;
var img, muted, unmuted;
var s, h, w;
var x = 0;
var y = 0;
var n = 0;
var len = 1;
var delayT;  // min speed: 100 delay (10fps), max speed: 0 delay (computer refresh rate)
var inc, dec;
var myscore = '000000';
var hiscore = '000000';
var tempScore = '000000';
var tailsGridG = [];
var loading = true;
var started = false;
var over = false;
var moveFood = true;
var muted = false;
var lvl = ['EASY', 'NORMAL', 'HARD', 'CRAZY'];
var lvl_idx = 0;
var level = { 
	// 'difficulty': [initial delay, delay decrement, tail increment]
	'EASY': [100, 1, 1],
	'NORMAL': [100, 2, 3],
	'HARD': [100, 5, 5],
	'CRAZY': [0, 0, 7]
}


function preload() {
	arcadeFont = loadFont('ARCADECLASSIC.otf');
	bgm = loadSound('bgm.mp3');
	menu = loadSound('menu.mp3');
	turn = loadSound('turn.mp3');
	coin = loadSound('coin.mp3');
	dead = loadSound('dead.mp3');
	mutedIcon = loadImage('muted.png');
	unmutedIcon = loadImage('unmuted.png');
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	pixelDensity(0.4);
	textSize(60);
	textAlign(CENTER, CENTER);
	textFont(arcadeFont);
	noStroke();

	// Set snake head size & snake cage size
	s = height*0.02;                // snake head (square)
	h = height*0.84;                // snake cage height
	h = floor(h/s) * s;             // adjust
	w = width - height*0.1;         // snake cage width
	w = floor(w/s) * s;             // adjust
	
	game = new SnakeGame();
}


function draw() {
	background(0);
	
	// Loading Screen
	if (loading) {
		if (dead.isPlaying()) { dead.stop(); }
		n += 1;
		n %= 2;
		var colors = ['#FFCC99', '#FF9933'];
		fill(colors[n]);
		text("SELECT    DIFFICULTY", 0, height*0.2, width, height*0.1);
		for (var i in lvl) {
			var txt = lvl[i];
			push();
			fill(255);
			if (i == lvl_idx) {
				fill(0, 0, 255);
				txt = '! ' + txt + '  !';
			}
			text(txt, 0, height*(0.4+0.1*i), width, height*0.1);
			pop();
		}
		delay(80);
		return;
	}
	if ((!loading) && (!bgm.isPlaying()) && (!muted)) { bgm.loop(); }
	
	// Top Text
	push();
	fill(255, 255, 0);
	textSize(height*0.05);
	textAlign(LEFT, CENTER)
	text("     Difficulty", 0, 0, width, height*0.06);
	fill(255);
	text(lvl[lvl_idx], width*0.22, 0, width*0.78, height*0.06);
	fill(255, 255, 0);
	text("Score", width*0.4, 0, width*0.6, height*0.06);
	fill(255);
	// textAlign(RIGHT, CENTER);
	text(myscore, width*0.52, 0, width*0.48, height*0.06);
	fill(255, 0, 0);
	text("High Score", width*0.7, 0, width*0.3, height*0.06);
	textAlign(RIGHT, CENTER);
	fill(12, 187, 143);
	text(hiscore + "     ", 0, 0, width, height*0.06);
	pop();
	
	// Background
	push();
	translate(0, height*0.06);
	fill(76, 0, 153);
	rect(0, 0, width, height*0.94);        // purple background
	translate(height*0.05, height*0.05);
	fill(0);
	rect(0, 0, w, h);                      // snake cage
	if (!started) {
		fill(0, 255, 0);
		square(s*2, s*2, s);                 // snake head
	}
	pop();
	push();
	translate(width - 0.25*mutedIcon.width , height - 0.3*mutedIcon.height);
	scale(0.2);
	if (muted) { image(mutedIcon, 0, 0); }
	if (!muted) { image(unmutedIcon, 0, 0); }
	pop();
	
	// Start
	if (started) { game.start(); }         // prevent delay(ms) when not started
}


// - - - Mouse Click Event - - - //
function mouseClicked() {
	if ((mouseX < width - 0.25*mutedIcon.width) || (mouseY < height - 0.3*mutedIcon.height)) {
		return;
	}
	if (muted && !loading) {   // unmute
		muted = false;
		if (!bgm.isPlaying()) {
			bgm.loop();
		}
	}
	else if (!muted) {         // mute
		muted = true;
		if (bgm.isPlaying()) {
			bgm.pause();
		}
	}
}


// - - - Key Press Event - - - //
function keyPressed() {
	if (loading) {
		if ((key === "ArrowUp") && (lvl_idx != 0)) { lvl_idx -= 1; menu.play(); }
		if ((key === "ArrowDown") && (lvl_idx != 3)) { lvl_idx += 1; menu.play(); }
		if (keyCode === 32) {
			var mylvl = lvl[lvl_idx];
			delayT = level[mylvl][0];
			dec = level[mylvl][1];
			inc = level[mylvl][2];
			loading = false;
		}
	}
	if (over || loading) {
		return;
	}
	if ((key === "ArrowUp") && (y != 1)) { x = 0; y = -1; started = true; turn.play(); }
	if ((key === "ArrowDown") && (y != -1)) { x = 0; y = 1; started = true; turn.play(); }
	if ((key === "ArrowLeft") && (x != 1)) { x = -1; y = 0; started = true; turn.play(); }
	if ((key === "ArrowRight") && (x != -1)) { x = 1; y = 0; started = true; turn.play(); }
}


// - - - Delay - - - //
function delay(ms) {
	if (!ms) {
		return;           // if delay function not called, frame rate = refresh rate
	}
	var t0 = millis();  // initial time
	var err = 10;       // possible error to prevent iteration skip
	while(1) {
		if ((millis() >= t0 + ms - err) && (millis() <= t0 + ms + err)) { break; }
	}
}


// - - - Draw Low Resolution Circle - - - //
function LowResCircle(x, y, radius, resolution) {
  rectMode(CENTER);
  const tile_size = (radius * 2) / (radius * 2 * resolution);
  const tile_count = ~~((radius * 2) / tile_size);
  for (let tile_y = 0; tile_y < tile_count; ++tile_y) {
    for (let tile_x = 0; tile_x < tile_count; ++tile_x) {
      const pos_x = (tile_x - tile_count / 2 + 0.5) * tile_size;
      const pos_y = (tile_y - tile_count / 2 + 0.5) * tile_size;
      if (Math.hypot(pos_x, pos_y) < radius)
	      square(x + pos_x, y + pos_y, tile_size);
    }
  }
}