/*
[ 3. function ]
function 함수명 (변수){
}
*/
function myFunction() {
    console.log("hello");
}
myFunction();

/*
// es6 문법
const hello=()=>{
    console.log("hello2");
}

hello()
*/

// 실습1) 사칙연산을 하는 +-/* 기능을 작성하기 (plus,minus,div,multi)
function plus(x, y) {
    return x + y;
}
function minus(x, y) {
    if (x >= y) return x - y;
    else return y - x;
}
function div(x, y) {
    return x / y;
}
function multi(x, y) {
    return x * y;
}

var x = plus(4, 3);
console.log(x);
console.log(minus(7,4));


