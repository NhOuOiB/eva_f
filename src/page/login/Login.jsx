import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../utils/config';
import { toast } from 'react-toastify';
import moment from 'moment';
import logo from '../../assets/eva_logo.png';

const Login = () => {
  const [login, setLogin] = useState({
    account: '',
    password: '',
  });
  const navigate = useNavigate();
  const year = moment().year();

  const [Isfocus, setIsFocus] = useState(false);

  function handleChange(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }
  async function handleLogin() {
    try {
      let res = await axios.post(`${API_URL}/login`, login, {
        withCredentials: true,
      });
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('account', res.data.account);
      localStorage.setItem('permission', res.data.permission);
      if (res.data.message === '成功登入') {
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
      if (res.data.permission != null) {
        navigate('/basicInfo');
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message, {
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
  useEffect(() => {
    // handleLogin();
  }, []);

  return (
    <div className="w-full h-full bg">
      <div className="flex justify-center items-center h-full">
        <div className="w-full h-full flex flex-col justify-center items-center content">
          <div className="absolute left-4 -top-16">
            <img src={logo} alt="logo" />
          </div>
          <div className="w-4/5 h-1/3 sm:w-1/2 sm:h-2/5 md:w-1/3 xl:w-1/4 2xl:w-1/5 flex flex-col justify-center items-center relative">
            <div className="w-fit text-5xl text-emerald-700 font-bold text-nowrap absolute -top-20">
              長榮航太裝備管理系統
            </div>

            <div
              className={`w-full h-full bg-white flex justify-center items-center rounded-xl shadow-md transition duration-500 hover:scale-110 hover:shadow-2xl ${Isfocus && 'scale-110 shadow-2xl'}`}
            >
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex flex-col">
                  <label htmlFor="account" className="text-left">
                    帳號
                  </label>
                  <input
                    type="text"
                    id="account"
                    name="account"
                    value={login.account}
                    onChange={handleChange}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-left">
                    密碼
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        handleLogin(e);
                      }
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                  />
                </div>
                <div
                  className="w-32 h-9 mt-6 flex justify-center items-center rounded border border-green-700 bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                  onClick={(e) => handleLogin(e)}
                >
                  登入
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0">
            © {year} Copyright -{' '}
            <a href="https://www.keewing-id.com/" className="text-red-600">
              KWD
            </a>
            岳林工業有限公司
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
