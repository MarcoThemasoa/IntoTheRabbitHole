import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

export default function SubmitStory() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ page: '/submit-story' }) }).catch(console.error);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Bagikan Kisah Anda
          </h1>
          <p className="text-xl text-purple-100 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Suara Anda penting. Berbagi kisah dapat membantu korban lain merasa tidak sendirian.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 mb-10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-500 p-3 rounded-xl flex-shrink-0">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Privasi Anda Dilindungi</h3>
              <p className="text-gray-700 leading-relaxed">
                Anda dapat memilih untuk membagikan kisah secara anonim. Informasi pribadi
                Anda akan tetap aman dan tidak akan dibagikan tanpa persetujuan Anda.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Judul Kisah <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul singkat untuk kisah Anda"
              className="text-lg border-2 focus:border-purple-500 transition-colors"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
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

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-3">
              Isi Kisah <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ceritakan pengalaman Anda. Ini adalah ruang aman untuk berbagi."
              rows={10}
              className="text-base border-2 focus:border-purple-500 transition-colors resize-none"
              required
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-gray-500">
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

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
                  className="text-base font-semibold text-gray-900 cursor-pointer block mb-1"
                >
                  Bagikan secara anonim
                </label>
                <p className="text-sm text-gray-600">
                  Nama Anda tidak akan ditampilkan jika opsi ini dicentang
                </p>
              </div>
            </div>

            {!isAnonymous && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="authorName" className="block text-sm font-semibold text-gray-900 mb-3">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="border-2 focus:border-purple-500 transition-colors"
                  required={!isAnonymous}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      </section>

      <Footer />
    </div>
  );
}
