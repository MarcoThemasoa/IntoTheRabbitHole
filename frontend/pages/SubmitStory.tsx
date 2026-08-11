import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Heart, Lock, ShieldCheck, MessageCircle, PhoneCall, BookOpen } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const supportPoints = [
  {
    icon: Lock,
    title: "Anonim Sepenuhnya",
    desc: "Nama Anda tidak akan pernah ditampilkan tanpa persetujuan Anda.",
  },
  {
    icon: ShieldCheck,
    title: "Data Terlindungi",
    desc: "Informasi pribadi Anda aman dan tidak dibagikan ke pihak mana pun.",
  },
  {
    icon: MessageCircle,
    title: "Tanpa Penghakiman",
    desc: "Ruang ini dibuat dengan empati. Apa pun yang Anda alami, Anda diterima.",
  },
];

export default function SubmitStory() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ page: '/submit-story' }) }).catch(() => { /* best-effort */ });
  }, []);

  const createStoryMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; is_anonymous: boolean; author_name?: string }) => {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        // Pass both status and response data for error handling
        const error = new Error(responseData.error || 'Network response was not ok') as any;
        error.status = res.status;
        error.details = responseData.details;
        throw error;
      }

      return responseData;
    },
    onSuccess: async () => {
      // Reset form
      setTitle("");
      setContent("");
      setIsAnonymous(true);
      setAuthorName("");

      toast({
        title: "Kisah berhasil dibagikan!",
        description: "Terima kasih telah berbagi kisah Anda. Semoga ini membantu orang lain.",
      });

      // Refetch queries immediately (wait for them to complete)
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["stories"] }),
        queryClient.refetchQueries({ queryKey: ["stats"] }),
      ]);

      // Then navigate to Stories page
      navigate("/stories");
    },
    onError: (error: any) => {
      console.error("Error creating story:", error);

      let description = "Terjadi kesalahan. Silakan coba lagi.";

      // Handle validation errors (400)
      if (error.status === 400) {
        if (error.details && Array.isArray(error.details)) {
          description = error.details.join("\n");
        } else {
          description = error.message || description;
        }
      }
      // Handle rate limiting errors (429)
      else if (error.status === 429) {
        description = error.message || "Terlalu banyak pengiriman. Silakan coba lagi nanti.";
      }
      // Handle server errors (500)
      else if (error.status === 500) {
        description = "Server error. Silakan coba lagi nanti.";
      }

      toast({
        title: "Gagal membagikan kisah",
        description: description,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title
    if (!title.trim()) {
      toast({
        title: "Judul diperlukan",
        description: "Silakan masukkan judul untuk kisah Anda.",
        variant: "destructive",
      });
      return;
    }

    if (title.length < 5) {
      toast({
        title: "Judul terlalu pendek",
        description: "Judul harus minimal 5 karakter.",
        variant: "destructive",
      });
      return;
    }

    if (title.length > 500) {
      toast({
        title: "Judul terlalu panjang",
        description: "Judul maksimal 500 karakter.",
        variant: "destructive",
      });
      return;
    }

    // Validate content
    if (!content.trim()) {
      toast({
        title: "Isi kisah diperlukan",
        description: "Silakan masukkan isi kisah Anda.",
        variant: "destructive",
      });
      return;
    }

    if (content.length < 10) {
      toast({
        title: "Isi kisah terlalu pendek",
        description: "Isi kisah harus minimal 10 karakter.",
        variant: "destructive",
      });
      return;
    }

    if (content.length > 10000) {
      toast({
        title: "Isi kisah terlalu panjang",
        description: "Isi kisah maksimal 10,000 karakter.",
        variant: "destructive",
      });
      return;
    }

    // Validate author name if not anonymous
    if (!isAnonymous && !authorName.trim()) {
      toast({
        title: "Nama diperlukan",
        description: "Jika tidak ingin anonim, mohon isi nama Anda.",
        variant: "destructive",
      });
      return;
    }

    createStoryMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      is_anonymous: isAnonymous,
      author_name: isAnonymous ? undefined : authorName.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* ============ HERO ============ */}
      <section className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Bagikan Kisah Anda
          </h1>
          <p className="text-xl text-sky-100 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Suara Anda penting. Berbagi kisah dapat membantu korban lain merasa tidak sendirian.
          </p>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form column */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-8 mb-10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-start space-x-4">
                <div className="bg-sky-500 p-3 rounded-xl flex-shrink-0">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Privasi Anda Dilindungi</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Anda dapat memilih untuk membagikan kisah secara anonim. Informasi pribadi
                    Anda akan tetap aman dan tidak akan dibagikan tanpa persetujuan Anda.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-3">
                  Judul Kisah <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul singkat untuk kisah Anda"
                  className="text-lg border-2 focus:border-sky-500 transition-colors"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-500">
                    Minimal 5 karakter, maksimal 500 karakter
                  </p>
                  <span className={`text-sm font-medium ${
                    title.length < 5 ? 'text-red-500' :
                    title.length > 500 ? 'text-red-500' :
                    'text-green-500'
                  }`}>
                    {title.length}/500
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
                <label htmlFor="content" className="block text-sm font-semibold text-slate-900 mb-3">
                  Isi Kisah <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda. Ini adalah ruang aman untuk berbagi."
                  rows={10}
                  className="text-base border-2 focus:border-sky-500 transition-colors resize-none"
                  required
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-slate-500">
                    Minimal 10 karakter, maksimal 10,000 karakter. Hindari data pribadi yang sensitif.
                  </p>
                  <span className={`text-sm font-medium ${
                    content.length < 10 ? 'text-red-500' :
                    content.length > 10000 ? 'text-red-500' :
                    'text-green-500'
                  }`}>
                    {content.length}/10,000
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <label
                      htmlFor="anonymous"
                      className="text-base font-semibold text-slate-900 cursor-pointer block mb-1"
                    >
                      Bagikan secara anonim
                    </label>
                    <p className="text-sm text-slate-600">
                      Nama Anda tidak akan ditampilkan jika opsi ini dicentang
                    </p>
                  </div>
                </div>

                {!isAnonymous && (
                  <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label htmlFor="authorName" className="block text-sm font-semibold text-slate-900 mb-3">
                      Nama Anda <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="authorName"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="border-2 focus:border-sky-500 transition-colors"
                      required={!isAnonymous}
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={
                  createStoryMutation.isPending ||
                  !title.trim() ||
                  title.length < 5 ||
                  title.length > 500 ||
                  !content.trim() ||
                  content.length < 10 ||
                  content.length > 10000 ||
                  (!isAnonymous && !authorName.trim())
                }
              >
                {createStoryMutation.isPending ? (
                  "Mengirim..."
                ) : (
                  <>
                    Kirim Kisah
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Support sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-sky-100 p-8">
              <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-sky-600" />
                Ruang Aman
              </h3>
              <div className="space-y-6">
                {supportPoints.map((point) => (
                  <div key={point.title} className="flex items-start gap-4">
                    <div className="bg-sky-50 p-2.5 rounded-xl flex-shrink-0">
                      <point.icon className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{point.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-500 to-blue-700 rounded-3xl p-8 text-white shadow-xl">
              <PhoneCall className="h-8 w-8 mb-4 text-sky-200" />
              <h3 className="font-bold text-xl mb-2">Butuh Bantuan Segera?</h3>
              <p className="text-sky-100/90 text-sm leading-relaxed mb-6">
                Jika Anda sedang dalam keadaan darurat atau membutuhkan pendampingan, jangan ragu untuk menghubungi pihak berwenang.
              </p>
              <a
                href="https://patrolisiber.id"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-blue-700 font-semibold py-3 rounded-xl hover:bg-sky-50 transition-all"
              >
                Patroli Siber
              </a>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-sky-100 p-8">
              <BookOpen className="h-6 w-6 text-sky-600 mb-4" />
              <h3 className="font-bold text-lg text-slate-900 mb-3">Belum Siap Berbagi?</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Tidak masalah. Anda bisa membaca kisah korban lain atau mempelajari cara melaporkan kasus terlebih dahulu.
              </p>
              <div className="space-y-3">
                <Link to="/stories" className="block text-sky-600 hover:text-blue-800 font-medium text-sm">
                  Baca Kisah Korban →
                </Link>
                <Link to="/how-to-report" className="block text-sky-600 hover:text-blue-800 font-medium text-sm">
                  Panduan Melapor →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}