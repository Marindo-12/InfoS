import React, { useEffect, useRef, useState } from 'react';
import { X, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import logo from '../../../public/infos-logo.png';

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
      return [1 + (code % 4), 1, 2 + (code % 3), 1 + (code % 2)];
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
        if (currentX > 214 || index % 2 === 1) return null;
        return <rect key={`${index}-${currentX}`} x={currentX + 4} y="8" width={width} height="48" fill="#2a2420" />;
      })}
      <text x="110" y="67" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#605850">
        {value}
      </text>
    </svg>
  );
};

export const PaymentCertificate: React.FC<PaymentCertificateProps> = ({ certificate, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [showDownloadAlert, setShowDownloadAlert] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    document.body.classList.add('certificate-open');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove('certificate-open');
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current || isDownloading) return;
    setIsDownloading(true);

    const element = certificateRef.current;
    // Options optimisées pour une seule page A4
    const opt = {
      margin:        [0.2, 0.2, 0.2, 0.2], // marges réduites
      filename:     `certificat_${certificate.reference}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      setShowDownloadAlert(false);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        body.certificate-open nav.sticky,
        body.certificate-open .a-sidebar {
          display: none !important;
        }
        body.certificate-open .a-content {
          margin-left: 0 !important;
        }
        body.certificate-open {
          overflow: hidden;
        }
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        {/* Bouton Fermer (toujours visible) */}
        <div className="no-print absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-[#d8d0c8] bg-white px-4 py-2 text-sm font-semibold text-[#605850] shadow-sm transition hover:bg-[#f6f0e8]"
          >
            <X size={16} /> Fermer
          </button>
        </div>

        {/* Alerte personnalisée centrée avec ombre */}
        {showDownloadAlert && (
          <div className="no-print fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-96 rounded-xl bg-white shadow-2xl border border-orange-100 p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                  <Download size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Certificat disponible</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Ce certificat ne s’affichera qu’une seule fois.
                    Téléchargez-le dès maintenant pour le conserver sur votre appareil.
                  </p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={onClose}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                      Ignorer
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="flex items-center gap-1 rounded-lg bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:opacity-50"
                    >
                      <Download size={14} />
                      {isDownloading ? 'Génération...' : 'Télécharger le PDF'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu du certificat - optimisé pour tenir sur une seule page */}
        <div ref={certificateRef} className="relative w-full max-w-[800px] bg-white p-6 text-[#3a302a] shadow-2xl" style={{ minHeight: 'auto' }}>
          {/* Suppression de la bordure extérieure et réduction du padding */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Manrope' font-size='12' fill='%23c2652a' fill-opacity='0.045' text-anchor='middle' transform='rotate(-45 60 60)'%3EINFOS%3C/text%3E%3C/svg%3E\")",
              backgroundRepeat: 'repeat',
            }}
          />

          <header className="relative z-10 mb-6 flex items-start justify-between">
            <div>
              <div className='flex gap-2 items-center'>
                <img src={logo} alt="Logo Info Saloua" className="h-10 w-10" />
                <h1 className="font-serif text-xl font-bold tracking-tight text-[#c2652a]">Info Saloua</h1>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#78706a]">
                Centre de Formation Professionnelle
              </p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[#78706a]">Document Officiel</p>
              <div className="rounded bg-[#fbe8d8] px-2 py-0.5 text-[10px] font-bold text-[#c2652a]">
                REF: {certificate.reference}
              </div>
            </div>
          </header>

          <div className="relative z-10 mb-4 text-center">
            <h2 className="mb-1 font-serif text-2xl font-medium italic text-[#3a302a]">Certificat de Paiement</h2>
            <div className="mx-auto h-0.5 w-20 bg-[#c2652a]/20" />
          </div>

          <section className="relative z-10 space-y-4">
            <p className="text-xs leading-relaxed text-[#78706a]">
              Par la presente, la direction de <strong>Info Saloua</strong> certifie que la demande
              d'inscription ci-dessous a ete enregistree avec les informations de paiement associees.
            </p>

            <div className="grid grid-cols-2 gap-4 border-y border-[#d8d0c8]/60 py-4 text-sm">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#78706a]">Nom et Prenom</span>
                <p className="font-serif text-base font-semibold text-[#3a302a]">{certificate.studentName}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#78706a]">Reference Paiement</span>
                <p className="font-mono text-base font-bold tracking-tight text-[#c2652a]">{certificate.barcodeValue}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#78706a]">Formation</span>
                <p className="text-sm font-medium text-[#3a302a]">{certificate.trainingLabel}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#78706a]">Pole</span>
                <p className="text-sm font-medium text-[#3a302a]">{certificate.category}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#78706a]">Montant</span>
                <p className="text-sm font-bold text-[#3a302a]">{certificate.amount}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#78706a]">Date d'emission</span>
                <p className="text-sm font-medium text-[#3a302a]">{certificate.issuedAt}</p>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-[#c2652a]/40 bg-[#f6f0e8] p-3">
              <h4 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#3a302a]">Statut du paiement</h4>
              <p className="text-xs leading-relaxed text-[#78706a]">
                Mode: <strong>{certificate.paymentMode}</strong>. Statut: <strong>{certificate.paymentStatus}</strong>.
                Ce document confirme l'enregistrement du paiement ou de la demande de paiement dans le portail Info Saloua.
              </p>
            </div>
          </section>

          <footer className="relative z-10 mt-6 grid grid-cols-2 gap-6 border-t border-[#d8d0c8]/60 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-28 items-center justify-center border border-[#d8d0c8] bg-white p-0.5">
                <Barcode value={certificate.barcodeValue} />
              </div>
              <div className="text-[8px] font-medium uppercase leading-tight text-[#78706a]">
                Scannez pour verifier<br />l'authenticite du document<br />via le portail Info Saloua.
              </div>
            </div>

            <div className="text-center">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#78706a]">La Directrice du Centre</p>
              <div className="mb-0.5 flex h-12 items-center justify-center">
                <p style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive' }} className="text-2xl text-[#3a302a]">
                  Saloua Tazi
                </p>
              </div>
              <div className="mx-auto mb-1 h-px w-24 bg-[#9a9088]" />
              <p className="text-[10px] font-bold text-[#3a302a]">Direction Info Saloua</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};