import React from 'react';

export interface PaymentCertificateData {
  studentName: string;
  reference: string;
  barcodeValue: string;
  trainingLabel: string;
  category: string;
  amount: string;
  paymentMode: string;
  paymentStatus: string;
  issuedAt: string;
}

interface PaymentCertificateProps {
  certificate: PaymentCertificateData;
  onClose: () => void;
}

const barcodePattern = (value: string) => {
  const source = value || 'INFOS';

  return Array.from(source)
    .flatMap((char, index) => {
      const code = char.charCodeAt(0) + index * 17;
      return [
        1 + (code % 4),
        1,
        2 + (code % 3),
        1 + (code % 2),
      ];
    })
    .slice(0, 90);
};

const Barcode: React.FC<{ value: string }> = ({ value }) => {
  const bars = barcodePattern(value);
  let x = 0;

  return (
    <svg viewBox="0 0 220 72" className="h-full w-full" role="img" aria-label={`Code-barres ${value}`}>
      <rect width="220" height="72" fill="#ffffff" />
      {bars.map((width, index) => {
        const currentX = x;
        x += width + 1;

        if (currentX > 214 || index % 2 === 1) {
          return null;
        }

        return <rect key={`${index}-${currentX}`} x={currentX + 4} y="8" width={width} height="48" fill="#2a2420" />;
      })}
      <text x="110" y="67" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#605850">
        {value}
      </text>
    </svg>
  );
};

export const PaymentCertificate: React.FC<PaymentCertificateProps> = ({ certificate, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#2a2420]/70 p-4 backdrop-blur-sm">
    <div className="no-print fixed right-4 top-4 z-10 flex gap-3">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-[#d8d0c8] bg-white px-4 py-2 text-sm font-semibold text-[#605850] shadow-sm transition hover:bg-[#f6f0e8]"
      >
        Fermer
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg bg-[#c2652a] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
      >
        Imprimer
      </button>
    </div>

    <main className="relative my-8 flex min-h-[1000px] w-full max-w-[800px] flex-col overflow-hidden border border-[#d8d0c8] bg-white p-10 text-[#3a302a] shadow-2xl md:p-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Manrope' font-size='12' fill='%23c2652a' fill-opacity='0.045' text-anchor='middle' transform='rotate(-45 60 60)'%3EINFOS%3C/text%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
        }}
      />

      <header className="relative z-10 mb-14 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#c2652a]">Info Saloua</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#78706a]">
            Centre de Formation Professionnelle
          </p>
        </div>
        <div className="text-right">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#78706a]">Document Officiel</p>
          <div className="rounded bg-[#fbe8d8] px-3 py-1 text-xs font-bold text-[#c2652a]">
            REF: {certificate.reference}
          </div>
        </div>
      </header>

      <div className="relative z-10 mb-14 text-center">
        <h2 className="mb-2 font-serif text-4xl font-medium italic text-[#3a302a]">Certificat de Paiement</h2>
        <div className="mx-auto h-0.5 w-24 bg-[#c2652a]/20" />
      </div>

      <section className="relative z-10 flex-1 space-y-10">
        <p className="leading-relaxed text-[#78706a]">
          Par la presente, la direction de <strong>Info Saloua</strong> certifie que la demande
          d'inscription ci-dessous a ete enregistree avec les informations de paiement associees.
        </p>

        <div className="grid grid-cols-1 gap-8 border-y border-[#d8d0c8]/60 py-8 md:grid-cols-2">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#78706a]">Nom et Prenom</span>
            <p className="font-serif text-2xl font-semibold text-[#3a302a]">{certificate.studentName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#78706a]">Reference Paiement</span>
            <p className="font-mono text-2xl font-bold tracking-tight text-[#c2652a]">{certificate.barcodeValue}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#78706a]">Formation</span>
            <p className="text-lg font-medium text-[#3a302a]">{certificate.trainingLabel}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#78706a]">Pole</span>
            <p className="text-lg font-medium text-[#3a302a]">{certificate.category}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#78706a]">Montant</span>
            <p className="text-lg font-bold text-[#3a302a]">{certificate.amount}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#78706a]">Date d'emission</span>
            <p className="text-lg font-medium text-[#3a302a]">{certificate.issuedAt}</p>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-[#c2652a]/40 bg-[#f6f0e8] p-6">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3a302a]">Statut du paiement</h4>
          <p className="text-sm leading-relaxed text-[#78706a]">
            Mode: <strong>{certificate.paymentMode}</strong>. Statut: <strong>{certificate.paymentStatus}</strong>.
            Ce document confirme l'enregistrement du paiement ou de la demande de paiement dans le portail Info Saloua.
          </p>
        </div>
      </section>

      <footer className="relative z-10 mt-16 grid grid-cols-2 gap-12 border-t border-[#d8d0c8]/60 pt-8">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-36 items-center justify-center border border-[#d8d0c8] bg-white p-1">
            <Barcode value={certificate.barcodeValue} />
          </div>
          <div className="text-[10px] font-medium uppercase leading-tight text-[#78706a]">
            Scannez pour verifier<br />l'authenticite du document<br />via le portail Info Saloua.
          </div>
        </div>

        <div className="text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#78706a]">La Directrice du Centre</p>
          <div className="mb-1 flex h-16 items-center justify-center">
            <p style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive' }} className="text-4xl text-[#3a302a]">
              Saloua Tazi
            </p>
          </div>
          <div className="mx-auto mb-2 h-px w-32 bg-[#9a9088]" />
          <p className="text-xs font-bold text-[#3a302a]">Direction Info Saloua</p>
        </div>
      </footer>

      <div className="absolute bottom-6 left-12 right-12 flex items-end justify-between opacity-40">
        <p className="text-[8px] uppercase tracking-widest">Genere automatiquement par Info Saloua</p>
        <p className="text-[8px] uppercase tracking-widest">Page 1 / 1</p>
      </div>
    </main>
  </div>
);

export default PaymentCertificate;
