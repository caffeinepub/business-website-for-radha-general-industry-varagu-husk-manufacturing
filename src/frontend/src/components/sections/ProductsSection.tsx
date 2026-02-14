import { Package, Sprout, Flame, Recycle } from 'lucide-react';
import { PHONE_DIAL } from '@/lib/contact';

export function ProductsSection() {
  const products = [
    {
      icon: Sprout,
      title: 'Animal Feed Supplement',
      description: 'Processed varagu husk rich in fiber, ideal for livestock and poultry feed formulations',
      applications: ['Cattle feed', 'Poultry nutrition', 'Mixed feed ingredient']
    },
    {
      icon: Flame,
      title: 'Biomass Fuel',
      description: 'Clean-burning husk material suitable for industrial boilers and biomass energy generation',
      applications: ['Industrial heating', 'Power generation', 'Eco-friendly fuel']
    },
    {
      icon: Recycle,
      title: 'Organic Compost Base',
      description: 'Natural organic material perfect for composting and soil enrichment applications',
      applications: ['Composting material', 'Soil amendment', 'Organic farming']
    },
    {
      icon: Package,
      title: 'Industrial Raw Material',
      description: 'Versatile husk material for various industrial and manufacturing processes',
      applications: ['Bio-material production', 'Packaging material', 'Industrial applications']
    }
  ];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-foreground">Our Products</h2>
          <p className="text-lg text-foreground/75 leading-relaxed font-medium">
            We process varagu (kodo millet) husk into high-quality products for diverse applications. Our processed husk materials serve multiple industries with consistent quality and reliable supply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border-2 border-border shadow-soft hover:shadow-medium transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-card-foreground">
                      {product.title}
                    </h3>
                  </div>
                </div>
                <p className="text-card-foreground/75 mb-4 leading-relaxed font-medium">
                  {product.description}
                </p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-card-foreground">Key Applications:</div>
                  <ul className="space-y-1">
                    {product.applications.map((app, idx) => (
                      <li key={idx} className="text-sm text-card-foreground/70 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-foreground/75 mb-6 font-medium">
            All products are available in bulk quantities. Packing is in a gunny bag.
          </p>
          <a
            href={PHONE_DIAL}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-soft hover:shadow-medium"
          >
            Contact Us for Pricing
          </a>
        </div>
      </div>
    </section>
  );
}
