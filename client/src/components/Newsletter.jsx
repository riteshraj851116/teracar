import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubmitted(true);
    toast.success('Subscribed successfully!');
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="max-w-[1400px] mx-auto section-padding py-16" aria-label="Newsletter">
      <div className="bg-bg-secondary rounded-2xl border border-border p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-accent" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-editorial tracking-tight">
            Stay in the Driver's Seat
          </h2>
          <p className="text-text-secondary mt-2 mb-8">
            Get exclusive offers, new vehicle alerts, and insider tips delivered to your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="premium-input pl-10 py-3"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitted}
              className="btn-primary px-6 py-3 rounded-lg text-sm whitespace-nowrap"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Subscribed
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-text-muted mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;