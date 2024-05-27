import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login/Login';

function App() {

  return (
    <>
      <BrowserRouter initialEntries={['/']} initialIndex={0} basename="">
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
