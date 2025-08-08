import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import FindAgentSection from "@/components/FindAgentSection";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedProperties />
      <FindAgentSection />
      <Services />
      <Footer />
    </div>
  );
};

export default Index;
