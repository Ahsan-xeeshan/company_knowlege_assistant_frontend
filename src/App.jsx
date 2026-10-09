import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch(`${API_URL}/api/rag/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the knowledge assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
            AI Knowledge Assistant
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Company Knowledge Assistant
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Ask questions about our services, pricing, policies and company
            information.
          </p>
        </header>

        {/* Question */}
        <section className="mb-6">
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a question..."
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="rounded-xl bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Thinking..." : "Ask"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Loading */}
        {loading && (
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-3 text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span>Searching company knowledge...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-900 bg-red-950/40 p-5 text-red-300">
            {error}
          </div>
        )}

        {/* Answer */}
        {answer && !loading && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                AI
              </div>

              <div>
                <p className="font-semibold">Assistant</p>
                <p className="text-xs text-slate-500">
                  Based on company documents
                </p>
              </div>
            </div>

            <p className="whitespace-pre-wrap text-base leading-7 text-slate-200">
              {answer}
            </p>

            {/* Sources */}
            {sources.length > 0 && (
              <div className="mt-8 border-t border-slate-800 pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sources
                </p>

                <div className="flex flex-wrap gap-2">
                  {sources.map((source) => (
                    <span
                      key={source}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Suggestions */}
        {!answer && !loading && (
          <section className="mt-4">
            <p className="mb-3 text-sm text-slate-500">
              Try asking:
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "How much does website development cost?",
                "What is your refund policy?",
                "What technologies do you use?",
                "How long does support usually take?",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuestion(item)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-left text-sm text-slate-400 transition hover:border-slate-600 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center text-xs text-slate-600">
          Powered by RAG · FastAPI · ChromaDB
        </footer>
      </main>
    </div>
  );
}

export default App;