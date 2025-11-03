# 🎯 Ejemplos de Uso - Kibi Frontend

## 📚 Guía Rápida de Uso de Componentes y APIs

### 1. Usar Daily Test API

```typescript
import { dailyTestAPI } from '@/features/daily-test/api/dailyTestAPI';

// Verificar disponibilidad
const checkTest = async () => {
  const check = await dailyTestAPI.checkDailyTest();
  console.log('Test disponible:', check.hasTestAvailable);
  console.log('Racha actual:', check.currentStreak);
};

// Generar nuevo test
const startTest = async () => {
  const session = await dailyTestAPI.generateDailyTest();
  console.log('Sesión creada:', session.id);
  console.log('Preguntas:', session.questions.length);
};

// Responder pregunta
const answerQuestion = async (sessionId: string) => {
  const response = await dailyTestAPI.answerQuestion(sessionId, {
    questionId: 'question-id',
    selectedOptionId: 'option-id',
    timeSpent: 30 // segundos
  });
  console.log('Respuesta correcta:', response.isCorrect);
};

// Completar test
const completeTest = async (sessionId: string) => {
  const results = await dailyTestAPI.completeDailyTest(sessionId);
  console.log('Puntaje:', results.score);
  console.log('Nueva racha:', results.newStreak);
};
```

### 2. Usar Progress API

```typescript
import { progressAPI } from '@/features/progress/api/progressAPI';

// Cargar dashboard completo
const loadDashboard = async () => {
  const dashboard = await progressAPI.getDashboard();
  console.log('Usuario:', dashboard.user.name);
  console.log('Efectividad:', dashboard.progress.overallEffectiveness);
  console.log('Puntaje proyectado:', dashboard.projectedScore.score);
  console.log('Racha:', dashboard.streak.current);
};

// Cargar efectividad por materias
const loadEffectiveness = async () => {
  const data = await progressAPI.getSubjectsEffectiveness();
  data.subjects.forEach(subject => {
    console.log(`${subject.name}: ${subject.effectiveness}%`);
  });
};

// Cargar puntaje proyectado
const loadScore = async () => {
  const score = await progressAPI.getProjectedScore();
  console.log('Puntaje actual:', score.currentScore);
  console.log('Confianza:', score.confidence);
  console.log('Mejora en 7 días:', score.projectedImprovement.in7Days);
};
```

### 3. Usar Review API

```typescript
import { reviewAPI } from '@/features/review/api/reviewAPI';

// Cargar repasos pendientes
const loadReviews = async () => {
  const reviews = await reviewAPI.getPendingReviews();
  console.log('Total pendientes:', reviews.statistics.total);
  console.log('Atrasados:', reviews.statistics.overdue);

  reviews.reviews.forEach(review => {
    console.log(`${review.subtopicName} - Prioridad: ${review.priority}`);
  });
};

// Generar sesión de repaso
const startReview = async (subtopicId: string) => {
  const session = await reviewAPI.generateReviewSession(subtopicId, {
    questionCount: 5,
    difficulty: 'MIXED'
  });
  console.log('Sesión de repaso creada:', session.id);
};

// Completar repaso
const completeReview = async (sessionId: string) => {
  const results = await reviewAPI.completeReviewSession(sessionId);
  console.log('Efectividad:', results.effectiveness);
  console.log('Nivel de dominio:', results.masteryLevel);
  console.log('Próximo repaso:', results.nextReviewDate);
};
```

### 4. Usar Achievements API

```typescript
import { achievementsAPI } from '@/features/achievements/api/achievementsAPI';

// Cargar logros
const loadAchievements = async () => {
  const achievements = await achievementsAPI.getUserAchievements();

  console.log('Logros desbloqueados:', achievements.statistics.unlocked);
  console.log('Puntos totales:', achievements.statistics.points);
  console.log('Porcentaje completado:', achievements.statistics.percentage);

  // Logros recientes
  achievements.recent.forEach(achievement => {
    console.log(`Nuevo logro: ${achievement.title}`);
  });
};

// Marcar logros como vistos
const markSeen = async (achievementIds: string[]) => {
  await achievementsAPI.markMultipleAsSeen(achievementIds);
  console.log('Logros marcados como vistos');
};
```

### 5. Usar Mock Exams API

