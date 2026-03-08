import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);
import VirtualCard from '../VirtualCard';

const OverviewTab = ({ user, summaryData }) => {
    return (
        <div className="view-section">
            <div className="view-header anim-stagger-1">
                <div>
                    <h1 className="view-title">Dashboard Overview</h1>
                    <p className="view-desc">Monitor your spending and budget limits</p>
                </div>
            </div>

            <div className="alerts-wrapper">
                {summaryData.map((item, i) => {
                    const limit = parseFloat(item.monthly_limit);
                    const spent = parseFloat(item.total_spent);
                    if (limit > 0) {
                        const perc = spent / limit;
                        if (perc >= 1.0) return (
                            <div key={i} className="alert-banner-3d error anim-slide-1">
                                🚨 Limit Exceeded: {item.category_name} (₦{spent} / ₦{limit})
                            </div>
                        );
                        if (perc >= 0.9) return (
                            <div key={i} className="alert-banner-3d error anim-slide-1">
                                🛑 90% Threshold Reached: {item.category_name} (₦{spent} / ₦{limit})
                            </div>
                        );
                        if (perc >= 0.75) return (
                            <div key={i} className="alert-banner-3d warning anim-slide-1">
                                ⚠️ 75% Threshold Reached: {item.category_name} (₦{spent} / ₦{limit})
                            </div>
                        );
                        if (perc >= 0.5) return (
                            <div key={i} className="alert-banner-3d success anim-slide-1">
                                💡 50% Threshold Reached: {item.category_name} (₦{spent} / ₦{limit})
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* 3D Virtual Bank Card */}
            <VirtualCard user={user} summaryData={summaryData} />

            <div className="charts-grid anim-stagger-3">
                <div className="chart-box">
                    <h3>Spending Breakdown</h3>
                    {summaryData.length > 0 ? (
                        <div style={{ width: '260px', margin: '0 auto' }}>
                            <Pie data={{
                                labels: summaryData.map(i => i.category_name),
                                datasets: [{ data: summaryData.map(i => i.total_spent), backgroundColor: ['#ea580c', '#0f172a', '#fb923c', '#334155', '#fed7aa', '#1e293b'], borderWidth: 2, borderColor: '#ffffff', hoverOffset: 15 }]
                            }} options={{ plugins: { legend: { labels: { font: { family: "'Plus Jakarta Sans', sans-serif" } } } } }} />
                        </div>
                    ) : <p className="empty-state">No data to display yet.</p>}
                </div>

                <div className="chart-box">
                    <h3>Spent vs Budget Limit</h3>
                    {summaryData.length > 0 ? (
                        <div style={{ width: '100%', height: '300px' }}>
                            <Bar
                                data={{
                                    labels: summaryData.map(i => i.category_name),
                                    datasets: [
                                        { label: 'Spent (₦)', data: summaryData.map(i => i.total_spent), backgroundColor: '#ea580c', borderRadius: 8 },
                                        { label: 'Limit (₦)', data: summaryData.map(i => i.monthly_limit || 0), backgroundColor: '#0f172a', borderRadius: 8 }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } } },
                                        x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } } }
                                    },
                                    plugins: { legend: { labels: { color: '#1e293b', font: { family: "'Plus Jakarta Sans', sans-serif" } } } }
                                }}
                            />
                        </div>
                    ) : <p className="empty-state">No data to display yet.</p>}
                </div>
                <div className="chart-box" style={{ gridColumn: '1 / -1' }}>
                    <h3>Spending Trend (Line Chart)</h3>
                    {summaryData.length > 0 ? (
                        <div style={{ width: '100%', height: '300px' }}>
                            <Line
                                data={{
                                    labels: summaryData.map(i => i.category_name),
                                    datasets: [
                                        {
                                            label: 'Spending Trend (₦)',
                                            data: summaryData.map(i => i.total_spent),
                                            borderColor: '#ea580c',
                                            pointBackgroundColor: '#0f172a',
                                            tension: 0.4
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } } },
                                        x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } } }
                                    },
                                    plugins: { legend: { labels: { color: '#1e293b', font: { family: "'Plus Jakarta Sans', sans-serif" } } } }
                                }}
                            />
                        </div>
                    ) : <p className="empty-state">No data to display yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
