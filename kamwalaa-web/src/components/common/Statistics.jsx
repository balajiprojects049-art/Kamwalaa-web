import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiCheckCircle, FiUsers, FiTrendingUp, FiStar, FiMapPin, FiAward, FiShield, FiClock } from 'react-icons/fi';

/* ============================================================
   ANIMATED COUNTER HOOK
   ============================================================ */
const useAnimatedCounter = (target, duration = 2000, startOnView = true) => {
    const [count, setCount] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const rafRef = useRef(null);

    const start = useCallback(() => {
        if (isStarted) return;
        setIsStarted(true);

        const startTime = performance.now();
        const numTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
        const suffix = target.replace(/[0-9.]/g, '');

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * numTarget;

            setCount(current % 1 === 0 ? Math.floor(current) : current.toFixed(1));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setCount(numTarget % 1 === 0 ? numTarget : numTarget.toFixed(1));
            }
        };

        rafRef.current = requestAnimationFrame(animate);
    }, [target, duration, isStarted]);

    useEffect(() => {
        if (!startOnView) start();
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [startOnView, start]);

    return { count, start };
};

/* ============================================================
   STAT ITEM with animated counter + IntersectionObserver
   ============================================================ */
const StatItem = ({ icon: Icon, number, label, color, suffix = '', delay = 0 }) => {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);
    const { count, start } = useAnimatedCounter(number, 1800, true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !seen) {
                    setSeen(true);
                    setTimeout(start, delay);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [seen, start, delay]);

    const rawSuffix = number.replace(/[0-9.]/g, '');

    return (
        <div
            ref={ref}
            className="stat-item-premium"
            style={{ '--stat-color': color, animationDelay: `${delay}ms` }}
        >
            {/* Top Gold Line */}
            <div className="stat-top-accent" />

            {/* Icon */}
            <div className="stat-icon-wrap" style={{ color }}>
                <Icon />
            </div>

            {/* Number */}
            <div className="stat-num" style={{ color }}>
                {seen ? `${count}${rawSuffix}` : number}
            </div>

            {/* Label */}
            <div className="stat-lbl">{label}</div>
        </div>
    );
};

/* ============================================================
   MAIN STATISTICS COMPONENT
   ============================================================ */
const Statistics = () => {
    const stats = [
        {
            icon: FiCheckCircle,
            number: '54+',
            label: 'Premium Services',
            color: '#1a3a6b',
        },
        {
            icon: FiUsers,
            number: '500+',
            label: 'Expert Partners',
            color: '#d4a843',
        },
        {
            icon: FiTrendingUp,
            number: '10000+',
            label: 'Happy Customers',
            color: '#16a34a',
        },
        {
            icon: FiStar,
            number: '4.8',
            label: 'Average Rating',
            color: '#d97706',
        },
        {
            icon: FiMapPin,
            number: '15+',
            label: 'Cities Covered',
            color: '#7c3aed',
        },
        {
            icon: FiClock,
            number: '60',
            label: 'Min Response Time',
            color: '#0891b2',
        },
        {
            icon: FiShield,
            number: '100',
            label: '% Insured Jobs',
            color: '#be123c',
        },
        {
            icon: FiAward,
            number: '3+',
            label: 'Years of Excellence',
            color: '#d4a843',
        },
    ];

    return (
        <section className="statistics-section-premium section-sm">
            {/* Background blobs */}
            <div className="stats-bg-blob stats-blob-1" />
            <div className="stats-bg-blob stats-blob-2" />

            <div className="container">
                {/* Section label */}
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <div className="section-label" style={{ justifyContent: 'center' }}>
                        Our Impact
                    </div>
                    <h2 className="section-title centered" style={{ display: 'inline-block' }}>
                        Numbers That Speak
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '1rem auto 0' }}>
                        Trusted by thousands of households across India. Here's why families choose Kamwalaa for every home service need.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="stats-grid-premium">
                    {stats.map((stat, i) => (
                        <StatItem
                            key={i}
                            icon={stat.icon}
                            number={stat.number}
                            label={stat.label}
                            color={stat.color}
                            delay={i * 80}
                        />
                    ))}
                </div>

                {/* Trust badges row */}
                <div className="trust-badges-row">
                    {[
                        '🔒 SSL Secured Payments',
                        '✅ Background-Verified Partners',
                        '🛡️ Service Guarantee',
                        '📞 24/7 Support',
                        '💳 No Hidden Charges',
                    ].map((badge, i) => (
                        <span key={i} className="trust-badge">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
