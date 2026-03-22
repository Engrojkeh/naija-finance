import React, { useState } from 'react';
import api from '../../services/api';

const ExpenseTab = ({ user, fetchAllData }) => {
    const [amount, setAmount] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [transactionType, setTransactionType] = useState('Expense');
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('Processing...');
        try {
            // THE FIX: Clean the text before sending to the server! (Trims spaces and capitalizes first letter)
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
            setCategoryName('');
            setDate('');
            setNote('');
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
                        <select className="input-3d" value={transactionType} onChange={e => setTransactionType(e.target.value)} disabled={isSubmitting}>
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Amount (₦)</label>
                        <input type="number" className="input-3d" placeholder="e.g. 5000" value={amount} onChange={e => setAmount(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="input-group">
                        <label>Category / Name</label>
                        <input type="text" className="input-3d" placeholder={transactionType === 'Expense' ? "e.g. Suya, Fuel" : "e.g. Salary, Freelance"} value={categoryName} onChange={e => setCategoryName(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="input-group">
                        <label>Date</label>
                        <input type="date" className="input-3d" value={date} onChange={e => setDate(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <div className="input-group">
                        <label>Additional Notes (Optional)</label>
                        <input type="text" className="input-3d" placeholder="Any extra details..." value={note} onChange={e => setNote(e.target.value)} disabled={isSubmitting} />
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