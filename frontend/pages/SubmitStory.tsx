import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backend from "~backend/client";
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
    backend.analytics.trackPageView({ page: "/submit-story" }).catch(console.error);
  }, []);

  const createStoryMutation = useMutation({
    mutationFn: (data: { title: string; content: string; is_anonymous: boolean; author_name?: string }) =>
      backend.stories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "Kisah berhasil dibagikan",
        description: "Terima kasih telah berbagi kisah Anda. Semoga ini membantu orang lain.",
      });
      navigate("/stories");
    },
    onError: (error) => {
      console.error("Error creating story:", error);
      toast({
        title: "Gagal membagikan kisah",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Judul dan isi kisah harus diisi.",
        variant: "destructive",
      });
      return;
    }

    if (!isAnonymous && !authorName.trim()) {
      toast({
        title: "Nama harus diisi",
        description: "Jika tidak ingin anonim, mohon isi nama Anda.",
        variant: "destructive",
      });
      return;
    }

    createStoryMutation.mutate({
      title,
      content,
      is_anonymous: isAnonymous,
      author_name: isAnonymous ? undefined : authorName,
    });
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bagikan Kisah Anda</h1>
          <p className="text-xl text-blue-100">
            Suara Anda penting. Berbagi kisah dapat membantu korban lain merasa tidak sendirian.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">Privasi Anda Dilindungi</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Anda dapat memilih untuk membagikan kisah secara anonim. Informasi pribadi
            Anda akan tetap aman dan tidak akan dibagikan tanpa persetujuan Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
              Judul Kisah <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul singkat untuk kisah Anda"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
              Isi Kisah <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ceritakan pengalaman Anda. Ini adalah ruang aman untuk berbagi."
              rows={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mohon hindari membagikan informasi pribadi yang sensitif
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium text-gray-900 cursor-pointer"
            >
              Bagikan secara anonim
            </label>
          </div>

          {!isAnonymous && (
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-900 mb-2">
                Nama Anda <span className="text-red-500">*</span>
              </label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Masukkan nama Anda"
                required={!isAnonymous}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={createStoryMutation.isPending}
          >
            {createStoryMutation.isPending ? (
              "Mengirim..."
            ) : (
              <>
                Kirim Kisah
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
