import SiteHeader from "@/components/site/SiteHeader";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col bg-ink text-cream">
      <SiteHeader />
      {children}
    </div>
  );
}
