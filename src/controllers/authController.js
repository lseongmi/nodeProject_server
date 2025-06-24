const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function validationEmail(email) {
    const regex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; //이메일 형식인지
    return regex.test(email);
}

function validationPassword(password) {
    const regex = /^[a-zA-Z0-9]{5,10}$/;
    return regex.test(password);
}

exports.login = async(req, res) => {
    const {email, password} = req.body;

    //유효성 검사 
    if(!email || !validationEmail(email)) {
        return res.status(400).json({message : "유효하지않은 이메일 입니다"});
    }

    try {
        //해당 email을 가진 사용자 조회
        const user = await User.findOne({where : {email}});

        if(!user) {
            return res.status(400).json({message : "유효하지 않은 이메일입니다"});
        }

        //비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({message: "비밀번호가 일치하지 않습니다."})
        }

        //jwt 토큰 생성
        const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10; //10년
        const token = jwt.sign({email : user.email}, process.env.JWT_SECRET, {expiresIn : TEN_YEARS_IN_SECONDS});

        res.status(200).json({
            message: '로그인 성공',
            token,
            email : user.email,
            nickname : user.nickname
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message : "서버오류", error : err});
    }
}

exports.join = async(req, res) => {
    const {nickname, password, email} = req.body;

     // 유효성 검사
     if (!nickname || nickname.length < 2 || nickname.length > 10) {
        return res.status(400).json({ message: '이름은 2~10자여야 합니다.' });
    }
    if (!email || !validationEmail(email)) {
        return res.status(400).json({ message: '유효하지 않은 이메일입니다' });
    }

    try {

        // email 중복 체크
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
        }

        // 비밀번호 해싱
        const hashedPass = await bcrypt.hash(password, 10);

        // DB에 저장
        await User.create({
            nickname,
            password: hashedPass,
            email
        });

        res.status(201).json({ message: '회원가입 성공', nickname, email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류', error });
    }
};