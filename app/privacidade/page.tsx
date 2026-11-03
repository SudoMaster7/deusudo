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
            <p className="stamp">Última atualização: 3 de novembro de 2026</p>

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

            <h2>O assistente de IA do canto da tela</h2>
            <p>
              O botão &ldquo;S&rdquo; abre um assistente de inteligência artificial. Se você conversar com ele, nós
              registramos o conteúdo dessa conversa e o que você testou no site: o ramo que escolheu nas
              demonstrações, os números que colocou no simulador, as regras que montou no laboratório do
              atendente, os itens da vitrine de teste e os campos que preencheu no formulário. Usamos isso
              para entender o seu interesse e preparar o diagnóstico gratuito.
            </p>
            <p>
              Enquanto você só navega, nada sai do seu navegador. O registro acontece em dois momentos: quando
              você envia uma mensagem ao assistente, e quando você toca em um botão para falar com a gente no
              WhatsApp. Nesse segundo caso guardamos de onde você chegou ao site, o que você testou aqui e a
              mensagem que o botão montou — a mesma que você está nos enviando de qualquer forma.
            </p>
            <p>
              Para distinguir uma visita da outra, guardamos no seu navegador um identificador aleatório, que
              não contém nome, e-mail nem telefone. Guardamos também de onde você veio: o endereço da
              página que te trouxe até aqui e, se você chegou por um anúncio nosso, os parâmetros de
              campanha que vêm no link. Suas mensagens ao assistente são processadas por um provedor de
              inteligência artificial e guardadas em um banco de dados nosso, com acesso restrito. Não
              gravamos o seu endereço de IP.
            </p>
            <p>
              Não escreva senha, número de cartão, CPF ou dado de saúde no assistente. Se quiser que o
              registro da sua conversa seja apagado, escreva para {site.email}.
            </p>

            <h2>Para que usamos</h2>
            <p>
              Usamos as informações que você nos envia para responder ao seu contato e preparar o
              diagnóstico gratuito. Não vendemos nem compartilhamos esses dados com terceiros para
              publicidade.
            </p>

            <h2>Cookies</h2>
            <p>
              Esta versão do site não usa cookies de rastreamento nem ferramentas de análise. O assistente de
              IA guarda no seu navegador apenas o identificador aleatório e a origem da visita, descritos
              acima, que servem para juntar as suas interações num registro só. Se passarmos a usar
              rastreadores de terceiros, esta página será atualizada.
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
