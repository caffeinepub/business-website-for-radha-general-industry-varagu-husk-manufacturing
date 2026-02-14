import { Award, Users, Leaf, TrendingUp } from 'lucide-react';

export function AboutSection() {
  const features = [
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Consistent quality standards in every batch of processed varagu husk'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description: 'Skilled professionals dedicated to efficient millet processing'
    },
    {
      icon: Leaf,
      title: 'Sustainable Process',
      description: 'Eco-friendly processing methods that minimize waste'
    },
    {
      icon: TrendingUp,
      title: 'Reliable Supply',
      description: 'Consistent production capacity to meet your requirements'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-foreground">About Radha general industries</h2>
          <p className="text-lg text-foreground/75 leading-relaxed font-medium">
            Located in the SIDCO Industrial Estate in Theni, Tamil Nadu, Radha general industries is a dedicated manufacturer specializing in varagu (kodo millet) husk processing. We transform agricultural by-products into valuable materials for various industrial and agricultural applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border-2 border-border shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-card-foreground/70 font-medium">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-card p-8 md:p-12 rounded-xl border-2 border-border shadow-medium">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Our Commitment</h3>
            <p className="text-card-foreground/75 leading-relaxed mb-4 font-medium">
              We are committed to delivering high-quality varagu husk products that meet the diverse needs of our customers. Our processing facility is equipped to handle various volumes while maintaining strict quality control at every stage.
            </p>
            <p className="text-card-foreground/75 leading-relaxed font-medium">
              By focusing on sustainable practices and efficient operations, we ensure that our products contribute to both agricultural productivity and environmental responsibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
