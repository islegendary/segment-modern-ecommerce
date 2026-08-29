import { useEffect, useState } from 'react';
import { customizationOptions, emptyCustomForm, timeframeOptions } from '../data/customForm.js';
import { getStableUserId, identifyUser, trackEvent, trackPage } from '../analytics.js';

function optionScore(optionId, selectedText) {
  const group = customizationOptions.find((option) => option.id === optionId);
  return group?.options.find((option) => option.text === selectedText)?.score || 0;
}

function timeframeScore(selectedTimeframe) {
  return timeframeOptions.find((option) => option.text === selectedTimeframe)?.score || 0;
}

export default function CustomFormPage({ navigateTo }) {
  const [formData, setFormData] = useState(emptyCustomForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    trackPage('Custom Robot Form');
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.timeframe) {
      return;
    }

    const scores = {
      aiLevel: optionScore('customization1', formData.customization1),
      mobility: optionScore('customization2', formData.customization2),
      interaction: optionScore('customization3', formData.customization3),
      manipulation: optionScore('customization4', formData.customization4),
      specialization: optionScore('customization5', formData.customization5),
      timeframe: timeframeScore(formData.timeframe),
    };
    const totalComplexityScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    identifyUser(getStableUserId(formData.email), {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    });

    trackEvent('Form Submitted', {
      formType: 'Custom Robot Configuration',
      customizations: {
        aiLevel: formData.customization1,
        mobility: formData.customization2,
        interaction: formData.customization3,
        manipulation: formData.customization4,
        specialization: formData.customization5,
      },
      complexityScores: scores,
      totalComplexityScore,
      complexityLevel: totalComplexityScore >= 40 ? 'Very High'
        : totalComplexityScore >= 30 ? 'High'
          : totalComplexityScore >= 20 ? 'Medium'
            : totalComplexityScore >= 10 ? 'Low' : 'Very Low',
      timeframe: formData.timeframe,
      capabilities: formData.capabilities,
      referralCode: formData.referralCode,
      country: formData.country,
      contactMethods: {
        email: Boolean(formData.email),
        phone: Boolean(formData.phone),
      },
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto text-center">
          <div className="mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Thank You!</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
              Your custom robot configuration has been submitted. Our engineering team will review your requirements and contact you with a detailed proposal and timeline.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
              We'll be in touch within 1-2 business days to discuss your custom Titan robot.
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 text-center px-4">Configure Your Custom Titan Robot</h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 text-center px-4">
          Tell us about your ideal robot companion and we'll build it specifically for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {customizationOptions.map((option) => (
              <div key={option.id} className="space-y-2 sm:space-y-3">
                <label className="block text-base sm:text-lg font-semibold text-gray-800">
                  {option.label}
                </label>
                <select
                  value={formData[option.id]}
                  onChange={(event) => handleInputChange(option.id, event.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  required
                >
                  <option value="">Select {option.label}</option>
                  {option.options.map((choice) => (
                    <option key={choice.text} value={choice.text}>
                      {choice.text}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
              When do you need this completed?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {timeframeOptions.map((timeframe) => (
                <button
                  key={timeframe.text}
                  type="button"
                  onClick={() => handleInputChange('timeframe', timeframe.text)}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base ${formData.timeframe === timeframe.text
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  {timeframe.text}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="capabilities" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
              Describe Capabilities
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
              Providing details here helps us with an estimate
            </p>
            <textarea
              id="capabilities"
              value={formData.capabilities}
              onChange={(event) => handleInputChange('capabilities', event.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 h-32 resize-vertical bg-white text-gray-900"
              placeholder="Tell us about specific tasks, environments, or capabilities you need your custom robot to handle..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="firstName" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(event) => handleInputChange('firstName', event.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(event) => handleInputChange('lastName', event.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Smith"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="email" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(event) => handleInputChange('email', event.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(event) => handleInputChange('phone', event.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="(123) 456-7890"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="country" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Country
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(event) => handleInputChange('country', event.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                required
              >
                <option value="US">United States</option>
                <option value="OTHER">Other Country</option>
              </select>
            </div>
            <div>
              <label htmlFor="referralCode" className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Referral Code
              </label>
              <input
                type="text"
                id="referralCode"
                value={formData.referralCode}
                onChange={(event) => handleInputChange('referralCode', event.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Optional referral code"
              />
            </div>
          </div>

          <div className="text-center pt-6">
            {!formData.timeframe && (
              <p className="text-red-500 text-sm mb-3">Please choose a timeframe before submitting.</p>
            )}
            <button
              type="submit"
              disabled={!formData.timeframe}
              className={`px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg transition-all duration-300 ${
                formData.timeframe
                  ? 'bg-purple-600 text-white hover:bg-purple-700 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Custom Robot Request
            </button>
          </div>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => navigateTo('category', 'Models')}
            className="bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-gray-300 transition-colors duration-300"
          >
            Back to Models
          </button>
        </div>
      </div>
    </div>
  );
}
