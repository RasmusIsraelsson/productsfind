import React from 'react';

import MyTable from './MyTable';
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
              <MyTable />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
