import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import FindAgentSection from "@/components/FindAgentSection";
import Services from "@/components/Services";
import MLSStats from "@/components/MLSStats";
import MLSFeatures from "@/components/MLSFeatures";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <MLSStats />
      <FeaturedProperties />
      <MLSFeatures />
      <FindAgentSection />
      <Services />
      <Footer />
    </div>
  );
};

export default Index;
