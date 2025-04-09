
import React, { useState } from "react";
import { MusicIcon, UserCircle, LogOut, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AdminPanel from "./AdminPanel";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleAdminPanelClick = () => {
    setShowAdminPanel(true);
  };

  return (
    <header className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MusicIcon size={36} className="text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Lyric Locker
          </h1>
        </div>
        
        <div>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full h-10 px-4 gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.displayName?.charAt(0) || user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.displayName || user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.displayName || user?.username}
                  {user?.isAdmin && (
                    <span className="ml-2 inline-block admin-badge">Admin</span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2" onClick={handleAdminPanelClick}>
                  <Shield size={16} />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLoginClick} className="gap-2">
              <User size={16} />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-3">
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-2">
          Create and share your song lyrics with the world. Add your own creative lyrics by clicking the + button.
          <span className="block mt-2 text-sm font-medium text-primary">Click on any card to view the full lyrics!</span>
        </p>
      </div>

      <LoginForm 
        isOpen={showLogin} 
        onOpenChange={setShowLogin} 
        onRegisterClick={handleRegisterClick} 
      />
      
      <RegisterForm 
        isOpen={showRegister} 
        onOpenChange={setShowRegister} 
        onLoginClick={handleLoginClick} 
      />
      
      <AdminPanel 
        isOpen={showAdminPanel} 
        onOpenChange={setShowAdminPanel} 
      />
    </header>
  );
};

export default Header;
