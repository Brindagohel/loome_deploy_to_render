import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react" // adjust path/name to match your actual slice
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItems } from "@/store/shop/cart-slice"; // adjust path/name to match your actual slice
import { useToast } from "@/hooks/use-toast";
import { updateCartQuantity } from "@/store/shop/cart-slice"; // adjust path/name to match your actual slice

function UserCartItemsContent({ cartItem, onUpdateQuantity, onDelete }) {

    const { user } = useSelector(state => state.auth); // for getting userId to add to cart
    const {cartItems} = useSelector((state)=>state.shopCart);
     const {productList} = useSelector(state=> state.shopProducts);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function onUpdateQuantity(getCartItem , typeOfAction){
        if(typeOfAction == 'increase'){
             let getCartItems = cartItems.items || [];

  if(getCartItems.length){
    const indexOfCurrentCartItem =  getCartItems.findIndex(item=> item.productId === getCartItem?.productId);

    const getCurrentProductIndex = productList.findIndex(product=> product._id == getCartItem?.productId);

    const getTotalStock = productList[getCurrentProductIndex].totalStock

    if(indexOfCurrentCartItem > -1){
      const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
      if(getQuantity + 1 > getTotalStock){
        toast({
          title : `Only ${getQuantity} quantity can be added for this item`,
          variant : 'desructive'
        })

        return ;
      }
    }
  }
        }
        dispatch(updateCartQuantity({userId: user?.id, productId: getCartItem?.productId, quantity: typeOfAction === "increase" ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1

        })).then(data=>{
            if(data?.payload?.success){
              toast({ title: "Cart updated successfully" });
            }
        })}



    function handleCartItemDelete(getCartItem) {
        dispatch(
            deleteCartItems({ userId: user?.id, productId: getCartItem?.productId })
        ).then(data=>{
            if(data?.payload?.success){
                toast({ title: "Cart deleted successfully" });
            }
        })}

    
       

      
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <img
                src={cartItem?.image}
                alt={cartItem?.title}
                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                    {cartItem?.title}
                </h3>

                <div className="flex items-center gap-3 mt-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={cartItem?.quantity <= 1}
                        onClick={() => onUpdateQuantity?.(cartItem, "decrease")}
                        className="h-8 w-8 p-0 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease quantity</span>
                    </Button>

                    <span className="text-gray-800 font-medium w-6 text-center">
                        {cartItem?.quantity}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onUpdateQuantity?.(cartItem, "increase")}
                        className="h-8 w-8 p-0 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Increase quantity</span>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-20">
                <p className="font-semibold text-gray-900">
                    ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * (cartItem?.quantity ?? 1)).toFixed(2)}
                </p>
                <Trash2
                    onClick={() => handleCartItemDelete(cartItem)}
                    className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                />
            </div>
        </div>
    );
}

export default UserCartItemsContent;