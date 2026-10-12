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
  Activity,
  Send,
  CheckCircle2,
  FileText,
  Award,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { AbstractBackground } from "@/components/ui/abstract-background";

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
        <Image src="/logo.png" alt="Matrix Logo" width={32} height={32} className="w-8 h-8 object-contain dark:invert rounded-lg" />
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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 px-6">
      
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

        {/* Minimalist 3D Certificate Showcase */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 w-full max-w-2xl relative"
        >
          {/* Ambient Glow behind 3D Card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/25 via-primary/20 to-pink-500/20 blur-3xl -z-10 rounded-full scale-90 animate-pulse-aura" />
          
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="p-7 sm:p-9 rounded-3xl bg-card/75 backdrop-blur-2xl border border-border/60 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] card-shine relative overflow-hidden"
          >
            {/* Top Bar of Certificate */}
            <div className="flex items-center justify-between pb-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold tracking-tight">MATRIX CERTIFICATE</h4>
                  <p className="text-[11px] text-muted-foreground">Automated Credential Engine</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Verified Authentic
              </span>
            </div>

            {/* Certificate Body Preview */}
            <div className="py-8 text-center space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">This Certificate is proudly presented to</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-accent to-pink-500 dark:from-blue-400 dark:via-accent dark:to-pink-400 py-1">
                Participant
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                For exceptional achievement in Event Management & Cryptographic Certification.
              </p>
            </div>

            {/* Bottom Proof Details */}
            <div className="pt-4 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>SHA-256 Cryptographic Seal</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span>ID: MTX-2026-8849</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Minimalist Pill Badges */}
          <div className="absolute -top-3 -left-2 sm:-left-6 px-3.5 py-1.5 rounded-xl bg-background/90 backdrop-blur-xl border border-border/60 shadow-lg text-xs font-bold flex items-center gap-2 text-foreground animate-float-gentle hidden sm:flex">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant PDF Generation
          </div>

          <div className="absolute -bottom-3 -right-2 sm:-right-6 px-3.5 py-1.5 rounded-xl bg-background/90 backdrop-blur-xl border border-border/60 shadow-lg text-xs font-bold flex items-center gap-2 text-foreground animate-float-gentle hidden sm:flex" style={{ animationDelay: '1.5s' }}>
            <Mail className="w-3.5 h-3.5 text-accent" /> 1-Click Gmail Dispatch
          </div>
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
    { 
      number: "01",
      title: "Create Event", 
      desc: "Set event name, coordinator roles, and custom dates in seconds.", 
      icon: Calendar,
      color: "from-blue-500/20 to-blue-600/10 text-blue-500 border-blue-500/30"
    },
    { 
      number: "02",
      title: "Upload Template", 
      desc: "Customize canvas dimensions, dynamic tags, signatures & fonts.", 
      icon: FileText,
      color: "from-indigo-500/20 to-indigo-600/10 text-indigo-500 border-indigo-500/30"
    },
    { 
      number: "03",
      title: "Import List", 
      desc: "Drag & drop Excel or CSV attendee rosters with auto-validation.", 
      icon: Users,
      color: "from-fuchsia-500/20 to-fuchsia-600/10 text-fuchsia-500 border-fuchsia-500/30"
    },
    { 
      number: "04",
      title: "Generate Certs", 
      desc: "Batch render tamper-proof, high-resolution PDF credentials.", 
      icon: Sparkles,
      color: "from-pink-500/20 to-pink-600/10 text-pink-500 border-pink-500/30"
    },
    { 
      number: "05",
      title: "Distribute", 
      desc: "Automated personalized email dispatch with PDF attachments.", 
      icon: Send,
      color: "from-purple-500/20 to-purple-600/10 text-purple-500 border-purple-500/30"
    },
    { 
      number: "06",
      title: "Track & Verify", 
      desc: "Real-time delivery confirmation and QR code authentication.", 
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-emerald-600/10 text-emerald-500 border-emerald-500/30"
    }
  ];

  return (
    <section id="workflow" className="py-32 px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-accent/10 via-primary/10 to-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Pipeline</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Streamlined Workflow</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">From setup to delivery in minutes with automated precision.</p>
        </motion.div>
        
        {/* Minimalist 3D Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { type: "spring", stiffness: 350, damping: 22 }
              }}
              className="p-7 rounded-3xl bg-card/65 backdrop-blur-2xl border border-border/50 hover:border-accent/50 shadow-lg hover:shadow-2xl hover:shadow-accent/15 transition-all duration-300 relative group overflow-hidden card-shine flex flex-col justify-between"
            >
              {/* Top row with Step Number & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} border flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/40 group-hover:border-accent/40 group-hover:text-accent transition-colors">
                  STEP {step.number}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-6 pt-4 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground/80 font-medium">
                <span className="group-hover:text-foreground transition-colors">Phase {i + 1} of 6</span>
                <span className="w-2 h-2 rounded-full bg-accent/30 group-hover:bg-accent group-hover:scale-125 transition-all duration-300" />
              </div>
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
        <Image src="/logo.png" alt="Matrix Logo" width={24} height={24} className="w-6 h-6 object-contain dark:invert rounded-md" />
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
    <div className="min-h-screen selection:bg-accent selection:text-white font-sans overflow-x-hidden relative z-0">
      <AbstractBackground />
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
