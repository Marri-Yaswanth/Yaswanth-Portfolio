import React, { useState } from 'react';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import AnimatedSection from '../components/AnimatedSection';
import SectionArrow from '../components/SectionArrow';
import { useToast } from '../components/Toast';

const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // Using FormSubmit with AJAX endpoint
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('email', formState.email);
      formData.append('subject', formState.subject);
      formData.append('message', formState.message);
      formData.append('_subject', `Portfolio Contact: ${formState.subject}`);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table'); // Nice email template
      
      const response = await fetch('https://formsubmit.co/ajax/marriyaswanth42@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
          _subject: `Portfolio Contact: ${formState.subject}`,
          _captcha: 'false',
          _template: 'table'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setFormStatus('success');
        showToast('Message sent successfully!');
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setFormStatus('idle');
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setFormStatus('error');
      showToast(error instanceof Error ? error.message : 'Failed to send message', 'error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <AnimatedSection id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Contact Me"
          subtitle="Get in touch for opportunities or collaborations"
        />

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-5/12">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Let's talk about your project
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                I'm interested in freelance opportunities – especially ambitious or large projects. However, if you have other request or question, don't hesitate to contact me using the form.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-amber-500" size={20} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Location
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Guntur, Andhra Pradesh
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-amber-500" size={20} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Email
                  </h4>
                  <a 
                    href="mailto:marriyaswanth42@gmail.com"
                    className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    marriyaswanth42@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-amber-500" size={20} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Phone
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    +91 986 647 4481
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200"
                    placeholder="name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200"
                    placeholder="email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200"
                  placeholder="Project Inquiry"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200 resize-none"
                  placeholder="I'd like to talk about..."
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
                    formStatus === 'submitting'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {formStatus === 'submitting' ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2" size={18} />
                      Send Message
                    </span>
                  )}
                </button>
                
                {formStatus === 'success' && (
                  <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                    ✅ Your message has been sent successfully!
                  </p>
                )}
                
                {formStatus === 'error' && (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                    ❌ {errorMessage || 'There was an error sending your message. Please try again.'}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <SectionArrow to="/" prev="/certifications" label="Back to Home" prevLabel="Go to Certifications" />
    </AnimatedSection>
  );
};

export default Contact;