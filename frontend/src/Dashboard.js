import React, { useState, useEffect, useCallback } from 'react';
import api from './services/api';

// Components
import Sidebar from './components/Sidebar';
import OverviewTab from './components/tabs/OverviewTab';
import BudgetTab from './components/tabs/BudgetTab';
import ExpenseTab from './components/tabs/ExpenseTab';
import ManageRecordsTab from './components/tabs/ManageRecordsTab';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [summaryData, setSummaryData] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [budgetsList, setBudgetsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sequentially to prevent overwhelming the server pool or tripping the rate limiter
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const month = new Date().toISOString().slice(0, 7);

      const mathRes = await api.get(`/budget-summary/${user.id}/${month}`);
      const transRes = await api.get(`/transactions/${user.id}`);
      const budgRes = await api.get(`/budgets/${user.id}`);

      setSummaryData(mathRes.data);
      setTransactionsList(transRes.data);
      setBudgetsList(budgRes.data);
    } catch (e) {
      console.error("Fetch Error:", e.response ? e.response.data : e.message);
      if (e.response && e.response.status === 429) {
        alert("Rate limit reached! Please wait a moment.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      <main className="pro-main-content">
        {isLoading && (
          <div className="view-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', opacity: 0.5 }}>
            <h2>Loading Data...</h2>
          </div>
        )}

        {!isLoading && (
          <>
            {activeTab === 'dashboard' && <OverviewTab user={user} summaryData={summaryData} />}
            {activeTab === 'budgets' && <BudgetTab user={user} fetchAllData={fetchAllData} />}
            {activeTab === 'expenses' && <ExpenseTab user={user} fetchAllData={fetchAllData} />}
            {activeTab === 'manage' && (
              <ManageRecordsTab
                budgetsList={budgetsList}
                transactionsList={transactionsList}
                fetchAllData={fetchAllData}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;