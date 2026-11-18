
import Link from "next/link";
import {
    Wrench,

    Mail,
    Phone,
    MapPin,
    ArrowRight,
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const footerCategories = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
];

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand Information */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <Wrench size={23} />
                            </span>
                            <span className="text-2xl font-extrabold text-white">
                                Fix<span className="text-blue-500">Mate</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
                            Your trusted home service partner. Find skilled
                            technicians and get reliable repair solutions
                            for your everyday needs.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition hover:bg-blue-600 hover:text-white"
                            >
                                <FaFacebookF size={19} />
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 hover:text-white"
                            >
                                <FaInstagram size={19} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Quick Links
                        </h3>

                        <ul className="mt-6 space-y-4 text-sm">
                            <li>
                                <Link href="/" className="transition hover:text-blue-400">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="transition hover:text-blue-400">
                                    Explore Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="transition hover:text-blue-400">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="transition hover:text-blue-400">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="transition hover:text-blue-400">
                                    Become a Technician
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Service Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Our Services
                        </h3>

                        <ul className="mt-6 space-y-4 text-sm">
                            {footerCategories.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/services?category=${encodeURIComponent(category)}`}
                                        className="transition hover:text-blue-400"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Contact Us
                        </h3>

                        <ul className="mt-6 space-y-5 text-sm">
                            <li className="flex items-start gap-3">
                                <Mail size={19} className="mt-0.5 shrink-0 text-blue-500" />
                                <span>support@fixmate.com</span>
                            </li>

                            <li className="flex items-start gap-3">
                                <Phone size={19} className="mt-0.5 shrink-0 text-blue-500" />
                                <span>+880 1XXXXXXXXX</span>
                            </li>

                            <li className="flex items-start gap-3">
                                <MapPin size={19} className="mt-0.5 shrink-0 text-blue-500" />
                                <span>Bangladesh</span>
                            </li>
                        </ul>

                        <Link
                            href="/contact"
                            className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-400 transition hover:text-blue-300"
                        >
                            Get in Touch
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-gray-500 sm:flex-row">
                    <p>
                        © 2026 FixMate. All rights reserved.
                    </p>

                    <p>
                        Made with ❤️ for better home services.
                    </p>
                </div>
            </div>
        </footer>
    );
}
