import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ModelUser from '../model/model.user';
import BaseService from './BaseService';
import cfg from '../cfg';

class UserService extends BaseService {
  constructor() {
    super(ModelUser);
    this.TableName = ModelUser.modelName;
  }

  /**
   * user login
   *
   * @param {*} data
   * @returns
   * @memberof UserService
   */
  async SignIn(data) {
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
  async SignUp(data) {
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
}

export default new UserService();