```typescript
import { mockExamsAPI } from '@/features/mock-exams/api/mockExamsAPI';

// Verificar disponibilidad
const checkExam = async () => {
  const availability = await mockExamsAPI.checkAvailability();
  console.log('Puede tomar examen:', availability.canTakeExam);
  console.log('Exámenes restantes:', availability.remainingExams);
  console.log('Plan:', availability.userPlan);
};

// Iniciar simulacro
const startExam = async () => {
  const response = await mockExamsAPI.startMockExam({
    confirmStart: true
  });
  console.log('Examen iniciado:', response.attemptId);
  console.log('Número de examen:', response.examNumber);
  console.log('Tiempo límite:', response.timeLimit, 'minutos');
};

// Ver historial
const loadHistory = async () => {
  const history = await mockExamsAPI.getHistory();
  console.log('Total de intentos:', history.totalAttempts);
  console.log('Mejor puntaje:', history.bestScore);
  console.log('Promedio:', history.averageScore);
};
```

## 🎨 Ejemplos de Uso de Componentes UI

### 1. ProgressCard

```tsx
import { ProgressCard } from '@/shared/ui/ProgressCard';

<ProgressCard
  title="Puntaje Proyectado"
  value={650}
  maxValue={700}
  trend="up"
  trendValue="+15"
  icon={<Target className="w-4 h-4" />}
  showProgress={true}
  progressColor="bg-gradient-to-r from-blue-500 to-purple-500"
/>
```

### 2. StreakDisplay

```tsx
import { StreakDisplay } from '@/shared/ui/StreakDisplay';

<StreakDisplay
  currentStreak={7}
  maxStreak={15}
  isActive={true}
  lastTestDate="2025-10-30T10:00:00Z"
  size="lg"
  showDetails={true}
/>
```

### 3. AchievementBadge

```tsx
import { AchievementBadge } from '@/shared/ui/AchievementBadge';

<AchievementBadge
  achievement={{
    id: '1',
    code: 'STREAK_7',
    type: 'STREAK',
    title: 'Racha de 7 días',
    description: 'Completa el test diario 7 días seguidos',
    icon: '🔥',
    rarity: 'RARE',
    points: 100,
    unlockedAt: new Date(),
    seen: false,
    category: 'STREAK'
  }}
  size="md"
  showProgress={false}
  animate={true}
/>
```

### 4. SubjectEffectiveness

```tsx
import { SubjectEffectiveness } from '@/shared/ui/SubjectEffectiveness';

<SubjectEffectiveness
  name="Matemáticas"
  effectiveness={75.5}
  trend="IMPROVING"
  questionsAnswered={150}
  level="INTERMEDIO"
  showDetails={true}
  onClick={() => router.push('/lesson/matematicas')}
/>
```

### 5. ProjectedScore

```tsx
import { ProjectedScore } from '@/shared/ui/ProjectedScore';

<ProjectedScore
  score={650}
  maxScore={700}
  confidence={85}
  trend="UP"
  changeFromLast={15}
  showDetails={true}
  size="lg"
/>
```

### 6. TrendIndicator

```tsx
import { TrendIndicator } from '@/shared/ui/TrendIndicator';

<TrendIndicator
  trend="IMPROVING"
  value={15}
  label="Mejorando"
  showIcon={true}
  showLabel={true}
  size="md"
/>
```

### 7. ReviewCard

```tsx
import { ReviewCard } from '@/shared/ui/ReviewCard';

<ReviewCard
  review={{
    subtopicId: '123',
    subtopicName: 'Álgebra Básica',
    topicName: 'Ecuaciones',
    subjectName: 'Matemáticas',
    dueDate: new Date(),
    priority: 'HIGH',
    overdue: true,
    daysSinceLastReview: 5,
    currentInterval: 7,
    masteryLevel: 3,
    questionsAvailable: 10
  }}
  onStart={() => handleStart()}
  onSkip={() => handleSkip()}
  showActions={true}
/>
```

### 8. TestCard

```tsx
import { TestCard } from '@/shared/ui/TestCard';

<TestCard
  type="daily"
  title="Test Diario"
  description="10 preguntas para mantener tu racha"
  available={true}
  timeLimit={15}
  questions={10}
  onStart={() => handleStart()}
  premium={false}
  completed={false}
/>
```

## 🔧 Ejemplos de Hooks Personalizados

### 1. useDailyTest Hook

```tsx
import { useDailyTest } from '@/features/daily-test/hooks/useDailyTest';

function DailyTestComponent() {
  const {
    check,
    session,
    loading,
    error,
    checkAvailability,
    startTest,
    answerQuestion,
    completeTest
  } = useDailyTest();

  useEffect(() => {
    checkAvailability();
  }, []);

  const handleStart = async () => {
    try {
      await startTest();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {check?.hasTestAvailable ? (
        <button onClick={handleStart}>Comenzar Test</button>
      ) : (
        <p>Test completado hoy</p>
      )}
    </div>
  );
}
```

### 2. useProgress Hook

