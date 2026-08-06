import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductDetailsDialog from "@/components/shopping-view/product-details";
import {fetchCartItems, addToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useLocation } from "react-router-dom";
import { title } from "framer-motion/client";






function createSearchParamsHelper(filterParams){
  const queryParams =[];

  for(const [key,value] of Object.entries(filterParams)){
    if(Array.isArray(value) && value.length > 0){
      const paramValue = value.join(',')

     queryParams.push(`${key}=${paramValue}`)
    }
  }

  return queryParams.join('&');

}

function ShoppingListing() {
  const {user} = useSelector(state => state.auth); 
  // for geting userId to add to cart
  const {cartItems} = useSelector((state)=>state.shopCart);
  const location = useLocation();

  const [sort, setSort] = useState();
  const [filters , setFilters] = useState({});
  const dispatch = useDispatch();
  const {productList , productDetails} = useSelector(state=> state.shopProducts);
  const[searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog , setOpenDetailsDialog] = useState(false);
  const {toast} = useToast();


  function handleFilter(getSectionId, getCurrentOptions){
  let cpyFilters = {...filters};
  const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

  if(indexOfCurrentSection === -1){
    cpyFilters = {
      ...cpyFilters,
      [getSectionId] : [getCurrentOptions]
    };
  } else {
    const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOptions);

    if(indexOfCurrentOption === -1){
      cpyFilters[getSectionId] = [...cpyFilters[getSectionId], getCurrentOptions];
    } else {
      cpyFilters[getSectionId] = cpyFilters[getSectionId].filter(
        (opt) => opt !== getCurrentOptions
      );
    }
  }
    
 
    setFilters(cpyFilters);
    sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId){
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId))
  }

 function handleAddToCart(getCurrentProductId , getTotalStock){

  console.log(cartItems ,'cartItems');
  let getCartItems = cartItems.items || [];

  if(getCartItems.length){
    const indexOfCurrentItem =  getCartItems.findIndex(item=> item.productId === getCurrentProductId);
    if(indexOfCurrentItem > -1){
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      if(getQuantity + 1 > getTotalStock){
        toast({
          title : `Only ${getQuantity} quantity can be added for this item`,
          variant : 'desructive'
        })

        return ;
      }
    }
  }

 
    dispatch(addToCart({ userId : user?.id , productId : getCurrentProductId, quantity : 1})).then(data=> {
      if(data?.payload?.success){
        dispatch(fetchCartItems({ userId: user?.id }));
        toast({
          title: "Product added to cart",
        })
      }
    });  
  }

  useEffect(()=>{
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});

  },[location.state?.fromMenu]);

  useEffect(()=>{
    if(filters && Object.keys(filters).length > 0){
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))
    }

  },[filters]);

  
 useEffect(() => {
  if(sort && filters !== null)
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }, [dispatch, sort, filters]);

    useEffect(()=>{
      if(productDetails !== null) setOpenDetailsDialog(true)

    },[productDetails]);

    console.log(productList , 'productList');

    

 

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 md:p-6">
      <ProductFilter filters={filters}  handleFilter={handleFilter}/>
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex  items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground ">{productList?.length} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-[200px] bg-white text-black">
                <DropdownMenuRadioGroup value={sort} onValueChange={(value)=> setSort(value)}>
                   {
                    sortOptions.map(sortItem => <DropdownMenuRadioItem 
                                                 key={sortItem.id} value={sortItem.id} >
                                                  {sortItem.label}
                                                 </DropdownMenuRadioItem>)
                   }
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
         </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {
            productList && productList.length > 0 ?
            productList.map(productItem => ( <ShoppingProductTile handleGetProductDetails={handleGetProductDetails}  key={productItem._id} product={productItem}
            handleAddToCart={handleAddToCart}
            
            />)): null
          }

        </div>
      </div>
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}/>
    </div>
  );
}

export default ShoppingListing;