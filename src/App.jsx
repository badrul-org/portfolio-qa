import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight, ArrowUpRight, Mail, Phone, MapPin, Github, Linkedin, FileText,
  Activity, Layers, Cpu, Bug, Workflow, Gauge, Trophy, Sparkles, Send, Briefcase,
  GraduationCap, BookOpen, Quote, Code2, Rocket, Globe2,
} from 'lucide-react';
import {
  BlurReveal, FadeUp, Magnetic, TiltCard, AnimatedCounter, Marquee,
  Spotlight, HidingNav, ScrollProgress, QABackdrop,
  MaskReveal, ScrollVelocityMarquee, ClipReveal, SlideIn,
  ScrambleText, ConicBorder, SectionIndicator, CursorLabel,
} from './components/Primitives';
import Carousel3D from './components/Carousel3D';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────── 3D PARTICLE BACKDROP ───────────────────────── */
function ParticleField() {
  const ref = useRef();
  const { mouse } = useThree();
  const count = 1500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 15 * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 30;
    ref.current.rotation.y -= delta / 40;
    gsap.to(ref.current.position, { x: mouse.x * 1, y: mouse.y * 1, duration: 3, ease: 'power3.out' });
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent opacity={0.18} color="#adc6ff" size={0.015} sizeAttenuation depthWrite={false} blending={2} />
    </Points>
  );
}
function CameraController() {
  useFrame((state) => {
    const sy = window.scrollY;
    gsap.to(state.camera.position, { z: 15 - sy * 0.005, y: -sy * 0.002, duration: 0.5, ease: 'power1.out' });
  });
  return null;
}
function WebGLBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15] }}>
        <color attach="background" args={['#040d18']} />
        <ambientLight intensity={0.5} />
        <ParticleField />
        <CameraController />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#040d18_100%)] opacity-80" />
    </div>
  );
}

/* ───────────────────────── DATA ───────────────────────── */
const STATS = [
  { value: 4, suffix: '+', label: 'Years in QA', icon: Briefcase },
  { value: 28, suffix: '+', label: 'API Integrations', icon: Workflow },
  { value: 40, suffix: '%', label: 'Regression Cut', icon: Gauge },
  { value: 5, suffix: '.0★', label: 'Upwork Rating', icon: Trophy },
];

const SERVICES = [
  { icon: Activity, title: 'E2E Test Automation', body: 'Playwright + TypeScript frameworks built for long-term maintainability.' },
  { icon: Workflow, title: 'API Regression Pipelines', body: 'Postman + Newman + Chai + JSON Schema running on every commit.' },
  { icon: Cpu, title: 'CI/CD Integration', body: 'GitHub Actions, GitLab CI, Jenkins — with Slack + Allure reporting.' },
  { icon: Layers, title: 'Mobile Automation', body: 'Appium + Android device farms wired into the release pipeline.' },
  { icon: Gauge, title: 'Performance Testing', body: 'JMeter and Locust harnesses to prove SLA compliance under load.' },
  { icon: Bug, title: 'Defect Triage', body: 'Structured P0–P3 framework with reproducible reports devs love.' },
];

const EXPERIENCES = [
  {
    role: 'Software QA Engineer', company: 'Kintsugi', context: 'AI-driven Sales Tax · Remote, US',
    period: 'Sep 2024 — Present',
    body: 'Sole QA owner across 28+ integrations (Shopify, Stripe, NetSuite, QuickBooks, Zuora, …). Built the entire Playwright + Allure infrastructure from scratch, integrated with GitHub Actions and Slack — manual regression down ~40%.',
    stack: ['Playwright', 'TypeScript', 'Allure', 'Newman', 'GitHub Actions'],
    accent: 'primary',
  },
  {
    role: 'DevOps & Test Automation Engineer', company: 'QUPS', context: 'Dhaka, Bangladesh',
    period: 'Sep 2023 — Aug 2024',
    body: 'Built Robot Framework + Appium suites into GitHub Actions and GitLab CI. Ran JMeter and Locust for SLA validation. Containerised everything on Docker + Kubernetes — deployment failures down ~30%.',
    stack: ['Robot Framework', 'Appium', 'JMeter', 'Docker', 'Kubernetes'],
    accent: 'tertiary',
  },
  {
    role: 'DevTestOps Engineer', company: 'Aptovet', context: 'Dhaka, Bangladesh · Hybrid',
    period: 'Jun 2022 — Sep 2023',
    body: 'Designed POM-based Java + Selenium + JUnit frameworks plus Cypress fast-feedback suites. Automated backend validation with REST Assured and Newman — manual API time cut in half.',
    stack: ['Java', 'Selenium', 'Cypress', 'REST Assured', 'Newman'],
    accent: 'secondary',
  },
  {
    role: 'QA Engineer (DevOps Intern)', company: 'Compozent', context: 'Remote, India',
    period: 'Mar 2022 — Jun 2022',
    body: 'Functional, regression, smoke, and exploratory testing with Jira-tracked defects. First hands-on with Docker containerisation and cloud release management.',
    stack: ['Manual QA', 'Jira', 'Docker', 'Linux'],
    accent: 'primary',
  },
];

