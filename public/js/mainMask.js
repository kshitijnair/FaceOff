console.log("new mask script has loaded");
const svgElem = document.querySelector("#svg"),
  leftEye = document.querySelector("#Leye"),
  leftEBall = document.querySelector("#LEBall"),
  rightEye = document.querySelector("#Reye"),
  rightEBall = document.querySelector("#REBall"),
  smile = document.querySelector("#smile"),
  upSmile = document.querySelector("#upLip"),
  lowSmile = document.querySelector("#lowLip"),
  leftcheek = document.querySelector("#leftCheek"),
  rightCheek = document.querySelector("#rightCheek"),
  leftBrow = document.querySelector("#leftBrow"),
  rightBrow = document.querySelector("#rightBrow"),
  noseElem = document.querySelector("#lineNose"),
  rCheek = document.querySelector("#RCheek"),
  lCheek = document.querySelector("#LCheek"),
  rExp1 = document.querySelector("#rightExp1"),
  lExp1 = document.querySelector("#leftExp1"),
  maskElem = document.querySelector("#facemask"),
  redNose = document.querySelector("#REDnose");

const mainCanvas = document.querySelector("#finalCanvas");
const mainCanvasCtx = mainCanvas.getContext("2d");

// extra flags
let maskName = "owl",
  handsFlag = false,
  svgFlag = false,
  deviceType,
  count = 0;

// screen dimensions
let screenW, screenH;
if (screen.width > 1024) {
  deviceType = "desktop";
  screenW = 512;
  screenH = 288;
} else {
  deviceType = "mobile";
  screenW = 256;
  screenH = 144;
}

//////// MASK CONTROLS ////////
// masks buttons
const mask1 = document.querySelector("#mask1"),
  mask2 = document.querySelector("#mask2"),
  mask3 = document.querySelector("#mask3");

// mask functions
mask1.addEventListener("click", () => {
  console.log("mask1");
  maskName = "owl";
  // mask1.style.width = "100px";
  // mask1.style.height = "100px";
  // mask1.childNodes[0].style.width = "100px";
  // mask1.childNodes[0].style.height = "100px";
  // mask1.childNodes[0].style.borderRadius = "50px";
  mask1.classList.add("selected-mask");
  mask2.classList.remove("selected-mask");
  mask3.classList.remove("selected-mask");

  changeMask(maskName);
});
mask2.addEventListener("click", () => {
  console.log("mask2");
  maskName = "yellowFace";
  mask1.classList.remove("selected-mask");
  mask2.classList.add("selected-mask");
  mask3.classList.remove("selected-mask");
  changeMask(maskName);
});
mask3.addEventListener("click", () => {
  console.log("mask3");
  maskName = "blueMask";
  mask1.classList.remove("selected-mask");
  mask2.classList.remove("selected-mask");
  mask3.classList.add("selected-mask");
  changeMask(maskName);
});

function changeMask(maskName) {
  // update the main mask
  console.log("the mask is:", maskName);
  maskElem.setAttribute("src", `/${maskName}.svg`);
  // update svg
  if (maskName === "yellowFace") {
    rExp1.style.display = "block";
    lExp1.style.display = "block";
    upSmile.setAttribute("stroke", "red");
    lowSmile.setAttribute("stroke", "red");
    redNose.setAttribute("fill", "red");
  } else if (maskName === "owl") {
    lCheek.setAttribute("fill", "red");
    rCheek.setAttribute("fill", "red");
    upSmile.setAttribute("stroke", "red");
    lowSmile.setAttribute("stroke", "red");
    redNose.setAttribute("fill", "red");
    rExp1.style.display = "block";
    lExp1.style.display = "block";
  } else if (maskName === "blueMask") {
    redNose.setAttribute("fill", "blue");
    lCheek.setAttribute("fill", "black");
    rCheek.setAttribute("fill", "black");
    upSmile.setAttribute("stroke", "#3249A0");
    lowSmile.setAttribute("stroke", "#3249A0");
    leftcheek.remove();
    rightCheek.remove();
    rExp1.style.display = "none";
    lExp1.style.display = "none";
  }
}

//////////// CONTROLS ////////////
// control buttons
const handBtn = document.querySelector("#handBtn"),
  //   recordBtn = document.querySelector("#recordBtn"),
  logoutBtn = document.querySelector("#logoutBtn");

// control functions
handBtn.addEventListener("click", (event) => {
  handsFlag = !handsFlag;
  handBtn.classList.toggle("handBtn-pressed");
});

