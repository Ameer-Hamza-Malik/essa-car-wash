import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import type { Group, Mesh } from 'three';
import { ArrowUpRight, Check, ChevronRight, Clock3, Droplets, Menu, MoveUpRight, Phone, ShieldCheck, Sparkles, Star, X, Zap } from 'lucide-react';

const services = [
  { number: '01', title: 'Half Service', detail: 'A precise exterior cleanse for the everyday drive.', time: '30 min', price: 'RS-650', icon: Droplets },
  { number: '02', title: 'Full Service', detail: 'Inside-out detailing, finished by hand under soft light.', time: '1.5 hrs', price: 'RS-1000', icon: Sparkles },
  { number: '03', title: 'General Service', detail: 'Long-wear ceramic protection with a glass-like finish.', time: '3 hrs', price: 'RS-2500', icon: ShieldCheck },
];
const quotes = [
  { quote: 'The finish is genuinely different. It looks wet even three weeks later.', name: 'MALIK', meta: 'Toyota Land Cruiser / Member since 2024' },
  { quote: 'A calm, considered experience. ESSA treats the car like a piece of design.', name: 'HAMZA', meta: 'Honda Civic / Member since 2025' },
];

function WashCar() {
  const car = useRef<Group>(null);
  const desiredRotation = useRef(-.42);
  const dragState = useRef({ active: false, lastX: 0 });
  const vehicleModelUrl = 'https://raw.githubusercontent.com/phil663/car-models/main/toyota_landcruiser_v8_2022.glb';
  const { scene } = useGLTF(vehicleModelUrl);
  const { gl } = useThree();
  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        if (!material || !('color' in material)) return;
        const paint = material as { color: { r: number; g: number; b: number; set: (value: string) => void }; roughness?: number; metalness?: number };
        if (paint.color.r > paint.color.b * 1.25 && paint.color.r > paint.color.g * 1.15) {
          paint.color.set('#dce7e5');
          if (paint.roughness !== undefined) paint.roughness = .2;
          if (paint.metalness !== undefined) paint.metalness = .58;
        }
      });
    });
  }, [scene]);
  useEffect(() => {
    const canvas = gl.domElement;
    const startDrag = (event: PointerEvent) => { dragState.current = { active: true, lastX: event.clientX }; canvas.setPointerCapture?.(event.pointerId); };
    const moveCar = (event: PointerEvent) => {
      if (!dragState.current.active) return;
      desiredRotation.current += (event.clientX - dragState.current.lastX) * .012;
      dragState.current.lastX = event.clientX;
    };
    const stopDrag = () => { dragState.current.active = false; };
    canvas.addEventListener('pointerdown', startDrag);
    canvas.addEventListener('pointermove', moveCar);
    canvas.addEventListener('pointerup', stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    return () => { canvas.removeEventListener('pointerdown', startDrag); canvas.removeEventListener('pointermove', moveCar); canvas.removeEventListener('pointerup', stopDrag); canvas.removeEventListener('pointercancel', stopDrag); };
  }, [gl]);
  useFrame((_, delta) => {
    if (!car.current) return;
    if (!dragState.current.active) desiredRotation.current += delta * .2;
    car.current.rotation.y += (desiredRotation.current - car.current.rotation.y) * .09;
  });
  return <group ref={car} position={[0, .08, .05]} scale={17}><primitive object={scene} /></group>;
}

useGLTF.preload('https://raw.githubusercontent.com/phil663/car-models/main/toyota_landcruiser_v8_2022.glb');

function BubbleField() {
  const bubbles = useRef<Group>(null);
  useFrame((state) => {
    if (!bubbles.current) return;
    bubbles.current.children.forEach((bubble, index) => {
      const cycle = (state.clock.elapsedTime * (.12 + index * .012) + index * .2) % 1;
      bubble.position.y = .25 + cycle * 1.45;
      bubble.position.x += Math.sin(state.clock.elapsedTime * 1.2 + index) * .0008;
      bubble.scale.setScalar(.75 + Math.sin(state.clock.elapsedTime * 1.8 + index) * .14);
    });
  });
  return <group ref={bubbles}>
    {[-1.8, -1.45, -1.08, -.72, -.28, .2, .65, 1.05, 1.46, 1.8].map((x, index) => <mesh key={x} position={[x, .25 + index * .1, .48 + (index % 3) * .1]}><sphereGeometry args={[.035 + (index % 3) * .014, 12, 12]} /><meshPhysicalMaterial color="#d7fff8" transparent opacity={.58} roughness={.03} transmission={.35} /></mesh>)}
  </group>;
}

