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
	if (!over) {
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
	over = true;
	// Press space to restart
	if (keyCode === 32) {
		started = false;
		over = false;
		moveFood = true;
		loading = true;
		x = y = 0;
		len = 1;
		this.loc.x = this.loc.y = s*2;
		this.grid.x = this.grid.y = 2;
	}
}