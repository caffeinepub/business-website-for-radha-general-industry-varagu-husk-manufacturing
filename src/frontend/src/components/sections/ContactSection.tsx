import { Phone, MapPin, Clock } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_DIAL } from '@/lib/contact';

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: PHONE_DISPLAY,
      link: PHONE_DIAL,
      linkText: 'Call Now'
    },
    {
      icon: MapPin,
      title: 'Address',
      content: 'K1 Unit, SIDCO, Theni, Tamil Nadu',
      link: null,
      linkText: null
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Saturday: 9:00 AM - 6:00 PM',
      link: null,
      linkText: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-foreground">Get in Touch</h2>
          <p className="text-lg text-foreground/75 leading-relaxed font-medium">
            Contact us for inquiries about our varagu husk products, pricing, or to discuss your specific requirements. We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="bg-card p-8 rounded-xl border-2 border-border shadow-soft text-center"
              >
                <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                  {info.title}
                </h3>
                <p className="text-card-foreground/75 mb-4 font-medium">{info.content}</p>
                {info.link && (
                  <a
                    href={info.link}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    {info.linkText}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto bg-card p-8 md:p-12 rounded-2xl border-2 border-border text-center shadow-medium">
          <h3 className="text-2xl font-semibold mb-4 text-card-foreground">
            Ready to Place an Order?
          </h3>
          <p className="text-card-foreground/75 mb-6 leading-relaxed font-medium">
            Call us directly to discuss your requirements, get pricing information, or schedule a visit to our facility.
          </p>
          <a
            href={PHONE_DIAL}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-medium hover:shadow-lg"
          >
            <Phone className="h-5 w-5" />
            Call: {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
