import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useInterview } from '../../context/InterviewContext';
import {
  LogOut,
  User,
  Home,
  BarChart3,
  Code,
  MessageSquare,
  Menu,
  Settings,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const { user, logout } = useInterview();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Interview', href: '/interview', icon: MessageSquare },
    { name: 'DSA Practice', href: '/dsa', icon: Code },
  ];

  const isActive = (path) => location.pathname === path;

  const NavigationItems = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium 
              transition-all duration-200 group relative overflow-hidden
              ${mobile ? 'w-full justify-start' : ''}
              ${
                active
                  ? 'text-primary bg-primary/10 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            `}
          >
            <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
            <span className={mobile ? 'text-base' : ''}>{item.name}</span>
            {active && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg" />
            )}
          </Link>
        );
      })}
    </>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit text-xs">
              Premium Member
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
            <UserCircle className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center space-x-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center space-x-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-9 h-9 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Interview Prep
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Master Your Interviews
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationItems />
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">Welcome back,</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.name?.split(' ')[0]}
                  </p>
                </div>
                <UserMenu />
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
                  asChild
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-3 mt-6">
                  <NavigationItems mobile />
                  {!user && (
                    <div className="pt-4 border-t space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90" asChild>
                        <Link to="/register">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
