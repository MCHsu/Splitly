import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Receipt, Users, PieChart, Sparkles } from "lucide-react";
import { LandingHeader } from "@/components/shared/landing-header";

export default function Landing() {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-0">
                <div className="h-16 w-16 rounded-full bg-brand-soft opacity-80" />
                <div className="-ml-6 h-16 w-16 rounded-full bg-brand-accent" />
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold text-foreground md:text-6xl">
              Split Bills with Ease
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              The simplest way to share expenses with friends, roommates, and
              travel companions. Track who paid what and settle up effortlessly.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" className="px-8 font-medium">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Why Choose Splitly?
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Track Expenses
                </h3>
                <p className="text-muted-foreground">
                  Easily record who paid what and keep track of all shared
                  expenses in one place.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent/15">
                  <Users className="h-6 w-6 text-brand-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Multiple Groups
                </h3>
                <p className="text-muted-foreground">
                  Create groups for different occasions - trips, roommates, or
                  regular dinners.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <PieChart className="h-6 w-6 text-success" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Smart Split Methods
                </h3>
                <p className="text-muted-foreground">
                  Split equally, by percentage, shares, or exact amounts -
                  whatever works best.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary to-primary/85 p-12 text-center text-primary-foreground">
            <Sparkles className="mx-auto mb-4 h-12 w-12" />
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Simplify Your Expenses?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Join thousands of users who are already splitting bills the smart
              way.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-card px-8 text-primary hover:bg-card/90"
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
