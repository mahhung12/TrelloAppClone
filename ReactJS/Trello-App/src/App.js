import AppBard from './components/AppBar/AppBar'
import BoardBard from './components/BoardBard/BoardBard';
import BoardContent from './components/BoardContent/BoardContent';
import './App.scss'

function App() {
  return (
    <div className="Trello-Container">
      <AppBard />
      <BoardBard />
      <BoardContent />
    </div>
  );
}

export default App;
