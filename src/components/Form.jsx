import React, { useState, useEffect } from "react";
import axios from "axios";
import upload from "../assets/Section Title.png";
// import { Link } from "react-router-dom";

import { Image, CloudinaryContext } from "cloudinary-react";

const Form = () => {
  const [step, setStep] = useState(1); // Track current step
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [ticket, setTicket] = useState(null);
  const [errors, setErrors] = useState({});

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("fullName");
    const savedEmail = localStorage.getItem("email");
    const savedAvatar = localStorage.getItem("avatarUrl");

    if (savedName) setFullName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const validationErrors = {};
    if (!fullName.trim()) validationErrors.fullName = "Full Name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      validationErrors.email = "Valid Email is required";
    if (!avatar) validationErrors.avatar = "Avatar is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", avatar);
    formData.append("upload_preset", "Stage 2 HNG"); 

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dsloeycie/image/upload", 
        formData
      );
      const imageUrl = response.data.secure_url;

      // Save data to localStorage
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("email", email);
      localStorage.setItem("avatarUrl", imageUrl);


      setTicket({ fullName, email, avatarUrl: imageUrl });
      setErrors({});
      setStep(3);
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors({ avatar: "Failed to upload image" });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setErrors({ ...errors, avatar: "" });
    }
  };

  return (
    <div className="container">
      {/* Step 1: Attendee Details */}
      {step === 1 && (
        <div className="step">
          <h2>Attendee Details</h2>
          {/* <p className="step-indicator">Step 1/3</p> */}
          <form onSubmit={handleSubmit}>
            <span id="profile">Upload Profile Photo</span>
            <div className="upload">
              <label htmlFor="avatar">
                <img src={upload} alt="" />
              </label>
              <input
                type="file"
                id="avatar"
                hidden
                onChange={handleFileChange}
                aria-describedby="avatarError"
                accept="image/*"
                required
              />
              {errors.avatar && (
                <span id="avatarError" className="error">
                  {errors.avatar}
                </span>
              )}
            </div>

            <div className="groups">
              <div className="form-group">
                <label htmlFor="fullName">Enter your name:</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-describedby="fullNameError"
                  required
                />
                {errors.fullName && (
                  <span id="fullNameError" className="error">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Enter your email*</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="hello@avioflagos.io"
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="emailError"
                  required
                />
                {errors.email && (
                  <span id="emailError" className="error">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="next-button">
              Generate Ticket
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Ticket Display */}
      {step === 3 && ticket && (
        <div className="step2">
          <div className="confirmation">
            <span id="head">Your Ticket is Booked! </span>
            <span>Check your email for a copy or you can download</span>
          </div>
          {/* <p className="step-indicator">Step 2/2</p> */}
          <div className="ticket">
            <CloudinaryContext cloudName="dsloeycie">
              {" "}
              <Image
                publicId={ticket.avatarUrl}
                width="150"
                height="150"
                crop="scale"
              />
            </CloudinaryContext>
            <div>
              <p>
                <strong>Name:</strong> {ticket.fullName}
              </p>
              <p>
                <strong>Email:</strong> {ticket.email}
              </p>
            </div>
          </div>
          {/* <Link to="/" className="next-button link">Book Another Ticket</Link> */}
        </div>
      )}
    </div>
  );
};

export default Form;
