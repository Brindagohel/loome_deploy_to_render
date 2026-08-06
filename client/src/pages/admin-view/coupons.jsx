import React, { Fragment, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { couponFormControls } from '@/config';
import CommonForm from '@/components/common/form';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllCoupons, addNewCoupon, editCoupon, deleteCoupon } from '@/store/admin/coupon-slice';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Pencil, Plus } from 'lucide-react';

const initialFormData = {
  code: '',
  discountType: '',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  expiryDate: '',
  usageLimit: '',
};

function AdminCoupons() {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { couponList } = useSelector((state) => state.adminCoupon);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  function onSubmit(event) {
    event.preventDefault();

    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
      maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
    };

    if (currentEditedId !== null) {
      dispatch(editCoupon({ id: currentEditedId, formData: payload })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllCoupons());
          closeDialog();
          toast({ title: 'Coupon updated successfully' });
        } else {
          toast({ title: data?.payload?.message || 'Failed to update coupon', variant: 'destructive' });
        }
      });
    } else {
      dispatch(addNewCoupon(payload)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllCoupons());
          closeDialog();
          toast({ title: 'Coupon created successfully' });
        } else {
          toast({ title: data?.payload?.message || 'Failed to create coupon', variant: 'destructive' });
        }
      });
    }
  }

  function handleEdit(coupon) {
    setCurrentEditedId(coupon._id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      expiryDate: coupon.expiryDate?.slice(0, 10),
      usageLimit: coupon.usageLimit || '',
    });
    setOpenDialog(true);
  }

  function handleDelete(id) {
    dispatch(deleteCoupon(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCoupons());
        toast({ title: 'Coupon deleted successfully' });
      } else {
        toast({ title: 'Failed to delete coupon', variant: 'destructive' });
      }
    });
  }

  function closeDialog() {
    setOpenDialog(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
  }

  function isExpired(coupon) {
    return new Date(coupon.expiryDate) < new Date();
  }

  return (
    <Fragment>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Coupons</h1>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min Order</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couponList && couponList.length > 0 ? (
              couponList.map((coupon) => (
                <tr key={coupon._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{coupon.code}</td>
                  <td className="px-4 py-3">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%${coupon.maxDiscountAmount ? ` (max $${coupon.maxDiscountAmount})` : ''}`
                      : `$${coupon.discountValue}`}
                  </td>
                  <td className="px-4 py-3">${coupon.minOrderAmount || 0}</td>
                  <td className="px-4 py-3">
                    {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {!coupon.isActive ? (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">Disabled</span>
                    ) : isExpired(coupon) ? (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-600">Expired</span>
                    ) : (
                      <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Pencil
                        className="h-4 w-4 cursor-pointer text-slate-500 hover:text-slate-900"
                        onClick={() => handleEdit(coupon)}
                      />
                      <Trash2
                        className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(coupon._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No coupons yet. Create one to offer discounts at checkout.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Sheet open={openDialog} onOpenChange={(open) => (open ? setOpenDialog(true) : closeDialog())}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? 'Edit Coupon' : 'Add New Coupon'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <CommonForm
              formControls={couponFormControls}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={currentEditedId !== null ? 'Update Coupon' : 'Create Coupon'}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminCoupons;
