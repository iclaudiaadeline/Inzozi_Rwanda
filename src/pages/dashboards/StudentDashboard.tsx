import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { GraduationCap, BookOpen, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface QuizQuestion {
  id: number;
  question: string;
  options: Array<{ value: string; label: string; interest: string }>;
}

const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentView, setCurrentView] = useState<"overview" | "quiz" | "results">("overview");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userStr = localStorage.getItem("inzozi_user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }

        // Load profile and quiz results
        const profileData = await apiClient.getStudentProfile();
        setProfile(profileData.profile);
        setUser(profileData.user);

        // Check if quiz was already completed
        if (profileData.profile.interests && profileData.profile.interests.length > 0) {
          setRecommendations(profileData.profile.interests);
          setQuizCompleted(true);
          setCurrentView("results");
        }
      } catch (error) {
        console.error("Error loading student data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What type of activities do you enjoy most?",
      options: [
        { value: "building", label: "Building or fixing things", interest: "engineering" },
        { value: "helping", label: "Helping people solve problems", interest: "healthcare" },
        { value: "creating", label: "Creating art or stories", interest: "arts" },
        { value: "numbers", label: "Working with numbers and data", interest: "math" }
      ]
    },
    {
      id: 2,
      question: "Which school subject do you find most interesting?",
      options: [
        { value: "science", label: "Science and experiments", interest: "science" },
        { value: "languages", label: "Languages and communication", interest: "languages" },
        { value: "math", label: "Mathematics and logic", interest: "math" },
        { value: "arts", label: "Arts and creative subjects", interest: "arts" }
      ]
    },
    {
      id: 3,
      question: "When you imagine your future, what sounds most exciting?",
      options: [
        { value: "technology", label: "Working with technology and computers", interest: "technology" },
        { value: "business", label: "Starting your own business", interest: "business" },
        { value: "teaching", label: "Teaching or helping others learn", interest: "education" },
        { value: "healthcare", label: "Caring for people's health", interest: "healthcare" }
      ]
    },
    {
      id: 4,
      question: "What type of problem-solving do you prefer?",
      options: [
        { value: "practical", label: "Practical, hands-on problems", interest: "engineering" },
        { value: "creative", label: "Creative, open-ended challenges", interest: "arts" },
        { value: "logical", label: "Logical, analytical puzzles", interest: "math" },
        { value: "social", label: "Social or interpersonal issues", interest: "social" }
      ]
    },
    {
      id: 5,
      question: "Which environment do you prefer learning in?",
      options: [
        { value: "lab", label: "Labs and hands-on experiments", interest: "science" },
        { value: "projects", label: "Project-based and building things", interest: "engineering" },
        { value: "discussion", label: "Group discussions and presentations", interest: "languages" },
        { value: "independent", label: "Independent study and research", interest: "technology" }
      ]
    },
    {
      id: 6,
      question: "What motivates you the most in school?",
      options: [
        { value: "impact", label: "Making a difference in my community", interest: "social" },
        { value: "innovation", label: "Creating new things and innovating", interest: "technology" },
        { value: "achievement", label: "Achieving high grades and awards", interest: "math" },
        { value: "expression", label: "Expressing myself creatively", interest: "arts" }
      ]
    },
    {
      id: 7,
      question: "Which after-school activity would you choose?",
      options: [
        { value: "coding", label: "Coding club / robotics", interest: "technology" },
        { value: "health", label: "Health and first-aid club", interest: "healthcare" },
        { value: "business", label: "Entrepreneurship club", interest: "business" },
        { value: "artsclub", label: "Art, music, or drama club", interest: "arts" }
      ]
    }
  ];

  const interestRecommendations: Record<string, { title: string; description: string; resources: string[] }> = {
    engineering: {
      title: "Engineering & Technology",
      description: "You have a strong aptitude for building, creating, and solving technical problems!",
      resources: [
        "Online coding courses (Scratch, Python basics)",
        "Robotics and electronics projects",
        "Engineering competitions and clubs"
      ]
    },
    healthcare: {
      title: "Healthcare & Medicine",
      description: "You show great potential for helping others and healthcare professions!",
      resources: [
        "Biology and human anatomy resources",
        "First aid and health education programs",
        "Mentorship with healthcare professionals"
      ]
    },
    arts: {
      title: "Arts & Creative Fields",
      description: "Your creative thinking and artistic interests shine through!",
      resources: [
        "Art and design tutorials",
        "Creative writing workshops",
        "Music and performing arts programs"
      ]
    },
    math: {
      title: "Mathematics & Analysis",
      description: "You have excellent logical and analytical thinking skills!",
      resources: [
        "Advanced mathematics courses",
        "Data science and statistics resources",
        "Math olympiad preparation"
      ]
    },
    science: {
      title: "Science & Research",
      description: "Your curiosity about how the world works is a great foundation!",
      resources: [
        "Science experiment kits and projects",
        "Research methodology courses",
        "Science club participation"
      ]
    },
    languages: {
      title: "Languages & Communication",
      description: "You have strong communication and language skills!",
      resources: [
        "Language learning apps and courses",
        "Writing and journalism workshops",
        "Public speaking clubs"
      ]
    },
    technology: {
      title: "Technology & Innovation",
      description: "Your interest in technology positions you well for the future!",
      resources: [
        "Computer science fundamentals",
        "App development tutorials",
        "Tech innovation programs"
      ]
    },
    business: {
      title: "Business & Entrepreneurship",
      description: "Your entrepreneurial mindset shows great potential!",
      resources: [
        "Business planning resources",
        "Entrepreneurship mentorship programs",
        "Financial literacy courses"
      ]
    },
    education: {
      title: "Education & Teaching",
      description: "You have a gift for helping others learn and grow!",
      resources: [
        "Tutoring opportunities",
        "Educational psychology resources",
        "Teaching methodology workshops"
      ]
    },
    social: {
      title: "Social Sciences & Community",
      description: "Your empathy and social awareness are valuable strengths!",
      resources: [
        "Psychology and sociology courses",
        "Community service projects",
        "Social work mentorship"
      ]
    }
  };

  const handleStartQuiz = () => {
    setCurrentView("quiz");
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast.error("Please select an answer before continuing");
      return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeQuiz = async () => {
    try {
      // Count interest frequencies
      const interestCounts: Record<string, number> = {};
      
      Object.entries(answers).forEach(([questionIndex, optionValue]) => {
        const question = quizQuestions[parseInt(questionIndex)];
        const selectedOption = question.options.find(opt => opt.value === optionValue);
        if (selectedOption) {
          interestCounts[selectedOption.interest] = (interestCounts[selectedOption.interest] || 0) + 1;
        }
      });

      // Get top 3 interests
      const topInterests = Object.entries(interestCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([interest]) => interest);

      // Submit to API
      await apiClient.submitQuiz(topInterests);
      
      setRecommendations(topInterests);
      setQuizCompleted(true);
      setCurrentView("results");
      toast.success("Quiz completed! Here are your personalized recommendations.");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to save quiz results. Please try again.");
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || "Student"}!`}
      icon={<GraduationCap className="w-8 h-8" />}
      navigation={[
        { label: "Dashboard", onClick: () => setCurrentView("overview"), active: currentView === "overview" },
        { label: "Interest Quiz", onClick: () => setCurrentView("quiz"), active: currentView === "quiz" },
        { label: "My Results", onClick: () => setCurrentView("results"), active: currentView === "results" }
      ]}
    >
      {currentView === "overview" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-secondary" />
                Discover Your Interests
              </CardTitle>
              <CardDescription>
                Take our personalized quiz to find out what subjects and careers match your strengths and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStartQuiz} size="lg">
                Start Interest Discovery Quiz
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{profile?.attendance?.toFixed(0) || 0}%</p>
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  </div>
                </div>
                {profile?.performance && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Performance: {profile.performance}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Review notes daily for 15 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>Practice problems before exams</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check back for personalized recommendations after completing the interest quiz!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentView === "quiz" && !quizCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>Interest Discovery Quiz</CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-2" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {quizQuestions[currentQuestion].question}
              </h3>
              
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswerSelect}
              >
                {quizQuestions[currentQuestion].options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentQuestion === quizQuestions.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentView === "results" && quizCompleted && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Your Personalized Results
              </CardTitle>
              <CardDescription>
                Based on your answers, here are your top interest areas and recommended resources
              </CardDescription>
            </CardHeader>
          </Card>

          {recommendations.map((interest, index) => {
            const recommendation = interestRecommendations[interest];
            return (
              <Card key={interest} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle>{recommendation.title}</CardTitle>
                      <CardDescription>{recommendation.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Recommended Resources:
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.resources.map((resource, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Want to retake the quiz or explore different paths? You can always come back and try again!
              </p>
              <div className="flex justify-center mt-4">
                <Button onClick={handleStartQuiz} variant="outline">
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
