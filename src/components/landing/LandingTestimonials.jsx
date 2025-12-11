import React from 'react';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingTestimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      text: t('landing.testimonial1Text'),
      author: t('landing.testimonial1Author'),
      role: t('landing.testimonial1Role'),
      rating: 5,
    },
    {
      text: t('landing.testimonial2Text'),
      author: t('landing.testimonial2Author'),
      role: t('landing.testimonial2Role'),
      rating: 5,
    },
    {
      text: t('landing.testimonial3Text'),
      author: t('landing.testimonial3Author'),
      role: t('landing.testimonial3Role'),
      rating: 5,
    },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B35]/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mb-4">
            {t('landing.testimonialTitle')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF6B35]/30 transition-all duration-300 group"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-[#FF6B35]/20 group-hover:text-[#FF6B35]/40 transition-colors" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-[#FF6B35] fill-[#FF6B35]" />
                ))}
              </div>

              <p className="text-white/70 leading-relaxed mb-6 text-sm">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center text-[#0A0A0B] font-bold text-sm">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{testimonial.author}</p>
                  <p className="text-white/50 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
