import { Copy, Mail, Loader2 } from "lucide-react";
import { useState } from "react";

interface EmailGeneratorProps {
  onGenerate: (email: string) => void;
}

export default function EmailGenerator({ onGenerate }: EmailGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [email, setEmail] = useState("");

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-email", {
        method: "POST"
      });
      const data = await response.json();
      setEmail(data.email);
      onGenerate(data.email);
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    if (!email) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(email);
    } catch (error) {
      console.error("Error copying email:", error);
    } finally {
      setTimeout(() => setCopying(false), 1000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={generateEmail}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto font-semibold"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Mail className="w-5 h-5" />
          )}
          Generate Email
        </button>

        {email && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg flex-grow max-w-xl">
            <span className="font-mono text-gray-800 truncate">{email}</span>
            <button
              onClick={copyEmail}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Copy className={`w-5 h-5 ${copying ? 'text-green-500' : 'text-gray-500'}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}