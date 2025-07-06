import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";

export const PhotoQuiz = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    // TODO: Implement actual upload logic with Supabase
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      // Mock success message
    }, 2000);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <Camera className="h-5 w-5 text-accent" />
          </div>
          사진 퀴즈
          <Badge variant="outline">새로운 기능</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          {selectedFile ? (
            <div className="space-y-2">
              <ImageIcon className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                업로드할 준비가 되었습니다
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                사진을 업로드하여 가족에게 퀴즈를 보내보세요
              </p>
            </div>
          )}
        </div>

        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="cursor-pointer"
        />

        {selectedFile && (
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? "업로드 중..." : "퀴즈 보내기"}
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center">
          사진이 업로드되면 가족 구성원에게 퀴즈로 전달됩니다
        </div>
      </CardContent>
    </Card>
  );
};