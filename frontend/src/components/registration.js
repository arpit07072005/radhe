import { useState, useRef } from "react";
import styles from "../register.module.css";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullname: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); 
  const fileInputRef = useRef(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);  
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    if (imageFile) {
      console.log("Image File:", imageFile.name);
    }

    const form = new FormData();
    form.append("fullName", formData.fullname);
    form.append("email", formData.email);
    form.append("username", formData.username);
    form.append("password", formData.password);

    if (imageFile) {
      form.append("avatar", imageFile);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register", form);
      console.log("Registration successful:", response.data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Player Registration</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fullname" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={styles.input}
              placeholder="Arpit Pandey"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="Arpit123"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Arpit@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="•••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Profile Image</label>
            <div className={styles.imageUpload}>
              <div
                className={styles.imagePreview}
                onClick={() => fileInputRef.current?.click()}
                style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : "none" }}
              >
                {!imagePreview && <span>Upload Avatar</span>}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className={styles.fileInput}
              />
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Join The Game
          </button>
        </form>
        <p className={styles.login}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
