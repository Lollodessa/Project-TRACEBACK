import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Ticker from "@/components/Ticker";
import Slideshow from "@/components/Slideshow";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
