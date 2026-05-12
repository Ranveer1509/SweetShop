import { Link } from "react-router-dom";
import defaultSweet from "../assets/sweets/default_sweet.jpg";

function SweetCard({ sweet, image, addToCart }) {
  const stock = Number(sweet?.quantity ?? sweet?.stock ?? 0);
  const rating = Number(sweet?.rating || 4.6).toFixed(1);
  const price = Number(sweet?.price || 0);
  const originalPrice = Math.round(price * 1.2);

  const handleAdd = (event) => {
    event.preventDefault();
    if (stock <= 0) return;
    addToCart(sweet, { imageUrl: image || defaultSweet });
  };

  return (
    <article className="sweet-card card h-100">
      <Link to={`/sweet/${sweet.id}`} className="sweet-card__media">
        <img
          src={image || sweet.imageUrl || defaultSweet}
          alt={sweet.name}
          loading="lazy"
          onError={(event) => {
            event.target.src = defaultSweet;
          }}
        />
        <span className="sweet-card__tag">Fresh today</span>
      </Link>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-2 align-items-start">
          <Link to={`/sweet/${sweet.id}`} className="text-decoration-none text-dark">
            <h5 className="sweet-card__title">{sweet.name}</h5>
          </Link>
          <span className="rating-pill">{rating}</span>
        </div>

        <p className="sweet-card__meta">{sweet.category || "Special Sweet"}</p>

        <div className="d-flex align-items-baseline gap-2 mb-2">
          <span className="sweet-card__price">Rs {price.toLocaleString()}</span>
          <span className="sweet-card__old-price">Rs {originalPrice.toLocaleString()}</span>
        </div>

        <p className={`stock-note ${stock <= 5 ? "text-danger" : "text-muted"}`}>
          {stock > 0 ? `${stock} packs available` : "Out of stock"}
        </p>

        <div className="d-flex gap-2 mt-auto">
          <Link className="btn btn-outline-dark flex-fill" to={`/sweet/${sweet.id}`}>
            View
          </Link>
          <button className="btn btn-success flex-fill" disabled={stock <= 0} onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default SweetCard;
