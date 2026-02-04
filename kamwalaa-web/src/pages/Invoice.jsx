import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { FiDownload, FiPrinter } from 'react-icons/fi';

const Invoice = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                // In a real app we might have a public invoice lookup or require auth
                // For simplicity, we assume we can fetch by booking number if we have the ID
                // Note: You might need to adjust your backend to allow public fetching of invoice by ID
                const response = await api.get(`/bookings?search=${id}`);
                // Since our getAllBookings might return an array, we need to filter or find.
                // Or better, let's use the 'getUserBookings' if logged in, or a new public endpoint.
                // For now, let's mock/use what we have. API might be restricted.

                // Hack for demo: If restricted, we might need a public endpoint. 
                // Let's assume the user clicks the link and if logged in, sees it.
                // Or we will use a specific endpoint if available.

                // Let's try fetching specific booking if the user is authorized
                const result = await api.get(`/bookings/${id}/details`); // You might need to create this route or use existing

                setBooking(result.data);
            } catch (error) {
                console.error("Error fetching invoice", error);
                // Fallback for demo if API fails (e.g. not logged in)
                // In production, create a public-facing invoice token endpoint
            } finally {
                setLoading(false);
            }
        };

        // For this demo, since we don't have a public invoice endpoint yet, 
        // I will create a simple UI that would render data if passed, 
        // but dealing with the "link" aspect, the user might need to be logged in.
        // Let's simulate a nice layout.

        // fetchInvoice();

        // MOCK DATA for visualization until endpoint is ready
        setBooking({
            booking_number: id || 'KM-2026015',
            customer_name: 'Customer',
            date: new Date().toLocaleDateString(),
            service_name: 'Exterior Wall Painting',
            amount: 20.00,
            payment_method: 'Cash',
            status: 'Completed',
            address: 'Hyderabad, Telangana'
        });
        setLoading(false);

    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-10 text-center">Loading Invoice...</div>;

    return (
        <div className="invoice-container" style={{
            maxWidth: '800px',
            margin: '40px auto',
            padding: '40px',
            backgroundColor: 'white',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ color: '#1a73e8', fontSize: '2rem', margin: 0 }}>KAMWALAA</h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>Professional Home Services</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#333' }}>INVOICE</h2>
                    <p style={{ color: '#666', marginTop: '5px' }}>#{booking?.booking_number}</p>
                </div>
            </div>

            {/* Meta Data */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px' }}>
                <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Bill To:</p>
                    <p style={{ margin: 0 }}>{booking?.customer_name}</p>
                    <p style={{ margin: 0 }}>{booking?.address}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px' }}><strong>Date:</strong> {booking?.date}</p>
                    <p style={{ margin: '0 0 5px' }}><strong>Status:</strong> <span style={{ color: 'green' }}>{booking?.status}</span></p>
                    <p style={{ margin: 0 }}><strong>Payment:</strong> {booking?.payment_method}</p>
                </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Service Description</th>
                        <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '15px', borderBottom: '1px solid #f0f0f0' }}>
                            <strong>{booking?.service_name}</strong>
                            <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0 0' }}>Standard service charge</p>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>
                            ₹{Number(booking?.amount).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>Total Amount:</td>
                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#1a73e8' }}>
                            ₹{Number(booking?.amount).toFixed(2)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            {/* Footer */}
            <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                <p>Thank you for choosing Kamwalaa! We appreciate your business.</p>
                <p>For support, contact: support@kamwalaa.com | +91 90305 45655</p>
            </div>

            {/* Print Button (Hide when printing) */}
            <div className="no-print" style={{ marginTop: '40px', textAlign: 'center' }}>
                <button
                    onClick={handlePrint}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1a73e8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '1rem'
                    }}
                >
                    <FiPrinter /> Print / Save as PDF
                </button>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background-color: white; }
                    .invoice-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
                }
            `}</style>
        </div>
    );
};

export default Invoice;
