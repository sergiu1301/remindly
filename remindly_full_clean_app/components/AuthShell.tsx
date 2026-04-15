import { getMessages } from '@/lib/messages';
import LanguageSwitch from './LanguageSwitch';

type Props = {
  language: 'en' | 'ro';
  setLanguage?: (nextLanguage: 'en' | 'ro') => void;
  children: React.ReactNode;
};

export default function AuthShell({ language, setLanguage, children }: Props) {
  const t = getMessages(language);

  return (
    <div className="pageShell">
      <div className="centerWrap">
        <div className="authGrid">
          <section className="heroPanel">
            <div className="brandRow">
              <div className="brand">
                <div className="brandBadge">R</div>
                <div>
                  <div className="brandTextTop">Secure reminders</div>
                  <div className="brandTextBottom">{t.brand}</div>
                </div>
              </div>

              {setLanguage ? (
                <LanguageSwitch language={language} onChange={setLanguage} />
              ) : null}
            </div>

            <h1 className="heroTitle">{t.loginTitle}</h1>
            <p className="heroCopy">{t.loginSubtitle}</p>

            <div className="heroPoints">
              <li>{t.feature1}</li>
              <li>{t.feature2}</li>
              <li>{t.feature3}</li>
            </div>
          </section>

          <section className="cardPanel">{children}</section>
        </div>
      </div>
    </div>
  );
}
