import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  Package,
  Calendar,
  CircleDollarSign,
  Truck,
  User,
  MapPin,
  Phone,
  StickyNote,
  HousePlus,
  Pin,
  Check,
  ShoppingBag,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Order lifecycle used to drive the progress stepper.
// rejected/cancelled/failed are terminal states handled separately (no stepper).
const STEPS = ["pending", "processing", "shipped", "delivered"];

// Status → color mapping. Includes common typos/variants so styling
// doesn't silently fall back to gray if the backend value is inconsistent.
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800 ring-amber-600/30",
  panding: "bg-amber-100 text-amber-800 ring-amber-600/30", // typo guard
  processing: "bg-blue-100 text-blue-800 ring-blue-600/30",
  shipped: "bg-indigo-100 text-indigo-800 ring-indigo-600/30",
  confirmed: "bg-emerald-100 text-emerald-800 ring-emerald-600/30",
  delivered: "bg-emerald-100 text-emerald-800 ring-emerald-600/30",
  rejected: "bg-rose-100 text-rose-800 ring-rose-600/30",
  cancelled: "bg-rose-100 text-rose-800 ring-rose-600/30",
  failed: "bg-rose-100 text-rose-800 ring-rose-600/30",
  fail: "bg-rose-100 text-rose-800 ring-rose-600/30",
};

const STATUS_DOT = {
  pending: "bg-amber-500",
  panding: "bg-amber-500",
  processing: "bg-blue-500",
  shipped: "bg-indigo-500",
  confirmed: "bg-emerald-500",
  delivered: "bg-emerald-500",
  rejected: "bg-rose-500",
  cancelled: "bg-rose-500",
  failed: "bg-rose-500",
  fail: "bg-rose-500",
};

// Statuses treated as "terminal failure" for the progress stepper —
// shown as a standalone red state instead of forced into the timeline.
const FAILURE_STATUSES = ["rejected", "cancelled", "failed", "fail"];

function getStatusStyle(status) {
  const key = (status || "pending").toLowerCase();
  return STATUS_STYLES[key] || "bg-slate-100 text-slate-700 ring-slate-500/30";
}

function getStatusDot(status) {
  const key = (status || "pending").toLowerCase();
  return STATUS_DOT[key] || "bg-slate-400";
}

function formatCurrency(amount) {
  const value = Number(amount || 0);
  return `$${value.toFixed(2)}`;
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString.split("T")[0];
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Reusable badge — use this same component anywhere a status shows up
// (order details modal, order history table, admin dashboard, etc.)
function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${getStatusStyle(
        status
      )}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(status)}`} />
      {status || "pending"}
    </span>
  );
}

// Small stepper that turns the status into a visual timeline instead of
// a lone badge. Falls back to a red terminal state for failure statuses.
function OrderProgress({ status }) {
  const key = (status || "pending").toLowerCase();
  const normalizedKey = key === "panding" ? "pending" : key;
  const isTerminalFailure = FAILURE_STATUSES.includes(key);

  if (isTerminalFailure) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs">
          ✕
        </span>
        <span className="text-sm font-medium text-rose-700 capitalize">
          Order {key}
        </span>
      </div>
    );
  }

  // "confirmed" and "delivered" both read as the final step complete
  const effectiveKey = normalizedKey === "confirmed" ? "delivered" : normalizedKey;
  const currentIndex = Math.max(STEPS.indexOf(effectiveKey), 0);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.15 : 1,
                  backgroundColor: done || active ? "#4f46e5" : "#e2e8f0",
                }}
                transition={{ duration: 0.3 }}
                className="flex h-6 w-6 items-center justify-center rounded-full text-white shrink-0"
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : active ? (
                  <span className="h-2 w-2 rounded-full bg-white" />
                ) : null}
              </motion.div>
              <span
                className={`text-[10px] font-medium capitalize tracking-wide ${
                  done || active ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                initial={false}
                animate={{ backgroundColor: done ? "#4f46e5" : "#e2e8f0" }}
                transition={{ duration: 0.3 }}
                className="h-0.5 flex-1 -mt-4 mx-1"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ShoppingOrderDetailsView({ orderDetails }) {

  

  const [copied, setCopied] = useState(false);
  const items = orderDetails?.cartItems || [];
  const address = orderDetails?.addressInfo || {};
  const status = orderDetails?.orderStatus || "pending";
  const itemCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const handleCopyId = () => {
    if (!orderDetails?._id) return;
    navigator.clipboard?.writeText(orderDetails._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-white text-black p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
      <div className="max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="relative px-6 pt-7 pb-8 bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 border-b border-slate-200 overflow-hidden">
          {/* subtle decorative circles */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-white/10" />

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10"
          >
            <DialogTitle className="flex items-center gap-2.5 text-xl font-semibold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Package className="h-4.5 w-4.5 text-white" />
              </span>
              Order Details
            </DialogTitle>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleCopyId}
                className="group flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors px-3 py-1 text-xs font-mono text-white/90"
                title="Copy order ID"
              >
                {orderDetails?._id
                  ? `#${orderDetails._id.slice(-8).toUpperCase()}`
                  : "—"}
                <Copy className="h-3 w-3 opacity-70 group-hover:opacity-100" />
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] text-white/80"
                  >
                    Copied
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </DialogHeader>

        <motion.div
          className="grid gap-6 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Progress + summary card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wide">
                <Truck className="h-3.5 w-3.5" />
                Status
              </span>
              <motion.span
                key={status}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <OrderStatusBadge status={status} />
              </motion.span>
            </div>

            <div className="py-3">
              <OrderProgress status={status} />
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 shrink-0">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </span>
                <div>
                  <p className="text-[11px] text-slate-400">Order date</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(orderDetails?.orderDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 shrink-0">
                  <CircleDollarSign className="h-4 w-4 text-emerald-600" />
                </span>
                <div>
                  <p className="text-[11px] text-slate-400">Total amount</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(orderDetails?.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order items */}
          <motion.div variants={itemVariants} className="grid gap-3">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <ShoppingBag className="h-4 w-4 text-slate-400" />
                Order Items
              </h3>
              <span className="text-xs text-slate-400">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <ul className="grid gap-2">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <motion.li
                    key={item._id || index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 shrink-0">
                      <Package className="h-4.5 w-4.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {item.title || "Untitled product"}
                      </p>
                      {item.quantity ? (
                        <p className="text-xs text-slate-400">
                          Qty {item.quantity} · {formatCurrency(item.price || 0)} each
                        </p>
                      ) : null}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 shrink-0">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </motion.li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                  No items found for this order.
                </li>
              )}
            </ul>
          </motion.div>

          {/* Shipping info */}
          <motion.div variants={itemVariants} className="grid gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Shipping Info</h3>
            <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">
                  {address?.name || orderDetails?.userName || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{address.address || "—"}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <HousePlus className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{address.city || "—"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Pin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{address.pincode || "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{address.phone || "—"}</span>
              </div>
              <Separator />
              <div className="flex items-start gap-2.5">
                <StickyNote className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="italic text-slate-500">
                  {address.notes || "No notes"}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
export { OrderStatusBadge };