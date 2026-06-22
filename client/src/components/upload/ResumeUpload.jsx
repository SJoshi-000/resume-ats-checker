import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../common/GlassCard";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

const FILE_ICONS = {
  "application/pdf": { label: "PDF", color: "#f43f5e" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { label: "DOCX", color: "#6366f1" },
  "text/plain": { label: "TXT", color: "#10b981" },
};

/**
 * Drag-and-drop resume upload zone with animated visual states and accessibility.
 */
export default function ResumeUpload({ file, onFileChange }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: 5 * 1024 * 1024,
      maxFiles: 1,
      multiple: false,
    });

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileInfo = (f) => {
    const info = FILE_ICONS[f.type];
    if (info) return info;
    // Fallback by extension
    const ext = f.name.split(".").pop().toLowerCase();
    if (ext === "pdf") return FILE_ICONS["application/pdf"];
    if (ext === "docx") return FILE_ICONS["application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    return FILE_ICONS["text/plain"];
  };

  return (
    <GlassCard className="h-full">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider" id="upload-label">
          Upload Resume
        </h2>
      </div>

      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        id="dropzone"
        role="button"
        aria-label="Upload resume file. Drag and drop or click to browse. Accepts PDF, DOCX, and TXT files up to 5 MB."
        aria-labelledby="upload-label"
        aria-describedby="upload-hint"
        tabIndex={0}
        className={`
          relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed
          transition-all duration-300 cursor-pointer min-h-[200px] overflow-hidden
          ${isDragActive
            ? "border-indigo-400/60 bg-indigo-500/[0.06]"
            : file
            ? "border-emerald-500/30 bg-emerald-500/[0.03]"
            : "border-white/[0.08] hover:border-white/[0.15] bg-white/[0.01] hover:bg-white/[0.02]"
          }
        `}
        animate={isDragActive ? {
          scale: 1.02,
          boxShadow: "0 0 40px -10px rgba(99, 102, 241, 0.3)",
        } : {
          scale: 1,
          boxShadow: "0 0 0px 0px rgba(99, 102, 241, 0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Animated border glow during drag */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Pulsing ring during drag */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-4 rounded-xl border-2 border-indigo-400/20 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <input {...getInputProps()} id="resume-file-input" aria-hidden="true" />

        <AnimatePresence mode="wait">
          {file ? (
            /* ── File accepted ── */
            <motion.div
              key="file-accepted"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-3 text-center relative z-10"
            >
              {/* Checkmark burst animation */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
              >
                {/* File type badge */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold relative"
                  style={{
                    backgroundColor: `${getFileInfo(file).color}15`,
                    color: getFileInfo(file).color,
                  }}
                >
                  {getFileInfo(file).label}
                  {/* Success check overlay */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 600 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              <div>
                <p className="text-white font-medium text-sm truncate max-w-[220px]">
                  {file.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {formatSize(file.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null);
                }}
                className="text-xs text-gray-500 hover:text-rose-400 transition-colors underline underline-offset-2"
                aria-label={`Remove file ${file.name}`}
              >
                Remove file
              </button>
            </motion.div>
          ) : (
            /* ── Empty state ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-center relative z-10"
            >
              <motion.div
                className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center"
                animate={isDragActive ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </motion.div>

              <div>
                <p className="text-gray-300 text-sm font-medium">
                  {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                </p>
                <p className="text-gray-500 text-xs mt-1" id="upload-hint">
                  or click to browse · PDF, DOCX, TXT (max 5 MB)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Rejection error */}
      <AnimatePresence>
        {fileRejections.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs text-rose-400 text-center"
            role="alert"
          >
            Invalid file. Please upload a PDF, DOCX, or TXT file under 5 MB.
          </motion.p>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
