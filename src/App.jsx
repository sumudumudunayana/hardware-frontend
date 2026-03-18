import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./pages/common/LandingPage";
import OptionPage from "./pages/common/OptionPage";

import AddItemPage from "./pages/item/AddItemPage";
import ViewItemPage from "./pages/item/ViewItemPage";
import UpdateItemPage from "./pages/item/UpdateItemPage";

import SupplierOptionPage from "./pages/common/SupplierOptionPage";

import AddCompanyPage from "./pages/company/AddCompanyPage";
import ManageCompanyPage from "./pages/company/ManageCompanyPage";

import AddCategoryPage from "./pages/category/AddCategoryPage";
import ManageCategoryPage from "./pages/category/ManageCategoryPage";

import AddDistributorPage from "./pages/distributor/AddDistributorPage";
import ManageDistributorPage from "./pages/distributor/ManageDistributorPage";

import AddCustomerPage from "./pages/customer/AddCustomerPage";
import ManageCustomerPage from "./pages/customer/ManageCustomerPage";

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
import ProductModuleLayout from "./pages/item/ProductModuleLayout";
import ProductOverviewPage from "./pages/item/ProductOverviewPage";
import CustomerModuleLayout from "./pages/customer/CustomerModuleLayout";
import SalesModuleLayout from "./pages/sales/SalesModuleLayout";
import DistributorModuleLayout from "./pages/distributor/DistributorModuleLayout";

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
          <Route path="/ViewItemPage" element={<ViewItemPage />} />
          <Route path="/UpdateItemPage" element={<UpdateItemPage />} />

          <Route path="/SupplierOptionPage" element={<SupplierOptionPage />} />

          <Route
            path="/AddSalesPage"
            element={<AddSalesPage cart={cart} setCart={setCart} />}
          />

          <Route
            path="/CartPage"
            element={<CartPage cart={cart} setCart={setCart} />}
          />

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

          <Route path="/products" element={<ProductModuleLayout />}>
            <Route index element={<ProductOverviewPage />} />
            {/* Product */}
            <Route path="add-item" element={<AddItemPage />} />
            <Route path="view-items" element={<ViewItemPage />} />
            <Route path="update-item" element={<UpdateItemPage />} />
            {/* Category */}
            <Route path="add-category" element={<AddCategoryPage />} />
            <Route path="manage-category" element={<ManageCategoryPage />} />
          </Route>

          <Route path="/customers" element={<CustomerModuleLayout />}>
            <Route index element={<div>Customer Overview</div>} />
            <Route path="add" element={<AddCustomerPage />} />
            <Route path="manage" element={<ManageCustomerPage />} />
          </Route>

          <Route path="/sales" element={<SalesModuleLayout />}>
            <Route index element={<div>Sales Overview</div>} />
            <Route path="add" element={<AddSalesPage />} />
            <Route path="manage" element={<ManageSalesPage />} />
            <Route path="reports" element={<div>Sales Reports</div>} />
            <Route path="invoices" element={<InvoicePage />} />
          </Route>

          <Route path="/suppliers" element={<DistributorModuleLayout />}>
            {/* Overview */}
            <Route index element={<div>Supplier Overview</div>} />
            {/* Supplier */}
            <Route path="add" element={<AddDistributorPage />} />
            <Route path="manage" element={<ManageDistributorPage />} />
            {/* Company */}
            <Route path="company/add" element={<AddCompanyPage />} />
            <Route path="company/manage" element={<ManageCompanyPage />} />
          </Route>



        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
