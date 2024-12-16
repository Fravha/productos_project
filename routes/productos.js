const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO productos (nombre_producto, precio, descripcion) VALUES (?, ?, ?)', 
      [nombre, precio, descripcion]
    );
    res.status(201).json({ 
      id: result.insertId, 
      mensaje: 'Producto creado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al crear producto', 
      error: error.message 
    });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [productos] = await pool.query('SELECT * FROM productos');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener productos', 
      error: error.message 
    });
  }
});

// Obtener un producto por ID
router.get('/:producto_id', async (req, res) => {
  try {
    const [productos] = await pool.query(
      'SELECT * FROM productos WHERE producto_id = ?', 
      [req.params.producto_id]
    );
    
    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json(productos[0]);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener producto', 
      error: error.message 
    });
  }
});

// Actualizar un producto
router.put('/:producto_id', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const [result] = await pool.query(
      'UPDATE productos SET nombre_producto = ?, precio = ?, descripcion = ? WHERE id = ?', 
      [nombre, precio, descripcion, req.params.producto_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json({ mensaje: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al actualizar producto', 
      error: error.message 
    });
  }
});

// Eliminar un producto
router.delete('/:producto_id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM productos WHERE producto_id = ?', 
      [req.params.producto_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al eliminar producto', 
      error: error.message 
    });
  }
});

module.exports = router;