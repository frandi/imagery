import { Link, NavLink } from 'react-router-dom';
import { Image } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Image className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">IMAGERY</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Favicon Converter
            </NavLink>
            <NavLink
              to="/converter"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Image Converter
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
