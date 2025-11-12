import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Award, Users, Trophy, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

const TeacherDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [performanceRating, setPerformanceRating] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const [profileData, studentsData] = await Promise.all([
          apiClient.getTeacherProfile(),
          apiClient.getStudents()
        ]);
        
        setUser(profileData.user);
        setProfile(profileData.profile);
        setStudents(studentsData.students);
      } catch (error) {
        console.error("Error loading teacher data:", error);
        toast.error("Failed to load profile data");
        // Fallback to localStorage
        const userStr = localStorage.getItem("inzozi_user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
  }, []);


  const achievements = [
    { title: "Early Adopter", description: "First 100 teachers to join", icon: Trophy, color: "text-secondary" },
    { title: "Feedback Champion", description: "Provided 50+ student feedbacks", icon: Star, color: "text-primary" },
    { title: "Consistent Performer", description: "Active for 3 months straight", icon: Award, color: "text-accent" },
  ];

  const tasks = [
    { title: "Submit Weekly Attendance", points: 20, status: "pending" },
    { title: "Provide Student Feedback", points: 30, status: "pending" },
    { title: "Complete Professional Development Module", points: 50, status: "completed" },
    { title: "Participate in Peer Review", points: 40, status: "pending" },
  ];

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !feedback || !performanceRating) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const selectedStudentData = students.find(s => s.id === selectedStudent);
      const response = await apiClient.submitFeedback({
        studentName: selectedStudentData?.name || selectedStudent,
        performance: performanceRating as 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement',
        feedback
      });

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          points: response.newPoints,
          level: response.newLevel
        });
      }

      toast.success(`Feedback submitted! You earned ${response.pointsEarned} points!`);
      
      // Reset form
      setSelectedStudent("");
      setFeedback("");
      setPerformanceRating("");

      // Reload profile to get updated data
      const profileData = await apiClient.getTeacherProfile();
      setProfile(profileData.profile);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const points = profile?.points || 0;
  const level = profile?.level || 1;
  const progressToNextLevel = ((points % 500) / 500) * 100;

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || "Teacher"}!`}
      icon={<BookOpen className="w-8 h-8" />}
    >
      <div className="space-y-6">
        {/* Gamification Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                Your Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">Level {level}</span>
                  <span className="text-muted-foreground">Educator</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {level + 1}</span>
                    <span className="font-semibold">{points % 500}/500 pts</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${progressToNextLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-secondary" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{points}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Rank: Top 15% of educators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                My Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{students.length}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Active students this semester
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        {profile?.achievements && profile.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-secondary" />
                Your Achievements
              </CardTitle>
              <CardDescription>Badges you've earned through your dedication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {profile.achievements.map((achievement: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                    <Award className="w-8 h-8 text-secondary" />
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {(!profile?.achievements || profile.achievements.length === 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-secondary" />
                Your Achievements
              </CardTitle>
              <CardDescription>Badges you've earned through your dedication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                    <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Student Feedback</CardTitle>
              <CardDescription>Provide feedback and earn 30 points</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger id="student">
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Performance Rating</Label>
                  <Select value={performanceRating} onValueChange={setPerformanceRating}>
                    <SelectTrigger id="rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="very-good">Very Good</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide constructive feedback for the student and their parents..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Feedback (+30 pts)
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tasks and Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Active Tasks & Challenges
              </CardTitle>
              <CardDescription>Complete tasks to earn points and level up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      task.status === "completed" ? "bg-primary/5 border-primary/20" : "bg-background"
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">+{task.points} points</p>
                    </div>
                    {task.status === "completed" && (
                      <Award className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <CardDescription>Quick view of your students' performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div>
                    <h4 className="font-semibold">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">Attendance: {student.attendance}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      student.performance === "Excellent" ? "text-primary" :
                      student.performance === "Very Good" || student.performance === "Good" ? "text-accent" :
                      "text-destructive"
                    }`}>
                      {student.performance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Student Quiz Summaries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Interest Quiz Summaries</CardTitle>
            <CardDescription>Latest student interest areas from quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <QuizSummaries />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const QuizSummaries = () => {
  const [summaries, setSummaries] = useState<Array<{ studentId: string; studentName: string; interests: string[]; completedAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.getStudentQuizSummaries();
        setSummaries(res.summaries);
      } catch (e) {
        // silent fail; optional toast
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Loading summaries...</p>;

  if (summaries.length === 0) return <p className="text-sm text-muted-foreground">No recent quiz submissions yet.</p>;

  return (
    <div className="space-y-3">
      {summaries.map((s, i) => (
        <div key={`${s.studentId}-${i}`} className="p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{s.studentName}</h4>
            <span className="text-xs text-muted-foreground">{new Date(s.completedAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Top interests: {s.interests.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default TeacherDashboard;
