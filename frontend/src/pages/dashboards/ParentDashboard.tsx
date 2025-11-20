import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, TrendingUp, MessageSquare, Calendar, AlertCircle, CheckCircle } from "lucide-react";

const ParentDashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("inzozi_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const childData = {
    name: "Uwase Marie",
    grade: "Grade 10",
    attendance: 95,
    overallPerformance: "Excellent"
  };

  const recentUpdates = [
    {
      date: "2025-01-20",
      type: "performance",
      message: "Mathematics test score: 88/100 - Very Good!",
      teacher: "Mr. Ntambara",
      icon: CheckCircle,
      color: "text-primary"
    },
    {
      date: "2025-01-18",
      type: "attendance",
      message: "Perfect attendance this week",
      teacher: "Class Teacher",
      icon: CheckCircle,
      color: "text-primary"
    },
    {
      date: "2025-01-15",
      type: "feedback",
      message: "Shows excellent participation in group discussions. Keep encouraging!",
      teacher: "Ms. Mukamana",
      icon: MessageSquare,
      color: "text-accent"
    },
    {
      date: "2025-01-10",
      type: "alert",
      message: "Physics assignment due next week - help with time management",
      teacher: "Mr. Habimana",
      icon: AlertCircle,
      color: "text-secondary"
    }
  ];

  const subjectPerformance = [
    { subject: "Mathematics", grade: "A-", progress: 88 },
    { subject: "Physics", grade: "B+", progress: 82 },
    { subject: "Chemistry", grade: "A", progress: 92 },
    { subject: "English", grade: "A-", progress: 85 },
    { subject: "Kinyarwanda", grade: "A", progress: 90 },
  ];

  const upcomingEvents = [
    { date: "Jan 25", event: "Parent-Teacher Conference", time: "2:00 PM" },
    { date: "Feb 1", event: "Mid-term Exams Begin", time: "All Day" },
    { date: "Feb 10", event: "Science Fair", time: "10:00 AM" },
  ];

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || "Parent"}!`}
      icon={<Users className="w-8 h-8" />}
    >
      <div className="space-y-6">
        {/* Child Overview */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{childData.name}'s Progress</span>
              <Badge variant="secondary">{childData.grade}</Badge>
            </CardTitle>
            <CardDescription>Overall performance and attendance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{childData.attendance}%</div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{childData.overallPerformance}</div>
                <p className="text-sm text-muted-foreground">Overall Performance</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5</div>
                <p className="text-sm text-muted-foreground">Active Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Recent Updates
              </CardTitle>
              <CardDescription>Latest messages and feedback from teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50">
                    <update.icon className={`w-5 h-5 ${update.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{update.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{update.teacher}</span>
                        <span>•</span>
                        <span>{new Date(update.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Important dates and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-primary/10 px-3 py-2 rounded text-center flex-shrink-0">
                      <p className="text-xs font-semibold text-primary">{event.date}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.event}</h4>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Subject Performance
            </CardTitle>
            <CardDescription>Detailed breakdown by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{subject.subject}</span>
                      <Badge variant="outline">{subject.grade}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle>Tips for Supporting Your Child</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Maintain regular communication with teachers through this platform</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Create a consistent study schedule and quiet space at home</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Encourage your child's interests and celebrate their achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Monitor attendance and ensure they don't miss important school days</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
