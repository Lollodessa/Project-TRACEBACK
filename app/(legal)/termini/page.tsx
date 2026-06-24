import LegalTemplate, { type LegalSection } from "@/components/LegalTemplate";

const sections: LegalSection[] = [
  {
    id: "oggetto",
    title: "Oggetto e ambito",
    content: [
      "I presenti Termini e Condizioni regolano l'utilizzo del sito projecttraceback.com e l'acquisto di prodotti offerti da Project: Traceback. Accedendo al sito o effettuando un ordine, l'utente accetta integralmente i presenti termini.",
      "Project: Traceback si riserva il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento. L'uso continuato del sito dopo la pubblicazione costituisce accettazione delle modifiche.",
    ],
  },
  {
    id: "prodotti",
    title: "Prodotti e prezzi",
    content: [
      "Tutti i prodotti disponibili sul sito sono descritti con la massima accuratezza possibile. Le immagini dei prodotti sono indicative e possono differire leggermente dal prodotto reale per via della resa dei colori sui diversi schermi.",
      "I prezzi indicati sono comprensivi di IVA e sono espressi in Euro. Project: Traceback si riserva il diritto di modificare i prezzi in qualsiasi momento senza preavviso. Il prezzo applicato all'ordine è quello indicato al momento del completamento dell'acquisto.",
    ],
  },
  {
    id: "ordini",
    title: "Ordini e pagamenti",
    content: [
      "L'ordine si considera confermato solo dopo la ricezione di una email di conferma da parte di Project: Traceback. Ci riserviamo il diritto di rifiutare o annullare un ordine in qualsiasi momento, incluso dopo la conferma, in caso di errori nei prezzi, problemi di disponibilità o sospetti di frode.",
      "Accettiamo i seguenti metodi di pagamento: carta di credito/debito (Visa, Mastercard), PayPal e Apple Pay. Tutti i pagamenti sono processati in modo sicuro tramite provider certificati PCI-DSS. I dati della carta non vengono mai memorizzati sui nostri server.",
    ],
  },
  {
    id: "spedizioni",
    title: "Spedizioni e consegne",
    content: [
      "Effettuiamo spedizioni in Italia e in Europa. I tempi di consegna stimati sono: Italia 2-4 giorni lavorativi, Europa 5-10 giorni lavorativi. I tempi possono variare durante i periodi di alta stagione o per cause di forza maggiore.",
      "Le spese di spedizione sono calcolate al momento del checkout in base alla destinazione e al peso dell'ordine. La spedizione è gratuita per ordini superiori a [soglia placeholder] in Italia.",
    ],
  },
  {
    id: "resi",
    title: "Resi e diritto di recesso",
    content: [
      "Il consumatore ha diritto di esercitare il diritto di recesso entro 14 giorni dalla ricezione del prodotto, senza necessità di indicare alcuna motivazione, ai sensi del D.Lgs. 21/2014.",
      "Per avviare un reso è necessario contattare info@projecttraceback.com entro il termine indicato. Il prodotto deve essere restituito nelle condizioni originali, completo di etichette e imballaggio. Le spese di restituzione sono a carico del cliente salvo diversa indicazione.",
    ],
  },
  {
    id: "responsabilita",
    title: "Limitazione di responsabilità",
    content: [
      "Project: Traceback non è responsabile per danni indiretti, incidentali o consequenziali derivanti dall'uso o dall'impossibilità di usare il sito o i prodotti acquistati, nella misura massima consentita dalla legge applicabile.",
      "La responsabilità complessiva di Project: Traceback nei confronti dell'utente, per qualsiasi causa, non potrà in nessun caso superare l'importo pagato dall'utente per l'ordine che ha dato origine alla controversia.",
    ],
  },
  {
    id: "legge",
    title: "Legge applicabile e foro",
    content: [
      "I presenti Termini e Condizioni sono disciplinati dalla legge italiana. Per qualsiasi controversia derivante o connessa all'utilizzo del sito o all'acquisto di prodotti, sarà competente in via esclusiva il Foro di [città placeholder], salvo che l'utente rivesta la qualifica di consumatore, nel qual caso sarà competente il foro del luogo di residenza o domicilio del consumatore.",
    ],
  },
];

export const metadata = { title: "Termini e Condizioni — Project: Traceback" };

export default function TerminiPage() {
  return <LegalTemplate title="Termini e Condizioni" sections={sections} />;
}
