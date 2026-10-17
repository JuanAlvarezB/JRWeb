import type { CourseHours } from '@/domain/entities/CourseHours';
import type { ArcSegment } from '@/presentation/components/brand/SpeedometerArc';

/** Tramos del arco de horas: teoría, taller y manejo (excepción de color de DESIGN.md §2). */
export function hoursSegments(hours: CourseHours): ArcSegment[] {
  return [
    { id: 'theory', value: hours.theory, tone: 'theory' },
    { id: 'workshop', value: hours.workshop, tone: 'workshop' },
    { id: 'driving', value: hours.driving, tone: 'driving' },
  ];
}
