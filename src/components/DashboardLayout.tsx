import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
  navigation?: Array<{
    label: string;
    onClick: () => void;
    active?: boolean;
  }>;
}

const DashboardLayout = ({ children, title, icon, navigation }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("inzozi_user");
    localStorage.removeItem("inzozi_token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const NavigationItems = () => (
    <>
      {navigation?.map((item, index) => (
        <Button
          key={index}
          variant={item.active ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={item.onClick}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            {navigation && navigation.length > 0 && (
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col gap-2 mt-8">
                    <NavigationItems />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            {/* Logo Image */}
            <img src="/inzozi-logo.png" alt="INZOZI Logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-primary">INZOZI</h1>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar Navigation */}
          {navigation && navigation.length > 0 && (
            <aside className="hidden lg:block w-64 space-y-2">
              <NavigationItems />
            </aside>
          )}
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
