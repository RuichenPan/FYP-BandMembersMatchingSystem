import BaseService from './BaseService';
import querystring from 'querystring';
import requestApi from 'request';

class MapService extends BaseService {
  async ApiRequest(params) {
    const opt = Object.assign({}, { ...params }, { polygon_geojson: 1, dedupe: 1, namedetails: 0, extratags: 1, addressdetails: 1, format: 'json' });
    const queryStr = Object.keys(opt)
      .map((key) => `${key}=${opt[key]}`)
      .join('&');

    const headers = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'content-type': 'application/json; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      'X-Requested-With': 'XMLHttpRequest',
      origin: 'https://rawgit.com',
      referer: 'https://rawgit.com/',
      // 'cache-control': 'no-cache',
    };

    const options = {
      method: 'get',
      url: `https://nominatim.openstreetmap.org/search?${querystring.stringify(opt)}`,
      headers,
    };

    console.log('url:', options.url);
    return new Promise((resolve, reject) => {
      requestApi(options, (error, res, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  }

  async addressDetail(query) {
    //
    // return this.ApiRequest({ ...query });

    return [
      {
        place_id: 258716777,
        licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'relation',
        osm_id: 3182912,
        boundingbox: ['27.5339613', '28.1116879', '114.4772667', '115.4022145'],
        lat: '27.8214162',
        lon: '114.9124505',
        display_name: '新余市, 江西省, 338000, 中国',
        class: 'boundary',
        type: 'administrative',
        importance: 0.35778439681543517,
        icon: 'https://nominatim.openstreetmap.org/ui/mapicons//poi_boundary_administrative.p.20.png',
        address: { city: '新余市', state: '江西省', postcode: '338000', country: '中国', country_code: 'cn' },
        extratags: { 'gns:DSG': 'ADM2', 'gns:UFI': '-1934151', 'gns:UNI': '6667958', 'gns:ADM1': '03', wikidata: 'Q362959', wikipedia: 'en:Xinyu', population: '1138874', linked_place: 'city' },
      },
      {
        place_id: 47833557,
        licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'node',
        osm_id: 3909615786,
        boundingbox: ['22.3488', '22.3888', '108.923', '108.963'],
        lat: '22.3688',
        lon: '108.943',
        display_name: '新跃, 钦州市, 广西壮族自治区, 中国',
        class: 'place',
        type: 'village',
        importance: 0.275,
        icon: 'https://nominatim.openstreetmap.org/ui/mapicons//poi_place_village.p.20.png',
        address: { village: '新跃', city: '钦州市', state: '广西壮族自治区', country: '中国', country_code: 'cn' },
        extratags: {},
        namedetails: { name: '新跃', 'name:en': 'Xinyue', 'name:zh': '新跃' },
      },
      {
        place_id: 20780518,
        licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'node',
        osm_id: 2185438066,
        boundingbox: ['45.8041731', '45.8841731', '132.8883277', '132.9683277'],
        lat: '45.8441731',
        lon: '132.9283277',
        display_name: '新乐乡, 虎林市, 鸡西市, 黑龙江省, 中国',
        class: 'place',
        type: 'town',
        importance: 0.195871082899258,
        icon: 'https://nominatim.openstreetmap.org/ui/mapicons//poi_place_town.p.20.png',
        address: { town: '新乐乡', county: '虎林市', region: '鸡西市', state: '黑龙江省', country: '中国', country_code: 'cn' },
        extratags: { wikidata: 'Q11081003', wikipedia: 'zh:新乐乡 (虎林市)', china_class: 'xiang' },
        namedetails: { name: '新乐乡', 'name:en': 'Xinyue', 'name:zh': '新乐乡', alt_name: '新乐', official_name: '新乐乡' },
      },
      {
        place_id: 9662102,
        licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'node',
        osm_id: 965990535,
        boundingbox: ['27.8085471', '27.8185471', '114.9292663', '114.9392663'],
        lat: '27.8135471',
        lon: '114.9342663',
        display_name: '新余, 胜利北路, 城南街道, 渝水区 (Yushui), 新余市, 江西省, 338000, 中国',
        class: 'railway',
        type: 'station',
        importance: 0.001,
        icon: 'https://nominatim.openstreetmap.org/ui/mapicons//transport_train_station2.p.20.png',
        address: { railway: '新余', road: '胜利北路', suburb: '城南街道', county: '渝水区 (Yushui)', city: '新余市', state: '江西省', postcode: '338000', country: '中国', country_code: 'cn' },
        extratags: { 'railway:ref': '新余' },
        namedetails: { name: '新余', 'name:en': 'Xinyu', 'name:zh': '新余' },
      },
    ];
  }
}

export default new MapService();
