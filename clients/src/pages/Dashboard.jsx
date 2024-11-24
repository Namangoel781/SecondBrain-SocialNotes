import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/Slidbar";
import Header from "../components/Header";
import BentoGridNotes from "../components/BentoGridNotes";
import ShareModal from "../components/Modal";
import AddContentModal from "../components/AddContent";
import API from "../api/api";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import FetchUserSharedContent from "@/components/FetchUserSharedContent";
import usePagination from "../context/usePagination";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Success message state
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState("tweets");
  const [isSharedContentModalOpen, setIsSharedContentModalOpen] =
    useState(false);

  const itemsPerPage = 6;
  const {
    paginatedItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(notes, itemsPerPage);

  const fetchNotes = async () => {
    try {
      const response = await API.get("/content");
      const notesData = Array.isArray(response.data.Content)
        ? response.data.Content
        : [];
      if (notesData.length === 0) {
        setError("No valid notes available.");
      } else {
        const normalizedNotes = notesData.map((note) => ({
          ...note,
          id: note._id, // Use `_id` as unique ID
          title: note.title || "Untitled",
          tags: Array.isArray(note.tags) ? note.tags : [],
          date: note.date || "No Date",
        }));
        setNotes(normalizedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(error.response?.data?.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (contentData) => {
    const validTypes = ["video", "article", "image", "tweets"]; // Ensure correct types
    if (!validTypes.includes(contentData.type)) {
      setError(
        `Invalid type: ${contentData.type}. Please select a valid type.`
      );
      return;
    }

    if (!Array.isArray(contentData.tags) || contentData.tags.length === 0) {
      setError("Tags should be an array and cannot be empty.");
      return;
    }

    console.log("Sending contentData:", contentData);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to perform this action.");
      return;
    }

    try {
      const response = await API.post("/content", contentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedContent = response.data.content;
      setNotes((prevNotes) => [...prevNotes, savedContent]);
      setSuccess("Content added successfully!"); // Set success message
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding content:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add content. Please try again."
      );
    }
  };

  const deleteNote = async (contentId) => {
    try {
      await API.delete(`/content/${contentId}`);
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== contentId)
      );
      setSuccess("Content deleted successfully!"); // Set success message
    } catch (error) {
      console.error("Error deleting note:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete note. Please try again."
      );
    }
  };

  const handleShare = (note) => {
    if (note && note.id) {
      setSelectedNote(note);
      setIsShareModalOpen(true);
    } else {
      setError("Selected note is invalid.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="flex-1 overflow-auto">
        <Header
          onShareClick={() => setIsShareModalOpen(true)}
          onAddClick={() => setIsAddModalOpen(true)}
        />
        <div className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {activeTab === "tweets" ? (
            <>
              <BentoGridNotes
                notes={paginatedItems}
                onDelete={deleteNote}
                onShare={handleShare}
              />
            </>
          ) : activeTab === "shared" ? (
            <FetchUserSharedContent />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No content available for this tab.</p>
            </div>
          )}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddContent={addContent}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        content={selectedNote} // Pass the selected note to ShareModal
      />
    </div>
  );
};

export default Dashboard;
