

function example() {
    return [1, 2, 3];
}
let [a, b, c] = example();

let jsonData = {
    id: 42,
    status: "OK",
    data: [867, 5309]
};
let { id, status, data: number } = jsonData;

console.log(id);
console.log(status);
console.log(number);