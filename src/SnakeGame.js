// * SnakeGame Class * //
function SnakeGame() {
    this.tails = new Array(ceil(w*h/s/s));      // tails locations array
	this.tailsGrid = new Array(ceil(w*h/s/s));  // tails locations array (grid)
 	this.loc = new p5.Vector(s*2, s*2);         // snake initial location
	this.grid = new p5.Vector(2, 2);            // snake initial location (grid)
	this.foodGrid = p5.Vector;                  // food location (grid)
}


// * SnakeGame.start() * //
SnakeGame.prototype.start = function() {
	translate(height*0.05, height*0.11);

	// Get current location
	this.loc.x += s*x;
	this.loc.y += s*y;
	this.grid.x += x;
	this.grid.y += y;
	
	// Check game over
	if ((this.grid.x == -1) || (this.grid.y == -1) || (this.grid.x == w/s) || (this.grid.y == h/s)) {
		this.gameover();
	}
	for (var vec of tailsGridG) {
		if ((this.grid.x == vec.x) && (this.grid.y == vec.y)) {
			this.gameover();
		}
	}
	
	// Get pixel/grid coordinates of all tails
	var gridArray = [];
	var tempVec0 = createVector(0, 0);
	var tempVec1 = createVector(0, 0);
	tempVec0.set(this.loc.x, this.loc.y);
	tempVec1.set(this.grid.x, this.grid.y);
	if (!gg) {
		this.tails.pop();
		this.tails.unshift(tempVec0);
		this.tailsGrid.pop();
		this.tailsGrid.unshift(tempVec1);
	}
	
	// Draw all tails
	for (var i = 0; i < len; i++) {
		if (i == 0) { fill(0, 255, 0); }
		else { fill(255); }
		push();
		stroke(0);
		strokeWeight(2);
		square(this.tails[i].x, this.tails[i].y, s);
		pop();
		gridArray.push(this.tailsGrid[i]);
	}
	tailsGridG = gridArray;
	
	// Generate/Eat food
	this.foodGrid = new SnakeFood().appear();
	if ((this.grid.x == this.foodGrid.x) && (this.grid.y == this.foodGrid.y)) {
		coin.play();
		moveFood = true;
		len += inc;
		if (delayT != 0) { delayT -= dec; }
	}
	
	// Calculate scores
	this.getScore();
	
	// Adjust snake speed
	delay(delayT);
}


// * SnakeGame.getScore() * //
SnakeGame.prototype.getScore = function() {
	myscore = nf((len-1) * (10+floor((100-delayT)/10)) * ((lvl_idx+1)), 6);
	if (int(myscore) > int(hiscore)) { tempScore = myscore; }
	if (loading) { hiscore = tempScore; }  // update high score when loading
}


// * SnakeGame.gameover() * //
SnakeGame.prototype.gameover = function() {
	bgm.stop();
	if (!dead.isPlaying()) { dead.play(); }
	fill(255);
	text("G a m e\nO v e r", 0, 0, w, h*0.8);
	x = y = 0;
	gg = true;
	rankUpdated = false;
}


