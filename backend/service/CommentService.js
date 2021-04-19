import { ModelComment } from '../model';
import BaseService from './BaseService';
import UserService from './UserService';

class CommentService extends BaseService {
  constructor() {
    super(ModelComment);
  }

  async list({ page, size, user_id } = {}) {
    const list = await this.find({ user_id }, {}, {});
    const total = await this.count({ user_id });
    const data = {
      page,
      size,
      list,
      total,
      totalPage: Math.ceil(total / size),
    };
    return this.success(data);
  }

  async addComment({ user_id, body, userInfo }) {
    const uInfo = await UserService.findById(user_id);
    if (!uInfo) {
      this.failure('user is not exists,can no be comment');
    }
    const { content } = body;
    if (!content) {
      this.failure('comment content can no be empty.');
    }

    const loginUserInfo = await UserService.findById(userInfo.id);

    const doc = {
      user_id,
      comment_user_id: userInfo.id,
      comment_username: userInfo.username,
      comment_content: content,
      comment_avatar: loginUserInfo.avatar,
      reply_content: '',
      reply_create_time: 0,
    };
    await this.create(doc);
    return this.success('add comment success');
  }

  async replyComment({ comment_id, body, userInfo }) {
    const row = await this.findById(comment_id);
    if (!row) {
      this.failure('comment is not exits');
    }
    const { id: user_id } = userInfo;
    if (user_id !== row.user_id) {
      this.failure(`The comment is not your own. You can't reply`);
    }
    const { content } = body;
    if (!content) {
      this.failure('reply content can no be empty.');
    }
    // get current user images;
    const loginUserInfo = await UserService.findById(userInfo.id);

    const info = await this.findByIdAndUpdate(comment_id, { reply_avatar: loginUserInfo.avatar, reply_content: content, reply_create_time: Date.now() });
    return this.success(info);
  }
}

export default new CommentService();
