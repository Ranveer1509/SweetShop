import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { placeOrder } from "../api/orderService";
import { CartContext } from "../context/cartContextValue";

const initialCheckout = {
  name: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
  paymentMethod: "UPI",
  upiId: "",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  notes: ""
};

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discount,
    tax,
    cartTotal
  } = useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState(initialCheckout);
  const navigate = useNavigate();

  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }, []);

  const updateCheckout = (field, value) => {
    setCheckout((prev) => ({ ...prev, [field]: value }));
  };

  const validateCheckout = () => {
    const required = ["name", "phone", "address", "city", "pincode"];
    const missing = required.find((field) => !checkout[field].trim());

    if (missing) {
      toast.warning("Please complete your delivery details");
      return false;
    }

    if (!/^\d{10}$/.test(checkout.phone.trim())) {
      toast.warning("Enter a valid 10 digit phone number");
      return false;
    }

    if (!/^\d{6}$/.test(checkout.pincode.trim())) {
      toast.warning("Enter a valid 6 digit pincode");
      return false;
    }

    if (checkout.paymentMethod === "UPI" && !checkout.upiId.trim()) {
      toast.warning("Enter your UPI ID");
      return false;
    }

    if (checkout.paymentMethod === "CARD") {
      const cardDigits = checkout.cardNumber.replace(/\s/g, "");
      if (cardDigits.length < 12 || !checkout.cardName.trim() || !checkout.cardExpiry.trim()) {
        toast.warning("Complete your card details");
        return false;
      }
    }

    return true;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }

    if (!validateCheckout() || loading) return;

    try {
      setLoading(true);
      await placeOrder(cartItems);
      clearCart(false);
      toast.success("Order placed successfully");
      navigate("/order-success");
    } catch (error) {
      console.error("Order failed:", error);
      const message =
        error?.response?.data?.message || error?.message || "Order failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="empty-state container">
        <p className="eyebrow">Cart</p>
        <h1>Your cart is empty</h1>
        <p className="text-muted">Add sweets to build your celebration box.</p>
        <Link className="btn btn-warning" to="/sweets">
          Browse Sweets
        </Link>
      </section>
    );
  }

  return (
    <div className="container section-block">
      <div className="section-heading">
        <p className="eyebrow">Checkout</p>
        <h1>Your Cart</h1>
      </div>

      <div className="checkout-layout">
        <section className="cart-list">
          {cartItems.map((item) => {
            const subtotal = Number(item.price || 0) * Number(item.quantity || 0);

            return (
              <article className="cart-item" key={item.id}>
                <img
                  src={item.imageUrl || "https://via.placeholder.com/120x90?text=Sweet"}
                  alt={item.name}
                  onError={(event) => {
                    event.target.src = "https://via.placeholder.com/120x90?text=Sweet";
                  }}
                />
                <div>
                  <h3>{item.name}</h3>
                  <p className="text-muted mb-1">{item.category || "Sweet Pack"}</p>
                  <strong>Rs {Number(item.price).toLocaleString()}</strong>
                </div>
                <div className="qty-control" aria-label={`Quantity for ${item.name}`}>
                  <button className="btn btn-outline-secondary" onClick={() => decreaseQty(item.id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-outline-secondary" onClick={() => increaseQty(item.id)}>
                    +
                  </button>
                </div>
                <div className="cart-item__total">
                  <strong>Rs {subtotal.toLocaleString()}</strong>
                  <button className="btn btn-link text-danger" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </article>
            );
          })}

          <section className="checkout-panel">
            <div className="section-heading">
              <p className="eyebrow">Delivery</p>
              <h2>Address and Contact</h2>
            </div>
            <div className="form-grid">
              <input
                className="form-control"
                placeholder="Full name"
                value={checkout.name}
                onChange={(event) => updateCheckout("name", event.target.value)}
              />
              <input
                className="form-control"
                placeholder="Phone number"
                value={checkout.phone}
                onChange={(event) => updateCheckout("phone", event.target.value)}
              />
              <textarea
                className="form-control form-grid__wide"
                placeholder="House number, street and area"
                rows="3"
                value={checkout.address}
                onChange={(event) => updateCheckout("address", event.target.value)}
              ></textarea>
              <input
                className="form-control"
                placeholder="City"
                value={checkout.city}
                onChange={(event) => updateCheckout("city", event.target.value)}
              />
              <input
                className="form-control"
                placeholder="Pincode"
                value={checkout.pincode}
                onChange={(event) => updateCheckout("pincode", event.target.value)}
              />
              <textarea
                className="form-control form-grid__wide"
                placeholder="Delivery notes, gifting message or preferred time"
                rows="2"
                value={checkout.notes}
                onChange={(event) => updateCheckout("notes", event.target.value)}
              ></textarea>
            </div>
          </section>

          <section className="checkout-panel">
            <div className="section-heading">
              <p className="eyebrow">Payment</p>
              <h2>Choose Payment Method</h2>
            </div>
            <div className="payment-methods">
              {["UPI", "CARD", "COD"].map((method) => (
                <label className="payment-option" key={method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={checkout.paymentMethod === method}
                    onChange={() => updateCheckout("paymentMethod", method)}
                  />
                  <span>
                    {method === "UPI" && "UPI"}
                    {method === "CARD" && "Credit / Debit Card"}
                    {method === "COD" && "Cash on Delivery"}
                  </span>
                </label>
              ))}
            </div>

            {checkout.paymentMethod === "UPI" && (
              <input
                className="form-control mt-3"
                placeholder="name@upi"
                value={checkout.upiId}
                onChange={(event) => updateCheckout("upiId", event.target.value)}
              />
            )}

            {checkout.paymentMethod === "CARD" && (
              <div className="form-grid mt-3">
                <input
                  className="form-control form-grid__wide"
                  placeholder="Card number"
                  value={checkout.cardNumber}
                  onChange={(event) => updateCheckout("cardNumber", event.target.value)}
                />
                <input
                  className="form-control"
                  placeholder="Name on card"
                  value={checkout.cardName}
                  onChange={(event) => updateCheckout("cardName", event.target.value)}
                />
                <input
                  className="form-control"
                  placeholder="MM/YY"
                  value={checkout.cardExpiry}
                  onChange={(event) => updateCheckout("cardExpiry", event.target.value)}
                />
              </div>
            )}
          </section>
        </section>

        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>Rs {cartSubtotal.toLocaleString()}</strong>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <strong>- Rs {discount.toLocaleString()}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>{deliveryFee === 0 ? "Free" : `Rs ${deliveryFee}`}</strong>
          </div>
          <div className="summary-row">
            <span>GST estimate</span>
            <strong>Rs {tax.toLocaleString()}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>Rs {cartTotal.toLocaleString()}</strong>
          </div>
          <p className="summary-note">Estimated delivery: {estimatedDelivery}</p>
          <button className="btn btn-success btn-lg w-100" disabled={loading} onClick={handleCheckout}>
            {loading ? "Processing..." : `Pay Rs ${cartTotal.toLocaleString()}`}
          </button>
          <Link className="btn btn-outline-dark w-100 mt-2" to="/sweets">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
