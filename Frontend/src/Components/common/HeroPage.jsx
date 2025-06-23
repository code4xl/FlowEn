import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  X,
  ChevronRight,
  Star,
  CheckCircle,
  Code,
  Zap,
  Settings,
  Moon,
  Sun,
  Workflow,
  Bot,
  Database,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  Brain,
  Network,
  GitBranch,
  Cpu,
  Shield,
  BarChart3,
} from "lucide-react";
import { selectTheme, setTheme } from "../../App/DashboardSlice";
import GradientText from "../bits/GradientText";
import ClickSpark from "../bits/ClickSpark";
import BlurText from "../bits/BlurText";
import logo from "../../assets/Flowen_B.png";
import logo_s from "../../assets/Flowen_S.png";

export default function HeroPage() {
  const theme = useSelector(selectTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme({ theme: newTheme }));
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Update active section based on scroll
      const sections = ["hero", "features", "how-it-works", "testimonials"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    document.documentElement.setAttribute("data-theme", "dark");
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Drag & Drop Builder",
      description:
        "Visually design complex workflows with our intuitive drag-and-drop interface. No coding required.",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "LLM Agent Integration",
      description:
        "Connect powerful AI models like GPT-4, Claude, and custom agents to automate intelligent tasks.",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "RAG & Knowledge Base",
      description:
        "Integrate your documents and data sources for context-aware AI responses and decisions.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Triggers & Scheduling",
      description:
        "Set up automatic execution based on time, events, webhooks, or custom conditions.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description:
        "Bank-grade security with SOC 2 compliance, encryption, and audit trails for peace of mind.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Design Your Workflow",
      description:
        "Use our visual builder to create sophisticated automation workflows in minutes, not hours.",
      icon: <Workflow className="w-12 h-12" />,
    },
    {
      number: "02",
      title: "Configure AI Agents",
      description:
        "Connect LLM models, set up knowledge bases, and define intelligent decision points.",
      icon: <Brain className="w-12 h-12" />,
    },
    {
      number: "03",
      title: "Execute & Scale",
      description:
        "Deploy your workflows and watch them run automatically, handling thousands of tasks seamlessly.",
      icon: <Cpu className="w-12 h-12" />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Operations, TechCorp",
      avatar: "SC",
      content:
        "This platform reduced our manual processes by 80%. The AI agents handle complex decision-making that would take our team hours.",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO, DataFlow Solutions",
      avatar: "MR",
      content:
        "The RAG integration is phenomenal. Our workflows now have access to our entire knowledge base, making responses incredibly accurate.",
    },
    {
      name: "Elena Kowalski",
      role: "Product Manager, InnovateLab",
      avatar: "EK",
      content:
        "Building workflows is now as easy as drawing a flowchart. Our non-technical team can create powerful automations independently.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <ClickSpark
        sparkColor="#0fdbff"
        sparkSize={32}
        sparkRadius={90}
        sparkCount={12}
        duration={400}
        extraScale={1.3}
      >
        {/* Sticky Header */}
        <header
          className={`fixed w-full z-30 transition-all duration-300 ${
            scrolled
              ? "bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-lg border-b border-[var(--border-color)]"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-color)] to-purple-500 rounded-lg flex items-center justify-center">
                  <Workflow className="w-6 h-6 text-white" />
                </div> */}
                <img src={logo_s} alt="logo_S" className="w-[2.5rem]" />
                <img src={logo} alt="logo_B" className="w-[8rem]" />
                {/* <span className="text-xl font-bold">
                  <GradientText>FlowEn</GradientText>
                </span> */}
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {[
                  { name: "Features", href: "#features" },
                  { name: "How it Works", href: "#how-it-works" },
                  { name: "Testimonials", href: "#testimonials" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors font-medium ${
                      activeSection === item.href.slice(1)
                        ? "text-[var(--accent-color)]"
                        : ""
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-[var(--highlight-color)] transition-colors"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5 text-[var(--accent-color)]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[var(--accent-color)]" />
                  )}
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-[var(--accent-color)] border border-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-color)] hover:text-white transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-all transform hover:scale-105 shadow-lg"
                >
                  Try Free
                </button>
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-[var(--highlight-color)] transition-colors"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5 text-[var(--accent-color)]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[var(--accent-color)]" />
                  )}
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-[var(--text-primary)]"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
              <div className="px-4 py-3 space-y-3">
                {[
                  { name: "Features", href: "#features" },
                  { name: "How it Works", href: "#how-it-works" },
                  { name: "Testimonials", href: "#testimonials" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex space-x-3 pt-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-1 px-4 py-2 text-[var(--accent-color)] border border-[var(--accent-color)] rounded-lg text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-1 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg text-center"
                  >
                    Try Free
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section
          id="hero"
          className="z-20 pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] opacity-60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--accent-color)_0%,_transparent_50%)] opacity-10"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-full text-sm font-medium text-[var(--accent-color)] mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Now with GPT-4 & Claude Integration
                </div>

                <BlurText
                  text="Build Intelligent Workflows That Actually Work"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                  delay={100}
                />

                <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl">
                  Create powerful AI-driven automation workflows with our visual
                  builder. Connect LLMs, integrate your data, and scale
                  intelligent processes that transform your business.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-4 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center font-semibold"
                  >
                    Start Building Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                  <button className="px-8 py-4 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--highlight-color)] transition-all flex items-center justify-center font-semibold">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Free forever plan
                  </div>
                </div>
              </div>

              {/* Visual Element */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)] rounded-2xl p-8 shadow-2xl border border-[var(--border-color)]">
                  {/* Mock workflow visualization */}
                  <ClickSpark
                    sparkColor="#0fdbff"
                    sparkSize={32}
                    sparkRadius={90}
                    sparkCount={12}
                    duration={400}
                    extraScale={1.3}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-[var(--text-secondary)]">
                          Workflow Preview
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Workflow nodes */}
                        <div className="flex items-center space-x-3 p-3 bg-[var(--accent-color)]/10 rounded-lg border border-[var(--accent-color)]/20">
                          <div className="w-8 h-8 bg-[var(--accent-color)] rounded-lg flex items-center justify-center">
                            <Database className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              Data Input
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              Process incoming data
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              AI Analysis
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              GPT-4 processes content
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              Auto Action
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              Execute workflow
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ClickSpark>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-[var(--accent-color)]/20 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="z-20 relative py-16 md:py-24 bg-[var(--bg-secondary)]"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to
                <GradientText className="block">
                  Automate Intelligently
                </GradientText>
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">
                Our platform combines the power of AI with intuitive workflow
                design to help you build automation that actually understands
                your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <ClickSpark
                    sparkColor="#0fdbff"
                    sparkSize={32}
                    sparkRadius={90}
                    sparkCount={12}
                    duration={400}
                    extraScale={1.3}
                  >
                    <div className="mb-4 p-3 bg-[var(--accent-color)]/10 rounded-lg w-fit group-hover:bg-[var(--accent-color)]/20 transition-colors">
                      <div className="text-[var(--accent-color)]">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </ClickSpark>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="z-20 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                From Idea to Execution in
                <GradientText className="block">
                  Three Simple Steps
                </GradientText>
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">
                Our intuitive platform makes it easy to go from concept to fully
                automated workflow in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center group">
                  {/* Step number */}
                  <div className="mb-6 mx-auto w-16 h-16 bg-gradient-to-br from-[var(--accent-color)] to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 mx-auto w-fit p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] group-hover:shadow-lg transition-all">
                    <div className="text-[var(--accent-color)]">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connector line (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[var(--accent-color)] to-transparent opacity-30 transform -translate-x-8"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="z-20 py-16 md:py-24 bg-[var(--bg-secondary)]"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Teams at
                <GradientText className="block">Leading Companies</GradientText>
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">
                See how teams are transforming their operations with intelligent
                workflow automation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-[var(--text-secondary)] mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-color)] to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="z-20 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/10 via-purple-500/10 to-[var(--accent-color)]/10"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your
                <GradientText className="block">
                  Business with AI Workflows?
                </GradientText>
              </h2>
              <p className="text-xl text-[var(--text-secondary)] mb-8">
                Join thousands of teams already automating their processes with
                intelligent workflows. Start building for free today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-all transform hover:scale-105 shadow-lg flex items-center font-semibold text-lg"
                >
                  Start Building Workflows Today
                  <Sparkles className="ml-2 w-5 h-5" />
                </button>
                <p className="text-sm text-[var(--text-secondary)]">
                  No credit card required • Free forever plan • 5-minute setup
                </p>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">99.9% Uptime</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Network className="w-5 h-5" />
                  <span className="text-sm">Enterprise Ready</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm">Lightning Fast</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="z-20 py-12 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  {/* <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-color)] to-purple-500 rounded-lg flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">
                    <GradientText>FlowEn</GradientText>
                  </span> */}
                  <img src={logo_s} alt="logo_S" className="w-[2.5rem]" />
                  <img src={logo} alt="logo_B" className="w-[8rem]" />
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Building the future of intelligent workflow automation with
                  AI-powered solutions.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[var(--accent-color)] transition-colors"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer bottom */}
            <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-[var(--text-secondary)]">
                © {new Date().getFullYear()} FlowEn. All rights reserved.
              </p>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-poppins">
                  Built with by <span className="text-red-500 text-xl mr-2">♥</span>  
                  <a className="text-[var(--accent-color)] hover:underline" href="https://hareshkurade.netlify.app" target="_blank" rel="noopener noreferrer">
                    Haresh Kurade
                  </a>
                  
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a
                  href="#"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.161-1.499-.699-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-20 right-8 p-3 bg-[var(--accent-color)] text-white rounded-full shadow-lg hover:bg-[var(--button-hover)] transition-all transform hover:scale-110 z-40 ${
            scrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-5 h-5 transform -rotate-90" />
        </button>

        {/* Add custom animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }

          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
          }

          ::-webkit-scrollbar-thumb {
            background: var(--accent-color);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: var(--button-hover);
          }
        `}</style>
      </ClickSpark>
    </div>
  );
}
