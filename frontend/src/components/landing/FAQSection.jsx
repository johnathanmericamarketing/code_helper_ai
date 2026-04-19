import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Do I need to be a developer to use it?",
      a: "No. The guided workflow is built so non-technical users can request changes, review previews, and publish safely. Advanced users can go deeper when needed."
    },
    {
      q: "Will it change my live site immediately?",
      a: "No. The product is designed around safe preview first. Your live site stays unchanged until you explicitly publish."
    },
    {
      q: "Can I keep my brand consistent?",
      a: "Yes. The system uses saved brand rules, project context, and previous approved changes to reduce random styling drift."
    },
    {
      q: "Can I use my own model keys?",
      a: "Yes. You can bring your own keys or use managed platform access depending on your setup and pricing model."
    }
  ];

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-violet-600 uppercase tracking-widest">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mt-4 mb-6">
            The questions people will ask before signing up
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-slate-200 rounded-[24px] overflow-hidden transition-all ${openIndex === i ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
            >
              <button 
                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              
              {openIndex === i && (
                <div className="px-8 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
