import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Receipt, Users, PieChart, Sparkles } from "lucide-react";
import { LandingHeader } from "@/components/shared/landing-header";

export default function Landing() {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-0">
                <div className="w-16 h-16 rounded-full bg-blue-400 opacity-80" />
                <div className="w-16 h-16 rounded-full bg-orange-500 -ml-6" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Split Bills with Ease
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The simplest way to share expenses with friends, roommates, and
              travel companions. Track who paid what and settle up effortlessly.
            </p>

            <div className="flex gap-4 justify-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Bill Splitter?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Track Expenses
                </h3>
                <p className="text-gray-600">
                  Easily record who paid what and keep track of all shared
                  expenses in one place.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Multiple Groups
                </h3>
                <p className="text-gray-600">
                  Create groups for different occasions - trips, roommates, or
                  regular dinners.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Split Methods
                </h3>
                <p className="text-gray-600">
                  Split equally, by percentage, shares, or exact amounts -
                  whatever works best.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Simplify Your Expenses?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of users who are already splitting bills the smart
              way.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8"
              >
                Start Splitting Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
