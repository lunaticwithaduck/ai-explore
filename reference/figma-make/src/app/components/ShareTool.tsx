import { useState } from 'react';
import { Share2, Link2, Check, X, Twitter, Facebook, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { AITool } from '../data/aiTools';

interface ShareToolProps {
  tool: AITool;
}

export function ShareTool({ tool }: ShareToolProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/tool/${tool.id}`;
  const shareText = `Check out ${tool.name} - ${tool.description}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback method for when Clipboard API is blocked
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy:', fallbackErr);
      }
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Link2,
      action: copyToClipboard,
      color: 'text-blue-400',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
      color: 'text-sky-400',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
      color: 'text-blue-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
      },
      color: 'text-blue-700',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          '_blank'
        );
      },
      color: 'text-green-500',
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(tool.name)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
      },
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center gap-2 px-6 py-4 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
      >
        <Share2 size={20} />
        <span>Share</span>
      </button>

      {showShareMenu && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowShareMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-30 overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Share {tool.name}</h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this tool with your network
              </p>
            </div>

            <div className="p-2">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                const isCopyLink = option.name === 'Copy Link';
                return (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent rounded-lg transition-colors text-left"
                  >
                    <div className={`${option.color}`}>
                      {isCopyLink && copied ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Icon size={18} />
                      )}
                    </div>
                    <span className="text-sm">
                      {isCopyLink && copied ? 'Copied!' : option.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-2 py-3 border-t border-border bg-accent/20">
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-card border border-border rounded text-xs outline-none text-muted-foreground"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs hover:opacity-90 transition-opacity whitespace-nowrap min-w-[60px]"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
