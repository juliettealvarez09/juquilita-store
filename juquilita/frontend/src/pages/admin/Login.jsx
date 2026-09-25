import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login(email, password);
      localStorage.setItem('token', result.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>JUQUILITA</h1>
        <p className="login-subtitle">Administración</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          <div className="input-group">
            <label>Correo</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@juquilita.com" />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
