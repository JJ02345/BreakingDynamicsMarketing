import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Datenschutz = function() {
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
            <Shield className="h-6 w-6 text-[#FF6B35]" />
          </div>
          <h1 className="font-['Syne'] text-3xl font-bold text-white">
            {isDE ? 'Datenschutzerklärung' : 'Privacy Policy'}
          </h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Intro */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert dich über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener Daten auf unserer Website.'
                : 'Protecting your personal data is important to us. This privacy policy informs you about the type, scope, and purpose of processing personal data on our website.'}
            </p>
          </section>

          {/* Verantwortlicher */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '1. Verantwortlicher' : '1. Data Controller'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE ? 'Verantwortlich für die Datenverarbeitung auf dieser Website:' : 'Responsible for data processing on this website:'}
            </p>
            <div className="mt-4 p-4 bg-white/5 rounded-lg text-white/60 text-sm">
              <p className="font-medium text-white/80">Breaking Dynamics UG (haftungsbeschränkt) i.G.</p>
              <p>Geschäftsführer: Jonas Niklas Jaksch</p>
              <p>Spadener Straße 123</p>
              <p>27578 Bremerhaven</p>
              <p>Deutschland</p>
              <p>E-Mail: jjaksch@breakingdynamics.com</p>
            </div>
          </section>

          {/* Hosting */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '2. Hosting' : '2. Hosting'}
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {isDE
                ? 'Diese Website wird bei GitHub Pages gehostet. Anbieter ist die GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA.'
                : 'This website is hosted on GitHub Pages. The provider is GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA.'}
            </p>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'GitHub kann beim Aufruf dieser Website Zugriffsdaten erheben (IP-Adresse, Datum/Uhrzeit des Zugriffs, aufgerufene Seite). Diese Daten werden zur Bereitstellung der Website benötigt.'
                : 'GitHub may collect access data when you visit this website (IP address, date/time of access, page accessed). This data is required to provide the website.'}
            </p>
          </section>

          {/* Datenerfassung */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '3. Datenerfassung auf dieser Website' : '3. Data Collection on This Website'}
            </h2>

            <h3 className="text-lg font-medium text-white mt-6 mb-3">
              {isDE ? 'a) Nutzung ohne Account' : 'a) Usage Without Account'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Du kannst den Carousel Creator ohne Registrierung nutzen. Dabei werden keine personenbezogenen Daten von uns gespeichert. Deine erstellten Carousels werden lokal in deinem Browser (LocalStorage) gespeichert.'
                : 'You can use the Carousel Creator without registration. We do not store any personal data in this case. Your created carousels are stored locally in your browser (LocalStorage).'}
            </p>

            <h3 className="text-lg font-medium text-white mt-6 mb-3">
              {isDE ? 'b) Account-Registrierung' : 'b) Account Registration'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Bei der Registrierung erheben wir deine E-Mail-Adresse. Diese wird für die Authentifizierung und zum Speichern deiner Carousels verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).'
                : 'When registering, we collect your email address. This is used for authentication and to save your carousels. Legal basis is Art. 6 para. 1 lit. b GDPR (contract performance).'}
            </p>

            <h3 className="text-lg font-medium text-white mt-6 mb-3">
              {isDE ? 'c) Newsletter' : 'c) Newsletter'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Wenn du dich für unseren Newsletter anmeldest, speichern wir deine E-Mail-Adresse. Wir nutzen diese nur, um dich über neue Tools und Updates zu informieren. Du kannst dich jederzeit abmelden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).'
                : 'If you subscribe to our newsletter, we store your email address. We only use this to inform you about new tools and updates. You can unsubscribe at any time. Legal basis is Art. 6 para. 1 lit. a GDPR (consent).'}
            </p>

            <h3 className="text-lg font-medium text-white mt-6 mb-3">
              {isDE ? 'd) Feedback' : 'd) Feedback'}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Beim Absenden von Feedback speichern wir die Nachricht und optional deine E-Mail-Adresse für Rückfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Produktverbesserung).'
                : 'When submitting feedback, we store the message and optionally your email address for follow-up questions. Legal basis is Art. 6 para. 1 lit. f GDPR (legitimate interest in product improvement).'}
            </p>
          </section>

          {/* Supabase */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '4. Datenbankdienst (Supabase)' : '4. Database Service (Supabase)'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Wir nutzen Supabase als Datenbankdienst. Supabase speichert Daten auf Servern in der EU (Frankfurt). Anbieter: Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992.'
                : 'We use Supabase as our database service. Supabase stores data on servers in the EU (Frankfurt). Provider: Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992.'}
            </p>
          </section>

          {/* KI */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '5. KI-Generierung' : '5. AI Generation'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Der optionale KI-Generator sendet deine eingegebene Hypothese/Thema an unseren eigenen Server zur Verarbeitung. Die Daten werden nicht dauerhaft gespeichert und nur zur Generierung des Carousels verwendet.'
                : 'The optional AI generator sends your entered hypothesis/topic to our own server for processing. The data is not permanently stored and is only used to generate the carousel.'}
            </p>
          </section>

          {/* Cookies */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '6. Cookies & LocalStorage' : '6. Cookies & LocalStorage'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Wir verwenden keine Tracking-Cookies. Wir nutzen LocalStorage, um deine Carousel-Entwürfe lokal zu speichern und Authentifizierungs-Sessions zu verwalten. Diese Daten verlassen deinen Browser nicht.'
                : 'We do not use tracking cookies. We use LocalStorage to store your carousel drafts locally and manage authentication sessions. This data does not leave your browser.'}
            </p>
          </section>

          {/* Rechte */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '7. Deine Rechte' : '7. Your Rights'}
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              {isDE ? 'Du hast das Recht auf:' : 'You have the right to:'}
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>{isDE ? 'Auskunft über deine gespeicherten Daten' : 'Information about your stored data'}</li>
              <li>{isDE ? 'Berichtigung unrichtiger Daten' : 'Correction of incorrect data'}</li>
              <li>{isDE ? 'Löschung deiner Daten' : 'Deletion of your data'}</li>
              <li>{isDE ? 'Einschränkung der Verarbeitung' : 'Restriction of processing'}</li>
              <li>{isDE ? 'Datenübertragbarkeit' : 'Data portability'}</li>
              <li>{isDE ? 'Widerspruch gegen die Verarbeitung' : 'Objection to processing'}</li>
              <li>{isDE ? 'Beschwerde bei einer Aufsichtsbehörde' : 'Complaint to a supervisory authority'}</li>
            </ul>
          </section>

          {/* Aktualisierung */}
          <section className="card-dark p-6 rounded-xl border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isDE ? '8. Aktualisierung' : '8. Updates'}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {isDE
                ? 'Diese Datenschutzerklärung kann bei Bedarf aktualisiert werden. Die aktuelle Version findest du immer auf dieser Seite.'
                : 'This privacy policy may be updated as needed. You can always find the current version on this page.'}
            </p>
            <p className="text-white/40 text-sm mt-4">
              {isDE ? 'Stand: Dezember 2024' : 'Last updated: December 2024'}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Datenschutz;
