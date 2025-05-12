
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-blood mr-2"></div>
              <h2 className="text-xl font-bold text-blood">
                One<span className="text-gray-800">Drop</span>
              </h2>
            </Link>
            <p className="text-gray-600 text-sm">
              Connecting blood donors with recipients to save lives. Every drop counts.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blood transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-600 hover:text-blood transition-colors">
                  Donate Blood
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-gray-600 hover:text-blood transition-colors">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-gray-600 hover:text-blood transition-colors">
                  Hospitals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blood transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="text-gray-600 hover:text-blood transition-colors">
                  Eligibility Criteria
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blood transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blood transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">
                Email: info@onedrop.com
              </li>
              <li className="text-gray-600">
                Emergency: +1 (800) 123-4567
              </li>
              <li className="text-gray-600">
                Address: 123 Blood Center St, City
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} OneDrop. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-blood transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-blood transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-blood transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
