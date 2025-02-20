// Instalar dependências necessárias antes de rodar o projeto:
// npm install next react firebase @mui/material @mui/icons-material

"use client";

import { useState } from 'react';
import { db, storage } from '../../firebase'; // Ajuste o caminho se necessário
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Checkbox, FormControlLabel, Container } from '@mui/material';

// O resto do código...


"use client";

import { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Checkbox, FormControlLabel, Container } from '@mui/material';

// Código do componente...


import { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Checkbox, FormControlLabel, Container } from '@mui/material';

export default function CadastroCatalogo() {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [tag, setTag] = useState('');
  const [destaque, setDestaque] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [capa, setCapa] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdf || !capa) return alert('Selecione um PDF e uma capa!');
    try {
      const pdfRef = ref(storage, `catalogos/${pdf.name}`);
      const capaRef = ref(storage, `capas/${capa.name}`);

      await uploadBytes(pdfRef, pdf);
      await uploadBytes(capaRef, capa);

      const pdfURL = await getDownloadURL(pdfRef);
      const capaURL = await getDownloadURL(capaRef);

      await addDoc(collection(db, 'catalogos'), {
        nome,
        data,
        tag,
        destaque,
        pdfURL,
        capaURL,
        createdAt: serverTimestamp(),
      });
      alert('Catálogo cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar catálogo:', error);
    }
  };

  return (
    <Container>
      <h2>Cadastro de Catálogo</h2>
      <form onSubmit={handleUpload}>
        <TextField label="Nome" fullWidth value={nome} onChange={(e) => setNome(e.target.value)} />
        <TextField label="Data" fullWidth type="date" InputLabelProps={{ shrink: true }} value={data} onChange={(e) => setData(e.target.value)} />
        <TextField label="Tag" fullWidth value={tag} onChange={(e) => setTag(e.target.value)} />
        <FormControlLabel control={<Checkbox checked={destaque} onChange={(e) => setDestaque(e.target.checked)} />} label="Destaque" />
        <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
        <input type="file" accept="image/*" onChange={(e) => setCapa(e.target.files[0])} />
        <Button type="submit" variant="contained">Salvar</Button>
      </form>
    </Container>
  );
}
