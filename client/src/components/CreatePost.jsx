import React, { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [codeFile, setCodeFile] = useState(null);
  const [images, setImages] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 4) {
      alert("You can only upload up to 4 images!");
      return;
    }
    setImages(selectedFiles);
  };

  const handleCodeFileChange = (e) => {
    setCodeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codeFile) {
      alert("Please upload a code file.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("file", codeFile);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${API_URL}/api/posts/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Post created successfully!");
        setContent("");
        setCodeFile(null);
        setImages([]);
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Network error.");
    }
  };

  return (
    <div className="bg-black px-4 md:px-20 py-6 min-h-screen">
      <h2 className="text-xl text-white font-semibold mb-4">Create a Snippet</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row bg-zinc-900 shadow rounded-lg p-6 gap-6"
      >
        {/* Upload Images */}
        <label className="w-full md:w-1/2 flex flex-col items-center justify-center border border-gray-600 rounded-md p-4 cursor-pointer hover:bg-zinc-800 transition">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="text-4xl mb-2">⬆️</div>
          <p className="text-white text-sm">Choose up to 4 images</p>
          <p className="text-xs mt-2 text-gray-400 text-center">
            High quality JPG/PNG/WebP files recommended
          </p>
        </label>

        {/* Form Section */}
        <div className="w-full md:w-1/2 space-y-4">
          <input
            type="text"
            placeholder="Add a title or content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-600 bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none"
          />

          <label className="block">
            <input
              type="file"
              accept=".js, .py, .txt, .md"
              onChange={handleCodeFileChange}
              className="w-full border border-gray-600 bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none"
            />
            <div className="mt-1">
              <p className="text-sm text-white">Add a code file</p>
              <p className="text-sm text-gray-400">
                Accepted formats: .js, .py, .txt, .md
              </p>
            </div>
          </label>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setContent("");
                setCodeFile(null);
                setImages([]);
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
