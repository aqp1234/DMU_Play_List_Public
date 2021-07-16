Dmu_PLay_List
===================
프로그램 설명
------------
DMU_Play_List 음악 스트리밍 사이트이다. 사용자는 웹사이트에 접속하여 음악을 들으며 사이트를 이용할 수 있다.     
타 음악 스트리밍 사이트와는 다른점은 별도의 플레이어 프로그램 없이 스트리밍을 할 수 있다는 장점이 있다.     
웹 사이트가 이동하더라도 노래가 끊기지 않으며, 노래를 계속해서 들을 수 있다.     
***
사용 메뉴얼
-------------
1. 사용자는 mysql과 mongodb가 있어야 한다.     
   mysql 다운로드 링크 : [다운로드](https://dev.mysql.com/downloads/mysql/)    
   mongodb 다운로드 링크 : [다운로드](https://www.mongodb.com/try/download/community)    
2. 각 DB에 접속하기 위한 DB아이디, 비밀번호를 저장해야 한다.     
   mysql : config/config.json 파일에 username 에 아이디, password 에 비밀번호를 입력한다.     
   mongodb : .env 파일에 MONGO_ID=아이디, MONGO_PASSWORD=비밀번호 를 입력한다.     
3. mongo.cmd, mongoshell.cmd 파일에 mongodb가 다운로드 되어있는 링크 설정     
   ex.) cd mongodb링크     
4. visual studio에서 터미널 접속 후 다음 순서대로 입력     
   가상환경 접속 : venv\Scripts\activate.bat      
   mongodb 서버 실행 : npm run mongo     
   mongo shell 실행 : npm run mongoshell     
   서버 실행 : npm start     
5. http://localhost:8006 접속     
6. 우측 상단 회원가입 또는 우측 네비게이션바에서 회원가입 클릭하여 회원가입 진행     
7. mysqlworkbench 에서 UPDATE users SET is_admin=1 WHERE (id = 사용자아이디값); 실행하여 관리자 계정으로 설정
8. 음원 추가 위해 메인화면에서 음원정보추가 클릭
9. 등록된 아티스트 > 등록된 앨범 > 등록된 음원 순서대로 추가하여 음원 추가
