import React from 'react';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Page1 from './page-1';
import Page2 from './page-2';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Link to="/react">react</Link>
        <Link to="/vue">vue</Link>

        <Routes>
          <Route path='/vue/*' element={<Page1 />} />
          <Route path='/react/*' element={<Page2 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
