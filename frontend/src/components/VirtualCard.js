import React from 'react';

const VirtualCard = ({ user, summaryData }) => {
    const totalSpent = summaryData.reduce((acc, curr) => acc + parseFloat(curr.total_spent || 0), 0);

    return (
        <div className="wallet-card-3d anim-slide-2" style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="wallet-chip"></div>
                <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.5" cy="12.5" r="12.5" fill="rgba(255,255,255,0.6)" />
                    <circle cx="27.5" cy="12.5" r="12.5" fill="rgba(255,255,255,0.4)" />
                </svg>
            </div>
            <div style={{ marginTop: 'auto' }}>
                <div className="wallet-balance-label">Total Spent This Month</div>
                <div className="wallet-balance">
                    ₦{totalSpent.toLocaleString()}
                </div>
            </div>
            <div className="wallet-footer" style={{ marginTop: '1.5rem' }}>
                <span style={{ fontFamily: 'monospace', letterSpacing: '2px', opacity: 0.8 }}>{user.name.toUpperCase()}</span>
            </div>
        </div>
    );
};

export default VirtualCard;
