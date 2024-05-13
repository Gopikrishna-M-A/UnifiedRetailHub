


import Link from "next/link";

const Footer = () => {
  
  return (
    <footer className="bg-gray-100 text-gray-500 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Us */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4 text-gray-600">About Us</h3>
          <p className="mb-2">
            We are committed to promoting sustainable living and environmental conservation.
          </p>
          <p className="mb-2">
            Our mission is to provide eco-friendly products and inspire people to make
            environmentally conscious choices.
          </p>
          <p>
            Join us in our journey towards a greener and healthier planet.
          </p>
        </div>
        
        {/* Contact Us */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4  text-gray-600">Contact Us</h3>
          <p className="mb-2">
            <strong className=" text-gray-600">Email:</strong> contact@maliakkalstores.com
          </p>
          <p className="mb-2">
            <strong className=" text-gray-600">Phone:</strong> +1234567890
          </p>
          <p>
            <strong className="text-gray-600">Address:</strong> 123 Green Street, Eco City, Earth
          </p>
        </div>
        
        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4  text-gray-600">Quick Links</h3>
          <ul className="mb-4">
            <li><Link href="/" className="hover:text-gray-200">Home</Link></li>
            <li><Link href="/products" className="hover:text-gray-200">Products</Link></li>
            <li><Link href="/" className="hover:text-gray-200">About Us</Link></li>
            <li><Link href="/" className="hover:text-gray-200">Contact</Link></li>
          </ul>
          <h3 className="text-lg font-semibold mb-4 text-gray-600">Follow Us</h3>
          <div className="flex justify-center md:justify-start">
            <a href="#" className="mr-4 hover:text-gray-200">Facebook</a>
            <a href="#" className="mr-4 hover:text-gray-200">Twitter</a>
            <a href="#" className="hover:text-gray-200">Instagram</a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} Maliakkal Stores. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
