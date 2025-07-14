const Journals = require('../models/journalsModel');
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.journalsPost = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "토큰이 존재하지 않습니다." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    console.log("디코딩된 JWT:", decoded);

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });

    const { type, date, content } = req.body;
    if (!type || !date || !content) {
      return res.status(400).json({ message: "type, date, content를 모두 입력해주세요" });
    }

    await Journals.create({ type, date, content, user_id: user.id });
    return res.status(201).json({ message: "일기 저장 성공" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

exports.getJournalById = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    const journalID = Number(req.params.id);
    const journal = await Journals.findOne({
      where: {
        id: journalID,
        user_id: user.id 
      }
    });

    if (!journal) return res.status(404).json({ message: '일기를 찾을 수 없습니다.' });

    return res.status(200).json({ journal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 오류' });
  }
};

exports.journalsGet = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    const journals = await Journals.findAll({
      where: { user_id: user.id },
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({ journals });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 오류' });
  }
};
