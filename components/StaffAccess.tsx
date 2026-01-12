
import React, { useState } from 'react';

interface StaffAccessProps {
    onMobileSet: (mobile: string) => void;
    currentMobile: string | null;
}

const StaffAccess: React.FC<StaffAccessProps> = ({ onMobileSet, currentMobile }) => {
    const [adminMobileInput, setAdminMobileInput] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

    const generateLink = () => {
        if (!adminMobileInput) return;
        const url = new URL(window.location.origin);
        const encoded = btoa(adminMobileInput);
        url.searchParams.set('m', encoded);
        setGeneratedUrl(url.toString());
    };

    const copyToClipboard = () => {
        if (generatedUrl) {
            navigator.clipboard.writeText(generatedUrl);
            onMobileSet(adminMobileInput);
        }
    };

    return (
        <div className="text-center fade-in max-w-2xl w-full flex flex-col items-center py-12">
            <h1 className="text-4xl md:text-6xl mb-8 serif italic font-light tracking-tight leading-none">Staff Portal</h1>
            <p className="text-lg font-light text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed">
                Generate a unique feedback link for your client.
            </p>

            <div className="w-full max-w-sm">
                {currentMobile && (
                    <div className="mb-8 p-3 border border-luxury-gold/20 bg-luxury-gold/5 rounded text-sm text-luxury-gold font-medium">
                        Active Client Mobile: {currentMobile}
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    <div className="relative">
                        <input
                            type="tel"
                            placeholder="Client Mobile Number"
                            className="w-full bg-transparent border-b border-gray-300 py-3 text-lg focus:outline-none focus:border-luxury-gold font-light transition-colors"
                            value={adminMobileInput}
                            onChange={(e) => setAdminMobileInput(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={generateLink}
                        disabled={!adminMobileInput}
                        className="group relative inline-block px-8 py-3 border border-luxury-gold text-luxury-gold uppercase tracking-[0.3em] text-[10px] font-bold transition-all duration-500 hover:bg-luxury-gold hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-luxury-gold"
                    >
                        Generate Unique Link
                    </button>
                </div>

                {generatedUrl && (
                    <div className="mt-12 p-6 bg-gray-50 rounded-lg text-left border border-gray-100 shadow-sm fade-in">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Unique Client URL</p>
                        <code className="block text-xs text-gray-600 break-all mb-4 bg-white p-3 border border-gray-200 rounded">
                            {generatedUrl}
                        </code>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={copyToClipboard}
                                className="w-full py-3 bg-luxury-gold text-white text-[10px] uppercase font-bold tracking-widest hover:bg-black transition-colors"
                            >
                                Copy Link & Set Active
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-3 border border-gray-200 text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-100 transition-colors"
                            >
                                Go to Feedback Form
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 w-full max-w-xs">
                <button
                    onClick={() => window.location.href = '/'}
                    className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-luxury-gold transition-colors"
                >
                    ← Back to Main Page
                </button>
            </div>
        </div>
    );
};

export default StaffAccess;
