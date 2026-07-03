"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure company and attendance settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave policy</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <Card className="p-6 space-y-5">
            <div>
              <Label>Company name</Label>
              <Input defaultValue="TechFlow Solutions" className="mt-1.5 max-w-md" />
            </div>
            <div>
              <Label>Office address</Label>
              <Input
                defaultValue="42, Anna Salai, Chennai 600002"
                className="mt-1.5 max-w-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label>Time zone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST (UTC-5)</SelectItem>
                    <SelectItem value="pst">PST (UTC-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date format</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div>
              <Label>Working days</Label>
              <div className="flex gap-2 mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <button
                      key={day}
                      className={`w-10 h-10 rounded-lg text-xs font-medium border transition-colors ${
                        ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {day}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="pt-2">
              <Button className="bg-primary hover:bg-teal-600 text-primary-foreground">
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label>Shift start</Label>
                <Input type="time" defaultValue="09:00" className="mt-1.5" />
              </div>
              <div>
                <Label>Shift end</Label>
                <Input type="time" defaultValue="18:00" className="mt-1.5" />
              </div>
            </div>
            <div className="max-w-md">
              <Label>Grace period (minutes)</Label>
              <Input
                type="number"
                defaultValue="15"
                className="mt-1.5 w-24"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Employees arriving within this window won&apos;t be marked late
              </p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Break settings</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <Label>Tea break (min)</Label>
                  <Input type="number" defaultValue="15" className="mt-1.5" />
                </div>
                <div>
                  <Label>Lunch break (min)</Label>
                  <Input type="number" defaultValue="45" className="mt-1.5" />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Features</h3>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">GPS tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Record location when marking attendance
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Auto checkout</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically checkout at shift end
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Overtime tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Track hours beyond shift end
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="pt-2">
              <Button className="bg-primary hover:bg-teal-600 text-primary-foreground">
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-medium">Annual leave allocation</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label>Casual leave</Label>
                <Input type="number" defaultValue="12" className="mt-1.5" />
              </div>
              <div>
                <Label>Sick leave</Label>
                <Input type="number" defaultValue="10" className="mt-1.5" />
              </div>
              <div>
                <Label>Earned leave</Label>
                <Input type="number" defaultValue="15" className="mt-1.5" />
              </div>
              <div>
                <Label>Paid leave</Label>
                <Input type="number" defaultValue="10" className="mt-1.5" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Permission settings</h3>
              <div className="max-w-md">
                <Label>Monthly permission limit (hours)</Label>
                <Input type="number" defaultValue="4" className="mt-1.5 w-24" />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">Carry forward unused leave</p>
                  <p className="text-xs text-muted-foreground">
                    Allow carrying unused leave to next year
                  </p>
                </div>
                <Switch />
              </div>
            </div>
            <div className="pt-2">
              <Button className="bg-primary hover:bg-teal-600 text-primary-foreground">
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="mt-4">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-3">
                Office network validation
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Employees can only mark attendance when connected to registered
                office networks
              </p>
              <div className="space-y-3 max-w-md">
                <div>
                  <Label>Office public IP</Label>
                  <Input
                    defaultValue="203.0.113.42"
                    className="mt-1.5 font-mono"
                  />
                </div>
                <div>
                  <Label>Office WiFi SSID</Label>
                  <Input
                    defaultValue="TechFlow-Office"
                    className="mt-1.5 font-mono"
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Validation methods</h3>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">IP address validation</p>
                  <p className="text-xs text-muted-foreground">
                    Match employee IP against office IP
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">WiFi SSID validation</p>
                  <p className="text-xs text-muted-foreground">
                    Check connected WiFi network name
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">GPS location validation</p>
                  <p className="text-xs text-muted-foreground">
                    Verify employee is within office radius
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between max-w-md">
                <div>
                  <p className="text-sm">VPN detection</p>
                  <p className="text-xs text-muted-foreground">
                    Block attendance when using a VPN
                  </p>
                </div>
                <Switch />
              </div>
            </div>
            <div className="pt-2">
              <Button className="bg-primary hover:bg-teal-600 text-primary-foreground">
                Save changes
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
