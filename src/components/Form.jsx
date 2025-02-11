import  { useState, useEffect } from "react";
import localforage from "localforage";


const Form = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load persisted data from IndexedDB on component mount
  useEffect(() => {
    localforage.getItem("formData").then((data) => {
      if (data) {
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setAvatarUrl(data.avatarUrl || "");
      }
    });
  }, []);

  // Persist form data to IndexedDB on change
  useEffect(() => {
    localforage.setItem("formData", { fullName, email, avatarUrl });
  }, [fullName, email, avatarUrl]);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = "Full Name is required.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Valid Email is required.";
    }
    if (!avatarUrl || !/^https?:\/\/.+/.test(avatarUrl)) {
      newErrors.avatarUrl = "Valid Avatar URL is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setTicket({ fullName, email, avatarUrl });
      setIsModalOpen(true); // Open the modal
    }
  };

  const closeModal = (e) => {
    // Close the modal only if the click is outside the modal content
    if (e.target.classList.contains("modal-overlay")) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container">
      <h1>Conference Registration</h1>
      <form onSubmit={handleSubmit} aria-label="Conference Registration Form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            aria-invalid={!!errors.fullName}
            aria-describedby="fullNameError"
          />
          {errors.fullName && (
            <span id="fullNameError" className="error">{errors.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby="emailError"
          />
          {errors.email && (
            <span id="emailError" className="error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="avatarUrl">Avatar URL:</label>
          <input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            aria-invalid={!!errors.avatarUrl}
            aria-describedby="avatarUrlError"
            placeholder="Paste any image link from the web"
          />
          {errors.avatarUrl && (
            <span id="avatarUrlError" className="error">{errors.avatarUrl}</span>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>

      {/* Ticket Popup */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <h2>Conference Ticket</h2>
            <p>Full Name: {ticket.fullName}</p>
            <p>Email: {ticket.email}</p>
            <img src={ticket.avatarUrl} alt="User Avatar" onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} />

          </div>
        </div>
      )}
    </div>
  );
};

export default Form;