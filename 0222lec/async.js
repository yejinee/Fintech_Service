var fs = require('fs'); //import와 같은 의미

console.log('first'); // 실행 1
// call back 함수 (function)
fs.readFile('example/test.txt', 'utf8', function (err, result) {  //utf8의 형태로 읽어와서 결과 출력
    if (err) {
        console.error(err);
        throw err;
    }
    else {
        console.error("second"); // 실행 3
        console.log(result);// 실행 4 (txt file)
        console.log("last") // 실행 순서를 차례로 하고 싶으면 이 안에 코드 집어넣어주기
    }
});
// console.log("last") // 실행 2


/* 순서가 차례대로가 아닌 경우
파일을 읽어오는 데 시간이 걸리므로 더 빨리 수행할 수 있는 last부터 실행 결과 내보냄
*/