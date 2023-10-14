import React, { useEffect, useState } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from 'react-use-clipboard';
import Webcam from 'react-webcam';

const App = () => {
  const [textToCopy, setTextToCopy] = useState('');
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });
  const [userInput, setUserInput] = useState('');
  const [accuracy, setAccuracy] = useState(null);
  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const stopListening = () => SpeechRecognition.stopListening();
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const handleSave = () => {
    setTextToCopy(userInput);
  };

  const handleSubmit = () => {
    // Calculate accuracy percentage
    const originalWords = userInput
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(' ');

    const recordedWords = transcript
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(' ');

    const correctWords = [];
    const missedWords = [];

    for (let i = 0; i < originalWords.length; i++) {
      if (i < recordedWords.length && originalWords[i] === recordedWords[i]) {
        correctWords.push(originalWords[i]);
      } else {
        missedWords.push(originalWords[i]);
      }
    }

    const accuracyPercentage = (correctWords.length / originalWords.length) * 100;

    if (accuracyPercentage === 100) {
      setAccuracy('Congrats, you said the words perfectly!');
    } else {
      setAccuracy(`Accuracy = ${accuracyPercentage.toFixed(2)}%, here are the words you missed: ${missedWords.join(', ')}`);
    }
  };

  useEffect(() => {
    setAccuracy(null); // Clear accuracy when starting to listen again
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="container">
      <h2>Literacy.AI - Fluency at your fingertips.</h2>
      <h3>Using the power of AI facial and speech recognition to empower learners around the world.</h3>
      <div className="flex-container">
        <div className="main-content" onClick={() => setTextToCopy(transcript)}>
          <Webcam audio={false} width={320} height={240} screenshotFormat="image/jpeg" />
        </div>
        <div className="main-content">
          <textarea
            placeholder="Enter text for the user to read here"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>
        <div className="main-content">
          {transcript}
        </div>
      </div>
      <div className="btn-style">
        <button onClick={startListening}>Start Listening</button>
        <button onClick={stopListening}>Stop Listening</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleSubmit}>Submit</button>
        <select>
          <option value="en-IN">English</option>
          <option value="en-ES">Spanish</option>
        </select>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{accuracy}</div>
    </div>
  );
};

export default App;
