/* 
Node.js는 비동기 방식 프로그램이기 때문에 결과가 차례대로 나오지 않음!
=> 먼저끝나는 것부터 실행시킴 
*** Callback Function 이용하기 ****




*/
function aFunc() {
    setTimeout(function () {
        console.log('a');
    },1700)
}

function bFunc() {
    setTimeout(function () {
        console.log('b');
    },1000)
}

function cFunc() {
    setTimeout(function () {
        console.log('c');
    },500)
}

aFunc();
bFunc();
cFunc();
