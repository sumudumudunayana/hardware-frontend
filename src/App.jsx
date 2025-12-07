import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AddItemPage from "./pages/AddItemPage";
import OptionPage from "./pages/OptionPage";
import ItemOptionPage from "./pages/ItemOptionPage";
import ViewItemPage from "./pages/ViewItemPage";
import UpdateItemPage from "./pages/UpdateItemPage";
import SupplierOptionPage from "./pages/SupplierOptionPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/AddItemPage" element={<AddItemPage />} />
        <Route path="/OptionPage" element={<OptionPage />} />
        <Route path="/ItemOptionPage" element={<ItemOptionPage />} />
        <Route path="/ViewItemPage" element={<ViewItemPage />} />
        <Route path="/UpdateItemPage" element={<UpdateItemPage />} />
        <Route path="/SupplierOptionPage" element={<SupplierOptionPage />} />
      </Routes>
    </HashRouter>
  );
}


export default App;
