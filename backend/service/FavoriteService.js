import { ModelFavorite } from '../model';
import BaseService from './BaseService';
import UserService from './UserService';

class FavoriteService extends BaseService {
  constructor() {
    super(ModelFavorite);
  }

  /**
   * get
   *
   * @param {*} [{ page = 1, size = 10, user_id }={}]
   * @returns
   * @memberof FavoriteService
   */
  async list({ page = 1, size = 10, user_id } = {}) {
    const list = await this.find({ user_id }, {}, { skip: (page - 1) * size, limit: size });
    const total = await this.find({ user_id });

    const data = { page, size, total, list, totalPage: Math.ceil(total / size) };
    return this.success(data);
  }

  async add({ user_id, userInfo }) {
    const uInfo = await UserService.findById(user_id);
    if (!uInfo) {
      this.failure('user information can be not found');
    }
    const doc = {
      user_id: userInfo.id,
      username: userInfo.username,
      favorite_user_id: user_id,
      favorite_username: uInfo.username,
      favorite_avatar: uInfo.image,
    };
    const info = await this.save(doc);
    return this.success(info);
  }
}
export default new FavoriteService();
