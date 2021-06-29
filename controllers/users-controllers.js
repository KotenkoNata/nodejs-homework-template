const Users = require('../repositories/users-methods');
const { HttpCode } = require('../helpers/constants');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const fs = require('fs/promises');
const EmailService = require('../services/email');
const { CreateSenderSendGrid } = require('../services/email-sender');

const UploadAvatarService = require('../services/local-upload');
const path = require('path');

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByUserEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already used',
      });
    }

    const { id, email, subscription, avatarURL, verifyToken } =
      await Users.createUser(req.body);

    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid(),
      );
      await emailService.sendVerifyEmail(verifyToken, email);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatarURL },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByUserEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword || !user.idVerified) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }
    const id = user.id;
    const payload = { id, test: 'Beautiful' };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateUserToken(id, token);
    return res.json({ status: 'success', code: HttpCode.OK, data: { token } });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateUserToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Not authorized.',
      });
    }

    const { email, subscription } = req.user;

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user.id;
    const updatedSubscription = await Users.updateUserSubscription(
      id,
      req.body,
    );

    if (!updatedSubscription) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found.',
      });
    }
    const { email, subscription } = updatedSubscription;
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Contact updated.',
      payload: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService('public');
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file });
    try {
      await fs.unlink(path.join('public', req.user.avatarURL));
    } catch (e) {
      console.log(e.message);
    }

    await Users.updateAvatar(id, avatarUrl);
    res.json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Avatar uploaded',
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const verificationToken = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verificationToken);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification successful' },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'User not found',
    });
  } catch (error) {
    next(error);
  }
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByUserEmail(req.body.email);
    if (user) {
      const { email, verifyToken, isVerified } = user;
      if (!isVerified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid(),
        );
        await emailService.sendVerifyEmail(verifyToken, email);
        return res.json({
          status: 'success',
          code: 200,
          data: { message: 'Verification email sent' },
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Verification has already been passed',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  updateSubscription,
  avatars,
  verificationToken,
  repeatEmailVerification,
};
