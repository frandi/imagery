import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import { ImageConverterPage } from './pages/ImageConverterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/converter" element={<ImageConverterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
