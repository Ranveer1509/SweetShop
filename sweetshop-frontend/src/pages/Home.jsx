import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllSweets } from "../api/sweetService";
import dryFruit from "../assets/categories/dry_fruit_sweets.jpg";
import festival from "../assets/categories/festival_sweets.jpg";
import milkSweet from "../assets/categories/milk_sweets.jpg";
import traditional from "../assets/categories/traditional_sweets.jpg";
import gulabJamun from "../assets/sweets/gulab_jamun.jpg";
import jalebi from "../assets/sweets/jalebi.jpg";
import kajuKatli from "../assets/sweets/kaju_katli.jpg";
import rasgulla from "../assets/sweets/rasgulla.jpg";
import SweetCard from "../components/SweetCard";
import { CartContext } from "../context/cartContextValue";

const categories = [
  { name: "Milk Sweets", img: milkSweet, text: "Creamy peda, rabri, rasmalai and more" },
  { name: "Dry Fruit Sweets", img: dryFruit, text: "Kaju, pista and almond-rich gifting boxes" },
  { name: "Festival Specials", img: festival, text: "Celebration packs for every occasion" },
  { name: "Traditional Sweets", img: traditional, text: "Classic Indian favourites made fresh" }
];

const bestSellers = [
  { name: "Kaju Katli", price: 80, img: kajuKatli },
  { name: "Gulab Jamun", price: 40, img: gulabJamun },
  { name: "Rasgulla", price: 40, img: rasgulla },
  { name: "Jalebi", price: 35, img: jalebi }
];

const sweetImages = {
  "Kaju Katli": kajuKatli,
  "Gulab Jamun": gulabJamun,
  Rasgulla: rasgulla,
  Jalebi: jalebi
};

function Home() {
  const token = localStorage.getItem("token");
  const { addToCart } = useContext(CartContext);
  const [featuredSweets, setFeaturedSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await getAllSweets();
        setFeaturedSweets((data || []).slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured sweets", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <>
      <section className="shop-hero">
        <div className="container shop-hero__content">
          <div>
            <p className="eyebrow">Fresh Indian sweets delivered</p>
            <h1>SweetShop</h1>
            <p>
              Order mithai, festival boxes and celebration trays with easy checkout,
              live cart totals and fast local delivery.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link className="btn btn-warning btn-lg" to="/sweets">
                Shop Sweets
              </Link>
              <Link className="btn btn-outline-light btn-lg" to="/cart">
                View Cart
              </Link>
            </div>
          </div>
          <div className="hero-stat-grid" aria-label="Shop highlights">
            <div>
              <strong>25+</strong>
              <span>Fresh sweets</span>
            </div>
            <div>
              <strong>4.8</strong>
              <span>Customer rating</span>
            </div>
            <div>
              <strong>60 min</strong>
              <span>Local dispatch</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="offer-strip">
          <span>Festival offer</span>
          <strong>10% off orders above Rs 999 plus free delivery above Rs 499.</strong>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <p className="eyebrow">Browse by mood</p>
          <h2>Shop Popular Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link className="category-tile" key={cat.name} to={`/sweets?category=${cat.name}`}>
              <img src={cat.img} alt={cat.name} />
              <div>
                <h3>{cat.name}</h3>
                <p>{cat.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading d-flex justify-content-between align-items-end gap-3">
          <div>
            <p className="eyebrow">Recommended</p>
            <h2>Featured Sweets</h2>
          </div>
          <Link className="btn btn-outline-dark" to="/sweets">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning"></div>
          </div>
        ) : (
          <div className="sweet-grid">
            {featuredSweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                image={sweetImages[sweet.name]}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <p className="eyebrow">Customer favourites</p>
          <h2>Best Selling Sweets</h2>
        </div>
        <div className="bestseller-grid">
          {bestSellers.map((sweet) => (
            <Link className="bestseller-item" to="/sweets" key={sweet.name}>
              <img src={sweet.img} alt={sweet.name} />
              <div>
                <h3>{sweet.name}</h3>
                <p>From Rs {sweet.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {!token && (
        <section className="container section-block">
          <div className="join-band">
            <div>
              <p className="eyebrow">Member checkout</p>
              <h2>Create an account for orders, invoices and cart checkout.</h2>
            </div>
            <Link className="btn btn-warning" to="/register">
              Register Now
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
