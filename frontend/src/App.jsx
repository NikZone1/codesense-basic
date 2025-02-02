import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeInput from './components/CodeInput';
import ReviewResult from './components/ReviewResult';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CodeInput />} />
        <Route path="/review" element={<ReviewResult />} />
      </Routes>
    </Router>
  );
};

export default App;