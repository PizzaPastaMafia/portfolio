var prevX = mouseX;
var prevY = mouseY;
function setup() {
    createCanvas(windowWidth, windowHeight);
    fill(126);
    background(102);
    stroke(Math.random()*200);
}
function draw() {
    line(mouseX, mouseY, prevX, prevY); 
    prevX = mouseX;
    prevY = mouseY;
}

