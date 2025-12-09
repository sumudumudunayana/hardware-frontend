import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AddItemPage from "./pages/AddItemPage";
import OptionPage from "./pages/OptionPage";
import ItemOptionPage from "./pages/ItemOptionPage";
import ViewItemPage from "./pages/ViewItemPage";
import UpdateItemPage from "./pages/UpdateItemPage";
import SupplierOptionPage from "./pages/SupplierOptionPage";
import AddCompanyPage from "./pages/AddCompanyPage";
import CompanyOptionPage from "./pages/CompanyOptionPage";
import ManageCompanyPage from "./pages/ManageCompanyPage";
import CategoryOptionPage from "./pages/CategoryOptionPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import ManageCategoryPage from "./pages/ManageCategoryPage";
import DistributorOptionPage from "./pages/DistributorOptionPage";
import AddDistributorPage from "./pages/AddDistributorPage";
import ManageDistributorPage from "./pages/ManageDistributorPage";

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
        <Route path="/CompanyOptionPage" element={<CompanyOptionPage />} />
        <Route path="/AddCompanyPage" element={<AddCompanyPage />} />
        <Route path="/ManageCompanyPage" element={<ManageCompanyPage />} />
        <Route path="/CategoryOptionPage" element={<CategoryOptionPage />} />
        <Route path="/AddCategoryPage" element={<AddCategoryPage />} />
        <Route path="/ManageCategoryPage" element={<ManageCategoryPage />} />
        <Route path="/DistributorOptionPage" element={<DistributorOptionPage />} />
        <Route path="/AddDistributorPage" element={<AddDistributorPage />} />
        <Route path="/ManageDistributorPage" element={<ManageDistributorPage />} />
      </Routes>
    </HashRouter>
  );
}


export default App;
