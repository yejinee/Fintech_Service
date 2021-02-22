// [ 5. Array ]
var car1 = "Saab";
var car2 = "Volvo";
var car3 = "BMW";

// array안에 데이터 타입이 중요하지 않음(중간에 숫자 들어가도 가능)
var cars = ["Saab", "Volvo", "BMW"];

console.log(cars);
console.log(cars[0]);
console.log(cars[1]);
console.log(cars[2]);

// [ 6. Loop ]
var cars = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];
var text = "";
var i;
for (i = 0; i < cars.length; i++) {
    text += cars[i];
}
console.log(text);

//es6
cars.map((car) => {
    console.log(car);
})

// [ 7. 조건문 ]
var hour = 15;
var greeting = null;
if (hour < 18) {
    greeting = "Good day";
}
console.log(greeting)