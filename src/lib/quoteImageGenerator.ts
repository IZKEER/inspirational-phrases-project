// Utility functions for generating shareable quote images

interface QuoteImageOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  authorColor?: string;
  padding?: number;
  fontFamily?: string;
}

interface QuoteData {
  content: string;
  author: string;
  date?: string;
}

const DEFAULT_OPTIONS: Required<QuoteImageOptions> = {
  width: 800,
  height: 800,
  backgroundColor: '#020028', // Matching your app's dark theme
  textColor: '#adb8cc',
  authorColor: '#52555b',
  padding: 60,
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

// Function to wrap text to fit within a given width
function wrapText(
  ctx: CanvasRenderingContext2D, 
  text: string, 
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

// Function to draw text with proper line height
function drawMultilineText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number
): number {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + (index * lineHeight));
  });
  
  return y + (lines.length * lineHeight);
}

// Main function to generate quote image
export async function generateQuoteImage(
  quote: QuoteData, 
  options: QuoteImageOptions = {}
): Promise<Blob> {
  console.log('🎨 Starting image generation with quote:', quote);
  
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = opts.width;
    canvas.height = opts.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context - canvas might not be supported');
    }

    console.log('🖼️ Canvas created:', canvas.width, 'x', canvas.height);

    // Set up the canvas with background
    ctx.fillStyle = opts.backgroundColor;
    ctx.fillRect(0, 0, opts.width, opts.height);
    console.log('🎨 Background applied');

    // Add gradient background (matching your app's style)
    const gradient = ctx.createLinearGradient(0, 0, opts.width, opts.height);
    gradient.addColorStop(0, '#020028'); // rgb(2, 0, 40)
    gradient.addColorStop(1, '#150023'); // rgb(21, 0, 35)
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, opts.width, opts.height);
    console.log('🌈 Gradient applied');

    // Calculate available space for text
    const availableWidth = opts.width - (opts.padding * 2);
    const availableHeight = opts.height - (opts.padding * 2);

    // Configure quote text styling
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Adaptive font sizing based on canvas dimensions
    let quoteFontSize = Math.min(Math.max(opts.width / 20, 24), 60);
    
    // For tall formats (like Instagram Stories), use smaller initial font
    if (opts.height > opts.width * 1.5) {
      quoteFontSize = Math.min(opts.width / 18, 48);
    }
    
    ctx.font = `italic ${quoteFontSize}px ${opts.fontFamily}`;
    console.log('🔤 Font configured:', ctx.font);
    
    // Wrap the quote text
    let quoteLines = wrapText(ctx, `"${quote.content}"`, availableWidth);
    console.log('📝 Text wrapped into', quoteLines.length, 'lines');
    
    // Scale down font if text is too tall (with safety limit)
    let iterations = 0;
    const maxTextHeight = availableHeight * 0.6; // Leave room for author and branding
    
    while (quoteLines.length * quoteFontSize * 1.4 > maxTextHeight && quoteFontSize > 18 && iterations < 15) {
      quoteFontSize -= 2;
      ctx.font = `italic ${quoteFontSize}px ${opts.fontFamily}`;
      quoteLines = wrapText(ctx, `"${quote.content}"`, availableWidth);
      iterations++;
    }
    console.log('📏 Final font size:', quoteFontSize, 'after', iterations, 'iterations');

    // Calculate vertical positioning for centered layout
    const quoteLineHeight = quoteFontSize * 1.4;
    const totalQuoteHeight = quoteLines.length * quoteLineHeight;
    const authorHeight = quoteFontSize * 0.6 * 1.2;
    const brandingHeight = 20;
    const spacing = 40;
    
    const totalContentHeight = totalQuoteHeight + spacing + authorHeight + spacing + brandingHeight;
    const quoteStartY = opts.padding + (availableHeight - totalContentHeight) / 2;
    
    // Draw the quote text
    ctx.fillStyle = opts.textColor;
    
    console.log('✍️ Drawing quote text...');
    const quoteEndY = drawMultilineText(
      ctx, 
      quoteLines, 
      opts.width / 2, 
      quoteStartY, 
      quoteLineHeight
    );

    // Configure and draw author text
    const authorFontSize = Math.max(quoteFontSize * 0.6, 16);
    ctx.font = `500 ${authorFontSize}px ${opts.fontFamily}`;
    ctx.fillStyle = opts.authorColor;
    ctx.textAlign = 'right';
    
    console.log('👤 Drawing author text...');
    ctx.fillText(
      `— ${quote.author}`, 
      opts.width - opts.padding, 
      quoteEndY + spacing
    );

    // Add app branding (scaled for canvas size)
    const brandingFontSize = Math.min(Math.max(opts.width / 50, 12), 18);
    ctx.font = `400 ${brandingFontSize}px ${opts.fontFamily}`;
    ctx.fillStyle = '#cd6300'; // Your app's accent color
    ctx.textAlign = 'center';
    ctx.fillText(
      'Daily Inspiration', 
      opts.width / 2, 
      opts.height - opts.padding / 2
    );
    console.log('🏷️ Branding added');

    // Convert canvas to blob
    console.log('💾 Converting to blob...');
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('✅ Blob created successfully:', blob.size, 'bytes');
          resolve(blob);
        } else {
          console.error('❌ Failed to generate image blob');
          reject(new Error('Failed to generate image blob - canvas.toBlob returned null'));
        }
      }, 'image/png', 0.9);
    });
    
  } catch (error) {
    console.error('❌ Error in generateQuoteImage:', error);
    throw error;
  }
}

// Alternative: Simple download fallback
export function downloadQuoteImage(blob: Blob, filename: string = 'daily-quote.png') {
  console.log('📎 Downloading image as fallback...');
  
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    console.log('✅ Image download initiated');
    return true;
  } catch (error) {
    console.error('❌ Download failed:', error);
    return false;
  }
}

// Simple function to copy image to clipboard (if supported)
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  console.log('📎 Attempting to copy image to clipboard...');
  
  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob
      });
      
      await navigator.clipboard.write([clipboardItem]);
      console.log('✅ Image copied to clipboard');
      return true;
    } else {
      console.log('⚠️ Clipboard API not supported');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to copy image to clipboard:', error);
    return false;
  }
}

// Debug helper function - you can call this from browser console to test
// Usage: window.testImageGeneration()
export async function testImageGeneration() {
  console.log('🧪 Testing image generation...');
  
  const testQuote = {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  };
  
  try {
    const blob = await generateQuoteImage(testQuote);
    console.log('✅ Test successful! Blob size:', blob.size);
    
    // Download the test image
    downloadQuoteImage(blob, 'test-quote.png');
    
    return blob;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testImageGeneration = testImageGeneration;
}
