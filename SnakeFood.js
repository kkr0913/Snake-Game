// * SnakeFood Class * //
function SnakeFood() {
	this.grid = p5.Vector;  // snake food location (grid)
}

// * SnakeFood.appear() * //
SnakeFood.prototype.appear = function() {
	// Relocate food if generated inside the snake
	while (moveFood) {
		var foodx = int(random(0, round(w/s)));
		var foody = int(random(0, round(h/s)));
		for (var vec of tailsGridG) {
			if ((foodx == vec.x) && (foody == vec.y)) {
				moveFood = true;
				break;
			} else {
				moveFood = false;
			}
		}
		this.grid.x = foodx;
		this.grid.y = foody;
	}
	
	// Draw food
	push();
	translate(s*(this.grid.x+0.5), s*(this.grid.y+0.5));
	fill(255, 0, 0);
	stroke(0);
	strokeWeight(0.1);
	LowResCircle(0, 0, s/2, 0.25);
	pop();

	return this.grid;
}