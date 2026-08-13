import { Routes, Route , Navigate } from "react-router-dom"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AuthLayout from "./components/auth/layout"

import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import AdminCoupons from "./pages/admin-view/coupons"
import AdminAnalytics from "./pages/admin-view/analytics"

import NotFound from  "./pages/not-found"
import ShoppingLayout from "./components/shopping-view/layout"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingAccount from "./pages/shopping-view/account"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import CheckAuth from "./components/common/check-auth"
import { useDispatch, useSelector } from "react-redux";  

import UnAuthPage from "./pages/unauth-page";
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import { Skeleton } from "@/components/ui/skeleton"
import PaypalRetrunPage from "./pages/shopping-view/paypal-return"
import PaymentSuccessPage from "./pages/shopping-view/payment-success"
import SearchProducts from "./pages/shopping-view/search"
import ShoppingWishlist from "./pages/shopping-view/wishlist"
function App() {
   
  const { isAuthenticated, user , isLoading} = useSelector((state) => state.auth);
  const dispatch= useDispatch();

  useEffect(()=>{
    const token = JSON.parse(sessionStorage.getItem('token'));
    dispatch(checkAuth(token));
  }, [dispatch]);

  if (isLoading) return (
    // <div className="flex items-center justify-center min-h-screen">
    //   <p className="text-lg font-medium">Loading...</p>
    // </div>
<Skeleton className="h-[600] w-[800] bg-black animate-pulse rounded-md" />
  );

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      
       <Routes>
        
       
        <Route path="/" element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <Navigate to="/shop/home" />
              </CheckAuth>
          } />
                  
        <Route path ="/auth"  element={
           <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout/>
           </CheckAuth>}>

           <Route path ="login" element={<AuthLogin/>} />
           <Route path ="register" element={<AuthRegister/>} />

        </Route>
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout/>
           </CheckAuth>}>

          <Route path="dashboard" element={<AdminDashboard/>}/>
          <Route path="features" element={<AdminFeatures/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="coupons" element={<AdminCoupons/>}/>
          <Route path="analytics" element={<AdminAnalytics/>}/>

        </Route>
     
       <Route path="/shop" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingLayout/>
           </CheckAuth>
       }>
          <Route path="home" element={<ShoppingHome/>}/>
          <Route path="listing" element={<ShoppingListing/>}/>
          <Route path="account" element={<ShoppingAccount/>}/>
          <Route path="checkout" element={<ShoppingCheckout/>}/>
          <Route path="paypal-return" element={<PaypalRetrunPage/>}/>
          <Route path="payment-success" element={<PaymentSuccessPage/>}/>
          <Route path="search" element={<SearchProducts/>}/>
          <Route path="wishlist" element={<ShoppingWishlist/>}/>

       </Route>
       
       <Route path="/unauth-page" element={<UnAuthPage/>}/>
       <Route path="*" element={<NotFound/>}/>

  </Routes>
    </div>
  );
}

export default App;


