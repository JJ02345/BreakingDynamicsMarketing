import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Impressum = function() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isDE = language === 'de';

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <button onClick={() => navigate('/')} className="btn-ghost flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{isDE ? 'Zurück' : 'Back'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-[#FF6B35]" />
          </div>
          <h1 className="font-['Syne'] text-3xl font-bold text-white">
            Impressum
          </h1>
        </div>

        <div className="space-y-8">
          {/* Angaben gemäß § 5 TMG */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Angaben gemäß § 5 TMG' : 'Information according to § 5 TMG'}
            </h2>
            <div className="text-white/70 space-y-1">
              <p className="font-medium text-white">Breaking Dynamics</p>
              <p>[Dein vollständiger Name]</p>
              <p>[Straße und Hausnummer]</p>
              <p>[PLZ] [Stadt]</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Kontakt */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Kontakt' : 'Contact'}
            </h2>
            <div className="text-white/70 space-y-2">
              <p>
                <span className="text-white/50">E-Mail: </span>
                <a href="mailto:kontakt@breakingdynamics.de" className="text-[#FF6B35] hover:underline">
                  [deine@email.de]
                </a>
              </p>
              <p className="text-white/50 text-sm mt-4">
                {isDE
                  ? 'Hinweis: Wir sind gesetzlich nicht verpflichtet, eine Telefonnummer anzugeben.'
                  : 'Note: We are not legally required to provide a phone number.'}
              </p>
            </div>
          </section>

          {/* Umsatzsteuer-ID */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Umsatzsteuer-ID' : 'VAT ID'}
            </h2>
            <p className="text-white/70">
              {isDE
                ? 'Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:'
                : 'VAT identification number according to § 27a of the German VAT Act:'}
            </p>
            <p className="text-white/50 mt-2">
              {isDE
                ? '[Noch nicht vorhanden / Kleinunternehmerregelung nach § 19 UStG]'
                : '[Not yet available / Small business regulation according to § 19 UStG]'}
            </p>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV' : 'Responsible for Content'}
            </h2>
            <div className="text-white/70 space-y-1">
              <p>[Dein vollständiger Name]</p>
              <p>[Straße und Hausnummer]</p>
              <p>[PLZ] [Stadt]</p>
            </div>
          </section>

          {/* Streitschlichtung */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Streitschlichtung' : 'Dispute Resolution'}
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {isDE
                ? 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:'
                : 'The European Commission provides a platform for online dispute resolution (ODR):'}
            </p>
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6B35] hover:underline break-all"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            <p className="text-white/70 leading-relaxed mt-4">
              {isDE
                ? 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
                : 'We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.'}
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Haftung für Inhalte' : 'Liability for Content'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
                : 'As a service provider, we are responsible for our own content on these pages according to general laws pursuant to § 7 para. 1 TMG. However, according to §§ 8 to 10 TMG, we are not obliged as a service provider to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.'}
            </p>
          </section>

          {/* Haftung für Links */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Haftung für Links' : 'Liability for Links'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'
                : 'Our offer contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.'}
            </p>
          </section>

          {/* Urheberrecht */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? 'Urheberrecht' : 'Copyright'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.'
                : 'The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator.'}
            </p>
          </section>

          {/* Hinweis */}
          <div className="p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-xl">
            <p className="text-[#FF6B35] text-sm">
              <strong>{isDE ? 'Wichtig:' : 'Important:'}</strong>{' '}
              {isDE
                ? 'Bitte ersetze alle Platzhalter [in eckigen Klammern] mit deinen echten Daten, bevor du die Website öffentlich machst.'
                : 'Please replace all placeholders [in square brackets] with your real data before making the website public.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Impressum;
