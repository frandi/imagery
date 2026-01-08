import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '@/components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="container-custom">
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/">
          <Button size="lg">
            <Home className="w-5 h-5 mr-2 inline" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
