import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, CircleAlert } from "lucide-react";

type Props = {
  title: string;
  description: string;
  items: string[];
  tone?: "positive" | "warning";
};

export default function FeedbackCard({
  title,
  description,
  items,
  tone = "positive",
}: Props) {
  const ItemIcon = tone === "positive" ? CheckCircle2 : CircleAlert;
  const accentClass =
    tone === "positive"
      ? "border-l-emerald-500/70 bg-emerald-500/5"
      : "border-l-amber-500/70 bg-amber-500/5";

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={`${title}-${index}`}
                className={`rounded-2xl border border-border border-l-4 p-4 ${accentClass}`}
              >
                <div className="flex items-start gap-3">
                  <ItemIcon
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      tone === "positive"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  />
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No items available for this section.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
