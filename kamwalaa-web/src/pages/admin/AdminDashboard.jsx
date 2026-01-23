import React from 'react';
import { FaCalendarCheck, FaMoneyBillWave, FaUserPlus, FaStar } from 'react-icons/fa';

const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg ${color}`}>
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className={`font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, here's what's happening efficiently.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Bookings"
                    value="1,248"
                    change="+12.5%"
                    icon={<FaCalendarCheck />}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Total Revenue"
                    value="₹8.4L"
                    change="+8.2%"
                    icon={<FaMoneyBillWave />}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                    title="New Customers"
                    value="384"
                    change="+5.4%"
                    icon={<FaUserPlus />}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard
                    title="Avg. Rating"
                    value="4.8"
                    change="+0.2%"
                    icon={<FaStar />}
                    color="bg-gradient-to-br from-yellow-400 to-yellow-600"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Recent Booking Requests</h3>
                        <button className="text-primary text-sm font-medium hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3 pl-2">Customer</th>
                                    <th className="pb-3">Service</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    C{item}
                                                </div>
                                                <span className="font-medium text-gray-700 text-sm">John Doe</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">AC Repair Service</td>
                                        <td className="py-4 text-sm text-gray-500">23 Jan, 2026</td>
                                        <td className="py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-medium text-gray-800">₹450</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Services */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-6">Popular Services</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'AC Services', count: 320, color: 'bg-blue-500' },
                            { name: 'Plumbing', count: 215, color: 'bg-indigo-500' },
                            { name: 'Electrical', count: 180, color: 'bg-yellow-500' },
                            { name: 'Cleaning', count: 124, color: 'bg-green-500' },
                        ].map((service, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{service.name}</span>
                                    <span className="text-gray-500">{service.count} bookings</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${service.color}`}
                                        style={{ width: `${(service.count / 350) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        View Service Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
