
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Headset,
} from "lucide-react";



const serviceCategories = [
  {
    name: "Smartphone",
    icon: "📱",
    description: "Mobile repair and troubleshooting",
  },
  {
    name: "Laptop & PC",
    icon: "💻",
    description: "Computer repair and maintenance",
  },
  {
    name: "AC",
    icon: "❄️",
    description: "Air conditioner repair and servicing",
  },
  {
    name: "Refrigerator",
    icon: "🧊",
    description: "Refrigerator repair and maintenance",
  },
  {
    name: "TV",
    icon: "📺",
    description: "Television repair services",
  },
  {
    name: "Washing Machine",
    icon: "🧺",
    description: "Washing machine repair services",
  },
  {
    name: "Electrical",
    icon: "⚡",
    description: "Electrical repair and installation",
  },
];


export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">

          {/* Hero Content */}
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Welcome to FixMate
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your Trusted
              <span className="block text-blue-600">
                Home Service
              </span>
              Partner
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
              Book skilled technicians for all your home repair
              and maintenance needs. Fast, reliable and affordable!
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Explore Services
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 px-6 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Become a Technician
              </Link>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-blue-100 pt-6">
              <div>
                <ShieldCheck className="text-blue-600" size={28} />
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  Trusted Platform
                </p>
              </div>

              <div>
                <Zap className="text-blue-600" size={28} />
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  Fast Service
                </p>
              </div>

              <div>
                <Headset className="text-blue-600" size={28} />
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  24/7 Support
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[320px] overflow-hidden rounded-2xl shadow-2xl sm:h-[420px] md:h-[500px]">
            <Image
              src="/images/fixmate-hero.png"
              alt="FixMate home repair technician servicing an air conditioner"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[90%_center]"
            />
          </div>

        </div>
      </section>



{/* Service Categories Section */}
<section className="bg-white px-4 py-16 sm:py-20">
  <div className="mx-auto max-w-7xl">

    {/* Section Heading */}
    <div className="mb-12 text-center">
      <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
        What We Offer
      </span>

      <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
        Explore Our Service Categories
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-gray-600">
        From everyday repairs to essential home maintenance,
        find the right professional service for your needs.
      </p>
    </div>

    {/* Categories Grid */}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {serviceCategories.map((category) => (
        <Link
          key={category.name}
          href={`/services?category=${encodeURIComponent(category.name)}`}
          className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl transition group-hover:bg-blue-100">
            {category.icon}
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900 transition group-hover:text-blue-600">
            {category.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {category.description}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
            Explore Services
            <span className="transition group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      ))}
    </div>

  </div>
</section>

    </main>
  );
}

