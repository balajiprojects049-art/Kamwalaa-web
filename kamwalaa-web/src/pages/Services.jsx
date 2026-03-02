import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FiSearch, FiChevronRight, FiClock, FiCheck,
    FiStar, FiShield, FiX, FiGrid, FiList, FiArrowLeft,
    FiZap, FiUsers, FiAward, FiMapPin
} from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getAllCategories } from '../data/servicesData';
import { getServiceIcon } from '../utils/serviceIcons';
import EnhancedServiceModal from '../components/EnhancedServiceModal';
import './Services.css';

/* ─── SERVICES HERO ────────────────────────────── */
const ServicesHero = ({ totalSvcs, query, setQuery }) => {
    const quickLinks = [
        { label: 'Electrical', emoji: '⚡' },
        { label: 'Plumbing', emoji: '🔧' },
        { label: 'AC Service', emoji: '❄️' },
        { label: 'Cleaning', emoji: '🧹' },
        { label: 'Painting', emoji: '🎨' },
        { label: 'Carpentry', emoji: '🪵' },
    ];

    const stats = [
        { icon: FiZap, value: `${totalSvcs}+`, label: 'Services' },
        { icon: FiUsers, value: '500+', label: 'Professionals' },
        { icon: FiMapPin, value: '1', label: 'City' },
        { icon: FiStar, value: '4.8★', label: 'Avg Rating' },
    ];

    const floatBubbles = [
        { emoji: '⚡', id: 'b1' }, { emoji: '🔧', id: 'b2' },
        { emoji: '❄️', id: 'b3' }, { emoji: '🏠', id: 'b4' },
        { emoji: '🎨', id: 'b5' }, { emoji: '🧹', id: 'b6' },
        { emoji: '🔌', id: 'b7' }, { emoji: '🛁', id: 'b8' },
    ];

    return (
        <div className="sph">
            {/* dot-grid background overlay */}
            <div className="sph__dotgrid" />

            {/* animated blobs */}
            <div className="sph__blob sph__blob--1" />
            <div className="sph__blob sph__blob--2" />
            <div className="sph__blob sph__blob--3" />
            <div className="sph__blob sph__blob--4" />

            {/* geometric decorative rings */}
            <div className="sph__ring sph__ring--1" />
            <div className="sph__ring sph__ring--2" />
            <div className="sph__ring sph__ring--3" />

            {/* diagonal shimmer */}
            <div className="sph__shimmer" />

            {/* floating service emoji bubbles */}
            <div className="sph__bubbles" aria-hidden="true">
                {floatBubbles.map(b => (
                    <div key={b.id} className={`sph__bubble sph__bubble--${b.id}`}>{b.emoji}</div>
                ))}
            </div>

            <div className="sph__inner container">
                {/* label pill */}
                <div className="sph__pill">
                    <FiZap className="sph__pill-icon" />
                    Professional Home Services
                </div>

                {/* headline */}
                <h1 className="sph__title">
                    Book Expert Services<br />
                    <span className="sph__title-gold">At Your Doorstep</span>
                </h1>

                <p className="sph__sub">
                    Verified professionals · Insured &amp; background-checked · 30-day warranty
                </p>

                {/* hero search bar */}
                <div className="sph__search">
                    <FiSearch className="sph__search-icon" />
                    <input
                        className="sph__search-input"
                        type="search"
                        placeholder="What service do you need? e.g. AC repair, fan installation…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoComplete="off"
                    />
                    {query && (
                        <button className="sph__search-clear" onClick={() => setQuery('')}>
                            <FiX />
                        </button>
                    )}
                </div>

                {/* quick-link chips */}
                <div className="sph__quicklinks">
                    {quickLinks.map(q => (
                        <button
                            key={q.label}
                            className="sph__ql"
                            onClick={() => setQuery(q.label)}
                        >
                            <span>{q.emoji}</span> {q.label}
                        </button>
                    ))}
                </div>

                {/* stats strip */}
                <div className="sph__stats">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="sph__stat">
                                <div className="sph__stat-icon"><Icon /></div>
                                <div className="sph__stat-val">{s.value}</div>
                                <div className="sph__stat-lbl">{s.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* bottom wave */}
            <div className="sph__wave" aria-hidden="true">
                <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1350,18 1440,36 L1440,72 L0,72 Z" fill="#f1f4f9" />
                </svg>
            </div>
        </div>
    );
};

