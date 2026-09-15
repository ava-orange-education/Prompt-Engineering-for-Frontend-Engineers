import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormList from './components/FormList';
import FormPage from './components/FormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormList />} />
        <Route path="/forms/:formId" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
