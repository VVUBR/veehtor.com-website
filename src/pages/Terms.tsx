import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-4">Terms of Service — Veehtor AI, LLC</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: November 21, 2025
          </p>

          <div className="space-y-8">
            <section>
              <p>
                These Terms of Service ("Terms") govern your access to and use of the website, content, and services provided by Veehtor AI, LLC ("Veehtor AI", "we", "us", or "our").
              </p>
              <p>
                By accessing or using our website or services, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.
              </p>
              <p className="text-sm italic text-muted-foreground">
                <strong>Important:</strong> This document is a general template and does not constitute legal advice. For a fully tailored, jurisdiction-specific version, you should consult a qualified attorney.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of the Website</h2>
              <p><strong>1.1.</strong> You may use our website only for lawful purposes and in accordance with these Terms.</p>
              <p><strong>1.2.</strong> You agree not to use the website in any way that could damage, disable, overburden, or impair the website, or interfere with any other party's use and enjoyment of the website.</p>
              <p><strong>1.3.</strong> You agree not to attempt to gain unauthorized access to any part of the website, other accounts, computer systems, or networks connected to the website, whether through hacking, password mining, or any other means.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Our Services</h2>
              <p><strong>2.1.</strong> Veehtor AI provides AI consulting, automation design, AI agent configuration, and related services (collectively, the "Services").</p>
              <p><strong>2.2.</strong> The information on our website, including any AI-generated content, is provided for general informational purposes only and does not constitute professional, legal, financial, or technical advice.</p>
              <p><strong>2.3.</strong> Any specific Services we provide to you will be governed by a separate written agreement, proposal, statement of work, or order form between you and Veehtor AI, which will prevail over these Terms in case of conflict.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. AI Tools and Generated Content</h2>
              <p><strong>3.1.</strong> Our Services and demo tools may use AI models to generate text, suggestions, or other outputs based on prompts or data you provide.</p>
              <p><strong>3.2.</strong> AI-generated content may contain errors, omissions, or inaccuracies and is provided "as is" for your evaluation and use at your own discretion and risk.</p>
              <p><strong>3.3.</strong> You are solely responsible for reviewing, validating, and approving AI outputs before using them in your business or making decisions based on them.</p>
              <p><strong>3.4.</strong> You agree not to rely on AI-generated content as a substitute for professional judgment, and you acknowledge that we do not guarantee the accuracy, completeness, or suitability of any AI outputs.</p>
              <p><strong>3.5.</strong> You agree not to use our AI tools to process prohibited or highly sensitive information unless we have explicitly agreed in writing to a secure, compliant setup for that purpose.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Content</h2>
              <p><strong>4.1.</strong> You may submit content to us, including text, files, data, prompts, or other materials ("User Content") so that we can provide the Services.</p>
              <p><strong>4.2.</strong> You represent and warrant that you have all necessary rights and permissions to provide such User Content and that it does not infringe the rights of any third party or violate any law or regulation.</p>
              <p><strong>4.3.</strong> By providing User Content, you grant Veehtor AI a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and process that User Content solely as necessary to provide, maintain, and improve the Services, comply with legal obligations, and operate our business.</p>
              <p><strong>4.4.</strong> You are responsible for ensuring that your User Content does not contain unlawful, harmful, or inappropriate material.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
              <p><strong>5.1.</strong> The website, its content, and any Service materials (including text, graphics, logos, icons, images, and software) are owned by Veehtor AI or its licensors and are protected by copyright, trademark, and other intellectual property laws.</p>
              <p><strong>5.2.</strong> Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the website for your internal business purposes.</p>
              <p><strong>5.3.</strong> You may not reproduce, modify, distribute, transmit, publicly display, publicly perform, publish, create derivative works from, or exploit any part of the website or Service materials without our prior written consent, except as permitted in a separate written agreement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Services and Links</h2>
              <p><strong>6.1.</strong> Our website and Services may integrate with or link to third-party services, tools, or websites (such as AI providers, automation platforms, analytics tools, or payment processors).</p>
              <p><strong>6.2.</strong> We do not control and are not responsible for the content, policies, or practices of any third-party services or websites.</p>
              <p><strong>6.3.</strong> Your use of third-party services is at your own risk and may be subject to the terms of service and privacy policies of those third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Disclaimers</h2>
              <p><strong>7.1.</strong> The website, Services, AI tools, and all related content are provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied.</p>
              <p><strong>7.2.</strong> To the fullest extent permitted by law, we disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
              <p><strong>7.3.</strong> We do not warrant that the website or Services will be uninterrupted, error-free, secure, or free of viruses or other harmful components, or that any defects will be corrected.</p>
              <p><strong>7.4.</strong> Any decisions or actions you take based on information or AI-generated content from the website or Services are at your own risk, and you should independently verify any information that is important to your business.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
              <p><strong>8.1.</strong> To the maximum extent permitted by law, Veehtor AI will not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages, or for any loss of profits, revenue, data, or business opportunities, arising from or related to your use of the website or Services, even if we have been advised of the possibility of such damages.</p>
              <p><strong>8.2.</strong> Our total aggregate liability to you for any and all claims arising out of or relating to these Terms, the website, or the Services, whether in contract, tort, or otherwise, will be limited to the greater of:</p>
              <p className="pl-6">(a) the amount you paid to us for the Services in the six (6) months preceding the event giving rise to the claim, or</p>
              <p className="pl-6">(b) one hundred U.S. dollars (US $100).</p>
              <p><strong>8.3.</strong> Some jurisdictions do not allow limitations of liability, so some of the above limitations may not apply to you; in such cases, our liability will be limited to the maximum extent permitted by applicable law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless Veehtor AI, LLC and its owners, employees, and agents from and against any and all claims, demands, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of the website or Services</li>
                <li>Your violation of these Terms</li>
                <li>Your infringement or violation of any intellectual property, privacy, or other rights of any third party</li>
                <li>Your User Content and any data or information you provide.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to These Terms</h2>
              <p>We may modify these Terms from time to time.</p>
              <p>When we do, we will update the "Last updated" date at the top of this page. Any changes are effective when posted on the website. Your continued use of the website or Services after changes are posted constitutes your acceptance of the updated Terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law and Jurisdiction</h2>
              <p>These Terms are governed by and construed in accordance with the laws of the State of Wyoming, United States, without regard to its conflict of law principles.</p>
              <p>Any disputes arising out of or relating to these Terms, the website, or the Services will be subject to the exclusive jurisdiction of the state and federal courts located in or nearest to Sheridan, Wyoming, and you consent to such jurisdiction and venue.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <p className="font-semibold">Veehtor AI, LLC</p>
                <p>Address: 30 N Gould St Ste N, Sheridan, WY 82801</p>
                <p>Email: vitor@veehtor.com</p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Terms;
