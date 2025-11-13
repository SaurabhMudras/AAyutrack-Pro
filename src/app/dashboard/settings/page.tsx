"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Settings</h1>
            </div>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Personal Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" defaultValue="Alex" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" defaultValue="Doe" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="alex.doe@example.com" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile</Label>
                                <Input id="mobile" type="tel" defaultValue="+1 (555) 123-4567" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" defaultValue="123 Wellness Ln, Healthville" />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of the app.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable dark mode for a different visual experience.
                                    </p>
                                </div>
                                <Switch
                                    id="dark-mode"
                                    checked={theme === 'dark'}
                                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                />
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Notifications</CardTitle>
                            <CardDescription>Manage how you receive alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Notification settings will be here.</p>
                             <Button>Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="emergency">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Emergency Contact</CardTitle>
                            <CardDescription>Manage who we should contact in an emergency.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="emergency-name">Contact Name</Label>
                                <Input id="emergency-name" defaultValue="Jane Doe" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="emergency-relation">Relationship</Label>
                                <Input id="emergency-relation" defaultValue="Spouse" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="emergency-phone">Contact Phone</Label>
                                <Input id="emergency-phone" type="tel" defaultValue="+1 (555) 987-6543" />
                            </div>
                             <Button>Save Emergency Contact</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
