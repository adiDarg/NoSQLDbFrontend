import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./components/Home.jsx";
import UserHome from "./components/UserHome.jsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/" Component={Home} />
          <Route exact path="/UserHome" Component={UserHome} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
