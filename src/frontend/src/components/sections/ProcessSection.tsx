import { CheckCircle2, Settings, Package2, Truck } from 'lucide-react';
import { MachineryBlock } from './MachineryBlock';

export function ProcessSection() {
  const steps = [
    {
      icon: Settings,
      title: 'Sourcing & Inspection',
      description: 'We source quality varagu from trusted suppliers and conduct thorough quality checks on incoming raw materials'
    },
    {
      icon: Settings,
      title: 'Processing & Separation',
      description: 'Advanced dehusking and separation processes extract clean husk material while maintaining its natural properties'
    },
    {
      icon: Package2,
      title: 'Quality Control & Packaging',
      description: 'Rigorous quality testing ensures consistency, followed by proper packaging to preserve material integrity'
    },
    {
      icon: Truck,
      title: 'Storage & Delivery',
      description: 'Proper storage facilities and efficient logistics ensure timely delivery to our customers'
    }
  ];

  const capabilities = [
    'Bulk processing capacity',
    'Consistent quality standards',
    'Flexible packaging options',
    'Timely delivery schedules',
    'Custom processing requirements',
    'Quality documentation'
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-foreground">Our Process & Capabilities</h2>
          <p className="text-lg text-foreground/75 leading-relaxed font-medium">
            Our systematic approach ensures consistent quality and efficient processing of varagu husk from raw material to finished product.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-card p-6 rounded-lg border-2 border-border shadow-soft h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-card-foreground/70 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            );
          })}
        </div>

        {/* Capabilities */}
        <div className="bg-card p-8 md:p-12 rounded-xl border-2 border-border shadow-medium">
          <h3 className="text-2xl font-semibold mb-8 text-center text-card-foreground">
            Our Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-card-foreground/75 font-medium">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Machinery Block */}
        <MachineryBlock />
      </div>
    </section>
  );
}
