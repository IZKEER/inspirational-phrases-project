import { useCallback, useState } from 'react';

// TypeScript interfaces for our sharing data
interface QuoteData {
  content: string;
  author: string;
  date?: string;
}

interface ShareOptions {
  includeAppName?: boolean;
  includeDate?: boolean;
}

interface UseQuoteShareReturn {
  shareText: (quote: QuoteData, options?: ShareOptions) => Promise<void>;
  shareImage: (imageBlob: Blob, quote: QuoteData) => Promise<void>;
  copyToClipboard: (text: string) => Promise<boolean>;
  isSharing: boolean;
  shareError: string | null;
  isWebShareSupported: boolean;
}

export const useQuoteShare = (): UseQuoteShareReturn => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  // Check if Web Share API is supported (mainly mobile browsers)
  const isWebShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  // Function to format quote text for sharing
  const formatQuoteText = useCallback((quote: QuoteData, options: ShareOptions = {}) => {
    const { includeAppName = true, includeDate = false } = options;
    
    let text = `"${quote.content}"\n\n— ${quote.author}`;
    
    if (includeDate && quote.date) {
      text += `\n\nDaily inspiration for ${quote.date}`;
    }
    
    if (includeAppName) {
      text += '\n\n✨ Get your daily inspiration at [Your App Name]';
    }
    
    return text;
  }, []);

  // Share text using Web Share API or fallback to clipboard
  const shareText = useCallback(async (quote: QuoteData, options: ShareOptions = {}) => {
    setIsSharing(true);
    setShareError(null);

    try {
      const text = formatQuoteText(quote, options);

      if (isWebShareSupported) {
        // Use native Web Share API (perfect for mobile!)
        await navigator.share({
          title: 'Daily Inspiration',
          text: text,
          // You could add url: window.location.href here if you want to include your app link
        });
      } else {
        // Fallback to clipboard (mainly for desktop)
        const success = await copyToClipboard(text);
        if (!success) {
          throw new Error('Failed to copy to clipboard');
        }
        // You might want to show a toast notification here
        console.log('Quote copied to clipboard!');
      }
    } catch (error) {
      // Handle user cancellation (not really an error)
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('User cancelled share');
        return;
      }
      
      console.error('Share failed:', error);
      setShareError(error instanceof Error ? error.message : 'Share failed');
    } finally {
      setIsSharing(false);
    }
  }, [formatQuoteText, isWebShareSupported]);

  // Share image (for beautiful visual quotes)
  const shareImage = useCallback(async (imageBlob: Blob, quote: QuoteData) => {
    setIsSharing(true);
    setShareError(null);

    try {
      if (isWebShareSupported && navigator.canShare) {
        // Create a File from the Blob for sharing
        const file = new File([imageBlob], 'daily-quote.png', { type: 'image/png' });
        
        // Check if we can share files
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Daily Inspiration',
            text: `"${quote.content}" — ${quote.author}`,
            files: [file]
          });
        } else {
          // Fallback to text sharing if files aren't supported
          await shareText(quote);
        }
      } else {
        // For browsers without file sharing, we could:
        // 1. Download the image
        // 2. Copy image to clipboard (if supported)
        // 3. Fallback to text sharing
        await shareText(quote);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('User cancelled share');
        return;
      }
      
      console.error('Image share failed:', error);
      setShareError(error instanceof Error ? error.message : 'Image share failed');
      
      // Fallback to text sharing
      await shareText(quote);
    } finally {
      setIsSharing(false);
    }
  }, [isWebShareSupported, shareText]);

  // Copy text to clipboard (useful fallback)
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // Modern clipboard API
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }, []);

  return {
    shareText,
    shareImage,
    copyToClipboard,
    isSharing,
    shareError,
    isWebShareSupported
  };
};