function loadParameters(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "params.json", true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}
function initParameters() {
  loadParameters(function (response) {
    // Parse JSON string into object
    parameters = JSON.parse(response);
    console.log(parameters);
  });
}
initParameters();

function onResultsNEW(results) {
  maskElem.classList.remove("maskOFF");
  maskElem.classList.add("maskON");

  svgElem.style.display = "initial";

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  canvasCtx.restore();

  // ALL VARIABLES
  let noseX; // center of nose
  let rCenX, rCenY, lCenX, lCenY; // center of eyes
  let rEyeW, rEyeH, lEyeW, lEyeH; // shape of eyes
  let uLmiddleX,
    uLmiddleY,
    lipRightX,
    lipRightY,
    lipLeftX,
    lipLeftY, // upper lips variables
    lLmiddleX,
    lLmiddleY; // lower lips variables
  let maskH, maskW, maskRight, maskTop; // for mask dimensions
  let LCheekUp = {},
    LCheekLow = {},
    LCheekControlP = {}; // L-Cheek Points
  let RCheekUp = {},
    RCheekLow = {},
    RCheekControlP = {}; // R-Cheek Points
  let LBrowIn = {},
    LBrowOut = {},
    LBrowControl = {}; // L-Brow Points
  let RBrowIn = {},
    RBrowOut = {},
    RBrowControl = {}; // R-Brow Points
  let noseUp = {},
    noseDown = {},
    noseControlP = {}; // Nose Points
  let rCheekCenX, rCheekCenY, rCheekRadX, rCheekRadY; // Righ-cheek ellipse
  let lCheekCenX, lCheekCenY, lCheekRadX, lCheekRadY; // Righ-cheek ellipse

  let RE1 = {},
    RE2 = {},
    RE3 = {},
    RE4 = {},
    RE5 = {};

  let LE1 = {},
    LE2 = {},
    LE3 = {},
    LE4 = {},
    LE5 = {};

  // MASK SIZE CALCULATION
  // [234] is l-cheek end
  // [454] is r-cheek end
  // [10] is forehead-top
  // [152] is chin-bottom
  /// width -> height calculation * wfactor
  /// position from center:
  /// top = center of face
  /// right = nose point - (half width)

  let distance = 0;
  nose = results.faceLandmarks[152].x * screenW;
  maskW =
    (results.faceLandmarks[454].x - results.faceLandmarks[234].x) *
    screenW *
    parameters[maskName].widthFactor;
  maskH = maskW * parameters[maskName].heightFactor;
  //   maskRight = nose - (maskW / 2) * 0.3;
  maskRight = nose - maskW / parameters[maskName].heightFactor + 40;

  maskTop =
    results.faceLandmarks[10].y * screenH * parameters[maskName].maskTopDiv;
  //   console.log(parameters[maskName].maskTopDiv);
  maskElem.style.top = `${maskTop}px`;
  maskElem.style.left = `${maskRight}px`;
  maskElem.style.width = `${maskW}px`;
  maskElem.style.height = `${maskW}px`;
  maskElem.style.display = "none";

  // RIGHT EYE CALCULATIONS
  // [223] rightEye-top
  // [23] rightEye-bottom
  // [33] rightEye-outside
  // [133] rightEye-inside
  rCenX = results.faceLandmarks[223].x * screenW;
  rCenY = results.faceLandmarks[223].y * screenH;
  rCenY = (results.faceLandmarks[23].y * screenH + rCenY) / 2;
  rEyeW =
    (results.faceLandmarks[133].x - results.faceLandmarks[33].x) * screenW;
  rEyeH =
    (results.faceLandmarks[22].y - results.faceLandmarks[223].y) * screenH;
  rightEye.setAttribute("cx", `${rCenX}`);
  rightEye.setAttribute("cy", `${rCenY}`);
  rightEye.setAttribute("rx", rEyeW / 2);
  rightEye.setAttribute("ry", rEyeH / 2);
  rightEBall.setAttribute("cx", `${rCenX}`);
  rightEBall.setAttribute("cy", `${rCenY}`);
  rightEBall.setAttribute("rx", rEyeW / 4);
  rightEBall.setAttribute("ry", rEyeH / 2.5);

  // LEFT EYE CALCULATIONS
  // [443] leftEye-top
  // [253] leftEye-bottom
  // [163] leftEye-outside
  // [362] leftEye-inside
  lCenX = results.faceLandmarks[443].x * screenW;
  lCenY = results.faceLandmarks[443].y * screenH;
  lCenY = (results.faceLandmarks[253].y * screenH + lCenY) / 2;
  lEyeW =
    (results.faceLandmarks[163].x - results.faceLandmarks[362].x) * screenW;
  lEyeH =
    (results.faceLandmarks[253].y - results.faceLandmarks[443].y) * screenH;
  leftEye.setAttribute("cx", `${lCenX}`);
  leftEye.setAttribute("cy", `${lCenY}`);
  leftEye.setAttribute("rx", rEyeW / 2);
  leftEye.setAttribute("ry", rEyeH / 2);
  leftEBall.setAttribute("cx", `${lCenX}`);
  leftEBall.setAttribute("cy", `${lCenY}`);
  leftEBall.setAttribute("rx", rEyeW / 4);
  leftEBall.setAttribute("ry", rEyeH / 2.5);

  // UPPER LIP CALCULATIONS
  // [0] is upper-lip-middle
  // [57] is upper-lip-right
  // [287] is upper-lip-left
  uLmiddleX = results.faceLandmarks[0].x * screenW;
  uLmiddleY = results.faceLandmarks[0].y * screenH;
  lipLeftX = results.faceLandmarks[61].x * screenW;
  lipLeftY = results.faceLandmarks[61].y * screenH;
  lipRightX = results.faceLandmarks[291].x * screenW;
  lipRightY = results.faceLandmarks[291].y * screenH;
  upSmile.setAttribute(
    "d",
    `M ${lipLeftX} ${lipLeftY} Q ${uLmiddleX} ${uLmiddleY} ${lipRightX} ${lipRightY}`
  );

  // LOWER LIP CALCULATIONS
  // [17] is lower-lip-middle
  lLmiddleX = results.faceLandmarks[17].x * screenW;
  lLmiddleY = results.faceLandmarks[17].y * screenH;
  lowSmile.setAttribute(
    "d",
    `M ${lipLeftX} ${lipLeftY} Q ${lLmiddleX} ${lLmiddleY} ${lipRightX} ${lipRightY}`
  );

  // LEFT CHEEK PATH CALCULATIONS
  // [202] is lower-left cheek
  // [186] is upper-left cheek
  // [212] is the left-control point
  LCheekUp.x = results.faceLandmarks[186].x * screenW;
  LCheekUp.y = results.faceLandmarks[186].y * screenH;
  LCheekLow.x = results.faceLandmarks[202].x * screenW;
  LCheekLow.y = results.faceLandmarks[202].y * screenH;
  LCheekControlP.x = results.faceLandmarks[212].x * screenW;
  LCheekControlP.y = results.faceLandmarks[212].y * screenH;
  leftcheek.setAttribute(
    "d",
    `M ${LCheekLow.x} ${LCheekLow.y} Q ${LCheekControlP.x} ${LCheekControlP.y} ${LCheekUp.x} ${LCheekUp.y}`
  );

  // RIGHT CHEEK PATH CALCULATIONS
  // [422] is lower-right cheek
  // [410] is upper-right cheek
  // [432] is the right-control point
  RCheekUp.x = results.faceLandmarks[410].x * screenW;
  RCheekUp.y = results.faceLandmarks[410].y * screenH;
  RCheekLow.x = results.faceLandmarks[422].x * screenW;
  RCheekLow.y = results.faceLandmarks[422].y * screenH;
  RCheekControlP.x = results.faceLandmarks[432].x * screenW;
  RCheekControlP.y = results.faceLandmarks[432].y * screenH;
  rightCheek.setAttribute(
    "d",
    `M ${RCheekLow.x} ${RCheekLow.y} Q ${RCheekControlP.x} ${RCheekControlP.y} ${RCheekUp.x} ${RCheekUp.y}`
  );

  // RIGHT NOSE BROWS CALCULATIONS
  // [98] is at the start point
  // [165] is the first anchor point
  // [92] is the first end point
  // [186] is the second anchor point
  // [57] is the end point
  RE1.x = results.faceLandmarks[98].x * screenW;
  RE1.y = results.faceLandmarks[98].y * screenH;
  RE2.x = results.faceLandmarks[165].x * screenW;
  RE2.y = results.faceLandmarks[165].y * screenH;
  RE3.x = results.faceLandmarks[92].x * screenW;
  RE3.y = results.faceLandmarks[92].y * screenH;
  RE4.x = results.faceLandmarks[186].x * screenW;
  RE4.y = results.faceLandmarks[186].y * screenH;
  RE5.x = results.faceLandmarks[57].x * screenW;
  RE5.y = results.faceLandmarks[57].y * screenH;
  rExp1.setAttribute(
    "d",
    `M ${RE1.x} ${RE1.y} Q ${RE2.x} ${RE2.y} ${RE3.x} ${RE3.y} ${RE4.x} ${RE4.y} ${RE5.x} ${RE5.y}`
  );

  // LEFT NOSE BROWS CALCULATIONS
  // [327] is the start point
  // [391] is the first anchor point
  // [322] is the first end point
  // [410] is the second anchor point
  // [287] is the end point
  LE1.x = results.faceLandmarks[327].x * screenW;
  LE1.y = results.faceLandmarks[327].y * screenH;
  LE2.x = results.faceLandmarks[391].x * screenW;
  LE2.y = results.faceLandmarks[391].y * screenH;
  LE3.x = results.faceLandmarks[322].x * screenW;
  LE3.y = results.faceLandmarks[322].y * screenH;
  LE4.x = results.faceLandmarks[410].x * screenW;
  LE4.y = results.faceLandmarks[410].y * screenH;
  LE5.x = results.faceLandmarks[287].x * screenW;
  LE5.y = results.faceLandmarks[287].y * screenH;
  lExp1.setAttribute(
    "d",
    `M ${LE1.x} ${LE1.y} Q ${LE2.x} ${LE2.y} ${LE3.x} ${LE3.y} ${LE4.x} ${LE4.y} ${LE5.x} ${LE5.y}`
  );

  // LEFT CHEEK ELLIPSE CALCULATIONS
  // [280] is cheek center
  // [347] is the upper for x value
  // [322].Y is lower point of circle (only for scale) -> upper far lip
  // [335].Y is upper point of circle (only for scale) -> below far lip (mirror of 322)
  lCheekCenX = results.faceLandmarks[280].x * screenW;
  lCheekCenY = results.faceLandmarks[280].y * screenH;
  lCheekRadX =
    (results.faceLandmarks[280].x - results.faceLandmarks[347].x) * screenW; // connected in image
  lCheekRadY =
    (results.faceLandmarks[335].y - results.faceLandmarks[322].y) * screenH;
  // update left cheek ellipse
  lCheek.setAttribute("cx", `${lCheekCenX}`);
  lCheek.setAttribute("cy", `${lCheekCenY}`);
  lCheek.setAttribute("rx", lCheekRadX * 2);
  lCheek.setAttribute("ry", lCheekRadY / 6);

  // RIGHT ELLIPSE CHEEK CALCULATIONS
  // [50] is the cheek center
  // [92].Y is lower point of circle (only for scale)
  // [106].Y is upper point of circle (only for scale)
  rCheekCenX = results.faceLandmarks[50].x * screenW;
  rCheekCenY = results.faceLandmarks[50].y * screenH;
  rCheekRadX =
    (results.faceLandmarks[118].x - results.faceLandmarks[50].x) * screenW;
  rCheekRadY =
    (results.faceLandmarks[106].y - results.faceLandmarks[92].y) * screenH;
  // update right cheek ellipse
  rCheek.setAttribute("cx", `${rCheekCenX}`);
  rCheek.setAttribute("cy", `${rCheekCenY}`);
  rCheek.setAttribute("rx", rCheekRadX * 2);
  rCheek.setAttribute("ry", rCheekRadY / 6);

  // NOSE CALCULATIONS
  // [197] is nose-up
  // [94] is nose-down
  // [1] is nose-control
  noseUp.x = results.faceLandmarks[197].x * screenW;
  noseUp.y = results.faceLandmarks[197].y * screenH;
  noseDown.x = results.faceLandmarks[94].x * screenW;
  noseDown.y = results.faceLandmarks[94].y * screenH;
  noseControlP.x = results.faceLandmarks[1].x * screenW;
  noseControlP.y = results.faceLandmarks[1].y * screenH;
  noseElem.setAttribute(
    "d",
    `M ${noseUp.x} ${noseUp.y} Q ${noseControlP.x} ${noseControlP.y} ${noseDown.x} ${noseDown.y}`
  );

  // LEFT EYEBROW CALCULATIONS
  // [65] is left-brow inner
  // [46] is left-brow outer
  // [105] is left-control point
  LBrowIn.x = results.faceLandmarks[65].x * screenW;
  LBrowIn.y = results.faceLandmarks[65].y * screenH;
  LBrowOut.x = results.faceLandmarks[46].x * screenW;
  LBrowOut.y = results.faceLandmarks[46].y * screenH;
  LBrowControl.x = results.faceLandmarks[105].x * screenW;
  LBrowControl.y = results.faceLandmarks[105].y * screenH;
  leftBrow.setAttribute(
    "d",
    `M ${LBrowIn.x} ${LBrowIn.y} Q ${LBrowControl.x} ${LBrowControl.y} ${LBrowOut.x} ${LBrowOut.y}`
  );

  // RIGHT EYEBROW CALCULATIONS
  // [295] is right-brow inner
  // [276] is right-brow outer
  // [334] is right-control point
  RBrowIn.x = results.faceLandmarks[295].x * screenW;
  RBrowIn.y = results.faceLandmarks[295].y * screenH;
  RBrowOut.x = results.faceLandmarks[276].x * screenW;
  RBrowOut.y = results.faceLandmarks[276].y * screenH;
  RBrowControl.x = results.faceLandmarks[334].x * screenW;
  RBrowControl.y = results.faceLandmarks[334].y * screenH;
  rightBrow.setAttribute(
    "d",
    `M ${RBrowIn.x} ${RBrowIn.y} Q ${RBrowControl.x} ${RBrowControl.y} ${RBrowOut.x} ${RBrowOut.y}`
  );

  // [120] is nose left
  redNose.setAttribute(
    "d",
    `M ${results.faceLandmarks[142].x * screenW} ${
      results.faceLandmarks[142].y * screenH
    } Q ${results.faceLandmarks[195].x * screenW} ${
      results.faceLandmarks[195].y * screenH
    } ${results.faceLandmarks[371].x * screenW} ${
      results.faceLandmarks[371].y * screenH
    } ${results.faceLandmarks[371].x * screenW} ${
      results.faceLandmarks[371].y * screenH
    }  ${results.faceLandmarks[164].x * screenW} ${
      results.faceLandmarks[164].y * screenH
    }  ${results.faceLandmarks[98].x * screenW} ${
      results.faceLandmarks[98].y * screenH
    } ${results.faceLandmarks[142].x * screenW} ${
      results.faceLandmarks[142].y * screenH
    }`
  );

  // HANDS ON OTHER CANVAS
  handCtx.save();
  handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
  if (handsFlag) {
    console.log("hands are being drawn");
    drawConnectors(handCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: "#00CC00",
      lineWidth: 5,
    });
    drawConnectors(handCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: "#00CC00",
      lineWidth: 5,
    });
  }

  canvasCtx.restore();

  // combining all the canvases
  mainCanvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  mainCanvasCtx.drawImage(canvasElement, 0, 0); // main face
  // the mask
  if (maskName === "owl") {
    mainCanvasCtx.drawImage(
      maskElem,
      maskRight - 40,
      maskTop - 60,
      maskW * 0.95,
      maskW * 0.95
    );
  } else if (maskName === "yellowFace") {
    mainCanvasCtx.drawImage(
      maskElem,
      maskRight - 20,
      maskTop - 65,
      maskW * 0.65,
      maskW * 0.95
    );
  } else if (maskName === "blueMask") {
    mainCanvasCtx.drawImage(
      maskElem,
      maskRight + 20,
      maskTop - 20,
      maskW * 0.75,
      maskW
    );
  } else console.log("nothing changed...");

  var svgString = new XMLSerializer().serializeToString(svgElem);
  var DOMURL = self.URL || self.webkitURL || self;
  var img = new Image();
  var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  var url = DOMURL.createObjectURL(svg);
  img.onload = function () {
    mainCanvasCtx.drawImage(img, 0, 0);
  };
  img.src = url;

  if (handsFlag) mainCanvasCtx.drawImage(handCanvas, 0, 0); // hands
}

/////////////////////////////////////
/////////////////////////////////////
///// HOLISTIC FILE NO CHANGES //////
/////////////////////////////////////
/////////////////////////////////////

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  },
});

if (holistic) console.log("Holistic model has loaded.");
else console.log("Loading Error!!");

const videoElement = document.querySelector("video");
const canvasElement = document.querySelector("#randoCanvas");
const canvasCtx = canvasElement.getContext("2d");
const handCanvas = document.querySelector("#handCanvas");
const handCtx = handCanvas.getContext("2d");

holistic.setOptions({
  upperBodyOnly: true,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
holistic.onResults(onResultsNEW);
camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({ image: videoElement });
  },
  width: 1920,
  height: 1080,
});
camera.start();
