import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LandingPageSkelton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-pulse">
      {/* Navbar Skeleton */}
      <nav className="h-16 border-b border-gray-200 bg-white/50 flex items-center justify-between px-6">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="flex space-x-4">
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Hero Title */}
          <div className="h-12 md:h-14 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-12 md:h-14 bg-gray-200 rounded w-1/2 mb-8" />

          {/* Hero Description Lines */}
          <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mb-3" />
          <div className="h-4 bg-gray-200 rounded w-11/12 max-w-2xl mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 max-w-2xl" />
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 flex flex-col items-center">
          {/* Section Title */}
          <div className="h-8 md:h-10 bg-gray-200 rounded w-2/3 max-w-md mb-4" />
          {/* Section Subtitle */}
          <div className="h-5 bg-gray-200 rounded w-1/2 max-w-sm" />
        </div>

        {/* 4 Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/60">
              <CardHeader className="text-center flex flex-col items-center">
                {/* Icon Skeleton */}
                <div className="mx-auto w-12 h-12 bg-gray-200 rounded-lg mb-4" />
                {/* Card Title */}
                <div className="h-5 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {/* Card Description Lines */}
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-gray-200 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center opacity-60">
            <div className="h-8 w-36 bg-gray-300 rounded mb-4 md:mb-0" />
            <div className="flex space-x-6">
              <div className="h-4 w-48 bg-gray-300 rounded" />
              <div className="h-4 w-32 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