function WashScene() {
  return <group scale={.78} position={[0, -.02, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.18, 0]} receiveShadow><planeGeometry args={[7, 5]} /><meshStandardMaterial color="#122425" roughness={.36} metalness={.65} /></mesh>
    <BubbleField />
    <WashCar />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.16, .2]}><planeGeometry args={[3.3, .35]} /><meshBasicMaterial color="#7cf0d4" transparent opacity={.22} /></mesh>
  </group>;
}

function WashMoment() {
  return <div className="wash-moment">
    <Canvas camera={{ position: [3.9, 2.25, 6.2], fov: 39 }} shadows dpr={[1, 1.5]}>
      <color attach="background" args={['#172426']} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[-3, 4, 5]} intensity={3.3} color="#dffff7" castShadow />
      <pointLight position={[-2, 1, 2]} intensity={9} distance={6} color="#3de0ba" />
      <WashScene />
    </Canvas>
    <div className="scene-status"><span className="status-dot" />  live detail</div>
  </div>;
}
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) { return <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }} className={className}>{children}</motion.div>; }

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false); const [bookingOpen, setBookingOpen] = useState(false); const [booked, setBooked] = useState(false); const [bookingError, setBookingError] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false); const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (glowRef.current) gsap.to(glowRef.current, { x: 24, y: -18, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' }); }, []);
  const openBooking = () => { setBooked(false); setBookingError(''); setBookingOpen(true); setMenuOpen(false); };
  const handleBookingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setBookingError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), phone: form.get('phone'), service: form.get('service') }) });
      const responseText = await response.text();
      let result: { message?: string } = {};
      try {
        result = JSON.parse(responseText) as { message?: string };
      } catch {
        throw new Error(`API returned a non-JSON response (${response.status}). Check the Vercel API deployment.`);
      }
      if (!response.ok) throw new Error(result.message || 'Unable to save booking.');
      setBooked(true);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Unable to save booking.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <main className="site-shell"><div ref={glowRef} className="ambient-glow" />
    <header className="nav-wrap"><a href="#top" className="wordmark"><span className="wordmark-mark">href</span><span>ESSA <small>CAR WASH SERVICE</small></span></a><nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}><a href="#method" onClick={() => setMenuOpen(false)}>Our method</a><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#proof" onClick={() => setMenuOpen(false)}>The proof</a><a href="#location" onClick={() => setMenuOpen(false)}>Location</a><button className="nav-book" onClick={openBooking}>Book a wash <ArrowUpRight size={15} /></button></nav><button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></header>
    <section id="top" className="hero section-pad"><div className="hero-copy"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow"><span /> Est. 2026 / Detail with intent</motion.div><motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}>The art of a <em>clean</em> drive.</motion.h1><motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }}>ESSA is a precision car wash Station for people who notice the finish. Quietly obsessive, beautifully efficient.</motion.p><div className="hero-actions"><button className="button button-primary" onClick={openBooking}>Reserve your slot <ArrowUpRight size={17} /></button><a className="text-link" href="#services">Explore the Station <ChevronRight size={16} /></a></div><div className="hero-footnote"><span className="status-dot" /> Open today 08:00 - 19:00 <span className="foot-divider" /> No. 01 in paint-safe care</div></div><div className="hero-visual"><div className="visual-label"><span></span><span>Inside the wash bay</span></div><WashMoment /><div className="visual-label label-bottom"><span></span><span></span></div></div></section>
    <section id="method" className="method section-pad"><Reveal className="section-kicker"><span>01</span> A better baseline</Reveal><div className="method-grid"><Reveal><h2>Less noise.<br /><span>More finish.</span></h2></Reveal><Reveal delay={.1}><p className="lead-copy">There is a difference between clean and considered. We use fewer, better products, soft-touch tools, and a practiced eye to leave your car looking unmistakably itself.</p><a href="#services" className="arrow-link">See what we do <MoveUpRight size={16} /></a></Reveal></div><div className="method-stats"><div><strong>12k<span>+</span></strong><small>Cars refined</small></div><div><strong>4.9<span>/5</span></strong><small>Client rating</small></div><div><strong>100<span>%</span></strong><small>Paint-safe process</small></div></div></section>
    <section id="services" className="services section-pad"><Reveal className="section-heading"><div><div className="section-kicker"><span>02</span> The service menu</div><h2>Choose your<br /><em>level of clean.</em></h2></div><p>From a focused reset to full surface protection, every service is finished by hand and checked in natural light.</p></Reveal><div className="service-list">{services.map((service, index) => { const Icon = service.icon; return <Reveal key={service.number} delay={index * .08}><article className="service-row"><div className="service-index">{service.number}</div><div className="service-icon"><Icon size={19} /></div><div className="service-name"><h3>{service.title}</h3><p>{service.detail}</p></div><div className="service-meta"><span><Clock3 size={14} /> {service.time}</span><strong>{service.price}</strong></div><button className="round-arrow" aria-label={`Book ${service.title}`} onClick={openBooking}><ArrowUpRight size={18} /></button></article></Reveal>; })}</div></section>
    <section id="proof" className="proof section-pad"><Reveal className="proof-grid"><div className="proof-image"><div className="image-overlay" /><div className="image-note">Surface / 002<br /><span>Before the light hits</span></div></div><div className="proof-copy"><div className="section-kicker"><span>03</span> The proof</div><h2>Good care<br /><em>shows.</em></h2><p>“Our best work disappears into the reflection. You just notice that the car feels new again.”</p><div className="signature"> <span></span></div></div></Reveal><div className="quote-strip">{quotes.map((quote) => <div className="quote" key={quote.name}><div className="stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={12} fill="currentColor" />)}</div><p>“{quote.quote}”</p><strong>{quote.name}</strong><small>{quote.meta}</small></div>)}</div></section>
    <section id="location" className="location section-pad"><Reveal className="location-grid"><div className="location-copy"><div className="section-kicker"><span>04</span> Find the Station</div><h2>Come see<br /><em>the finish.</em></h2><p>Our doors are open for careful work, clean lines, and a better drive home.</p><div className="location-details"><strong>ESSA SERVICE STATION<br />By Pass Link Rd, Tando Ādam, 68050</strong><span>Mon - Sat / 08:00 - 19:00</span><a href="https://share.google/oePaU1s2UJ1HVqZJq" target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={15} /></a></div></div><div className="map-frame"><iframe title="ESSA Service Station location map" src="https://www.google.com/maps?q=ESSA%20SERVICE%20STATION%20By%20Pass%20Link%20Rd%2C%20Tando%20%C4%80dam%2C%2068050&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></Reveal></section>
    <footer className="footer section-pad"><div className="footer-top"><div className="footer-brand"><span className="wordmark-mark">E</span><h2>ESSA.</h2><p>Clean lines. Clear mind.<br />Every surface considered.</p></div><div className="footer-contact"><span>Visit the Station</span><p>ESSA SERVICE STATION<br />By Pass Link Rd, Tando Ādam, 68050<br />Mon - Sat / 08:00 - 19:00</p><a href="tel:+923053064398"><Phone size={14} /> +92 305 306 4398</a></div><div className="footer-action"><span>Ready when you are?</span><button className="button button-light" onClick={openBooking}>Book a wash <ArrowUpRight size={17} /></button></div></div><div className="footer-bottom"><span>© 2026 ESSA CAR WASH SERVICE</span><span>Designed for the drive ahead <Zap size={12} /></span></div></footer>
    <AnimatePresence>{bookingOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}><motion.div className="booking-modal" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .97 }}><button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="Close booking form"><X size={19} /></button>{booked ? <div className="success-state"><div className="success-icon"><Check size={26} /></div><div className="section-kicker"><span>Booked</span> You are on the list</div><h2>See you at ESSA.</h2><p>We will send a confirmation to your phone shortly. Bring the car, we will take care of the rest.</p><button className="button button-primary" onClick={() => setBookingOpen(false)}>Done <ArrowUpRight size={17} /></button></div> : <><div className="section-kicker"><span>Quick booking</span> About 60 seconds</div><h2>Reserve your<br /><em>clean.</em></h2><form onSubmit={handleBookingSubmit}><label>Name<input name="name" required placeholder="Your name" /></label><label>Phone<input name="phone" required type="tel" placeholder="+92 300 0000000" /></label><label>Service<select name="service" defaultValue="The Station"><option>Half Service — RS-650</option><option>Full Service — RS-1000</option><option>General Service — RS-2500</option></select></label>{bookingError && <p className="booking-error" role="alert">{bookingError}</p>}<button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving request...' : 'Request a slot'} <ArrowUpRight size={17} /></button></form></>}</motion.div></motion.div>}</AnimatePresence>
  </main>;
}
