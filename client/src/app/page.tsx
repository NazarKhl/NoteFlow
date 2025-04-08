"use backend.java.src.main.java.com.project.java.client"
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8080/hello")
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h1>Next.js + Spring Boot</h1>
      <p>{message}</p>
    </div>
  );
}
