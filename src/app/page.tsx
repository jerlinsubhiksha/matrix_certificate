"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { 
  ShieldCheck, 
  Calendar, 
  FileCheck, 
  Copy, 
  Mail, 
  BarChart, 
  Lock, 
  ArrowRight,
  Sparkles,
  Users,
  Activity
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

// Helper for smooth scrolling
const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const targetId = href.replace(/.*\#/, "");
  const elem = document.getElementById(targetId);
  if (elem) {
    window.scrollTo({
      top: elem.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  }
};

const Navbar = () => {
  const shouldReduceMotion = useReducedMotion();
  const navVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground dark:text-gray-900 font-bold">
          M
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-lg text-primary tracking-tight">MATRIX</span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Certificate System</span>
        </div>
      </Link>
      
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        {["Features", "Workflow", "Security", "Contact"].map((item) => (
          <Link 
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={(e) => scrollToSection(e, `#${item.toLowerCase()}`)}
            className="relative group transition-colors hover:text-foreground"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/login" className="text-sm font-medium hover:text-accent transition-colors hidden md:block">
          Log In
        </Link>
        <Link 
          href="/login" 
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground dark:text-gray-900 text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
};

const AbstractBackground = () => {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Slow moving glow */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px]"
      />
      
      {/* Floating abstract elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[15%] opacity-20 text-accent"
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 right-[10%] opacity-20 text-primary"
      >
        <FileCheck className="w-12 h-12" />
      </motion.div>
    </div>
  );
};

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
      <AbstractBackground />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-medium mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Smart Certificate Management</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          Manage Certificates.<br />
          Simplify <span className="text-accent">Distribution.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Create, manage and distribute certificates effortlessly from one secure platform.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/login" 
            className="group relative px-8 py-4 rounded-xl bg-primary text-primary-foreground dark:text-gray-900 font-bold shadow-sm transition-all hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Get Started 
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          <Link 
            href="#features" 
            onClick={(e) => scrollToSection(e, "#features")}
            className="group px-8 py-4 rounded-xl bg-transparent border border-border hover:border-accent/50 text-foreground font-semibold hover:bg-accent/5 transition-all flex items-center justify-center gap-2"
          >
            Explore Features
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

const Features = () => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    { icon: Calendar, title: "Event Management", desc: "Easily schedule and organize events, workshops, or courses in a unified dashboard." },
    { icon: FileCheck, title: "Template Management", desc: "Upload and map custom certificate templates with dynamic data fields." },
    { icon: Copy, title: "Bulk Generation", desc: "Generate thousands of personalized certificates instantly from participant data." },
    { icon: Mail, title: "Email Distribution", desc: "Automate delivery to participants with customizable email templates." },
    { icon: BarChart, title: "Delivery Tracking", desc: "Monitor open rates, bounces, and successful deliveries in real-time." },
    { icon: ShieldCheck, title: "Secure Access", desc: "Enterprise-grade security ensuring credentials remain tamper-proof and verified." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-muted/30 -z-10" />
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need for end-to-end certificate automation.</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={cardVariants}
              whileHover={{ 
                y: shouldReduceMotion ? 0 : -4,
                scale: shouldReduceMotion ? 1 : 1.01,
                transition: { duration: 0.2, ease: "easeOut" as const }
              }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 text-accent group-hover:scale-105 transition-transform duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              
              {/* Subtle hover glow inside card */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Workflow = () => {
  const shouldReduceMotion = useReducedMotion();
  
  const steps = [
    "Create Event",
    "Upload Template",
    "Upload Participants",
    "Generate",
    "Distribute",
    "Track"
  ];

  return (
    <section id="workflow" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Streamlined Workflow</h2>
          <p className="text-muted-foreground text-lg">From setup to delivery in minutes.</p>
        </motion.div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 max-w-5xl mx-auto">
          {/* Animated Connecting Line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-[2px] md:left-0 md:top-1/2 md:-translate-y-1/2 md:w-full md:h-[2px] bg-border -z-10" />
          <motion.div 
            initial={{ height: 0, width: 0 }}
            whileInView={shouldReduceMotion ? { height: "100%", width: "100%" } : {
              height: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : "2px",
              width: typeof window !== "undefined" && window.innerWidth < 768 ? "2px" : "100%"
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-[15px] top-0 w-[2px] md:left-0 md:top-1/2 md:-translate-y-1/2 md:h-[2px] bg-accent origin-top md:origin-left -z-10"
          />

          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex md:flex-col items-center gap-4 md:gap-6 bg-background px-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-card border-2 border-accent text-accent flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(177,59,255,0.2)] group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <h4 className="text-sm md:text-xs font-semibold md:text-center text-foreground group-hover:text-accent transition-colors">
                {step}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Security = () => {
  const shouldReduceMotion = useReducedMotion();
  
  const items = [
    { icon: Lock, title: "Secure Authentication", desc: "Multi-factor authentication and robust session management." },
    { icon: Users, title: "Role-Based Access", desc: "Granular permissions for admins, coordinators, and viewers." },
    { icon: ShieldCheck, title: "Protected Credentials", desc: "Certificates are cryptographically signed to prevent forgery." },
    { icon: Activity, title: "Activity Tracking", desc: "Comprehensive audit logs for all system actions." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section id="security" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/20 -z-10" />
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Secure by design.</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built from the ground up with enterprise security principles to keep your data and credentials safe.</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {items.map((item, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-32 px-6 relative text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to simplify certificate distribution?</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">Join hundreds of organizations automating their credentials today.</p>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground dark:text-gray-900 font-bold shadow-sm transition-all hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 group"
        >
          Get Started
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </motion.div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 bg-background border-t border-border">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground dark:text-gray-900 font-bold text-xs">
          M
        </div>
        <span className="font-bold text-lg text-primary tracking-tight">MATRIX</span>
      </Link>
      
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
        <Link href="#features" onClick={(e) => scrollToSection(e, "#features")} className="hover:text-foreground transition-colors">Features</Link>
        <Link href="#workflow" onClick={(e) => scrollToSection(e, "#workflow")} className="hover:text-foreground transition-colors">Workflow</Link>
        <Link href="#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
        <Link href="#about" className="hover:text-foreground transition-colors">About Us</Link>
        <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
        <Link href="/login" className="hover:text-foreground transition-colors text-primary font-semibold">Login</Link>
      </div>
      
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} MATRIX Certificate Systems.
      </p>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-accent selection:text-white font-sans overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Security />
      <CTA />
      <Footer />
    </div>
  );
}
