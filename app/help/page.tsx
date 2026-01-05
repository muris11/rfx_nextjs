import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, HelpCircle, MessageCircle, Mail, FileText, Shield, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help with RFX - streaming platform for dramas, anime, and comics.",
};

const helpTopics = [
  {
    icon: HelpCircle,
    title: "Getting Started",
    description: "Learn how to use RFX and navigate the platform.",
    items: [
      "How to browse content",
      "Creating an account",
      "Using search and filters",
      "Managing your favorites",
    ],
  },
  {
    icon: MessageCircle,
    title: "Playback Issues",
    description: "Solutions for common streaming problems.",
    items: [
      "Video not loading",
      "Buffering issues",
      "Audio problems",
      "Subtitle settings",
    ],
  },
  {
    icon: FileText,
    title: "Account & Settings",
    description: "Manage your account preferences.",
    items: [
      "Viewing history",
      "Favorites list",
      "Continue watching",
      "Data and privacy",
    ],
  },
];

const quickLinks = [
  { href: "/terms", label: "Terms of Service", icon: FileText },
  { href: "/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/cookies", label: "Cookie Policy", icon: Cookie },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Help Center</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Find answers to common questions about using RFX. If you can&apos;t find what you&apos;re looking for, 
            feel free to contact us.
          </p>
        </div>

        {/* Help Topics */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {helpTopics.map((topic) => (
            <div 
              key={topic.title}
              className="bg-surface rounded-lg p-6 border border-border hover:border-primary/50 transition-colors"
            >
              <topic.icon className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold text-white mb-2">{topic.title}</h2>
              <p className="text-sm text-text-secondary mb-4">{topic.description}</p>
              <ul className="space-y-2">
                {topic.items.map((item) => (
                  <li key={item} className="text-sm text-text-muted flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-surface rounded-lg p-8 border border-border mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-2">Is RFX free to use?</h3>
              <p className="text-text-secondary text-sm">
                Yes, RFX is completely free to use. We aggregate content from various sources 
                to provide you with the best streaming experience without any subscription fees.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Why is a video not playing?</h3>
              <p className="text-text-secondary text-sm">
                If a video isn&apos;t playing, try refreshing the page or switching to a different source. 
                Some content may be temporarily unavailable due to external API issues.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">How do I save my favorites?</h3>
              <p className="text-text-secondary text-sm">
                Click the heart icon on any content card to add it to your favorites. 
                Your favorites are saved locally in your browser.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Can I continue watching where I left off?</h3>
              <p className="text-text-secondary text-sm">
                Yes! RFX automatically saves your watching progress. You can find your 
                continue watching list on the home page.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Legal Information</h2>
          <div className="flex flex-wrap gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg text-text-secondary hover:text-white hover:bg-surface-hover transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">Still need help?</p>
          <a
            href="mailto:support@rfx.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
