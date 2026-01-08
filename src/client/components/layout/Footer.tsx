const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container-custom">
        <div className="py-6 text-center text-gray-600 text-sm">
          <p>
            &copy; {currentYear} Imagery. Simple image editing tools for web developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
