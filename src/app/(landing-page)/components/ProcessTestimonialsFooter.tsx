export default function ProcessSection() {
  const steps = [
    { id: 1, title: "Careful Selection", description: "Our team travels the world to source the finest shoes from renowned manufacturers, focusing on quality, craftsmanship, and design." },
    { id: 2, title: "Quality Assurance", description: "Each pair undergoes rigorous inspection to ensure it meets our strict standards for materials, construction, and finish." },
    { id: 3, title: "Direct Import", description: "We handle all import logistics, customs clearance, and compliance to bring you international styles without the hassle." },
    { id: 4, title: "From Our Warehouse to Your Doorstep", description: "Premium packaging and reliable shipping ensure your shoes arrive in perfect condition, ready to wear." }
  ];

  return (
    <section id="process" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Import Process</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">How we bring you the finest footwear from around the world</p>
        <div className="max-w-3xl mx-auto">
          {steps.map((step) => (
            <div key={step.id} className="timeline-item pl-12 pb-12">
              <div className="flex">
                <div className="timeline-circle bg-black text-white flex-shrink-0">
                  <span>{step.id}</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    { id: 1, name: "Carlos Rodriguez", review: "The Italian leather Oxford shoes I purchased are impeccable. The craftsmanship and attention to detail exceeded my expectations.", rating: 5 },
    { id: 2, name: "Maria Gonzalez", review: "These imported sneakers are unlike anything available locally. The design is cutting edge and the comfort is amazing.", rating: 5 },
    { id: 3, name: "Javier Mendez", review: "I've purchased both formal shoes and casual sneakers. The quality is consistently excellent, and the styles are unique.", rating: 5 }
  ];

  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">Real feedback from satisfied clients who love our imported footwear</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card bg-gray-50 p-8 rounded-xl shadow-md">
              <h4 className="font-semibold mb-2">{testimonial.name}</h4>
              <p className="text-gray-600 italic">"{testimonial.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
