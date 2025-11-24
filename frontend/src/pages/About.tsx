import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const missions = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To use software engineering skills and tools to combat poor quality education and lower student dropout rates in Rwanda, especially in public schools."
    },
    {
      icon: Users,
      title: "Who We Serve",
      description: "Students discovering their interests, teachers growing professionally, parents staying engaged, and donors making transparent contributions."
    },
    {
      icon: TrendingUp,
      title: "Our Approach",
      description: "Data-driven insights, personalized learning paths, gamified teacher development, and community-driven support for families in need."
    },
    {
      icon: Heart,
      title: "Our Impact",
      description: "Reducing dropout rates, improving student performance, enhancing teacher motivation, and connecting communities through technology."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/inzozi-logo.png" alt="INZOZI Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-primary">INZOZI</h1>
          </Link>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About INZOZI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering education in Rwanda through innovative technology solutions that connect students, teachers, parents, and communities.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {missions.map((mission, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <mission.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">{mission.title}</h3>
                  <p className="text-muted-foreground">{mission.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">The Challenge</h2>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg mb-4">
                  In Rwanda, many students leave school because they:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Have no interest in the subjects taught</li>
                  <li>Lack teacher or parental support</li>
                  <li>Face poverty and food insecurity</li>
                  <li>Don't receive personalized learning support</li>
                </ul>
                <p className="text-lg mt-6">
                  INZOZI addresses these challenges through technology, creating connections and opportunities for every stakeholder in the education ecosystem.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Solution</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 text-primary">For Students</h3>
                <p className="text-muted-foreground">
                  Interest discovery tools, personalized learning recommendations, and support to stay engaged in education.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 text-secondary">For Teachers</h3>
                <p className="text-muted-foreground">
                  Professional development through gamification, student tracking tools, and peer collaboration networks.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 text-accent">For Parents</h3>
                <p className="text-muted-foreground">
                  Real-time updates on child's progress, teacher feedback, and engagement tools to stay involved.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 text-pink-600">For Donors</h3>
                <p className="text-muted-foreground">
                  Transparent donation system connecting support directly to students and families in need.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Together, we can transform education in Rwanda and create opportunities for every student to succeed.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary">
              Get Started Today
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

export default About;
