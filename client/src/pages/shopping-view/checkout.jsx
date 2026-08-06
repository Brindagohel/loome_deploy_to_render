import Address from '@/components/shopping-view/address';
import img from '../../assets/account/back5.png';
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { applyCoupon, clearCoupon } from '@/store/shop/coupon-slice';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  console.log(user, 'user from auth');
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { appliedCoupon, isLoading: isCouponLoading } = useSelector((state) => state.shopCoupon);
  const [currentSelectedAddress, setcurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentSelectedAddress, 'currentSelectedAddress');
  }, [currentSelectedAddress]);

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum + (item?.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
          0
        )
      : 0;

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotal = Number((totalCartAmount - discountAmount).toFixed(2));

  function handleApplyCoupon() {
    if (!couponInput.trim()) {
      toast({ title: 'Enter a coupon code first', variant: 'destructive' });
      return;
    }

    dispatch(applyCoupon({ code: couponInput.trim(), cartTotal: totalCartAmount })).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `Coupon applied — you saved $${data.payload.data.discountAmount}` });
      } else {
        toast({ title: data?.payload?.message || 'Invalid coupon code', variant: 'destructive' });
      }
    });
  }

  function handleRemoveCoupon() {
    dispatch(clearCoupon());
    setCouponInput('');
  }

  function handleInitiatePaypalPayment() {
    // BUG FIX: cartItems is an object ({ items: [...] }), not an array.
    // `cartItems.length` is always undefined, so this check never fired.
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: 'Your cart is empty. Please add items to proceed.',
        variant: 'destructive',
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: 'Please select one address to proceed.',
        variant: 'destructive',
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      userName: user?.UserName,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      totalAmount: finalTotal,
      couponCode: appliedCoupon?.code || '',
      discountAmount: discountAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: '',
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("SENDING ORDER:", orderData);
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0B0713]">
      {/* HERO */}
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[340px]">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-10">
          <span className="inline-block rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0B0713] backdrop-blur-sm">
            almost there ✦
          </span>
          <h1 className="mt-3 text-3xl font-black leading-none tracking-tight text-[#0B0713] drop-shadow-sm sm:text-5xl">
            Secure the{' '}
            <span className="bg-gradient-to-r from-[#060606] to-[#0c0c0c] bg-clip-text text-transparent">
              bag
            </span>
          </h1>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:gap-8 sm:p-10">
        {/* ADDRESS PANEL */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 rounded-3xl border border-black/10 bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
          <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-[#0B0713]">
            Drop it off here <span className="text-[#060606]">📍</span>
          </h2>
          <Address
            setcurrentSelectedAddress={setcurrentSelectedAddress}
            currentSelectedAddress={currentSelectedAddress}
          />
        </div>

        {/* CART + PAYMENT PANEL */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="rounded-3xl border border-black/10 bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-[#0B0713]">
              Your cart <span className="text-[#090a08]">✦</span>
            </h2>

            <div className="flex flex-col gap-3">
              {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                cartItems.items.map((item, idx) => (
                  <div
                    key={item.productId}
                    className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-black/5 bg-white p-1 transition-colors duration-300 hover:border-[#7BBE00]/40"
                    style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'backwards' }}
                  >
                    <UserCartItemsContent cartItem={item} />
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-black/15 p-6 text-center text-sm text-gray-500">
                  Nothing here yet — go find something you love.
                </p>
              )}
            </div>
          </div>

          {/* COUPON */}
          <div className="rounded-3xl border border-black/10 bg-gray-50 p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-gray-500">
              Have a coupon?
            </h2>
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-green-700">{appliedCoupon.code} applied</p>
                  <p className="text-xs text-green-600">You saved ${appliedCoupon.discountAmount}</p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-semibold uppercase text-green-700 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="rounded-xl"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isCouponLoading}
                  className="rounded-xl bg-black text-white"
                >
                  {isCouponLoading ? 'Checking...' : 'Apply'}
                </Button>
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${totalCartAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm text-green-600">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-2">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Total due
              </span>
              <span className="bg-gradient-to-r from-[#0b0b0b] to-[#131113] bg-clip-text text-3xl font-black text-transparent">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleInitiatePaypalPayment}
            disabled={isPaymentStart}
            className="w-full rounded-2xl bg-gradient-to-r from-[#090909] to-[#010101] py-6 text-base font-black uppercase tracking-wide text-white shadow-md transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
          >
            {isPaymentStart ? 'Processing your paypal payment…' : 'Checkout with PayPal →'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;