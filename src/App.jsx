import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login/Login';
import Router from './router/Router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter initialEntries={['/']} initialIndex={0} basename="">
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/*" element={<Router />}></Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App
