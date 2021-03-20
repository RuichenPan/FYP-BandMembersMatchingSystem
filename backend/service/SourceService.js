import { ModelSource } from '../model';
import BaseService from './BaseService';

class SourceService extends BaseService {
  constructor() {
    super(ModelSource);
  }

  async list({ page, size, user_id, type }) {
    const list = await this.find({ type, user_id }, {}, { skip: (page - 1) * size, limit: size });
    const total = await this.count({ type, user_id });
    const info = { page, size, total, totalPage: Math.ceil(total / size), list };
    return this.success(info);
  }

  /**
   * delete source record and delete resource file (public/uploads/)
   *
   * @param {*} { user_id, id, userInfo }
   * @returns
   * @memberof SourceService
   */
  async deleteSource({ user_id, id, userInfo }) {
    if (user_id != userInfo.id) {
      this.failure('Permission not allowed');
    }
    // find file path
    const fileInfo = await this.findById(id);
    if (!fileInfo) {
      return this.success('delete success');
    }
    const { url } = fileInfo;
    // const filePath = path.join(__dirname, '../', 'public', 'uploads', url);
    // console.log(filePath);
    // if (fs.existsSync(filePath)) {
    //   // remove file
    //   fs.unlinkSync(filePath);
    // }
    this.unlinkSync(url);
    console.log('delete source id:', id);
    // delete source record
    await this.findByIdAndDelete(id);

    return this.success('delete success');
  }
}

export default new SourceService();
