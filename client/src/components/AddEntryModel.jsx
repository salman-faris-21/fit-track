import { X } from "lucide-react";
import { useState } from "react";

const AddEntryModal = ({ isOpen, onClose, title, unit, onSubmit, loading }) => {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!value) return;
    onSubmit(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Add Today’s {title}
          </h2>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-slate-200" />
          </button>
        </div>

        {/* Input */}
        <label className="block text-sm text-slate-400 mb-2">
          Value ({unit})
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-900 font-medium hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEntryModal;
