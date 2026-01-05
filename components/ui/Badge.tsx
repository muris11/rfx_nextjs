interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning";
  className?: string;
}

export default function Badge({ 
  children, 
  variant = "default", 
  className = "" 
}: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white",
    primary: "bg-[#E50914] text-white",
    secondary: "bg-[#00D9FF] text-black",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-black",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
