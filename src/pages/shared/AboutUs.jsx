import HomeNav from "../../components/shared/HomeNav";
import { Book, Users, Globe } from "lucide-react";
import Carousel from "../../components/shared/Carousel";

const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-[#8A0E31] to-[#8A0E31] text-white py-16 md:py-24">
    <div className="container mx-auto text-center max-w-3xl px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        About <span className="text-[#FAC67A]">Thinking Flares</span>
      </h1>
      <p className="text-lg md:text-xl opacity-90 mb-8">
        With over 30 years of experience in education, Thinking Flares School
        (TFS) has been a trusted place where young minds grow and shine. We
        combine our long history of teaching excellence with the latest modern
        technologies to create a learning environment full of energy and
        innovation. At TFS, we believe every student deserves the best tools and
        support to discover their talents, think creatively, and prepare for a
        bright future. Our dedicated teachers and staff work together to inspire
        curiosity, confidence, and a love for learning in every child who walks
        through our doors.
      </p>
    </div>
  </section>
);

const StaffCard = ({ name, role, imageUrl }) => (
  <div className="relative overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-64 h-80">
    <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#FAC67A] rounded-full opacity-50" />
    <div className="h-full flex flex-col items-center p-6">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-xl font-bold text-[#8A0E31] mb-1">{name}</h3>
      <div className="w-12 h-1 bg-[#8A0E31] mb-3" />
      <p className="text-gray-600 text-center">{role}</p>
    </div>
  </div>
);

const TeamSection = ({ staff }) => (
  <section id="team" className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-[#8A0E31] mb-12">
        Leadership Team
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {staff.map((member, i) => (
          <StaffCard key={i} {...member} />
        ))}
      </div>
    </div>
  </section>
);

const ValueCard = ({ icon, title, description }) => (
  <div className="bg-gradient-to-br from-white to-[#F8F4F5] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-[#8A0E31] rounded-full text-white mr-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#8A0E31]">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ValuesSection = () => (
  <section id="values" className="py-16 bg-[#F8F4F5]">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-[#8A0E31] mb-12">
        Our Core Values
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ValueCard
          icon={<Book size={24} />}
          title="Academic Excellence"
          description="Commitment to highest educational standards and lifelong learning"
        />
        <ValueCard
          icon={<Users size={24} />}
          title="Community Focus"
          description="Building strong relationships with students, parents, and community"
        />
        <ValueCard
          icon={<Globe size={24} />}
          title="Global Citizenship"
          description="Developing responsible citizens for a interconnected world"
        />
      </div>
    </div>
  </section>
);

function AboutUs() {
  const teamMembers = [
    {
      name: "Dr. Bushra Al-Matari",
      role: "General Manager",
      imageUrl: "img2.jpg",
    },
    {
      name: "Motaz Abudraiea",
      role: "Head of Finance",
      imageUrl: "img1.jpg",
    },
    {
      name: "Renad Abudraiea",
      role: "Head Of Academic Directors",
      imageUrl: "img5.jpg",
    },
    {
      name: "Mohamad Abudraiea",
      role: "Operations Manager",
      imageUrl: "img4.jpg",
    },
    {
      name: "Rahaf Abudraiea",
      role: "Head Of   Social Media",
      imageUrl: "img3.jpg",
    },
  ];

  const carouselImages = [
    {
      src: "about1.jpg",
      alt: "Facilities",
    },
    {
      src: "about2.jpg",
      alt: "Facilities",
    },
    {
      src: "about3.jpg",
      alt: "Facilities",
    },
    {
      src: "about4.jpg",
      alt: "Facilities",
    },
    {
      src: "about5.jpg",
      alt: "Facilities",
    },
    {
      src: "about6.jpg",
      alt: "Facilities",
    },
  ];

  const customSlides = carouselImages.map((img, i) => (
    <div key={i} className="relative w-full h-full">
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full rounded-lg"
      />
    </div>
  ));

  return (
    <div className="min-h-screen flex flex-col">
      <HomeNav />
      <HeroSection />

      {/* Carousel Section */}
      <section className="w-full max-w-screen-2xl mx-auto py-12 px-4">
        {/* Hero Carousel */}
        <Carousel customSlides={customSlides} />
        <div className="absolute bottom-0 left-0 right-0 h-16"></div>
      </section>

      <TeamSection staff={teamMembers} />
      <ValuesSection />
    </div>
  );
}

export default AboutUs;
