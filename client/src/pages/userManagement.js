import React, { useState, useEffect } from "react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../apiRoute/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "", address: "", phone: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => setError(`Failed to fetch users. ${error}`));
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        Object.values(user).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }, [search, users]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateUser(editId, form);
        setMessage("User updated successfully!");
      } else {
        await createUser(form);
        setMessage("User added successfully!");
      }
      setForm({ name: "", email: "", age: "", address: "", phone: "" });
      setEditId(null);
      setShowPopup(false);
      fetchUsers().then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      });
    } catch (error) {
      setError("Error saving user: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(confirmDelete);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== confirmDelete));
      setFilteredUsers((prevFiltered) => prevFiltered.filter((user) => user._id !== confirmDelete));
      setMessage("User deleted successfully!");
    } catch (error) {
      setError("Error deleting user: " + (error.response?.data?.message || error.message));
    }
    setConfirmDelete(null);
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditId(user._id);
    setShowPopup(true);
  };

  return (
    <div className="p-5 justify-center w-full max-w-4xl mx-auto relative">
      <h1 className="text-center text-2xl font-bold mb-4">User Management</h1>
      {message && <div className=" text-green-600 p-2 mb-2 text-center font-semibold">{message}</div>}
      {error && <div className="text-red-600 p-2 mb-2 text-center font-semibold">{error}</div>}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-grow"
        />
        <button onClick={() => setShowPopup(true)} className="bg-green-500 text-white py-2 px-4 font-semibold text-sm ml-2">
          Add User
        </button>
      </div>
      <div className="overflow-x-auto w-full max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #f1f1f1" }}>
        <table className="border w-full text-sm min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Age</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.age}</td>
                <td className="border p-2">{user.address}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2 text-center text-white font-semibold flex flex-col sm:flex-row justify-center gap-1">
                  <button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-800 p-2 m-1">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="bg-red-500 hover:bg-red-800 p-2 m-1">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold">{editId ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-2 border"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full p-2 border"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full p-2 border"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-2 border"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2"
                >
                  {editId ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {confirmDelete && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 text-white px-4 py-2">Cancel</button>
              <button onClick={confirmDeleteUser} className="bg-red-500 text-white px-4 py-2">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
