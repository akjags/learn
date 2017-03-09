
// 	// red: CD6155
// 	// blue: 5DADE2
// 	// purple: 6155cd
backcanvas = document.getElementById("backcanvas");
backctx = backcanvas.getContext("2d");

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

	// draw Stimulus
	drawStim();

	// compute
	computeActivity();

	// draw activity
	drawActivity();

	// draw bold
	drawBold();

	tick3 = requestAnimationFrame(run3);
}


function computeActivity() {
	// Uses the back canvas to draw the RF once, and then the stimulus, both at low resolution (50x50)
	// it pulls each image using backcanvas.imageData and then computes the overlap

	// step 1: draw the RF
	var x=Math.round((rf.x-boundX[0])/10),
		y = Math.round((rf.y-boundY[0])/10);
	backctx.globalCompositeOperation = "source-over";
	backctx.fillStyle = "#000000";
	backctx.fillRect(0,0,50,50);
	for (var i=0;i<50;i++) {
		for (var j=0;j<50;j++) {
			var dist = Math.hypot(i-x,j-y);
			var pixelValue = normpdf(dist,0,rf.sd/10)/normpdf(0,0,rf.sd/10);
			// set to gaussian value
			if (pixelValue>0.05) {
				backctx.fillStyle = gsc2hex(pixelValue);
				backctx.fillRect(i,j,1,1);
			}
		}
	}
	RFdata = backctx.getImageData(0,0,50,50);
	// step 2: draw the stimulus using type "source-in"
	backctx.fillRect(0,0,50,50);
	backctx.fillStyle="#ffffff";
	switch (stimulus) {
		case 0:
			backctx.beginPath();
			backctx.arc(25,25,25,stimTheta-0.1,stimTheta+0.1);
			backctx.arc(25,25,0,stimTheta-0.1,stimTheta+0.1);
			backctx.fill();
			break;
		case 1:
			backctx.beginPath();
			backctx.arc(25,25,stimEcc/10+1,0,Math.PI*2);
			backctx.arc(25,25,stimEcc/10-1,0,Math.PI*2,true);
			backctx.fill();
			break;
		case 2:
			// bars horizontal
			backctx.fillRect(0,Math.round((stimY-boundY[0])/10)-2.5,50,5);
			break;
		case 3:
			backctx.fillRect((Math.round(stimX)/10)-2.5,0,5,50);
			break;
	}
	Sdata = backctx.getImageData(0,0,50,50);

	// 
	var effect = 0;
	for (var i=0;i<2500;i++) {
		effect+=RFdata.data[i*4]/255*Sdata.data[i*4]/255;
	}
	if (activity.length>400) {activity.shift();}
	activity.push(effect);

	bold.shift(); bold.push(0);
	for (var i=0;i<hrf.length;i++) {
		bold[activity.length+i]+=hrf[i]/1000*effect;
	}
}

var activityY = 450;
var activity = [];

function drawActivity() {
	ctx3.strokeStyle = "#6155CD";
	ctx3.beginPath();
	ctx3.moveTo(525,activityY-activity[0]);
	for (var i=1;i<activity.length;i++) {
		ctx3.lineTo(525+i,activityY-activity[i]);
	}
	ctx3.stroke();
	// ctx3.font = "Arial 50px";
	ctx3.fillStyle = "#6155CD";
	ctx3.fillText("Neural activity",530,activityY+15);
}

var boldY = 200;
var bold = zeros(500);

var hrf = [0,0,0,0,0,0,0,1,2,4,8,25,80,250,260,265,260,240,100,0,-50,-70,-75,-77,-80,-79,-75,-70,-65,-61,-57,-54];

function drawBold() {
	ctx3.strokeStyle = "#5DADE2";
	ctx3.beginPath();
	ctx3.moveTo(525,boldY-bold[0]);
	for (var i=1;i<activity.length;i++) {
		ctx3.lineTo(525+i,boldY-bold[i]);
	}
	ctx3.stroke();
	// ctx3.font = "Arial 50px";
	ctx3.fillStyle = "#5DADE2";
	ctx3.fillText("Bold activity",530,boldY+15);
}

