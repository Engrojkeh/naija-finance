import React, { useState } from 'react';
import api from '../../services/api';

const BudgetTab = ({ user, fetchAllData }) => {
    const [budgetCategory, setBudgetCategory] = useState('');
    const [budgetLimit, setBudgetLimit] = useState('');
    const [budgetMonth, setBudgetMonth] = useState('');
    const [budgetMessage, setBudgetMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddBudget = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setBudgetMessage('Processing...');
        try {
            await api.post('/budgets', {
                user_id: user.id,
                category_name: budgetCategory,
                monthly_limit: budgetLimit,
                month_year: budgetMonth || new Date().toISOString().slice(0, 7)
            });
            setBudgetMessage('✅ Budget Limit Set Successfully!');
            setBudgetCategory('');
            setBudgetLimit('');
            setBudgetMonth('');
            setTimeout(() => setBudgetMessage(''), 3000);
            fetchAllData();
        } catch (error) {
            setBudgetMessage('❌ Error setting budget. You may lack permissions.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="view-section">
            <div className="view-header anim-stagger-1">
                <div>
                    <h1 className="view-title">Set Monthly Budgets</h1>
                    <p className="view-desc">Define your financial limits to trigger alerts before you overspend.</p>
                </div>
            </div>
            <div className="glass-panel-3d anim-slide-2" style={{ maxWidth: '650px', padding: '3rem' }}>

                {budgetMessage && <div className={`status-badge-3d ${budgetMessage.includes('✅') ? 'success' : 'error'}`}>{budgetMessage}</div>}

                <form onSubmit={handleAddBudget}>
                    <div className="input-group">
                        <label>Category Name</label>
                        <input type="text" className="input-3d" placeholder="e.g. Food, Transport" value={budgetCategory} onChange={e => setBudgetCategory(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="input-group">
                        <label>Monthly Limit (₦)</label>
                        <input type="number" className="input-3d" placeholder="0.00" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="input-group">
                        <label>Month & Year</label>
                        <input type="month" className="input-3d" value={budgetMonth} onChange={e => setBudgetMonth(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <button type="submit" className="btn-3d-primary" style={{ marginTop: '2rem' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Setting...' : 'Set Budget Limit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BudgetTab;
