import { Card, CardContent } from "../ui/card";

const DashboardSkelton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-16 bg-gray-200 w-full mb-6" />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 space-y-3">
          <div className="h-8 bg-gray-200 rounded w-1/3 sm:w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 sm:w-1/3" />
          <div className="h-10 bg-gray-200 rounded w-full sm:w-32" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border border-gray-100">
              <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                <div className="space-y-2 w-2/3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2 w-1/4">
              <div className="h-6 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="h-10 bg-gray-200 rounded w-24" />
          </div>

          <div className="h-10 bg-gray-200 rounded w-full mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border border-gray-100">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="flex justify-between pt-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default DashboardSkelton;
