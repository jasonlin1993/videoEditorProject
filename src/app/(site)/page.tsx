import Hero from "@/components/home/Hero";
import WorksSection from "@/components/home/WorksSection";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <WorksSection />
    </main>
  );
}
