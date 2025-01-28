interface Email {
    id: string;
    subject: string;
    sender: string;
    time: string;
    preview: string;
    content: string;
    read: boolean;
  }
  
  interface EmailCardProps {
    email: Email;
    onClick: (email: Email) => void;
  }
  
  export default function EmailCard({ email, onClick }: EmailCardProps) {
    return (
      <div
        onClick={() => onClick(email)}
        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
          email.read ? 'bg-gray-50' : 'bg-white'
        } hover:bg-gray-50`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900">{email.subject}</h3>
          <span className="text-sm text-gray-500">{email.time}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{email.preview}</p>
        <p className="text-xs text-gray-500 mt-2">From: {email.sender}</p>
      </div>
    );
  }