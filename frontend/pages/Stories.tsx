import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Calendar, User } from "lucide-react";
import backend from "~backend/client";
import Footer from "../components/Footer";

export default function Stories() {
  const { data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => backend.stories.list(),
  });

  useEffect(() => {
    backend.analytics.trackPageView({ page: "/stories" }).catch(console.error);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kisah Korban</h1>
          <p className="text-xl text-blue-100">
            Anda tidak sendirian. Baca kisah dari korban lain yang telah berbagi pengalaman mereka.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!data?.stories.length ? (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Belum ada kisah yang dibagikan.</p>
            <p className="text-gray-500 text-sm mt-2">Jadilah yang pertama untuk berbagi.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-xl text-gray-900 mb-3">{story.title}</h3>
                
                <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                  {story.content}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>
                      {story.is_anonymous ? "Anonim" : story.author_name || "Anonim"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(story.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
