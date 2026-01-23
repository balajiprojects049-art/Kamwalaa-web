import React, { useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';
import './RateServiceModal.css';

const RateServiceModal = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            bookingId: booking.id,
            rating,
            comment
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content review-modal-content">
                <button className="modal-close" onClick={onClose}><FiX /></button>

                <div className="review-header">
                    <h3>Rate your Experience</h3>
                    <p>How was your <strong>{booking.service}</strong> service?</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="star-rating-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <FiStar fill={star <= (hoverRating || rating) ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                    <p className="rating-text">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                        {!rating && "Select a Rating"}
                    </p>

                    <div className="form-group">
                        <textarea
                            className="review-textarea"
                            placeholder="Write your feedback here (optional)..."
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={rating === 0}
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RateServiceModal;
