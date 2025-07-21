import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDivinationStore } from './services/store';
import HomePage from './pages/HomePage';
import QuestionPage from './pages/QuestionPage';
import SpreadRecommendationPage from './pages/SpreadRecommendationPage';
import CardDrawingPage from './pages/CardDrawingPage';
import ResultPage from './pages/ResultPage';
import TestPage from './pages/TestPage';

function App() {
  const loadInitialData = useDivinationStore((state) => state.loadInitialData);
  
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/question" element={<QuestionPage />} />
          <Route path="/spread-recommendation" element={<SpreadRecommendationPage />} />
          <Route path="/draw-cards" element={<CardDrawingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;