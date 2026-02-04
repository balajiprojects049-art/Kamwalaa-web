import React, { useState } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import { submitReview } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import './ReviewModal.css';

const ReviewModal = ({ booking, onClose, onSubmitSuccess }) => {
    const { showToast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = {
                booking_id: booking.id,
                service_id: booking.service_id,
                partner_id: booking.partner_id,
                rating: rating,
                comment: comment.trim()
            };

            const response = await submitReview(reviewData);

            if (response.success) {
                showToast('Thank you for your review!', 'success');
                onSubmitSuccess && onSubmitSuccess();
                onClose();
            } else {
                showToast(response.message || 'Failed to submit review', 'error');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast('Failed to submit review. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Rate Your Experience</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="service-info">
                        <h3>{booking.service_name}</h3>
                        <p className="booking-number">Booking #{booking.booking_number}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Your Rating *</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <FiStar />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="rating-text">
                                    {rating === 1 && 'Poor'}
                                    {rating === 2 && 'Below Average'}
                                    {rating === 3 && 'Average'}
                                    {rating === 4 && 'Good'}
                                    {rating === 5 && 'Excellent'}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Your Review (Optional)</label>
                            <textarea
                                placeholder="Share your experience with this service..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="4"
                                maxLength="500"
                            />
                            <small className="char-count">{comment.length}/500 characters</small>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={onClose}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting || rating === 0}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
