import { useMemo } from 'react';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function AnalyticsDashboard({ requirements, theme }) {

    const stats = useMemo(() => {
        const teamCounts = {};
        const martCounts = {};
        const uniqueStewards = new Set();
        const uniqueOwners = new Set();

        requirements.forEach(req => {

            const owner = req.data_owner || 'Unknown';
            teamCounts[owner] = (teamCounts[owner] || 0) + 1;

            const mart = req.target_datamart || 'Unspecified';
            martCounts[mart] = (martCounts[mart] || 0) + 1;

            if (req.data_steward) uniqueStewards.add(req.data_steward);
            if (req.data_owner) uniqueOwners.add(req.data_owner);
        });

        const pieData = Object.entries(teamCounts).map(([name, value]) => ({ name, value }));
        const barData = Object.entries(martCounts).map(([name, value]) => ({ name, value }));

        return {
            total: requirements.length,
            stewards: uniqueStewards.size,
            owners: uniqueOwners.size,
            pieData,
            barData
        };
    }, [requirements]);

    const textColor = theme === 'dark' ? '#ecedee' : '#333';
    const gridColor = theme === 'dark' ? '#444' : '#ccc';
    const cardBg = theme === 'dark' ? '#1e1e1e' : '#f5f5f5';

    const tooltipStyle = theme === 'dark' ? {
        backgroundColor: 'rgba(30, 30, 40, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    } : {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        color: '#1f2937',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
    };

    return (
        <div className="analytics-dashboard" style={{ padding: '0 1rem', animation: 'fadeIn 0.5s ease-in' }}>
            <div className="kpi-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <KpiCard title="Total Requirements" value={stats.total} bg={cardBg} />
                <KpiCard title="Data Stewards" value={stats.stewards} bg={cardBg} />
                <KpiCard title="Data Owners" value={stats.owners} bg={cardBg} />
            </div>

            <div className="charts-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
            }}>
                <div className="chart-card" style={{ background: cardBg, padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Requirements by Data Owner</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats.pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'inherit' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card" style={{ background: cardBg, padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Requirements by Datamart</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
                                <XAxis dataKey="name" stroke={textColor} />
                                <YAxis stroke={textColor} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} itemStyle={{ color: 'inherit' }} />
                                <Bar dataKey="value" fill="#82ca9d">
                                    {stats.barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, bg }) {
    return (
        <div style={{
            background: bg,
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <h4 style={{ margin: '0 0 0.5rem 0', opacity: 0.8, fontSize: '0.9rem', textTransform: 'uppercase' }}>{title}</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#646cff' }}>{value}</div>
        </div>
    );
}
