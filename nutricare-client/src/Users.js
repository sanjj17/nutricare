import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">All Submitted Users</h1>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Age</th>
            <th className="border px-3 py-2">Weight</th>
            <th className="border px-3 py-2">Gender</th>
            <th className="border px-3 py-2">Diabetes</th>
            <th className="border px-3 py-2">BP</th>
            <th className="border px-3 py-2">Cholesterol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{u.name}</td>
              <td className="border px-3 py-2">{u.age}</td>
              <td className="border px-3 py-2">{u.weight}</td>
              <td className="border px-3 py-2">{u.gender}</td>
              <td className="border px-3 py-2">{u.diabetes ? "Yes" : "No"}</td>
              <td className="border px-3 py-2">{u.bp ? "Yes" : "No"}</td>
              <td className="border px-3 py-2">{u.cholesterol ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
