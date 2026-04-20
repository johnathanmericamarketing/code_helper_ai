import React, { useState } from 'react';

const faqs = [
  {
    q: 'Do I need to be a developer to use it?',
    a: "No. Studio is designed for mixed teams. You describe changes in plain language, click on the element you want to edit, and review a visual preview. Developers get more power (diffs, tokens, guardrails), but non-technical teammates can ship copy, layout, and content edits on their own.",
  },
  {
    q: 'Will it change my live site immediately?',
    a: "Never. Every change lands in a draft with a visual preview and a code diff. Nothing touches your live site until you explicitly click Publish — and even then, every version is stored so you can roll back instantly.",
  },
  {
    q: 'Can I keep my brand consistent?',
    a: "Yes — and this is the point. Studio reads your design tokens (colors, fonts, spacing, radii) and passes them into every AI request as hard constraints. The model can't invent new colors or off-brand typography. If it tries, the change is flagged before you ever see it.",
  },
  {
    q: 'Can I use my own model keys?',
    a: "Absolutely. Bring your own OpenAI, Anthropic, or Gemini keys and only pay your provider directly. Prefer simplicity? Use a managed plan and we'll handle the billing and routing for you. Either way, you're in control of cost and model selection.",
  },
];

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => {
    setOpenIdx(prev => prev === i ? null : i);
  };

  return (
    <section id="faq">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>Questions</span>
          <h2>Frequently asked.</h2>
        </div>
        <div className="faq-wrap">
          {faqs.map((item, i) => (
            <div className={`faq-item reveal${openIdx === i ? ' open' : ''}`} key={i}>
              <button
                className="faq-q"
                onClick={() => toggle(i)}
                aria-expanded={openIdx === i}
              >
                {item.q}
                <span className="plus">+</span>
              </button>
              <div
                className="faq-a"
                style={openIdx === i ? { maxHeight: '400px' } : {}}
              >
                <div className="faq-a-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
