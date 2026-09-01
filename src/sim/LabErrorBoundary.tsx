import { Component, type ReactNode } from "react";

export class LabErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 z-20 grid place-items-center px-6">
          <div className="max-w-md rounded-xl border border-line bg-surface p-6 text-center">
            <p className="font-mono text-[10px] tracking-[0.24em] text-muted uppercase">
              Solver trip
            </p>
            <h2 className="mt-2 text-lg font-medium">The bench went unstable</h2>
            <p className="mt-2 text-sm text-muted">
              {this.state.error.message || "A physics or graphics fault stopped the lab."}
            </p>
            <button
              type="button"
              className="mt-5 h-10 w-full rounded-md bg-fg text-sm text-bg"
              onClick={() => {
                this.setState({ error: null });
                this.props.onReset();
              }}
            >
              Reset the bench
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
