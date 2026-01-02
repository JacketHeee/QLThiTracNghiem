import { useState } from "react";

// Component test cho ErrorBoundary wrapper
function BoundaryWrapperTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("🛡️ ErrorBoundary Wrapper Test - Caught by ErrorBoundary!");
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
    >
      🛡️ Test ErrorBoundary
    </button>
  );
}

// Component test cho ErrorPage (route error)
function RouteErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("💥 Route Error - Caught by ErrorPage!");
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
    >
      🎯 Test Route Error (ErrorPage)
    </button>
  );
}

// Component test cho async error (KHÔNG được catch)
function AsyncErrorTest() {
  const handleAsyncError = () => {
    setTimeout(() => {
      throw new Error("⏰ Async Error - Won't be caught!");
    }, 100);
  };

  return (
    <button
      onClick={handleAsyncError}
      className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors"
    >
      ⚠️ Test Async Error (Uncaught)
    </button>
  );
}

// Component test cho event handler error (cần try-catch)
function EventHandlerErrorTest() {
  const handleClick = () => {
    try {
      throw new Error("🖱️ Event Handler Error");
    } catch (error) {
      console.error("Caught in event handler:", error);
      alert("Event handler error caught! Check console.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
    >
      🖱️ Test Event Handler Error (Manual Catch)
    </button>
  );
}

// Component test cho Promise rejection
function PromiseRejectionTest() {
  const handlePromiseError = () => {
    Promise.reject(new Error("🚫 Promise Rejection - Won't be caught!")).catch(
      (error) => {
        console.error("Promise rejection:", error);
        alert("Promise rejection! Check console.");
      }
    );
  };

  return (
    <button
      onClick={handlePromiseError}
      className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
    >
      🚫 Test Promise Rejection
    </button>
  );
}

export default function ErrorBoundaryTestPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Error Boundary Test Suite
          </h1>
          <p className="text-neutral-600 mb-8">
            Test different error scenarios to see how they're handled
          </p>

          <div className="space-y-4">
            {/* Test 0: ErrorBoundary Wrapper */}
            <div className="border border-blue-300 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                0. ErrorBoundary Component (Wrapper)
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                ✅ Caught by{" "}
                <code className="bg-blue-100 px-1 rounded">ErrorBoundary</code>{" "}
                wrapper (shows ErrorBoundary UI inside this card)
              </p>

              <BoundaryWrapperTest />
            </div>

            {/* Test 1: Route Error */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">
                1. Route Component Error
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                ✅ Should be caught by{" "}
                <code className="bg-neutral-100 px-1 rounded">ErrorPage</code>
              </p>
              <RouteErrorTest />
            </div>

            {/* Test 2: Async Error */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">
                2. Async Error (setTimeout)
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                ❌ Won't be caught by Error Boundary (check browser console)
              </p>
              <AsyncErrorTest />
            </div>

            {/* Test 3: Event Handler Error */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">
                3. Event Handler Error
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                ℹ️ Manually caught with try-catch
              </p>
              <EventHandlerErrorTest />
            </div>

            {/* Test 4: Promise Rejection */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">
                4. Promise Rejection
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                ℹ️ Manually caught with .catch()
              </p>
              <PromiseRejectionTest />
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              📝 What gets caught?
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Errors during component render</li>
              <li>✅ Errors in lifecycle methods</li>
              <li>✅ Errors in constructor</li>
              <li>❌ Event handler errors (need try-catch)</li>
              <li>❌ Async errors (setTimeout, promises)</li>
              <li>❌ Server-side rendering errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
