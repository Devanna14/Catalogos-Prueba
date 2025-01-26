import { useEffect, useState } from 'react'; //Para los estados de React
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'; //Libreria para los diseños de las tablas
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'; //Libreria para cada elemento de los formularios
import axios from 'axios'; //Libreria para interactuar con el backend

const Catalogo = () => {

  /**########### PARA EL LLENADO DE LAS TABLAS ############## */
  const [dataVista, setDataVista] = useState([]); //Obtener los datos de la vista
  const [dataOperador, setDataOperador] = useState([]); //Obtener los datos de los operadores
  const [dataMaquinas, setDataMaquinas] = useState([]); //Obtener los datos de las maquinas
  /**######################################################## */

  /**########### PARA GENERAR LOS FILTROS ############## */
  const [filteredVista, setFilteredVista] = useState([]);
  const [filteredOperador, setFilteredOperador] = useState([]);
  const [filteredMaquinas, setFilteredMaquinas] = useState([]);
  /**######################################################## */

  /**########### PARA LAS BUSQUEDAS ############## */
  const [searchQuery, setSearchQuery] = useState('');
  /**######################################################## */

  /**########### PARA DETERMINAR QUE PESTAÑA DEL CATALOGO ESTAMOS SELECCIONANDO ############## */
  const [selectedComponent, setSelectedComponent] = useState('Vista');
  /**######################################################## */

  /**########### PARA EL PAGINADO DE LA TABLA POR PESTAÑA ############## */
  const [pageVista, setPageVista] = useState(0);
  const [pageOperador, setPageOperador] = useState(0);
  const [pageMaquinas, setPageMaquinas] = useState(0);
  /**####################################################### */

  /**########### PARA LA CANTIDAD DE FILAS QUE SE MOSTRARAN EN LAS TABLAS ############## */
  const [rowsPerPage, setRowsPerPage] = useState(5);
  /**####################################################### */

  /**########### PARA GENERAR LAS ACCIONES DE LOS BOTONES ############## */
  const [statusModule, setStatusModule] = useState(0);
  /**####################################################### */

  /**########### PARA EL ESTADO DEL MODAL Y SU INFORMACIÓN ############## */
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});
  /**####################################################### */

  // Función para abrir el modal con los detalles del item seleccionado y status seleccionado
  const openDetailsModal = (item, status) => {
    setStatusModule(status);  // Asignamos el valor del status para usarlo fuera en la botonera de cada modal

    // para manejar de manera exclusiva los eventos de deshabilitar y habilitar cada registro de asociación de maquinas
    if ((status === 0 || status === 2) && selectedComponent === 'Vista') {
      const titulo = status === 0 ? 'desasociar' : 'asociar nuevamente';

      setModalData({
        confirmationMessage: `¿Estás seguro de querer ${titulo} el equipo al operador?`,
        ...item, //Controlamos respetando la estructura de la información seleccionadaS
      });
    } else {
      // Si item es null, asegúrate de dar valores predeterminados
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
          setModalData({
            SelectOption1: '',
            SelectOption2: '',
          });
        }
      } else {
        // Si item no es null, asignamos sus valores
        setModalData(item);
      }
    }

    setOpenModal(true); // Aquí abrimos el modal
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setOpenModal(false);
    setModalData(null);
    setStatusModule(0);
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
    setPageVista(0);
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

  useEffect(() => {
    // Cuando los datos de la vista cambien, actualizamos los datos filtrados.
    setFilteredVista(dataVista);
  }, [dataVista]);

  useEffect(() => {
    setFilteredOperador(dataOperador);
  }, [dataOperador]);

  useEffect(() => {
    setFilteredMaquinas(dataMaquinas);
  }, [dataMaquinas]);

  const handleEdit = () => {
    if (selectedComponent === 'Operador') {
      axios
        .put('http://localhost/api_catalogos/api_op.php', modalData)
        .then((response) => {
          // Volver a obtener los datos para actualizar las tablas
          axios.get('http://localhost/api_catalogos/api_op.php')
            .then((response) => {
              setDataOperador(response.data);
              setFilteredOperador(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });

          // Volver a obtener los datos para actualizar las tablas
          axios.get('http://localhost/api_catalogos/api_vista.php')
            .then((response) => {
              setDataVista(response.data);
              setFilteredVista(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
        });
    } else {
      axios
        .put('http://localhost/api_catalogos/api_maq.php', modalData)
        .then((response) => {
          axios.get('http://localhost/api_catalogos/api_maq.php')
            .then((response) => {
              setDataMaquinas(response.data);
              setFilteredMaquinas(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });

          axios.get('http://localhost/api_catalogos/api_vista.php')
            .then((response) => {
              setDataVista(response.data);
              setFilteredVista(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
        });
    }

    closeModal();
  };

  const handleInsert = () => {
    const currentPage = selectedComponent === 'Vista' ? pageVista : selectedComponent === 'Operador' ? pageOperador : pageMaquinas;
    if (selectedComponent === 'Operador') {
      axios
        .post('http://localhost/api_catalogos/api_op.php', modalData)
        .then((response) => {
          // Volver a obtener los datos para actualizar las tablas
          axios.get('http://localhost/api_catalogos/api_op.php')
            .then((response) => {
              setDataOperador(response.data);
              setFilteredOperador(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });

          // Volver a obtener los datos para actualizar las tablas
          axios.get('http://localhost/api_catalogos/api_vista.php')
            .then((response) => {
              setDataVista(response.data);
              setFilteredVista(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });
        })
        .catch((error) => {
          console.error('Error al agregar los datos:', error);
        });
    } else if (selectedComponent === 'Maquinas') {
      axios
        .post('http://localhost/api_catalogos/api_maq.php', modalData)
        .then((response) => {
          axios.get('http://localhost/api_catalogos/api_maq.php')
            .then((response) => {
              setDataMaquinas(response.data);
              setFilteredMaquinas(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });

          axios.get('http://localhost/api_catalogos/api_vista.php')
            .then((response) => {
              setDataVista(response.data);
              setFilteredVista(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });
        })
        .catch((error) => {
          console.error('Error al agregar los datos:', error);
        });
    } else {
      axios
        .post('http://localhost/api_catalogos/api_vista.php', modalData)
        .then((response) => {
          // Volver a obtener los datos para actualizar las tablas
          axios.get('http://localhost/api_catalogos/api_vista.php')
            .then((response) => {
              setDataVista(response.data);
              setFilteredVista(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });
        })
        .catch((error) => {
          console.error('Error al agregar los datos:', error);
        });
    }

    setPageVista(currentPage); // O el componente seleccionado correspondiente
    closeModal();
  };

  const handleConfirmation = () => {
    let actionData = { ...modalData };
    if (selectedComponent === 'Vista') {
      if (statusModule === 0) {
        actionData.action = 'desasociar';
        console.log("Desasociar ", modalData.Clave_Vista);
      }
      else if (statusModule === 2) {
        actionData.action = 'asociar';
        console.log("Asociar", modalData.Clave_Vista);
      }

      axios
        .put('http://localhost/api_catalogos/api_vista.php', actionData)
        .then((response) => {
          // Volver a obtener los datos para actualizar las tablas
          axios.get('http://localhost/api_catalogos/api_vista.php')
            .then((response) => {
              setDataVista(response.data);
              setFilteredVista(response.data); // Actualizar datos filtrados
            })
            .catch((error) => {
              console.error('Error al obtener los datos:', error);
            });
        })
        .catch((error) => {
          console.error('Error al actualizar los datos:', error);
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
                    {/* Asegúrate de que Vista_Activo es un número */}
                    {parseInt(item.Vista_Activo, 10) === 1 ? (
                      <Button onClick={() => openDetailsModal(item, 0)}>X</Button>
                    ) : (
                      <Button onClick={() => openDetailsModal(item, 2)}>✔️</Button>
                    )}
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
              {modalData.confirmationMessage && (
                // Mostrar el mensaje de confirmación
                <div>{modalData.confirmationMessage}</div>
              )}

              {selectedComponent === 'Vista' && !modalData.confirmationMessage && (
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
          {modalData?.confirmationMessage && (
            <>
              <Button
                onClick={handleConfirmation} // Llama a una función para confirmar
                color="error"
              >
                Confirmar
              </Button>
              <Button onClick={closeModal} color="primary">
                Cancelar
              </Button>
            </>
          )}

          {statusModule === 2 && !modalData?.confirmationMessage && (
            <>
              <Button onClick={closeModal} color="warning">Asociar</Button>
              <Button onClick={closeModal} color="primary">Cerrar</Button>
            </>
          )}
          {statusModule === 0 && !modalData?.confirmationMessage && (
            <>
              <Button onClick={closeModal} color="error">Desasociar</Button>
              <Button onClick={closeModal} color="primary">Cerrar</Button>
            </>
          )}
          {statusModule === 1 && !modalData?.confirmationMessage && (
            <>
              <Button onClick={handleEdit} color="success">Editar</Button>
              <Button onClick={closeModal} color="primary">Cerrar</Button>
            </>
          )}
          {statusModule !== 2 && statusModule !== 0 && statusModule !== 1 && !modalData?.confirmationMessage && (
            <>
              <Button onClick={handleInsert} color="success">Insertar</Button>
              <Button onClick={closeModal} color="primary">Cerrar</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Catalogo;