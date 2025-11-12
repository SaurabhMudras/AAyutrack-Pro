import Link from "next/link";
import {
  Bell,
  Bot,
  Flame,
  Home,
  LayoutDashboard,
  LineChart,
  Package,
  Package2,
  Settings,
  Share2,
  Siren,
  Users,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/icons/logo";
import AppHeader from "@/components/layout/app-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-headline text-primary text-xl">AAYUTRACK Pro</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/progress"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Progress
              </Link>
              <Link
                href="/dashboard/ai-checkup"
                className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Bot className="h-4 w-4" />
                AI Checkup{" "}
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </Badge>
              </Link>
              <Link
                href="/dashboard/streaks"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Flame className="h-4 w-4" />
                Streaks
              </Link>
              <Link
                href="/dashboard/share-report"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Share2 className="h-4 w-4" />
                Share Report
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle className="font-headline">Telemedicine</CardTitle>
                <CardDescription>
                  Access remote consultations with your trusted doctors.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Link href="/dashboard/telemedicine">
                    <Button size="sm" className="w-full">
                        <Video className="mr-2 h-4 w-4"/>
                        Start a Call
                    </Button>
                </Link>
              </CardContent>
            </Card>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
                <Link
                    href="/dashboard/emergency"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-all hover:font-bold"
                >
                    <Siren className="h-4 w-4" />
                    Emergency
                </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
