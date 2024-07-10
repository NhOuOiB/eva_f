import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../../utils/config';
import Nav from '../../component/Nav';

const ExcelExport = () => {
  return (
    <div className="bg w-full h-full flex justify-center items-center gap-4">
      <Nav />
      <div className="content bg-white w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-5/6 2xl:w-3/4 h-5/6 min-h-60 rounded-xl flex justify-center items-center gap-6 lg:gap-10 xl:gap-16 2xl:gap-24 py-12 overflow-hidden">
        {/* 分頁 */}
        <div className=" rounded-t-none rounded-xl w-1/2 md:w-1/4 xl:w-1/5 h-16 bg-white flex flex-col items-center gap-4"></div>
        {/* 中間格線 */}
        <div className="w-0.5 h-full flex items-center">
          <div className="w-0.5 h-full bg-slate-300 "></div>
        </div>
        {/* 內容 */}
        <div className="w-1/2 h-full flex justify-center">
          <div className="bg-white w-full md:w-fit h-full overflow-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ExcelExport;
