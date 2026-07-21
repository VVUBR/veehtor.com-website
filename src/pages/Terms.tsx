import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSiteContent } from "@/i18n/siteContent";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Terms = () => {
  const navigate = useNavigate();
  const { terms: T, legalCommon: LC } = useSiteContent();

  useEffect(() => {
    document.title = T.metaTitle;
  }, [T.metaTitle]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {LC.backHome}
          </Button>
          <LanguageSwitcher />
        </div>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-4">{T.title}</h1>

          <p className="text-muted-foreground mb-8">{LC.lastUpdated}</p>

          <div className="space-y-8">
            <section>
              {T.intro.map((p, i) => <p key={i}>{p}</p>)}
              <p className="text-sm italic text-muted-foreground">
                <strong>{T.disclaimer.split(":")[0]}:</strong>{T.disclaimer.slice(T.disclaimer.indexOf(":") + 1)}
              </p>
            </section>

            {T.sections.map((sec, i) => (
              <section key={i}>
                <h2 className="text-2xl font-semibold mt-8 mb-4">{sec.title}</h2>
                {sec.blocks.map((b, j) =>
                  typeof b === "string" ? (
                    <p key={j}>{b}</p>
                  ) : (
                    <div key={j}>
                      {b.subtitle && <h3 className="text-xl font-semibold mt-6 mb-3">{b.subtitle}</h3>}
                      {b.text && <p>{b.text}</p>}
                      {b.list && (
                        <ul className="list-disc pl-6 space-y-2">
                          {b.list.map((li, k) => <li key={k}>{li}</li>)}
                        </ul>
                      )}
                    </div>
                  ),
                )}
                {sec.title.startsWith("12.") && (
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <p className="font-semibold">{LC.contactBlockTitle}</p>
                    <p>{LC.address}</p>
                    <p>Email: vitor@veehtor.com</p>
                  </div>
                )}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default Terms;