const PROJECTS = [
  { title: 'E2E Automation Infrastructure', client: 'Kintsugi · 2024 — Present', img: '/e2e_dashboard.png',
    body: "Architected Kintsugi's entire E2E framework — Playwright (TypeScript), POM, Allure reporting, Slack notifications wired into GitHub Actions. Cut manual regression ~40%.",
    tags: ['Playwright', 'TypeScript', 'Allure', 'Slack API'], accent: 'primary' },
  { title: 'API Regression Pipeline', client: 'Kintsugi · 2024', img: '/api_data_flow.png',
    body: 'Postman collections with Chai + JSON Schema validating 28+ integration contracts (Shopify, Stripe, NetSuite, QuickBooks, Zuora, …) running on Newman in CI — zero manual intervention.',
    tags: ['Newman CLI', 'Postman', 'Chai', 'JSON Schema'], accent: 'tertiary' },
  { title: 'NLP Research — BanglaBERT MTL', client: 'IEEE 3ICT · 2025', img: '/ai_neural_net.png',
    body: 'Co-authored a dual-headed BanglaBERT transformer using Multi-Task Learning for simultaneous topic and sentiment classification on Bangla news data — outperforming single-task baselines.',
    tags: ['PyTorch', 'BanglaBERT', 'Transformers', 'MTL'], accent: 'secondary' },
  { title: 'Cross-Browser Cypress Suite', client: 'Aptovet · 2023', img: '/cypress_dashboard.png',
    body: 'Cypress (JavaScript) E2E + cross-browser suites complementing heavier Selenium packs — shorter frontend feedback loops and earlier regression catches before staging.',
    tags: ['Cypress', 'JavaScript', 'CI/CD'], accent: 'primary' },
  { title: 'Enterprise POM Framework', client: 'Aptovet · 2022 — 2023', img: '/selenium_framework.png',
    body: 'Java + Selenium WebDriver + JUnit + Docker, strict Page Object Model architecture for long-term maintainability across environments and broad UI regression coverage.',
    tags: ['Java', 'Selenium', 'JUnit', 'Docker'], accent: 'tertiary' },
  { title: 'Android Mobile Automation', client: 'QUPS · 2023 — 2024', img: '/appium_mobile.png',
    body: 'Appium-based Android automated suites integrated into the GitLab CI DevOps lifecycle — every build produced signed, validated artifacts.',
    tags: ['Appium', 'Android', 'GitLab CI'], accent: 'secondary' },
  { title: 'Robot Framework + Load Testing', client: 'QUPS · 2023 — 2024', img: '/robot_automation.png',
    body: 'Keyword-driven Robot Framework suites with JMeter + Locust performance harnesses for SLA compliance under peak traffic. CI failure rates down 30%+.',
    tags: ['Robot Framework', 'JMeter', 'Locust', 'Python'], accent: 'primary' },
];

const TESTIMONIALS = [
  { quote: "Badrul rebuilt our deployment confidence from zero. The Playwright + Allure + Slack pipeline he architected surfaces regressions the same hour a PR lands — it changed how we ship.",
    name: 'Engineering Lead', title: 'Kintsugi · AI Sales Tax Platform', accent: 'primary' },
  { quote: 'Rare combination of rigorous QA methodology and real DevOps chops. His containerised Robot Framework setup cut our CI failure rate by over 30% in the first month.',
    name: 'CTO', title: 'QUPS', accent: 'tertiary' },
  { quote: 'He automated API validation across 15+ microservices with REST Assured and Newman, cutting manual test time roughly in half. Release cadence doubled without sacrificing quality.',
    name: 'Lead Developer', title: 'Aptovet', accent: 'secondary' },
  { quote: 'Top Rated on Upwork for a reason. Clear communication, production-quality frameworks, careful defect triage. Delivered a Playwright suite for our checkout in under two weeks.',
    name: 'Upwork Client', title: 'E-commerce SaaS · 5.0 ★', accent: 'primary' },
  { quote: 'Badrul documented every P0–P3 defect with a clarity our engineers actually enjoyed reading. Reproduction steps, logs, expected vs. actual — textbook QA discipline.',
    name: 'Product Manager', title: 'Kintsugi', accent: 'tertiary' },
  { quote: 'He mentored two junior testers on POM and CI integration while still delivering his own roadmap. The team left stronger than he found it.',
    name: 'QA Manager', title: 'Aptovet', accent: 'secondary' },
];

const TECH = ['Playwright', 'TypeScript', 'Selenium', 'Cypress', 'Appium', 'Robot Framework', 'Postman', 'Newman', 'JMeter', 'Locust', 'Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins', 'AWS', 'REST Assured'];

