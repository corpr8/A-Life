//now the alife...
//Paul Edwards 2013

var circles = [];
var maxAnimationDuration = 1000;
var minAnimationDuration = 500;
var maxDiameter = 80;
var minDiameter = 1;
var randomLength = true;
var spacing = 130;

$(document).ready(function() {
	$("#raphaelHolder").css("width", $(document).width());
	$("#raphaelHolder").css("height", $(document).height());
	//$('#raphaelHolder').width = document.width;
	//$('#raphaelHolder').height = document.height;
	// Creates canvas 320 × 200 at 10, 50
	var paper = Raphael(document.getElementById("raphaelHolder"), $(document).width() + 400, $(document).height());

	function getRandomDuration() {
		return (Math.floor(Math.random() * (maxAnimationDuration - minAnimationDuration) + minAnimationDuration));
	}

	function getRandomDiameter() {
		return (Math.floor(Math.random() * (maxDiameter - minDiameter) + minDiameter));
	}

	function getRandomWidth() {
		return (Math.floor(Math.random() * ((maxDiameter / 3) - (minDiameter / 3)) + (minDiameter / 3)));
	}

	function getRandomColor() {
		return (rgbToHex(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)));
	}

	//util
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function countCircles() {
		var returnVal = 0;
		for (circle in circles) {
			returnVal += 1
		};
		return (returnVal);
	}

	function anythingAtLocation(locationX, locationY) {
		var returnVal = false;
		for (circle in circles) {
			if (circles[circle].attr('cx') == locationX && circles[circle].attr('cy') == locationY) {
				returnVal = true;
			}
		}
		return (returnVal);
	}

	//util
	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function checkSpawn(circleUUID) {
		//console.log('check spawn');
		//console.log('neighbours: ' + circles[circleUUID].countNeighbours());
		if (circles[circleUUID].countNeighbours() < 3) {
			var myChoice = Math.floor(Math.random() * 8);
			//    console.log("choice: " + myChoice);
			switch(myChoice) {
				case 0:
					createAnimateCircle(null, circles[circleUUID].posTop().x, circles[circleUUID].posTop().y);
					break;
				case 1:
					createAnimateCircle(null, circles[circleUUID].posTopRight().x, circles[circleUUID].posTopRight().y);
					break;
				case 2:
					createAnimateCircle(null, circles[circleUUID].posRight().x, circles[circleUUID].posRight().y);
					break;
				case 3:
					createAnimateCircle(null, circles[circleUUID].posBottomRight().x, circles[circleUUID].posBottomRight().y);
					break;
				case 4:
					createAnimateCircle(null, circles[circleUUID].posBottom().x, circles[circleUUID].posBottom().y);
					break;
				case 5:
					createAnimateCircle(null, circles[circleUUID].posBottomLeft().x, circles[circleUUID].posBottomLeft().y);
					break;
				case 6:
					createAnimateCircle(null, circles[circleUUID].posLeft().x, circles[circleUUID].posLeft().y);
					break;
				case 7:
					createAnimateCircle(null, circles[circleUUID].posTopLeft().x, circles[circleUUID].posTopLeft().y);
					break;

			}
		} else {
			//had too many neighbours...
			//    console.log('too many neighbours');
			try {
				circles[circleUUID].stop();
				circles[circleUUID].animate({
					"opacity" : 0,
					"stroke-opacity" : 0,
					"r" : 0
				}, (thisAnimationDuration / 2), "linear", function() {
					//circles[circleUUID].clear();
					//

					var indexToRemove = circles[circleUUID].thisIndex();
					if (indexToRemove > -1) {
						//console.log('found index to remove ' + indexToRemove);
						//circles.splice(indexToRemove, 1);
						circles[circleUUID].remove();
						delete circles[circleUUID];
						//          paper.splice(indexToRemove,0);

					}

				});

			} catch(err) {
				console.log(err);
			}

		}
	}

	var housekeeping = setInterval(function() {
		if (countCircles() < 3) {
			createAnimateCircle(null, ($(document).width() / 2), ($(document).height() / 2));
		}
	}, 2000);

	function createAnimateCircle(circleUUID, circleX, circleY) {
		if (circleUUID) {
			thisAnimationDuration = maxAnimationDuration;

			if (randomLength) {
				thisAnimationDuration = getRandomDuration();
			}
			try {
				//circle existed
				circles[circleUUID].animate({
					fill : getRandomColor(),
					stroke : getRandomColor(),
					"stroke-width" : getRandomWidth(),
					"stroke-opacity" : Math.random(),
					"fill-opacity" : Math.random() / 2,
					"r" : getRandomDiameter()
				}, (thisAnimationDuration / 2), "linear", function() {
					try {
						circles[circleUUID].animate({
							fill : getRandomColor(),
							stroke : getRandomColor(),
							"stroke-width" : getRandomWidth(),
							"stroke-opacity" : Math.random(),
							"fill-opacity" : Math.random() / 2,
							"r" : getRandomDiameter()
						}, (thisAnimationDuration / 2), "linear", function() {
							checkSpawn(circleUUID);
							createAnimateCircle(circleUUID);
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
				if (anythingAtLocation(circleX, circleY) || circleX < 0 || circleY < 0 || circleX > $(document).width() || circleY > $(document).height()) {
					return;
				}
				circles.push();
				circles[circleUUID] = paper.circle(circleX, circleY, 1);
			} else {
				circles.push();
				//      console.log('no xy');
				circles[circleUUID] = paper.circle(($(document).width() / 2), ($(document).height() / 2), 1);
			}

			circles[circleUUID].node.id = circleUUID;

			circles[circleUUID].posTop = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx');
				returnVal.y = circles[circleUUID].attr('cy') - spacing;
				return (returnVal);
			};

			circles[circleUUID].posTopRight = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx') + spacing;
				returnVal.y = circles[circleUUID].attr('cy') - spacing;
				return (returnVal);
			};

			circles[circleUUID].posRight = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx') + spacing;
				returnVal.y = circles[circleUUID].attr('cy');
				return (returnVal);
			};

			circles[circleUUID].posBottomRight = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx') + spacing;
				returnVal.y = circles[circleUUID].attr('cy') + spacing;
				return (returnVal);
			};

			circles[circleUUID].posBottom = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx');
				returnVal.y = circles[circleUUID].attr('cy') + spacing;
				return (returnVal);
			};

			circles[circleUUID].posBottomLeft = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx') - spacing;
				returnVal.y = circles[circleUUID].attr('cy') + spacing;
				return (returnVal);
			};

			circles[circleUUID].posLeft = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx') - spacing;
				returnVal.y = circles[circleUUID].attr('cy');
				return (returnVal);
			};

			circles[circleUUID].posTopLeft = function() {
				var returnVal = [];
				returnVal.x = circles[circleUUID].attr('cx') - spacing;
				returnVal.y = circles[circleUUID].attr('cy') - spacing;
				return (returnVal);
			};

			circles[circleUUID].countNeighbours = function() {
				var returnVal = 1;

				//for(circle in circles){console.log(circles[circle].attr('cx'))}

				for (circle in circles) {
					if ((circles[circle].attr('cx') == circles[circleUUID].posTop().x && circles[circle].attr('cy') == circles[circleUUID].posTop().y) || (circles[circle].attr('cx') == circles[circleUUID].posTopRight().x && circles[circle].attr('cy') == circles[circleUUID].posTopRight().y) || (circles[circle].attr('cx') == circles[circleUUID].posRight().x && circles[circle].attr('cy') == circles[circleUUID].posRight().y) || (circles[circle].attr('cx') == circles[circleUUID].posBottomRight().x && circles[circle].attr('cy') == circles[circleUUID].posBottomRight().y) || (circles[circle].attr('cx') == circles[circleUUID].posBottom().x && circles[circle].attr('cy') == circles[circleUUID].posBottom().y) || (circles[circle].attr('cx') == circles[circleUUID].posBottomLeft().x && circles[circle].attr('cy') == circles[circleUUID].posBottomLeft().y) || (circles[circle].attr('cx') == circles[circleUUID].posLeft().x && circles[circle].attr('cy') == circles[circleUUID].posLeft().y) || (circles[circle].attr('cx') == circles[circleUUID].posTopLeft().x && circles[circle].attr('cy') == circles[circleUUID].posTopLeft().y)) {
						returnVal += 1;
					}
				}
				//returnVal.x = circles[circleUUID].attr('cx') - spacing;
				//returnVal.y = circles[circleUUID].attr('cy') - spacing;
				return (returnVal);
			};

			circles[circleUUID].thisIndex = function() {
				//console.log('searching index');
				var returnVal = -1;
				var currentIndex = 0;
				for (circle in circles) {
					if (circles[circle].node) {
						if (circles[circle].node.id == circleUUID) {
							//console.log('found node');
							returnVal = currentIndex;
						}
						currentIndex += 1;
					}
				}
				return (returnVal);
			}
			createAnimateCircle(circleUUID);
		}
	}

	createAnimateCircle(null, ($(document).width() / 2), ($(document).height() / 2));

	init();
});
