import React, { useState } from 'react';
import api from '../../services/api';

const ManageRecordsTab = ({ budgetsList, transactionsList, fetchAllData }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteRecord = async (type, id) => {
        if (window.confirm(`Are you sure you want to permanently delete this ${type === 'transactions' ? 'expense' : 'budget'}?`)) {
            setIsDeleting(true);
            try {
                await api.delete(`/${type}/${id}`);
                fetchAllData();
            } catch (error) {
                alert("Failed to delete record. Access denied.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="view-section" style={{ opacity: isDeleting ? 0.6 : 1, pointerEvents: isDeleting ? 'none' : 'auto' }}>
            <div className="view-header anim-stagger-1">
                <div>
                    <h1 className="view-title">Manage Records</h1>
                    <p className="view-desc">Review and modify your history</p>
                </div>
            </div>

            <div className="glass-panel-3d anim-slide-2" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>🎯 Active Budgets</h3>
                {budgetsList.length > 0 ? (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead><tr><th>Category</th><th>Limit (₦)</th><th>Month</th><th>Action</th></tr></thead>
                            <tbody>
                                {budgetsList.map(b => (
                                    <tr key={b.budget_id}>
                                        <td><strong>{b.category_name}</strong></td>
                                        <td>₦{b.monthly_limit}</td>
                                        <td>{b.month_year}</td>
                                        <td><button onClick={() => deleteRecord('budgets', b.budget_id)} className="delete-btn-3d">Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No budgets set yet.</p>}
            </div>

            <div className="glass-panel-3d anim-slide-3" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>💸 Expense History</h3>
                {transactionsList.length > 0 ? (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead><tr><th>Date</th><th>Category</th><th>Amount (₦)</th><th>Note</th><th>Action</th></tr></thead>
                            <tbody>
                                {transactionsList.map(t => (
                                    <tr key={t.transaction_id}>
                                        <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
                                        <td><strong>{t.category_name}</strong></td>
                                        <td>₦{t.amount}</td>
                                        <td>{t.description || '-'}</td>
                                        <td><button onClick={() => deleteRecord('transactions', t.transaction_id)} className="delete-btn-3d">Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No expenses logged yet.</p>}
            </div>

        </div>
    );
};

export default ManageRecordsTab;
