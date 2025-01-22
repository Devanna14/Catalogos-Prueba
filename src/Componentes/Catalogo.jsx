import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export const Catalogo = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/api_catalogos/api_op.php')
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos:', error);
      });
  }, []);

  return (
    <div>
      <h3>¡Hola, este es mi componente Catalogo!</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clave_Ope</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Clave_Maq</TableCell>
              <TableCell>Maq_Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.Clave_Op}</TableCell>
                <TableCell>{item.Op_Nombre}</TableCell>
                <TableCell>{item.Op_Area}</TableCell>
                <TableCell>{item.Clave_Maq}</TableCell>
                <TableCell>{item.Maq_Descripcion}</TableCell>
                <TableCell>
                  <button class="mdc-button mdc-button--raised">
                    <span class="mdc-button__label">X</span>
                  </button>
                  <button class="mdc-button mdc-button--raised">
                    <span class="mdc-button__label">Actualizar</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
