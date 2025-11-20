import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { Heart, Users, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const DonorDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("inzozi_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const studentsInNeed = [
    {
      id: "1",
      name: "Mugabo Jean",
      grade: "Grade 9",
      need: "School supplies and uniform",
      story: "Jean shows exceptional academic promise but his family struggles to afford basic school materials.",
      amountNeeded: 15000,
      amountRaised: 8500,
      urgency: "high"
    },
    {
      id: "2",
      name: "Uwimana Grace",
      grade: "Grade 11",
      need: "Science lab fees",
      story: "Grace dreams of becoming a doctor. She needs support for lab fees to continue her science studies.",
      amountNeeded: 25000,
      amountRaised: 12000,
      urgency: "medium"
    },
    {
      id: "3",
      name: "Ndahiro Patrick",
      grade: "Grade 8",
      need: "Food support",
      story: "Patrick walks 10km daily to school. Food insecurity affects his concentration and attendance.",
      amountNeeded: 30000,
      amountRaised: 18000,
      urgency: "high"
    },
    {
      id: "4",
      name: "Mukamana Sarah",
      grade: "Grade 10",
      need: "Technology access",
      story: "Sarah excels in mathematics and wants to learn programming but lacks access to a computer.",
      amountNeeded: 80000,
      amountRaised: 35000,
      urgency: "medium"
    }
  ];

  const familiesInNeed = [
    {
      id: "f1",
      name: "Ntambara Family",
      children: 3,
      need: "Monthly food support",
      story: "Single parent household with 3 children in primary school. Father passed away last year.",
      amountNeeded: 50000,
      amountRaised: 22000,
      urgency: "high"
    },
    {
      id: "f2",
      name: "Habimana Family",
      children: 2,
      need: "Housing and education",
      story: "Family displaced by floods. Two children at risk of dropping out to help with income.",
      amountNeeded: 100000,
      amountRaised: 45000,
      urgency: "high"
    }
  ];

  const myDonations = [
    { date: "2025-01-15", recipient: "Mugabo Jean", amount: 10000, purpose: "School supplies" },
    { date: "2025-01-05", recipient: "Uwimana Grace", amount: 5000, purpose: "Lab fees" },
    { date: "2024-12-20", recipient: "General Fund", amount: 20000, purpose: "Emergency support" },
  ];

  const totalDonated = myDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const studentsHelped = new Set(myDonations.map(d => d.recipient)).size;

  const handleDonate = (recipientId: string, recipientName: string) => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    // Simulate donation processing (in production, integrate with MoMo API)
    toast.success(`Thank you! Your donation of ${donationAmount} RWF to ${recipientName} is being processed.`);
    
    setDonationAmount("");
    setSelectedRecipient(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "default";
    }
  };

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || "Donor"}!`}
      icon={<Heart className="w-8 h-8" />}
    >
      <div className="space-y-6">
        {/* Impact Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive" />
                Total Donated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{totalDonated.toLocaleString()} <span className="text-lg">RWF</span></p>
              <p className="text-sm text-muted-foreground mt-2">Thank you for your generosity!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Students Helped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{studentsHelped}</p>
              <p className="text-sm text-muted-foreground mt-2">Lives directly impacted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Impact Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">Top 25%</p>
              <p className="text-sm text-muted-foreground mt-2">Among all donors</p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Support Those in Need</CardTitle>
            <CardDescription>Choose who you'd like to help and make a transparent donation</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="families">Families</TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="space-y-4 mt-4">
                {studentsInNeed.map((student) => (
                  <Card key={student.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              <Badge variant="outline">{student.grade}</Badge>
                              <Badge variant={getUrgencyColor(student.urgency)}>
                                {student.urgency === "high" ? "Urgent" : "Moderate"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{student.story}</p>
                            <p className="text-sm font-medium text-primary">Need: {student.need}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">
                              {student.amountRaised.toLocaleString()} / {student.amountNeeded.toLocaleString()} RWF
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                              style={{ width: `${(student.amountRaised / student.amountNeeded) * 100}%` }}
                            />
                          </div>
                        </div>

                        {selectedRecipient === student.id ? (
                          <div className="space-y-3 pt-2 border-t">
                            <Label htmlFor={`amount-${student.id}`}>Donation Amount (RWF)</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`amount-${student.id}`}
                                type="number"
                                placeholder="Enter amount"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                              />
                              <Button 
                                onClick={() => handleDonate(student.id, student.name)}
                                className="whitespace-nowrap"
                              >
                                <DollarSign className="w-4 h-4 mr-1" />
                                Donate
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedRecipient(null)}
                              className="w-full"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => setSelectedRecipient(student.id)}
                            className="w-full"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Donate Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="families" className="space-y-4 mt-4">
                {familiesInNeed.map((family) => (
                  <Card key={family.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{family.name}</h3>
                              <Badge variant="outline">{family.children} Children</Badge>
                              <Badge variant={getUrgencyColor(family.urgency)}>
                                {family.urgency === "high" ? "Urgent" : "Moderate"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{family.story}</p>
                            <p className="text-sm font-medium text-primary">Need: {family.need}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">
                              {family.amountRaised.toLocaleString()} / {family.amountNeeded.toLocaleString()} RWF
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                              style={{ width: `${(family.amountRaised / family.amountNeeded) * 100}%` }}
                            />
                          </div>
                        </div>

                        {selectedRecipient === family.id ? (
                          <div className="space-y-3 pt-2 border-t">
                            <Label htmlFor={`amount-${family.id}`}>Donation Amount (RWF)</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`amount-${family.id}`}
                                type="number"
                                placeholder="Enter amount"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                              />
                              <Button 
                                onClick={() => handleDonate(family.id, family.name)}
                                className="whitespace-nowrap"
                              >
                                <DollarSign className="w-4 h-4 mr-1" />
                                Donate
                              </Button>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedRecipient(null)}
                              className="w-full"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => setSelectedRecipient(family.id)}
                            className="w-full"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Donate Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* My Donations History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Your Donation History
            </CardTitle>
            <CardDescription>Track your contributions and impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myDonations.map((donation, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{donation.recipient}</h4>
                    <p className="text-sm text-muted-foreground">{donation.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{donation.amount.toLocaleString()} RWF</p>
                    <p className="text-xs text-muted-foreground">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Note */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Heart className="w-12 h-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Impact Matters</h3>
                <p className="text-muted-foreground">
                  Every donation you make directly reaches students and families in need. Our transparent system ensures
                  100% of your contribution goes to the intended recipient. Together, we're building a brighter future
                  for Rwanda's education system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
