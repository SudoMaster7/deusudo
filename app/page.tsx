import { faqSchema, jsonLdProps } from "@/lib/schema";
import { Hero } from "@/components/Hero";
import { Flow } from "@/components/Flow";
import { Diagnostic } from "@/components/Diagnostic";
import { BotLab } from "@/components/BotLab";
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
  ReportSection,
  Results,
  Solutions,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Header />
      <main id="topo">
        <Hero />
        <section className="clients-band">
          <div className="wrap">
            <ClientMarks />
          </div>
        </section>
        <Problems />
        <Flow />
        <Solutions />
        <Results />
        <Diagnostic />
        <BotLab />
        <Demo />
        <DataSection />
        <ReportSection />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <script {...jsonLdProps(faqSchema)} />
    </>
  );
}
