import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for RFX streaming platform.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Cookie Policy</span>
        </nav>

        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
        <p className="text-text-secondary mb-8">Last updated: January 2025</p>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. What Are Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help the website remember your preferences and improve your browsing experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Cookies</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              RFX uses cookies and similar technologies for the following purposes:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Types of Cookies We Use</h2>
            
            <div className="bg-surface rounded-lg p-6 border border-border mb-4">
              <h3 className="text-white font-medium mb-2">Essential Cookies</h3>
              <p className="text-text-secondary text-sm mb-2">
                These cookies are necessary for the website to work. They enable basic functions 
                like page navigation and access to secure areas.
              </p>
              <p className="text-text-muted text-xs">Duration: Session</p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-border mb-4">
              <h3 className="text-white font-medium mb-2">Local Storage</h3>
              <p className="text-text-secondary text-sm mb-2">
                We use localStorage (similar to cookies) to store your favorites, watch history, 
                and viewing preferences. This data stays on your device.
              </p>
              <p className="text-text-muted text-xs">Duration: Persistent until cleared</p>
            </div>

            <div className="bg-surface rounded-lg p-6 border border-border">
              <h3 className="text-white font-medium mb-2">Analytics</h3>
              <p className="text-text-secondary text-sm mb-2">
                Anonymous analytics help us understand how visitors interact with our website, 
                allowing us to improve the user experience.
              </p>
              <p className="text-text-muted text-xs">Duration: Up to 2 years</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Third-Party Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              Some content on RFX is loaded from third-party sources (video players, APIs). 
              These services may set their own cookies. We have no control over these cookies 
              and recommend reviewing their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Managing Cookies</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies</li>
              <li><strong>Clear Local Storage:</strong> Clear your browser data to remove stored preferences</li>
              <li><strong>Private Browsing:</strong> Use incognito/private mode to limit cookie storage</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-4">
              Note: Disabling cookies may affect the functionality of the website and your 
              personalized experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Updates to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes will be posted 
              on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:privacy@rfx.com" className="text-primary hover:underline">
                privacy@rfx.com
              </a>
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link 
            href="/help" 
            className="text-primary hover:underline flex items-center gap-2"
          >
            &larr; Back to Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