// * SnakeGame.scoreScreen() * //
SnakeGame.prototype.scoreScreen = function() {
	background(0);
	push();
	imageMode(CENTER);
	noFill();
	stroke(255);
	strokeWeight(3);
	rect(width*0.2, height*0.05, width*0.6, height*0.9);
	rectMode(CENTER);
	fill(0);
	noStroke();
	rect(width*0.5, height*0.05, textWidth('score          ' + myscore)*1.2, 10);
	rectMode(CORNER);
	fill(255, 255, 0);
	textAlign(RIGHT, CENTER);
	text('score     ', 0, height*0.05 - textAscent()*0.6, width*0.5, textAscent()*1.2);
	fill(255);
	textAlign(LEFT, CENTER);
	text('     ' + myscore, width*0.5, 0, width*0.5, height*0.1);
	fill('#FF0000');
	textAlign(CENTER, TOP);
	text("! Ranking  !", 0, height*0.12, width, textAscent()*2);
	fill('#21DE00');
	textAlign(RIGHT, TOP);
	text('No', 0, height*0.12+textAscent()*2, width*0.35, textAscent()*1.5);
	textAlign(CENTER, TOP);
	text('Score', width*0.35, height*0.12+textAscent()*2, width*0.3, textAscent()*1.5);
	textAlign(LEFT, TOP);
	text('Name', width*0.65, height*0.12+textAscent()*2, width*0.35, textAscent()*1.5);
	if (!rankUpdated) {
		this.updateRank();
		rankUpdated = true;
	}
	for (var k = 1; k < 11; k++) {
		var colors = ['#FFCC99', '#FFCC99', '#FFCC99', '#FFCC99', '#FF9933', '#FF9933', '#FF9933', '#FF9933'];
		if (k == myrank) {
			if (!nameEntered) { fill('#FF47DE'); }
			if (nameEntered) { fill(colors[n]); }
		}
		else { fill(255); }
		textAlign(RIGHT, TOP);
		text(str(k), 0, height*0.12+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.35, textAscent()*1.2);
		textAlign(CENTER, TOP);
		text(nf(scrJSON_copy.record[k][0], 6), width*0.35, height*0.12+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.3, textAscent()*1.2);
		textAlign(LEFT, TOP);
		if (k == myrank) {
			for (var idx = 0; idx < 3; idx++) {
				if (nameEntered) { fill(colors[n]); }
				else if(idx == alp_idx) { fill('#FF47DE'); }
				else { fill(255); }
				text(char(alpJSON[idx]), width*0.65+textWidth('X')*idx, height*0.12+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.35, textAscent()*1.2);
			}
		}
		else { text(scrJSON_copy.record[k][1], width*0.65, height*0.12+textAscent()*3.5+textAscent()*1.2*(k-1), width*0.35, textAscent()*1.2); }
	}
	var remaining = ceil((30000-millis()+gg_t0)/1000);
	var len = map(remaining, 0, 30, 0, width*0.6-textAscent()*2.5-textWidth('time'));
	if (millis() - gg_t0 < 31000) {
		fill(255);
		textAlign(LEFT, CENTER);
		text('time', width*0.2+textAscent(), height*0.95-textAscent()*3, width, textAscent()*3);
		fill('#21DE00');
		rect(width*0.2+textAscent()*1.5+textWidth('time'), height*0.95-textAscent()*1.75, len, textAscent()*0.75);
	}
	if ((millis() - gg_t0 >= 31000) && (millis() - gg_t0 < 31200) && !enter.isPlaying()) {
		alpJSON.name = char(alpJSON[0]) + char(alpJSON[1]) + char(alpJSON[2]);
		nameEntered = true;
		enter.play();
	}
	if (nameEntered && (myrank <= 10) && !dataSent) { scrJSON_copy.record[myrank] = [int(myscore), alpJSON.name]; updateJSON(json_url, scrJSON_copy.record); dataSent = true; }
	pop();
}


// * SnakeGame.updateRank() * //
SnakeGame.prototype.updateRank = function() {
	while(!up2date);
	up2date = false;

	for (var i = 1; i < 11; i++) {
		if (int(myscore) > scrJSON_copy.record[i][0]) {
			for (var j = 9; j >= i; j--) {
				scrJSON_copy.record[j+1] = [scrJSON_copy.record[j][0], scrJSON_copy.record[j][1]];
			}
			scrJSON_copy.record[i] = [int(myscore), alpJSON.name];
			myrank = i;
			break;
		}
	}
	if (myrank > 10) { nameEntered = true; }
	else { dataSent = false; gg_t0 = millis(); }
}


// * SnakeGame.reset() * //
SnakeGame.prototype.reset = function() {
	started = false;
	moveFood = true;
	loading = true;
	up2date = false;
	gg = false;
	nameEntered = false;
	dataSent = true;
	alp_idx = 0;
	myrank = 100;
	x = y = 0;
	len = 1;
	this.loc.x = this.loc.y = s*2;
	this.grid.x = this.grid.y = 2;
	alpJSON[0] = 65;
	alpJSON[1] = 65;
	alpJSON[2] = 65;
	alpJSON.name = 'AAA';
	reloadJSON();
}
