import { useEffect, useRef, useState } from "react";

export default function LiveCaptions({ stream, micOn, meetingId }) {
  const [caption, setCaption] = useState("");
  const recognitionRef = useRef(null);
  const hideTimerRef = useRef(null);

  const sendCaptionToServer = async (text) => {
  await fetch("http://localhost:5000/api/v1/captions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meetingId,        /*--------------------sdded---------------*/ 
      text
    })
  });
};

  useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech Recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognitionRef.current = recognition;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let liveText = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      liveText += event.results[i][0].transcript;
    }

    setCaption(liveText);
    sendCaptionToServer(liveText);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setCaption("");
    }, 5000);
  };

  recognition.onerror = (event) => {
    console.error("Speech error:", event.error);
  };

  return () => {
    recognition.stop();
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };
}, []);

useEffect(() => {
  if (!recognitionRef.current) return;

  try {
    if (micOn) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
      setCaption("");
    }
  } catch (err) {
    // Prevent "already started" error
    console.warn("SpeechRecognition state error");
  }
}, [micOn]);





  if (!caption) return null;

  return (
    <div style={captionBoxStyle}>
      <p>{caption}</p>
    </div>
  );
}

const captionBoxStyle = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "30%",
  textAlign: "center",
  background: "rgba(0,0,0,0.75)",
  color: "#fff",
  padding: "12px",
  fontSize: "18px",
  zIndex: 9999,
  borderRadius: "8px",
};
