//now the alife...
//Paul Edwards 2013
var aLife = [];
aLife.circles = [];
aLife.maxAnimationDuration = 1000;
aLife.minAnimationDuration = 500;
aLife.maxDiameter = 80;
aLife.minDiameter = 1;
aLife.randomLength = true;
aLife.spacing = 130;

$(document).ready(function() {
	$("#raphaelHolder").css("width", $(document).width());
	$("#raphaelHolder").css("height", $(document).height());
	//$('#raphaelHolder').width = document.width;
	//$('#raphaelHolder').height = document.height;
	// Creates canvas 320 × 200 at 10, 50
	var paper = Raphael(document.getElementById("raphaelHolder"), $(document).width() + 400, $(document).height());

	aLife.getRandomDuration = function() {
		return (Math.floor(Math.random() * (aLife.maxAnimationDuration - aLife.minAnimationDuration) + aLife.minAnimationDuration));
	}

	aLife.getRandomDiameter = function() {
		return (Math.floor(Math.random() * (aLife.maxDiameter - aLife.minDiameter) + aLife.minDiameter));
	}

	aLife.getRandomWidth = function() {
		return (Math.floor(Math.random() * ((aLife.maxDiameter / 3) - (aLife.minDiameter / 3)) + (aLife.minDiameter / 3)));
	}

	aLife.getRandomColor = function() {
		return (aLife.rgbToHex(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)));
	}

	//util
	aLife.componentToHex = function(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	aLife.countCircles = function() {
		var returnVal = 0;
		for (circle in aLife.circles) {
			returnVal += 1
		};
		return (returnVal);
	}

	aLife.anythingAtLocation = function(locationX, locationY) {
		var returnVal = false;
		for (circle in aLife.circles) {
			if (aLife.circles[circle].attr('cx') == locationX && aLife.circles[circle].attr('cy') == locationY) {
				returnVal = true;
			}
		}
		return (returnVal);
	}

	//util
	aLife.rgbToHex = function(r, g, b) {
		return "#" + aLife.componentToHex(r) + aLife.componentToHex(g) + aLife.componentToHex(b);
	}

	aLife.checkSpawn = function(circleUUID) {
		//console.log('check spawn');
		//console.log('neighbours: ' + aLife.circles[circleUUID].countNeighbours());
		if (aLife.circles[circleUUID].countNeighbours() < 3) {
			var myChoice = Math.floor(Math.random() * 8);
			//    console.log("choice: " + myChoice);
			switch(myChoice) {
				case 0:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posTop().x, aLife.circles[circleUUID].posTop().y);
					break;
				case 1:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posTopRight().x, aLife.circles[circleUUID].posTopRight().y);
					break;
				case 2:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posRight().x, aLife.circles[circleUUID].posRight().y);
					break;
				case 3:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posBottomRight().x, aLife.circles[circleUUID].posBottomRight().y);
					break;
				case 4:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posBottom().x, aLife.circles[circleUUID].posBottom().y);
					break;
				case 5:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posBottomLeft().x, aLife.circles[circleUUID].posBottomLeft().y);
					break;
				case 6:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posLeft().x, aLife.circles[circleUUID].posLeft().y);
					break;
				case 7:
					aLife.createAnimateCircle(null, aLife.circles[circleUUID].posTopLeft().x, aLife.circles[circleUUID].posTopLeft().y);
					break;

			}
		} else {
			//had too many neighbours...
			//    console.log('too many neighbours');
			try {
				aLife.circles[circleUUID].stop();
				aLife.circles[circleUUID].animate({
					"opacity" : 0,
					"stroke-opacity" : 0,
					"r" : 0
				}, (thisAnimationDuration / 2), "linear", function() {
					//aLife.circles[circleUUID].clear();
					//

					var indexToRemove = aLife.circles[circleUUID].thisIndex();
					if (indexToRemove > -1) {
						//console.log('found index to remove ' + indexToRemove);
						//aLife.circles.splice(indexToRemove, 1);
						aLife.circles[circleUUID].remove();
						delete aLife.circles[circleUUID];
						//          paper.splice(indexToRemove,0);

					}

				});

			} catch(err) {
				console.log(err);
			}

		}
	}

	var housekeeping = setInterval(function() {
		if (aLife.countCircles() < 3) {
			aLife.createAnimateCircle(null, ($(document).width() / 2), ($(document).height() / 2));
		}
	}, 2000);

	aLife.createAnimateCircle = function(circleUUID, circleX, circleY) {
		if (circleUUID) {
			thisAnimationDuration = aLife.maxAnimationDuration;

			if (aLife.randomLength) {
				thisAnimationDuration = aLife.getRandomDuration();
			}
			try {
				//circle existed
				aLife.circles[circleUUID].animate({
					fill : aLife.getRandomColor(),
					stroke : aLife.getRandomColor(),
					"stroke-width" : aLife.getRandomWidth(),
					"stroke-opacity" : Math.random(),
					"fill-opacity" : Math.random() / 2,
					"r" : aLife.getRandomDiameter()
				}, (thisAnimationDuration / 2), "linear", function() {
					try {
						aLife.circles[circleUUID].animate({
							fill : aLife.getRandomColor(),
							stroke : aLife.getRandomColor(),
							"stroke-width" : aLife.getRandomWidth(),
							"stroke-opacity" : Math.random(),
							"fill-opacity" : Math.random() / 2,
							"r" : aLife.getRandomDiameter()
						}, (thisAnimationDuration / 2), "linear", function() {
							aLife.checkSpawn(circleUUID);
							aLife.createAnimateCircle(circleUUID);
						});
					} catch(err) {
						//console.log(err.message);
					}
				});
			} catch(err) {
				//  console.log(err.message);
			}
		} else {
			//create circle

			var circleUUID = Raphael.createUUID();

			if (circleX && circleY) {
				if (aLife.anythingAtLocation(circleX, circleY) || circleX < 0 || circleY < 0 || circleX > $(document).width() || circleY > $(document).height()) {
					return;
				}
				aLife.circles.push();
				aLife.circles[circleUUID] = paper.circle(circleX, circleY, 1);
			} else {
				aLife.circles.push();
				//      console.log('no xy');
				aLife.circles[circleUUID] = paper.circle(($(document).width() / 2), ($(document).height() / 2), 1);
			}

			aLife.circles[circleUUID].node.id = circleUUID;

			aLife.circles[circleUUID].posTop = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx');
				returnVal.y = aLife.circles[circleUUID].attr('cy') - aLife.spacing;
				return (returnVal);
			};

			aLife.circles[circleUUID].posTopRight = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx') + aLife.spacing;
				returnVal.y = aLife.circles[circleUUID].attr('cy') - aLife.spacing;
				return (returnVal);
			};

			aLife.circles[circleUUID].posRight = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx') + aLife.spacing;
				returnVal.y = aLife.circles[circleUUID].attr('cy');
				return (returnVal);
			};

			aLife.circles[circleUUID].posBottomRight = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx') + aLife.spacing;
				returnVal.y = aLife.circles[circleUUID].attr('cy') + aLife.spacing;
				return (returnVal);
			};

			aLife.circles[circleUUID].posBottom = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx');
				returnVal.y = aLife.circles[circleUUID].attr('cy') + aLife.spacing;
				return (returnVal);
			};

			aLife.circles[circleUUID].posBottomLeft = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx') - aLife.spacing;
				returnVal.y = aLife.circles[circleUUID].attr('cy') + aLife.spacing;
				return (returnVal);
			};

			aLife.circles[circleUUID].posLeft = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx') - aLife.spacing;
				returnVal.y = aLife.circles[circleUUID].attr('cy');
				return (returnVal);
			};

			aLife.circles[circleUUID].posTopLeft = function() {
				var returnVal = [];
				returnVal.x = aLife.circles[circleUUID].attr('cx') - aLife.spacing;
				returnVal.y = aLife.circles[circleUUID].attr('cy') - aLife.spacing;
				return (returnVal);
			};

			aLife.circles[circleUUID].countNeighbours = function() {
				var returnVal = 1;

				//for(circle in aLife.circles){console.log(aLife.circles[circle].attr('cx'))}

				for (circle in aLife.circles) {
					if ((aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posTop().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posTop().y) || (aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posTopRight().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posTopRight().y) || (aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posRight().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posRight().y) || (aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posBottomRight().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posBottomRight().y) || (aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posBottom().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posBottom().y) || (aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posBottomLeft().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posBottomLeft().y) || (aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posLeft().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posLeft().y) || (aLife.circles[circle].attr('cx') == aLife.circles[circleUUID].posTopLeft().x && aLife.circles[circle].attr('cy') == aLife.circles[circleUUID].posTopLeft().y)) {
						returnVal += 1;
					}
				}
				//returnVal.x = aLife.circles[circleUUID].attr('cx') - aLife.spacing;
				//returnVal.y = aLife.circles[circleUUID].attr('cy') - aLife.spacing;
				return (returnVal);
			};

			aLife.circles[circleUUID].thisIndex = function() {
				//console.log('searching index');
				var returnVal = -1;
				var currentIndex = 0;
				for (circle in aLife.circles) {
					if (aLife.circles[circle].node) {
						if (aLife.circles[circle].node.id == circleUUID) {
							//console.log('found node');
							returnVal = currentIndex;
						}
						currentIndex += 1;
					}
				}
				return (returnVal);
			}
			aLife.createAnimateCircle(circleUUID);
		}
	}

	aLife.createAnimateCircle(null, ($(document).width() / 2), ($(document).height() / 2));

	init();
});
