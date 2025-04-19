import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export function Admin_login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [button, setButton] = useState("Login");

  async function handleLogin(e) {
    e.preventDefault();
    let response;
    try {
      setButton("Logging in...");
      response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, {
        email: email.toLowerCase(),
        password: password.toLowerCase()
      });
      if (response) {
        const token = response.data.token;
        localStorage.setItem("adminToken", "Bearer " + token);
        navigate("/dashboard");
      }
    } catch (err) {
      setButton("Login");
      if (err.response?.data?.msg) {
        alert(err.response.data.msg);
      } else {
        alert('Error while logging in..please try again later.');
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            {button}
          </button>
        </form>

        <div className="mt-6 bg-gray-100 p-4 rounded text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Demo Credentials</h3>
          <p><strong>Email:</strong> sanyam@gmail.com</p>
          <p><strong>Password:</strong> 12345</p>
        </div>
      </div>
    </div>
  );
}
