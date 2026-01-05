import Card from "../ui/Card";
import { CardSkeleton } from "../ui/Skeleton";

interface ContentItem {
  id: string;
  title: string;
  cover: string;
  subtitle?: string;
  rating?: number;
  episodes?: number;
}

interface ContentGridProps {
  items: ContentItem[];
  type: "drama" | "anime" | "komik" | "shorts";
  isLoading?: boolean;
  columns?: number;
}

export default function ContentGrid({ 
  items, 
  type, 
  isLoading = false,
  columns = 6 
}: ContentGridProps) {
  const gridCols = {
    4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  };

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[6]} gap-4`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <p className="text-[#B3B3B3]">No content found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[6]} gap-4`}>
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          cover={item.cover}
          type={type}
          subtitle={item.subtitle}
          rating={item.rating}
          episodes={item.episodes}
        />
      ))}
    </div>
  );
}
