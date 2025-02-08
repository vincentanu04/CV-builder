import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, LandingPage, ResumeForm } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={<ResumeForm />} /> */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/resume/:id' element={<ResumeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
