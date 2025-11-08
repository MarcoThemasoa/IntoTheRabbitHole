import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Calendar, User } from "lucide-react";
import backend from "~backend/client";
import Footer from "../components/Footer";

export default function Stories() {
  const { data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => backend.stories.list(),
  });

  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    backend.analytics.trackPageView({ page: "/stories" }).catch(console.error);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Kisah Korban
          </h1>
          <p className="text-xl text-purple-100 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Anda tidak sendirian. Baca kisah dari korban lain yang telah berbagi pengalaman mereka.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {!data?.stories.length ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-purple-600" />
            </div>
            <p className="text-gray-600 text-xl mb-2">Belum ada kisah yang dibagikan.</p>
            <p className="text-gray-500">Jadilah yang pertama untuk berbagi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.stories.map((story, index) => (
              <div
                key={story.id}
                id={`story-${story.id}`}
                data-animate
                className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] ${
                  isVisible[`story-${story.id}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${(index % 4) * 100}ms` }}
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 flex-1 leading-tight">{story.title}</h3>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                  {story.content}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-100 p-1.5 rounded-lg">
                      <User className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <span className="font-medium">
                      {story.is_anonymous ? "Anonim" : story.author_name || "Anonim"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    </div>
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
