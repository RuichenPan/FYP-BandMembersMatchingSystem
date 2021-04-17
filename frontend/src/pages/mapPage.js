import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import Util from '../util';
import 'ol/ol.css';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import { Map, View } from 'ol';
import { toLonLat, fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point.js';
import Overlay from 'ol/Overlay.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import './mapPage.css';

const MapPage = (props) => {
  const [q, setKeyword] = useState('');
  // const [setAddressList] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({});
  const [resversGps] = useState(new Subject());
  const [isEdit, setIsEdit] = useState(false);
  const [olview] = useState(new View({ center: [0, 0], zoom: 13, minZoom: 2, maxZoom: 18 }));
  const [baseLayer] = useState(new Tile({ source: new OSM() }));
  const [, setMap] = useState({});
  const [vectorSource, setVectorSource] = useState({});
  const [latLon, setLatLon] = useState({ lat: 53.27503, lon: -7.49372 });

  const context = useContext(UserContext);

  const initData = async () => {
    const item = Util.parseQuery(props.history.location.search);
    // console.log(item);
    if (item.isEdit === '1') {
      setIsEdit(true);
    }
  };

  const initMap = () => {
    const london = new Feature({ geometry: new Point(fromLonLat([0, 0])) });
    london.setStyle(new Style({ image: new Icon({ color: '#4271AE', crossOrigin: '', src: 'https://download.xiaotuni.cn/marker-icon.png' }) }));
    const vectorSource = new VectorSource({ features: [london] });
    const vectorLayer = new VectorLayer({ source: vectorSource });
    const map = new Map({ target: document.querySelector('#map'), view: olview, layers: [baseLayer, vectorLayer] });
    setMap(map);
    setVectorSource(vectorSource);
    const element = document.getElementById('popup');
    const popup = new Overlay({ element: element, positioning: 'bottom-center', stopEvent: false, offset: [0, -50] });

    // display popup on click
    map.on('click', function (evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
      } else {
      }
    });

    let i = 0;
    const item = Util.parseQuery(props.history.location.search);

    map.on('moveend', (e) => {
      // console.log('-----------');
      const connr = e.map.getView().getCenter();
      const ll = toLonLat(connr).map(function (val) {
        return val.toFixed(6);
      });
      const [lon, lat] = ll;
      if (item.isEdit === '1' || !i) {
        updateMarkerPosition({ lat, lon }, vectorSource);
        i++;
      }
    });

    const urlParams1 = Util.parseQuery(props.history.location.search);
    // console.log(latLon, Object.assign({}, latLon, urlParams1));
    const llData = {
      lat: urlParams1.lat || latLon.lat,
      lon: urlParams1.lon || latLon.lon,
    };

    handleSelect(llData, vectorSource);
  };

  useEffect(() => {
    initData();
    initMap();

    resversGps.pipe(debounceTime(2000)).subscribe((data) => {
      // console.log(new Date().toLocaleString(), data);
      reverseGPS(data);
    });

    return () => {
      resversGps.unsubscribe();
    };
    // eslint-disable-next-line
  }, [context]);

  // const handleSearch = async () => {
  //   await context.onMapSearch(q);
  //   setAddressList(context.state.mapAddress);
  // };

  const reverseGPS = async ({ lat, lon }) => {
    await context.onMapReverse({ lat, lon });
    setCurrentAddress(context.state.reverseGpsAddress);
    const { display_name } = context.state.reverseGpsAddress;
    setKeyword(display_name);
    // console.log(context.state.reverseGpsAddress);
  };

  const updateMarkerPosition = (item, source) => {
    const vs = source || vectorSource;
    if (!vs || !vs.clear) {
      return;
    }
    const { lat, lon } = item;

    setLatLon({ lat, lon });
    const london = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
    london.setStyle(new Style({ image: new Icon({ color: '#4271AE', crossOrigin: '', src: 'https://download.xiaotuni.cn/marker-icon.png' }) }));
    vs.clear();
    vs.addFeature(london);

    resversGps.next({ lat, lon });
  };

  const handleSelect = (item) => {
    const { lat, lon } = item;
    updateMarkerPosition(item);
    setCurrentAddress(item);
    olview.animate({ center: fromLonLat([lon, lat]), duration: 1000 });
  };

  const handleSaveAddress = async () => {
    const { lat, lon } = latLon;
    const { display_name = '' } = currentAddress || {};
    const data = { lat, lon, address: q || display_name || '' };
    await context.onUpdateProfile(data);
    context.alertMsg('update success');
  };

  return (
    <div className="map-body">
      <div className="row">
        <div className="col1"></div>
        <div className="col0 handle" onClick={context.goBack}>
          <div className="btn btn-dark">Back</div>
        </div>
      </div>

      {isEdit && (
        <div className="row align-center">
          <div className="col3 row">
            <input
              type="text"
              disabled
              className="margin-right-10"
              value={q || ''}
              placeholder="Please enter address"
              onChange={(e) => {
                console.log(e.target.value);
                setKeyword(e.target.value.trim());
              }}
            />
            {/* <button className="margin-left-10 btn btn-dark" onClick={handleSearch}>
              Search
            </button> */}
          </div>

          <div className="col0 margin-left-10" style={{ width: '130px' }}>
            Lat: {latLon.lat}
          </div>
          <div className="col0" style={{ width: '130px' }}>
            Lon: {latLon.lon}
          </div>
          <div className="col0">
            <button className="btn btn-dark" onClick={handleSaveAddress}>
              Save Address
            </button>
          </div>
          <div className="col1"></div>
        </div>
      )}

      <div className="row margin-top-5">
        {/* {isEdit && (
          <div className="col1">
            {addressList &&
              addressList.map((item, index) => {
                return (
                  <div key={index} className="handle map-sarch-item ">
                    <div onClick={() => handleSelect(item)}>
                      {item.display_name} {item.type}
                    </div>
                  </div>
                );
              })}
          </div>
        )} */}
        <div className="col2">
          <div id="map" tabIndex={0} style={{ height: '600px' }}></div>
          <div id="popup"></div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
