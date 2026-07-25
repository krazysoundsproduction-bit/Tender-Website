"use client";

import { useEffect, useState } from "react";

interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  type: "job" | "tender";
}

export default function ShareButtons({
  title,
  description,
  url,
  type,
}: ShareButtonsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  
  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`
    : `https://web.whatsapp.com/send?text=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`;

  const smsUrl = `sms:?body=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`;

  return (
    <div className="bg-gray-50 rounded-lg border p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Share This {type === "job" ? "Job" : "Tender"}</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Facebook Share */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          title="Share on Facebook"
        >
          <span>👍</span> Facebook
        </a>

        {/* WhatsApp Share */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          title="Share on WhatsApp"
        >
          <span>💬</span> WhatsApp
        </a>

        {/* SMS Share */}
        <a
          href={smsUrl}
          className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          title="Share via SMS"
        >
          <span>📱</span> SMS
        </a>

        {/* Copy Link */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
          }}
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          title="Copy link to clipboard"
        >
          <span>🔗</span> Copy Link
        </button>
      </div>
    </div>
  );
}
