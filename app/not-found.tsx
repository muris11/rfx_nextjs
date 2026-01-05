import Link from "next/link";
import { Home, Search } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold gradient-text">404</h1>
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          <p className="text-[#B3B3B3]">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary" className="gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-sm text-[#666]">
            Lost? Try exploring our{" "}
            <Link href="/drama" className="text-[#E50914] hover:underline">
              Drama
            </Link>
            ,{" "}
            <Link href="/anime" className="text-[#E50914] hover:underline">
              Anime
            </Link>
            , or{" "}
            <Link href="/komik" className="text-[#E50914] hover:underline">
              Comics
            </Link>{" "}
            sections.
          </p>
        </div>
      </div>
    </div>
  );
}
