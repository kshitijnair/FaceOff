let recordCanvas = document.querySelector("#finalCanvas");
let chunks = [],
  click = 0;
let recordBtn = document.querySelector("#recordBtn");
console.log(recordBtn);

let framerate = 30;

let options = {
  videoBitsPerSecond: 2500000,
  mimeType: "video/mp4",
};

// create stream
let stream = recordCanvas.captureStream(framerate);
let recorder = new MediaRecorder(stream);

// new recorded data
recorder.ondataavailable = (e) => {
  if (e.data.size) chunks.push(e.data);
};

// export video on stop
recorder.onstop = () => {
  let blob = new Blob(chunks);
  var a = document.createElement("a");
  // document.querySelector(".row").appendChild(a);
  a.href = URL.createObjectURL(blob);
  a.style = "display:none;";
  a.download = "TEST.mp4";
  a.innerText = "DOWNLOAD VIDEO HERE";
  a.click();
  window.URL.revokeObjectURL(a.href);
};

// start button on click
recordBtn.onclick = function () {
  console.log("record btn pressed ");
  if (click % 2 === 0) {
    chunks.length = 0;
    recorder.start();
    console.log(recorder.state);
    console.log("recorder started");
    recordBtn.style.background = "rgb(245, 82, 82)";
  } else if (click % 2 === 1) {
    recorder.stop();
    console.log("recorder stopped, saving video...");
    recordBtn.style.background = "rgb(0, 139, 139)";
  }
  click++;
};
