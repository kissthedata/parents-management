import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";

const Calendar = () => {
  // Mock family schedule data from daily answers
  const familySchedule = [
    {
      date: "2024-01-15",
      events: [
        { time: "09:00", title: "가족 아침식사", type: "답변에서 생성", participant: "전체" },
        { time: "19:00", title: "영화 관람", type: "계획", participant: "부모-자녀" }
      ]
    },
    {
      date: "2024-01-16", 
      events: [
        { time: "14:00", title: "공원 산책", type: "답변에서 생성", participant: "전체" },
        { time: "20:00", title: "보드게임", type: "제안", participant: "전체" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            가족 캘린더
          </h1>
          <p className="text-muted-foreground mt-2">일상 답변으로 만들어진 우리 가족 일정</p>
        </div>

        {/* Schedule Cards */}
        <div className="space-y-4">
          {familySchedule.map((day, dayIndex) => (
            <Card key={dayIndex} className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {new Date(day.date).toLocaleDateString('ko-KR', { 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{event.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={event.type === "답변에서 생성" ? "default" : "secondary"} className="text-xs">
                          {event.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {event.participant}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        <Card className="shadow-lg border-dashed">
          <CardContent className="text-center py-8">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm">
              더 많은 일정을 보려면<br />
              매일 질문에 답변해주세요!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;