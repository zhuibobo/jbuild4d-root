let methodName="one";
class Point {
    x = 0;
    y = 0;
    z = 0;

    static static_x=1;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x},${this.y},${this.z})`;
    }

    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter: '+value);
    }

    [methodName](){
        console.log("Log......."+methodName);
    }

    static staticMethod() {
        return 'static method hello '+this.static_x;
    }
}

let pointInstance=new Point(1,2);
console.log(pointInstance.toString());
pointInstance.prop="hellow";
console.log(pointInstance.prop);
pointInstance.one();
Point.static_x="酷狗";
console.log(Point.staticMethod());