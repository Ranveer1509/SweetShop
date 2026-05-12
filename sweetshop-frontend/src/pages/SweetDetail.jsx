import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllSweets, getSweetById } from "../api/sweetService";
import defaultSweet from "../assets/sweets/default_sweet.jpg";
import { CartContext } from "../context/cartContextValue";

function SweetDetail() {
  const { id } = useParams();
  const [sweet, setSweet] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadSweet = async () => {
      try {
        setLoading(true);
        const data = await getSweetById(id);
        setSweet(data);

        const sweets = await getAllSweets();
        setRelated(
          (sweets || [])
            .filter((item) => item.id !== data.id && item.category === data.category)
            .slice(0, 4)
        );
      } catch (error) {
        console.error("Failed to load sweet", error);
      } finally {
        setLoading(false);
      }
    };

    loadSweet();
  }, [id]);

  const handleQuantityChange = (value) => {
    const num = Number(value);
    if (!sweet) return;
    if (num < 1) return setQuantity(1);
    if (num > sweet.quantity) return setQuantity(sweet.quantity);
    setQuantity(num);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(sweet, { imageUrl: sweet.imageUrl || defaultSweet });
    }
    toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  if (!sweet) {
    return (
      <section className="empty-state container">
        <h1>Sweet not found</h1>
        <Link className="btn btn-warning" to="/sweets">
          Back to Shop
        </Link>
      </section>
    );
  }

  const stock = Number(sweet.quantity || 0);
  const price = Number(sweet.price || 0);
  const rating = Number(sweet.rating || 4.6).toFixed(1);

  return (
    <div className="container section-block">
      <div className="product-detail">
        <div className="product-detail__media">
          <img
            src={sweet.imageUrl || defaultSweet}
            alt={sweet.name}
            onError={(event) => {
              event.target.src = defaultSweet;
            }}
          />
        </div>

        <section className="product-detail__info">
          <p className="eyebrow">{sweet.category || "Sweet Pack"}</p>
          <h1>{sweet.name}</h1>
          <div className="product-rating">
            <span>{rating}</span>
            <p>Premium ingredients, packed fresh for delivery.</p>
          </div>
          <div className="product-price">
            Rs {price.toLocaleString()}
            <span>20% festive value</span>
          </div>
          <p className="text-muted">
            A rich Indian sweet made for gifting, family celebrations and daily cravings.
            Ships in secure food-grade packaging with freshness guidance.
          </p>

          <div className="product-highlights">
            <span>Fresh batch</span>
            <span>Gift-ready packaging</span>
            <span>{stock > 0 ? `${stock} in stock` : "Out of stock"}</span>
          </div>

          <div className="d-flex align-items-center gap-3 mt-4">
            <label className="fw-semibold" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={stock}
              value={quantity}
              onChange={(event) => handleQuantityChange(event.target.value)}
              className="form-control quantity-input"
            />
          </div>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <button className="btn btn-success btn-lg" disabled={stock === 0} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <Link className="btn btn-outline-dark btn-lg" to="/cart">
              Checkout
            </Link>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">More like this</p>
            <h2>You May Also Like</h2>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <Link className="related-item" to={`/sweet/${item.id}`} key={item.id}>
                <img src={item.imageUrl || defaultSweet} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>Rs {Number(item.price || 0).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default SweetDetail;
