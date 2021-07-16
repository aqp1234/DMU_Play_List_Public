const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { default: axios } = require('axios');
const User = require('../models/user');

const router = express.Router();

router.get('/', isLoggedIn, async(req, res, next) => {
    res.render('kakaopay/index');
});

router.post('/', isLoggedIn, async(req, res, next) => {
    let URL = 'https://kapi.kakao.com/v1/payment/ready' // 카카오페이 결제할 수 있는 url
    let headers = {
        "Authorization": "KakaoAK " + "bacd866540f02c9c4b45860419eb0515", // 카카오페이 인증 코드
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8", // 카카오페이에서 지정한 Content-type
    }
    let params = {
        "cid": "TC0ONETIME", // 테스트용 CID
        "partner_order_id": "1001", // 가맹점 코드 (테스트)
        "partner_user_id": req.user.id, // 사용자 고유 번호
        "item_name": "DMU 이용권", // 판매 물품 이름
        "quantity": "1", // 판매 개수
        "total_amount": "9900", // 총 결제 가격
        "tax_free_amount": "0", // 상품 비과세 금액
        "approval_url": "http://localhost:8006/kakaopay/approval?userid="+req.user.id, // 구매 성공시 이동될 url
        "cancel_url": "http://localhost:8006/kakaopay/cancel", // 구매 취소시 이동할 url
        "fail_url": "http://localhost:8006/kakaopay/fail", // 구매 실패시 이동할 url
    }
    let _res = await axios({ // 위에서 설정한 url로 post방식으로 접속
        url: URL,
        method: 'POST',
        headers,
        params,
    });
    let resultURL = _res['data']['next_redirect_pc_url']; // 반환된 데이터의 다음 url 가져오기
    let _tid = _res['data']['tid']; // 결제된 tid 값 가져오기

    await User.update({ // 사용자 정보에 tid값 저장
        tid: _tid,
    }, {
        where: {
            id: req.user.id,
        }
    });

    res.redirect(resultURL); // 다음 url로 리다이렉션
});

router.get('/approval', async(req, res, next) => {
    const user_id = req.query.userid; // url의 query에서 userid 값 가져오기
    const _user = await User.findOne({ // 가져온 userid 값으로 user조회
        where: {
            id: user_id,
        }
    });
    let pg_token = req.query.pg_token; // kakaopay에서 결제 된 pg_token query에서 가져오기
    
    let url='https://kapi.kakao.com/v1/payment/approve'; // 카카오페이 결제 완료시 접속할 url
    let headers = {
        'Authorization': "KakaoAK " + "bacd866540f02c9c4b45860419eb0515", // 카카오페이 인증 코드
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8", // 카카오페이 Content-type
    };

    let params = { 
        'cid': 'TC0ONETIME', // 테스트 cid
        "partner_order_id": "1001", // 테스트 가맹점코드
        "partner_user_id": _user.id, // 사용자 고유 아이디값
        pg_token, // 결제 pg_token
        tid: _user.tid, // 결제정보 tid 값
    };

    let _result = await axios({
        url,
        method: 'POST',
        headers,
        params,
    }).catch((e) => {
        console.error(e);
        next(e);
    });
    
    await User.update({ // 결제가 완료되었다는 내용 DB에 update
        cash: 1,
    }, {
        where: {
            id: _user.id,
        }
    });

    res.render('kakaopay/approval', {result: _result.data}); // 결제 완료시의 랜더링 될 페이지
});

router.get('/cancel', async(req, res, next) => {
    res.render('kakaopay/cancel');
});

router.get('/fail', async(req, res, next) => {
    res.render('kakaopay/fail');
});

module.exports = router;