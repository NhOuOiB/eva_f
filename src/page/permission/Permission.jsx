import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../../utils/config';
import Nav from '../../component/Nav';
import { RiSave3Fill } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { MdDelete } from 'react-icons/md';
import { LuPlus } from 'react-icons/lu';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Permission = () => {
  const [permissionNow, setPermissionNow] = useState('Account');
  const [id, setId] = useState(null);
  const [list, setList] = useState([]);
  const [data, setData] = useState({});
  const [AccountPermissions, setAccountPermissions] = useState([]);

  const MySwal = withReactContent(Swal);

  const handlePermissionChange = (newPermission) => {
    if (permissionNow !== newPermission) {
      setPermissionNow(newPermission);
      setId(null);
    }
  };

  const handleSubmit = async () => {
    if (data.Name === '' || data.Account === '' || data.Password === '' || data.PermissionsID === '') {
      toast.error('欄位未填寫', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      return false;
    }
    if (id === 0 && id !== null) {
      const res = await axios.post(`${API_URL}/permission/add${permissionNow}`, data);
      if (res.data.status) {
        toast.success(res.data.message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      } else {
        toast.error(res.data.message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
    } else if (id !== 0 && id !== null) {
      const res = await axios.put(`${API_URL}/permission/update${permissionNow}`, data);
      if (res.data.status) {
        toast.success(res.data.message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      } else {
        toast.error(res.data.message, {
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
    getList();
  };

  const handleDelete = async () => {
    if (localStorage.getItem('userId') == id) {
      toast.error('不能刪除目前登入帳號', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      return false;
    }
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
        const res = await axios.delete(`${API_URL}/permission/delete${permissionNow}`, { params: { ID: id } });

        if (res.data.status) {
          toast.success(res.data.message, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          });
        } else {
          toast.error(res.data.message, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          });
        }

        getList();
        setId(null);
      }
    });
  };

  const getList = async () => {
    let res = await axios.get(`${API_URL}/permission/get${permissionNow}`);
    setList(res.data);
  };

  const getAccountPermissions = async () => {
    let AccountPermissionsRes = await axios.get(`${API_URL}/permission/getAccountPermissions`);
    setAccountPermissions(AccountPermissionsRes.data);
  };

  useEffect(() => {
    (async () => {
      getAccountPermissions();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      getList();
      setData({});
    })();
  }, [permissionNow]);

  useEffect(() => {
    (async () => {
      if (id) {
        let res = await axios.get(`${API_URL}/permission/get${permissionNow}ById`, { params: { id: id } });
        setData(res.data[0]);
        if (permissionNow === 'Account') {
          getAccountPermissions();
        }
      }
    })();
  }, [id]);
  return (
    <div className="bg w-full h-full flex justify-center items-center gap-4">
      <Nav />
      <div className="content bg-white w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-5/6 2xl:w-3/4 h-5/6 min-h-60 rounded-xl flex justify-center gap-6 lg:gap-8 xl:gap-16 2xl:gap-24 py-12 overflow-hidden">
        {/* 分頁 */}
        <div className=" rounded-t-none rounded-xl w-1/2 md:w-1/3 xl:w-1/4 2xl:w-1/5 min-h-full bg-white flex flex-col items-center gap-6">
          <div className="w-full flex justify-center items-center relative">
            <div className="w-fit flex border-b border-green-800">
              <div
                className={`hover:cursor-pointer flex justify-center items-center w-16 h-10 z-10 ${permissionNow === 'Account' && 'font-bold'} transition duration-300`}
                onClick={() => handlePermissionChange('Account')}
              >
                帳號
              </div>
              <div
                className={`hover:cursor-pointer flex justify-center items-center w-16 h-10  z-10 ${permissionNow === 'AccountPermissions' && 'font-bold'} transition duration-300`}
                onClick={() => handlePermissionChange('AccountPermissions')}
              >
                角色
              </div>
              {/* 色塊 */}
              <div
                className={`w-16 h-10 bg-green-100 rounded absolute -z-0 ${permissionNow === 'Account' ? '' : 'translate-x-16'} shadow transition duration-500`}
              ></div>
            </div>
            {/* 新增 */}
            <div
              className=" border rounded-xl p-2 cursor-pointer hover:shadow transition duration-300 absolute right-0 md:right-4 2xl:right-0"
              onClick={() => {
                if (permissionNow === 'Account') {
                  setId(0);
                  setData({ Account: '', Password: '', PermissionsID: '' });
                } else if (permissionNow === 'AccountPermissions') {
                  setId(0);
                  setData({
                    Name: '',
                    Describe: '',
                    IsBuildNeed: false,
                    IsInventory: false,
                    IsPermissions: false,
                    IsSearch: false,
                    IsWarehouse: false,
                  });
                }
              }}
            >
              <IconContext.Provider value={{ color: '', size: '1.6rem' }}>
                <LuPlus />
              </IconContext.Provider>
            </div>
          </div>
          {/* 格線 */}
          <div className="w-full h-0.5 shadow">
            <div className="w-full h-0.5 bg-slate-300 "></div>
          </div>
          {/* List */}
          <div className="w-full max-h-full rounded overflow-auto shadow">
            {list.map((v) => {
              return (
                <div
                  className={`w-full h-12 border border-slate-400 flex justify-center items-center rounded-md my-2 cursor-pointer ${id === v.ID && 'font-black text-emerald-400 border-emerald-400 hover:shadow-emerald-200'} transition duration-300 hover:shadow`}
                  onClick={() => {
                    setId(v.ID);
                  }}
                  key={v.ID}
                >
                  {permissionNow === 'Account' ? v.Account : v.Name}
                </div>
              );
            })}
          </div>
        </div>
        {/* 中間格線 */}
        <div className="w-0.5 h-full flex items-center shadow">
          <div className="w-0.5 h-full bg-slate-300 "></div>
        </div>
        {/* 內容 */}
        <div className="w-1/2 h-full flex justify-center">
          <div
            className={`bg-white w-full overflow-hidden shadow-md rounded-xl border transition duration-300 relative ${
              id === null ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* 右上快速按鈕 */}
            <div className="w-28 h-12 absolute top-4 right-4 flex items-center justify-around">
              <div
                className="border rounded-xl p-2 cursor-pointer hover:shadow transition duration-300"
                onClick={handleSubmit}
              >
                <IconContext.Provider value={{ color: '', size: '1.6rem' }}>
                  <RiSave3Fill />
                </IconContext.Provider>
              </div>
              <div
                className="border rounded-xl p-2 cursor-pointer hover:shadow transition duration-300"
                onClick={handleDelete}
              >
                <IconContext.Provider value={{ className: 'text-red-500', size: '1.6rem' }}>
                  <MdDelete />
                </IconContext.Provider>
              </div>
            </div>
            {id !== null && (
              <>
                {permissionNow === 'Account' && (
                  <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                    <div className="flex flex-col items-start">
                      <label htmlFor="account">帳號</label>
                      <input
                        type="text"
                        id="account"
                        value={data.Account || ''}
                        onChange={(e) => {
                          setData({ ...data, Account: e.target.value });
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="password">密碼</label>
                      <input
                        type="text"
                        id="password"
                        value={data.Password || ''}
                        onChange={(e) => {
                          setData({ ...data, Password: e.target.value });
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label htmlFor="permission">角色</label>
                      <select
                        name=""
                        id="permission"
                        className="w-48 min-h-9 border px-2 rounded-md"
                        onChange={(e) => {
                          setData({ ...data, PermissionsID: e.target.value });
                        }}
                        value={data.PermissionsID || ''}
                      >
                        <option value="">選項</option>
                        {AccountPermissions.map((value) => {
                          return (
                            <option key={value.ID} value={value.ID}>
                              {value.Name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}
                {permissionNow === 'AccountPermissions' && (
                  <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                      <div className="flex flex-col items-start">
                        <label htmlFor="name">名稱</label>
                        <input
                          type="text"
                          id="name"
                          value={data.Name || ''}
                          onChange={(e) => {
                            setData({ ...data, Name: e.target.value });
                          }}
                          className="w-36"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label htmlFor="describe">描述</label>
                        <input
                          type="text"
                          id="describe"
                          value={data.Describe || ''}
                          onChange={(e) => {
                            setData({ ...data, Describe: e.target.value });
                          }}
                          className="w-36"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                      {Object.keys(data)
                        .filter((v) => {
                          return v !== 'ID' && v !== 'Name' && v !== 'Describe';
                        })
                        .map((v, i) => (
                          <div
                            className={`w-32 h-12 rounded flex justify-center items-center cursor-pointer hover:shadow-md transition duration-300  ${data[v] ? 'bg-emerald-500 text-white hover:shadow-emerald-200' : 'border border-gray-300 text-gray-400'}`}
                            onClick={() => {
                              setData({ ...data, [v]: !data[v] });
                            }}
                            key={i}
                          >
                            {v === 'IsWarehouse'
                              ? '紀錄轉移'
                              : v === 'IsSearch'
                                ? '設備查詢'
                                : v === 'IsInventory'
                                  ? '設備盤點'
                                  : v === 'IsBuildNeed'
                                    ? '需求建立'
                                    : v === 'IsPermissions'
                                      ? '權限管理'
                                      : v}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;
