import { Routes, Route } from 'react-router-dom';
import BasicInfo from '../page/basicInfo/BasicInfo';
import QuickSearch from '../page/quickSearch/QuickSearch';
import ExcelExport from '../page/excelExport/ExcelExport';
import Permission from '../page/permission/Permission';
import Nav from '../component/Nav';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Router = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('userId') || !localStorage.getItem('account') || !localStorage.getItem('permission')) {
      toast.error('請先登入', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      navigate('/login');
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/basicInfo" element={<BasicInfo />}></Route>
        <Route path="/quickSearch" element={<QuickSearch />}></Route>
        <Route path="/excelExport" element={<ExcelExport />}></Route>
        <Route path="/permission" element={<Permission />}></Route>
      </Routes>
    </>
  );
};

export default Router;
