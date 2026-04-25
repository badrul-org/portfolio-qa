import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 3D WEBGL COMPONENTS ---

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

    gsap.to(ref.current.position, {
      x: mouse.x * 1,
      y: mouse.y * 1,
      duration: 3,
      ease: 'power3.out'
    });
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent opacity={0.15} color="#adc6ff" size={0.015} sizeAttenuation={true} depthWrite={false} blending={2} />
      </Points>
    </group>
  );
}

function CameraController() {
  useFrame((state) => {
    const scrollY = window.scrollY;
    gsap.to(state.camera.position, {
      z: 15 - scrollY * 0.005,
      y: -scrollY * 0.002,
      duration: 0.5,
      ease: 'power1.out'
    });
  });
  return null;
}

function WebGLBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-background pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15] }}>
        <color attach="background" args={['#051424']} />
        <ambientLight intensity={0.5} />
        <ParticleField />
        <CameraController />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#051424_100%)] pointer-events-none opacity-80" />
    </div>
  );
}

// --- DOM ANIMATION UTILS ---

const SplitText = ({ children, className }) => {
  return (
    <span className={className} style={{ display: 'inline-block', overflow: 'hidden' }}>
      {children.split('').map((char, i) => (
        <span key={i} className="split-char inline-block" style={{ transform: 'translateY(100%)' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const Magnetic = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const mouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.4);
      yTo(y * 0.4);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);

    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref });
};

// --- DATA ---

const EXPERIENCES = [
  {
    role: 'Software QA Engineer',
    company: 'Kintsugi',
    context: 'AI-driven Sales Tax Automation · Remote, United States',
    period: 'Sep 2024 — Present',
    body: 'Sole QA owner for a platform spanning 28+ integrations across e-commerce, ERP, billing, and payments. Built the entire Playwright (TypeScript) + Allure test infrastructure from scratch, integrated with GitHub Actions and Slack for real-time build visibility, cutting manual regression ~40%.',
    stack: ['Playwright', 'TypeScript', 'Allure', 'Newman', 'GitHub Actions'],
    accent: 'primary'
  },
  {
    role: 'DevOps & Test Automation Engineer',
    company: 'QUPS',
    context: 'Dhaka, Bangladesh',
    period: 'Sep 2023 — Aug 2024',
    body: 'Built Robot Framework and Appium automation into GitHub Actions and GitLab CI pipelines. Ran JMeter and Locust performance tests to validate scalability, and managed containerized environments on Docker and Kubernetes — reducing deployment failures by ~30%.',
    stack: ['Robot Framework', 'Appium', 'JMeter', 'Docker', 'Kubernetes'],
    accent: 'tertiary'
  },
  {
    role: 'DevTestOps Engineer',
    company: 'Aptovet',
    context: 'Dhaka, Bangladesh · Hybrid',
    period: 'Jun 2022 — Sep 2023',
    body: 'Designed POM-based automation frameworks in Java + Selenium WebDriver + JUnit, and complementary Cypress suites for faster frontend feedback. Automated backend validation with REST Assured and Newman, cutting manual API validation time in half.',
    stack: ['Java', 'Selenium', 'Cypress', 'REST Assured', 'Newman'],
    accent: 'secondary'
  },
  {
    role: 'QA Engineer (DevOps Intern)',
    company: 'Compozent',
    context: 'Remote, India',
    period: 'Mar 2022 — Jun 2022',
    body: 'Designed and executed functional, regression, smoke, and exploratory test cases; tracked defects in Jira. Gained early hands-on experience with Docker containerization and cloud release management.',
    stack: ['Manual QA', 'Jira', 'Docker', 'Linux'],
    accent: 'primary'
  }
];

const PROJECTS = [
  {
    title: 'E2E Automation Infrastructure',
    client: 'Kintsugi · 2024 — Present',
    img: '/e2e_dashboard.png',
    body: 'Architected Kintsugi\'s entire E2E test framework from scratch — Playwright (TypeScript), Page Object Model, Allure reporting, and Slack notifications wired into GitHub Actions. Gave engineering real-time build confidence and cut manual regression cycles by ~40%.',
    tags: ['Playwright', 'TypeScript', 'Allure', 'Slack API'],
    accent: 'primary'
  },
  {
    title: 'API Regression Pipeline',
    client: 'Kintsugi · 2024',
    img: '/api_data_flow.png',
    body: 'Designed Postman collections with Chai assertions and JSON Schema validation covering 28+ integration API contracts (Shopify, Stripe, NetSuite, QuickBooks, Zuora, and more), running on Newman CLI in CI for continuous regression — zero manual intervention.',
    tags: ['Newman CLI', 'Postman', 'Chai', 'JSON Schema'],
    accent: 'tertiary'
  },
  {
    title: 'NLP Research — BanglaBERT MTL',
    client: 'IEEE 3ICT Conference · 2025',
    img: '/ai_neural_net.png',
    body: 'Co-authored a dual-headed BanglaBERT transformer using Multi-Task Learning for simultaneous topic and sentiment classification on Bangla news data — outperforming single-task baselines. Peer-reviewed, published, and presented at IEEE 3ICT 2025.',
    tags: ['PyTorch', 'BanglaBERT', 'Transformers', 'MTL'],
    accent: 'secondary'
  },
  {
    title: 'Cross-Browser Cypress Suite',
    client: 'Aptovet · 2023',
    img: '/cypress_dashboard.png',
    body: 'Built fast Cypress (JavaScript) E2E and cross-browser suites to complement heavier Selenium regression packs — shortening the frontend feedback loop and catching UI regressions before deploys reached staging.',
    tags: ['Cypress', 'JavaScript', 'CI/CD'],
    accent: 'primary'
  },
  {
    title: 'Enterprise POM Framework',
    client: 'Aptovet · 2022 — 2023',
    img: '/selenium_framework.png',
    body: 'Designed an enterprise-grade web automation framework — Java, Selenium WebDriver, JUnit, Docker — using a strict Page Object Model for long-term maintainability and broad UI regression coverage across environments.',
    tags: ['Java', 'Selenium', 'JUnit', 'Docker'],
    accent: 'tertiary'
  },
  {
    title: 'Android Mobile Automation',
    client: 'QUPS · 2023 — 2024',
    img: '/appium_mobile.png',
    body: 'Developed and maintained mobile automated test suites in Appium for Android, integrated directly into the GitLab CI DevOps lifecycle so every build produced signed, validated artifacts.',
    tags: ['Appium', 'Android', 'GitLab CI'],
    accent: 'secondary'
  },
  {
    title: 'Robot Framework + Load Testing',
    client: 'QUPS · 2023 — 2024',
    img: '/robot_automation.png',
    body: 'Deployed keyword-driven Robot Framework suites alongside JMeter and Locust performance harnesses to validate SLA compliance under peak traffic. Containerised setups reduced CI failure rates by over 30%.',
    tags: ['Robot Framework', 'JMeter', 'Locust', 'Python'],
    accent: 'primary'
  }
];

const TESTIMONIALS = [
  {
    quote: 'Badrul rebuilt our deployment confidence from zero. The Playwright + Allure + Slack pipeline he architected surfaces regressions the same hour a PR lands — it changed how we ship.',
    name: 'Engineering Lead',
    title: 'Kintsugi · AI Sales Tax Platform',
    accent: 'primary'
  },
  {
    quote: 'Rare combination of rigorous QA methodology and real DevOps chops. His containerised Robot Framework setup cut our CI failure rate by over 30% in the first month.',
    name: 'CTO',
    title: 'QUPS',
    accent: 'tertiary'
  },
  {
    quote: 'He automated API validation across 14+ microservices with REST Assured and Newman, cutting manual test time roughly in half. Our release cadence doubled without sacrificing quality.',
    name: 'Lead Developer',
    title: 'Aptovet',
    accent: 'secondary'
  },
  {
    quote: 'Top Rated on Upwork for a reason. Clear communication, production-quality frameworks, and careful defect triage. Delivered a Playwright suite for our checkout flow in under two weeks.',
    name: 'Upwork Client',
    title: 'E-commerce SaaS · 5.0 ★',
    accent: 'primary'
  },
  {
    quote: 'Badrul documented every P0–P3 defect with a clarity our engineers actually enjoyed reading. Reproduction steps, logs, expected vs. actual — textbook QA discipline.',
    name: 'Product Manager',
    title: 'Kintsugi',
    accent: 'tertiary'
  },
  {
    quote: 'He mentored two junior testers on POM and CI integration while still delivering his own roadmap. The team left stronger than he found it.',
    name: 'QA Manager',
    title: 'Aptovet',
    accent: 'secondary'
  }
];

const STATS = [
  { value: '5+', label: 'Years in QA' },
  { value: '28+', label: 'Live API Integrations' },
  { value: '~40%', label: 'Manual Regression Cut' },
  { value: '5.0★', label: 'Upwork Top Rated' }
];

const accentMap = {
  primary: { text: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/10', borderHover: 'hover:border-primary/50', gradFrom: 'from-primary' },
  secondary: { text: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/10', borderHover: 'hover:border-secondary/50', gradFrom: 'from-secondary' },
  tertiary: { text: 'text-tertiary', border: 'border-tertiary/30', bg: 'bg-tertiary/10', borderHover: 'hover:border-tertiary/50', gradFrom: 'from-tertiary' }
};

// --- MAIN APP ---

function App() {
  const cursorRef = useRef();
  const cursorDotRef = useRef();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      wheelMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.8, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.8, ease: "power3" });
    const dotXTo = gsap.quickTo(cursorDotRef.current, "x", { duration: 0.1, ease: "power3" });
    const dotYTo = gsap.quickTo(cursorDotRef.current, "y", { duration: 0.1, ease: "power3" });

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      xTo(mouseX);
      yTo(mouseY);
      dotXTo(mouseX);
      dotYTo(mouseY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const interactables = document.querySelectorAll('a, button, .hover-target');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorRef.current, { scale: 3, backgroundColor: 'rgba(173, 198, 255, 0.1)', duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
      });
    });

    const tl = gsap.timeline();
    tl.to('.split-char', {
      y: 0,
      stagger: 0.04,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.2
    })
      .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 0.8, y: 0, duration: 1, ease: 'power2.out' }, "-=0.8")
      .fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.6");

    gsap.to('.hero-text', {
      yPercent: 50,
      scale: 0.9,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    gsap.utils.toArray('.parallax-elem').forEach((elem) => {
      const speed = parseFloat(elem.getAttribute('data-speed') || 1);
      gsap.to(elem, {
        yPercent: -20 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: elem.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    gsap.utils.toArray('.project-card').forEach((card, i, cards) => {
      if (i === cards.length - 1) return;
      gsap.to(card, {
        scale: 0.9,
        opacity: 0.5,
        scrollTrigger: {
          trigger: card,
          start: "top 100px",
          endTrigger: cards[i + 1],
          end: "top 100px",
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    });

    setTimeout(() => ScrollTrigger.refresh(), 500);

    gsap.utils.toArray('.fade-up').forEach((elem) => {
      gsap.fromTo(elem,
        { y: 150, opacity: 0, rotateX: 10 },
        {
          y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: 'expo.out',
          scrollTrigger: { trigger: elem, start: 'top 85%' }
        }
      );
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      lenis.destroy();
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <WebGLBackground />

      {/* Custom Cursor */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-12 h-12 rounded-full border border-primary pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"></div>
      <div ref={cursorDotRef} className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"></div>

      <div className="noise-overlay"></div>

      <main className="relative z-10 w-full font-sans overflow-hidden cursor-none">

        {/* Navigation */}
        <nav className="fixed top-0 w-full p-6 mix-blend-difference z-50 flex justify-between items-center text-white backdrop-blur-md bg-transparent">
          <Magnetic>
            <div className="font-display font-bold text-xl tracking-widest cursor-pointer hover-target" onClick={() => window.scrollTo(0, 0)}>B.A.</div>
          </Magnetic>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex gap-6 md:gap-8 text-xs md:text-sm font-medium tracking-wider">
            <Magnetic><li className="cursor-pointer hover-target transition-colors" onClick={() => scrollTo('about')}>ABOUT</li></Magnetic>
            <Magnetic><li className="cursor-pointer hover-target transition-colors" onClick={() => scrollTo('experience')}>EXPERIENCE</li></Magnetic>
            <Magnetic><li className="cursor-pointer hover-target transition-colors" onClick={() => scrollTo('projects')}>PROJECTS</li></Magnetic>
            <Magnetic><li className="cursor-pointer hover-target transition-colors" onClick={() => scrollTo('feedback')}>FEEDBACK</li></Magnetic>
            <Magnetic>
              <li className="cursor-pointer bg-primary text-background px-6 py-3 rounded-full hover-target transition-colors font-bold" onClick={() => scrollTo('contact')}>
                LET'S TALK
              </li>
            </Magnetic>
          </ul>

          {/* Mobile Hamburger */}
          <button className="sm:hidden cursor-pointer hover-target" aria-label="Open Mobile Menu" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center text-white sm:hidden transition-all duration-300">
            <div className="absolute top-6 right-6 cursor-pointer hover-target" aria-label="Close Mobile Menu" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={32} />
            </div>
            <ul className="flex flex-col gap-10 text-2xl font-bold tracking-widest text-center">
              <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => { scrollTo('about'); setIsMobileMenuOpen(false); }}>ABOUT</li>
              <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => { scrollTo('experience'); setIsMobileMenuOpen(false); }}>EXPERIENCE</li>
              <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => { scrollTo('projects'); setIsMobileMenuOpen(false); }}>PROJECTS</li>
              <li className="cursor-pointer hover:text-primary transition-colors" onClick={() => { scrollTo('feedback'); setIsMobileMenuOpen(false); }}>FEEDBACK</li>
              <li className="cursor-pointer text-primary" onClick={() => { scrollTo('contact'); setIsMobileMenuOpen(false); }}>LET'S TALK</li>
            </ul>
          </div>
        )}

        {/* Hero Section */}
        <section className="hero-section h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
          {/* Aurora glow orbs behind hero */}
          <div className="aurora animate-float-slow" style={{ width: '500px', height: '500px', background: '#adc6ff', top: '10%', left: '15%' }}></div>
          <div className="aurora animate-float-slower" style={{ width: '400px', height: '400px', background: '#c4abff', bottom: '10%', right: '15%', opacity: 0.3 }}></div>
          <div className="aurora animate-float-slow" style={{ width: '300px', height: '300px', background: '#4ae176', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2 }}></div>

          <div className="hero-text mix-blend-difference text-white relative z-10">
            <div className="hero-badge inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-10 opacity-0 shimmer-btn">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              <span className="text-xs font-mono tracking-widest uppercase opacity-90">Available for Q3 2026 engagements</span>
            </div>
            <h1 className="font-display text-[12vw] md:text-[10vw] leading-none font-bold tracking-tighter mb-6 flex justify-center gap-4 flex-wrap text-glow">
              <span className="sr-only">Badrul Alam - Software QA Engineer & Test Automation Architect</span>
              <SplitText>BADRUL</SplitText>
              <SplitText>ALAM</SplitText>
            </h1>
            <p className="hero-subtitle font-display text-lg md:text-2xl tracking-widest uppercase opacity-90 mb-3">
              Software QA Engineer · <span className="gradient-text">Test Automation Architect</span>
            </p>
            <p className="hero-subtitle font-mono text-sm md:text-base opacity-60 mb-12 max-w-xl mx-auto">
              Building production-grade test infrastructure for AI, fintech, and e-commerce platforms.
            </p>
            <Magnetic>
              <button onClick={() => scrollTo('about')} aria-label="Scroll to About" className="border border-white/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto hover-target hover:bg-white hover:text-background transition-colors glow-pulse">
                <span className="animate-bounce-soft">↓</span>
              </button>
            </Magnetic>
          </div>
          <div className="absolute top-1/4 -left-10 text-[20vw] font-bold text-white/5 whitespace-nowrap pointer-events-none parallax-elem" data-speed="2">TESTING</div>
          <div className="absolute bottom-1/4 -right-10 text-[20vw] font-bold text-white/5 whitespace-nowrap pointer-events-none parallax-elem" data-speed="-2">QUALITY</div>
        </section>

        {/* Tech Stack Marquee */}
        <div className="w-full bg-surface-high/30 border-y border-white/5 py-6 overflow-hidden relative backdrop-blur-md">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030b14] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030b14] to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max animate-marquee text-white/40 font-mono text-xl tracking-widest uppercase">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex gap-16 px-8 items-center">
                <span className="hover-target hover:text-primary transition-colors cursor-default">Playwright</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-tertiary transition-colors cursor-default">TypeScript</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-secondary transition-colors cursor-default">Docker</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-primary transition-colors cursor-default">Selenium</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-tertiary transition-colors cursor-default">Appium</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-secondary transition-colors cursor-default">Postman</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-primary transition-colors cursor-default">Robot Framework</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-tertiary transition-colors cursor-default">JMeter</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-secondary transition-colors cursor-default">Kubernetes</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
                <span className="hover-target hover:text-primary transition-colors cursor-default">REST Assured</span>
                <span className="w-2 h-2 rounded-full bg-white/20"></span>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <section id="about" className="py-32 px-6 md:px-24 relative overflow-hidden">
          <div className="aurora animate-float-slow" style={{ width: '500px', height: '500px', background: '#c4abff', top: '-10%', right: '-10%', opacity: 0.2 }}></div>
          <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative">
            <div className="grid lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-3 fade-up">
                <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-6">[ About ]</p>
                <h2 className="font-display text-4xl md:text-6xl text-white font-bold mb-10 tracking-tight leading-tight">
                  Quality is <span className="italic gradient-text">engineered</span>, not inspected.
                </h2>
                <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
                  <p>
                    I'm a QA engineer with 5+ years of experience building test automation for AI, fintech, and e-commerce platforms. I currently own end-to-end quality at <span className="text-white font-semibold">Kintsugi</span>, an AI-driven sales tax platform with 28+ live integrations across Shopify, Stripe, NetSuite, QuickBooks, Zuora, and more.
                  </p>
                  <p>
                    My focus is infrastructure that outlives the feature it was built for — Playwright, Postman/Newman, Selenium, Appium, and Robot Framework wired into CI/CD pipelines that give engineering teams real, actionable feedback on every commit.
                  </p>
                  <p>
                    On the side, I co-authored a peer-reviewed NLP paper on dual-headed BanglaBERT transformers (IEEE 3ICT 2025) and hold a Top Rated badge on Upwork with a 90%+ job success score.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 gap-4 fade-up">
                {STATS.map((s) => (
                  <div key={s.label} className="grad-border glass rounded-3xl p-6 tilt-card hover-target relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
                    <div className="font-display text-4xl md:text-5xl gradient-text font-bold mb-2 relative">{s.value}</div>
                    <div className="text-on-surface-variant text-xs tracking-widest uppercase font-bold relative">{s.label}</div>
                  </div>
                ))}
                <div className="col-span-2 glass rounded-3xl p-6 border border-white/10 hover-target hover:border-tertiary/40 transition-colors">
                  <p className="text-tertiary font-mono text-xs tracking-widest uppercase font-bold mb-3">[ Currently ]</p>
                  <p className="text-white text-base leading-relaxed">Sole QA owner at Kintsugi — owning Playwright E2E, Newman API regression, and manual integration coverage for 28+ connectors.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-32 px-6 md:px-24 relative overflow-hidden">
          <div className="aurora animate-float-slower" style={{ width: '450px', height: '450px', background: '#adc6ff', top: '30%', left: '-10%', opacity: 0.2 }}></div>
          <div className="max-w-5xl mx-auto space-y-24 relative">
            <div className="fade-up">
              <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-6">[ Experience ]</p>
              <h2 className="font-display text-5xl md:text-7xl text-white font-bold tracking-tight">
                Architecting <br /> <span className="gradient-text italic">Flawless Systems</span>
              </h2>
            </div>

            {EXPERIENCES.map((exp, idx) => {
              const a = accentMap[exp.accent];
              return (
                <div key={idx} className="fade-up">
                  <div className="grad-border glass p-6 md:p-16 rounded-[1.5rem] md:rounded-[2.5rem] group hover-target hover:bg-surface-high/60 transition-all duration-700 relative overflow-hidden backdrop-blur-2xl tilt-card">
                    <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${a.gradFrom} to-transparent opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700 pointer-events-none`}></div>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${a.gradFrom} to-white/0 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out`}></div>
                    <div className="flex flex-col md:flex-row gap-12 justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <h3 className={`text-3xl text-white font-bold group-hover:${a.text} transition-colors`}>{exp.role}</h3>
                        </div>
                        <p className={`${a.text} tracking-widest text-sm uppercase mb-2 font-bold`}>{exp.company} · {exp.period}</p>
                        <p className="text-on-surface-variant/70 text-xs tracking-widest uppercase mb-8 font-mono">{exp.context}</p>
                        <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                          {exp.body}
                        </p>
                      </div>
                      <div className="flex gap-3 flex-wrap md:justify-end max-w-[280px]">
                        {exp.stack.map((s) => (
                          <span key={s} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-white backdrop-blur-md">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stacking Projects Section */}
        <section id="projects" className="py-32 px-6 md:px-24 bg-[#030b14] relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20 text-white">
              <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-6">[ Selected Work ]</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Featured <span className="gradient-text">Case Studies</span></h2>
              <p className="text-primary mt-2 font-mono text-sm tracking-widest uppercase">[ Scroll to stack ]</p>
            </div>

            <div className="relative">
              {PROJECTS.map((p, i) => {
                const a = accentMap[p.accent];
                const isLast = i === PROJECTS.length - 1;
                return (
                  <div
                    key={p.title}
                    className={`project-card sticky top-[100px] w-full h-[75vh] md:h-[60vh] glass rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden ${isLast ? 'mb-8' : 'mb-24'} group hover-target ${a.borderHover} transition-colors duration-500`}
                  >
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010912] via-[#010912]/80 to-transparent z-10"></div>
                      <img src={p.img} alt={`${p.title} - Software QA Automation Case Study`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000" />
                    </div>
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-12">
                      <div className="bg-background/40 backdrop-blur-2xl p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-white/10 max-w-4xl shadow-2xl">
                        <p className={`${a.text} font-mono text-xs tracking-widest uppercase mb-3 font-bold`}>{p.client}</p>
                        <h3 className="text-2xl md:text-4xl text-white font-bold mb-4 font-display">{p.title}</h3>
                        <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">{p.body}</p>
                        <div className="flex gap-3 flex-wrap">
                          {p.tags.map((t) => (
                            <span key={t} className={`px-4 py-2 rounded-full border ${a.border} ${a.bg} text-xs ${a.text} font-bold`}>{t}</span>
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

        {/* Education & Publication */}
        <section className="py-32 px-6 md:px-24 relative">
          <div className="max-w-5xl mx-auto">
            <div className="fade-up mb-16">
              <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-6">[ Credentials ]</p>
              <h2 className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight">Education & <span className="gradient-text">Publication</span></h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="fade-up grad-border glass rounded-[2.5rem] p-10 tilt-card hover-target hover:border-primary/40 transition-colors">
                <p className="text-primary font-mono text-xs tracking-widest uppercase font-bold mb-4">[ Education ]</p>
                <h3 className="text-2xl text-white font-bold font-display mb-2">B.Sc. in Computer Science & Engineering</h3>
                <p className="text-on-surface-variant mb-4">Daffodil International University · Dhaka, Bangladesh</p>
                <p className="text-white/60 font-mono text-sm">May 2021 — Jun 2025 · CGPA 3.44 / 4.00</p>
              </div>

              <div className="fade-up grad-border glass rounded-[2.5rem] p-10 tilt-card hover-target hover:border-secondary/40 transition-colors">
                <p className="text-secondary font-mono text-xs tracking-widest uppercase font-bold mb-4">[ IEEE Publication · 2025 ]</p>
                <h3 className="text-2xl text-white font-bold font-display mb-3 leading-snug">Advancing Bangla NLP: A Dual-Headed Transformer Model for News Topic & Sentiment Classification</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Published and presented at the IEEE 3ICT Conference. Novel BanglaBERT architecture using Multi-Task Learning for simultaneous topic and sentiment classification — outperforming single-task baselines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="min-h-screen py-32 flex items-center relative overflow-hidden">
          <div className="aurora animate-float-slow" style={{ width: '500px', height: '500px', background: '#c4abff', top: '20%', right: '-10%', opacity: 0.25 }}></div>
          <div className="aurora animate-float-slower" style={{ width: '400px', height: '400px', background: '#4ae176', bottom: '10%', left: '-10%', opacity: 0.15 }}></div>
          <div className="w-full">
            <div className="fade-up max-w-5xl mx-auto px-6 md:px-24 mb-20 text-center">
              <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase mb-6">[ Feedback ]</p>
              <h2 className="font-display text-5xl md:text-7xl text-white font-bold">
                What Teams <span className="gradient-text">Say</span>
              </h2>
            </div>

            <div className="w-full overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-[#030b14] to-transparent z-20 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-[#030b14] to-transparent z-20 pointer-events-none"></div>

              <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: '60s' }}>
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="flex gap-8 px-4 items-stretch">
                    {TESTIMONIALS.map((t, i) => {
                      const a = accentMap[t.accent];
                      return (
                        <div key={`${idx}-${i}`} className={`w-[300px] md:w-[450px] shrink-0 grad-border glass p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden group hover-target ${a.borderHover} transition-colors tilt-card`}>
                          <div className={`${a.text} text-[6rem] md:text-[10rem] absolute -top-4 md:-top-10 -left-2 md:-left-4 opacity-10 font-serif leading-none group-hover:scale-110 transition-transform duration-500`}>"</div>
                          <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 md:mb-10 relative z-10 min-h-[150px] md:min-h-[180px]">
                            {t.quote}
                          </p>
                          <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${a.gradFrom} to-background border ${a.border} shrink-0`}></div>
                            <div>
                              <div className="text-white font-bold">{t.name}</div>
                              <div className={`${a.text} tracking-widest text-xs uppercase font-bold`}>{t.title}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen py-32 px-6 md:px-24 bg-[#010912] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(173,198,255,0.15)_0%,transparent_50%)] pointer-events-none"></div>
          <div className="aurora animate-float-slow" style={{ width: '600px', height: '600px', background: '#adc6ff', bottom: '-20%', left: '30%', opacity: 0.2 }}></div>
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto min-h-[70vh] flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
              <div>
                <p className="fade-up text-primary font-mono text-xs tracking-[0.3em] uppercase mb-6">[ Contact ]</p>
                <h2 className="fade-up font-display text-5xl md:text-[5.5vw] text-white font-bold leading-none tracking-tighter mb-8 mix-blend-difference">
                  LET'S BUILD <br /> <span className="gradient-text">PERFECTION</span>
                </h2>
                <p className="fade-up text-on-surface-variant text-xl max-w-lg mb-12">
                  Ready to eliminate deployment anxiety and scale your QA infrastructure? I reply within one business day.
                </p>
                <div className="fade-up flex flex-col gap-3 mb-10">
                  <a href="mailto:me@badrulalam.dev" className="text-white text-xl hover-target hover:text-primary transition-colors w-fit">me@badrulalam.dev</a>
                  <a href="tel:+8801793693774" className="text-white text-xl hover-target hover:text-primary transition-colors w-fit">+880 1793-693774</a>
                  <span className="text-on-surface-variant/70 text-sm font-mono tracking-widest uppercase">Dhaka, Bangladesh · Working GMT+6 · Open to Remote</span>
                </div>
                <div className="fade-up flex gap-4 flex-wrap">
                  <a href="https://www.linkedin.com/in/badrul02" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-white/20 bg-white/5 text-white text-sm hover-target hover:border-primary hover:text-primary transition-colors font-bold tracking-widest uppercase">LinkedIn</a>
                  <a href="https://github.com/badrul-org" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-white/20 bg-white/5 text-white text-sm hover-target hover:border-primary hover:text-primary transition-colors font-bold tracking-widest uppercase">GitHub</a>
                  <a href="https://www.upwork.com/freelancers/badrul11" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-white/20 bg-white/5 text-white text-sm hover-target hover:border-tertiary hover:text-tertiary transition-colors font-bold tracking-widest uppercase">Upwork</a>
                  <a href="/Badrul_Alam_Resume.pdf" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-primary bg-primary/10 text-primary text-sm hover-target hover:bg-primary hover:text-background transition-colors font-bold tracking-widest uppercase">Resume ↗</a>
                </div>
              </div>

              <div className="fade-up glass p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 relative overflow-hidden backdrop-blur-xl">
                <form action="https://formspree.io/f/mjgjlvyo" method="POST" className="space-y-6">
                  <div className="flex flex-col gap-2 group">
                    <label className="text-secondary text-sm font-bold tracking-widest uppercase group-focus-within:text-primary transition-colors">Name</label>
                    <input type="text" name="name" required className="bg-transparent border-b border-white/20 pb-3 text-white text-xl focus:outline-none focus:border-primary transition-colors hover-target" placeholder="Your Name" />
                  </div>
                  <div className="flex flex-col gap-2 group">
                    <label className="text-secondary text-sm font-bold tracking-widest uppercase group-focus-within:text-primary transition-colors">Email</label>
                    <input type="email" name="email" required className="bg-transparent border-b border-white/20 pb-3 text-white text-xl focus:outline-none focus:border-primary transition-colors hover-target" placeholder="you@company.com" />
                  </div>
                  <div className="flex flex-col gap-2 group">
                    <label className="text-secondary text-sm font-bold tracking-widest uppercase group-focus-within:text-primary transition-colors">Project Details</label>
                    <textarea name="message" required className="bg-transparent border-b border-white/20 pb-3 text-white text-xl focus:outline-none focus:border-primary transition-colors hover-target resize-none h-24" placeholder="Tell me about your QA needs..."></textarea>
                  </div>
                  <Magnetic>
                    <button type="submit" className="shimmer-btn mt-8 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-[position:100%_0] text-background font-bold text-lg px-12 py-5 rounded-full hover-target transition-all duration-500 w-full uppercase tracking-widest glow-pulse">
                      Send Message
                    </button>
                  </Magnetic>
                </form>
              </div>
            </div>
          </div>

          <footer className="w-full flex flex-col md:flex-row gap-4 justify-between items-center text-on-surface-variant text-sm font-bold uppercase tracking-widest mt-32 px-8">
            <p>© {new Date().getFullYear()} Badrul Alam · Crafted with care in Dhaka</p>
            <div className="flex gap-8">
              <a href="https://www.linkedin.com/in/badrul02" target="_blank" rel="noreferrer" className="hover-target hover:text-white transition-colors">LinkedIn</a>
              <a href="https://github.com/badrul-org" target="_blank" rel="noreferrer" className="hover-target hover:text-white transition-colors">GitHub</a>
              <a href="https://www.upwork.com/freelancers/badrul11" target="_blank" rel="noreferrer" className="hover-target hover:text-white transition-colors">Upwork</a>
            </div>
          </footer>
        </section>

      </main>
    </>
  );
}

export default App;
