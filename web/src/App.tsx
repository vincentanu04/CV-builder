import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, LandingPage, ResumeForm } from './pages';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/resume/new'
          element={
            <ProtectedRoute>
              <ResumeForm isEdit={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/resume/:id'
          element={
            <ProtectedRoute>
              <ResumeForm isEdit={true} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
