import HomeNavbar from "../../components/shared/HomeNav";
import VerticalCarousel from "../../components/shared/VerticalCarousel";

function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-base-200 relative">
      {/* Header/Navigation - Added z-[100] to ensure it stays on top */}
      <HomeNavbar />

      {/* About Section */}
      <section
        id="about"
        className="bg-primary text-base-100 py-16 md:py-24 mb-3"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Lightning Minds in{" "}
                <span className="text-secondary">As-Salt</span>
              </h2>

              <div className="h-1 w-full bg-secondary mx-auto"></div>

              <p className="text-xl leading-relaxed">
                At <span className="font-bold text-secondary">Thinking Flares School (TFS)</span>, learning shines bright like a
                spark! We use cool modern technology like tablets, smart boards,
                and fun apps to make every lesson exciting and easy to follow.
                Here, ideas light up, and students explore, create, and grow
                with the help of today’s best tools. TFS is where the future of
                learning begins, and every student’s mind flares with new
                possibilities!
              </p>
            </div>

            {/* Logo Image */}
            <div className="flex-shrink-0 bg-base-100 p-6 rounded-xl shadow-xl">
              <img
                src="Logo.png"
                alt="School Logo"
                className="w-48 md:w-64 transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="bg-base-200 py-16 text-base-content">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Founder Image */}
            <div className="flex-shrink-0">
              <img
                src="founder-photo.jpg"
                alt="Founder of the School"
                className="w-96 h-96 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Founder Info */}
            <div className="flex-1 bg-primary leading-relaxed space-y-4 p-10 rounded-xl shadow-xl">
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-base-100 mb-4">
                  In Loving Memory of{" "}
                  <span className="text-secondary">Mr. Ayman</span>
                </h2>
                <div className="h-1 w-full bg-secondary mx-auto"></div>
              </div>
              <p className="text-lg text-base-100 leading-relaxed">
                With deep respect and gratitude, we remember our beloved Head,
                <strong>Mr. Ayman</strong>, whose vision and leadership sparked
                the flame of knowledge at Thinking Flares School. His passion,
                wisdom, and kindness continue to guide us every day. His legacy
                shines bright in the hearts of all who knew him.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* School Environment Section */}
      <section id="environment" className="text-base-100">
        <div className="max-w-6xl mx-auto px-6">
          {/* Content Grid */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left: Paragraph */}
            <div className="flex-1 text-lg bg-primary leading-relaxed space-y-4 p-10 rounded-xl shadow-xl">
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                  Our School <span className="text-base-100">Environment</span>
                </h2>
                <div className="h-1 w-full bg-secondary mx-auto"></div>
              </div>
              <p>
                At Thinking Flares School, we provide a safe, friendly, and
                inspiring environment where students feel comfortable to learn
                and explore. Our classrooms are bright and equipped with modern
                technology to support interactive lessons. We encourage
                teamwork, creativity, and respect, making our school a place
                where every student can thrive and grow happily.
              </p>
            </div>

            {/* Right: Carousel */}
            <VerticalCarousel />
          </div>
        </div>
      </section>

      {/* Footer Gradient */}
      <div className="h-16 bg-gradient-to-b from-base-200 to-primary/10"></div>
    </div>
  );
}

export default Home;
