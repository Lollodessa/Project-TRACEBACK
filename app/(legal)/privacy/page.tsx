import LegalTemplate, { type LegalSection } from "@/components/LegalTemplate";

const sections: LegalSection[] = [
  {
    id: "titolare",
    title: "Titolare del trattamento",
    content: [
      "Project: Traceback, con sede in [indirizzo placeholder], è il titolare del trattamento dei dati personali raccolti attraverso questo sito. Per qualsiasi questione relativa alla privacy è possibile contattarci all'indirizzo info@projecttraceback.com.",
      "Il titolare si impegna a trattare i dati personali nel rispetto del Regolamento (UE) 2016/679 (GDPR) e della normativa italiana vigente in materia di protezione dei dati.",
    ],
  },
  {
    id: "dati-raccolti",
    title: "Dati raccolti",
    content: [
      "Raccogliamo dati personali che l'utente fornisce volontariamente durante la navigazione o l'acquisto: nome, cognome, indirizzo email, indirizzo di spedizione, numero di telefono e dati di pagamento (gestiti in modo sicuro da provider terzi).",
      "Raccogliamo inoltre dati tecnici in modo automatico: indirizzo IP, tipo di browser, sistema operativo, pagine visitate e durata della sessione. Questi dati vengono utilizzati esclusivamente per finalità statistiche e di sicurezza.",
    ],
  },
  {
    id: "finalita",
    title: "Finalità del trattamento",
    content: [
      "I dati raccolti vengono trattati per: (a) evadere gli ordini e gestire il rapporto contrattuale; (b) inviare comunicazioni commerciali e newsletter, previo consenso esplicito; (c) adempiere a obblighi legali e fiscali; (d) migliorare i servizi offerti tramite analisi aggregate.",
      "Il trattamento è fondato sulle seguenti basi giuridiche: esecuzione del contratto (art. 6.1.b GDPR), consenso dell'interessato (art. 6.1.a GDPR) e legittimo interesse (art. 6.1.f GDPR).",
    ],
  },
  {
    id: "cookie",
    title: "Cookie e tecnologie simili",
    content: [
      "Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo consenso, cookie analitici e di profilazione. I cookie tecnici non richiedono consenso e non possono essere disabilitati senza compromettere la navigazione.",
      "Per maggiori informazioni sui cookie utilizzati e per gestire le preferenze, consulta la nostra Cookie Policy. Puoi modificare le impostazioni dei cookie in qualsiasi momento attraverso il banner dedicato o le impostazioni del tuo browser.",
    ],
  },
  {
    id: "conservazione",
    title: "Conservazione dei dati",
    content: [
      "I dati personali vengono conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti. I dati relativi agli ordini vengono conservati per 10 anni in ottemperanza agli obblighi fiscali. I dati per finalità di marketing vengono cancellati su richiesta o dopo 24 mesi di inattività.",
    ],
  },
  {
    id: "diritti",
    title: "Diritti dell'utente",
    content: [
      "Ai sensi del GDPR, l'utente ha diritto di: accedere ai propri dati, rettificarli, cancellarli (diritto all'oblio), limitarne il trattamento, riceverne una copia portabile e opporsi al trattamento per finalità di marketing.",
      "Per esercitare tali diritti è sufficiente inviare una richiesta a info@projecttraceback.com. Il titolare risponderà entro 30 giorni. È inoltre possibile presentare reclamo al Garante per la Protezione dei Dati Personali.",
    ],
  },
  {
    id: "contatti",
    title: "Contatti",
    content: [
      "Per qualsiasi domanda relativa al trattamento dei dati personali o per esercitare i propri diritti, è possibile contattare il titolare del trattamento ai seguenti recapiti:",
      "Email: info@projecttraceback.com — Indirizzo: [indirizzo placeholder] — Orari: lun-ven, 9:00-18:00.",
    ],
  },
];

export const metadata = { title: "Privacy Policy — Project: Traceback" };

export default function PrivacyPage() {
  return <LegalTemplate title="Privacy Policy" sections={sections} />;
}
