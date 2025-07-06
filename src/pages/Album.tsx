import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Album as AlbumIcon, Heart, MessageCircle, Calendar } from "lucide-react";

const Album = () => {
  // Mock memory data
  const memories = [
    {
      id: 1,
      title: "가족 여행 계획",
      date: "2024-01-10",
      type: "대화",
      preview: "제주도 여행에 대한 우리 가족의 다양한 의견들...",
      image: "/placeholder.svg",
      likes: 5
    },
    {
      id: 2,
      title: "아빠의 어린 시절",
      date: "2024-01-08", 
      type: "사진 퀴즈",
      preview: "아빠가 공유한 어린 시절 사진과 추억들...",
      image: "/placeholder.svg",
      likes: 8
    },
    {
      id: 3,
      title: "우리 가족의 꿈",
      date: "2024-01-05",
      type: "질문 답변",
      preview: "각자가 꿈꾸는 미래에 대한 솔직한 이야기들...",
      image: "/placeholder.svg",
      likes: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <AlbumIcon className="h-6 w-6 text-primary" />
            추억 앨범
          </h1>
          <p className="text-muted-foreground mt-2">소중한 가족의 순간들을 기록해요</p>
        </div>

        {/* Memories Grid */}
        <div className="space-y-4">
          {memories.map((memory) => (
            <Card key={memory.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{memory.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{memory.type}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(memory.date).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <AlbumIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {memory.preview}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 text-red-500" />
                    {memory.likes}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    댓글 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        <Card className="shadow-lg border-dashed">
          <CardContent className="text-center py-8">
            <AlbumIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm mb-4">
              아직 추억이 없어요<br />
              가족과 대화하며 소중한 순간들을 만들어보세요!
            </p>
            <Button variant="outline">첫 추억 만들기</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Album;