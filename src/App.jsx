import { useState, useEffect } from "react";

const API_URL = "https://www.raydelto.org/agenda.php";

// ─────────────────────────────────────────
// Componente: ContactForm
// ─────────────────────────────────────────
function ContactForm({ onContactAdded }) {
  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "" });
  const [status, setStatus] = useState(null); // { type: "ok"|"err", msg }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error del servidor");
      setStatus({ type: "ok", msg: "Contacto guardado correctamente." });
      setForm({ nombre: "", apellido: "", telefono: "" });
      onContactAdded();
    } catch (err) {
      setStatus({ type: "err", msg: "No se pudo guardar: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d8cdb8",
    borderRadius: 2,
    fontFamily: "inherit",
    fontSize: "1rem",
    background: "#fffefb",
    color: "#2b2420",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#7a7060",
    marginBottom: 5,
    fontFamily: "'Courier New', monospace",
  };

  return (
    <div style={cardStyle}>
      <h2 style={sectionTitleStyle}>Agregar contacto</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
          <div>
            <label style={labelStyle} htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={form.nombre}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              required
              value={form.apellido}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              value={form.telefono}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "12px 20px",
            background: loading ? "#c9bda4" : "#b5502f",
            color: "#fff8ee",
            border: "none",
            borderRadius: 2,
            fontFamily: "inherit",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            letterSpacing: "0.5px",
          }}
        >
          {loading ? "Guardando..." : "Guardar contacto"}
        </button>

        {status && (
          <p
            style={{
              marginTop: 10,
              fontSize: "0.85rem",
              color: status.type === "ok" ? "#5d6b4f" : "#8c3c22",
            }}
          >
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
}

// ─────────────────────────────────────────
// Componente: ContactList
// ─────────────────────────────────────────
function ContactList({ contactos, loading, error }) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = contactos.filter((c) => {
    const term = busqueda.toLowerCase();
    return (
      (c.nombre || "").toLowerCase().includes(term) ||
      (c.apellido || "").toLowerCase().includes(term) ||
      (c.telefono || "").toLowerCase().includes(term)
    );
  });

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <h2 style={{ ...sectionTitleStyle, margin: 0 }}>Contactos guardados</h2>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.75rem", color: "#7a7060" }}>
          {loading ? "..." : `${filtrados.length} contacto${filtrados.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, apellido o teléfono..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1px solid #d8cdb8",
          borderRadius: 2,
          fontFamily: "inherit",
          fontSize: "0.95rem",
          marginBottom: 16,
          background: "#fffefb",
          color: "#2b2420",
          outline: "none",
        }}
      />

      {loading && <p style={mutedStyle}>Cargando contactos...</p>}
      {error && <p style={{ ...mutedStyle, color: "#8c3c22" }}>{error}</p>}

      {!loading && !error && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid #d8cdb8" }}>
          {filtrados.length === 0 ? (
            <li style={{ ...mutedStyle, fontStyle: "italic", padding: "28px 4px" }}>
              No hay contactos que coincidan.
            </li>
          ) : (
            filtrados.map((c, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 4px",
                  borderBottom: "1px solid #d8cdb8",
                }}
              >
                <span style={{ fontWeight: 600, color: "#2b2420" }}>
                  {((c.nombre || "") + " " + (c.apellido || "")).trim() || "(sin nombre)"}
                </span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.88rem",
                    color: "#b5502f",
                    marginLeft: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.telefono || "—"}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Componente padre: App
// ─────────────────────────────────────────
export default function App() {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarContactos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener los contactos");
      const data = await res.json();
      setContactos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudo cargar la agenda: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f1e7",
        fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
        color: "#2b2420",
        padding: "0 0 80px",
      }}
    >
      {/* Header */}
      <header
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "48px 24px 18px",
          borderBottom: "3px solid #2b2420",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 0,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2.1rem", fontWeight: 700, letterSpacing: "0.5px" }}>
          Mi Agenda
        </h1>
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "#8c3c22",
          }}
        >
          React
        </span>
      </header>

      {/* Contenido */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 0" }}>
        <ContactForm onContactAdded={cargarContactos} />
        <ContactList contactos={contactos} loading={loading} error={error} />
      </main>

      <footer
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#9a8f78",
          marginTop: 40,
        }}
      >
        Agenda conectada a raydelto.org/agenda.php
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────
// Estilos compartidos
// ─────────────────────────────────────────
const cardStyle = {
  background: "#fffdf8",
  border: "1px solid #d8cdb8",
  borderRadius: 2,
  padding: 24,
  marginBottom: 36,
  boxShadow: "0 1px 0 #d8cdb8",
};

const sectionTitleStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: "#5d6b4f",
  margin: "0 0 18px",
};

const mutedStyle = {
  color: "#7a7060",
  textAlign: "center",
  padding: "20px 4px",
  margin: 0,
};
