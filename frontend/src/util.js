import _ from 'lodash';

import { Subject } from 'rxjs';

export function excerpt(string) {
  const truncate = _.truncate;
  return truncate(string, {
    length: 200, // maximum 200 characters
    separator: /,?\.* +/, // separate by spaces, including preceding commas and periods
  });
}

export default class Util {
  static parseQuery(str) {
    const _str = str || window.location.href;
    const val = _str.split('?')[1]; //.substring(1);
    if (!val) {
      return {};
    }
    const result = {};
    val.split('&').forEach((kv) => {
      const [key, value] = kv.split('=');
      result[key] = value;
    });
    return result;
  }

  static userNofity = new Subject();

  static format(date, fmt) {
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
}
