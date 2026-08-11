import { useEffect, useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
// Impor DatePicker dan fungsi untuk registrasi lokal
import DatePicker, { registerLocale } from "react-datepicker";
// Impor data lokal Indonesia
import { id } from "date-fns/locale/id";
// Impor CSS untuk react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import { MessageSquare, Calendar, User, ChevronDown, ChevronUp, Heart, ArrowRight, Users, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import type { ListStoriesResponse, Story } from "@/lib/types";
import { getVisitorId } from "@/lib/utils";

// Registrasi lokal 'id' untuk kalender
registerLocale("id", id);

// Jumlah cerita per halaman
const STORIES_PER_PAGE = 6;

// --- KOMPONEN FILTER ---
function StoryFilters({
  availableFilters,
  startDate,
  handleDateChange,
} : {
  availableFilters: { months: string[], years: string[] };
  startDate: Date | null;
  handleDateChange: (date: Date | null) => void;
}) 
{
  return (
    // Kotak filter
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100 w-full sm:w-auto mt-6 md:mt-0">
      <div className="flex flex-col gap-3" style={{ minWidth: "250px" }}>
        {/* 1. Label + Input Kalender */}
        <div>
          <label htmlFor="monthyear-filter" className="block text-sm font-medium text-slate-700 mb-2">
            Filter Cerita (Bulan & Tahun)
          </label>
          
          <div className="relative datepicker-wrapper">
            <DatePicker
              id="monthyear-filter"
              locale="id" // Gunakan lokal Indonesia
              selected={startDate}
              onChange={handleDateChange}
              showMonthYearPicker // Ini kunci untuk mode "month picker"
              dateFormat="MMMM yyyy" // Format tampilan (cth: November 2025)
              minDate={availableFilters.years.length ? new Date(parseInt(availableFilters.years[availableFilters.years.length - 1]), 0) : undefined}
              maxDate={availableFilters.years.length ? new Date(parseInt(availableFilters.years[0]), 11) : undefined}
              className="w-full px-3 py-1.5 text-slate-700 border border-slate-300 rounded-lg shadow-sm"
              placeholderText="Pilih bulan..."
              showIcon
              toggleCalendarOnIconClick
              wrapperClassName="w-full"
            />
          </div>
        </div>
        
        {/* 2. Tombol Hapus Filter */}
        <div>
          <button
            type="button"
            onClick={() => handleDateChange(null)} // Panggil handler dengan null
            className="w-full px-3 py-1.5 text-sm rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-sky-50"
          >
            Hapus filter
          </button>
        </div>
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
  
  // State baru untuk filter dan paginasi
  const [selectedMonth, setSelectedMonth] = useState(""); // "" = Semua
  const [selectedYear, setSelectedYear] = useState(""); // "" = Semua
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonthYear, setSelectedMonthYear] = useState(""); // format: YYYY-MM
  
  // State untuk DatePicker, default null (kosong)
  const [startDate, setStartDate] = useState<Date | null>(null);
  // Ref untuk menandai bagian atas section cerita
  const storiesSectionRef = useRef<HTMLElement>(null);
  // --- HANDLER BARU UNTUK DATEPICKER ---
  const handleDateChange = (date: Date | null) => {
    setStartDate(date); // Set state untuk DatePicker

    if (date) {
      // Jika tanggal dipilih, set filter
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1); // JS month is 0-11
      
      setSelectedMonthYear(`${year}-${String(month).padStart(2, "0")}`);
      setSelectedYear(year.toString());
      setSelectedMonth(month); // Filter logic uses "8" not "08"
    } else {
      // Jika tanggal null (dihapus), bersihkan semua filter
      setSelectedMonthYear("");
      setSelectedYear("");
      setSelectedMonth("");
    }
    setCurrentPage(1); // Selalu reset ke halaman 1
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
  const availableFilters = useMemo(() => {
    if (!data?.stories) return { months: [], years: [] };
    const months = new Set<string>();
    const years = new Set<string>();
    
    data.stories.forEach(story => {
      try {
        const date = new Date(story.created_at);
        months.add(String(date.getMonth() + 1));
        years.add(String(date.getFullYear()));
      } catch (e) { /* Abaikan tanggal invalid */ }
    });

    return {
      months: Array.from(months).sort((a, b) => parseInt(a) - parseInt(b)),
      years: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)),
    };
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

  const getMonthName = (monthNumber: string) => {
    const date = new Date(2000, parseInt(monthNumber) - 1, 1);
    return new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date);
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
                  availableFilters={availableFilters}
                  startDate={startDate}
                  handleDateChange={handleDateChange}
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