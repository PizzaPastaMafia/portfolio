var prevX = mouseX;
var prevY = mouseY;
var img;

function setup() {
    createCanvas(windowWidth, windowHeight);
    fill(126);
    background(255);
    stroke(Math.random()*200);
    img = loadImage('../assets/moonwalk.png');
    //img[1] = loadImage('assets/img1.jpg'); // Load the image
    //img[2] = loadImage('assets/img2.jpg'); // Load the image
    //for (let i=0; i<3; i++) {
        image(img, 0,0);
    //}
    
}
function draw() {
    line(mouseX, mouseY, prevX, prevY); 
    prevX = mouseX;
    prevY = mouseY;

}

$(".textbox").animate({
    left: '+=150',
    top: '+=150'
}, 1000);
