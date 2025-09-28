import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Headphones,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Zap
} from "lucide-react";
import Header from "@/components/layout/Header";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqData = [
    {
      id: 1,
      question: "How do I download and install games?",
      answer: "You can download games directly through GameVault. Click on any game, then click 'Buy Now' or 'Play Now' for free games. The game will be added to your library and you can install it from there.",
      category: "Downloads",
      helpful: 156
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and digital wallets. You can also use GameVault wallet credits for purchases.",
      category: "Payment",
      helpful: 89
    },
    {
      id: 3,
      question: "How do I refund a game?",
      answer: "You can request a refund within 14 days of purchase if you've played less than 2 hours. Go to your Library > Game > Request Refund.",
      category: "Refunds",
      helpful: 234
    },
    {
      id: 4,
      question: "Can I play games offline?",
      answer: "Most single-player games can be played offline after initial installation. Online games require an internet connection.",
      category: "Gameplay",
      helpful: 67
    }
  ];

  const supportTickets = [
    {
      id: "GV-2024-001",
      title: "Game won't launch after update",
      status: "In Progress",
      priority: "High",
      lastUpdate: "2 hours ago",
      agent: "Sarah M."
    },
    {
      id: "GV-2024-002", 
      title: "Payment processing issue",
      status: "Resolved",
      priority: "Medium",
      lastUpdate: "1 day ago",
      agent: "Mike K."
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageSquare className="h-6 w-6" />,
      availability: "Available 24/7",
      responseTime: "Usually responds in minutes",
      action: "Start Chat"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="h-6 w-6" />,
      availability: "support@gamevault.com",
      responseTime: "Usually responds in 4-6 hours",
      action: "Send Email"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: <Phone className="h-6 w-6" />,
      availability: "Mon-Fri, 9AM-6PM EST",
      responseTime: "+1 (555) 123-4567",
      action: "Call Now"
    }
  ];

  const knowledgeBase = [
    {
      title: "Getting Started Guide",
      description: "Everything you need to know about GameVault",
      articles: 12,
      icon: <Book className="h-6 w-6 text-primary" />
    },
    {
      title: "Account & Billing",
      description: "Manage your account and payment methods",
      articles: 18,
      icon: <FileText className="h-6 w-6 text-accent" />
    },
    {
      title: "Technical Issues",
      description: "Troubleshoot common problems",
      articles: 24,
      icon: <Zap className="h-6 w-6 text-gaming-warning" />
    },
    {
      title: "Game Library",
      description: "Managing your games and downloads",
      articles: 15,
      icon: <Headphones className="h-6 w-6 text-gaming-success" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "text-gaming-success";
      case "In Progress": return "text-gaming-warning";
      case "Open": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400";
      case "Medium": return "bg-yellow-500/20 text-yellow-400";
      case "Low": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Support Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get the support you need to make the most of GameVault
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base"
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {option.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-muted-foreground mb-4">{option.description}</p>
                <div className="text-sm text-muted-foreground mb-4">
                  <div>{option.availability}</div>
                  <div>{option.responseTime}</div>
                </div>
                <Button className="w-full">{option.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
              </TabsList>

              <TabsContent value="faq" className="mt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                  {faqData.map((faq) => (
                    <Card key={faq.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold">{faq.question}</h3>
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <Button variant="ghost" size="sm">
                            Was this helpful?
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {faq.helpful} people found this helpful
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tickets" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Support Tickets</h2>
                    <Button>Create New Ticket</Button>
                  </div>
                  
                  {supportTickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground">Ticket #{ticket.id}</p>
                          </div>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Status: </span>
                            <span className={getStatusColor(ticket.status)}>{ticket.status}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Agent: </span>
                            <span>{ticket.agent}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Update: </span>
                            <span>{ticket.lastUpdate}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="ghost" size="sm">Add Reply</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input placeholder="Brief description of your issue" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select className="w-full p-2 border border-border rounded-md bg-background">
                        <option>Technical Issue</option>
                        <option>Billing Question</option>
                        <option>Account Problem</option>
                        <option>Game Issue</option>
                        <option>Feature Request</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select className="w-full p-2 border border-border rounded-md bg-background">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        placeholder="Please provide as much detail as possible about your issue..."
                        rows={6}
                      />
                    </div>
                    
                    <Button className="w-full">Submit Ticket</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Knowledge Base */}
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {knowledgeBase.map((section, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gaming-surface transition-colors cursor-pointer">
                    <div className="mt-1">{section.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                      <span className="text-xs text-muted-foreground">{section.articles} articles</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-gaming-success" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Game Downloads</span>
                    <Badge variant="secondary" className="bg-gaming-success/20 text-gaming-success">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment System</span>
                    <Badge variant="secondary" className="bg-gaming-success/20 text-gaming-success">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Community Features</span>
                    <Badge variant="secondary" className="bg-gaming-success/20 text-gaming-success">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Game Servers</span>
                    <Badge variant="secondary" className="bg-gaming-warning/20 text-gaming-warning">
                      Maintenance
                    </Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Status Page
                </Button>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "How to enable two-factor authentication",
                    "Troubleshooting download issues",
                    "Setting up parental controls",
                    "Managing your game library"
                  ].map((article, index) => (
                    <div key={index} className="text-sm">
                      <a href="#" className="text-primary hover:underline">{article}</a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;