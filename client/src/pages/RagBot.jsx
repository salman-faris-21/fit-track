import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import api from "../lib/api.js";

const RagBotPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");

  // File upload state variables
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handler for file uploads (PDF/TXT)
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload first.");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading document...");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/rag/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadStatus(
          `Successfully uploaded and indexed "${response.data.filename}".`
        );
        setFile(null);
        // Reset file input element
        const fileInput = document.getElementById("pdf-file-input");
        if (fileInput) fileInput.value = "";
      } else {
        setUploadStatus("Failed to upload document.");
      }
    } catch (err) {
      console.error("Document upload error:", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to upload and parse the document."
      );
      setUploadStatus("");
    } finally {
      setUploading(false);
    }
  };

  // Handler for querying the chatbot
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult("");
    setContext("");
    setLoading(true);

    try {
      const response = await api.post("/rag/query", {
        prompt:
          prompt ||
          "Summarize my fitness report and suggest key improvement steps.",
      });

      if (response.data.success) {
        setResult(response.data.answer || "No response received.");

        // Format and display the sources retrieved by Python
        if (response.data.sources && response.data.sources.length > 0) {
          const formattedSources = response.data.sources
            .map(
              (src, idx) =>
                `Source [${idx + 1}]: ${src.metadata.filename || "Document"} (Chunk ${
                  src.metadata.chunkIndex !== undefined ? src.metadata.chunkIndex : "N/A"
                })\n----------------------------------------\n${src.text}\n`
            )
            .join("\n");
          setContext(formattedSources);
        } else {
          setContext("No direct sources retrieved for this answer.");
        }
      } else {
        setError(response.data.error || "Query was unsuccessful.");
      }
    } catch (err) {
      console.error("RAG bot query error:", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to query RAG chatbot right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">RAG Fitness Coach</h1>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                Ask the retrieval-augmented fitness bot for personalized plans
                and guidance by uploading your fitness report PDF.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-5 py-3 text-sm text-slate-300 self-start md:self-auto">
              Logged in as
              <span className="font-semibold text-white ml-1">
                {user ? `${user.firstName || user.name}` : "Guest"}
              </span>
            </div>
          </div>

          {/* PDF Upload Section */}
          <div className="mt-8 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h2 className="text-lg font-semibold">Upload Fitness Report (PDF/TXT)</h2>
            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                id="pdf-file-input"
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 cursor-pointer"
              />
              <Button
                type="submit"
                disabled={uploading || !file}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl w-full sm:w-auto shrink-0"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </form>
            {uploadStatus && (
              <p className="text-sm text-indigo-400 font-medium">{uploadStatus}</p>
            )}
          </div>

          {/* Ask Bot Section */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask your fitness coach chatbot something like: 'Based on my uploaded fitness report, what are my priority exercises and dietary requirements?'"
              className="w-full min-h-[150px] rounded-3xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400 font-medium">
                The bot queries your uploaded documents to generate a tailored coaching plan.
              </p>
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-3xl w-full sm:w-auto"
              >
                {loading ? "Generating..." : "Ask RAG Bot"}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-6 rounded-3xl border border-red-500 bg-red-950/40 px-5 py-4 text-red-200">
              {error}
            </div>
          )}
        </div>

        {result && (
          <Card className="space-y-4 p-6 bg-[#111827] border border-slate-800 rounded-3xl">
            <h2 className="text-xl font-semibold text-indigo-400">RAG Bot Response</h2>
            <pre className="whitespace-pre-wrap break-words text-slate-200 font-sans leading-relaxed">
              {result}
            </pre>
          </Card>
        )}

        {context && (
          <Card className="space-y-4 p-6 bg-[#111827] border border-slate-800 rounded-3xl">
            <h2 className="text-xl font-semibold text-slate-300">Retrieved Report Sources</h2>
            <pre className="whitespace-pre-wrap break-words text-slate-400 text-sm font-mono leading-relaxed">
              {context}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RagBotPage;
