// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";

// const API = "http://127.0.0.1:8001/users";

// function App() {
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//     role: "analyste",
//   });
//   const [token, setToken] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLogin, setIsLogin] = useState(true);
//   const [users, setUsers] = useState([]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     const url = isLogin ? `${API}/login/` : `${API}/register/`;
//     try {
//       const res = await axios.post(url, form);
//       if (isLogin) {
//         setToken(res.data.access);
//         setUserRole(res.data.role);
//         setMessage("✅ Connecté !");
//       } else {
//         setMessage("✅ Utilisateur créé !");
//       }
//     } catch (err) {
//       setMessage("❌ " + (err.response?.data?.detail || "Erreur"));
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${API}/users/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(res.data);
//     } catch {
//       setMessage("❌ Impossible d'afficher les utilisateurs.");
//     }
//   };

//   const deleteUser = async (id) => {
//     try {
//       await axios.delete(`${API}/users/${id}/delete/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setMessage("🗑 Utilisateur supprimé");
//       fetchUsers();
//     } catch {
//       setMessage("❌ Erreur lors de la suppression.");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <h2>{isLogin ? "Connexion" : "Créer un compte"}</h2>

//         <input
//           name="username"
//           placeholder="Nom d'utilisateur"
//           onChange={handleChange}
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Mot de passe"
//           onChange={handleChange}
//         />
//         {!isLogin && (
//           <select name="role" onChange={handleChange}>
//             <option value="analyste">Analyste</option>
//             <option value="admin">Admin</option>
//           </select>
//         )}

//         <button onClick={handleSubmit}>
//           {isLogin ? "Se connecter" : "Créer un compte"}
//         </button>

//         {message && <p className="message">{message}</p>}

//         {token && (
//           <div className="token-block">
//             <p>
//               <strong>Rôle :</strong> {userRole}
//             </p>
//             <p>
//               <strong>Token :</strong>
//               <br />
//               <span className="token">{token}</span>
//             </p>
//           </div>
//         )}

//         <div className="switch">
//           <button onClick={() => setIsLogin(!isLogin)}>
//             {isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter"}
//           </button>
//         </div>
//       </div>

//       {/* ADMIN PANEL */}
//       {userRole === "admin" && token && (
//         <div className="card" style={{ marginTop: 30 }}>
//           <h3>👑 Admin - Liste des utilisateurs</h3>
//           <button onClick={fetchUsers}>Afficher les utilisateurs</button>
//           <ul style={{ marginTop: 15 }}>
//             {users.map((user) => (
//               <li key={user.id} style={{ marginBottom: 10 }}>
//                 {user.username} ({user.role})
//                 <button
//                   style={{ marginLeft: 10, color: "red", cursor: "pointer" }}
//                   onClick={() => deleteUser(user.id)}
//                 >
//                   Supprimer
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8001/users";

function App() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "analyste",
  });
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState({}); // stocke les nouveaux emails

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const url = isLogin ? `${API}/login/` : `${API}/register/`;
    try {
      const res = await axios.post(url, form);
      if (isLogin) {
        setToken(res.data.access);
        setUserRole(res.data.role);
        setMessage("✅ Connecté !");
      } else {
        setMessage("✅ Utilisateur créé !");
      }
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.detail || "Erreur"));
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setEmails(
        res.data.reduce((acc, user) => {
          acc[user.id] = user.email || "";
          return acc;
        }, {})
      );
    } catch {
      setMessage("❌ Impossible d'afficher les utilisateurs.");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/users/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑 Utilisateur supprimé");
      fetchUsers();
    } catch {
      setMessage("❌ Erreur lors de la suppression.");
    }
  };

  const updateEmail = async (id) => {
    try {
      await axios.put(
        `${API}/users/${id}/`,
        { email: emails[id], username: emails[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✏️ Email mis à jour !");
      fetchUsers();
    } catch {
      setMessage("❌ Erreur lors de la mise à jour.");
    }
  };

  const handleEmailChange = (id, value) => {
    setEmails({ ...emails, [id]: value });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{isLogin ? "Connexion" : "Créer un compte"}</h2>

        <input
          name="username"
          placeholder="Nom d'utilisateur"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
        />
        {!isLogin && (
          <select name="role" onChange={handleChange}>
            <option value="analyste">Analyste</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <button onClick={handleSubmit}>
          {isLogin ? "Se connecter" : "Créer un compte"}
        </button>

        {message && <p className="message">{message}</p>}

        {token && (
          <div className="token-block">
            <p>
              <strong>Rôle :</strong> {userRole}
            </p>
            <p>
              <strong>Token :</strong>
              <br />
              <span className="token">{token}</span>
            </p>
          </div>
        )}

        <div className="switch">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter"}
          </button>
        </div>
      </div>

      {userRole === "admin" && token && (
        <div className="card" style={{ marginTop: 30 }}>
          <h3>👑 Admin - Liste des utilisateurs</h3>
          <button onClick={fetchUsers}>Afficher les utilisateurs</button>
          {message && <p className="message">{message}</p>}
          <ul style={{ marginTop: 15 }}>
            {users.map((user) => (
              <li key={user.id} style={{ marginBottom: 15 }}>
                <div>
                  <strong>{user.username}</strong> ({user.role})
                </div>
                <input
                  type="email"
                  value={emails[user.id] || ""}
                  onChange={(e) => handleEmailChange(user.id, e.target.value)}
                  placeholder="Email"
                  style={{ marginTop: 5, width: "100%", padding: "5px" }}
                />
                <div style={{ marginTop: 5 }}>
                  <button
                    onClick={() => updateEmail(user.id)}
                    style={{
                      marginRight: 10,
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
