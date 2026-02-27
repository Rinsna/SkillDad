import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Activity,
    TrendingUp,
    Clock,
    DollarSign,
    CreditCard,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    Zap,
    Database,
    Server,
    Bell
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import ModernButton from '../../components/ui/ModernButton';
import DashboardHeading from '../../components/ui/DashboardHeading';
import { useToast } from '../../context/ToastContext';

const PaymentMonitoringDashboard = () => {
    const { showToast } = useToast();
    const [timeRange, setTimeRange] = useState('24h');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [metrics, setMetrics] = useState(null);
    const [health, setHealth] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchData(true);
        }, 30000);
        return () => clearInterval(interval);
    }, [timeRange]);

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // Fetch metrics and health in parallel
            const [metricsRes, healthRes] = await Promise.all([
                axios.get(`/api/admin/monitoring/metrics?timeRange=${timeRange}`, config),
                axios.get('/api/admin/monitoring/health', config)
            ]);

            if (metricsRes.data.success) {
                setMetrics(metricsRes.data.metrics);
                // Extract recent transactions from metrics if available
                if (metricsRes.data.metrics.recentTransactions) {
                    setTransactions(metricsRes.data.metrics.recentTransactions);
                }
            }

            if (healthRes.data.success) {
                setHealth(healthRes.data.health);
                setAlerts(healthRes.data.health.alerts || []);
            }
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
            if (!silent) {
                showToast(error.response?.data?.message || 'Failed to fetch monitoring data', 'error');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchData();
    };

    const getHealthStatusColor = (status) => {
        switch (status) {
            case 'healthy':
                return 'text-emerald-400';
            case 'degraded':
                return 'text-amber-400';
            case 'unhealthy':
                return 'text-red-400';
            default:
                return 'text-white/50';
        }
    };

    const getHealthStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle2 className="text-emerald-400" size={20} />;
            case 'degraded':
                return <AlertTriangle className="text-amber-400" size={20} />;
            case 'unhealthy':
                return <XCircle className="text-red-400" size={20} />;
            default:
                return <Activity className="text-white/50" size={20} />;
        }
    };

    const getPaymentMethodIcon = (method) => {
        return <CreditCard className="text-white/50" size={16} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <DashboardHeading title="Payment Monitoring Dashboard" />
                <div className="flex items-center space-x-3">
                    <ModernButton
                        variant="secondary"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </ModernButton>
                </div>
            </div>

            {/* Time Range Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <GlassCard className="!p-4">
                    <div className="flex items-center space-x-3">
                        <Clock className="text-primary" size={20} />
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                            Time Range
                        </span>
                        <div className="flex space-x-2 ml-auto">
                            {['24h', '7d', '30d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        timeRange === range
                                            ? 'bg-primary text-white shadow-glow-gradient'
                                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Alerts */}
            {alerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard className="!p-4 border-amber-500/30 bg-amber-500/5">
                        <div className="flex items-start space-x-3">
                            <Bell className="text-amber-400 mt-1" size={20} />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-amber-400 mb-2">Active Alerts</h3>
                                <div className="space-y-2">
                                    {alerts.map((alert, index) => (
                                        <div key={index} className="text-xs text-white/70">
                                            • {alert}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Key Metrics */}
            {metrics && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GlassCard className="!p-6">
                        <div className="flex items-center mb-6">
                            <TrendingUp className="text-primary mr-3" size={24} />
                            <h2 className="text-lg font-bold text-white font-poppins">Key Metrics</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Success Rate */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                        Success Rate
                                    </span>
                                    <CheckCircle2
                                        className={metrics.successRate >= 90 ? 'text-emerald-400' : 'text-amber-400'}
                                        size={20}
                                    />
                                </div>
                                <p className={`text-2xl font-bold ${
                                    metrics.successRate >= 90 ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                    {metrics.successRate.toFixed(2)}%
                                </p>
                                <p className="text-xs text-white/50 mt-1">
                                    {metrics.successfulPayments} / {metrics.totalAttempts} successful
                                </p>
                            </div>

                            {/* Avg Processing Time */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                        Avg Processing Time
                                    </span>
                                    <Clock
                                        className={metrics.averageProcessingTime <= 5 ? 'text-emerald-400' : 'text-amber-400'}
                                        size={20}
                                    />
                                </div>
                                <p className={`text-2xl font-bold ${
                                    metrics.averageProcessingTime <= 5 ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                    {metrics.averageProcessingTime.toFixed(2)}s
                                </p>
                                <p className="text-xs text-white/50 mt-1">
                                    {metrics.averageProcessingTime <= 5 ? 'Within threshold' : 'Above threshold'}
                                </p>
                            </div>

                            {/* Total Amount */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                        Total Amount
                                    </span>
                                    <DollarSign className="text-blue-400" size={20} />
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    ₹{metrics.totalAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-white/50 mt-1">
                                    {timeRange === '24h' ? 'Last 24 hours' : timeRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
                                </p>
                            </div>

                            {/* Failed Payments */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                                        Failed Payments
                                    </span>
                                    <XCircle className="text-red-400" size={20} />
                                </div>
                                <p className="text-2xl font-bold text-red-400">
                                    {metrics.failedPayments}
                                </p>
                                <p className="text-xs text-white/50 mt-1">
                                    {((metrics.failedPayments / metrics.totalAttempts) * 100).toFixed(1)}% of total
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Charts Row */}
            {metrics && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Payment Method Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <GlassCard className="!p-6">
                            <div className="flex items-center mb-6">
                                <CreditCard className="text-primary mr-3" size={24} />
                                <h2 className="text-lg font-bold text-white font-poppins">Payment Method Distribution</h2>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(metrics.paymentMethodDistribution || {}).map(([method, count]) => {
                                    const percentage = (count / metrics.totalAttempts) * 100;
                                    return (
                                        <div key={method} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2">
                                                    {getPaymentMethodIcon(method)}
                                                    <span className="text-white capitalize">
                                                        {method.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <span className="text-white/50">
                                                    {count} ({percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Failure Reasons Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <GlassCard className="!p-6">
                            <div className="flex items-center mb-6">
                                <AlertTriangle className="text-amber-400 mr-3" size={24} />
                                <h2 className="text-lg font-bold text-white font-poppins">Failure Reasons</h2>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(metrics.failureReasons || {}).map(([reason, count]) => {
                                    const percentage = metrics.failedPayments > 0 
                                        ? (count / metrics.failedPayments) * 100 
                                        : 0;
                                    return (
                                        <div key={reason} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <XCircle className="text-red-400" size={16} />
                                                    <span className="text-white capitalize">
                                                        {reason.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <span className="text-white/50">
                                                    {count} ({percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}

            {/* System Health Status */}
            {health && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <GlassCard className="!p-6">
                        <div className="flex items-center mb-6">
                            <Activity className="text-primary mr-3" size={24} />
                            <h2 className="text-lg font-bold text-white font-poppins">System Health</h2>
                            <div className="ml-auto flex items-center space-x-2">
                                {getHealthStatusIcon(health.overall)}
                                <span className={`text-sm font-semibold ${getHealthStatusColor(health.overall)}`}>
                                    {health.overall.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Database */}
                            {health.components?.database && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Database className="text-white/50" size={20} />
                                            <span className="text-white font-semibold">Database</span>
                                        </div>
                                        {getHealthStatusIcon(health.components.database.status)}
                                    </div>
                                    <p className="text-xs text-white/50">
                                        Response Time: {health.components.database.responseTime}ms
                                    </p>
                                </div>
                            )}

                            {/* HDFC Gateway */}
                            {health.components?.hdfc_gateway && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Zap className="text-white/50" size={20} />
                                            <span className="text-white font-semibold">HDFC Gateway</span>
                                        </div>
                                        {getHealthStatusIcon(health.components.hdfc_gateway.status)}
                                    </div>
                                    <p className="text-xs text-white/50">
                                        Response Time: {health.components.hdfc_gateway.responseTime}ms
                                    </p>
                                </div>
                            )}

                            {/* Redis Cache */}
                            {health.components?.redis_cache && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Server className="text-white/50" size={20} />
                                            <span className="text-white font-semibold">Redis Cache</span>
                                        </div>
                                        {getHealthStatusIcon(health.components.redis_cache.status)}
                                    </div>
                                    <p className="text-xs text-white/50">
                                        Response Time: {health.components.redis_cache.responseTime}ms
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-xs text-white/50">
                                Last checked: {new Date(health.lastChecked).toLocaleString()}
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Real-time Transaction List */}
            {transactions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <GlassCard className="!p-6">
                        <div className="flex items-center mb-6">
                            <Activity className="text-primary mr-3" size={24} />
                            <h2 className="text-lg font-bold text-white font-poppins">Recent Transactions</h2>
                        </div>

                        <div className="space-y-2">
                            {transactions.slice(0, 10).map((transaction, index) => (
                                <motion.div
                                    key={transaction.transactionId || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        {transaction.status === 'success' ? (
                                            <CheckCircle2 className="text-emerald-400" size={18} />
                                        ) : transaction.status === 'failed' ? (
                                            <XCircle className="text-red-400" size={18} />
                                        ) : (
                                            <Clock className="text-amber-400" size={18} />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-mono">
                                                {transaction.transactionId}
                                            </p>
                                            <p className="text-xs text-white/50">
                                                {transaction.paymentMethod?.replace(/_/g, ' ')} • 
                                                {new Date(transaction.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-semibold">
                                            ₹{transaction.amount?.toLocaleString()}
                                        </p>
                                        <p className={`text-xs ${
                                            transaction.status === 'success' ? 'text-emerald-400' :
                                            transaction.status === 'failed' ? 'text-red-400' :
                                            'text-amber-400'
                                        }`}>
                                            {transaction.status}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>
            )}
        </div>
    );
};

export default PaymentMonitoringDashboard;
