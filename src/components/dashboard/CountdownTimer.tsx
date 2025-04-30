
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Data do evento: 18 de julho de 2025
  const targetDate = new Date('2025-07-18T00:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="countdown-gradient p-4">
        <CardTitle className="text-white text-center">Contagem Regressiva</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-center space-x-4 text-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-ocean-600">{timeLeft.days}</div>
            <div className="text-xs text-muted-foreground">Dias</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-ocean-600">{timeLeft.hours}</div>
            <div className="text-xs text-muted-foreground">Horas</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-ocean-600">{timeLeft.minutes}</div>
            <div className="text-xs text-muted-foreground">Minutos</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-ocean-600">{timeLeft.seconds}</div>
            <div className="text-xs text-muted-foreground">Segundos</div>
          </div>
        </div>
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Até o Retiro Onda Xangri-lá 2025
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
