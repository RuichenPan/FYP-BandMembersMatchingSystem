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
    const val = str.substring(1);
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

}
