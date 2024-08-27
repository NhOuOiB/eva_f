import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../../utils/config';
import Nav from '../../component/Nav';
import { Link } from 'react-router-dom';

const QuickSearch = () => {
  const [searchCondition, setSearchCondition] = useState({
    area: '',
    location: '',
    aircraftNumber: '',
    direction: '',
    name: '',
  });
  const [searchConditionData, setSearchConditionData] = useState({});
  const [ladder, setLadder] = useState([]);

  useEffect(() => {
    (async () => {
      let res = await axios.get(`${API_URL}/quickSearch/getSearchCondition`);
      setSearchConditionData(res.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log(searchCondition);
      let res = await axios.get(`${API_URL}/quickSearch/getDeviceDetail`, { params: searchCondition });
      setLadder(res.data);
    })();
  }, [searchCondition]);

  return (
    <div className="bg w-full h-full flex justify-center items-center gap-4">
      <Nav />
      <div className="content bg-white w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-5/6 2xl:w-3/4 h-5/6 min-h-60 rounded-xl flex justify-center gap-6 lg:gap-10 xl:gap-16 2xl:gap-24 py-12 overflow-hidden">
        {/* 搜尋條件 */}
        <div className=" rounded-t-none rounded-xl w-1/2 md:w-1/4 xl:w-1/5 h-16 bg-white flex flex-col items-center gap-4">
          {Object.keys(searchConditionData).map((fieldName, i) => {
            return (
              <div className="flex flex-col justify-center items-start gap-2" key={i}>
                <label htmlFor="">
                  {fieldName === 'area'
                    ? '位置'
                    : fieldName === 'aircraftNumber'
                      ? '機號'
                      : fieldName === 'location'
                        ? '機體部位'
                        : fieldName === 'direction'
                          ? '方向'
                          : fieldName}
                </label>
                <select
                  name=""
                  id=""
                  defaultValue={searchCondition[fieldName]}
                  className="w-48 min-h-9 border px-2 rounded-md"
                  onChange={(e) => {
                    setSearchCondition((prev) => ({
                      ...prev,
                      [fieldName]: e.target.value,
                    }));
                  }}
                >
                  <option value="">選項</option>
                  {searchConditionData[fieldName].map((value, index) => {
                    return (
                      <option
                        value={
                          fieldName === 'area'
                            ? value.ID
                            : fieldName === 'aircraftNumber'
                              ? value.Model
                              : fieldName === 'location'
                                ? value.Location
                                : fieldName === 'direction'
                                  ? value.Direction
                                  : value
                        }
                        key={index}
                      >
                        {fieldName === 'area'
                          ? value.AreaName
                          : fieldName === 'aircraftNumber'
                            ? value.Model
                            : fieldName === 'location'
                              ? value.Location
                              : fieldName === 'direction'
                                ? value.Direction
                                : value}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })}
          <div className="flex flex-col justify-center items-start gap-2">
            <label htmlFor="">名稱</label>
            <input
              type="text"
              onChange={(e) => {
                setSearchCondition((prev) => ({ ...prev, ['name']: e.target.value }));
              }}
              value={searchCondition.name}
            />
          </div>
        </div>
        {/* 中間格線 */}
        <div className="w-0.5 h-full flex items-center">
          <div className="w-0.5 h-full bg-slate-300 "></div>
        </div>
        {/* 內容 */}
        <div className="w-1/2 h-full flex justify-center shadow-md border">
          <div className="bg-white w-full md:w-fit h-full overflow-auto">
            {ladder.length > 0 ? (
              <table className="table-fixed">
                <thead>
                  <tr>
                    <th className="border border-separate border-slate-500 px-4 text-nowrap">項次</th>
                    <th className="border border-separate border-slate-500 px-4 text-nowrap">位置</th>
                    <th className="border border-separate border-slate-500 px-4 text-nowrap">機號</th>
                    <th className="border border-separate border-slate-500 px-4 text-nowrap">機體部位</th>
                    <th className="border border-separate border-slate-500 px-4 text-nowrap">方向</th>
                    <th className="border border-separate border-slate-500 px-4 text-nowrap">名稱</th>
                    <th className="border border-separate border-slate-500 px-4 text-nowrap">經緯度</th>
                  </tr>
                </thead>
                <tbody>
                  {ladder.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="border border-separate border-slate-300 p-2 px-4 text-nowrap">{i + 1}</td>
                        <td className="border border-separate border-slate-300 p-2 px-4 text-nowrap">{v.AreaName}</td>
                        <td className="border border-separate border-slate-300 px-4 text-nowrap">{v.Model}</td>
                        <td className="border border-separate border-slate-300 px-4 text-nowrap">{v.Location}</td>
                        <td className="border border-separate border-slate-300 px-4 text-nowrap">{v.Direction}</td>
                        <td className="border border-separate border-slate-300 px-4 text-nowrap">
                          <p className="truncate">{v.Name}</p>
                        </td>
                        <td className="border border-separate border-slate-300 px-4 text-nowrap">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${v.Latitude + ',' + v.Longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {v.Latitude + ',' + v.Longitude}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <div className=" text-3xl font-extrabold">查無資料</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
