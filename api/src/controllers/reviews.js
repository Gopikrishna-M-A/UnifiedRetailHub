import Review from '../models/reviews.js'


export const createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ error: 'Bad request' });
  }
} 




export const getReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find all reviews for the given product
    const reviews = await Review.find({ product: productId }).populate('customer');

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   




export const getReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    // Find the review by its ID
    const review = await Review.findById(reviewId).populate('customer');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   




export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const updatedReviewData = req.body;

    // Find the review by its ID and update it
    const updatedReview = await Review.findByIdAndUpdate(reviewId, updatedReviewData, { new: true });

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   




export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    // Find the review by its ID and delete it
    const deletedReview = await Review.findByIdAndRemove(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(204).send(); // No content to return after successful deletion
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}   


