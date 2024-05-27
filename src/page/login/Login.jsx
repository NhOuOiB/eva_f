import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../utils/config';
import { toast } from 'react-toastify';
import moment from 'moment';

const Login = () => {
  const [login, setLogin] = useState({
    account: 'LDW',
    password: '851215zxc',
  });
  const navigate = useNavigate();

  function handleChange(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }
  async function handleLogin() {
    try {
      let res = await axios.post(`${API_URL}/login`, login, {
        withCredentials: true,
      });
      localStorage.setItem('permission', res.data.permission);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('last_time', moment.now());
      if (res.status == 200) {
        toast.success(res.data.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      }
      if (res.data.permission == 1) {
        navigate('');
      } else {
        navigate('');
      }
    } catch (err) {
      toast.error(err.response.data.message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    }
  }
  useEffect(() => {
    // handleLogin();
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <div className=" w-44 flex flex-col">
        <label htmlFor="account" className="text-left">
          帳號
        </label>
        <input type="text" id="account" name="account" onChange={handleChange} />
        <label htmlFor="password" className="text-left">
          密碼
        </label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              handleLogin(e);
            }
          }}
        />
        <div className="mt-6 rounded bg-slate-600 text-white" onClick={(e) => handleLogin(e)}>
          登入
        </div>
      </div>
    </div>
  );
};

export default Login;
