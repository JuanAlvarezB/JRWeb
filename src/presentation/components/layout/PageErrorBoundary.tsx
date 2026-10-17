import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface PageErrorBoundaryProps {
  /** Al cambiar (p. ej. la ruta), se descarta el error y se intenta de nuevo. */
  readonly resetKey?: string;
  readonly children: ReactNode;
}

interface PageErrorBoundaryState {
  readonly error: Error | null;
  readonly resetKey: string | undefined;
}

/**
 * Error Boundary por página (patrón pedido en el plan). Si una página falla (p. ej.
 * contenido inválido), el menú y el footer siguen funcionando y se muestra un aviso
 * con salida. Es el único componente de clase del sitio: React solo permite capturar
 * errores de render con `getDerivedStateFromError`, que no tiene equivalente en hooks.
 */
export class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  override state: PageErrorBoundaryState = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<PageErrorBoundaryState> {
    return { error };
  }

  static getDerivedStateFromProps(
    props: PageErrorBoundaryProps,
    state: PageErrorBoundaryState,
  ): Partial<PageErrorBoundaryState> | null {
    return props.resetKey === state.resetKey ? null : { error: null, resetKey: props.resetKey };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error al mostrar la página:', error, info.componentStack);
  }

  override render(): ReactNode {
    return this.state.error === null ? this.props.children : <ErrorFallback />;
  }
}
