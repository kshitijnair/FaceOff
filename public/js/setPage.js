const randoCanvasElem = document.querySelector("#randoCanvas"),
  handCanvasElem = document.querySelector("#handCanvas"),
  finalCanvasElem = document.querySelector("#finalCanvas"),
  svgElement = document.querySelector("#svg"),
  canvases = document.querySelector("#canvases");
const width = screen.width,
  height = screen.height;

if (width > 1024) {
  console.log("device is desktop");
  canvases.setAttribute("width", 512);
  canvases.setAttribute("height", 288);
  canvases.style.width = "512px";
  canvases.style.height = "288px";
  randoCanvasElem.setAttribute("width", 512);
  randoCanvasElem.setAttribute("height", 288);
  handCanvasElem.setAttribute("width", 512);
  handCanvasElem.setAttribute("height", 288);
  finalCanvasElem.setAttribute("width", 512);
  finalCanvasElem.setAttribute("height", 288);
  svgElement.setAttribute("width", 512);
  svgElement.setAttribute("height", 288);
} else {
  console.log("device is mobile");
  canvases.setAttribute("width", 256);
  canvases.setAttribute("height", 144);
  canvases.style.width = "256px";
  canvases.style.height = "144px";
  randoCanvasElem.setAttribute("width", 256);
  randoCanvasElem.setAttribute("height", 144);
  handCanvasElem.setAttribute("width", 256);
  handCanvasElem.setAttribute("height", 144);
  finalCanvasElem.setAttribute("width", 256);
  finalCanvasElem.setAttribute("height", 144);
  svgElement.setAttribute("width", 256);
  svgElement.setAttribute("height", 144);
}
