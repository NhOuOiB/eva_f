import axios from 'axios';
import { useState, useEffect, useMemo, useRef } from 'react';
import { API_URL } from '../../../utils/config';
import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Nav from '../../component/Nav';
import { toast } from 'react-toastify';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const maintenance = [
  {
    name: '類別',
    newData: { Name: '' },
    api: 'Device',
    searchCondition: { Name: '' },
    keyToLabel: {
      ID: '編號',
      Name: '裝置名稱',
    },
  },
  {
    name: '細項',
    newData: { Name: '', AreaName: '', Time: '' },
    api: 'DeviceHistory',
    searchCondition: { Name: '', AreaName: '', Model: '', Region: '', Location: '' },
    keyToLabel: {
      ID: '編號',
      EPC: 'EPC',
      AreaName: '區域',
      Name: '名稱',
      Model: '機型',
      RFID: 'RFID',
      Region: 'Region',
      Location: '機體部位',
      No: '代號',
      Longitude: '經度',
      Latitude: '緯度',
      RecordTime: '時間',
    },
  },
  {
    name: '區域',
    newData: { AreaName: '', UserStamp: localStorage.getItem('account') },
    api: 'Area',
    searchCondition: { AreaName: '' },
    keyToLabel: {
      ID: '編號',
      AreaName: '區域名稱',
    },
  },
  {
    name: '機號',
    newData: { Name: '' },
    api: 'AircraftNumber',
    searchCondition: { Name: '' },
    keyToLabel: {
      ID: '編號',
      Name: '機號',
    },
  },
  {
    name: '設備',
    newData: {
      DeviceID: '',
      EPC: '',
      AreaID: '',
      Name: '',
      Model: '',
      RFID: '',
      Region: '',
      Location: '',
      Direction: '',
      No: '',
      Longitude: '',
      Latitude: '',
      RecordTime: '',
    },
    api: 'DeviceDetail',
    searchCondition: { Name: '', AreaID: '', Model: '', Region: '', Location: '' },
    keyToLabel: {
      ID: '編號',
      DeviceID: '類別',
      EPC: 'EPC',
      AreaID: '區域',
      Name: '名稱',
      Model: '機型',
      RFID: 'RFID',
      Region: 'Region',
      Location: '機體部位',
      Direction: '方向',
      No: '代號',
      Longitude: '經度',
      Latitude: '緯度',
      RecordTime: '時間',
    },
  },
];
const BasicInfo = () => {
  const [maintenanceNow, setMaintenanceNow] = useState('類別');
  const [editArr, setEditArr] = useState([]);
  const [data, setData] = useState([]);
  const inputRefs = useRef({});
  const [options, setOptions] = useState([]);

  const MySwal = withReactContent(Swal);

  const currentMaintenance = useMemo(() => {
    return maintenance.find((v) => v.name === maintenanceNow);
  }, [maintenanceNow]);

  const [newData, setNewData] = useState(currentMaintenance.newData);
  const [searchCondition, setSearchCondition] = useState(currentMaintenance.searchCondition);

  async function handleUpdate(id) {
    try {
      if (editArr.includes(id)) {
        const updateData = data.find((v) => v.ID === id);
        const result = await axios.put(`${API_URL}/basicInfo/update${currentMaintenance.api}`, {
          ...updateData,
          UserStamp: localStorage.getItem('account'),
        });
        if (result.data.status) {
          toast.success(result.data.message, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          });
          setEditArr(editArr.filter((eidtId) => eidtId !== id));
        } else {
          toast.error(result.data.message, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          });
        }
        handleGet();
      } else {
        setEditArr([...editArr, id]);
      }
    } catch (error) {
      console.error('Error update data:', error);
    }
  }

  async function handleAdd() {
    try {
      for (let key in newData) {
        if (newData[key] === '' || newData[key] === null || newData[key] === undefined) {
          if (key === 'UserStamp') {
            toast.error('請重新登入', {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: 'light',
            });
          } else {
            toast.error(
              `請輸入 ${maintenanceNow === '類別' && key === 'Name' ? '裝置名稱' : maintenanceNow === '區域' && key === 'AreaName' ? '區域名稱' : maintenanceNow === '機號' && key === 'Name' ? '機號' : key}`,
              {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
              },
            );
          }
          return false;
        }
      }
      let result = await axios.post(`${API_URL}/basicInfo/add${currentMaintenance.api}`, newData);
      if (result.data.status) {
        toast.success(result.data.message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
        setNewData(currentMaintenance.newData);
        handleGet();
      } else {
        toast.error(result.data.message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
    } catch (error) {
      console.error('Error Add data:', error);
    }
  }

  async function handleGet() {
    try {
      // 切換分類重新抓取資料
      let res = await axios.get(`${API_URL}/basicInfo/get${currentMaintenance.api}`, {
        params: searchCondition,
      });
      setData(res.data);
      if (maintenanceNow === '設備') {
        let res = await axios.get(`${API_URL}/basicInfo/getOptions`);
        setOptions(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleDelete(id) {
    try {
      Swal.fire({
        title: `確定要刪除嗎?`,
        html: `刪除後將無法復原`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await axios.put(`${API_URL}/basicInfo/delete${currentMaintenance.api}`, { ID: id });
          if (result.data.status) {
            toast.success(result.data.message, {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: 'light',
            });
            handleGet();
          } else {
            toast.error(result.data.message, {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: 'light',
            });
          }
        }
      });
    } catch (error) {
      console.error('Error delete data:', error);
    }
  }

  useEffect(() => {
    (async () => {
      setEditArr([]);
      setNewData(currentMaintenance.newData);
      setSearchCondition(currentMaintenance.searchCondition);

      if (maintenanceNow === '區域') {
        setNewData({ ...currentMaintenance.newData, UserStamp: localStorage.getItem('account') });
      }
    })();
  }, [maintenanceNow]);

  useEffect(() => {
    (async () => {
      handleGet();
    })();
  }, [searchCondition]);

  useEffect(() => {}, []);

  // useEffect(() => {
  //   if (editArr.length > 0) {
  //     const firstEditId = editArr[editArr.length - 1];
  //     console.log(firstEditId);
  //     const firstFieldName = Object.keys(inputRefs.current[firstEditId])[0];
  //     console.log(firstFieldName);
  //     if (inputRefs.current[firstEditId] && inputRefs.current[firstEditId][firstFieldName]) {
  //       inputRefs.current[firstEditId][firstFieldName].focus();
  //     }
  //   }
  // }, [editArr]);

console.log(newData);

  return (
    <div className="bg w-full h-full flex justify-center items-center gap-4">
      <Nav />
      <div className="content bg-white w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-5/6 2xl:w-3/4 h-5/6 min-h-60 rounded-xl flex justify-center items-center gap-6 lg:gap-10 xl:gap-16 2xl:gap-24 py-12 overflow-hidden">
        <div className="w-1/2 md:w-1/4 xl:w-1/5 h-full flex flex-col gap-8">
          {/* 分頁 */}
          <div className="w-full h-16 bg-white grid grid-cols-5 shadow-md border">
            {maintenance.map((v, i) => {
              return (
                <div
                  key={i}
                  className={`border-r hover:font-bold hover:cursor-pointer flex justify-center items-center  ${v.name === maintenanceNow && 'font-bold text-green-600'}`}
                  onClick={() => {
                    setMaintenanceNow(v.name);
                  }}
                >
                  {v.name}
                </div>
              );
            })}
          </div>
          {/* 格線 */}
          <div className="w-full h-0.5 shadow">
            <div className="w-full h-0.5 bg-slate-300 "></div>
          </div>
          {/* 搜尋條件 */}
          <div className="w-full flex flex-col justify-center items-center gap-2">
            {Object.keys(maintenance.find((v) => v.name === maintenanceNow)?.searchCondition).map((labelName, i) => (
              <div key={i} className="w-fit flex flex-col justify-center items-start gap-2">
                <label htmlFor={labelName}>
                  {maintenance.find((v) => v.name === maintenanceNow).keyToLabel[labelName]}
                </label>
                {labelName === 'AreaID' ? (
                  <select
                    name=""
                    id={labelName}
                    defaultValue={searchCondition[labelName]}
                    className="w-48 min-h-9 border px-2 rounded-md"
                    onChange={(e) => {
                      setSearchCondition((prev) => ({
                        ...prev,
                        [labelName]: e.target.value,
                      }));
                    }}
                  >
                    <option value="">選項</option>
                    {options[labelName]?.map((value) => {
                      return (
                        <option value={value.ID} key={value.ID}>
                          {value.AreaName}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    type="text"
                    id={labelName}
                    value={searchCondition[labelName] || ''}
                    onChange={(e) => {
                      setSearchCondition((prev) => {
                        return { ...prev, [labelName]: e.target.value };
                      });
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* 中間格線 */}
        <div className="w-0.5 h-full flex items-center shadow">
          <div className="w-0.5 h-full bg-slate-300 "></div>
        </div>
        {/* 內容 */}
        <div className="w-1/2 h-full flex justify-center">
          <div className="bg-white md:w-fit h-full overflow-auto shadow-md">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="border border-r-0 border-separate border-slate-500 px-4"></th>
                  {Object.values(currentMaintenance.keyToLabel).map((labelName, i) => (
                    <th className="border-y border-separate border-slate-500 px-4 text-nowrap" key={i}>
                      {labelName}
                    </th>
                  ))}
                  <th className="border border-l-0 border-separate border-slate-500 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {maintenanceNow !== '細項' && (
                  <tr className="hover:bg-green-100">
                    <td className="border border-r-0 border-separate border-slate-300">
                      <div className="flex gap-2 px-2"></div>
                    </td>
                    <td className="border-b border-slate-300"></td>
                    {Object.keys(newData).map((fieldName, i) => {
                      return (
                        fieldName !== 'UserStamp' &&
                        (fieldName !== 'RecordTime' ? (
                          <td className="border-y border-separate border-slate-300" key={i}>
                            {fieldName === 'AreaID' || fieldName === 'DeviceID' ? (
                              <select
                                name=""
                                id={fieldName}
                                value={newData[fieldName]}
                                className="w-fit h-9 border  rounded-md"
                                onChange={(e) => {
                                  setNewData((prev) => ({
                                    ...prev,
                                    [fieldName]: e.target.value,
                                  }));
                                }}
                              >
                                <option value="">選項</option>
                                {options[fieldName]?.map((value) => {
                                  return (
                                    <option value={value.ID} key={value.ID}>
                                      {value[fieldName === 'AreaID' ? 'AreaName' : 'Name']}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              <input
                                type="text"
                                className="w-full"
                                value={newData[fieldName] || ''}
                                onChange={(e) => {
                                  setNewData((prev) => ({
                                    ...prev,
                                    [fieldName]: e.target.value,
                                  }));
                                }}
                                onKeyDown={(e) => {
                                  if (event.key === 'Enter') handleAdd();
                                }}
                              />
                            )}
                            {/* <input
                              type="text"
                              className="w-full"
                              value={newData[fieldName] || ''}
                              onChange={(e) => {
                                setNewData((prev) => ({
                                  ...prev,
                                  [fieldName]: e.target.value,
                                }));
                              }}
                              onKeyDown={(e) => {
                                if (event.key === 'Enter') handleAdd();
                              }}
                            /> */}
                          </td>
                        ) : (
                          <td key={i}></td>
                        ))
                      );
                    })}
                    <td className="border border-l-0 border-separate border-slate-300">
                      <div className="flex gap-2 p-1">
                        <div
                          className={`rounded bg-cyan-700 hover:bg-cyan-600 text-white cursor-pointer px-4 py-2 text-nowrap transition`}
                          onClick={handleAdd}
                        >
                          新增
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {data.length > 0 &&
                  data.map((v, i) => (
                    <tr key={i} className="hover:bg-green-100 h-14">
                      <td className="border border-r-0 border-separate border-slate-300">
                        <div className="flex gap-2 px-2">
                          {maintenanceNow !== '細項' && (
                            <div onClick={() => handleDelete(v.ID)}>
                              <IconContext.Provider value={{ className: 'cursor-pointer' }}>
                                <AiOutlineCloseCircle />
                              </IconContext.Provider>
                            </div>
                          )}
                        </div>
                      </td>
                      {Object.keys(v).map((fieldName, index) => {
                        const isEditable =
                          editArr.includes(v.ID) &&
                          (fieldName === 'Name' ||
                            fieldName === 'DeviceID' ||
                            fieldName === 'EPC' ||
                            fieldName === 'AreaID' ||
                            fieldName === 'Model' ||
                            fieldName === 'RFID' ||
                            fieldName === 'Region' ||
                            fieldName === 'Location' ||
                            fieldName === 'Direction' ||
                            fieldName === 'No');
                        if (isEditable) {
                          if (!inputRefs.current[v.ID]) {
                            inputRefs.current[v.ID] = {};
                          }
                          return (
                            <td className="border-y border-separate border-slate-300" key={index}>
                              {fieldName === 'AreaID' || fieldName === 'DeviceID' ? (
                                <select
                                  name=""
                                  id={fieldName}
                                  value={v[fieldName]}
                                  className="w-fit h-9 border  rounded-md"
                                  onChange={(e) => {
                                    setData((prev) =>
                                      prev.map((item) =>
                                        item.ID == v.ID ? { ...item, [fieldName]: e.target.value } : item,
                                      ),
                                    );
                                  }}
                                >
                                  {options[fieldName]?.map((value) => {
                                    return (
                                      <option value={value.ID} key={value.ID}>
                                        {value[fieldName === 'AreaID' ? 'AreaName' : 'Name']}
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : (
                                <input
                                  // ref={(el) => (inputRefs.current[v.ID][fieldName] = el)}
                                  type="text"
                                  className="min-w-full"
                                  value={v[fieldName] || ''}
                                  onChange={(e) => {
                                    setData((prev) =>
                                      prev.map((item) =>
                                        item.ID == v.ID ? { ...item, [fieldName]: e.target.value } : item,
                                      ),
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdate(v.ID);
                                  }}
                                />
                              )}
                              {/* <input
                                // ref={(el) => (inputRefs.current[v.ID][fieldName] = el)}
                                type="text"
                                className="min-w-full"
                                value={v[fieldName] || ''}
                                onChange={(e) => {
                                  setData((prev) =>
                                    prev.map((item) =>
                                      item.ID == v.ID ? { ...item, [fieldName]: e.target.value } : item,
                                    ),
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleUpdate(v.ID);
                                }}
                              /> */}
                            </td>
                          );
                        }
                        return (
                          <td
                            className="border-y border-separate border-slate-300 min-w-full text-nowrap px-4"
                            key={index}
                          >
                            {fieldName === 'RecordTime'
                              ? moment(v[fieldName]).format('YYYY/MM/DD HH:mm')
                              : fieldName === 'IsRFID'
                                ? v[fieldName] === true
                                  ? '是'
                                  : '否'
                                : fieldName === 'AreaID'
                                  ? options[fieldName]?.find((option) => option.ID === v[fieldName])?.AreaName
                                  : fieldName === 'DeviceID'
                                    ? options[fieldName]?.find((option) => option.ID === v[fieldName])?.Name
                                    : v[fieldName]}
                          </td>
                        );
                      })}
                      <td className="border border-l-0 border-separate border-slate-300">
                        <div className="flex gap-2 p-1">
                          {maintenanceNow !== '細項' && (
                            <div
                              className={`rounded ${editArr.includes(v.ID) ? ' bg-sky-700 hover:bg-sky-600' : 'bg-emerald-700 hover:bg-emerald-600'} text-white cursor-pointer px-4 py-2 text-nowrap transition`}
                              onClick={() => {
                                handleUpdate(v.ID);
                                // if (inputRefs.current[v.ID]) {
                                //   const firstFieldName = Object.keys(inputRefs.current[v.ID])[0];
                                //   inputRefs.current[v.ID][firstFieldName].focus();
                                // }
                              }}
                            >
                              {editArr.includes(v.ID) ? '儲存' : '編輯'}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
