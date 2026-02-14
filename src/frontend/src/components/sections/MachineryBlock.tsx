import { Cog } from 'lucide-react';

interface MachineryItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

export function MachineryBlock() {
  const machineryItems: MachineryItem[] = [
    {
      title: 'Husk Dehusking Machine',
      description: 'Advanced dehusking equipment efficiently removes varagu husk from grain while preserving material quality and minimizing waste.',
      image: '/assets/generated/husk-machine-photo-01.dim_1200x800.jpg',
      alt: 'Industrial husk dehusking machine for varagu grain processing'
    },
    {
      title: 'Separator & Cleaner',
      description: 'High-precision separation technology cleanly divides husk from grain and removes impurities for consistent output quality.',
      image: '/assets/generated/separator-machine-photo-01.dim_1200x800.jpg',
      alt: 'Grain and husk separator cleaning equipment in operation'
    }
  ];

  return (
    <div className="mt-20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Cog className="h-8 w-8 text-primary" />
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
            Our Machinery
          </h3>
        </div>
        <p className="text-lg text-foreground/75 leading-relaxed font-medium">
          State-of-the-art equipment ensures efficient processing and consistent quality in every batch of varagu husk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {machineryItems.map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border-2 border-border shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300"
          >
            <div className="aspect-[3/2] overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold mb-3 text-card-foreground">
                {item.title}
              </h4>
              <p className="text-sm text-card-foreground/70 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
