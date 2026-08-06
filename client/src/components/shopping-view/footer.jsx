import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HousePlug,
  Mail,
  Share2,
  MessageCircle,
  Send,
  ArrowUp,
  ArrowRight,
} from "lucide-react";

const CREAM = "#EDE7DA";
const CREAM_HOVER = "#DED2B4";

const shopLinks = [
  { label: "All Products", category: null },
  { label: "Men", category: "men" },
  { label: "Women", category: "women" },
  { label: "Kids", category: "kids" },
  { label: "Footwear", category: "footwear" },
  { label: "Accessories", category: "accessories" },
];

const supportLinks = [
  { label: "My Account", path: "/shop/account" },
  { label: "Search", path: "/shop/search" },
  { label: "Wishlist", path: "/shop/wishlist" },
];

const socials = [
  { label: "Instagram", icon: Share2 },
  { label: "Facebook", icon: MessageCircle },
  { label: "Twitter", icon: Send },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function FooterLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center text-xs text-neutral-400 hover:text-white transition-colors duration-300"
    >
      <span>{children}</span>
      <span
        className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: CREAM }}
      />
    </button>
  );
}

function ShoppingFooter() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowTopBtn(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleCategoryClick(categoryId) {
    sessionStorage.removeItem("filters");
    const currentFilter = categoryId ? { category: [categoryId] } : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  }

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }

  return (
    <footer className="relative w-full overflow-hidden bg-neutral-900 text-neutral-300">
      {/* NEWSLETTER BAND */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-5 flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="text-center lg:text-left">
            <h3 className="text-base font-serif font-semibold text-white">
              Join the <span style={{ color: CREAM }}>Loomé</span> inner circle
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Early drops, private sales & style edits, straight to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex items-center gap-2">
            <div className="flex items-center flex-1 lg:w-64 rounded-full border border-white/15 bg-white/5 px-3 focus-within:border-white/30 transition-colors duration-300">
              <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-xs px-2 py-2 outline-none text-white placeholder:text-neutral-500"
              />
            </div>
            <button
              type="submit"
              className="group flex items-center gap-1 rounded-full text-neutral-900 font-semibold text-xs px-4 py-2 transition-all duration-300 hover:gap-1.5 shrink-0"
              style={{ backgroundColor: CREAM }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = CREAM_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = CREAM)}
            >
              {subscribed ? "Subscribed!" : "Subscribe"}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </motion.div>

      {/* MAIN LINKS */}
      <div className="container mx-auto px-4 py-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-md bg-white flex items-center justify-center">
              <HousePlug className="h-3.5 w-3.5 text-neutral-900" />
            </div>
            <span className="font-serif font-semibold text-sm tracking-tight text-white">
              Loomé
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
            Curated fashion for men, women & kids, quality pieces, honest prices.
          </p>

          <div className="flex items-center gap-2 mt-3">
            {socials.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="group h-7 w-7 rounded-full border border-white/15 flex items-center justify-center text-neutral-400 transition-all duration-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = CREAM;
                  e.currentTarget.style.borderColor = CREAM;
                  e.currentTarget.style.color = "#171717";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "";
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h4 className="text-xs font-semibold text-white mb-2 tracking-wide">SHOP</h4>
          <ul className="space-y-1.5">
            {shopLinks.map((item) => (
              <li key={item.label}>
                <FooterLink onClick={() => handleCategoryClick(item.category)}>
                  {item.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h4 className="text-xs font-semibold text-white mb-2 tracking-wide">SUPPORT</h4>
          <ul className="space-y-1.5">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <FooterLink onClick={() => navigate(item.path)}>
                  {item.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h4 className="text-xs font-semibold text-white mb-2 tracking-wide">GET IN TOUCH</h4>
          <ul className="space-y-1.5 text-xs text-neutral-400">
            <li>support@Loomé.com</li>
            <li>+91 98765 43210</li>
            <li>Mon to Sat, 10am to 7pm</li>
          </ul>
        </motion.div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-[11px] text-neutral-500">
            (c) {new Date().getFullYear()} Loomé. All rights reserved.
          </p>
          <p className="text-[11px] text-neutral-500">
            Designed with <span style={{ color: CREAM }}>care</span> for people who love good clothes.
          </p>
        </div>
      </div>

      {/* BACK TO TOP */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          showTopBtn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }
        }
        transition={{ duration: 0.25 }}
        style={{
          pointerEvents: showTopBtn ? "auto" : "none",
          backgroundColor: CREAM,
        }}
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-40 h-9 w-9 rounded-full text-neutral-900 flex items-center justify-center shadow-md shadow-black/30 transition-colors duration-300"
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </footer>
  );
}

export default ShoppingFooter;