var boundX = [0,500];
var centX = (boundX[1]-boundX[0])/2+boundX[0];
var boundY = [150,650];
var centY = (boundY[1]-boundY[0])/2+boundY[0];

function drawVF() {
	ctx3.strokeStyle = "#ffffff";
	ctx3.beginPath();
	ctx3.arc(centX,centY,250,0,Math.PI*2);
	ctx3.stroke();
}

function drawStim() {
	ctx3.save();
	ctx3.strokeStyle = "rgba(0,0,0,0);";			
	ctx3.beginPath();
	ctx3.arc(centX,centY,250,0,Math.PI*2);
	ctx3.stroke();
	ctx3.beginPath();
	switch (stimulus) {
		case 0:
			ctx3.arc(centX,centY,250,stimTheta-0.1,stimTheta+0.1);
			ctx3.arc(centX,centY,0,stimTheta-0.1,stimTheta+0.1);
			break;
		case 1:
			ctx3.arc(centX,centY,stimEcc+10,0,Math.PI*2);
			ctx3.arc(centX,centY,stimEcc-10,0,Math.PI*2,true);
			break;
		case 2:
			// bars horizontal
			ctx3.rect(boundX[0],stimY-25,boundX[1]-boundX[0],50);
			break;
		case 3:
			ctx3.rect(stimX-25,boundY[0],50,boundY[1]-boundY[0]);
			break;
	}
	ctx3.clip();
	var stepX = (boundX[1]-boundX[0])/16,
		stepY = (boundY[1]-boundY[0])/16;

	for (var i=0;i<16;i++) {
		for (var j=0;j<16;j++) {
			if (i % 2 != j % 2) {
				ctx3.fillStyle= '#ffffff';
			} else {
				ctx3.fillStyle = '#000000';
			}
			ctx3.fillRect(boundX[0]+i*stepX,boundY[0]+j*stepY,stepX,stepY);
		}
	}
	ctx3.restore();
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

var imgX = [0,100,200,200];

function drawStimOpts3() {
	ctx3.fillStyle = "#CD6155";
	ctx3.fillRect(imgX[stimulus],0,100,100);
	ctx3.drawImage(imgWedges,imgX[0],0,100,100);
	ctx3.drawImage(imgRings,imgX[1]+5,5,90,90);
	if (stimulus==3) {
		ctx3.save();
		ctx3.translate(imgX[2]+50,50);
		ctx3.rotate(Math.PI/2);
		ctx3.drawImage(imgBars,-45,-45,90,90);
		ctx3.restore();
	} else {
		ctx3.drawImage(imgBars,imgX[2]+5,5,90,90);
	}
}

function eventClick3(x,y,shift) {
	for (var i=0;i<imgX.length;i++) {
		if (x>imgX[i]&&x<(imgX[i]+100)&&y<100) {
			// we are overlapping img i
			if (i==2 && stimulus==2) {
				stimulus = 3;
			} else {
				stimulus = i;
			} return;
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

var stimTheta = 0;
var stimEcc = 0;
var stimX = 0;
var stimY = 0;

function eventMove3(x,y) {
	stimX = x; stimY = y;
	if (drag) {
		rf.sd = Math.min(100,Math.hypot(x-rf.x,y-rf.y));
	}
	stimTheta = -Math.atan2(x-centX,y-centY)+Math.PI/2;
	stimEcc = Math.max(10,Math.min(240,x%250));//Math.max(Math.min(240,Math.hypot(x-centX,y-centY)),10);
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


function clipCtx(ctx,canvas) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(canvas.width/2,canvas.height/2,canvas.width/2,0,2*Math.PI,false);
	ctx.clip();
}
