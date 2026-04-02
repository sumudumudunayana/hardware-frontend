import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "sonner";

import LandingPage from "./pages/common/LandingPage";
import OptionPage from "./pages/common/OptionPage";

import AddItemPage from "./pages/item/AddItemPage";
import ViewItemPage from "./pages/item/ViewItemPage";
import UpdateItemPage from "./pages/item/UpdateItemPage";


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

import AddPromotionPage from "./pages/promotion/AddPromotionPage";
import ViewPromotionPage from "./pages/promotion/ViewPromotionPage";
import ManagePromotionPage from "./pages/promotion/ManagePromotionPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import ProtectedRoute from "./util/ProtectedRoute";
import AddStockPage from "./pages/stock/AddStockPage";
import ProductModuleLayout from "./pages/item/ProductModuleLayout";
import ProductOverviewPage from "./pages/item/ProductOverviewPage";
import CustomerModuleLayout from "./pages/customer/CustomerModuleLayout";
import SalesModuleLayout from "./pages/sales/SalesModuleLayout";
import DistributorModuleLayout from "./pages/distributor/DistributorModuleLayout";
import StockModuleLayout from "./pages/stock/StockModuleLayout";
import PromotionModuleLayout from "./pages/promotion/PromotionModuleLayout";
import CustomerOverviewPage from "./pages/customer/CustomerOverviewPage";
import SalesOverviewPage from "./pages/sales/SalesOverviewPage";
import DistributorOverviewPage from "./pages/distributor/DistributorOverviewPage";
import StockOverviewPage from "./pages/stock/StockOverviewPage";
import PromotionOverviewPage from "./pages/promotion/PromotionOverviewPage";
import SalesReportsPage from "./pages/sales/SalesReportsPage";
import SalesInvoicesPage from "./pages/sales/SalesInvoicesPage";
import LowStockAlertPage from "./pages/stock/LowStockAlertPage";
import StockReportsPage from "./pages/stock/StockReportsPage";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <HashRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/OptionPage" element={<OptionPage />} />



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
            <Route index element={<CustomerOverviewPage/>} />
            <Route path="add" element={<AddCustomerPage />} />
            <Route path="manage" element={<ManageCustomerPage />} />
          </Route>

          <Route path="/sales" element={<SalesModuleLayout />}>
            <Route index element={<SalesOverviewPage/>} />
            <Route path="add" element={<AddSalesPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="invoice/:id" element={<InvoicePage />} />
            <Route path="manage" element={<ManageSalesPage />} />
            <Route path="reports" element={<SalesReportsPage/>} />
            <Route path="invoices" element={<SalesInvoicesPage />} />
          </Route>

          <Route path="/suppliers" element={<DistributorModuleLayout />}>
            <Route index element={<DistributorOverviewPage/>} />
            {/* Supplier */}
            <Route path="add" element={<AddDistributorPage />} />
            <Route path="manage" element={<ManageDistributorPage />} />
            {/* Company */}
            <Route path="company/add" element={<AddCompanyPage />} />
            <Route path="company/manage" element={<ManageCompanyPage />} />
          </Route>

          <Route path="/stock" element={<StockModuleLayout />}>
            <Route index element={<StockOverviewPage/>} />
            <Route path="add" element={<AddStockPage />} />
            <Route path="manage" element={<ManageStockPage />} />
            <Route path="low" element={<LowStockAlertPage />} />
            <Route path="reports" element={<StockReportsPage />} />
          </Route>

          <Route path="/promotions" element={<PromotionModuleLayout />}>
            <Route index element={<PromotionOverviewPage/>} />
            <Route path="add" element={<AddPromotionPage />} />
            <Route path="view" element={<ViewPromotionPage />} />
            <Route path="manage" element={<ManagePromotionPage />} />
          </Route>

        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
