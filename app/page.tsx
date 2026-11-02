import { faqSchema, jsonLdProps } from "@/lib/schema";
import { NicheProvider } from "@/components/NicheContext";
import { Hero } from "@/components/Hero";
import { Demo } from "@/components/Demo";
import { Contact } from "@/components/Contact";
import {
  About,
  ClientMarks,
  DataSection,
  Faq,
  Footer,
  Header,
  Problems,
  Results,
  Solutions,
  Steps,
} from "@/components/Sections";

export default function Home() {
  return (
    <NicheProvider>
      <Header />
      <main id="topo">
        <Hero />
        <section className="clients-band">
          <div className="wrap">
            <ClientMarks />
          </div>
        </section>
        <Problems />
        <Solutions />
        <Results />
        <Demo />
        <DataSection />
        <Steps />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <script {...jsonLdProps(faqSchema)} />
    </NicheProvider>
  );
}
