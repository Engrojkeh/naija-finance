import React from 'react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
    const handleSecureLogout = () => {
        localStorage.clear();
        onLogout();
    };

    return (
        <aside className="pro-sidebar">
            <div className="sidebar-brand">
                <svg className="isometric-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                    <path d="M50 10 L85 30 L50 50 L15 30 Z" fill="url(#dash_top_grad)" />
                    <path d="M15 30 L50 50 L50 90 L15 70 Z" fill="url(#dash_left_grad)" />
                    <path d="M85 30 L50 50 L50 90 L85 70 Z" fill="url(#dash_right_grad)" />
                    <path d="M50 0 L90 23 L50 45 L10 23 Z" fill="rgba(255,255,255,0.4)" style={{ transform: 'translateY(-15px)', filter: 'blur(2px)' }} />
                    <defs>
                        <linearGradient id="dash_top_grad" x1="15" y1="10" x2="85" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#f97316" /><stop offset="1" stopColor="#ea580c" /></linearGradient>
                        <linearGradient id="dash_left_grad" x1="15" y1="30" x2="50" y2="90" gradientUnits="userSpaceOnUse"><stop stopColor="#0f172a" /><stop offset="1" stopColor="#1e293b" /></linearGradient>
                        <linearGradient id="dash_right_grad" x1="50" y1="50" x2="85" y2="90" gradientUnits="userSpaceOnUse"><stop stopColor="#334155" /><stop offset="1" stopColor="#020617" /></linearGradient>
                    </defs>
                </svg>
                <div className="brand-text">
                    <h2>Naija Finance</h2>
                    <p>Secure Vault</p>
                </div>
            </div>

            <div className="nav-section">
                <p className="nav-label">OVERVIEW</p>
                <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                    <span className="nav-icon">⊞</span> <span className="nav-text">Dashboard</span>
                </button>
                <button className={`nav-item ${activeTab === 'budgets' ? 'active' : ''}`} onClick={() => setActiveTab('budgets')}>
                    <span className="nav-icon">🎯</span> <span className="nav-text">Set Budget</span>
                </button>
                <button className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
                    <span className="nav-icon">💸</span> <span className="nav-text">Log Expense</span>
                </button>
                <button className={`nav-item ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>
                    <span className="nav-icon">📋</span> <span className="nav-text">Manage Records</span>
                </button>
            </div>

            <div className="user-profile">
                <div className="avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                    <p>Welcome,</p>
                    <strong>{user.name}</strong>
                    <button className="logout-link" onClick={handleSecureLogout}>↪ Secure Logout</button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;