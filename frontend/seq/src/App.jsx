import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './signup';
import Login from './login';
import Task from './taskform';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Task />} />
      </Routes>
    </Router>
  );
};

export default App;