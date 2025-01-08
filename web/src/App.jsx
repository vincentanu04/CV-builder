import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeForm from './pages/ResumeForm';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ResumeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
