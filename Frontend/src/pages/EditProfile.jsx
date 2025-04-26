import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditProfile = () => {
  const { currentUser } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("🌿 Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[url('/bamboo-bg.png')] bg-cover bg-no-repeat backdrop-blur-md px-4 py-10">
      <div className="bg-white/90 w-full max-w-lg p-10 rounded-3xl shadow-2xl shadow-green-300 transition-transform duration-500 hover:scale-[1.015] border-2 border-green-200">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-green-900">🍀 Edit Profile</h2>

        {success && <p className="text-green-700 mb-4 text-center text-lg font-semibold">{success}</p>}
        {error && <p className="text-red-600 mb-4 text-center text-lg font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 text-lg">
          <div>
            <Label htmlFor="name" className="text-green-900 font-semibold text-lg">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="shadow-md text-lg focus:ring-2 focus:ring-green-400 text-green-800"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-green-900 font-semibold text-lg">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow-md text-lg focus:ring-2 focus:ring-green-400 text-green-800"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-bold rounded-2xl transition duration-200"
            disabled={loading}
          >
            {loading ? "🌿 Updating..." : "✅ Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
