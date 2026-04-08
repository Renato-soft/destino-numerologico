import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardPromotionBanner } from "@/components/PromotionBanner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Map, MessageCircle, Calendar,
  User, Users, Target, Compass, ScrollText, LogOut, Home, Crown, Shield,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const ADMIN_EMAILS = ["regnew01@gmail.com", "maria732008@live.it", "realerenato@gmail.com"];

const menuItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Mappa Numerologica", icon: Map, href: "/map" },
  { title: "Chat con l'Esperto", icon: MessageCircle, href: "/chat" },
  { title: "Date Favorevoli", icon: Calendar, href: "/dates" },
  { title: "Anno Personale", icon: Calendar, href: "/personal-year" },
  { title: "Pilastri della Crescita", icon: Compass, href: "/pillars" },
  
  { title: "Analizzatore Brand", icon: Target, href: "/brand" },
  { title: "Vibrazione Casa", icon: Home, href: "/house" },
  { title: "Compatibilità", icon: Users, href: "/compatibility" },
  { title: "Community", icon: MessageCircle, href: "/community" },
  
];

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  headerActions?: ReactNode;
}

function AppSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="z-20 border-r border-border/50">
      <SidebarContent className="pt-4">
        {/* Logo */}
        <div className="px-4 pb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-sm font-semibold truncate">
              {t("common.appName")}
            </span>
          )}
        </div>

        {/* Services */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Servizi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      end={item.href === "/dashboard"}
                      className="flex items-center gap-2 hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/pricing" className="flex items-center gap-2 hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                    <Crown className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate text-sm">Piani e Prezzi</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/profile" className="flex items-center gap-2 hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                    <User className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate text-sm">{t("dashboard.profile")}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {userEmail && ADMIN_EMAILS.includes(userEmail) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin" className="flex items-center gap-2 hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <Shield className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate text-sm">{t("dashboard.controlPanel")}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-2 text-destructive hover:text-destructive">
                  <LogOut className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate text-sm">Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ children, title, headerActions }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <div className="fixed inset-0 numerology-pattern opacity-20 pointer-events-none z-0" />
        <div className="fixed inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none z-0" />

        <AppSidebar />

        <div className="flex-1 flex flex-col relative z-10">
          <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="shrink-0" />
                {title && (
                  <h1 className="font-display text-xl md:text-2xl font-bold">{title}</h1>
                )}
              </div>
              {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
            </div>
          </header>

          <DashboardPromotionBanner />

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