```tsx
import { useProgress } from '@/features/progress/hooks/useProgress';

function ProgressComponent() {
  const {
    dashboard,
    effectiveness,
    projectedScore,
    loading,
    error,
    loadDashboard,
    loadEffectiveness,
    loadProjectedScore
  } = useProgress();

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {dashboard && (
        <>
          <h2>Hola, {dashboard.user.name}!</h2>
          <p>Racha: {dashboard.streak.current} días</p>
          <p>Efectividad: {dashboard.progress.overallEffectiveness}%</p>
        </>
      )}
    </div>
  );
}
```

## 🎬 Flujos Completos de Usuario

### Flujo: Completar Test Diario

```tsx
import { useState, useEffect } from 'react';
import { dailyTestAPI } from '@/features/daily-test/api/dailyTestAPI';

function DailyTestFlow() {
  const [step, setStep] = useState<'check' | 'test' | 'results'>('check');
  const [session, setSession] = useState(null);
  const [results, setResults] = useState(null);

  // 1. Verificar disponibilidad
  useEffect(() => {
    checkTest();
  }, []);

  const checkTest = async () => {
    const check = await dailyTestAPI.checkDailyTest();
    if (check.hasTestAvailable) {
      // Test disponible
    }
  };

  // 2. Iniciar test
  const startTest = async () => {
    const newSession = await dailyTestAPI.generateDailyTest();
    setSession(newSession);
    setStep('test');
  };

  // 3. Responder preguntas
  const answerQuestion = async (questionId, optionId) => {
    await dailyTestAPI.answerQuestion(session.id, {
      questionId,
      selectedOptionId: optionId,
      timeSpent: 30
    });
  };

  // 4. Completar test
  const completeTest = async () => {
    const testResults = await dailyTestAPI.completeDailyTest(session.id);
    setResults(testResults);
    setStep('results');
  };

  return (
    <div>
      {step === 'check' && <CheckView onStart={startTest} />}
      {step === 'test' && <TestView session={session} onComplete={completeTest} />}
      {step === 'results' && <ResultsView results={results} />}
    </div>
  );
}
```

### Flujo: Iniciar Sesión de Repaso

```tsx
import { useState } from 'react';
import { reviewAPI } from '@/features/review/api/reviewAPI';

function ReviewFlow({ subtopicId }) {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // 1. Generar sesión
  const startReview = async () => {
    const newSession = await reviewAPI.generateReviewSession(subtopicId, {
      questionCount: 5
    });
    setSession(newSession);
  };

  // 2. Responder preguntas
  const answerQuestion = async (optionId) => {
    const response = await reviewAPI.answerQuestion(session.id, {
      questionId: session.questions[currentQuestion].question.id,
      selectedOptionId: optionId,
      timeSpent: 45
    });

    if (currentQuestion < session.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeReview();
    }
  };

  // 3. Completar repaso
  const completeReview = async () => {
    const results = await reviewAPI.completeReviewSession(session.id);
    console.log('Próximo repaso:', results.nextReviewDate);
  };

  return (
    <div>
      {!session ? (
        <button onClick={startReview}>Comenzar Repaso</button>
      ) : (
        <QuestionView
          question={session.questions[currentQuestion]}
          onAnswer={answerQuestion}
        />
      )}
    </div>
  );
}
```

## 🎯 Patrones Comunes

### Pattern: Loading State

```tsx
function ComponentWithLoading() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await someAPI.getData();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton />;
  }

  return <div>{/* Render data */}</div>;
}
```

### Pattern: Error Handling

```tsx
function ComponentWithError() {
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    setError(null);
    try {
      await someAPI.doSomething();
    } catch (err) {
      setError(err.message || 'Error desconocido');
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Rest of component */}
    </div>
  );
}
```

### Pattern: Refresh Data

```tsx
function ComponentWithRefresh() {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const newData = await someAPI.getData();
      setData(newData);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <Button onClick={refresh} disabled={refreshing}>
        <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
        Actualizar
      </Button>
      {/* Rest of component */}
    </div>
  );
}
```

## 📝 Notas Adicionales

### TypeScript Types
Todos los tipos están completamente definidos. Usa el autocompletado de tu IDE para explorar las opciones disponibles.

### Error Handling
Los errores son manejados automáticamente por el API client y propagados a los componentes.

### Authentication
El token se maneja automáticamente. Solo asegúrate de que esté guardado en localStorage.

### Performance
Los componentes están optimizados con memo, useMemo y useCallback donde es necesario.

---

**Documentación completa disponible en:**
- `IMPLEMENTATION_GUIDE.md` - Guía técnica detallada
- `IMPLEMENTATION_SUMMARY.md` - Resumen ejecutivo
- `USAGE_EXAMPLES.md` - Este archivo