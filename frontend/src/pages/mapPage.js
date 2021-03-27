import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import Util from '../util';
import 'ol/ol.css';
import { Tile } from 'ol/layer';

import { OSM } from 'ol/source';
import { Map, View } from 'ol';

import { toLonLat, fromLonLat } from 'ol/proj';

import { Fill, Icon, Stroke, Style } from 'ol/style.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point.js';
import Overlay from 'ol/Overlay.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

const MapPage = (props) => {
  const [, setTime] = useState(0);
  const [q, setKeyword] = useState('xinyu');
  const [address, setAddress] = useState([]);

  const [olview, setOlView] = useState(new View({ center: [0, 0], zoom: 10, minZoom: 2, maxZoom: 20 }));
  const [baseLayer, setBaseLayer] = useState(new Tile({ source: new OSM() }));
  const [map, setMap] = useState({});
  const [vectorSource, setVectorSource] = useState({});

  const context = useContext(UserContext);

  const initData = async () => {
    const item = Util.parseQuery(props.history.location.search);
    console.log(item);
  };

  const initPopup = (map) => {
    var element = document.getElementById('popup');

    var popup = new Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -50],
    });
    map.addOverlay(popup);
  };

  const initMap = () => {
    const london = new Feature({ geometry: new Point(fromLonLat([0, 0])) });
    london.setStyle(new Style({ image: new Icon({ color: '#4271AE', crossOrigin: '', src: 'https://download.xiaotuni.cn/marker-icon.png' }) }));
    const vectorSource = new VectorSource({ features: [london] });
    const vectorLayer = new VectorLayer({ source: vectorSource });
    const map = new Map({ target: document.querySelector('#map'), view: olview, layers: [baseLayer, vectorLayer] });
    setMap(map);
    setVectorSource(vectorSource);
    var element = document.getElementById('popup');

    var popup = new Overlay({ element: element, positioning: 'bottom-center', stopEvent: false, offset: [0, -50] });

    // initPopup(map);

    // display popup on click
    map.on('click', function (evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        // $(element).popover({ placement: 'top', html: true, content: feature.get('name') });
        // $(element).popover('show');
      } else {
        // $(element).popover('destroy');
      }
    });

    // change mouse cursor when over marker
    map.on('pointermove', function (e) {
      if (e.dragging) {
        // $(element).popover('destroy');

        return;
      }
      // console.log(e);
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    map.on('moveend', (e) => {
      const connr = e.map.getView().getCenter();
      const ll = toLonLat(connr).map(function (val) {
        return val.toFixed(6);
      });
      const [lon, lat] = ll;
    
      const london = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
      london.setStyle(new Style({ image: new Icon({ color: '#4271AE', crossOrigin: '', src: 'https://download.xiaotuni.cn/marker-icon.png' }) }));
      vectorSource.clear();
      vectorSource.addFeature(london);
    });
  };

  useEffect(() => {
    initData();
    handleSearch();

    setTimeout(() => {
      initMap();
    }, 1000);
    // setTime(new Date().getTime());
  }, [context]);

  const handleSearch = async () => {
    await context.onMapSearch(q);
    setAddress(context.state.mapAddress);
  };

  const aaa = (item) => {
    if (!vectorSource || !vectorSource.clear) {
      return;
    }
    const { lat, lon } = item;
    const london = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
    london.setStyle(new Style({ image: new Icon({ color: '#4271AE', crossOrigin: '', src: 'https://download.xiaotuni.cn/marker-icon.png' }) }));
    vectorSource.clear();
    vectorSource.addFeature(london);
  };

  const handleSelect = (item) => {
    console.log(item);
    const { lat, lon } = item;
    aaa(item);

    olview.animate({
      center: fromLonLat([lon, lat]),
      duration: 1000,
    });
  };

  return (
    <div className="map-body">
      <div className="row">
        <div className="col1"></div>
        <div className="col0 handle" onClick={context.goBack}>
          Back
        </div>
      </div>

      <div className="row ">
        <div className="col1 row">
          <input type="text" className="margin-right-10" value={q || ''} placeholder="Please enter address" onChange={(e) => setKeyword(e.target.value.trim())} />
          <button className="margin-left-10 btn btn-light" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="col1"></div>
      </div>

      <div className="row margin-top-5">
        <div className="col1">
          {address &&
            address.map((item, index) => {
              return (
                <div key={index} className="handle map-sarch-item ">
                  <div onClick={() => handleSelect(item)}>
                    {item.display_name} {item.type}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="col2">
          <div id="map" tabIndex={0} style={{ height: '500px' }}></div>
          <div id="popup"></div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
