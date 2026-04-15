export default function VerifySuccessPage() {
  return (
    <div className="pageShell">
      <div className="appContainer">

        <div className="sectionCard" style={{ textAlign: 'center', padding: 40 }}>

          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>

          <h2 style={{ fontSize: 24, marginBottom: 12 }}>
            Email verified successfully
          </h2>

          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Your account is now active. You can log in and start using Remindly.
          </p>

          <a href="/login" className="button">
            Go to Login
          </a>

        </div>

      </div>
    </div>
  );
}