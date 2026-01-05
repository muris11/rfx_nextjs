import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for RFX streaming platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Terms of Service</span>
        </nav>

        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-text-secondary mb-8">Last updated: January 2025</p>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing and using RFX, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-text-secondary leading-relaxed">
              RFX is a content aggregation platform that provides access to dramas, anime, comics, 
              and short videos from various external sources. We do not host any content directly 
              on our servers. All content is provided by third-party APIs and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              As a user of RFX, you agree to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Use the service for personal, non-commercial purposes only</li>
              <li>Not attempt to circumvent any security measures</li>
              <li>Not use automated systems to access the service</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Content Disclaimer</h2>
            <p className="text-text-secondary leading-relaxed">
              RFX does not claim ownership of any content displayed on the platform. All content 
              is sourced from third-party providers and remains the property of their respective 
              owners. We are not responsible for the accuracy, completeness, or availability of 
              any content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              RFX is provided &quot;as is&quot; without any warranties. We are not liable for any 
              damages arising from your use of the service, including but not limited to direct, 
              indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Service Availability</h2>
            <p className="text-text-secondary leading-relaxed">
              We do not guarantee uninterrupted access to the service. Content availability 
              depends on third-party APIs and may change without notice. We reserve the right 
              to modify or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the 
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@rfx.com" className="text-primary hover:underline">
                support@rfx.com
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
