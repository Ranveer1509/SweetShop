import { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllSweets } from "../api/sweetService";
import barfi from "../assets/sweets/barfi.jpg";
import basundi from "../assets/sweets/basundi.jpg";
import coconutBarfi from "../assets/sweets/coconut_barfi.jpg";
import dryFruitHalwa from "../assets/sweets/dry_fruit_halwa.jpg";
import dryFruitLadoo from "../assets/sweets/dry_fruit_ladoo.jpg";
import ghevar from "../assets/sweets/ghevar.jpg";
import gulabJamun from "../assets/sweets/gulab_jamun.jpg";
import jalebi from "../assets/sweets/jalebi.jpg";
import kajuApple from "../assets/sweets/kaju_apple_sweet.jpg";
import kajuKatli from "../assets/sweets/kaju_katli.jpg";
import kajuRoll from "../assets/sweets/kaju_roll.jpg";
import kalakand from "../assets/sweets/kalakand.jpg";
import kheer from "../assets/sweets/kheer.jpg";
import ladoo from "../assets/sweets/ladoo.jpg";
import malpua from "../assets/sweets/malpua.jpg";
import milkCake from "../assets/sweets/milk_cake.jpg";
import modak from "../assets/sweets/modak.jpg";
import mysorePak from "../assets/sweets/mysore_pak.jpg";
import paneerBarfi from "../assets/sweets/paneer_barfi.jpg";
import peda from "../assets/sweets/peda.jpg";
import pistaLadoo from "../assets/sweets/pista_ladoo.jpg";
import rabri from "../assets/sweets/rabri.jpg";
import rasgulla from "../assets/sweets/rasgulla.jpg";
import rasmalai from "../assets/sweets/rasmalai.jpg";
import sandesh from "../assets/sweets/sandesh.jpg";
import shahiTukda from "../assets/sweets/shahi_tukda.jpg";
import soanPapdi from "../assets/sweets/soan_papdi.jpg";
import SweetCard from "../components/SweetCard";
import { CartContext } from "../context/cartContextValue";

const sweetImages = {
  barfi,
  basundi,
  "coconut barfi": coconutBarfi,
  "dry fruit halwa": dryFruitHalwa,
  "dry fruit ladoo": dryFruitLadoo,
  ghevar,
  "gulab jamun": gulabJamun,
  jalebi,
  "kaju apple sweet": kajuApple,
  "kaju katli": kajuKatli,
  "kaju roll": kajuRoll,
  kalakand,
  kheer,
  ladoo,
  malpua,
  "milk cake": milkCake,
  modak,
  "mysore pak": mysorePak,
  "paneer barfi": paneerBarfi,
  peda,
  "pista ladoo": pistaLadoo,
  rabri,
  rasgulla,
  rasmalai,
  sandesh,
  "shahi tukda": shahiTukda,
  "soan papdi": soanPapdi
};

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadSweets = async () => {
      try {
        setSweets(await getAllSweets());
      } catch (error) {
        console.error("Failed to load sweets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSweets();
  }, []);

  const categories = useMemo(() => {
    const unique = sweets.map((sweet) => sweet.category).filter(Boolean);
    return ["All", ...new Set(unique)];
  }, [sweets]);

  const filteredSweets = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = sweets.filter((sweet) => {
      const searchMatch =
        !query ||
        sweet.name?.toLowerCase().includes(query) ||
        sweet.category?.toLowerCase().includes(query);
      const categoryMatch = category === "All" || sweet.category === category;
      return searchMatch && categoryMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "rating") return Number(b.rating || 4.5) - Number(a.rating || 4.5);
      return Number(b.quantity || 0) - Number(a.quantity || 0);
    });
  }, [sweets, search, category, sort]);

  const inStockCount = sweets.filter((sweet) => Number(sweet.quantity || 0) > 0).length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  return (
    <div className="container section-block">
      <div className="shop-toolbar">
        <div>
          <p className="eyebrow">Online sweet counter</p>
          <h1>Shop Sweets</h1>
          <p className="text-muted mb-0">
            {sweets.length} products, {inStockCount} available for delivery today.
          </p>
        </div>
        <div className="toolbar-stats">
          <span>Free delivery above Rs 499</span>
          <span>Secure checkout</span>
        </div>
      </div>

      <div className="filters-bar">
        <input
          className="form-control"
          placeholder="Search sweets or categories"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select className="form-select" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Featured</option>
          <option value="rating">Top rated</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>

      {filteredSweets.length === 0 ? (
        <section className="empty-state">
          <h2>No sweets found</h2>
          <p className="text-muted">Try another search term or category.</p>
        </section>
      ) : (
        <div className="sweet-grid">
          {filteredSweets.map((sweet) => {
            const normalizedName = sweet.name?.toLowerCase().trim();
            return (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                image={sweetImages[normalizedName]}
                addToCart={addToCart}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Sweets;
