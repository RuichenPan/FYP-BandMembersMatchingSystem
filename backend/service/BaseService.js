import CryptoJS from 'crypto-js';
import path from 'path';
import fs from 'fs';

/**
 * Operation database base class
 *
 * @class BaseService
 */
export default class BaseService {
  constructor(modal) {
    this.modal = modal;
  }

  md5(val) {
    if (!val) {
      return;
    }
    return CryptoJS.MD5(val).toString();
  }

  /**
   * console output log
   *
   * @memberof MongoDbHelper
   */
  log() {
    try {
      const _curDate = new Date();
      const info = `${_curDate.getFullYear()}-${_curDate.getMonth() + 1}-${_curDate.getDay()} ${_curDate.getHours()}:${_curDate.getMinutes()}:${_curDate.getSeconds()}.${_curDate.getMilliseconds()}`;
      console.log(`${info}-->`, ...arguments);
    } catch (ex) {
      console.log(ex);
      console.log(args);
    }
  }

  format(date, fmt) {
    if (!date) {
      return '';
    }

    let __this = new Date();
    let _fmt = fmt || 'yyyy-MM-dd HH:mm:ss.S';
    if (date !== null) {
      if (Date.parse(date)) {
        __this = new Date(date);
      } else {
        try {
          __this = new Date(date);
        } catch (ex) {
          __this = new Date();
        }
      }
    }
    const oo = {
      'M+': __this.getMonth() + 1, //                      month
      'd+': __this.getDate(), //                           date
      'D+': __this.getDate(), //                           date
      'H+': __this.getHours(), //                          hours
      'h+': __this.getHours(), //                          hours
      'm+': __this.getMinutes(), //                        minutes
      's+': __this.getSeconds(), //                        seconds
      'q+': Math.floor((__this.getMonth() + 3) / 3), //
      S: __this.getMilliseconds(), //                      milliseconds
    };
    if (/((y|Y)+)/.test(_fmt)) {
      const fmt1 = _fmt.replace(RegExp.$1, (__this.getFullYear() + '').substr(4 - RegExp.$1.length));
      _fmt = fmt1;
    }
    for (const kk in oo) {
      if (new RegExp('(' + kk + ')').test(_fmt)) {
        if (kk === 'S') {
          _fmt = _fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? oo[kk] : ('000' + oo[kk]).substr(('' + oo[kk]).length));
        } else {
          _fmt = _fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? oo[kk] : ('00' + oo[kk]).substr(('' + oo[kk]).length));
        }
      }
    }
    return _fmt;
  }

  logJson(data) {
    this.log(JSON.stringify(data));
  }

  async findById(id, options) {
    const info = await this.modal.findById(id, options || {});
    return info ? JSON.parse(JSON.stringify(info)) : null;
  }

  /**
   * return record list
   *
   * @static
   * @param {any} condition  {field1:'conditionValue',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..}, limit:10, skip:0, ...}
   * @returns
   * @memberof BaseService
   */
  async find(condition = {}, fields = {}, options = {}) {
    try {
      const list = await this.modal.find(condition, fields, options);
      return list ? JSON.parse(JSON.stringify(list)) : [];
    } catch (ex) {
      this.log(ex);
      return [];
    }
  }

  /**
   * save document to db
   *
   * @param {any} fields
   * @returns
   * @memberof BaseService
   */
  async save(fields) {
    try {
      const result = await this.modal.create(fields);
      return result && result.toJSON ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `save doucment error:${ex.message}` });
    }
  }

  /**
   * create
   *
   * @param {*} docs
   * @return {*}
   */
  async create(docs) {
    return this.save(docs);
  }

  /**
   *  find first document  by condition
   *
   * @param {any} condition  {field1:'conditionValue',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof BaseService
   */
  async findOne(condition, fields = {}, options = {}) {
    try {
      const result = await this.modal.findOne(condition, fields, options);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return null;
    }
  }

  /**
   * modify document by id
   *
   * @param {any} id      PK
   * @param {any} fields  {field1:'a',field2:'b'...}
   * @returns
   * @memberof BaseService
   */
  async findByIdAndUpdate(id, fields) {
    try {
      const condition = { _id: id };
      await this.modal.updateOne(condition, { $set: fields });
      const result = await this.modal.findById(id);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Updates a Single Document
   *
   * @param {*} condition
   * @param {*} fields
   * @returns
   */
  async updateOne(condition, fields) {
    try {
      await this.modal.updateOne(condition, { $set: fields });
      const result = await this.modal.findOne(condition);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Update Multiple Documents
   *
   * @param {*} condition
   * @param {*} fields
   * @returns
   */
  async updateMany(condition, fields) {
    try {
      await this.modal.updateMany(condition, { $set: fields });
      const result = await this.modal.find(condition);
      return result ? JSON.parse(JSON.stringify(result)) : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Delete a Single Document
   *
   * @param {*} condition
   * @returns
   */
  async deleteOne(condition) {
    try {
      return await this.modal.deleteOne(condition);
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Delete Multiple Documents
   *
   * @param {*} condition
   * @returns
   */
  async deleteMany(condition) {
    try {
      return await this.modal.deleteMany(condition);
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  async findByIdAndDelete(id) {
    return this.modal.findByIdAndDelete(id);
  }

  async count(condition) {
    return this.modal.countDocuments(condition);
  }

  async updateMany(condition, updateField) {
    try {
      await this.modal.updateMany({ ...condition }, { $set: { ...updateField } });
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   *
   *
   * @param {*} aggregations = [ {$group : {} } , {$project:{} }, {$match: {}} ]
   * @example
   * this.aggregate(
   * [
   *   {
   *     $group: {
   *       _id: { user_id: '$user_id' },
   *       totalPrice: { $sum: '$price' }
   *     }
   *   },
   *   {
   *     $project: { user_id: '$_id.user_id', total: '$totalPrice' }
   *   },
   *   {
   *     $match: { user_id: '5f6eb0eb5025214504cd2377' }
   *   }
   * ])
   *
   * @return {*}
   */
  async aggregate(aggregations) {
    try {
      const result = await this.modal.aggregate(aggregations);
      return result && result.length > 0 ? JSON.parse(JSON.stringify(result)) : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * delete resource file
   *
   * @param {*} url
   * @memberof BaseService
   */
  unlinkSync(url) {
    try {
      const filePath = path.join(__dirname, '../', 'public', 'uploads', url);
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        // remove file
        fs.unlinkSync(filePath);
      }
    } catch (ex) {
      this.log(ex);
    }
  }

  failure(msg) {
    throw Error(msg);
  }

  success(msg) {
    return { code: 200, data: msg };
  }
}
