import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, value, delay = 0 }: FeatureCardProps) => {
  return (
    <div
      className="glass-card p-4 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
