"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@/firebase";
import { initiateEmailSignIn } from "@/firebase/non-blocking-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Logo from "@/components/icons/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState("patient@aayutrack.com");
  const [password, setPassword] = useState("password");

  const loginImage = PlaceHolderImages.find(image => image.id === "login-hero");

  useEffect(() => {
    if (!isUserLoading && user) {
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router, toast]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    initiateEmailSignIn(auth, email, password);
  };

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="flex justify-center items-center gap-2 mb-4">
               <Logo className="h-8 w-8 text-primary" />
               <h1 className="text-3xl font-bold font-headline text-primary">AAYUTRACK Pro</h1>
             </div>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your health dashboard
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">RBMP ID / Email / Mobile</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isUserLoading}>
              {isUserLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginImage && (
             <Image
             src={loginImage.imageUrl}
             alt={loginImage.description}
             fill
             className="object-cover"
             data-ai-hint={loginImage.imageHint}
           />
        )}
         <div className="absolute bottom-8 left-8 right-8">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-primary">Monitor. Motivate. Modernize.</CardTitle>
              <CardDescription>
                AAYUTRACK Pro transforms how you manage your health, providing intelligent insights and keeping you connected to your care team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                &quot;Using this platform has been a game-changer for my daily health routine. The AI checkups are incredibly insightful!&quot; - A. Sharma
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
