import { useEffect, useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Calendar, User, ChevronDown, ChevronUp, Heart, ArrowRight, Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import type { ListStoriesResponse, Story } from "@/lib/types";
import { getVisitorId } from "@/lib/utils";

// Jumlah cerita per halaman
const STORIES_PER_PAGE = 6;

// Nama bulan dalam Bahasa Indonesia
const MONTH_OPTIONS = [
  { value: "", label: "Semua Bulan" },
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

// --- KOMPONEN FILTER (UI custom, font mengikuti tema situs) ---
function StoryFilters({
  selectedMonth,
  selectedYear,
  yearOptions,
  onMonthChange,
  onYearChange,
  onClear,
}: {
  selectedMonth: string;
  selectedYear: string;
  yearOptions: string[];
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onClear: () => void;
}) {
  const selectClass =
    "w-full px-3 py-2.5 text-sm text-slate-700 bg-white border border-slate-300 rounded-xl shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all cursor-pointer";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100 w-full sm:w-auto mt-6 md:mt-0">
      <div className="flex flex-col gap-4" style={{ minWidth: "250px" }}>
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-1">Filter Cerita</p>
          <p className="text-xs text-slate-500">Saring berdasarkan bulan &amp; tahun</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="month-filter" className="block text-xs font-medium text-slate-500 mb-1.5">
              Bulan
            </label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className={selectClass}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year-filter" className="block text-xs font-medium text-slate-500 mb-1.5">
              Tahun
            </label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Semua Tahun</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="w-full px-3 py-2 text-sm rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-200 transition-all"
        >
          Hapus filter
        </button>
      </div>
    </div>
  );
}
// --- AKHIR KOMPONEN FILTER ---


export default function Stories() {
  const { data, refetch } = useQuery<ListStoriesResponse>({
    queryKey: ["stories"],
    queryFn: () => fetch('/api/stories').then((res) => res.json()),
    staleTime: 0, // Data always considered stale, so refetch triggers immediately
    refetchInterval: 10000, // Auto-refetch every 10 seconds
  });

  // Fetch fresh data when component first mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [expandedStories, setExpandedStories] = useState<{ [key: string]: boolean }>({});
  
  // State filter dan paginasi
  const [selectedMonth, setSelectedMonth] = useState(""); // "" = Semua
  const [selectedYear, setSelectedYear] = useState(""); // "" = Semua
  const [currentPage, setCurrentPage] = useState(1);
  
  // Ref untuk menandai bagian atas section cerita
  const storiesSectionRef = useRef<HTMLElement>(null);

  // --- HANDLER FILTER DROPDOWN ---
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1); // Reset ke halaman 1
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset ke halaman 1
  };

  const clearFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setCurrentPage(1);
  };
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  const TRUNCATE_LIMIT = 70; 

  const toggleExpansion = (id: string) => {
    setExpandedStories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --- LOGIKA FILTER ---
  // Tahun yang ditampilkan: dari tahun data paling awal (minimal 2020) sampai tahun berjalan,
  // sehingga tidak terbatas hanya pada tahun yang ada di data (mis. hanya 2025).
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    let earliestYear = 2020;

    if (data?.stories) {
      data.stories.forEach((story) => {
        try {
          const year = new Date(story.created_at).getFullYear();
          if (year < earliestYear) earliestYear = year;
        } catch (e) { /* Abaikan tanggal invalid */ }
      });
    }

    const years: string[] = [];
    for (let y = currentYear; y >= earliestYear; y--) {
      years.push(String(y));
    }
    return years;
  }, [data]);

  const filteredStories = useMemo(() => {
    if (!data?.stories) return [];
    
    const stories = data.stories.filter(story => {
      let date: Date;
      try {
        date = new Date(story.created_at);
      } catch (e) {
        return false;
      }
      
      const storyMonth = String(date.getMonth() + 1);
      const storyYear = String(date.getFullYear());

      const monthMatch = selectedMonth === "" || storyMonth === selectedMonth;
      const yearMatch = selectedYear === "" || storyYear === selectedYear;

      return monthMatch && yearMatch;
    });

    return stories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  }, [data, selectedMonth, selectedYear]);

  // --- LOGIKA PAGINASI ---
  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE);

  const paginatedStories = useMemo(() => {
    const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
    const endIndex = startIndex + STORIES_PER_PAGE;
    return filteredStories.slice(startIndex, endIndex);
  }, [filteredStories, currentPage]);

  // --- HANDLER UNTUK KLIK PAGINASI ---
  const handlePageChange = (pageNumber: number) => {
    // 1. Jangan lakukan apa-apa jika mengklik halaman yang sudah aktif
    if (pageNumber === currentPage) return;

    // 2. Lakukan scroll jika ref-nya ada
    if (storiesSectionRef.current) {
      storiesSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // 3. Set halaman baru
    setCurrentPage(pageNumber);
  };

  // --- EFEK & HANDLER ---
  useEffect(() => {
    const visitorId = getVisitorId();
    fetch('/api/track', { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({ 
        page: '/stories',
        visitorId: visitorId
      }) 
    }).catch(() => { /* tracking is best-effort */ });
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el) => observerRef.current?.observe(el));
    }, 100);

    return () => observerRef.current?.disconnect();
  }, [paginatedStories]);

  // --- HELPER ---
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* --- HEADER SECTION --- */}
      <section className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-800 text-white py-18 my-auto">
        <div className="max-w-7xl px-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
            {/* Bagian Kiri: Judul dan Deskripsi */}
            <div className="flex-1">
              <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                <Heart className="inline h-4 w-4 mr-1 -mt-0.5" />
                Kisah Nyata
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Kisah Korban
              </h1>
              <p className="text-xl text-sky-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Anda tidak sendirian. Baca kisah dari korban lain yang telah berbagi pengalaman mereka. Semoga cerita-cerita ini memberikan kekuatan dan inspirasi bagi Anda.
              </p>
            </div>

            {/* Bagian Kanan: Filter */}
            {data?.stories && data.stories.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ">
                <StoryFilters 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  yearOptions={yearOptions}
                  onMonthChange={handleMonthChange}
                  onYearChange={handleYearChange}
                  onClear={clearFilters}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 flex items-center gap-4">
            <div className="bg-sky-100 p-3 rounded-2xl">
              <MessageSquare className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{data?.stories.length ?? 0}</p>
              <p className="text-sm text-slate-500">Kisah Terbagi</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-sm text-slate-500">Anonim &amp; Rahasia</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 flex items-center gap-4">
            <div className="bg-sky-100 p-3 rounded-2xl">
              <ShieldCheck className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Gratis</p>
              <p className="text-sm text-slate-500">Selamanya</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION CERITA --- */}
      <section ref={storiesSectionRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* --- LOGIKA EMPTY STATE --- */}
        {!data?.stories.length ? (
          // Case 1: Tidak ada cerita sama sekali di database
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-sky-600" />
            </div>
            <p className="text-slate-600 text-xl mb-2">Belum ada kisah yang dibagikan.</p>
            <p className="text-slate-500 mb-8">Jadilah yang pertama untuk berbagi.</p>
            <Link to="/submit-story">
              <Button size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-xl">
                Bagikan Kisah Anda
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        ) : !filteredStories.length ? (
          // Case 2: Ada cerita, tapi tidak ada yang cocok dengan filter
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-sky-600" />
            </div>
            <p className="text-slate-600 text-xl mb-2">Tidak ada kisah yang cocok.</p>
            <p className="text-slate-500">Coba ubah filter bulan atau tahun Anda.</p>
          </div>
        ) : (
          // Case 3: Ada cerita untuk ditampilkan
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Gunakan `paginatedStories` untuk di-map */}
              {paginatedStories.map((story, index) => {
                const storyId = story.id ? String(story.id) : `story-index-${index}`;
                const content = story.content || "";
                
                const isExpanded = expandedStories[storyId];
                const words = content.trim().split(/\s+/);
                const isTooLong = words.length > TRUNCATE_LIMIT;
                
                const displayContent = isExpanded || !isTooLong
                  ? content
                  : words.slice(0, TRUNCATE_LIMIT).join(" ") + "...";

                return (
                  <div
                    key={storyId}
                    id={`story-card-${storyId}`}
                    data-animate
                    className={`bg-white rounded-2xl shadow-xl p-8 border border-sky-100 hover:shadow-2xl transition-all duration-400 hover:scale-[1.02] flex flex-col ${
                      isVisible[`story-card-${storyId}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${(index % STORIES_PER_PAGE) * 100}ms` }} // index % 6
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-slate-900 flex-1 leading-tight">{story.title}</h3>
                    </div>

                    <div className="mb-6 flex-grow">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {displayContent}
                      </p>
                      {isTooLong && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpansion(storyId);
                          }}
                          className="mt-3 text-sky-600 hover:text-blue-800 font-semibold flex items-center gap-1 text-sm transition-colors focus:outline-none p-1 -ml-1"
                        >
                          {isExpanded ? (
                            <>
                              Tutup <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Baca selengkapnya ({words.length - TRUNCATE_LIMIT} kata lagi) <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-4 border-t border-sky-100 mt-auto">
                      <div className="flex items-center space-x-2">
                        <div className="bg-sky-100 p-1.5 rounded-lg">
                          <User className="h-3.5 w-3.5 text-sky-600" />
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
                );
              })}
            </div>

            {/* --- UI PAGINASI --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    aria-label={`Halaman ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                    className={`w-10 h-10 rounded-full font-medium transition-colors ${
                      currentPage === pageNumber
                        ? "bg-sky-600 text-white shadow-lg"
                        : "bg-white text-slate-700 hover:bg-sky-50 border border-slate-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* --- CTA --- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 content-visibility-auto">
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-blue-800 rounded-[2.5rem] p-10 md:p-14 text-center text-white shadow-2xl">
          <Heart className="h-10 w-10 mx-auto mb-4 text-sky-200" />
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Punya Kisah untuk Dibagikan?</h2>
          <p className="text-sky-100/90 mb-8 max-w-xl mx-auto font-light">
            Suara Anda penting. Berbagi kisah dapat membantu korban lain merasa tidak sendirian — dan bisa sepenuhnya anonim.
          </p>
          <Link to="/submit-story">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-sky-50 shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-full px-8">
              Bagikan Kisah Anda
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}