// Error boundary component for graceful error handling
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // In production, you might want to send error to logging service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Implement error logging service integration here
    // For example, send to Firebase Analytics, Sentry, etc.
    try {
      fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '40px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>
              😕
            </div>
            
            <h2 style={{ 
              color: '#d32f2f', 
              marginBottom: '16px',
              fontSize: '24px'
            }}>
              Oops! Something went wrong
            </h2>
            
            <p style={{ 
              color: '#666', 
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginRight: '12px'
                }}
              >
                🔄 Reload App
              </button>
              
              <button
                onClick={() => window.history.back()}
                style={{
                  backgroundColor: '#757575',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ← Go Back
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details style={{
                textAlign: 'left',
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '4px',
                marginTop: '20px'
              }}>
                <summary style={{ 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  Error Details (Development Mode)
                </summary>
                <pre style={{
                  fontSize: '12px',
                  color: '#d32f2f',
                  overflow: 'auto',
                  margin: 0
                }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <p style={{
              fontSize: '14px',
              color: '#999',
              marginTop: '20px'
            }}>
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;