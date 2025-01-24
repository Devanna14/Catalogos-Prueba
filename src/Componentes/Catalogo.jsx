import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const Catalogo = () => {
  const [dataVista, setDataVista] = useState([]);
  const [dataOperador, setDataOperador] = useState([]);
  const [dataMaquinas, setDataMaquinas] = useState([]);

  const [filteredVista, setFilteredVista] = useState([]);
  const [filteredOperador, setFilteredOperador] = useState([]);
  const [filteredMaquinas, setFilteredMaquinas] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('Vista');

  const [pageVista, setPageVista] = useState(0);
  const [pageOperador, setPageOperador] = useState(0);
  const [pageMaquinas, setPageMaquinas] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusModule, setStatusModule] = useState(5);

  // Estado del Modal
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);  // o un objeto vacío si ya tienes datos por defecto

  // Función para abrir el modal con los detalles del item seleccionado
  const openDetailsModal = (item, status = 0) => {
    setStatusModule == status
    // Si 'item' es null, asigna valores vacíos a modalData
    if (item === null) {
      if (selectedComponent === 'Operador') {
        setModalData({
          Op_Nombre: '',
          Op_Area: '',
        });
      } else if (selectedComponent === 'Maquinas') {
        setModalData({
          Maq_Descripcion: '',
        });
      } else if (selectedComponent === 'Vista') {
        if (status === 0) {
          // Si status es 0, muestra un mensaje de confirmación
          setModalData({
            confirmationMessage: '¿Estás seguro de que deseas continuar?', // Ajusta el mensaje según necesites
          });
        } else {
          // Aquí asumes que quieres llenar el modal con dos selects
          setModalData({
            SelectOption1: '', // Asumiendo que el modal tendrá dos selects
            SelectOption2: '',
          });
        }
      }
    } else {
      // Si 'item' no es null, asigna los valores del item
      setModalData(item);
    }

    setOpenModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setOpenModal(false);
    setModalData(null);
  };

  // Función para filtrar los datos
  const handleSearch = (query, data, setFilteredData) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = data.filter(item =>
      Object.values(item).some(val => val.toString().toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredData(filtered);
  };

  // Paginador
  const handleChangePage = (setPage) => (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageVista(0); // Reset page to 0 when changing rows per page
    setPageOperador(0);
    setPageMaquinas(0);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModalData((prevData) => ({
      ...prevData,
      [name]: value, // Actualizamos el campo que cambió
    }));
  };

  const handleEdit = () => {
    if (selectedComponent === 'Vista') {
      console.log("El componente seleccionado es Vista");
      axios
        .put('http://localhost/api_catalogos/api_vista.php', modalData)
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
        });
    } else if (selectedComponent === 'Operador') {
      console.log("El componente seleccionado es Operador");
      axios
        .put('http://localhost/api_catalogos/api_op.php', modalData)
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
        });
    } else {
      axios
        .put('http://localhost/api_catalogos/api_maq.php', modalData)
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
        });
    }

    // Realiza cualquier acción que necesites después de actualizar, como cerrar el modal
    closeModal();

  };

  const handleInsert = () => {
    if (selectedComponent === 'Operador') {
      axios
        .post('http://localhost/api_catalogos/api_op.php', modalData)
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error al agregar los datos:', error);
        });
    } else if (selectedComponent === 'Maquinas') {
      axios
        .post('http://localhost/api_catalogos/api_maq.php', modalData)
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error al agregar los datos:', error);
        });
    } else {
      axios
        .post('http://localhost/api_catalogos/api_vista.php', modalData)
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error al agregar los datos:', error);
        });
    }

    closeModal();

  };

  useEffect(() => {
    // Realizar 3 peticiones a diferentes APIs usando Promise.all
    Promise.all([
      axios.get('http://localhost/api_catalogos/api_vista.php'),
      axios.get('http://localhost/api_catalogos/api_op.php'),
      axios.get('http://localhost/api_catalogos/api_maq.php')
    ])
      .then(([responseVista, responseOperador, responseMaquinas]) => {
        setDataVista(responseVista.data);
        setDataOperador(responseOperador.data);
        setDataMaquinas(responseMaquinas.data);

        // Inicialmente, todos los datos filtrados son iguales a los datos originales
        setFilteredVista(responseVista.data);
        setFilteredOperador(responseOperador.data);
        setFilteredMaquinas(responseMaquinas.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos:', error);
      });
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Dependiendo del componente seleccionado, filtramos los datos
  const handleSearchVista = (event) => {
    setSearchQuery(event.target.value);
    handleSearch(event.target.value, dataVista, setFilteredVista);
  };

  const handleSearchOperador = (event) => {
    setSearchQuery(event.target.value);
    handleSearch(event.target.value, dataOperador, setFilteredOperador);
  };

  const handleSearchMaquinas = (event) => {
    setSearchQuery(event.target.value);
    handleSearch(event.target.value, dataMaquinas, setFilteredMaquinas);
  };

  // Renderizar tablas
  const renderVistaTable = () => (
    <>
      <TextField
        label="Buscar Vista"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchVista}
        margin="normal"
      />
      <div>
        <Button onClick={() => openDetailsModal(null)}>Asignar</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clave_Op</TableCell>
              <TableCell>Op_Nombre</TableCell>
              <TableCell>Op_Area</TableCell>
              <TableCell>Clave_Maq</TableCell>
              <TableCell>Maq_Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVista
              .slice(pageVista * rowsPerPage, pageVista * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Clave_Op}</TableCell>
                  <TableCell>{item.Op_Nombre}</TableCell>
                  <TableCell>{item.Op_Area}</TableCell>
                  <TableCell>{item.Clave_Maq}</TableCell>
                  <TableCell>{item.Maq_Descripcion}</TableCell>
                  <TableCell>
                    {item.Vista_Activo === 1 ? (
                      <Button onClick={() => openDetailsModal(item)}>✔️</Button>
                    ) : (
                      <Button onClick={() => openDetailsModal(item)}>X</Button>
                    )}
                    <Button onClick={() => openDetailsModal(item, 1)}>Editar</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredVista.length}
        rowsPerPage={rowsPerPage}
        page={pageVista}
        onPageChange={handleChangePage(setPageVista)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

  const renderOperadorTable = () => (
    <>
      <TextField
        label="Buscar Operador"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchOperador}
        margin="normal"
      />
      <div>
        <Button onClick={() => openDetailsModal(null)}>Nuevo Operador</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clave_Op</TableCell>
              <TableCell>Op_Nombre</TableCell>
              <TableCell>Op_Area</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOperador
              .slice(pageOperador * rowsPerPage, pageOperador * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Clave_Op}</TableCell>
                  <TableCell>{item.Op_Nombre}</TableCell>
                  <TableCell>{item.Op_Area}</TableCell>
                  <TableCell>
                    <Button onClick={() => openDetailsModal(item, 1)}>Editar</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOperador.length}
        rowsPerPage={rowsPerPage}
        page={pageOperador}
        onPageChange={handleChangePage(setPageOperador)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

  const renderMaquinasTable = () => (
    <>
      <TextField
        label="Buscar Maquinas"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchMaquinas}
        margin="normal"
      />
      <div>
        <Button onClick={() => openDetailsModal(null)}>Nueva Maquina</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clave_Maq</TableCell>
              <TableCell>Maq_Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaquinas
              .slice(pageMaquinas * rowsPerPage, pageMaquinas * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Clave_Maq}</TableCell>
                  <TableCell>{item.Maq_Descripcion}</TableCell>
                  <TableCell>
                    <Button onClick={() => openDetailsModal(item, 1)}>Editar</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredMaquinas.length}
        rowsPerPage={rowsPerPage}
        page={pageMaquinas}
        onPageChange={handleChangePage(setPageMaquinas)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

  return (
    <>
      <h3>¡Hola, este es mi componente Catalogo!</h3>
      <div className="container">
        <Button onClick={() => setSelectedComponent('Vista')}>Vista</Button>
        <Button onClick={() => setSelectedComponent('Operador')}>Operador</Button>
        <Button onClick={() => setSelectedComponent('Maquinas')}>Maquinas</Button>
      </div>

      {/* Renderizar el componente seleccionado */}
      {selectedComponent === 'Vista' && renderVistaTable()}
      {selectedComponent === 'Operador' && renderOperadorTable()}
      {selectedComponent === 'Maquinas' && renderMaquinasTable()}

      {/* Modal para mostrar detalles de un item */}
      <Dialog open={openModal} onClose={closeModal}>
        <DialogTitle>Detalles</DialogTitle>
        <DialogContent>
          {modalData && (
            <>
              {selectedComponent === 'Vista' && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Seleccione Operador</InputLabel>
                    <Select
                      value={modalData.SelectOption1 || ''}
                      onChange={(e) => setModalData({ ...modalData, SelectOption1: e.target.value })}
                      label="Seleccione Operador"
                    >
                      {dataOperador.map((item) => (
                        <MenuItem key={item.Clave_Op} value={item.Clave_Op}>
                          {item.Op_Nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Seleccione Maquina</InputLabel>
                    <Select
                      value={modalData.SelectOption2 || ''}
                      onChange={(e) => setModalData({ ...modalData, SelectOption2: e.target.value })}
                      label="Seleccione Maquina"
                    >
                      {dataMaquinas.map((item) => (
                        <MenuItem key={item.Clave_Maq} value={item.Clave_Maq}>
                          {item.Maq_Descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {selectedComponent === 'Operador' && (
                <>
                  <TextField
                    fullWidth
                    label="Nombre del Operador"
                    value={modalData.Op_Nombre || ''}
                    onChange={(e) => setModalData({ ...modalData, Op_Nombre: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Área del Operador"
                    value={modalData.Op_Area || ''}
                    onChange={(e) => setModalData({ ...modalData, Op_Area: e.target.value })}
                    margin="normal"
                  />
                </>
              )}

              {selectedComponent === 'Maquinas' && (
                <>
                  <TextField
                    fullWidth
                    label="Descripción de la Máquina"
                    value={modalData.Maq_Descripcion || ''}
                    onChange={(e) => setModalData({ ...modalData, Maq_Descripcion: e.target.value })}
                    margin="normal"
                  />
                </>
              )}

            </>
          )}
        </DialogContent>
        <DialogActions>
          {/* Aseguramos que 'modalData.status' tenga un valor antes de usarlo */}+
          <Button onClick={closeModal} color="error">Desasociar</Button>
          <Button onClick={handleEdit} color="success">Editar</Button>
          <Button onClick={handleInsert} color="success">Insertar</Button>
          <Button onClick={closeModal} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Catalogo;