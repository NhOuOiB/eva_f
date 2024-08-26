import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../../utils/config';
import Nav from '../../component/Nav';
import { MdSimCardDownload } from 'react-icons/md';
import { IconContext } from 'react-icons';
import * as XLSX from 'xlsx-js-style';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const ExcelExport = () => {
  const [data, setData] = useState([]);
  const [searchCondition, setSearchCondition] = useState({
    type: 'month',
    date: dayjs().format('YYYY-MM'),
  });

  const handleExport = async () => {
    const res = await axios.get(`${API_URL}/excelExport/getExcelData`, {
      params: searchCondition,
    });
    if (searchCondition.type === 'day') {
      console.log(res.data);

      // 撈出開頭小寫d的key
      const dkeys = Object.keys(res.data[0]).filter((key) => key[0] === 'd');
      const rkeys = Object.keys(res.data[0]).filter((key) => key[0] === 'r');

      // 把dkeys前面的d去掉
      const processedHeaders = dkeys.map((key) => key.slice(1));

      const header = ['ID', 'DeviceName', 'EnoughQty', ...dkeys, ...rkeys];

      const ws = XLSX.utils.json_to_sheet(res.data, { header: header });

      XLSX.utils.sheet_add_aoa(ws, [['項次', '項目', '缺少數量', ...processedHeaders, ...processedHeaders]], {
        origin: 'A1',
      });

      // 設定欄位寬度
      const columnWidths = [
        { wpx: 30 }, // ID 欄
        { wpx: 160 }, // Name 欄
        { wpx: 50 }, // EnoughQty 欄
      ];
      ws['!cols'] = columnWidths;

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!ws[cell_ref]) continue;
          ws[cell_ref].s = {
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          };

          if (R === range.s.r && header[C].startsWith('d')) {
            ws[cell_ref].s.fill = {
              fgColor: { rgb: '059669' },
            };
          } else if (R === range.s.r && header[C].startsWith('r')) {
            ws[cell_ref].s.fill = {
              fgColor: { rgb: 'f87171' },
            };
          }
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, dayjs(searchCondition.date).format('YYYY-MM-DD'));
      XLSX.writeFile(wb, `報表${searchCondition.date}.xlsx`);
    } else if (searchCondition.type === 'month') {
      const days = dayjs(searchCondition.date).daysInMonth();
      const header = ['ID', 'Name', 'MonthlyTotalQty'];
      const nameIndex = header.indexOf('Name');
      const dateHeaders = Array.from({ length: days }, (_, i) => `${i + 1}`);
      header.splice(nameIndex + 1, 0, ...dateHeaders);
      const ws = XLSX.utils.json_to_sheet(res.data, {
        header: header,
      });

      XLSX.utils.sheet_add_aoa(ws, [['項次', '項目', ...dateHeaders, '總計']], { origin: 'A1' });

      // 設定欄位寬度
      const columnWidths = [
        { wpx: 30 }, // ID 欄
        { wpx: 160 }, // Name 欄
        ...dateHeaders.map(() => ({ wpx: 20 })), // 每天的欄位
        { wpx: 50 }, // MonthlyTotalQty 欄
      ];
      ws['!cols'] = columnWidths;

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!ws[cell_ref]) continue;
          ws[cell_ref].s = {
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          };
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, dayjs(searchCondition.date).format('YYYY-MM'));
      XLSX.writeFile(wb, `報表${searchCondition.date}.xlsx`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/excelExport/getOrder`, {
          params: searchCondition,
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [searchCondition.date]);

  useEffect(() => {
    setSearchCondition((prev) => ({
      ...prev,
      date: `${searchCondition.type === 'month' ? `${dayjs().format('YYYY-MM')}` : `${dayjs().format('YYYY-MM-DD')}`}`,
    }));
  }, [searchCondition.type]);

  return (
    <div className="bg w-full h-full flex justify-center items-center gap-4">
      <Nav />
      <div className="content bg-white w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-5/6 2xl:w-3/4 h-5/6 min-h-60 rounded-xl flex justify-center items-center gap-6 lg:gap-10 xl:gap-16 2xl:gap-24 py-12 overflow-hidden">
        {/* 分頁 */}
        <div className="rounded-t-none rounded-xl w-1/2 md:w-1/4 xl:w-1/5 h-full bg-white flex flex-col items-center gap-4">
          <div className="w-full h-fit flex justify-end">
            <div
              className="w-fit border py-2 px-4 rounded shadow hover:shadow-md hover:scale-110 cursor-pointer transition duration-500"
              onClick={handleExport}
            >
              <IconContext.Provider value={{ className: '', size: 28 }}>
                <MdSimCardDownload />
              </IconContext.Provider>
            </div>
          </div>
          <div className="w-5/6 h-full flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label htmlFor="" className="text-start w-fit border-b px-2 rounded-md">
                報表類型
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`px-5 py-2 border rounded-md shadow cursor-pointer ${searchCondition.type === 'month' && 'bg-emerald-600 text-white'}`}
                  onClick={() => setSearchCondition((prev) => ({ ...prev, type: 'month' }))}
                >
                  月
                </div>
                <div
                  className={`px-5 py-2 border rounded-md shadow cursor-pointer ${searchCondition.type === 'day' && 'bg-emerald-600 text-white'}`}
                  onClick={() => setSearchCondition((prev) => ({ ...prev, type: 'day' }))}
                >
                  日
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="" className="text-start w-fit border-b px-2 rounded-md">
                時間
              </label>
              {searchCondition.type === 'month' ? (
                <DatePicker
                  className="w-full h-10 shadow"
                  picker="month"
                  placeholder="時間"
                  value={searchCondition.date && dayjs(searchCondition.date)}
                  onChange={(date, dateString) => {
                    setSearchCondition((prev) => ({ ...prev, date: dateString }));
                  }}
                />
              ) : (
                <DatePicker
                  className="w-full h-10 shadow"
                  placeholder="時間"
                  value={searchCondition.date && dayjs(searchCondition.date)}
                  onChange={(date, dateString) => {
                    setSearchCondition((prev) => ({ ...prev, date: dateString }));
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {/* 中間格線 */}
        <div className="w-0.5 h-full flex items-center">
          <div className="w-0.5 h-full bg-slate-300 "></div>
        </div>
        {/* 內容 */}
        <div className="w-1/2 h-full flex justify-center">
          <div className="bg-white w-full md:w-fit h-full overflow-auto shadow-md">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">順序</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">機號</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">裝置名稱</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">需要數量</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">已給數量</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">欠缺數量</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">請求</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">申請時間</th>
                  <th className="border border-separate border-slate-500 px-4 text-nowrap">資料紀錄時間</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 &&
                  data?.map((item, i) => (
                    <tr key={i}>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">{i + 1}</td>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">
                        {item.AircraftNumberName}
                      </td>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">{item.DeviceName}</td>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">{item.NeedQty}</td>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">{item.Qty}</td>
                      <td
                        className={`border border-separate border-slate-500 px-4 text-nowrap ${item.Qty - item.NeedQty > 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {item.Qty - item.NeedQty}
                      </td>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">{item.Action}</td>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">
                        {item.OrderDate && dayjs(item.OrderDate).format('YYYY-MM-DD HH:mm:ss')}
                      </td>
                      <td className="border border-separate border-slate-500 px-4 text-nowrap">
                        {item.DateStamp && dayjs(item.DateStamp).format('YYYY-MM-DD HH:mm:ss')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {data?.length === 0 && (
              <div className="w-full h-[39rem] flex justify-center items-center font-extrabold text-3xl">
                <div>查無資料</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelExport;
