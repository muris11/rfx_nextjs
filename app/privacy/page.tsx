import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for RFX streaming platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Privacy Policy</span>
        </nav>

        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-text-secondary mb-8">Last updated: January 2025</p>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-text-secondary leading-relaxed">
              At RFX, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              RFX collects minimal data to provide you with a better experience:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li><strong>Local Storage Data:</strong> Favorites, watch history, and preferences stored in your browser</li>
              <li><strong>Usage Data:</strong> Anonymous analytics about how the service is used</li>
              <li><strong>Device Information:</strong> Browser type and basic device information for optimization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We use collected information to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Provide and maintain the service</li>
              <li>Remember your preferences and watch progress</li>
              <li>Improve user experience and service performance</li>
              <li>Analyze usage patterns to enhance features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Storage</h2>
            <p className="text-text-secondary leading-relaxed">
              Most of your data (favorites, history, preferences) is stored locally in your 
              browser using localStorage. This means your data stays on your device and is 
              not transmitted to our servers. Clearing your browser data will remove this information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Third-Party Services</h2>
            <p className="text-text-secondary leading-relaxed">
              RFX uses third-party APIs to provide content. These services may have their own 
              privacy policies. We do not share your personal information with these providers. 
              Content requests are made directly from your browser to these services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              We use essential cookies to ensure the website functions properly. For more 
              information, please see our{" "}
              <Link href="/cookies" className="text-primary hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Access your data stored in localStorage</li>
              <li>Delete your data by clearing browser storage</li>
              <li>Opt out of any analytics tracking</li>
              <li>Request information about data we may hold</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-text-secondary leading-relaxed">
              RFX is not intended for children under 13. We do not knowingly collect 
              personal information from children. If you believe we have collected data 
              from a child, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{" "}
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