const TOOLS = [
  { name: 'Playwright',      tag: 'E2E · Modern Web',        color: '#45BA4B', years: '2 yrs', proficiency: 95, use: 'Primary E2E framework at Kintsugi — TypeScript + POM + Allure.', snippet: "await page.click('#submit')" },
  { name: 'Selenium',        tag: 'Cross-browser · Java',    color: '#59B73B', years: '3 yrs', proficiency: 90, use: 'Enterprise POM frameworks with JUnit + Docker at Aptovet.',     snippet: "driver.findElement(By.id())" },
  { name: 'Cypress',         tag: 'Fast feedback · JS',      color: '#69D3A7', years: '2 yrs', proficiency: 85, use: 'Cross-browser fast-feedback suites complementing Selenium.',      snippet: "cy.get('.btn').click()" },
  { name: 'Appium',          tag: 'Mobile · Android',        color: '#A47AE2', years: '1.5 yrs', proficiency: 80, use: 'Android mobile automation wired into GitLab CI at QUPS.',        snippet: "driver.tap(button)" },
  { name: 'Robot Framework', tag: 'Keyword-driven · BDD',    color: '#3FCBE8', years: '1.5 yrs', proficiency: 85, use: 'Python keyword-driven suites; CI failures down 30%.',           snippet: "Click Element  id=login" },
  { name: 'Postman',         tag: 'API · Newman CLI',        color: '#FF8A4C', years: '4 yrs', proficiency: 95, use: 'Postman + Newman + Chai validating 28+ contracts on every commit.', snippet: "newman run regression.json" },
  { name: 'JMeter',          tag: 'Performance · Load',      color: '#FF6B8A', years: '1.5 yrs', proficiency: 75, use: 'SLA validation under peak traffic during QUPS scaling.',         snippet: "jmeter -n -t plan.jmx" },
  { name: 'Docker',          tag: 'Containerised tests',     color: '#5BB3FF', years: '3 yrs', proficiency: 88, use: 'Reproducible test environments across CI and dev machines.',     snippet: "docker compose up tests" },
  { name: 'Kubernetes',      tag: 'Orchestrated test infra', color: '#7B9CFF', years: '1.5 yrs', proficiency: 75, use: 'Managed scalable testing pods; eliminated env-specific failures.', snippet: "kubectl apply -f tests/" },
  { name: 'GitHub Actions',  tag: 'CI/CD pipelines',         color: '#C4A6FF', years: '3 yrs', proficiency: 92, use: 'All Kintsugi test pipelines run here with Slack + Allure outputs.', snippet: "uses: actions/checkout@v4" },
];

