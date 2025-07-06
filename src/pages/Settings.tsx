import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            설정
          </h1>
        </div>

        {/* Profile Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              프로필
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">사용자</p>
                <Badge variant="secondary">부모</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              프로필 수정
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">새로운 질문 알림</p>
                <p className="text-sm text-muted-foreground">매일 새로운 질문을 받아보세요</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">답변 알림</p>
                <p className="text-sm text-muted-foreground">가족이 답변했을 때 알림을 받아보세요</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">사진 퀴즈 알림</p>
                <p className="text-sm text-muted-foreground">새로운 사진 퀴즈가 도착했을 때</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              개인정보 및 보안
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              개인정보 처리방침
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              서비스 이용약관
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              데이터 관리
            </Button>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              도움말 및 지원
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              자주 묻는 질문
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              문의하기
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              앱 정보
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-lg border-destructive/20">
          <CardContent className="pt-6">
            <Button variant="destructive" className="w-full" size="lg">
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;