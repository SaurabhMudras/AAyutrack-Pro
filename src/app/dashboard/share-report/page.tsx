"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDoctors } from "@/lib/data";
import { Download, Share2 } from "lucide-react";

export default function ShareReportPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Share Health Report</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Generate & Share</CardTitle>
                    <CardDescription>Create a health summary and share it securely.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Report Type</Label>
                        <Select defaultValue="weekly">
                            <SelectTrigger>
                                <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly Summary</SelectItem>
                                <SelectItem value="monthly">Monthly Deep Dive</SelectItem>
                                <SelectItem value="custom">Custom Date Range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Share with</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a doctor or add email" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockDoctors.map(doctor => (
                                    <SelectItem key={doctor.id} value={doctor.email || doctor.id}>{doctor.name} - {doctor.specialty}</SelectItem>
                                ))}
                                <SelectItem value="new">Add new email</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Or enter email address</Label>
                        <Input id="email" type="email" placeholder="doctor@example.com" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="auto-share" />
                        <label
                            htmlFor="auto-share"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                           Automatically share future monthly reports
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button className="w-full">
                            <Share2 className="mr-2 h-4 w-4" />
                            Generate & Share
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
