const faqs = [
  { question: "How do I determine my size for imported shoes?", answer: "We provide detailed size charts for each shoe that include conversions between US, European, and UK sizing. We recommend measuring your foot and comparing it to our size guide for the most accurate fit." },
  { question: "What are your shipping and delivery times?", answer: "We ship nationwide with standard delivery taking 3-5 business days. Express shipping options are available at checkout. All orders over $200 qualify for free shipping." },
  { question: "What is your return policy?", answer: "We accept returns within 30 days of purchase for unworn shoes in their original packaging. Custom orders and final sale items cannot be returned. Return shipping is free for exchanges." },
  { question: "How do you ensure the authenticity of imported brands?", answer: "We work directly with authorized distributors and manufacturers to ensure all our products are 100% authentic. Each pair comes with appropriate authentication and brand documentation." }
];

export default function Faq() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">Everything you need to know about our imported footwear</p>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-8 border-b border-gray-200 pb-8 text-left">
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

