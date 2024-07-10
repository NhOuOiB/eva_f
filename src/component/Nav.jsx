import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { PiUserBold } from 'react-icons/pi';
import { SiMicrosoftexcel } from 'react-icons/si';
import { TiDocument } from 'react-icons/ti';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const Nav = () => {
  const navigate = useNavigate();
  function handleNavigate(route) {
    navigate(`/${route}`);
  }
  return (
    <div className="content w-14 h-5/6 min-h-60 rounded-xl bg-white py-4 flex flex-col justify-between">
      <IconContext.Provider value={{ className: 'cursor-pointer hover:text-emerald-700', size: '1.6rem' }}>
        <div className="flex flex-col items-center gap-5">
          <div onClick={() => handleNavigate('BasicInfo')}>
            <TiDocument />
          </div>
          <div onClick={() => handleNavigate('QuickSearch')}>
            <FiSearch />
          </div>
          <div onClick={() => handleNavigate('excelExport')}>
            <SiMicrosoftexcel />
          </div>
          <div onClick={() => handleNavigate('Permission')}>
            <PiUserBold />
          </div>
        </div>
      </IconContext.Provider>
      <IconContext.Provider value={{ className: 'cursor-pointer hover:text-red-500', size: '1.6rem' }}>
        <div className="flex justify-center">
          <div
            onClick={() => {
              localStorage.removeItem('userId');
              localStorage.removeItem('account');
              localStorage.removeItem('permission');
              handleNavigate('login');
            }}
          >
            <RiLogoutCircleRLine />
          </div>
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default Nav;
