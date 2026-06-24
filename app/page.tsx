import Nav from "@/components/Nav";
import HeroWrapper from "@/components/HeroWrapper";
import About from "@/components/About";
import Ticker from "@/components/Ticker";
import Slideshow from "@/components/Slideshow";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <>
      <Nav />
      {/* HeroWrapper è fixed (z-40) — non occupa spazio nel flusso,
          ma copre tutto il contenuto sotto finché non viene dismessa */}
      <HeroWrapper />
      <main>
        <RevealOnScroll>
          <About />
        </RevealOnScroll>
        <RevealOnScroll>
          <Ticker />
        </RevealOnScroll>
        <RevealOnScroll>
          <Slideshow />
        </RevealOnScroll>
      </main>
    </>
  );
}
