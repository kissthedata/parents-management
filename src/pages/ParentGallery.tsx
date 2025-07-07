import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  url: string;
  uploadedAt: string;
}

export default function ParentGallery() {
  const { parentId } = useParams<{ parentId: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);

  // Load images from localStorage
  useEffect(() => {
    if (parentId) {
      const saved = localStorage.getItem(`parent-gallery-${parentId}`);
      if (saved) {
        setImages(JSON.parse(saved));
      }
    }
  }, [parentId]);

  // Save images to localStorage
  const saveImages = (imgs: GalleryImage[]) => {
    if (parentId) {
      localStorage.setItem(`parent-gallery-${parentId}`, JSON.stringify(imgs));
    }
  };

  // Handle image upload
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      const newImages = [
        { url, uploadedAt: new Date().toISOString() },
        ...images,
      ];
      setImages(newImages);
      saveImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  // Handle image delete
  const handleDelete = (idx: number) => {
    const newImages = images.filter((_, i) => i !== idx);
    setImages(newImages);
    saveImages(newImages);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← 뒤로
        </Button>
        <h1 className="text-lg font-semibold">사진첩</h1>
        <div className="w-10"></div>
      </div>
      <div className="mb-4">
        <label className="block w-full cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-primary/30 rounded-lg bg-white hover:bg-primary/5 transition-colors">
            <span className="text-primary font-medium">+ 사진 추가하기</span>
          </div>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {images.length === 0 && (
          <div className="col-span-2 text-center text-muted-foreground py-8">사진이 없습니다.</div>
        )}
        {images.map((img, idx) => (
          <div key={img.uploadedAt + idx} className="relative group">
            <img
              src={img.url}
              alt={`gallery-${idx}`}
              className="w-full h-32 object-cover rounded-lg border shadow"
            />
            <button
              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
              onClick={() => handleDelete(idx)}
              title="삭제"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 