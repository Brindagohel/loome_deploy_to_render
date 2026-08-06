import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUser, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";

// Same status language as order-details.jsx — pending=amber, processing=blue,
// shipped=indigo, confirmed/delivered=emerald, rejected/cancelled/failed=rose.
const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  panding: "bg-amber-50 text-amber-700 ring-amber-600/20",
  processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
  failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
  fail: "bg-rose-50 text-rose-700 ring-rose-600/20",
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

function getStatusStyle(status) {
  const key = (status || "pending").toLowerCase();
  return STATUS_STYLES[key] || "bg-slate-100 text-slate-600 ring-slate-500/20";
}

function getStatusDot(status) {
  const key = (status || "pending").toLowerCase();
  return STATUS_DOT[key] || "bg-slate-400";
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

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (orderDetails != null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  useEffect(() => {
    dispatch(getAllOrdersByUser(user?.id));
  }, [dispatch]);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-5">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
            <ShoppingBag className="h-4.5 w-4.5 text-indigo-600" />
          </span>
          Order History
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {orderList && orderList.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            {/* Column header row — hidden on mobile, shown from sm up */}
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-4 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
              <span>Order ID</span>
              <span>Date</span>
              <span>Status</span>
              <span>Price</span>
              <span className="text-right">Details</span>
            </div>

            <div className="divide-y divide-slate-100">
              {orderList.map((orderItem) => (
                <div
                  key={orderItem._id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] sm:items-center sm:gap-4"
                >
                  {/* Order ID */}
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                      <Package className="h-4 w-4" />
                    </span>
                    <span className="truncate font-mono text-sm font-medium text-slate-900">
                      #{orderItem?._id?.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  {/* Date */}
                  <span className="text-sm text-slate-500">
                    {formatDate(orderItem?.orderDate)}
                  </span>

                  {/* Status */}
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset capitalize ${getStatusStyle(
                      orderItem?.orderStatus
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                        orderItem?.orderStatus
                      )}`}
                    />
                    {orderItem?.orderStatus || "pending"}
                  </span>

                  {/* Price */}
                  <span className="text-sm font-semibold text-slate-900">
                    ${orderItem?.totalAmount}
                  </span>

                  {/* Details */}
                  <Dialog
                    open={openDetailsDialog}
                    onOpenChange={() => {
                      setOpenDetailsDialog(false);
                      dispatch(resetOrderDetails());
                    }}
                  >
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      variant="outline"
                      size="sm"
                      className="w-full justify-center gap-1.5 rounded-full border-slate-200 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
                    >
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    <ShoppingOrderDetailsView orderDetails={orderDetails} />
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <ShoppingBag className="h-5 w-5 text-slate-300" />
            </span>
            <p className="text-sm font-medium text-slate-500">No orders yet</p>
            <p className="text-xs text-slate-400">
              Your order history will show up here once you place one.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;