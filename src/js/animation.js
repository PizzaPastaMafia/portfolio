
let x = 0;
let y = 0;
let dim = 80.0;

function setup() {
    createCanvas(720, 400);
    noStroke();
    let invisibleDiv = createDiv('yooooo');
    invisibleDiv.position(350, 200);

    let aboutMe = createDiv('About Me');
    aboutMe.class('textbox');
    aboutMe.position(50, 200);
    for(var i = 50; i< 350; i++ ){
        translate(i, 200);

    }

  
}

function draw() {
  background(102);
  fill(255);

}
