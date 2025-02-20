// app/page.js
export default function Home() {
  return (
    <div>
      <h1>Catálogo de Fornecedores</h1>
      <p>Bem-vindo ao catálogo de fornecedores.</p>
    </div>
  );
  }

// app/cadastro/page.js
"use client";
import { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextField, Button, Checkbox, FormControlLabel, Container } from "@mui/material";

export default function CadastroCatalogo() {
  const [nome, setNome] = useState("");
  const [file, setFile] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [destaque, setDestaque] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let fileURL = "";
      if (file) {
        const storageRef = ref(storage, `catalogos/${file.name}`);
        await uploadBytes(storageRef, file);
        fileURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "catalogos"), {
        nome,
        categoria,
        destaque,
        fileURL,
        timestamp: serverTimestamp(),
      });

      setNome("");
      setFile(null);
      setCategoria("");
      setDestaque(false);
    } catch (error) {
      console.error("Erro ao cadastrar catálogo", error);
    }
  };

  return (
    <Container>
      <h1>Cadastro de Catálogo</h1>
      <form onSubmit={handleSubmit}>
        <TextField label="Nome" fullWidth value={nome} onChange={(e) => setNome(e.target.value)} required />
        <TextField label="Categoria" fullWidth value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <FormControlLabel
          control={<Checkbox checked={destaque} onChange={(e) => setDestaque(e.target.checked)} />}
          label="Destaque"
        />
        <Button type="submit" variant="contained" color="primary">
          Cadastrar
        </Button>
      </form>
    </Container>
  );
}
