import React, { useState } from 'react';
import { FiMessageCircle, FiX, FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './FloatingActionButton.css';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        {
            icon: <FaWhatsapp />,
            label: 'WhatsApp',
            href: 'https://wa.me/919876543210',
            color: '#25D366',
            external: true
        },
        {
            icon: <FiPhone />,
            label: 'Call',
            href: 'tel:+919876543210',
            color: '#10B981'
        },
        {
            icon: <FiMail />,
            label: 'Email',
            href: 'mailto:info@kamwalaa.com',
            color: '#3B82F6'
        },
        {
            icon: <FiMessageCircle />,
            label: 'Contact',
            href: '/contact',
            color: '#8B5CF6'
        }
    ];

    return (
        <div className={`fab-container ${isOpen ? 'open' : ''}`}>
            <div className="fab-actions">
                {actions.map((action, index) => (
                    <a
                        key={index}
                        href={action.href}
                        target={action.external ? '_blank' : undefined}
                        rel={action.external ? 'noopener noreferrer' : undefined}
                        className="fab-action"
                        style={{
                            '--delay': `${index * 0.1}s`,
                            '--color': action.color
                        }}
                        onClick={() => !action.external && setIsOpen(false)}
                    >
                        <span className="fab-action-icon">{action.icon}</span>
                        <span className="fab-action-label">{action.label}</span>
                    </a>
                ))}
            </div>
            <button
                className="fab-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Quick actions"
            >
                {isOpen ? <FiX /> : <FiMessageCircle />}
            </button>
        </div>
    );
};

export default FloatingActionButton;
