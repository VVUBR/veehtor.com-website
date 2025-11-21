import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy — Veehtor AI, LLC</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: November 21, 2025
          </p>

          <div className="space-y-8">
            <section>
              <p>
                This Privacy Policy explains how Veehtor AI, LLC ("Veehtor AI", "we", "us", or "our") collects, uses, and protects information when you visit our website, use our AI (Artificial Intelligence) tools, or interact with us in any way.
              </p>
              <p>
                By using our website or services, you agree to the practices described in this Privacy Policy.
              </p>
              <p className="text-sm italic text-muted-foreground">
                <strong>Important:</strong> This document is a general template and does not constitute legal advice. For full compliance with specific regulations in your jurisdiction (such as GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), etc.), you should consult a qualified attorney.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">1.1. Information you provide directly</h3>
              <p>We may collect information that you voluntarily provide to us, such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Company name and role/title</li>
                <li>Information about your business, use cases, or processes</li>
                <li>Content you submit through forms, email, chat, bookings, or demo/consultation requests</li>
                <li>Any other details you choose to share when communicating with us.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.2. Information collected automatically</h3>
              <p>When you visit our website or use our online tools, we may automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP (Internet Protocol) address</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited, time and date of visit, time spent on pages, and referring URL</li>
                <li>General location information (such as city or region) derived from your IP address</li>
                <li>Cookies and similar tracking technologies (see Section 4).</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.3. Information from third parties</h3>
              <p>We may receive information about you from third parties, such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analytics providers (for example, website traffic and usage statistics)</li>
                <li>Advertising and marketing platforms (for example, campaign performance data)</li>
                <li>Service providers and integration partners that help us deliver our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect for purposes including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing, operating, and improving our website, AI tools, and consulting services</li>
                <li>Responding to your inquiries, demo requests, and consultation bookings</li>
                <li>Preparing proposals, scopes of work, and service agreements</li>
                <li>Configuring, testing, and maintaining AI agents, automations, and solutions for you</li>
                <li>Communicating with you about updates, features, offers, and service-related notices</li>
                <li>Analyzing website and service usage to improve user experience and performance</li>
                <li>Detecting, preventing, and addressing technical, security, or fraud issues</li>
                <li>Complying with legal obligations and enforcing our agreements and rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Share Your Information</h2>
              <p className="font-semibold">We do not sell your personal information.</p>
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service providers:</strong> We may share information with trusted third-party vendors who perform services on our behalf, such as hosting, analytics, email delivery, CRM (Customer Relationship Management) systems, payment processors, and AI infrastructure providers.</li>
                <li><strong>Professional advisors:</strong> We may share information with lawyers, accountants, insurers, or other professional advisors when necessary.</li>
                <li><strong>Legal and safety reasons:</strong> We may disclose information if required to do so by law or in response to valid legal requests, or when we believe disclosure is necessary to protect our rights, property, or safety, or that of others.</li>
                <li><strong>Business transfers:</strong> If we are involved in a merger, acquisition, financing, or sale of all or part of our business, your information may be transferred as part of that transaction, subject to reasonable confidentiality protections.</li>
              </ul>
              <p>We expect our service providers to use your information only to perform services for us and to protect it appropriately.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
              <p>We may use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Understand how visitors use our website</li>
                <li>Improve site performance and content</li>
                <li>Support analytics and, where applicable, marketing or advertising efforts.</li>
              </ul>
              <p>You can usually configure your browser to refuse some or all cookies or to alert you when cookies are being used. If you disable cookies, some parts of our website may not function properly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Use of AI and Third-Party APIs (Application Programming Interfaces)</h2>
              <p>Our services and demo tools may involve processing data with third-party AI models and APIs.</p>
              <p>When you submit data (such as text, prompts, or examples) into our AI tools or through our services, that data may be processed by external AI providers to generate outputs.</p>
              <p>We take reasonable steps to select reputable providers and configure them securely, but no system is completely risk-free.</p>
              <p className="font-semibold">You should avoid including highly sensitive personal information (such as passwords, payment card numbers, bank details, or health information) in general-purpose AI forms, demo tools, or exploratory sessions, unless we have explicitly agreed in writing to a secure, compliant configuration for that data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
              <p>We retain your information only for as long as reasonably necessary to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and support our services</li>
                <li>Maintain business records for legal, tax, or accounting purposes</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Support our legitimate business interests.</li>
              </ul>
              <p>When information is no longer needed for these purposes, we will take reasonable steps to delete or anonymize it.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Security</h2>
              <p>We use reasonable technical and organizational measures designed to protect your information from unauthorized access, disclosure, alteration, or destruction.</p>
              <p>However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Your Rights and Choices</h2>
              <p>Depending on your location and applicable law, you may have rights regarding your personal information, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to access and obtain a copy of the information we hold about you</li>
                <li>The right to request correction of inaccurate or incomplete information</li>
                <li>The right to request deletion of your information, subject to certain legal or contractual obligations</li>
                <li>The right to object to or restrict certain types of processing</li>
                <li>The right to withdraw consent where processing is based on consent</li>
                <li>The right to opt out of marketing communications.</li>
              </ul>
              <p>You can opt out of marketing emails at any time by clicking the unsubscribe link in the email, or by contacting us directly.</p>
              <p>To exercise any of these rights (when applicable), please contact us using the details in Section 11.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
              <p>Our website and services are intended for business and professional users and are not directed to children under the age of 13.</p>
              <p>We do not knowingly collect personal information from children. If you believe we may have collected information from a child, please contact us so that we can investigate and take appropriate action, including deletion if necessary.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements.</p>
              <p>When we make changes, we will update the "Last updated" date at the top of this page. Your continued use of our website or services after changes are posted constitutes your acceptance of the updated Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
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

export default Privacy;
