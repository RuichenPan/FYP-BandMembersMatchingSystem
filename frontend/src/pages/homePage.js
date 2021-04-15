import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import Card from '../components/card/card';
import { Spin, Pagination, Carousel } from 'antd';
import MyImage from '../components/MyImage/MyImage';
import './homePage.css';

const SelectItem = ({ label, list, field, onChange }) => {
  return (
    <div>
      <span style={{ paddingRight: '10px' }}>{label}</span>
      <select style={{ minWidth: '120px' }} onChange={(e) => onChange && onChange({ field, value: e.target.value })}>
        <option value="">Please select {label} </option>
        {list &&
          list.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            );
          })}
      </select>
    </div>
  );
};

const MovieListPage = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(12);
  const [, setTimes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCondition] = useState({ i_am_a: '', music_style: '' });
  const context = useContext(UserContext);

  useEffect(() => {
    const apiCall = async () => {
      await context.onCarousel();
      await handleSearch();
      await context.getConfigInfo();
      setTimes(Date.now());
    };
    apiCall();
    // eslint-disable-next-line
  }, [context]);

  const handleChange = (opt) => {
    searchCondition[opt.field] = opt.value;
    console.log(JSON.stringify(searchCondition));
  };

  const handleSearch = async ({ page } = {}) => {
    setPage(page);
    setIsLoading(true);
    await context.onHomeData({ ...searchCondition, page, size });
    setIsLoading(false);
  };

  const { musicStyles = [], IAmA = [], home, carousel = [] } = context.state || {};
  const { list = [], total = 1 } = home || {};
  console.log(size, 'total:', total);

  const contentStyle = { height: '260px' };
  return (
    <div className="homePageCss">
      {/* <Carousel autoplay>
        {carousel.map((row, index) => {
          return (
            <div className="row" key={index}>
              <div className="col-12" style={contentStyle}>
                <MyImage avatar={row.avatar} />
              </div>
            </div>
          );
        })}
      </Carousel> */}

      <div className="home-bg g-center">
        <div className="home-bg-content">Once I heard rocks, all of a sudden I understood what life was about</div>
        <div className="home-bg-gradient"></div>
      </div>
      <div className="split-line"></div>

      <div className="home-body-content">
        <div className="row home-body-condition">
          <div className="col0">
            <SelectItem label="Type" list={IAmA} field="i_am_a" onChange={handleChange} />
          </div>
          <div className="col0" style={{ marginLeft: '10px' }}>
            <SelectItem label="Music Style" list={musicStyles} field="music_style" onChange={handleChange} />
          </div>
          <div className="col0" style={{ marginLeft: '10px' }}>
            <input type="text" placeholder="Please enter username" onChange={(e) => handleChange({ field: 'keyword', value: e.target.value })} />
          </div>
          <div className="col0" style={{ marginLeft: '10px' }}>
            <button className="btn btn-dark" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="row">
            <div className="col1 text-center">
              <Spin />
            </div>
          </div>
        )}

        <div className="home-body">
          {list &&
            list.map((row, index) => {
              return <Card style={{ width: '16.6%' }} key={index} info={row} hideChat onUpdate={() => setTimes(Date.now())} />;
            })}
        </div>
        <Pagination size="small" pageSize={size} defaultCurrent={page} total={total} onChange={(page) => handleSearch({ page, size })} />

        {list && list.length === 0 && !isLoading && (
          <div className="not-found text-center margin-top-40">
            <div className="font-size-20 margin-top-40">Not found result</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListPage;
