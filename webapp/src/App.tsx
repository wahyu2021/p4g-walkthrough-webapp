import { Button } from './components/atoms/Button';

function App() {
  return (
    <div className="min-h-screen bg-p4-gray flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8 text-p4-yellow tracking-wider" style={{ textShadow: '2px 2px 0 #111' }}>
        P4G Walkthrough
      </h1>
      <Button onClick={() => alert('Persona 4 Golden Setup Complete!')}>
        TEST BUTTON
      </Button>
    </div>
  )
}

export default App
