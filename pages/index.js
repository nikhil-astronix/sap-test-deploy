export default function Home() {
    const handleLogin = (provider) => {
      // Your backend handles this and redirects to Cognito Hosted UI
      window.location.href = `http://localhost:3000/auth/login?provider=${provider}`;
    };
  
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>Login with SSO</h1>
        <button onClick={() => handleLogin('Google')} style={{ marginRight: '1rem' }}>
          Login with Google
        </button>
        <button onClick={() => handleLogin('MicrosoftOIDC')}>
          Login with Microsoft
        </button>
        <button onClick={() => window.location.href = 'http://localhost:3000/auth/logout'}>
          Logout
        </button>
      </div>
    );
  }
  