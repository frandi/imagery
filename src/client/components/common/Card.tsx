import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

const Card = ({ children, className = '', title, description }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-1 text-gray-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
