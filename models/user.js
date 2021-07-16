const Sequelize = require('sequelize'); // sequelize 가져오기

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email: { //사용자 이메일
                type: Sequelize.STRING(40),
                allowNull: false, // 필수값
                unique: true, // unique=true 설정
            },
            name: { // 사용자 이름
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: { // 사용자 비밀번호
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            phone: { // 사용자 핸드폰 번호
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            cash: { // 결제여부
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            tid: {
                type: Sequelize.STRING(100),
            },
            is_admin: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt 자동생성
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // deletedAt 자동생성 및 delete 하면 값이 실제로 삭제되지 않고 deletedAt으로 기록됨 / find할때는 제외되고 검색됨 (탈퇴 복구 같은 기능 사용할 수 있어 true설정)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
    }
}