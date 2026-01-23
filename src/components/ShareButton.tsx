import { Button } from "react-aria-components";
import { Link, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  disabled?: boolean;
}

export function ShareButton({ disabled }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy URL:", e);
    }
  };

  return (
    <Button
      onPress={handleCopy}
      isDisabled={disabled}
      aria-label={
        copied ? "Link copied to clipboard" : "Copy shareable link to clipboard"
      }
      className="flex items-center gap-2 py-2 px-6 bg-gradient-to-br from-[rgba(45,212,168,0.2)] to-[rgba(6,182,212,0.1)] text-[#2dd4a8] border border-[rgba(45,212,168,0.5)] rounded-sm font-sans text-[0.9375rem] font-semibold cursor-pointer transition-all duration-300 shadow-[0_0_30px_rgba(45,212,168,0.15)] hover:bg-gradient-to-br hover:from-[rgba(45,212,168,0.3)] hover:to-[rgba(6,182,212,0.2)] hover:border-[#2dd4a8] hover:shadow-[0_0_60px_rgba(45,212,168,0.25)] hover:-translate-y-0.5 active:translate-y-0 data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:shadow-none focus-visible:outline-2 focus-visible:outline-[#2dd4a8] focus-visible:outline-offset-2 border-1"
    >
      {copied ? (
        <Check size={18} aria-hidden="true" />
      ) : (
        <Link size={18} aria-hidden="true" />
      )}
      <span>{copied ? "Copied!" : "Share"}</span>
    </Button>
  );
}
