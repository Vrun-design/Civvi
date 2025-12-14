import React, { useState } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
    const [apiKey, setApiKey] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSave(apiKey.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold text-primary mb-2">Enter Gemini API Key</h2>
                <p className="text-sm text-zinc-500 mb-6">
                    This feature requires a Google Gemini API key. The system key is missing, so please provide your own free key to continue.
                    It will be saved locally in your browser.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full px-4 py-2 bg-input border border-border text-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors block"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-primary hover:bg-input rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!apiKey.trim()}
                            className="px-4 py-2 text-sm font-bold text-background bg-primary hover:opacity-90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save & Continue
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-center text-zinc-500">
                            Don't have a key?{' '}
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                            >
                                Get one for free here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyModal;
