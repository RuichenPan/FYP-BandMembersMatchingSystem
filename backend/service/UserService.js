import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ModelUser from '../model/model.user';
import BaseService from './BaseService';
import SendGrid from '@sendgrid/mail';
import { ConfigService } from '.';
import cfg from '../cfg';
import SourceService from './SourceService';

class UserService extends BaseService {
  constructor() {
    super(ModelUser);
    this.TableName = ModelUser.modelName;
  }

  /**
   * init sendgrid config
   *
   * @memberof UserService
   */
  async initSendGrid() {
    const { value } = await ConfigService.findOne({ name: 'SendGrid' });
    this.log(value);
    SendGrid.setApiKey(value);
  }

  /**
   *
   *
   * @param {*} [{ to, title, content }={}]
   * @returns
   * @memberof UserService
   */
  async sendEmail({ to, title, content } = {}) {
    if (!to) {
      return this.failure('Please enter email address');
    }
    if (!title) {
      return this.failure('Email subject is not empty');
    }
    if (!content) {
      return this.failure('Email content is not empty');
    }
    try {
      this.log('Send email:', to);
      const msg = { to, from: 'ruichenpan221@gmail.com', subject: title, html: `<div>${content}</div>` };
      const result = await SendGrid.send(msg);
      this.log('Send email success:', to);
      return result;
    } catch (ex) {
      this.log(ex);
      return this.failure(ex);
    }
  }

  /**
   *
   *
   * @param {*} to
   * @param {*} token
   * @returns
   * @memberof UserService
   */
  async verificationEmail(to, token) {
    const [isItExpired, info] = await this.CheckToken(token);
    if (isItExpired) {
      this.failure('expired');
    }
    if (to !== info.to) {
      this.failure('Incorrect email');
    }
    this.log(to, info.to);
    const uInfo = await this.findOne({ email: to });
    if (!uInfo) {
      this.failure('Incorrect email');
    }
    const row = await this.updateOne({ email: to }, { state: 2 });
    return this.success(row);
  }

  async signUpSendEmail(to) {
    const token = jwt.sign({ info: { to } }, cfg.jwtKey, { expiresIn: '24h' });

    const url = `${cfg.webSite}/emailCheck?email=${to}&token=${encodeURIComponent(token)}`;
    const html = `
    <div style="text-align: center; display: -webkit-box;-webkit-box-align: center;-webkit-box-pack: center;">
    <div style="border: 1px solid #f0f0f0; border-radius: 5px; padding: 10px;">
      <div>
      Click here <a href="${url}" target="_blank">
        Email Verification
        </a>
      </div>
      <div>
        ${url}
      </div>
    </div>
  </div>
    `;

    return await this.sendEmail({ to, title: 'Email verification', content: html });
  }

  /**
   * user login
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  async signIn(data) {
    const { username, password } = data;
    if (!username) {
      this.failure('username can not be empty');
    }

    if (!password) {
      this.failure('password can not be empty');
    }

    const info = await this.findOne({ username });
    if (!info) {
      this.failure('invalid username or password');
    }

    // check passowrd
    if (info.password !== bcrypt.hashSync(password, info.salt)) {
      this.failure('invalid username or password');
    }

    delete info.salt;
    delete info.password;
    delete info.create_time;
    delete info.update_time;

    const token = jwt.sign({ info }, cfg.jwtKey, { expiresIn: '24h' });

    return this.success({ ...info, token });
  }

  /**
   * check token
   *
   * @param {*} token
   * @returns
   * @memberof UserService
   */
  async CheckToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, cfg.jwtKey, function (err, decoded) {
        if (err) {
          resolve([true, null]);
        } else {
          resolve([false, decoded.info]);
        }
      });
      return false;
    });
  }

  /**
   * user signup
   *
   * @param {*} data
   * @return {*}
   * @memberof UserService
   */
  async signUp(data) {
    const { username, email, password } = data;

    if (!username) {
      this.failure('username can not be empty');
    }

    if (!email) {
      this.failure('email can not be empty');
    }

    if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email)) {
      this.failure('email Incorrect format');
    }

    if (!password) {
      this.failure('password can not be empty');
    }

    //judge user is exists
    const isExists = await this.findOne({ username });

    if (isExists) {
      this.failure('user name is exists');
    }

    data.salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, data.salt);

    // save to db
    const info = await this.create(data);
    this.signUpSendEmail(email);

    delete info.salt;
    delete info.password;
    return this.success(info);
  }

  /**
   * get user list
   *
   * @param {*} { page, size }
   * @returns
   * @memberof UserService
   */
  async list({ page, size }) {
    const list = await this.find({}, {}, { limit: size, skip: (page - 1) * size });
    const total = await this.count();
    const totalPage = Math.ceil(total / size);
    return this.success({ page, size, list, total, totalPage });
  }

  /**
   * update user profile information
   *
   * @param {*} { userInfo, body, videos, images }
   * @returns
   * @memberof UserService
   */
  async updateProfile({ userInfo, body, files }) {
    const { id: user_id, avatar } = userInfo;
    await this.findByIdAndUpdate(user_id, body);
    const sourceDocs = files.map((file) => ({ user_id, type: file.fieldname === 'image' ? 'album' : 'video', url: `public/uploads/${file.filename}` }));
    await SourceService.create(sourceDocs);
    return this.success('update success');
  }
}

export default new UserService();