const accentMap = {
  primary: { text: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/10', borderHover: 'hover:border-primary/50', grad: 'from-primary' },
  secondary: { text: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/10', borderHover: 'hover:border-secondary/50', grad: 'from-secondary' },
  tertiary: { text: 'text-tertiary', border: 'border-tertiary/30', bg: 'bg-tertiary/10', borderHover: 'hover:border-tertiary/50', grad: 'from-tertiary' },
};

/* ───────────────────────── APP ───────────────────────── */
function App() {
  const reduced = useReducedMotion();

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      wheelMultiplier: 1.1,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Project stacking (kept from v1)
    gsap.utils.toArray('.project-card').forEach((card, i, cards) => {
      if (i === cards.length - 1) return;
      gsap.to(card, {
        scale: 0.92, opacity: 0.4, yPercent: -5,
        scrollTrigger: {
          trigger: card, start: 'top 100px', endTrigger: cards[i + 1], end: 'top 100px',
          scrub: true, invalidateOnRefresh: true,
        },
      });
    });

    setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => lenis.destroy();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <WebGLBackground />
      <QABackdrop density={32} />
      {!reduced && <Spotlight />}
      <CursorLabel />
      <ScrollProgress />
      <SectionIndicator
        sections={[
          { id: 'about', label: 'About' },
          { id: 'experience', label: 'Experience' },
          { id: 'projects', label: 'Work' },
          { id: 'toolkit', label: 'Toolkit' },
          { id: 'feedback', label: 'Feedback' },
          { id: 'contact', label: 'Contact' },
        ]}
      />
      <div className="noise-overlay" />

      <div className="relative z-10 w-full font-sans overflow-hidden">

        {/* ───── NAV ───── */}
        <HidingNav className="fixed top-0 inset-x-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between rounded-full border border-white/10 bg-background/40 backdrop-blur-2xl px-6 py-3">
            <Magnetic strength={0.3}>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 group">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" />
                </span>
                <span className="font-display font-bold text-sm tracking-[0.3em] text-white">BADRUL</span>
              </button>
            </Magnetic>
            <ul className="hidden md:flex items-center gap-1 text-xs font-semibold tracking-widest text-white/70">
              {[['ABOUT','about'], ['WORK','projects'], ['TOOLKIT','toolkit'], ['EXPERIENCE','experience'], ['FEEDBACK','feedback']].map(([l,id]) => (
                <li key={id}>
                  <button data-cursor="JUMP" onClick={() => scrollTo(id)} className="px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-colors">
                    <ScrambleText text={l} />
                  </button>
                </li>
              ))}
            </ul>
            <Magnetic strength={0.3}>
              <button data-cursor="HIRE ME" onClick={() => scrollTo('contact')} className="flex items-center gap-2 bg-white text-background px-5 py-2.5 rounded-full text-xs font-bold tracking-widest hover:bg-primary transition-colors group">
                LET'S TALK <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-500" />
              </button>
            </Magnetic>
          </div>
        </HidingNav>

        {/* ───── HERO ───── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Aurora */}
          <div className="absolute inset-0 -z-0 pointer-events-none">
            <div className="aurora animate-float-slow" style={{ width: 600, height: 600, background: '#adc6ff', top: '10%', left: '10%' }} />
            <div className="aurora animate-float-slower" style={{ width: 500, height: 500, background: '#c4abff', bottom: '5%', right: '10%', opacity: 0.3 }} />
            <div className="aurora animate-float-slow" style={{ width: 350, height: 350, background: '#4ae176', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.18 }} />
          </div>
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none -z-0" />

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
            className="relative z-10 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl mb-10 shimmer-btn"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
            </span>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/80">Available · Q3 2026</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/60">Dhaka · GMT+6</span>
          </motion.div>

          {/* Kinetic name */}
          <h1 className="relative z-10 text-center font-display font-bold tracking-[-0.04em] leading-[0.85] text-white text-glow">
            <span className="block text-[18vw] md:text-[14vw] lg:text-[12vw]">
              <BlurReveal text="BADRUL" />
            </span>
            {/* ALAM animates as a whole word so the gradient text-fill renders cleanly */}
            <motion.span
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, filter: 'blur(14px)' }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: reduced ? 0.4 : 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="block text-[18vw] md:text-[14vw] lg:text-[12vw] gradient-text"
            >
              ALAM
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="relative z-10 mt-10 flex flex-col items-center gap-3"
          >
            <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-white/50 flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />
              Software QA Engineer
              <span className="h-px w-8 bg-white/30" />
            </p>
            <p className="text-base md:text-lg text-on-surface-variant max-w-xl text-center">
              Building production-grade test infrastructure for AI, fintech, and e-commerce platforms.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="relative z-10 mt-10 flex items-center gap-4 flex-wrap justify-center"
          >
            <Magnetic>
              <button onClick={() => scrollTo('projects')} className="group flex items-center gap-3 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-[position:100%_0] text-background px-7 py-4 rounded-full text-sm font-bold tracking-widest transition-all duration-700 shadow-[0_10px_40px_-10px_rgba(173,198,255,0.5)]">
                VIEW WORK
                <ArrowDownRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
              </button>
            </Magnetic>
            <Magnetic>
              <a href="/Badrul_Alam_Resume.pdf" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-7 py-4 rounded-full text-sm font-bold tracking-widest border border-white/20 text-white hover:bg-white/5 transition-colors">
                <FileText className="w-4 h-4" /> RESUME
              </a>
            </Magnetic>
          </motion.div>

          {/* Side rails */}
          <div className="hidden md:flex absolute left-8 bottom-10 flex-col gap-5 items-center text-white/40">
            <Magnetic strength={0.5}>
              <a data-cursor="GITHUB" href="https://github.com/badrul-org" target="_blank" rel="noreferrer" className="block hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a data-cursor="LINKEDIN" href="https://www.linkedin.com/in/badrul02" target="_blank" rel="noreferrer" className="block hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
            </Magnetic>
            <span className="h-16 w-px bg-white/20" />
          </div>
          <div className="hidden md:flex absolute right-8 bottom-10 flex-col gap-2 items-center font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 [writing-mode:vertical-rl]">
            scroll · explore
          </div>
        </section>

        {/* ───── SCROLL-VELOCITY MARQUEE (Jessica-Wells style) ───── */}
        <div className="relative border-y border-white/5 bg-surface-high/10 backdrop-blur-md py-10 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#040d18] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#040d18] to-transparent z-10 pointer-events-none" />
          <ScrollVelocityMarquee baseVelocity={60}>
            {TECH.map((t) => (
              <span key={t} className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white/15 hover:text-primary transition-colors px-8 inline-flex items-center gap-8">
                {t}
                <span className="w-3 h-3 rounded-full bg-primary/40 inline-block" />
              </span>
            ))}
          </ScrollVelocityMarquee>
        </div>

        {/* ───── ABOUT BENTO ───── */}
        <section id="about" className="relative py-32 px-6 md:px-12">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="aurora animate-float-slower" style={{ width: 500, height: 500, background: '#c4abff', top: '20%', right: '-10%', opacity: 0.18 }} />

          <div className="max-w-7xl mx-auto relative">
            <FadeUp className="mb-16">
              <p className="text-primary font-mono text-xs tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" /> [ 01 ] About
              </p>
              <MaskReveal
                as="h2"
                text="Quality is engineered — not inspected on the way out."
                className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight leading-[1.1] max-w-4xl block"
                stagger={0.06}
                duration={1.2}
              />
            </FadeUp>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[180px]">
              {/* Tall intro card — slides in from LEFT, with rotating conic ring */}
              <SlideIn from="left" distance={120} duration={1.1} className="md:col-span-3 md:row-span-2">
                <TiltCard className="h-full group">
                  <ConicBorder className="h-full" radius="1.5rem" speed={8}>
                  <div className="relative h-full bg-surface-high/30 backdrop-blur-xl rounded-3xl p-8 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                    <div className="flex items-center gap-2 text-primary font-mono text-[11px] tracking-widest uppercase mb-6">
                      <Sparkles className="w-3.5 h-3.5" /> Currently
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-white font-bold mb-4 leading-snug">
                      Sole QA owner at Kintsugi — an AI-driven sales tax platform with 28+ live integrations.
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed">
                      Owning Playwright E2E, Newman API regression, and manual integration coverage end-to-end. Reduced manual regression by ~40% and cut release validation time so engineering ships faster, with confidence.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {['Playwright', 'TypeScript', 'Allure', 'Newman'].map(t => (
                        <span key={t} className="px-3 py-1 text-xs font-mono rounded-full border border-white/10 bg-white/5 text-white/80">{t}</span>
                      ))}
                    </div>
                  </div>
                  </ConicBorder>
                </TiltCard>
              </SlideIn>

              {/* Stat tiles — slides in from RIGHT */}
              <SlideIn from="right" distance={120} duration={1.1} delay={0.1} className="md:col-span-3 md:row-span-2 grid grid-cols-2 gap-4">
                {STATS.map((s, i) => (
                  <TiltCard key={s.label} className="h-full group">
                    <div className="relative h-full grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-6 overflow-hidden flex flex-col justify-between min-h-[180px]">
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                      <s.icon className="w-5 h-5 text-primary/70" />
                      <div>
                        <div className="font-display text-4xl md:text-5xl gradient-text font-bold leading-none">
                          <AnimatedCounter to={s.value} suffix={s.suffix} duration={1.5 + i * 0.2} />
                        </div>
                        <div className="text-on-surface-variant text-[11px] tracking-[0.2em] uppercase font-bold mt-2">{s.label}</div>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </SlideIn>

              {/* Long philosophy bar — slides in from LEFT */}
              <SlideIn from="left" distance={140} duration={1.2} className="md:col-span-6">
                <TiltCard className="group" max={4}>
                  <div className="relative grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-8 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="max-w-3xl">
                        <p className="text-tertiary font-mono text-[11px] tracking-widest uppercase mb-3 flex items-center gap-2">
                          <Quote className="w-3.5 h-3.5" /> Philosophy
                        </p>
                        <p className="text-white text-xl md:text-2xl leading-snug font-display">
                          “Tests outlive features. The infrastructure I build is what survives the next refactor.”
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-white/60 text-sm">
                        <Globe2 className="w-4 h-4" /> Open to remote — anywhere · GMT+6
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </SlideIn>
            </div>

            {/* Services Grid */}
            <FadeUp className="mt-20 mb-8">
              <p className="text-secondary font-mono text-xs tracking-[0.4em] uppercase mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-secondary" /> What I do
              </p>
              <h3 className="font-display text-3xl md:text-4xl text-white font-bold tracking-tight">Six things I bring to a team.</h3>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s, i) => (
                <SlideIn key={s.title} from={i % 2 === 0 ? 'left' : 'right'} distance={80} duration={0.9} delay={(i % 3) * 0.08}>
                  <TiltCard className="h-full group">
                    <div className="h-full grad-border bg-surface-high/20 backdrop-blur-xl rounded-2xl p-6 hover:bg-surface-high/40 transition-colors">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                        <s.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-white font-semibold text-lg mb-2">{s.title}</h4>
                      <p className="text-on-surface-variant text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </TiltCard>
                </SlideIn>
              ))}
            </div>
          </div>
        </section>

        {/* ───── EXPERIENCE TIMELINE ───── */}
        <section id="experience" className="relative py-32 px-6 md:px-12 overflow-hidden">
          <div className="aurora animate-float-slow" style={{ width: 450, height: 450, background: '#adc6ff', top: '30%', left: '-10%', opacity: 0.18 }} />

          <div className="max-w-6xl mx-auto relative">
            <FadeUp className="mb-20">
              <p className="text-primary font-mono text-xs tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" /> [ 02 ] Experience
              </p>
              <MaskReveal
                as="h2"
                text="Architecting flawless systems."
                className="font-display text-5xl md:text-7xl text-white font-bold tracking-tight leading-[1.05] block"
                stagger={0.08}
                duration={1.3}
              />
            </FadeUp>

            <div className="relative pl-6 md:pl-10 border-l border-white/10">
              {EXPERIENCES.map((exp, idx) => {
                const a = accentMap[exp.accent];
                return (
                  <FadeUp key={idx} delay={idx * 0.05} className="relative mb-12 last:mb-0">
                    <span className={`absolute -left-[33px] md:-left-[49px] top-8 w-4 h-4 rounded-full border-4 border-background ${a.bg.replace('/10', '')} bg-gradient-to-br ${a.grad} to-transparent`} />
                    <TiltCard className="group" max={4}>
                      <div className="grad-border bg-surface-high/30 backdrop-blur-2xl rounded-3xl p-8 md:p-10 hover:bg-surface-high/50 transition-colors duration-500 relative overflow-hidden">
                        <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br ${a.grad} to-transparent opacity-0 group-hover:opacity-15 blur-3xl transition-opacity duration-700 pointer-events-none`} />
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-5">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-2xl md:text-3xl text-white font-bold font-display">{exp.role}</h3>
                            </div>
                            <p className={`${a.text} text-sm tracking-widest uppercase font-bold`}>{exp.company}</p>
                          </div>
                          <div className="flex flex-col md:items-end gap-1 shrink-0">
                            <span className="font-mono text-xs text-white/60 tracking-widest">{exp.period}</span>
                            <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">{exp.context}</span>
                          </div>
                        </div>
                        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-6 max-w-3xl">{exp.body}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.stack.map(t => (
                            <span key={t} className="px-3 py-1.5 text-[11px] font-mono rounded-full border border-white/10 bg-white/5 text-white/80">{t}</span>
                          ))}
                        </div>
                      </div>
                    </TiltCard>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── PROJECTS (stacking) ───── */}
        <section id="projects" className="relative py-32 px-6 md:px-12 bg-[#030b14]/50">
          <div className="max-w-6xl mx-auto">
            <FadeUp className="mb-20">
              <p className="text-primary font-mono text-xs tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" /> [ 03 ] Selected Work
              </p>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <MaskReveal
                  as="h2"
                  text="Featured case studies"
                  className="font-display text-5xl md:text-7xl text-white font-bold tracking-tight block"
                  stagger={0.09}
                  duration={1.3}
                />
                <p className="text-white/50 font-mono text-xs tracking-widest uppercase">[ Scroll to stack ↓ ]</p>
              </div>
            </FadeUp>

            <div className="relative">
              {PROJECTS.map((p, i) => {
                const a = accentMap[p.accent];
                const isLast = i === PROJECTS.length - 1;
                return (
                  <div
                    key={p.title}
                    data-cursor="VIEW"
                    className={`project-card sticky top-[100px] w-full h-[65vh] grad-border bg-surface-high/30 rounded-[2.5rem] overflow-hidden ${isLast ? 'mb-8' : 'mb-24'} group ${a.borderHover} transition-colors duration-500`}
                  >
                    <ClipReveal from="bottom" duration={1.6} className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010912] via-[#010912]/85 to-transparent z-10" />
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000" />
                    </ClipReveal>
                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-10">
                      <div className="flex items-start justify-between">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${a.border} ${a.bg} text-[11px] ${a.text} font-mono tracking-widest uppercase backdrop-blur-md`}>
                          <Code2 className="w-3 h-3" /> {String(i + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
                        </span>
                        <span className={`hidden md:inline-flex items-center gap-2 ${a.text} text-xs font-mono tracking-widest uppercase`}>
                          <Rocket className="w-3 h-3" /> Case Study
                        </span>
                      </div>
                      <div className="bg-background/50 backdrop-blur-2xl p-7 md:p-9 rounded-3xl border border-white/10 max-w-4xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                        <p className={`${a.text} font-mono text-[11px] tracking-widest uppercase mb-3 font-bold`}>{p.client}</p>
                        <h3 className="text-2xl md:text-4xl text-white font-bold mb-4 font-display leading-tight">{p.title}</h3>
                        <p className="text-white/80 text-sm md:text-base leading-relaxed mb-5">{p.body}</p>
                        <div className="flex gap-2 flex-wrap">
                          {p.tags.map(t => (
                            <span key={t} className={`px-3 py-1.5 rounded-full border ${a.border} ${a.bg} text-[11px] ${a.text} font-mono font-bold`}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── 3D TOOL CAROUSEL ───── */}
        <section id="toolkit" className="relative py-32 px-6 md:px-12 overflow-hidden bg-[#020812]">
          {/* Solid backdrop so transparent carousel cards read cleanly */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(173,198,255,0.08)_0%,transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative">
            <FadeUp className="mb-20 text-center">
              <p className="text-primary font-mono text-xs tracking-[0.4em] uppercase mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-primary" /> [ Toolkit ]
              </p>
              <MaskReveal
                as="h2"
                text="Tools I command"
                className="font-display text-5xl md:text-7xl text-white font-bold tracking-tight block"
                stagger={0.1}
                duration={1.3}
              />
              <p className="text-on-surface-variant mt-4 max-w-xl mx-auto">
                Drag, swipe, or use the arrows. Each tool is one I've shipped to production.
              </p>
            </FadeUp>

            <div data-cursor="DRAG">
            <Carousel3D
              items={TOOLS}
              cardWidth={340}
              cardHeight={460}
              autoPlayMs={4500}
              renderCard={(tool, _, isActive) => (
                <div
                  className="relative w-full h-full rounded-[2rem] overflow-hidden flex flex-col"
                  style={{
                    // Solid layered background — no transparency leaking through
                    background: `linear-gradient(180deg, #0e1a2c 0%, #07111e 100%)`,
                    border: `1px solid ${isActive ? tool.color + '88' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isActive
                      ? `0 40px 100px -20px ${tool.color}66, 0 0 80px -20px ${tool.color}44, inset 0 1px 0 0 rgba(255,255,255,0.08)`
                      : '0 20px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.04)',
                  }}
                >
                  {/* Top color band with mono pattern */}
                  <div
                    className="relative h-[150px] overflow-hidden flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${tool.color}, ${tool.color}99)`,
                    }}
                  >
                    {/* dot pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                        backgroundSize: '14px 14px',
                      }}
                    />
                    {/* Big monogram */}
                    <span className="relative font-display text-[8rem] leading-none font-black text-white/95 drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      {tool.name.charAt(0)}
                    </span>
                    {/* Years pill */}
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 font-mono text-[10px] tracking-widest uppercase text-white">
                      {tool.years}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div>
                      <p
                        className="font-mono text-[10px] tracking-[0.3em] uppercase font-bold mb-2"
                        style={{ color: tool.color }}
                      >
                        {tool.tag}
                      </p>
                      <h3 className="font-display text-3xl text-white font-bold leading-none">
                        {tool.name}
                      </h3>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed">{tool.use}</p>

                    {/* Code snippet chip */}
                    <div className="mt-auto">
                      <div className="font-mono text-[11px] text-white/60 px-3 py-2 rounded-lg bg-black/40 border border-white/10 truncate">
                        <span style={{ color: tool.color }}>$</span> {tool.snippet}
                      </div>

                      {/* Proficiency bar */}
                      <div className="mt-4 flex items-center gap-3">
                        <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">Proficiency</span>
                        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: isActive ? `${tool.proficiency}%` : '0%' }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: isActive ? 0.2 : 0 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${tool.color}, ${tool.color}cc)` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold" style={{ color: tool.color }}>
                          {tool.proficiency}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
            </div>
          </div>
        </section>

        {/* ───── EDUCATION & PUBLICATION ───── */}
        <section className="relative py-32 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <FadeUp className="mb-16">
              <p className="text-primary font-mono text-xs tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" /> [ 04 ] Credentials
              </p>
              <MaskReveal
                as="h2"
                text="Education & publication"
                className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight block"
                stagger={0.08}
                duration={1.2}
              />
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-6">
              <FadeUp>
                <TiltCard className="h-full group">
                  <div className="h-full grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-10 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary/15 blur-3xl" />
                    <GraduationCap className="w-7 h-7 text-primary mb-6" />
                    <p className="text-primary font-mono text-[11px] tracking-widest uppercase font-bold mb-3">[ Education ]</p>
                    <h3 className="text-2xl text-white font-bold font-display mb-2 leading-snug">B.Sc. in Computer Science & Engineering</h3>
                    <p className="text-on-surface-variant mb-4">Daffodil International University · Dhaka, Bangladesh</p>
                    <div className="flex items-center gap-4 font-mono text-sm">
                      <span className="text-white/60">May 2021 — Jun 2025</span>
                      <span className="text-tertiary">CGPA <AnimatedCounter to={3.44} /> / 4.00</span>
                    </div>
                  </div>
                </TiltCard>
              </FadeUp>
              <FadeUp delay={0.1}>
                <TiltCard className="h-full group">
                  <div className="h-full grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-10 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-secondary/15 blur-3xl" />
                    <BookOpen className="w-7 h-7 text-secondary mb-6" />
                    <p className="text-secondary font-mono text-[11px] tracking-widest uppercase font-bold mb-3">[ IEEE Publication · 2025 ]</p>
                    <h3 className="text-2xl text-white font-bold font-display mb-3 leading-snug">Advancing Bangla NLP: A Dual-Headed Transformer Model</h3>
                    <p className="text-on-surface-variant leading-relaxed">
                      Published and presented at the IEEE 3ICT Conference. Novel BanglaBERT architecture using Multi-Task Learning for simultaneous topic and sentiment classification — outperforming single-task baselines.
                    </p>
                  </div>
                </TiltCard>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ───── TESTIMONIALS ───── */}
        <section id="feedback" className="relative py-32 overflow-hidden">
          <div className="aurora animate-float-slow" style={{ width: 500, height: 500, background: '#c4abff', top: '20%', right: '-10%', opacity: 0.22 }} />
          <div className="aurora animate-float-slower" style={{ width: 400, height: 400, background: '#4ae176', bottom: '10%', left: '-10%', opacity: 0.15 }} />

          <FadeUp className="max-w-6xl mx-auto px-6 md:px-12 mb-16 text-center">
            <p className="text-primary font-mono text-xs tracking-[0.4em] uppercase mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-primary" /> [ 05 ] Feedback
            </p>
            <MaskReveal
              as="h2"
              text="What teams say"
              className="font-display text-5xl md:text-7xl text-white font-bold block"
              stagger={0.1}
              duration={1.3}
            />
          </FadeUp>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-[#040d18] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-[#040d18] to-transparent z-20 pointer-events-none" />

            <Marquee speed={70}>
              {TESTIMONIALS.map((t, i) => {
                const a = accentMap[t.accent];
                return (
                  <div key={i} className={`w-[340px] md:w-[460px] shrink-0 grad-border bg-surface-high/30 backdrop-blur-2xl rounded-[2rem] p-9 relative overflow-hidden ${a.borderHover} transition-colors group`}>
                    <Quote className={`absolute top-6 right-6 w-12 h-12 ${a.text} opacity-15 group-hover:opacity-30 transition-opacity`} />
                    <div className="flex items-center gap-1 text-tertiary mb-5 text-sm">
                      {'★★★★★'.split('').map((s, idx) => <span key={idx}>{s}</span>)}
                    </div>
                    <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 min-h-[170px]">{t.quote}</p>
                    <div className="flex items-center gap-4 pt-5 border-t border-white/10">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${a.grad} to-background border ${a.border} shrink-0 flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{t.name}</div>
                        <div className={`${a.text} tracking-widest text-[10px] uppercase font-bold mt-0.5`}>{t.title}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Marquee>
          </div>
        </section>

        {/* ───── CONTACT ───── */}
        <section id="contact" className="relative py-32 px-6 md:px-12 bg-[#010912] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(173,198,255,0.15)_0%,transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="aurora animate-float-slow" style={{ width: 600, height: 600, background: '#adc6ff', bottom: '-30%', left: '30%', opacity: 0.2 }} />

          <div className="max-w-7xl mx-auto relative">
            <FadeUp className="mb-16 max-w-3xl">
              <p className="text-primary font-mono text-xs tracking-[0.4em] uppercase mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" /> [ 06 ] Let's collaborate
              </p>
              <MaskReveal
                as="h2"
                text="Let's build perfection."
                className="font-display text-5xl md:text-[5vw] text-white font-bold tracking-tighter leading-[0.95] block"
                stagger={0.1}
                duration={1.4}
              />
              <p className="text-on-surface-variant text-lg md:text-xl mt-6 max-w-xl">
                Ready to eliminate deployment anxiety and scale your QA infrastructure? I reply within one business day.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
              {/* Left: contact tiles */}
              <FadeUp className="lg:col-span-2 flex flex-col gap-4">
                <a data-cursor="EMAIL" href="mailto:badrul.testops@gmail.com" className="group grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-6 flex items-center gap-5 hover:bg-surface-high/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white/50 font-mono text-[10px] tracking-widest uppercase">Email</p>
                    <p className="text-white text-base font-semibold truncate">badrul.testops@gmail.com</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </a>
                <a data-cursor="CALL" href="tel:+8801793693774" className="group grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-6 flex items-center gap-5 hover:bg-surface-high/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary/15 border border-tertiary/30 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-tertiary" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white/50 font-mono text-[10px] tracking-widest uppercase">Phone</p>
                    <p className="text-white text-base font-semibold">+880 1793-693774</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-tertiary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </a>
                <div className="grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-secondary" /></div>
                  <div>
                    <p className="text-white/50 font-mono text-[10px] tracking-widest uppercase">Location</p>
                    <p className="text-white text-base font-semibold">Dhaka, Bangladesh · GMT+6</p>
                  </div>
                </div>
                <div className="grad-border bg-surface-high/30 backdrop-blur-xl rounded-3xl p-6 flex flex-wrap gap-3 items-center">
                  <p className="text-white/50 font-mono text-[10px] tracking-widest uppercase w-full mb-2">Find me on</p>
                  <a href="https://www.linkedin.com/in/badrul02" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-xs font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-colors">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href="https://github.com/badrul-org" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-xs font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-colors">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <a href="https://www.upwork.com/freelancers/badrul11" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-xs font-bold tracking-widest uppercase hover:border-tertiary hover:text-tertiary transition-colors">
                    <Trophy className="w-3.5 h-3.5" /> Upwork
                  </a>
                </div>
              </FadeUp>

              {/* Right: form */}
              <FadeUp delay={0.1} className="lg:col-span-3">
                <div className="grad-border bg-surface-high/30 backdrop-blur-2xl rounded-3xl p-8 md:p-10 h-full">
                  <form action="https://formspree.io/f/mjgjlvyo" method="POST" className="space-y-7">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2 group">
                        <label className="text-secondary text-[10px] font-bold tracking-[0.3em] uppercase">Name</label>
                        <input type="text" name="name" required className="bg-transparent border-b border-white/20 pb-3 text-white text-lg focus:outline-none focus:border-primary transition-colors" placeholder="Your name" />
                      </div>
                      <div className="flex flex-col gap-2 group">
                        <label className="text-secondary text-[10px] font-bold tracking-[0.3em] uppercase">Email</label>
                        <input type="email" name="email" required className="bg-transparent border-b border-white/20 pb-3 text-white text-lg focus:outline-none focus:border-primary transition-colors" placeholder="you@company.com" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 group">
                      <label className="text-secondary text-[10px] font-bold tracking-[0.3em] uppercase">Project Details</label>
                      <textarea name="message" required className="bg-transparent border-b border-white/20 pb-3 text-white text-lg focus:outline-none focus:border-primary transition-colors resize-none h-28" placeholder="Tell me about your QA needs…" />
                    </div>
                    <Magnetic>
                      <button type="submit" className="shimmer-btn group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-[position:100%_0] text-background font-bold text-base px-10 py-5 rounded-full transition-all duration-700 uppercase tracking-[0.25em] glow-pulse">
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Send Message
                      </button>
                    </Magnetic>
                  </form>
                </div>
              </FadeUp>
            </div>

            <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center text-on-surface-variant text-xs font-mono tracking-widest uppercase">
              <p>© {new Date().getFullYear()} Badrul Alam · Crafted in Dhaka with React, Three.js & Framer Motion</p>
              <div className="flex gap-6">
                <a href="https://www.linkedin.com/in/badrul02" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="https://github.com/badrul-org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                <a href="https://www.upwork.com/freelancers/badrul11" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Upwork</a>
              </div>
            </footer>
          </div>
        </section>

      </div>
    </>
  );
}

export default App;
