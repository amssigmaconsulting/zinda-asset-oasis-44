import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Shield, Users, Car, Wrench, FileText, Award } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Property Management",
    description: "Comprehensive property management services to maximize your real estate investment returns and maintain your assets professionally.",
    category: "Real Estate"
  },
  {
    icon: Car,
    title: "Vehicle Inspection",
    description: "Professional vehicle inspections and certification services ensuring quality and authenticity for all automobile transactions.",
    category: "Automobile"
  },
  {
    icon: TrendingUp,
    title: "Investment Analytics",
    description: "Advanced market analysis and investment insights for both real estate and luxury automobile markets.",
    category: "Both"
  },
  {
    icon: Wrench,
    title: "Maintenance Services",
    description: "Expert maintenance and servicing for luxury vehicles with certified technicians and genuine parts.",
    category: "Automobile"
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Bank-level security and verified listings ensure safe, transparent transactions for all your asset purchases.",
    category: "Both"
  },
  {
    icon: FileText,
    title: "Documentation Support",
    description: "Complete paperwork assistance for property deeds, vehicle titles, and all legal documentation requirements.",
    category: "Both"
  },
  {
    icon: Users,
    title: "Expert Advisory",
    description: "Access to experienced professionals in both real estate and automotive industries dedicated to your success.",
    category: "Both"
  },
  {
    icon: Award,
    title: "Concierge Services",
    description: "White-glove concierge services for high-value transactions, from private viewings to delivery coordination.",
    category: "Both"
  }
];

const Services = () => {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Why Choose Zinda</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive real estate and automobile services backed by cutting-edge technology 
            and decades of market expertise across multiple asset classes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card group">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;