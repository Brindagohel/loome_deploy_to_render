import { logoutUser, resetTokenAddCredentials } from "@/store/auth-slice"; // add resetTokenAddCredentials here
import { TextAlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  function handleLogout() {
  //  dispatch(logoutUser());
  dispatch(resetTokenAddCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      {/* Sidebar toggle — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block"
      >
        <TextAlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </button>

      <div className="flex flex-1 justify-end">
        {/* ✅ fixed: calls handleLogout instead of setOpen */}
        <button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;