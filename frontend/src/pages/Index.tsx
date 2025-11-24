import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, TrendingUp, BookOpen, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-education.jpg";

const Index = () => {
  const userRoles = [
    {
      title: "Students",
      icon: GraduationCap,
      description: "Discover your interests and get personalized learning recommendations",
      path: "/auth?role=student",
      gradient: "from-primary to-primary/80"
    },
    {
      title: "Teachers",
      icon: BookOpen,
      description: "Track student progress, earn rewards, and grow professionally",
      path: "/auth?role=teacher",
      gradient: "from-secondary to-secondary/80"
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Reduce Dropout Rates",
      description: "Data-driven approach to identify and support at-risk students"
    },
    {
      icon: Award,
      title: "Gamified Learning",
      description: "Motivate teachers and students through achievements and rewards"
    },
    {
      icon: Heart,
      title: "Community Support",
      description: "Connect donors with students and families who need help most"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/inzozi-logo.png" alt="INZOZI Logo" className="h-10 w-10 object-contain" />
            <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition">
              INZOZI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="https://inzozi-rwanda-1.onrender.com/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link to="https://inzozi-rwanda-1.onrender.com/auth">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10" />
        <img 
          src={heroImage} 
          alt="Students learning together in Rwanda"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            INZOZI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Empowering Education in Rwanda Through Technology
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90">
            Supporting students, teachers, parents, and communities to reduce dropout rates and improve learning outcomes
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Mission</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Using technology to combat poor quality education and lower student dropout rates in Rwanda
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Choose Your Role</h2>
          <p className="text-center text-muted-foreground mb-12">
            Select your role to access your personalized dashboard
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRoles.map((role, index) => (
              <Link to={role.path} key={index}>
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                  <CardContent className="pt-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {/* Donor external link card */}
            <a
              href="https://forms.gle/BhC5i88nG4SDJUY79"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Become a Donor</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out a short form to support students and families in need
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students, teachers, parents, and donors working together to improve education in Rwanda
          </p>
          <Link to="https://inzozi-rwanda-1.onrender.com/api/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Join INZOZI Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 INZOZI Tech. Empowering education across Rwanda.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
