import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hi there"]);
  const webRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    webRef.current = ws;
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };
  }, []);

  return (
    <div className="h-screen bg-black">
      <div className="h-[95vh]">
        {messages.map((message) => (
          <div className="text-cyan-50">{message}</div>
        ))}
      </div>
      <div className="w-full bg-white flex">
        <input id="message" type="text" className="flex-1 p-4" />
        <button
          onClick={() => {
            const message = document.getElementById("message")?.value;
            webRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                },
              })
            );
          }}
          className="bg-purple-600 text-white p-4"
        ></button>
      </div>
    </div>
  );
}

export default App;
