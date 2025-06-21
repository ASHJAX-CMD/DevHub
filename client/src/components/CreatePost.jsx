import React, { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [codeFile, setCodeFile] = useState(null);
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState("YOUR_USER_ID_HERE"); // Replace this with actual logged-in user ID

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
     const res = await fetch("http://localhost:5000/api/posts/create", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // token stored on login
  },
  body: formData,
});
      const data = await res.json();

      if (res.ok) {
        alert("Post created successfully!");
        // reset form
        setContent("");
        setCodeFile(null);
        setImages([]);
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error.");
    }
  };

  return (
    <div className="px-20 py-6">
      <h2 className="text-xl font-semibold mb-4">Create a Snippet</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row bg-white shadow rounded-lg p-6 gap-6"
      >
        {/* Left: Upload Section */}
        <label className="cursor-pointer flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="text-4xl mb-2">⬆️</div>
          <p className="text-gray-700">Choose up to 4 images</p>
          <p className="text-xs mt-2 text-gray-500 text-center">
            High quality JPG/PNG/WebP files recommended
          </p>
        </label>

        {/* Right: Form Section */}
        <div className="w-full md:w-1/2 space-y-4">
          <input
            type="text"
            placeholder="Add a title or content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
          />

          <label>
            <input
              type="file"
              accept=".js, .py, .txt, .md"
              onChange={handleCodeFileChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            />
            <div>
              <p className="text-sm text-gray-700">Add a code file</p>
              <p className="text-sm text-gray-400">
                Accepted formats: .js, .py, .txt, .md
              </p>
            </div>
          </label>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
