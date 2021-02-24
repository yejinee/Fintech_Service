// middleware ( request -> response사이의 중간 매개체 : 사용자가 맞는지 검사하는 역할 )

const jwt = require("jsonwebtoken");
var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%";
//f@i#n%tne#ckfhlafkd0102test!@#%
const authMiddleware = (req, res, next) => {
  const token = req.headers["ourtoken"] || req.query.token; // ourtoken이라는 애가 있으면 가지고 와서 (얘를 header에 넣어주기)
  console.error(token);
  if (!token) { // 토큰이 없는 경우
    return res.status(403).json({
      server: "우리서버",
      success: false,
      message: "not logged in",
    });
  }
  // 비동기 방식이기 때문에 순서대로 처리하기 위해 (callback과 같은 역할)
  // callback을 쓰다보다 한계가 옴 so Promise, async .. 사용함
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, tokenKey, (err, decoded) => { //검증
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error) => {
    console.log(error);
    res.status(403).json({
      server: "우리서버",
      success: false,
      message: error.message,
    });
  };

  p.then((decoded) => { //token에서 나온 값 다음으로 넘김
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;
