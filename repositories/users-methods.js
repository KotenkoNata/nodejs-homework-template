const User = require('../model/user-schema');

const findByUserId = async userId => {
  return await User.findById(userId);
};

const findByUserEmail = async email => {
  return await User.findOne({ email });
};

const createUser = async body => {
  const user = new User(body);
  return await user.save();
};

const updateUserToken = async (userId, token) => {
  return await User.updateOne({ _id: userId }, { token });
};

const updateUserSubscription = async (userId, body) => {
  return await User.findByIdAndUpdate(userId, { ...body }, { new: true });
};

module.exports = {
  findByUserId,
  findByUserEmail,
  createUser,
  updateUserToken,
  updateUserSubscription,
};
