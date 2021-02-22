var fs = require('fs');
console.log('A');
//지원하는 메서드 사용해서 비동기 해결
var result = fs.readFileSync('example/test.txt', 'utf8');
console.log(result);
console.log('C');
