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

    // Check token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token is missing. Please login again.");
      setLoading(false);
      return;
    }
    console.log("Token from localStorage:", token);

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

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#dbeafe] via-[#e0f2fe] to-[#f0f9ff] py-10 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl shadow-sky-100/50 transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Edit Profile</h2>

        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="shadow-sm focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow-sm focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
