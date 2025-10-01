import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Runtime error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-xl mx-auto mt-12 rounded-lg border bg-white shadow">
          <h1 className="text-xl font-semibold mb-3 text-red-600">Something went wrong</h1>
          <p className="text-sm text-slate-600 mb-4">A runtime error occurred. Check the browser console for details.</p>
          {this.state.error && (
            <pre className="bg-slate-900 text-slate-100 text-xs p-3 rounded overflow-auto max-h-60">
              {this.state.error.message}\n{this.state.error.stack}
            </pre>
          )}
          <button
            className="mt-4 px-4 py-2 text-sm bg-brand-600 text-white rounded hover:bg-brand-700"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
