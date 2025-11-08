import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { ProblemSolution } from "@/components/ProblemSolution";
import { Services } from "@/components/Services";
import { Outcomes } from "@/components/Outcomes";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { CaseStudies } from "@/components/CaseStudies";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch content.json
    fetch("/content.json")
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load content:", err);
        // Fallback content
        setContent({
          personal: {
            name: "AI Consultant",
            title: "AI Strategy & Implementation",
            email: "contact@example.com",
            phone: "+1 (555) 000-0000",
          },
          navigation: {
            links: [
              { label: "Services", href: "#services" },
              { label: "Case Studies", href: "#case-studies" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
            ],
            cta: "Get Started",
          },
          hero: {
            headline: "Ship AI that pays for itself in 90 days",
            subheadline:
              "Stop overpaying for AI experiments. Get a custom roadmap that delivers measurable ROI.",
            proofPoints: [
              "Reduce manual work by 20-40%",
              "Clear ROI tracking from day one",
              "No vendor lock-in",
            ],
            primaryCTA: "Get your AI Audit",
            secondaryCTA: "See how it works",
          },
        });
        setLoading(false);
      });

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements that should be revealed
    setTimeout(() => {
      const elements = document.querySelectorAll(".reveal");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header content={content} />
      <main>
        <Hero content={content} />
        <SocialProof content={content} />
        <ProblemSolution content={content} />
        <Services content={content} />
        <Outcomes content={content} />
        <HowItWorks content={content} />
        <Pricing content={content} />
        <CaseStudies content={content} />
        <FAQ content={content} />
        <FinalCTA content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
};

export default Index;
