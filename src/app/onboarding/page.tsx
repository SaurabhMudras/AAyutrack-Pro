"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Onboarding Complete",
      description: "Welcome! Redirecting to your dashboard...",
    });
    // Simulate API call and redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-background">
      <Tabs defaultValue="personal" className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">Welcome to AAYUTRACK Pro</h1>
          </div>
          <p className="text-muted-foreground">Let's set up your health profile. Complete the steps below.</p>
          <TabsList className="grid w-full grid-cols-4 mt-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="professional">Doctors</TabsTrigger>
          </TabsList>
        </div>
        <form onSubmit={handleFinish}>
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Personal Information</CardTitle>
                <CardDescription>
                  Please provide your personal details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Wellness Lane" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Emergency Contact</CardTitle>
                <CardDescription>
                  Who should we contact in case of an emergency?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency-name">Full Name</Label>
                  <Input id="emergency-name" placeholder="Jane Doe" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-relation">Relationship</Label>
                    <Input id="emergency-relation" placeholder="Spouse" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone">Phone Number</Label>
                    <Input id="emergency-phone" placeholder="(555) 123-4567" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Medical History</CardTitle>
                <CardDescription>
                  Please provide a summary of your medical history.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea id="allergies" placeholder="e.g., Penicillin, Peanuts" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditions">Chronic Conditions</Label>
                  <Textarea id="conditions" placeholder="e.g., Hypertension, Diabetes Type 2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea id="medications" placeholder="e.g., Metformin 500mg, Lisinopril 10mg" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Doctors</CardTitle>
                <CardDescription>
                  Add your primary care physician or other specialists.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="doctor-name">Doctor's Full Name</Label>
                  <Input id="doctor-name" placeholder="Dr. Evelyn Reed" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialty">Specialty</Label>cv
                    <Input id="doctor-specialty" placeholder="Cardiologist" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Doctor's Email for Reports</Label>
                    <Input id="doctor-email" placeholder="e.reed@clinic.com" type="email" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <div className="flex justify-end mt-6">
            <Button type="submit" className="px-8 font-bold">Finish Setup</Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
