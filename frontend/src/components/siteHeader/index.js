import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../globals/fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './siteHeader.css';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useUser } from 'reactfire';
import 'firebase/auth';

import { UserContext } from '../../contexts/userContext';

const SiteHeader = (props) => {
  const context = useContext(UserContext);

  const user = useUser().data;

  // Log out function
  const handleClick = () => {
    // const p = props;
    context.logout();

    alert('Logout！');
  };

  useEffect(() => {
    console.log('删除了');
  }, []);

  const menu = (
    <Menu>
      <Menu.Item>
        <Link className="nav-link" to="/login">
          Log In
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <nav className="navbar  navbar-light fixed-top  bg-dark ">
      <Dropdown overlay={menu} trigger={['click']}>
        <span className="ant-dropdown-link text-primary" onClick={(e) => e.preventDefault()}>
          User
          <DownOutlined />
        </span>
      </Dropdown>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link text-white" to="/signup">
            Sign Up
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav">
        <li className="nav-item">
          <button type="button" onClick={handleClick}>
            Log Out
          </button>
        </li>
      </ul>
      <nav className="navbar-brand text-white">
        <Link className=" text-white" to="/">
          <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="logo" width="200" height="50" />
        </Link>
      </nav>
      <FontAwesomeIcon className="navbar-text text-light" icon={['fas', 'video']} size="3x" />
      <span className="navbar-text text-light">For the movie enthusiast !!</span>
      <FontAwesomeIcon className="navbar-text text-light" icon={['fas', 'film']} size="3x" />
      <nav className="navbar navbar-expand ">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/movies/Upcoming">
              Upcoming
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to={user ? '/movies/favorites' : '/login'}>
              Favorites
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/movies/toprated">
              Top Rated
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={user ? '/movies/watchList' : '/login'}>
              Watch List
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/movies/nowplaying">
              Now Playing
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/actors">
              Popular Actors
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={user ? '/actors/favorites' : '/login'}>
              Favorite Actors
            </Link>
          </li>
        </ul>
      </nav>
    </nav>
  );
};

export default SiteHeader;
