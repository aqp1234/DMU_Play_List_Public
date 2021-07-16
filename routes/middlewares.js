const Question = require('../schemas/question');

exports.isLoggedIn = (req, res, next) => { // isLoggedIn export
  if (req.isAuthenticated()) { // 로그인 됬다고 인증됬을 시
    next();
  } else { // 인증 불가시
    res.redirect('/main?error=로그인이 필요합니다.'); //로그인 창으로 다시 돌아감
  }
};
  
exports.isNotLoggedIn = (req, res, next) => { // isNotLoggedIn export
  if (!req.isAuthenticated()) { // 인증이 안됬을 시
    next();
  } else { // 인증이 된경우
    const message = encodeURIComponent('로그인한 상태입니다.'); // 이미 로그인 된 상태라고 알려줌
    res.redirect(`/main?error=${message}`);
  }
};

exports.isAdmin = (req, res, next) => { // isAdmin export / 어드민인지 확인하는 미들웨어
  if(req.user){
    if(req.user.is_admin){
      next();
    }else{
      const message = encodeURIComponent('관리자만 접속 가능합니다.');
      res.redirect(`/customer/?error=${message}`);
    }
  }else{
    const message = encodeURIComponent('로그인이 필요합니다.');
    res.redirect(`/main/?error=${message}`);
  }
};

exports.isMyQuestion = async (req, res, next) => { //question에서 비밀글 판단 미들웨어
  const exquestion = await Question.findOne({ // 조회 필요한 question 
    _id: req.params.questionid,
  });
  if(exquestion.is_secret){ // 해당 question이 비밀글인 경우
    if(req.user){ // 로그인 된 경우
      if(req.user.is_admin){ // 로그인된 유저가 관리자라면 접속 가능
        next();
      }else{
        if(exquestion.user_id == req.user.id){ // 본인이 작성한 글이 맞다면 통과
          next();
        }else{ // 본인 작성글이 아닌 경우 에러 반환 후 접근 불가
          res.redirect('/customer/questionboard/?error=비밀글입니다.');
        }
      }
    }else{ // 로그인이 안된경우 비밀글이라는 에러 반환 후 접근 불가
      res.redirect('/customer/questionboard/?error=비밀글입니다.');
    }
  }else{ // question이 비밀글이 아닌 경우
    next(); // 접속 가능
  }
}

exports.iscash = async(req, res, next) => {
  if(req.user){
    if(req.user.cash){
      next();
    }else{
      return;
    }
  }else{
    return;
  }
}