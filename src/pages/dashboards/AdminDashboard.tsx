import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { Shield, Users, GraduationCap, BookOpen, Heart, TrendingUp, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    totalDonations: 0,
    activeCases: 0
  });
  const [roleDistribution, setRoleDistribution] = useState({
    students: { count: 0, percentage: "0" },
    teachers: { count: 0, percentage: "0" },
    admins: { count: 0, percentage: "0" }
  });
  const [atRiskStudents, setAtRiskStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const userStr = localStorage.getItem("inzozi_user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }

        const [stats, distribution, atRisk] = await Promise.all([
          apiClient.getAdminStats(),
          apiClient.getRoleDistribution(),
          apiClient.getAtRiskStudents()
        ]);

        setSystemStats(stats);
        setRoleDistribution(distribution);
        setAtRiskStudents(atRisk.students);
      } catch (error) {
        console.error("Error loading admin data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const recentActivity = [
    { type: "user", action: "New student registered", user: "Uwase Marie", time: "5 mins ago" },
    { type: "donation", action: "Donation received", user: "John Smith", amount: "25,000 RWF", time: "12 mins ago" },
    { type: "teacher", action: "Teacher feedback submitted", user: "Mr. Ntambara", time: "1 hour ago" },
    { type: "alert", action: "Student at-risk alert", user: "Ndahiro Patrick", time: "2 hours ago" },
  ];

  const usersByRole = [
    { role: "Students", count: roleDistribution.students.count, icon: GraduationCap, color: "text-primary", percentage: parseFloat(roleDistribution.students.percentage) },
    { role: "Teachers", count: roleDistribution.teachers.count, icon: BookOpen, color: "text-secondary", percentage: parseFloat(roleDistribution.teachers.percentage) },
    { role: "Admins", count: roleDistribution.admins.count, icon: Shield, color: "text-accent", percentage: parseFloat(roleDistribution.admins.percentage) },
  ];

  const performanceMetrics = [
    { metric: "Average Attendance", value: "88%", trend: "+3%", positive: true },
    { metric: "Student Engagement", value: "72%", trend: "+8%", positive: true },
    { metric: "Dropout Rate", value: "4.2%", trend: "-2.1%", positive: true },
    { metric: "Teacher Activity", value: "91%", trend: "+5%", positive: true },
  ];

  return (
    <DashboardLayout
      title={`Admin Dashboard - ${user?.name || "Administrator"}`}
      icon={<Shield className="w-8 h-8" />}
    >
      <div className="space-y-6">
        {/* System Overview */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{systemStats.totalUsers.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{(systemStats.totalDonations / 1000000).toFixed(1)}M <span className="text-sm">RWF</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{systemStats.activeCases}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="bg-primary">All Systems Operational</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Active users by role in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {usersByRole.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{item.count}</p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Key indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-2xl font-bold text-primary">{metric.value}</p>
                    </div>
                    <Badge variant={metric.positive ? "default" : "destructive"}>
                      {metric.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* At-Risk Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                At-Risk Students
              </CardTitle>
              <CardDescription>Students requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {atRiskStudents.map((student, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.grade}</p>
                      </div>
                      <Badge variant={student.severity === "high" ? "destructive" : "secondary"}>
                        {student.severity === "high" ? "High Risk" : "Medium Risk"}
                      </Badge>
                    </div>
                    <p className="text-sm">{student.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and events across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Activity</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-3 mt-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.user} {activity.amount && `- ${activity.amount}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="users" className="mt-4">
                <p className="text-center text-muted-foreground py-8">User activity filtered view</p>
              </TabsContent>
              <TabsContent value="donations" className="mt-4">
                <p className="text-center text-muted-foreground py-8">Donation activity filtered view</p>
              </TabsContent>
              <TabsContent value="alerts" className="mt-4">
                <p className="text-center text-muted-foreground py-8">Alert activity filtered view</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="w-12 h-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">System Health: Excellent</h3>
                <p className="text-muted-foreground mb-3">
                  All services are running smoothly. Database performance is optimal. No critical issues detected.
                </p>
                <div className="flex gap-4 text-sm">
                  <div><span className="font-semibold">Uptime:</span> 99.8%</div>
                  <div><span className="font-semibold">API Response:</span> 120ms avg</div>
                  <div><span className="font-semibold">Active Sessions:</span> 234</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
