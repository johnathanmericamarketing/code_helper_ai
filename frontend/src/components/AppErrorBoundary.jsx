import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Unhandled UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <AlertTriangle className="w-10 h-10 mx-auto text-warning" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              The page hit an unexpected error. You can refresh and continue working.
            </p>
            <Button className="gap-2" onClick={() => window.location.reload()}>
              <RefreshCcw className="w-4 h-4" />
              Reload app
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

