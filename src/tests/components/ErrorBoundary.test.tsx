// import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
// import { render, screen } from "@/tests/utils/test-utils";
// import { ErrorBoundary } from "@/components/ErrorBoundary";

// // Component that throws error
// function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
//   if (shouldThrow) {
//     throw new Error("Test error");
//   }
//   return <div>No error</div>;
// }

// describe("ErrorBoundary", () => {
//   // Suppress console.error for these tests
//   const originalError = console.error;
//   beforeAll(() => {
//     console.error = vi.fn();
//   });

//   afterAll(() => {
//     console.error = originalError;
//   });

//   it("renders children when there is no error", () => {
//     render(
//       <ErrorBoundary>
//         <ThrowError shouldThrow={false} />
//       </ErrorBoundary>
//     );

//     expect(screen.getByText("No error")).toBeInTheDocument();
//   });

//   it("renders error fallback when child throws error", () => {
//     render(
//       <ErrorBoundary>
//         <ThrowError shouldThrow={true} />
//       </ErrorBoundary>
//     );

//     expect(screen.getByText(/Oops! Có lỗi xảy ra/i)).toBeInTheDocument();
//   });

//   it("displays error message in fallback UI", () => {
//     render(
//       <ErrorBoundary>
//         <ThrowError shouldThrow={true} />
//       </ErrorBoundary>
//     );

//     expect(screen.getByText("Test error")).toBeInTheDocument();
//   });

//   it("renders custom fallback when provided", () => {
//     render(
//       <ErrorBoundary fallback={<div>Custom Error UI</div>}>
//         <ThrowError shouldThrow={true} />
//       </ErrorBoundary>
//     );

//     expect(screen.getByText("Custom Error UI")).toBeInTheDocument();
//   });
// });
