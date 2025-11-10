import type { Question } from '../types';
import { QuestionType, QuestionDifficultyLevel } from '@/features/diagnostic-test/types/quiz.types';

/**
 * Mock exam questions for testing
 * Aligned with Question type from diagnostic-test
 */
export const mockExamQuestions: Question[] = [
  {
    id: '69022f100d969633f52153e3',
    statement: '¿Cuántos ejes de simetría tiene la letra "H"?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: '4' }
    ],
    correctAnswers: ['c'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>¿Visualizaste la letra "H"?</li>\n<li>¿Identificaste el eje de simetría vertical que pasa por el centro?</li>\n<li>¿Identificaste el eje de simetría horizontal que pasa por el trazo central?</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: c) 2</strong></p>',
    helpDescription: 'Un eje de simetría es una línea que divide una figura en dos partes iguales y simétricas. La letra "H" tiene dos ejes de simetría: uno vertical que pasa por el centro y uno horizontal que pasa por la barra central.',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153e4',
    statement: 'Si un triángulo tiene dos ángulos de 45° cada uno, ¿cuánto mide el tercer ángulo?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '45°' },
      { id: 'b', text: '60°' },
      { id: 'c', text: '90°' },
      { id: 'd', text: '180°' }
    ],
    correctAnswers: ['c'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>Recordar que la suma de los ángulos internos de un triángulo siempre es 180°</li>\n<li>Sumar los dos ángulos conocidos: 45° + 45° = 90°</li>\n<li>Restar de 180°: 180° - 90° = 90°</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: c) 90°</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153e5',
    statement: '¿Cuál es el resultado de 15 × 8?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '110' },
      { id: 'b', text: '120' },
      { id: 'c', text: '125' },
      { id: 'd', text: '130' }
    ],
    correctAnswers: ['b'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>Multiplicar: 15 × 8 = 120</li>\n<li>Puedes verificar: (10 × 8) + (5 × 8) = 80 + 40 = 120</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: b) 120</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153e6',
    statement: '¿Cuál es el área de un rectángulo con base 8 cm y altura 5 cm?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '13 cm²' },
      { id: 'b', text: '26 cm²' },
      { id: 'c', text: '40 cm²' },
      { id: 'd', text: '48 cm²' }
    ],
    correctAnswers: ['c'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>Usar la fórmula del área de un rectángulo: A = base × altura</li>\n<li>Sustituir los valores: A = 8 cm × 5 cm</li>\n<li>Calcular: A = 40 cm²</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: c) 40 cm²</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153e7',
    statement: '¿Qué fracción es equivalente a 0.75?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '1/4' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '3/4' },
      { id: 'd', text: '2/3' }
    ],
    correctAnswers: ['c'],
    difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>0.75 significa 75/100</li>\n<li>Simplificar dividiendo numerador y denominador entre 25: 75÷25 = 3, 100÷25 = 4</li>\n<li>Resultado: 3/4</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: c) 3/4</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153e8',
    statement: '¿Cuál es el perímetro de un cuadrado con lado de 7 cm?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '14 cm' },
      { id: 'b', text: '21 cm' },
      { id: 'c', text: '28 cm' },
      { id: 'd', text: '49 cm' }
    ],
    correctAnswers: ['c'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>Un cuadrado tiene 4 lados iguales</li>\n<li>Perímetro = lado × 4</li>\n<li>P = 7 cm × 4 = 28 cm</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: c) 28 cm</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153e9',
    statement: '¿Cuál es el valor de x en la ecuación: x + 12 = 20?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '6' },
      { id: 'b', text: '8' },
      { id: 'c', text: '10' },
      { id: 'd', text: '32' }
    ],
    correctAnswers: ['b'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>Ecuación: x + 12 = 20</li>\n<li>Restar 12 de ambos lados: x = 20 - 12</li>\n<li>Resultado: x = 8</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: b) 8</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153ea',
    statement: '¿Cuántos minutos hay en 2.5 horas?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '120 minutos' },
      { id: 'b', text: '130 minutos' },
      { id: 'c', text: '140 minutos' },
      { id: 'd', text: '150 minutos' }
    ],
    correctAnswers: ['d'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>1 hora = 60 minutos</li>\n<li>2 horas = 120 minutos</li>\n<li>0.5 horas = 30 minutos</li>\n<li>Total: 120 + 30 = 150 minutos</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: d) 150 minutos</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153eb',
    statement: '¿Cuál es el número primo más pequeño?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: '3' }
    ],
    correctAnswers: ['c'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>Un número primo solo es divisible entre 1 y él mismo</li>\n<li>0 y 1 no son números primos por definición</li>\n<li>2 es divisible solo entre 1 y 2</li>\n<li>2 es el único número primo par</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: c) 2</strong></p>',
    timeLimit: 60,
  },
  {
    id: '69022f100d969633f52153ec',
    statement: 'Si Juan tiene 24 caramelos y quiere repartirlos equitativamente entre 6 amigos, ¿cuántos caramelos recibirá cada amigo?',
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'a', text: '3 caramelos' },
      { id: 'b', text: '4 caramelos' },
      { id: 'c', text: '5 caramelos' },
      { id: 'd', text: '6 caramelos' }
    ],
    correctAnswers: ['b'],
    difficultyLevel: QuestionDifficultyLevel.BASIC,
    subjectId: '68fbb5b84a9c60f64b745b90',
    topicId: '69022f0d0d969633f52153b5',
    subtopicId: '69022f0d0d969633f52153bd',
    stepByStepExplanation: '<h3>Solución paso a paso:</h3>\n<ol>\n<li>Total de caramelos: 24</li>\n<li>Número de amigos: 6</li>\n<li>División: 24 ÷ 6 = 4</li>\n<li>Cada amigo recibe 4 caramelos</li>\n</ol>\n<p>✅ <strong>Respuesta correcta: b) 4 caramelos</strong></p>',
    timeLimit: 60,
  },
];
