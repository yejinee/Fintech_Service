// [ Object]

var car = {
    name: "sonata",
    ph: "500ph",
    // 기능을 정의 
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    }
}

console.log(car.name); //object내부의 데이터 가져오려면 '.'사용
console.log(car.ph)
// 기능 출력하는 법
car.start()
car.stop()

var car2 = {
    name: "bmw",
    ph: "300ph",
    // 기능을 정의 
    start: function () {
        console.log("bmw engine is starting");
    },
    stop: function () {
        console.log("bmw engine is stoped");
    }
}

console.log(car2.name)

var car3 = {
    name: "ford",
    ph: "100ph",
    // 기능을 정의 
    start: function () {
        console.log("Ford engine is starting");
    },
    stop: function () {
        console.log("Ford engine is stoped");
    }
}

var cars = [car, car2, car3]
console.log(cars)

// 실습2 ) 자동차 배열에서 bmw라는 이름을 가진 차량을 찾으면 "!" 출력 (for/if 이용)
for (i = 0; i < cars.length; i++) {
    if (cars[i].name == 'bmw') { console.log("!"); }
}