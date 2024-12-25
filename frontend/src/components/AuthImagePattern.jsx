const AuthImagePattern = ({ title = "Join our community", subtitle = "Connect with friends, share moments, and stay in touch with your loved ones." }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-[#002233] to-[#001522] p-8">
      <div className="max-w-md text-center">
        {/* Interactive Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-r from-[#27b4b9] to-[#1b7e82] opacity-40 hover:opacity-80 hover:scale-105 transition-transform duration-300 ease-in-out"
              aria-label={`Decorative square ${i + 1}`}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-[#cdfdff] mb-4">{title}</h2>

        {/* Subtitle */}
        <p className="text-lg text-[#cdfdff] text-opacity-80">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
