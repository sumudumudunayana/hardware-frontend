import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./pages/common/LandingPage";
import OptionPage from "./pages/common/OptionPage";

import AddItemPage from "./pages/item/AddItemPage";
import ItemOptionPage from "./pages/item/ItemOptionPage";
import ViewItemPage from "./pages/item/ViewItemPage";
import UpdateItemPage from "./pages/item/UpdateItemPage";

import SupplierOptionPage from "./pages/common/SupplierOptionPage";

import AddCompanyPage from "./pages/company/AddCompanyPage";
import CompanyOptionPage from "./pages/company/CompanyOptionPage";
import ManageCompanyPage from "./pages/company/ManageCompanyPage";

import CategoryOptionPage from "./pages/category/CategoryOptionPage";
import AddCategoryPage from "./pages/category/AddCategoryPage";
import ManageCategoryPage from "./pages/category/ManageCategoryPage";

import DistributorOptionPage from "./pages/distributor/DistributorOptionPage";
import AddDistributorPage from "./pages/distributor/AddDistributorPage";
import ManageDistributorPage from "./pages/distributor/ManageDistributorPage";

import CustomerOptionPage from "./pages/customer/CustomerOptionPage";
import AddCustomerPage from "./pages/customer/AddCustomerPage";
import ManageCustomerPage from "./pages/customer/ManageCustomerPage";

import SalesOptionPage from "./pages/sales/SalesOptionPage";
import AddSalesPage from "./pages/sales/AddSalesPage";
import CartPage from "./pages/sales/CartPage";
import InvoicePage from "./pages/sales/InvoicePage";
import ManageSalesPage from "./pages/sales/ManageSalesPage";

import ManageStockPage from "./pages/stock/ManageStockPage";

import PromotionOptionPage from "./pages/promotion/PromotionOptionPage";
import AddPromotionPage from "./pages/promotion/AddPromotionPage";
import ViewPromotionPage from "./pages/promotion/ViewPromotionPage";
import ManagePromotionPage from "./pages/promotion/ManagePromotionPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import ProtectedRoute from "./util/ProtectedRoute";
import StockOptionPage from "./pages/stock/StockOptionPage";
import AddStockPage from "./pages/stock/AddStockPage";
import ItemAndCategoryOptionPage from "./pages/item/ItemAndCategoryOptionPage";
import ProductModuleLayout from "./pages/item/ProductModuleLayout";
import ProductOverviewPage from "./pages/item/ProductOverviewPage";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/OptionPage" element={<OptionPage />} />

          <Route path="/AddItemPage" element={<AddItemPage />} />
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

          <Route
            path="/DistributorOptionPage"
            element={<DistributorOptionPage />}
          />
          <Route path="/AddDistributorPage" element={<AddDistributorPage />} />
          <Route
            path="/ManageDistributorPage"
            element={<ManageDistributorPage />}
          />

          <Route path="/CustomerOptionPage" element={<CustomerOptionPage />} />
          <Route path="/AddCustomerPage" element={<AddCustomerPage />} />
          <Route path="/ManageCustomerPage" element={<ManageCustomerPage />} />

          <Route path="/SalesOptionPage" element={<SalesOptionPage />} />

          <Route
            path="/AddSalesPage"
            element={<AddSalesPage cart={cart} setCart={setCart} />}
          />

          <Route
            path="/CartPage"
            element={<CartPage cart={cart} setCart={setCart} />}
          />

          <Route path="/ManageSalesPage" element={<ManageSalesPage />} />
          <Route path="/InvoicePage/:id" element={<InvoicePage />} />

          <Route path="/ManageStockPage" element={<ManageStockPage />} />

          <Route
            path="/PromotionOptionPage"
            element={<PromotionOptionPage />}
          />
          <Route path="/AddPromotionPage" element={<AddPromotionPage />} />
          <Route path="/ViewPromotionPage" element={<ViewPromotionPage />} />
          <Route
            path="/ManagePromotionPage"
            element={<ManagePromotionPage />}
          />
          <Route path="/StockOptionPage" element={<StockOptionPage />} />
          <Route path="/AddStockPage" element={<AddStockPage />} />
          <Route
            path="/ItemAndCategoryOptionPage"
            element={<ItemAndCategoryOptionPage />}
          />

          <Route path="/products" element={<ProductModuleLayout />}>
            <Route index element={<ProductOverviewPage />} />
            <Route path="add-item" element={<AddItemPage />} />
            <Route path="view-items" element={<ViewItemPage />} />
            <Route path="update-item" element={<UpdateItemPage />} />
          </Route>


        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
