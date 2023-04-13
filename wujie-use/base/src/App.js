import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Page1 from './Page1'
import Page2 from './Page2'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Link to='/react'>react</Link>
        <Link to='/vue'>vue</Link>
        <Routes>
          <Route path='/react' element={<Page1></Page1>}></Route>
          <Route path='/vue' element={<Page2></Page2>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
