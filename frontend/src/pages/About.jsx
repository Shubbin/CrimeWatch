const About = () => {
  const sections = [
    {
      title: 'How It Works',
      image: 'https://img.freepik.com/free-photo/facial-recognition-technology_23-2149190625.jpg',
      text: 'Users can report criminals, view criminal records, and stay informed about incidents in their area. Crimewatch empowers agencies with tools to respond faster and smarter.',
    },
    {
      title: 'Our Vision',
      image: 'https://img.freepik.com/free-photo/high-angle-view-security-cameras-arrangement_23-2149271705.jpg',
      text: 'We envision a world where communities and law enforcement collaborate for safer neighborhoods. Through innovation and transparency, we aim to build trust and drive safety.',
    },
    {
      title: 'Our Mission',
      image: 'https://img.freepik.com/free-photo/police-officer-checking-documents_23-2149307244.jpg',
      text: 'Our mission is to provide real-time access to crime-related data that informs, protects, and empowers individuals, communities, and institutions alike.',
    },
    {
      title: 'Our Services',
      image: 'https://img.freepik.com/free-photo/safe-city-night-using-intelligent-surveillance_53876-105089.jpg',
      list: [
        'Real-time criminal reporting and tracking',
        'Public access to crime-related updates',
        'Criminal data tools for law enforcement',
        'Tips and resources for crime prevention',
      ],
    },
  ];

  return (
    <section
      aria-labelledby="about-crimewatch"
      className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-16 px-6 sm:px-12 lg:px-20"
    >
      {/* Header with Image and Title Overlay */}
      <div className="relative w-full h-[350px] md:h-[500px] mb-20 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://img.freepik.com/free-photo/handsome-dark-skinned-employee-wearing-checkered-shirt-holding-his-hands-his-eyes-as-if-looking-through-binoculars-glasses-smiling-happily-agains-wall_273609-6389.jpg"
          alt="Person looking through binoculars symbolizing vigilance and trust"
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        <h2
          id="about-crimewatch"
          className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-lg"
        >
          About Crimewatch
        </h2>
      </div>

      {/* Intro Paragraph */}
      <p className="max-w-4xl mx-auto text-center text-lg md:text-xl text-gray-300 mb-24 leading-relaxed tracking-wide">
        Crimewatch is an innovative platform bridging communities and law enforcement. It allows for real-time tracking,
        incident reporting, and access to crime data—empowering a safer and smarter society.
      </p>

      {/* Information Sections */}
      <div className="space-y-32">
        {sections.map((section, index) => (
          <article
            key={index}
            className={`flex flex-col lg:flex-row items-center gap-12 md:gap-16
              opacity-0 animate-fadeInUp animation-delay-${index * 300}
              ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}
            `}
            aria-label={section.title}
          >
            {/* Image Container with Aspect Ratio */}
            <div className="lg:w-1/2 aspect-w-16 aspect-h-9 rounded-3xl overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl relative">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/30 pointer-events-none rounded-3xl" />
            </div>

            {/* Text Content */}
            <div className="lg:w-1/2 glass p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl max-w-3xl">
              <h3 className="text-3xl font-bold mb-6 tracking-tight text-white">{section.title}</h3>
              {section.text && (
                <p className="text-gray-300 text-lg leading-relaxed tracking-wide">{section.text}</p>
              )}
              {section.list && (
                <ul className="list-disc pl-6 mt-6 space-y-3 text-gray-300 text-lg tracking-wide">
                  {section.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation-name: fadeInUp;
            animation-fill-mode: forwards;
            animation-duration: 0.8s;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          .animation-delay-0 {
            animation-delay: 0ms;
          }
          .animation-delay-300 {
            animation-delay: 300ms;
          }
          .animation-delay-600 {
            animation-delay: 600ms;
          }
          .animation-delay-900 {
            animation-delay: 900ms;
          }
        `}
      </style>
    </section>
  );
};

export default About;
