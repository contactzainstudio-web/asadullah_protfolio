import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Portfolio } from "@/components/portfolio";
import { Services } from "@/components/services";
import { About } from "@/components/about";
import { Process } from "@/components/process";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function Home() {
  return (
    <Providers>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <Portfolio />
        <Services />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
    </Providers>
  );
}
