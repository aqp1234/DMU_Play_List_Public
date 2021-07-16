const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD } = process.env; // .env 파일에서 선언한 내용 가져오기 (보안을 위해 따로 저장)

const connect = () =>{
    if(process.env.NODE_ENV !== 'production'){ // .env 파일에서 NODE_ENV이 production이 아니라면 
        mongoose.set('debug', true); // 디버깅 내용 보이게 설정
    }
    mongoose.connect(`mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`, { // 몽고 DB 접속
        dbName: 'DPL', // 데이터베이스 이름
        useNewUrlParser: true, // ??? 먼지 모름
        useCreateIndex: true, // ??? 먼지 모름
    }, (err) => {
        if(err){
            console.log('몽고디비 연결 에러', err);
        } else {
            console.log('몽고디비 연결 성공');
        }
    });
};

mongoose.connection.on('error', (err) => { // 몽고디비 연결중에 에러가 났다는 이벤트 발생시
    console.error('몽고디비 연결 에러', err);
});

mongoose.connection.on('disconnected', () => { // 몽고디비 연결중 연결 종료 이벤트 발생시
    console.error('몽고디비 연결 종료, 재연결 시도');
    connect(); // 다시 connect 시도
});

module.exports = connect; //connect 함수 export