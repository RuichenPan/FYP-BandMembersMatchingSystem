import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import Card from '../components/card/card';
import { Spin } from 'antd';

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
  const [, setTimes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCondition, setSearchCondition] = useState({ i_am_a: '', music_style: '' });
  const context = useContext(UserContext);

  useEffect(() => {
    const apiCall = async () => {
      await handleSearch();
      await context.getConfigInfo();
      setTimes(Date.now());
    };
    apiCall();
  }, [context]);

  const handleChange = (opt) => {
    searchCondition[opt.field] = opt.value;
    console.log(JSON.stringify(searchCondition));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    await context.onHomeData(searchCondition);
    setIsLoading(false);
  };

  const { musicStyles = [], IAmA = [], home } = context.state || {};
  const { list = [] } = home || {};
  return (
    <div className="homePageCss">
      <div className="row" style={{ marginBottom: '5px' }}>
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
          <button className="btn btn-sm btn-light" onClick={handleSearch}>
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
            return <Card key={index} info={row} hideChat onUpdate={() => setTimes(Date.now())} />;
          })}
      </div>

      {list && list.length === 0 && !isLoading && (
        <div className="not-found text-center margin-top-40">
          <div className="font-size-20 margin-top-40">Not found result</div>
        </div>
      )}
    </div>
  );
};

export default MovieListPage;