/* ─── helpers ─────────────────────────────────── */
const getName = (item, lang) => {
    if (!item?.name) return '';
    if (typeof item.name === 'string') return item.name;
    return item.name[lang] || item.name.en || '';
};

/* ─── Rating helper ───────────────────────────── */
const getStars = (idx) => (4.5 + ((idx * 7) % 5) / 10).toFixed(1);
const getReviews = (idx) => 120 + idx * 23;

/* ─── SERVICE CARD ────────────────────────────── */
const ServiceCard = ({ svc, idx, lang, viewMode, onDetails, onBook }) => {
    const name = getName(svc, lang);
    const rating = getStars(idx);
    const reviews = getReviews(idx);
    const price = String(svc.price || '').replace(/[^0-9₹]/g, '') || svc.price;
    const isPopular = idx < 2;

    return (
        <article className={`sp-card ${viewMode === 'list' ? 'sp-card--list' : ''}`}>
            {isPopular && (
                <div className="sp-card__badge">
                    <FiStar /> Popular
                </div>
            )}

            {svc.images?.[0] && (
                <div className="sp-card__img-wrap">
                    <img src={svc.images[0]} alt={name} loading="lazy" />
                </div>
            )}

            <div className="sp-card__body">
                <h4 className="sp-card__name">{name}</h4>

                <div className="sp-card__rating">
                    <FiStar className="sp-star" />
                    <strong>{rating}</strong>
                    <span>({reviews} reviews)</span>
                </div>

                <div className="sp-card__chips">
                    <span className="sp-chip sp-chip--green"><FiCheck />Professional</span>
                    <span className="sp-chip sp-chip--blue"><FiClock />30–45 min</span>
                    <span className="sp-chip sp-chip--gold"><FiShield />Insured</span>
                </div>

                <div className="sp-card__footer">
                    <div className="sp-card__price">
                        <span className="sp-price-from">Starting</span>
                        <span className="sp-price-val">
                            {String(svc.price).startsWith('₹') ? '' : '₹'}{svc.price}
                        </span>
                    </div>
                    <div className="sp-card__actions">
                        <button className="sp-btn sp-btn--outline" onClick={() => onDetails(svc)}>
                            Details
                        </button>
                        <button className="sp-btn sp-btn--primary" onClick={() => onBook(svc)}>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

/* ─── MAIN COMPONENT ──────────────────────────── */
const Services = () => {
    const { t, currentLanguage } = useLanguage();
    const navigate = useNavigate();
    const { categoryId } = useParams();

    // data
    const [all, setAll] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // search
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // ui
    const [viewMode, setViewMode] = useState('grid');
    // mobile: 'cats' | 'subs' | 'svcs'
    const [mobilePane, setMobilePane] = useState('cats');

    // modal
    const [modalSvc, setModalSvc] = useState(null);
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [selSlot, setSelSlot] = useState(null);
    const [selAddOns, setSelAddOns] = useState([]);
    const [qty, setQty] = useState(1);
    const [fav, setFav] = useState(false);

    /* load */
    useEffect(() => {
        setIsLoading(true);
        try {
            const data = getAllCategories();
            setAll(data);
            const cat = categoryId ? data.find(c => c.id === categoryId) : data[0];
            if (cat) {
                setSelectedCat(cat);
                if (cat.subcategories?.length) setSelectedSub(cat.subcategories[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [categoryId]);

    /* search */
    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const q = query.toLowerCase();
        const out = [];
        all.forEach(cat =>
            cat.subcategories?.forEach(sub =>
                sub.services?.forEach(svc => {
                    if (getName(svc, currentLanguage).toLowerCase().includes(q))
                        out.push({ ...svc, _cat: cat, _sub: sub });
                })
            )
        );
        setResults(out);
    }, [query, currentLanguage, all]);

    /* handlers */
    const pickCat = (cat) => {
        setSelectedCat(cat);
        const sub = cat.subcategories?.[0] || null;
        setSelectedSub(sub);
        setMobilePane('subs');
    };
    const pickSub = (sub) => { setSelectedSub(sub); setMobilePane('svcs'); };
    const openModal = (svc) => setModalSvc(svc);
    const closeModal = () => setModalSvc(null);
    const bookSvc = (svc) => navigate('/booking', { state: { selectedServices: [svc], category: selectedCat } });
    const bookModal = () => modalSvc && bookSvc(modalSvc);

    const totalSvcs = all.reduce((t, c) =>
        t + (c.subcategories?.reduce((s, sub) => s + (sub.services?.length || 0), 0) || 0), 0);

    /* mock data */
    const mockFAQs = [
        { id: 1, question: 'How long does the service take?', answer: 'Typically 30–45 minutes.' },
        { id: 2, question: 'Do I need to provide materials?', answer: 'No, all materials are included.' },
        { id: 3, question: 'What is the cancellation policy?', answer: 'Free cancellation up to 2 hours before.' },
        { id: 4, question: 'Is there a warranty?', answer: 'Yes — 30-day service warranty.' },
    ];
    const mockAddOns = [
        { id: 1, name: 'Extended Warranty (1 Year)', price: '₹199' },
        { id: 2, name: 'Priority Service (Next Day)', price: '₹99' },
        { id: 3, name: 'Deep Cleaning After Service', price: '₹149' },
    ];
    const mockReviews = [
        { id: 1, name: 'Rajesh Kumar', rating: 5, date: '2 days ago', comment: 'Excellent!' },
        { id: 2, name: 'Priya Sharma', rating: 4, date: '1 week ago', comment: 'Good service.' },
    ];
    const mockProvider = { name: 'Ravi Kumar', experience: '8 years', rating: 4.8, completedJobs: 1250, certifications: [], verified: true };
    const mockTimeSlots = [];
    const mockRelatedSvcs = [];
    const calcTotal = () => {
        if (!modalSvc) return 0;
        const base = parseInt(String(modalSvc.price).replace(/[^0-9]/g, '')) || 0;
        const extras = selAddOns.reduce((t, id) => {
            const a = mockAddOns.find(x => x.id === id);
            return t + (a ? parseInt(a.price.replace(/[^0-9]/g, '')) : 0);
        }, 0);
        return base * qty + extras;
    };

    return (
        <div className="sp">

            {/* ══ HERO SECTION ══ */}
            <ServicesHero totalSvcs={totalSvcs} query={query} setQuery={setQuery} />

            {/* ══ STICKY FILTER BAR ══ */}
            <div className="sp-bar">
                <div className="sp-bar__inner container">
                    <div className="sp-search">
                        <FiSearch className="sp-search__icon" />
                        <input
                            className="sp-search__input"
                            type="search"
                            placeholder="Filter services…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {query && (
                            <button className="sp-search__clear" onClick={() => setQuery('')}>
                                <FiX />
                            </button>
                        )}
                    </div>

                    <div className="sp-bar__right">
                        <span className="sp-bar__count">{totalSvcs}+ services</span>
                        <div className="sp-toggle">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                                title="Grid view"
                            ><FiGrid /></button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                                title="List view"
                            ><FiList /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ LOADING ══ */}
            {isLoading && (
                <div className="sp-loading">
                    <div className="sp-spinner" />
                    <p>Loading services…</p>
                </div>
            )}

            {/* ══ SEARCH RESULTS ══ */}
            {!isLoading && query && (
                <div className="container sp-results">
                    <div className="sp-results__head">
                        <h3>
                            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;<em>{query}</em>&rdquo;
                        </h3>
                        <button className="sp-clear-search" onClick={() => setQuery('')}>
                            <FiX /> Clear
                        </button>
                    </div>

                    {results.length === 0 ? (
                        <div className="sp-empty">
                            <span className="sp-empty__icon">🔍</span>
                            <h4>No results found</h4>
                            <p>Try "AC", "plumbing", "cleaning"…</p>
                        </div>
                    ) : (
                        <div className={`sp-grid sp-grid--${viewMode}`}>
                            {results.map((svc, i) => (
                                <ServiceCard
                                    key={i} svc={svc} idx={i}
                                    lang={currentLanguage} viewMode={viewMode}
                                    onDetails={openModal} onBook={bookSvc}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ══ MAIN LAYOUT ══ */}
            {!isLoading && !query && (
                <div className="container sp-main">

                    <div className="sph-section-head">
                        <h2>Explore Services</h2>
                        <p>Browse our complete list of professional home services</p>
                    </div>

                    {/* ── DESKTOP: 3 columns side by side ── */}
                    <div className="sp-desktop">

                        {/* Col 1: Categories */}
                        <aside className="sp-col sp-col--cats">
                            <div className="sp-col__head">All Categories</div>
                            <nav>
                                {all.map(cat => {
                                    const Icon = getServiceIcon(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            className={`sp-cat ${selectedCat?.id === cat.id ? 'sp-cat--active' : ''}`}
                                            onClick={() => { setSelectedCat(cat); setSelectedSub(cat.subcategories?.[0] || null); }}
                                        >
                                            <span className="sp-cat__icon"><Icon /></span>
                                            <span className="sp-cat__name">{getName(cat, currentLanguage)}</span>
                                            <FiChevronRight className="sp-cat__arrow" />
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>

                        {/* Col 2: Subcategories */}
                        <aside className="sp-col sp-col--subs">
                            <div className="sp-col__head">{getName(selectedCat, currentLanguage)}</div>
                            {selectedCat?.subcategories?.map(sub => (
                                <button
                                    key={sub.id}
                                    className={`sp-sub ${selectedSub?.id === sub.id ? 'sp-sub--active' : ''}`}
                                    onClick={() => setSelectedSub(sub)}
                                >
                                    <span className="sp-sub__name">{getName(sub, currentLanguage)}</span>
                                    <span className="sp-sub__count">{sub.services?.length || 0}</span>
                                </button>
                            ))}
                        </aside>

                        {/* Col 3: Service cards */}
                        <main className="sp-col sp-col--svcs">
                            <div className="sp-col__head sp-col__head--row">
                                <span>{getName(selectedSub, currentLanguage)}</span>
                                <span className="sp-col__pill">{selectedSub?.services?.length || 0} services</span>
                            </div>

                            {selectedSub?.services?.length ? (
                                <div className={`sp-grid sp-grid--${viewMode}`}>
                                    {selectedSub.services.map((svc, i) => (
                                        <ServiceCard
                                            key={svc.id} svc={svc} idx={i}
                                            lang={currentLanguage} viewMode={viewMode}
                                            onDetails={openModal} onBook={bookSvc}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="sp-empty">
                                    <span className="sp-empty__icon">🛠️</span>
                                    <h4>Select a subcategory</h4>
                                    <p>Choose from the list on the left</p>
                                </div>
                            )}
                        </main>
                    </div>

                    {/* ── MOBILE: stepped navigation ── */}
                    <div className="sp-mobile">

                        {/* Mobile breadcrumb */}
                        <div className="sp-breadcrumb">
                            {mobilePane !== 'cats' && (
                                <button
                                    className="sp-bc-back"
                                    onClick={() => setMobilePane(mobilePane === 'svcs' ? 'subs' : 'cats')}
                                >
                                    <FiArrowLeft /> Back
                                </button>
                            )}
                            <div className="sp-bc-trail">
                                <span
                                    className={mobilePane === 'cats' ? 'active' : ''}
                                    onClick={() => setMobilePane('cats')}
                                >Categories</span>
                                {selectedCat && <>
                                    <FiChevronRight className="sp-bc-sep" />
                                    <span
                                        className={mobilePane === 'subs' ? 'active' : ''}
                                        onClick={() => mobilePane !== 'cats' && setMobilePane('subs')}
                                    >{getName(selectedCat, currentLanguage)}</span>
                                </>}
                                {selectedSub && mobilePane === 'svcs' && <>
                                    <FiChevronRight className="sp-bc-sep" />
                                    <span className="active">{getName(selectedSub, currentLanguage)}</span>
                                </>}
                            </div>
                        </div>

                        {/* Pane: categories */}
                        {mobilePane === 'cats' && (
                            <div className="sp-mpane">
                                {all.map(cat => {
                                    const Icon = getServiceIcon(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            className={`sp-cat ${selectedCat?.id === cat.id ? 'sp-cat--active' : ''}`}
                                            onClick={() => pickCat(cat)}
                                        >
                                            <span className="sp-cat__icon"><Icon /></span>
                                            <span className="sp-cat__name">{getName(cat, currentLanguage)}</span>
                                            <FiChevronRight className="sp-cat__arrow" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pane: subcategories */}
                        {mobilePane === 'subs' && (
                            <div className="sp-mpane">
                                <h3 className="sp-mpane__title">{getName(selectedCat, currentLanguage)}</h3>
                                {selectedCat?.subcategories?.map(sub => (
                                    <button
                                        key={sub.id}
                                        className={`sp-sub ${selectedSub?.id === sub.id ? 'sp-sub--active' : ''}`}
                                        onClick={() => pickSub(sub)}
                                    >
                                        <span className="sp-sub__name">{getName(sub, currentLanguage)}</span>
                                        <span className="sp-sub__count">{sub.services?.length || 0} services</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Pane: services */}
                        {mobilePane === 'svcs' && (
                            <div className="sp-mpane">
                                <div className="sp-mpane__header">
                                    <h3>{getName(selectedSub, currentLanguage)}</h3>
                                    <span className="sp-col__pill">{selectedSub?.services?.length || 0} services</span>
                                </div>
                                <div className={`sp-grid sp-grid--${viewMode}`}>
                                    {selectedSub?.services?.map((svc, i) => (
                                        <ServiceCard
                                            key={svc.id} svc={svc} idx={i}
                                            lang={currentLanguage} viewMode={viewMode}
                                            onDetails={openModal} onBook={bookSvc}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ══ MODAL ══ */}
            {modalSvc && (
                <EnhancedServiceModal
                    modalService={modalSvc}
                    currentLanguage={currentLanguage}
                    handleCloseModal={closeModal}
                    handleBookService={bookModal}
                    mockReviews={mockReviews}
                    mockProvider={mockProvider}
                    mockTimeSlots={mockTimeSlots}
                    mockFAQs={mockFAQs}
                    mockAddOns={mockAddOns}
                    mockRelatedServices={mockRelatedSvcs}
                    expandedFAQ={expandedFAQ}
                    toggleFAQ={id => setExpandedFAQ(expandedFAQ === id ? null : id)}
                    selectedTimeSlot={selSlot}
                    setSelectedTimeSlot={setSelSlot}
                    selectedAddOns={selAddOns}
                    handleAddOnToggle={id => setSelAddOns(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
                    quantity={qty}
                    setQuantity={setQty}
                    isFavorite={fav}
                    setIsFavorite={setFav}
                    handleShare={() => navigator.share?.({ title: getName(modalSvc, currentLanguage), url: window.location.href })}
                    calculateTotal={calcTotal}
                />
            )}
        </div>
    );
};

export default Services;
