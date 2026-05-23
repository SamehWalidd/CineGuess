import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GamePage from './pages/GamePage';
import SubmitPage from './pages/SubmitPage';
import StatsPage from './pages/StatsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
