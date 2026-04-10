import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/customer/CustomerOverviewPageStyles.css";

export default function CustomerOverviewPage() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [activeBuyers, setActiveBuyers] = useState(0);
  const [growthRate, setGrowthRate] = useState("0%");
  const [topCustomer, setTopCustomer] = useState("-");
  const [lastRegistered, setLastRegistered] = useState("-");

  useEffect(() => {
    loadCustomerOverview();
  }, []);

  const loadCustomerOverview = async () => {
    try {
      const res = await api.get("/customers");
      const customers = res.data;

      // Total customers
      setTotalCustomers(customers.length);

      // New customers this month
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyCustomers = customers.filter((customer) => {
        const createdDate = new Date(customer.createdAt);

        return (
          createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
        );
      });

      setNewCustomers(monthlyCustomers.length);

      // Active buyers
      // Since no sales relation exists yet, using all customers
      setActiveBuyers(customers.length);

      // Growth rate
      const growth =
        customers.length > 0
          ? ((monthlyCustomers.length / customers.length) * 100).toFixed(1)
          : 0;

      setGrowthRate(`+${growth}% this month`);

      // Top customer
      // Since no purchase data exists, using latest customer
      if (customers.length > 0) {
        const latestCustomer = customers.reduce((latest, current) =>
          new Date(current.createdAt) > new Date(latest.createdAt)
            ? current
            : latest,
        );

        setTopCustomer(latestCustomer.customerName);

        setLastRegistered(
          new Date(latestCustomer.createdAt).toLocaleDateString(),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cov-wrapper">
      {/* HEADER */}
      <div className="cov-header">
        <span className="cov-badge">OVERVIEW</span>
        <h1>Customer Workspace</h1>
        <p>Manage customers, track activity, and improve relationships.</p>
      </div>

      {/* STATS */}
      <div className="cov-cards">
        <div className="cov-card">
          <div className="cov-card-top">
            <span className="cov-icon">👥</span>
            <span className="cov-label">Total Customers</span>
          </div>
          <h2>{totalCustomers}</h2>
        </div>

        <div className="cov-card warning">
          <div className="cov-card-top">
            <span className="cov-icon">🆕</span>
            <span className="cov-label">New Customers</span>
          </div>
          <h2>{newCustomers}</h2>
        </div>

        <div className="cov-card success">
          <div className="cov-card-top">
            <span className="cov-icon">💰</span>
            <span className="cov-label">Active Buyers</span>
          </div>
          <h2>{activeBuyers}</h2>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="cov-insights">
        <h3>Customer Insights</h3>

        <div className="cov-insight-grid">
          <div className="cov-insight-box">
            <p>📈 Growth Rate</p>
            <span>{growthRate}</span>
          </div>

          <div className="cov-insight-box">
            <p>⭐ Top Customer</p>
            <span>{topCustomer}</span>
          </div>

          <div className="cov-insight-box">
            <p>🕒 Last Registered</p>
            <span>{lastRegistered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
