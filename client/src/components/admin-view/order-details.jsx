import { useState } from "react";
import { useDispatch } from "react-redux";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  getAllOrderForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
} from "@/store/admin/order-slice";
import { useToast } from "@/hooks/use-toast";


const STATUS_OPTIONS = [
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
];

function AdminOrderDetailsView({ orderDetails, onDeleteSuccess }) {
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus() {
    if (!status) {
      toast({ title: "Please select a status", variant: "destructive" });
      return;
    }

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrderForAdmin());
        setStatus("");
        toast({ title: "Order status updated successfully" });
      }
    });
  }

  function handleDeleteOrder() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order? This cannot be undone."
    );
    if (!confirmed) return;

    dispatch(deleteOrder(orderDetails?._id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrderForAdmin());
        toast({ title: "Order deleted successfully" });
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        toast({ title: "Failed to delete order", variant: "destructive" });
      }
    });
  }

  return (
    <DialogContent className="max-w-lg sm:max-w-xl">
      <VisuallyHidden>
        <DialogTitle>Order Details</DialogTitle>
      </VisuallyHidden>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order ID</p>
            <p className="font-mono text-sm">
              #{orderDetails?._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Date</p>
            <p>{orderDetails?.orderDate?.split("T")[0]}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Price</p>
            <p>${orderDetails?.totalAmount}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <p>{orderDetails?.paymentMethod}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <p className="capitalize">{orderDetails?.paymentStatus}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Status</p>
            <p className="capitalize">{orderDetails?.orderStatus}</p>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div className="grid gap-4">
          <div className="font-medium">Order Items</div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems?.map((item) => (
              <li key={item._id} className="flex justify-between text-sm">
                <span>{item.title}</span>
                <span>Qty: {item.quantity}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-slate-200" />

        <div className="grid gap-4">
          <div className="font-medium">Shipping Address</div>
          <div className="grid gap-1 text-sm text-muted-foreground">
            <span>{orderDetails?.addressInfo?.address}</span>
            <span>{orderDetails?.addressInfo?.city}</span>
            <span>{orderDetails?.addressInfo?.pincode}</span>
            <span>{orderDetails?.addressInfo?.phone}</span>
            <span>{orderDetails?.addressInfo?.notes}</span>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div className="grid gap-3">
          <Label>Update Order Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select a status
            </option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button onClick={handleUpdateStatus}>Update Status</Button>
        </div>

        <hr className="border-slate-200" />

        <div className="grid gap-3">
          <Button variant="destructive" onClick={handleDeleteOrder}>
            Delete Order
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;