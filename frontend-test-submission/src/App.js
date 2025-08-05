import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UrlShortenerForm from "./UrlShortenerForm";
import UrlStats from "./UrlStats";

function App() {
  return (
    <Router>
      <nav style={{ padding: 16 }}>
        <Link to="/" style={{ marginRight: 16 }}>
          Shortener
        </Link>
        <Link to="/stats">Statistics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UrlShortenerForm />} />
        <Route path="/stats" element={<UrlStats />} />
      </Routes>
    </Router>
  );
}

export default App;
