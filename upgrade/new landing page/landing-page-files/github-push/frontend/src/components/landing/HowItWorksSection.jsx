import React from 'react';

export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Connect your project',
      body: 'Point Studio at your site or repo. It reads your components, tokens, and brand rules so every change respects the system you already have.',
    },
    {
      num: '02',
      title: 'Describe a change',
      body: 'Type what you want in plain language — "make the pricing CTA bolder," "add a testimonials row." Or click any element to target it exactly.',
    },
    {
      num: '03',
      title: 'Review the preview',
      body: 'See the diff in code and visually, side-by-side with your live site. Tweak, regenerate, or accept — your draft is always saved and always reversible.',
    },
    {
      num: '04',
      title: 'Publish when ready',
      body: 'Ship with one click to your staging or production environment. Every version is stored, so one click can roll you back just as fast.',
    },
  ];

  return (
    <section id="how" className="how">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>How it works</span>
          <h2>A simple workflow.<br/><span className="gradient-text">Describe → Preview → Approve → Ship.</span></h2>
          <p>Four steps, every time. No hidden magic, no half-baked suggestions pushed into production. Just a predictable loop your whole team can trust.</p>
        </div>
        <div className="steps">
          {steps.map((step, i) => (
            <div className="step-card reveal" key={i}>
              <div className="step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
