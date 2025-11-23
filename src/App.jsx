import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddItem from "./pages/AddItem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/add-item" />} />
        <Route path="/add-item" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
