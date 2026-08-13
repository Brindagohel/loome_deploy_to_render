import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  Menu, ShoppingCart, User, LogOut, Search, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutUser, resetTokenAddCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchWishlistItems } from "@/store/shop/wishlist-slice";
import logo from "../../assets/logo.png";



function MenuItems() {

  const navigate = useNavigate();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem('filters')
    const currentFilter = getCurrentMenuItem.id !== 'home'  && getCurrentMenuItem.id !== 'products'  && getCurrentMenuItem.id !== 'search' ?
      {
        category: [getCurrentMenuItem.id]
      } : null

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate(getCurrentMenuItem.path, { state: { fromMenu: Date.now() } });
  }

  return (
    <nav className="flex flex-col mb-3 lg:items-center gap-6 lg:flex-row lg:mb-0">
      {shoppingViewHeaderMenuItems
        .filter((menuItem) => menuItem.id !== "search") // ✅ remove "Search" text link from the nav
        .map((menuItem) => (
          <span
            onClick={() => handleNavigate(menuItem)}
            className="relative text-sm font-medium cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors
              after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:w-0 after:bg-amber-600 dark:after:bg-amber-400
              after:transition-all after:duration-300 hover:after:w-full"
            key={menuItem.id}
          >
            {menuItem.label}
          </span>
        ))}
    </nav>
  );
}

function HeaderRightContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector(state => state.shopCart);
  const { wishlistItems } = useSelector(state => state.shopWishlist);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const cartCount = cartItems?.items?.length || 0;
  const wishlistCount = wishlistItems?.items?.length || 0;

  function handleLogout() {
    dispatch(resetTokenAddCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems({ userId: user.id }));
      dispatch(fetchWishlistItems({ userId: user.id }));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-3">

      {/* ✅ New search icon button */}
      <Button
        onClick={() => navigate("/shop/search")}
        variant="outline"
        size="icon"
        className="rounded-full border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
      >
        <Search className="w-[18px] h-[18px]" />
        <span className="sr-only">Search products</span>
      </Button>

      <Button
        onClick={() => navigate("/shop/wishlist")}
        variant="outline"
        size="icon"
        className="relative rounded-full border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
      >
        <Heart className="w-[18px] h-[18px]" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 w-4 rounded-full bg-amber-600 text-[10px] font-semibold text-white">
            {wishlistCount}
          </span>
        )}
        <span className="sr-only">Wishlist</span>
      </Button>

      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative rounded-full border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
        >
          <ShoppingCart className="w-[18px] h-[18px]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 w-4 rounded-full bg-amber-600 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          )}
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper 
        setOpenCartSheet = {setOpenCartSheet}
        cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-neutral-900 dark:bg-neutral-100 cursor-pointer h-9 w-9 rounded-full flex items-center justify-center ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-amber-500 transition-all">
            <AvatarFallback className="text-white dark:text-neutral-900 font-semibold text-sm bg-transparent">
              {user?.UserName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-56 z-50 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg rounded-xl p-1"
        >
          <DropdownMenuLabel className="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-1.5">
            Logged in as <span className="font-semibold text-neutral-900 dark:text-white">{user?.UserName}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="rounded-lg cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800"
          >
            <User className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="rounded-lg cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/40"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/70 dark:border-neutral-800 bg-white/75 dark:bg-neutral-950/75 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Loomé logo"
            className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
          />

          <span className="font-serif font-semibold text-lg tracking-tight text-neutral-900 dark:text-white">
            Loomé
          </span>
        </Link>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden rounded-full">
              <Menu className="h-7 w-7" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white dark:bg-neutral-950 dark:border-neutral-800">
            <MenuItems />
            {isAuthenticated ? (
              <HeaderRightContent />
            ) : (
              <Button
                onClick={() => navigate("/auth/login")}
                className="rounded-full bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
              >
                Login
              </Button>
            )}
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {isAuthenticated ? (
          <div className="hidden lg:flex items-center gap-4">
            <HeaderRightContent />
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={() => navigate("/auth/login")}
              className="rounded-full bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default ShoppingHeader;