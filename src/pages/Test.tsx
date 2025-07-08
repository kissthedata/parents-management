// src/pages/Test.tsx
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

function Test() {
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.from('test_table').select('*');

      if (error) {
        console.error('❌ 오류:', error.message);
      } else {
        console.log('✅ 불러온 데이터:', data);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h1>Supabase 연결 테스트 중!</h1>
      <p>개발자 도구(F12)에서 콘솔을 확인하세요!</p>
    </div>
  );
}

export default Test;