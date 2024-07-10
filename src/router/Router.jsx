import { Routes, Route } from 'react-router-dom';
import BasicInfo from '../page/basicInfo/BasicInfo';
import QuickSearch from '../page/quickSearch/QuickSearch';
import ExcelExport from '../page/excelExport/ExcelExport';
import Permission from '../page/permission/Permission';
import Nav from '../component/Nav';

const Router = () => {
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
