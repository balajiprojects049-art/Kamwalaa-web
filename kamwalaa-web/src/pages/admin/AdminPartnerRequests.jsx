import React, { useState, useEffect } from 'react';
import { getPartnerRequests, verifyPartner, rejectPartner, getAllPartners } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext'; // Import Modal
import { FiCheck, FiX, FiFileText, FiPhone, FiMapPin, FiMail, FiBriefcase, FiExternalLink } from 'react-icons/fi';
import { servicesData } from '../../data/servicesData';
import './AdminPartnerRequests.css';

const AdminPartnerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [livePartners, setLivePartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const modal = useModal(); // Init Modal

    // Use the backend URL provided by environment or default
    const BACKEND_URL = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
        : 'http://localhost:5000';

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getPartnerRequests();
            const allPartnersData = await getAllPartners();

            setRequests(data.data);

            // Filter only approved partners
            const approved = allPartnersData.data.filter(p => p.status === 'approved');
            setLivePartners(approved);

            setLoading(false);
        } catch (err) {
            console.error(err);
            error('Failed to fetch partner requests');
            setLoading(false);
        }
    };

    const handleVerify = (id) => {
        modal.confirm(
            'Confirm Verification',
            'Are you sure you want to verify this partner? A WhatsApp notification will be sent immediately.',
            async () => {
                try {
                    await verifyPartner(id);
                    success('Partner verified successfully!');
                    fetchRequests(); // Refresh list
                } catch (err) {
                    console.error(err);
                    error(err.response?.data?.message || 'Verification failed');
                }
            }
        );
    };

    const handleReject = (id) => {
        modal.confirm(
            'Reject Request',
            'Are you sure you want to reject this request? This action cannot be undone.',
            async () => {
                try {
                    await rejectPartner(id);
                    success('Partner request rejected');
                    fetchRequests(); // Refresh list
                } catch (err) {
                    console.error(err);
                    error('Rejection failed');
                }
            }
        );
    };

    const getFileUrl = (path) => {
        if (!path) return '#';
        if (path.startsWith('http')) return path;
        // Construct full URL for uploads served by backend
        return `${BACKEND_URL}${path}`;
    };

    if (loading) return <div className="p-4">Loading requests...</div>;

    return (
        <div className="admin-partners-page">
            <div className="page-header">
                <h2>Partner Applications</h2>
                <span className="badge badge-info">{requests.length} Pending</span>
            </div>

            <div className="live-partners-list">
                {requests.length === 0 ? (
                    <div className="no-requests">No pending partner applications.</div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="live-partner-card" style={{ borderLeft: '4px solid #F59E0B' }}>
                            <div className="card-header">
                                <div>
                                    <h3>{req.contact_name}</h3>
                                    <span className="request-date">{new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                                <span className="status-badge pending">Pending Verification</span>
                            </div>

                            <div className="card-body">
                                {/* Contact Info */}
                                <div className="detail-row">
                                    <FiPhone className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Mobile</span>
                                        <span className="detail-value">{req.contact_phone}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <FiMail className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{req.contact_email || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Business Info */}
                                <div className="detail-row">
                                    <FiBriefcase className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Business & Service</span>
                                        <span className="detail-value">{req.business_name}</span>
                                        <div style={{ marginTop: '4px' }}>
                                            <span className="service-tag">
                                                {servicesData[req.service_category] ? servicesData[req.service_category].name.en : (req.service_category || 'N/A')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-row">
                                    <FiMapPin className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Location</span>
                                        <span className="detail-value">{req.address}</span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>
                                            {req.city || req.user_city}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Docs & Actions */}
                            <div className="card-footer-docs">
                                <div className="doc-grid">
                                    <div className="doc-pill">
                                        <span className="detail-label">Aadhar</span>
                                        <span className="detail-value">{req.aadhar_number}</span>
                                        {req.aadhar_file_url ? (
                                            <a href={getFileUrl(req.aadhar_file_url)} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                <FiFileText /> View <FiExternalLink size={10} />
                                            </a>
                                        ) : <span className="text-muted" style={{ fontSize: '11px' }}>Not Uploaded</span>}
                                    </div>
                                    <div className="doc-pill">
                                        <span className="detail-label">PAN</span>
                                        <span className="detail-value">{req.pan_number}</span>
                                        {req.pan_file_url ? (
                                            <a href={getFileUrl(req.pan_file_url)} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                <FiFileText /> View <FiExternalLink size={10} />
                                            </a>
                                        ) : <span className="text-muted" style={{ fontSize: '11px' }}>Not Uploaded</span>}
                                    </div>
                                </div>

                                <div className="card-actions" style={{ marginTop: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '16px', display: 'flex', gap: '10px', flexDirection: 'column', padding: '0' }}>
                                    <button className="btn btn-success btn-sm" onClick={() => handleVerify(req.id)}>
                                        <FiCheck /> Verify & Approve
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id)}>
                                        <FiX /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Live Partners Section */}
            <div className="page-header" style={{ marginTop: '60px' }}>
                <h2>Live Partners</h2>
                <span className="badge badge-success">{livePartners.length} Active</span>
            </div>

            <div className="live-partners-list">
                {livePartners.length === 0 ? (
                    <div className="no-requests">No active partners yet.</div>
                ) : (
                    livePartners.map(partner => (
                        <div key={partner.id} className="request-card live-partner-card">
                            <div className="card-header">
                                <div>
                                    <h3>{partner.contact_name}</h3>
                                    <span className="request-date">Joined: {new Date(partner.created_at || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <span className="status-badge approved">Verified Partner</span>
                            </div>

                            <div className="card-body">
                                {/* Contact Info */}
                                <div className="detail-row">
                                    <FiPhone className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Mobile</span>
                                        <span className="detail-value">{partner.contact_phone}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <FiMail className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{partner.contact_email || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Business Info */}
                                <div className="detail-row">
                                    <FiBriefcase className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Business & Service</span>
                                        <span className="detail-value">{partner.business_name}</span>
                                        <div style={{ marginTop: '4px' }}>
                                            <span className="service-tag">
                                                {servicesData[partner.service_category] ? servicesData[partner.service_category].name.en : (partner.service_category || 'General')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-row">
                                    <FiMapPin className="detail-icon" />
                                    <div className="detail-content">
                                        <span className="detail-label">Location</span>
                                        <span className="detail-value">{partner.address}</span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>
                                            {partner.city || partner.user_city}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Footer */}
                            <div className="card-footer-docs">
                                <div className="doc-grid">
                                    <div className="doc-pill">
                                        <span className="detail-label">Aadhar Verification</span>
                                        <span className="detail-value">{partner.aadhar_number || 'N/A'}</span>
                                        {partner.aadhar_file_url && (
                                            <a href={getFileUrl(partner.aadhar_file_url)} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                <FiFileText /> View Document <FiExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <div className="doc-pill">
                                        <span className="detail-label">PAN Verification</span>
                                        <span className="detail-value">{partner.pan_number || 'N/A'}</span>
                                        {partner.pan_file_url && (
                                            <a href={getFileUrl(partner.pan_file_url)} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                <FiFileText /> View Document <FiExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPartnerRequests;
