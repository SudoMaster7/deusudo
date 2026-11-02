import type { Metadata } from "next";
import { Footer, Header } from "@/components/Sections";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de privacidade | SUDO",
  alternates: { canonical: "/privacidade" },
};

// Texto-base. Revise com um profissional de LGPD antes de divulgar o site em escala,
// e atualize esta página se adicionar Meta Pixel, Google Analytics ou qualquer cookie de rastreamento.
export default function Privacidade() {
  return (
    <>
      <Header />
      <main>
        <section className="page-top band">
          <div className="wrap prose">
            <h1>Política de privacidade</h1>
            <p className="stamp">Última atualização: 30 de outubro de 2026</p>

            <h2>Quem somos</h2>
            <p>
              A SUDO é uma empresa de soluções digitais com base em {site.city}. Para falar sobre os seus
              dados, escreva para {site.email}.
            </p>

            <h2>Quais dados este site coleta</h2>
            <p>
              O site não tem cadastro nem conta. Os formulários apenas montam uma mensagem para o WhatsApp
              com o que você digitou, como nome, negócio, ramo, necessidade e observações. A mensagem só é
              enviada se você tocar no botão e enviar pelo WhatsApp. Na demonstração da vitrine, o pedido de
              teste também só chega até nós se você enviá-lo.
            </p>

            <h2>Para que usamos</h2>
            <p>
              Usamos as informações que você nos envia para responder ao seu contato e preparar o
              diagnóstico gratuito. Não vendemos nem compartilhamos esses dados com terceiros para
              publicidade.
            </p>

            <h2>Cookies</h2>
            <p>
              Esta versão do site não usa cookies de rastreamento nem ferramentas de análise. Se isso mudar,
              esta página será atualizada.
            </p>

            <h2>Seus direitos</h2>
            <p>
              Pela LGPD, você pode pedir a confirmação de que tratamos seus dados, o acesso a eles, a
              correção e a eliminação. Escreva para {site.email} e responderemos o quanto antes.
            </p>

            <h2>Resultados de clientes</h2>
            <p>
              Os resultados e logos mostrados no site são de clientes que autorizaram a divulgação. Quando
              não há autorização, o cliente aparece de forma anônima.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
