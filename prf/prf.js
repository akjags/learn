
// 	// red: CD6155
// 	// blue: 5DADE2
// 	// purple: 6155cd

////////////////////////////////
////////// BLOCK 23 /////////////
////////////////////////////////

canvas3 = document.getElementById("canvas3");
ctx3 = canvas3.getContext("2d");

var stimulus = 0; // 0 = wedges, 1 = rings, 2 = bars
var stimPosX;
var stimPosY;
var stimPosTheta;

var tick3;

function run3() {
	ctx3.clearRect(0,0,canvas3.width,canvas3.height);
	// draw Images
	drawStimOpts3();

	// draw circle 
	drawVF();

	// draw pRF
	drawRF();

	// draw activity

	// draw bold

	tick3 = requestAnimationFrame(run3);
}

var activityY = 450;
var activity = [];

var boldY = 200;
var bold = [];

var boundX = [0,500];
var boundY = [150,650];

function drawVF() {
	ctx3.strokeStyle = "#ffffff";
	ctx3.beginPath();
	ctx3.arc((boundX[1]-boundX[0])/2+boundX[0],(boundY[1]-boundY[0])/2+boundY[0],250,0,Math.PI*2);
	ctx3.stroke();
}

var rf = {x:0,y:0,sd:1};

function drawRF() {
	ctx3.strokeStyle = "#ffffff";
	ctx3.beginPath();
	ctx3.arc(rf.x,rf.y,rf.sd,0,Math.PI*2);
	ctx3.stroke();
}

var imgWedges = new Image(); imgWedges.src = "images/wedges.png";
var imgRings = new Image(); imgRings.src = "images/rings.png";
var imgBars = new Image(); imgBars.src = "images/bars.png";

var imgX = [0,100,200];

function drawStimOpts3() {
	ctx3.fillStyle = "#CD6155";
	ctx3.fillRect(imgX[stimulus],0,100,100);
	ctx3.drawImage(imgWedges,imgX[0],0,100,100);
	ctx3.drawImage(imgRings,imgX[1]+5,5,90,90);
	ctx3.drawImage(imgBars,imgX[2]+5,5,90,90);
}

function eventClick3(x,y,shift) {
	for (var i=0;i<imgX.length;i++) {
		if (x>imgX[i]&&x<(imgX[i]+100)&&y<100) {
			// we are overlapping img i
			stimulus = i; return;
		}
	}	
	var dist = Math.hypot(x-((boundX[1]-boundX[0])/2+boundX[0]),y-((boundY[1]-boundY[0])/2+boundY[0]));
	if (dist<250) {
		// we are inside the visual field
		rf.x = x;
		rf.y = y;
		rf.sd = 0;
		drag = true;
	}
}

var drag = false;

function mouseUp3() {
	drag = false;
}

function eventMove3(x,y) {
	if (drag) {
		rf.sd = Math.min(100,Math.hypot(x-rf.x,y-rf.y));
	}
}

////////////////////////////////
////////// END CODE /////////////
////////////////////////////////

function run(i) {	
	$("#continue").show();
	cancelAnimationFrame(tick3);
	// Runs each time a block starts incase that block has to do startup
	switch(i) {
		case 3:
			eventClick = eventClick3;
			eventMove = eventMove3;
			curCanvas = canvas3;
			canvas3.addEventListener("mousedown",updateCanvasClick,false);
			canvas3.addEventListener("mouseup",mouseUp3,false);
			canvas3.addEventListener("mousemove",updateCanvasMove,false);
			run3();
			break;
	}
}

function launch_local() {
}



function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max)+1;
  return Math.floor(Math.random() * (max - min)) + min;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

var eventClick;
var curCanvas;
var eventMove;

function updateCanvasMove(evt) {
  var out = updateCanvas(evt,curCanvas);
  eventMove(out[0],out[1]);
}

function updateCanvasClick(evt) {
  evt.preventDefault();
  var canvas = evt.target;
  var out = updateCanvas(evt,canvas);
  eventClick(out[0],out[1],evt.shiftKey);
}

function updateCanvas(evt,canvas) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  var x =  (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y =  (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  return [x,y];
}