import HomeNav from "../../components/shared/HomeNav";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

function ContactUs() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/about4.jpg')",
      }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* Navigation */}
      <div className="relative z-10">
        <HomeNav />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 text-white p-10 w-full max-w-lg">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Contact Us
          </h1>

          <div className="space-y-6">
            {/* Phone */}
            <ContactItem
              icon={
                <FaPhone className="text-green-400 group-hover:scale-110 transition" />
              }
              title="Phone Number"
              content="07 9678 7084"
              href="tel:0796787084"
            />

            {/* Email */}
            <ContactItem
              icon={
                <FaEnvelope className="text-blue-400 group-hover:scale-110 transition" />
              }
              title="Email"
              content="thinkingflares.school@yahoo.com"
              href="mailto:thinkingflares.school@yahoo.com"
            />

            {/* Location */}
            <ContactItem
              icon={
                <FaMapMarkerAlt className="text-red-400 group-hover:scale-110 transition" />
              }
              title="Location"
              content="As-Salt - Jordan"
              href="https://www.google.com/maps?q=السلط+-+البحيرة+-+خلف+الدفاع+المدني+-+دخلة+جامع+العطيات&hl=ar"
            />

            {/* Workdays */}
            <div className="flex items-start gap-4 group">
              <FaCalendarAlt className="text-yellow-300 group-hover:scale-110 transition mt-1" />
              <div>
                <h2 className="font-semibold text-white">Workdays</h2>
                <p className="text-white/90">
                  Saturday to Thursday from 8 AM - 3 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable contact item component
function ContactItem({ icon, title, content, href }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1">{icon}</div>
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <a
          href={href}
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-white/90 hover:underline hover:text-accent transition"
        >
          {content}
        </a>
      </div>
    </div>
  );
}

export default ContactUs;
