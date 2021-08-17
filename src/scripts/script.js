const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let tree;
const gap = 80;
const radius = 20;
const frameRate = 200;

function Tree() {
  this.root = null;

  this.addValue = (val) => {
    let node = new Node(val);
    if (this.root == null) {
      this.root = node;
      this.root.level = 1;
      this.root.pos.x = canvas.width / 2;
      this.root.pos.y = 100;
    } else this.root.addNode(node);
  };

  this.draw = () => {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#bbb";
    ctx.strokeStyle = "#bbb";

    if (this.root == null) return "empty";
    this.root.line();
    this.root.draw();
  };
  this.search = (val) => {
    if (this.root == null) return "empty";
    return this.root.search(val);
  };
}

function Node(val, x, y) {
  this.left = null;
  this.right = null;
  this.value = val;
  this.pos = {
    x: null,
    y: null,
  };

  this.addNode = (node) => {
    //less => left
    if (node.value > this.value) {
      //check if null
      if (this.left == null) {
        this.left = node;
        this.left.pos.x = this.pos.x + dist(this.level);
        this.left.pos.y = this.pos.y + gap;
        this.left.level = this.level + 1;
      } else this.left.addNode(node);
    }

    //more => right
    else if (node.value < this.value) {
      //check if null
      if (this.right == null) {
        this.right = node;
        this.right.pos.x = this.pos.x - dist(this.level);
        this.right.pos.y = this.pos.y + gap;
        this.right.level = this.level + 1;
      } else this.right.addNode(node);
    }
  };

  this.draw = (parent = null) => {
    if (this.left) this.left.draw(this);

    drawNode(this, "#bbb", "#202124", "#bbb");

    if (this.right) this.right.draw(this);
  };

  this.line = (parent = null) => {
    if (this.left) this.left.line(this);

    if (parent != null) {
      //draw line
      ctx.beginPath();
      ctx.moveTo(parent.pos.x + radius / 2, parent.pos.y - radius / 2);
      ctx.lineTo(this.pos.x + radius / 2, this.pos.y - radius / 2);
      ctx.stroke();
    }

    if (this.right) this.right.line(this);
  };

  this.search = async (val) => {
    //highlight
    drawNode(this, "#0482e9", "#0482e9", "#202124");

    console.log("frame");
    await sleep(frameRate);

    if (this.value == val) console.log(this.level);
    else if (this.value > val && this.right != null)
      return this.right.search(val);
    else if (this.value < val && this.left != null)
      return this.left.search(val);
    else console.log("not found");
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function drawNode(node, border, fill, text) {
  ctx.strokeStyle = border;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(
    node.pos.x + radius / 2,
    node.pos.y - radius / 2,
    radius,
    radius,
    0,
    0,
    360
  );
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  //text
  ctx.fillStyle = text;
  ctx.fillText(node.value, node.pos.x + 5, node.pos.y - 2);
}

function dist(level) {
  level += 1;
  let num = Math.pow(2, level);
  return canvas.width / num;
}

init();
function init() {
  tree = new Tree();

  random(10);
  tree.draw();
  tree.search(size);
}

function start() {
  const goal = document.querySelector('input[type="number"]').value;

  //reset
  ctx.fillStyle = "#202124";
  ctx.fillRect(0, 0, canvas.height, canvas.width);

  tree.draw();
  tree.search(goal);
}

function random() {
  const size = document.querySelector('input[type="range"]').value;

  tree = new Tree();

  //reset
  ctx.fillStyle = "#202124";
  ctx.fillRect(0, 0, canvas.height, canvas.width);

  for (let i = 0; i < size; i++) {
    tree.addValue(Math.floor(Math.random() * size + 1));
  }
  tree.draw();
}
