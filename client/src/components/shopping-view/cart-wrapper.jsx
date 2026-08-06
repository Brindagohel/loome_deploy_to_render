import {SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import {  useNavigate } from "react-router-dom";




function UserCartWrapper( { cartItems , setOpenCartSheet }){

    const navigate = useNavigate();

    const totalCartAmount = cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, item) =>
          sum + (item?.salePrice > 0 ? item.salePrice : item.price) * item.quantity, 0)
      : 0;
      
    return(
        <SheetContent className="w-full sm:w-[400px] bg-white text-black">
           <SheetHeader>
            <SheetTitle>
                    Your Cart
            </SheetTitle>
        
           </SheetHeader>
                
                
                <div className="mt-8 space-y-4">
                     {cartItems && cartItems.length > 0
                        ? cartItems.map((item) => (
                        <UserCartItemsContent key={item.productId} cartItem={item} />
                         ))
                        : <p className="text-muted-foreground">Your cart is empty</p>}
                </div>


           
           <div className = "mt-8 space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">${totalCartAmount.toFixed(2)}</span>
            </div>
           </div>
           <Button onClick={()=>{ navigate('/shop/checkout');
                                  setOpenCartSheet(false);
           }} className="w-full mt-4 bg-black text-white hover:bg-gray-800">
            Checkout
           </Button>
       
        </SheetContent>
     
    );
}

export default UserCartWrapper;