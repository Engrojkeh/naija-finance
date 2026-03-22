import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ExpenseTab = ({ user, fetchAllData }) => {
    const [amount, setAmount] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [transactionType, setTransactionType] = useState('Expense');
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // NEW: State to hold the user's active budgets for the dropdown
    const [budgetOptions, setBudgetOptions] = useState([]);

    // Fetch the user's budgets when the tab loads so they can select them!
    useEffect(() => {
        api.get(`/budgets/${user.id}`).then(res => {
            // Get a unique list of category names from their budgets
            const uniqueCategories = [...new Set(res.data.map(b => b.category_name))];
            setBudgetOptions(uniqueCategories);
            
            // Automatically select the first budget in the dropdown to be helpful
            if (uniqueCategories.length > 0) {
                setCategoryName(uniqueCategories[0]);
            }
        }).catch(err => console.error("Could not fetch budgets for dropdown", err));
    }, [user.id]);

    // Handle switching between Income and Expense
    const handleTypeChange = (e) => {
        const type = e.target.value;
        setTransactionType(type);
        
        // If they switch back to Expense, auto-select a budget again. If Income, clear it.
        if (type === 'Expense' && budgetOptions.length > 0) {
            setCategoryName(budgetOptions[0]);
        } else {
            setCategoryName('');
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('Processing...');
        try {
            const cleanCategory = categoryName.trim().charAt(0).toUpperCase() + categoryName.trim().slice(1).toLowerCase();

            const categoryResponse = await api.post('/categories', {
                user_id: user.id,
                category_name: cleanCategory
            });
            const newCategoryId = categoryResponse.data.category_id;

            await api.post('/transactions', {
                user_id: user.id,
                category_id: newCategoryId,
                amount: amount,
                transaction_type: transactionType,
                description: note,
                transaction_date: date
            });

            setMessage(`✅ ${transactionType} Saved Successfully!`);
            setAmount('');
            setNote(''); // Clear the note
            setDate('');
            // Notice: We don't clear the Category! This lets you log multiple expenses to the same budget quickly.
            
            setTimeout(() => setMessage(''), 3000);
            fetchAllData();
        } catch (error) {
            setMessage('❌ Failed to save expense.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="view-section">
            <div className="view-header anim-stagger-1">
                <div>
                    <h1 className="view-title">Log a New Transaction</h1>
                    <p className="view-desc">Keep track of every kobo. Log your income and expenses daily for accurate charts.</p>
                </div>
            </div>
            <div className="glass-panel-3d anim-slide-2" style={{ maxWidth: '650px', padding: '3rem' }}>

                {message && <div className={`status-badge-3d ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

                <form onSubmit={handleAddTransaction}>
                    <div className="input-group">
                        <label>Transaction Type</label>
                        <select className="input-3d" value={transactionType} onChange={handleTypeChange} disabled={isSubmitting}>
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Amount (₦)</label>
                        <input type="number" className="input-3d" placeholder="e.g. 5000" value={amount} onChange={e => setAmount(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    
                    <div className="input-group">
                        <label>{transactionType === 'Expense' ? 'Select Budget Category' : 'Income Source'}</label>
                        
                        {/* THE FIX: Dropdown for Expenses, Text Input for Income */}
                        {transactionType === 'Expense' ? (
                            <select className="input-3d" value={categoryName} onChange={e => setCategoryName(e.target.value)} required disabled={isSubmitting}>
                                {budgetOptions.length === 0 && <option value="" disabled>No budgets found. Please set a budget first.</option>}
                                {budgetOptions.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                                <option value="Unbudgeted">Other (Unbudgeted Expense)</option>
                            </select>
                        ) : (
                            <input type="text" className="input-3d" placeholder="e.g. Salary, Freelance" value={categoryName} onChange={e => setCategoryName(e.target.value)} required disabled={isSubmitting} />
                        )}
                    </div>
                    
                    <div className="input-group">
                        <label>Date</label>
                        <input type="date" className="input-3d" value={date} onChange={e => setDate(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    
                    <div className="input-group">
                        <label>What did you buy? (Description)</label>
                        <input type="text" className="input-3d" placeholder={transactionType === 'Expense' ? "e.g. Light bills, Fuel, Food stuff" : "Any extra details..."} value={note} onChange={e => setNote(e.target.value)} required={transactionType === 'Expense'} disabled={isSubmitting} />
                    </div>
                    
                    <button type="submit" className="btn-3d-primary" style={{ marginTop: '2rem' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : `Save ${transactionType}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseTab;