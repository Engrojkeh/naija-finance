import React, { useState } from 'react';
import './App.css';
import Auth from './Auth';
import Dashboard from './Dashboard'; // Import your new Dashboard!

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <main className={user ? "dashboard-main" : "auth-main"}>
        {/* The Logic: Show Auth if not logged in, show Dashboard if logged in */}
        {!user ? (
          <Auth onLogin={(userData) => setUser(userData)} />
        ) : (
          <Dashboard user={user} onLogout={() => setUser(null)} />
        )}
      </main>
    </div>
  );
}

export default App;