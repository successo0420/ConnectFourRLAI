import React from 'react';

// Simple title component with cyberpunk styling
export const Title = () => (
  <h1 style={styles.title}>
    CONNECT-4
  </h1>
);

const styles = {
  title: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#00ffff',
    textShadow: '0 0 20px #00ffff, 0 0 40px #ff00ff',
    letterSpacing: '4px',
    animation: 'glow 2s ease-in-out infinite'
  }
};