import { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import ChatPage from './pages/ChatPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleSelectScenario = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setCurrentPage('chat');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    setSelectedScenario(null);
  };

  if (currentPage === 'chat' && selectedScenario) {
    return (
      <ChatPage
        scenarioId={selectedScenario}
        onBack={handleBackHome}
      />
    );
  }

  return <HomePage onSelectScenario={handleSelectScenario} />;
}

export default App;
