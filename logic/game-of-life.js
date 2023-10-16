const board          = document.getElementById("board");
const generationDesc = document.getElementById("generation");
const cellsAliveDOM  = document.getElementById("cells--alive");

// Making sure its a square
board.height = board.offsetWidth;
board.width  = board.offsetWidth;

const ctx         = board.getContext('2d');
const boardWidth  = board.width;
const boardHeight = board.height;

let cellCount  = 50; // For x and y (default)
let cellsAlive = 0;
let generation = 0;

let mouse = {
    x: null,
    y: null
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
})

let cells = [];

class Cell {
    constructor(id, x, y, size, color, isActive = false) {
        let offset = 0.2;
        this.id = id;
        this.x = x + offset;
        this.y = y + offset;
        this.size = size - offset;
        this.color = color || "white";
        this.isActive = isActive;
        this.fate = isActive;
        this.drawBorder();
    }

    cellFate(neighbors) {
        let activeNeighbors = neighbors.filter((e) => e && e.isActive ).length;

        if(this.isActive && (activeNeighbors < 2 || activeNeighbors > 3)) {
            this.fate = false;
        } 
        
        else if (!this.isActive && activeNeighbors === 3) {
            this.fate = true;
        }
    }

    draw() {       
        ctx.fillStyle = this.isActive ? this.color : "black";
        ctx.fillRect(this.x, this.y, this.size, this.size)  ;
    }

    drawBorder() {
        let thickness = 0.1;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - thickness, 
            this.y - thickness, 
            this.size + (thickness * 2), 
            this.size + (thickness * 2)
        );
    }
}

export function changeSize(dimension) { 
    cellCount = dimension;
    generate(cells[0][0].color); // get color sample before update
    draw();
    updateDesc();
}

export function generate(color) {
    // Clear Everything
    cells = [];
    generation = 0;
    cellsAlive = 0;
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    
    for(let y = 0; y < cellCount; y++) {
        let row = [];
        for(let x = 0; x < cellCount; x++) {
            let size = Math.floor((((boardWidth / cellCount) + (boardHeight / cellCount)) / 2));

            row.push(new Cell((y * cellCount) + x, x * size, y * size, size, color));
        }
        cells.push(row);
    }
}

export function draw(isActivated = false) {
    cellsAlive = 0;
    for(let y = 0; y < cells.length; y++) {
        for(let x = 0; x < cells.length; x++) {
            if(!isActivated) { 
                cells[y][x].drawBorder();
            }
            cells[y][x].isActive = cells[y][x].fate;
            cells[y][x].isActive ? cellsAlive++ : false; 
            cells[y][x].draw();
        }
    }
    generation++;
}

export function checkNeighbors() {
    for(let y = 0; y < cellCount; y++) {
        for(let x = 0; x < cellCount; x++) {
            let upper =      null;
            let upperLeft =  null;
            let upperRight = null;

            let lower =      null;
            let lowerLeft =  null;
            let lowerRight = null;

            let top = cells[y - 1];
            if(top) {
                upper =      cells[y - 1][x] || null;
                upperLeft =  cells[y - 1][x - 1] || null;
                upperRight = cells[y - 1][x + 1] || null;
            }

            let bottom = cells[y + 1];
            if(bottom) {
                lower =      cells[y + 1][x] || null;
                lowerLeft =  cells[y + 1][x - 1] || null;
                lowerRight = cells[y + 1][x + 1] || null;
            }

            let left =  cells[y][x - 1] || null;
            let right = cells[y][x + 1] || null;
            
            let neighbors = [ upper, upperLeft, upperRight, left, right, lower, lowerLeft, lowerRight ];
            cells[y][x].cellFate(neighbors);
        }
    }
}

export function randomize() {
    function random() {
        return Math.round(Math.random()) == 1;
    }

    for(let i = 0; i < cells.length; i++) {
        for(let j = 0; j < cells.length; j++) {
            let state = random();
            cells[i][j].isActive = state;
            cells[i][j].fate = state;
        }
    }
}

export function updateTheme(color) {
    for(let i = 0; i < cells.length; i++) {
        for(let j = 0; j < cells.length; j++) {
            cells[i][j].color = color;
        }
    }
}

export function updateDesc() {
    generationDesc.textContent = "Generation: " + generation;
    cellsAliveDOM.textContent = "Cells Alive: " + cellsAlive;
}

/** Cell Toggler */
board.addEventListener('click', (e) => {
    let boardRect = e.target.getBoundingClientRect();
    let mouseX = mouse.x - boardRect.left;
    let mouseY = mouse.y - boardRect.top;
    
    for(let y = 0; y < cells.length; y++) {
        for(let x = 0; x < cells.length; x++) {
            if(
                mouseX >= cells[y][x].x && mouseX <= (cells[y][x].x + cells[y][x].size) && 
                mouseY >= cells[y][x].y && mouseY <= (cells[y][x].y + cells[y][x].size)
            ) {
                cells[y][x].isActive = !cells[y][x].isActive;
                cells[y][x].fate = !cells[y][x].fate;
                
                cells[y][x].isActive ? cellsAlive++ : cellsAlive--; 
                cells[y][x].draw();
                break;
            }
        }
    }
    updateDesc();
})