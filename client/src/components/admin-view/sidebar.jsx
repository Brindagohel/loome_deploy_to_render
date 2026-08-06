import { adminSidebarMenuItems } from "@/config";
import { UserStar } from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

function MenuItems({ onNavigate }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="mt-8 flex-col flex gap-2">
            {adminSidebarMenuItems.map(menuItem => {
                const isActive = location.pathname === menuItem.path;

                return (
                    <div
                        key={menuItem.id}
                        onClick={() => {
                            navigate(menuItem.path);
                            onNavigate?.();
                        }}
                        className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 w-full transition-colors duration-150
                            ${isActive
                                ? "bg-gray-800 text-white font-medium"   // ✅ dark active state — clearly visible
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                    >
                        <span className="flex-shrink-0">{menuItem.icons}</span>
                        <span className="text-sm font-medium">{menuItem.label}</span>
                    </div>
                );
            })}
        </nav>
    );
}
function AdminSideBar({ open, setOpen }) {
    const navigate = useNavigate();

    return (
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64 bg-white">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b">
                            <SheetTitle className="flex items-center gap-2"> {/* ✅ Bug 3 Fix: flex wrapper for icon + text alignment */}
                                <UserStar size={30} />
                                <span>Admin Panel</span> {/* ✅ Bug 4 Fix: consistent casing */}
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems onNavigate={() => setOpen(false)} /> {/* ✅ Bug 2 Fix: pass close handler */}
                    </div>
                </SheetContent>
            </Sheet>

            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div
                    onClick={() => navigate('/admin/dashboard')}
                    className="group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted"
                >
                    <UserStar size={30} className="text-muted-foreground group-hover:text-foreground" />
                    <h1 className="text-xl font-extrabold">
                        Admin Panel {/* ✅ Bug 4 Fix: consistent casing */}
                    </h1>
                </div>
                <MenuItems /> {/* No onNavigate needed for desktop sidebar */}
            </aside>
        </Fragment>
    );
}

export default AdminSideBar;