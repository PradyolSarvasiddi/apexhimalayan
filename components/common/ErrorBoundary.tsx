'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-dark-section border border-border rounded-xl text-center my-4 min-h-[300px]">
          <div className="p-4 bg-orange/10 rounded-full mb-6">
            <AlertTriangle className="text-orange w-10 h-10" />
          </div>
          <h3 className="headline text-2xl mb-4">
            Something went wrong{this.props.sectionName ? ` in ${this.props.sectionName}` : ''}
          </h3>
          <p className="subheadline mb-8 text-secondary max-w-md mx-auto">
            We encountered an unexpected error while loading this section. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleReset}
            className="btn btn--primary flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
