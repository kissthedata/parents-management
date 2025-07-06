import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Album as AlbumIcon, Heart, MessageCircle, Calendar } from "lucide-react";

const Album = () => {
  // 빈 추억 데이터
  const memories: Array<{
    id: number;
    title: string;
    date: string;
    type: string;
    preview: string;
    image: string;
    likes: number;
  }> = [];

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