class Point {
    x = 0;
    y = 0;
    z = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x},${this.y},${this.z})`;
    }
}

console.log((new Point(1,2)).toString());