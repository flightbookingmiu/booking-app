// src/components/SignupModal.tsx
import React, { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const avatarFile = formData.get('avatar') as File;

    // Upload avatar to a file storage service (e.g., Cloudinary, AWS S3)
    let avatarUrl = '';
    if (avatarFile) {
      const uploadData = new FormData();
      uploadData.append('file', avatarFile);
      uploadData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

      const uploadResponse = await fetch(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
        {
          method: 'POST',
          body: uploadData,
        }
      );
      const uploadResult = await uploadResponse.json();
      avatarUrl = uploadResult.secure_url;
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, address, avatar: avatarUrl }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Signup successful!');
      onClose(); // Close the modal
    } else {
      alert(data.error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Sign Up</h3>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" name="name" placeholder="Name" className="mb-4 p-2 w-full border rounded" required />
          <input type="email" name="email" placeholder="Email" className="mb-4 p-2 w-full border rounded" required />
          <input type="password" name="password" placeholder="Password" className="mb-4 p-2 w-full border rounded" required />
          <input type="text" name="phone" placeholder="Phone" className="mb-4 p-2 w-full border rounded" required />
          <input type="text" name="address" placeholder="Address" className="mb-4 p-2 w-full border rounded" required />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <input type="file" name="avatar" accept="image/*" onChange={handleAvatarChange} className="w-full p-2 border rounded" />
            {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="mt-2 w-20 h-20 rounded-full" />}
          </div>
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Sign Up</button>
        </form>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Close</button>
      </div>
    </div>
  );
};

export default SignupModal;