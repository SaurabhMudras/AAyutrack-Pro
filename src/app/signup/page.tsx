"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (!isUserLoading && user) {
      toast({
        title: "Account Created",
        description: "Redirecting to onboarding...",
      });
      router.push("/onboarding");
    }
    if (userError) {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: userError.message,
        });
    }
  }, [user, isUserLoading, userError, router, toast]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    initiateEmailSignUp(auth, email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">AAYUTRACK Pro</h1>
          </div>
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isUserLoading}>
              {isUserLoading ? 'Creating account...' : 'Create an account'}
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline font-semibold">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
