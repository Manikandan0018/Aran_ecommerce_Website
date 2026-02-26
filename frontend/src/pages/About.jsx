import React from "react";
import { useNavigate } from "react-router-dom";
// Ensure these icons are imported correctly
import { HiOutlineArrowLeft, HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans selection:bg-[#3D4035] selection:text-white overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <nav className="p-6 flex justify-between items-center fixed top-0 w-full z-50 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-[#3D4035]/5">
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#3D4035]"
        >
          <HiOutlineArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          Back to Atelier
        </button>
        <span className="font-serif text-2xl tracking-tighter text-[#3D4035]">ARAN</span>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-48 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#8C8C83] font-bold">Our Genesis</p>
          <h1 className="text-5xl md:text-8xl font-serif text-[#3D4035] leading-tight tracking-tighter">
            Born in a kitchen, <br />
            <span className="italic font-light text-[#8C8C83]">rooted in nature.</span>
          </h1>
          <div className="w-px h-24 bg-[#3D4035]/20 mx-auto mt-12"></div>
        </div>
      </section>

      {/* --- THE STORY SPLIT --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-3xl md:text-5xl font-serif text-[#3D4035] leading-snug">
              It started with a simple question: Why use synthetics when the earth provides everything?
            </h2>
            <div className="space-y-6">
                <p className="text-[#6B705C] text-lg font-light leading-relaxed">
                ARAN began as a personal journey in 2024. In a small kitchen, we started 
                experimenting with traditional oil infusions, sun-drying herbs, and 
                steam distillation. We wanted to return to a time when skincare was 
                slow, intentional, and entirely edible.
                </p>
                <p className="text-[#6B705C] text-lg font-light leading-relaxed">
                Every product you see today is still made in small batches. We don't 
                own a factory; we own an apothecary. We don't have assembly lines; 
                we have hands that pour, label, and pack every single bottle.
                </p>
            </div>
          </div>
          
          {/* Aesthetic Visual Block */}
          <div className="order-1 lg:order-2 bg-[#E5EADD] rounded-[3rem] lg:rounded-[5rem] aspect-square flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 font-serif text-[150px] md:text-[200px] -rotate-12 select-none pointer-events-none">ARAN</div>
             <p className="font-serif text-3xl md:text-4xl text-[#3D4035] relative z-10 leading-tight">
                "The rhythm of the earth is the only clock we follow."
             </p>
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#3D4035]/60 relative z-10">
                — OUR PHILOSOPHY
             </span>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES GRID --- */}
      <section className="bg-[#3D4035] text-[#FAF9F6] py-24 px-8 md:px-16 rounded-[3rem] lg:rounded-[6rem] mx-4 mb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 lg:gap-24">
          <div className="space-y-4">
            <h4 className="font-serif text-2xl text-[#D4AF37]">Slow Crafted</h4>
            <p className="text-[#FAF9F6]/60 font-light leading-relaxed text-sm">
              We never rush the process. Some of our infusions take 6 weeks of 
              sun-soaking before they are ready for bottling.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif text-2xl text-[#D4AF37]">Purely Homemade</h4>
            <p className="text-[#FAF9F6]/60 font-light leading-relaxed text-sm">
              From our kitchen sanctuary to your home. No industrial chemicals, 
              no parabens, no shortcuts. Just nature.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif text-2xl text-[#D4AF37]">Zero Waste</h4>
            <p className="text-[#FAF9F6]/60 font-light leading-relaxed text-sm">
              Our packaging is as natural as our ingredients. Glass, recycled 
              paper, and biodegradable seals are all we use.
            </p>
          </div>
        </div>
      </section>

      {/* --- CONTACT / FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-[#3D4035]/10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="space-y-4">
            <h3 className="text-4xl font-serif text-[#3D4035]">Get in Touch</h3>
            <p className="text-[#6B705C] font-light italic">Have questions about our process? We'd love to hear from you.</p>
          </div>

          <div className="space-y-6 w-full lg:w-auto">
            {/* Email Card */}
            <a 
              href="mailto:manikandan110305@gmail.com" 
              className="flex items-center gap-4 group p-5 bg-white rounded-2xl border border-[#3D4035]/5 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#3d403508] transition-all"
            >
              <div className="w-12 h-12 bg-[#3D4035] text-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <HiOutlineEnvelope className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8] mb-0.5">Email Us</p>
                <p className="text-[#3D4035] font-medium break-all">manikandan110305@gmail.com</p>
              </div>
            </a>

            {/* Phone Card */}
            <a 
              href="tel:+917826920882" 
              className="flex items-center gap-4 group p-5 bg-white rounded-2xl border border-[#3D4035]/5 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#3d403508] transition-all"
            >
              <div className="w-12 h-12 bg-[#3D4035]/5 text-[#3D4035] rounded-full flex items-center justify-center group-hover:bg-[#3D4035] group-hover:text-white transition-all">
                <HiOutlinePhone className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8] mb-0.5">Call Us</p>
                <p className="text-[#3D4035] font-medium">+91 78269 20882</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-[#3D4035]/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#B0B0A8]">© 2026 ARAN NATURAL HERITAGE</p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-[#3D4035]">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Pinterest</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;