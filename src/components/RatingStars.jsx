import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Shows a 0-5 rating as stars (only displays the rating it receives)
export default function RatingStars({ rating, size = 14 }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} size={size} />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} size={size} />);
        } else {
            stars.push(<FaRegStar key={i} size={size} />);
        }
    }
    return (
        <span className="rating-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
            {stars}
        </span>
    );
}
