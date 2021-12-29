import React from 'react';

import MyTabell from './MyTabell';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <MyTabell />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
