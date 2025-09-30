import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { Book, ClipboardList, Trophy, Upload } from "lucide-react";

const quickActions = [
  { icon: Upload, label: "Import games", description: "Upload CSV files or add games manually." },
  { icon: ClipboardList, label: "Manage lists", description: "Organise backlog, playing, and custom lists." },
  { icon: Trophy, label: "Track achievements", description: "Log unlocks and view completion stats." },
  { icon: Book, label: "Learn features", description: "Read the GameVault Tracker guide." },
] as const;

const trackerFaq = [
  {
    id: "import",
    question: "How do I import my existing library?",
    answer:
      "Use the CSV import tool on the Games page to upload titles exported from other platforms. Each row should include the game title, platform, and optional playtime in minutes.",
    category: "Library management",
  },
  {
    id: "achievements",
    question: "Can I manually mark achievements as unlocked?",
    answer:
      "Yes. Visit a game's detail page and use the 'Mark as unlocked' action beside each achievement. The activity feed and dashboard will update instantly.",
    category: "Achievements",
  },
  {
    id: "lists",
    question: "What lists are created for new accounts?",
    answer:
      "Every profile starts with Backlog, Playing, and Completed lists. You can create unlimited custom lists from the Lists screen.",
    category: "Lists",
  },
  {
    id: "privacy",
    question: "How do privacy settings work?",
    answer:
      "Profile privacy controls who can view your playtime, lists, and achievements. Choose Public, Friends, or Private from the Profile page settings.",
    category: "Account",
  },
];

const Support = () => {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const filteredFaq = useMemo(() => {
    if (!search.trim()) return trackerFaq;
    return trackerFaq.filter((item) =>
      `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Tracker support</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Answers and guides for cataloguing games, updating achievements, and sharing your progress.
            </p>
            <div className="mx-auto w-full max-w-2xl">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tracker help topics"
                className="h-12 text-base"
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label}>
                  <CardContent className="flex flex-col gap-2 p-6">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Frequently asked</CardTitle>
                <CardDescription>Results tailored to the tracker prototype</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaq.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No matching articles yet. Try another search term.</p>
                ) : (
                  filteredFaq.map((item) => (
                    <div key={item.id} className="rounded-md border border-border/60 p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold">{item.question}</h3>
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Need more help?</CardTitle>
                <CardDescription>Contact the prototype team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="message" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="message">Send message</TabsTrigger>
                    <TabsTrigger value="bug">Report bug</TabsTrigger>
                  </TabsList>
                  <TabsContent value="message" className="space-y-3">
                    <Textarea
                      rows={5}
                      placeholder="Describe what you need help with..."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                    <Button className="w-full">Submit</Button>
                  </TabsContent>
                  <TabsContent value="bug" className="space-y-3">
                    <Textarea rows={5} placeholder="Share reproduction steps, browser, and screenshots." />
                    <Button variant="outline" className="w-full">
                      Upload logs
                    </Button>
                  </TabsContent>
                </Tabs>
                <div className="rounded-md border border-dashed border-border/80 p-4 text-xs text-muted-foreground">
                  Prototype support hours: Mon–Fri, 9am–5pm UTC. Responses are provided via email within one business day.
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Support;
