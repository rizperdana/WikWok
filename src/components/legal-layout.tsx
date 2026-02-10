import Link from 'next/link';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function LegalLayout({ children, title, description }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="container mx-auto px-3 py-4 max-w-3xl">
        <div className="mb-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-cerulean-500 hover:text-cerulean-400 transition-colors text-sm"
          >
            ← Back to Wikwok
          </Link>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            {description && (
              <p className="text-gray-400 text-sm">{description}</p>
            )}
          </div>
          
          <div className="space-y-4 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}