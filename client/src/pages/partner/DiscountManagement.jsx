import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const DiscountManagement = () => {
    const [discounts, setDiscounts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({ code: '', percentage: 10 });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const fetchDiscounts = async () => {
        try {
            const { data } = await axios.get('/api/partner/discounts', config);
            setDiscounts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleCreate = async () => {
        try {
            await axios.post('/api/partner/discounts', formData, config);
            setOpenDialog(false);
            setFormData({ code: '', percentage: 10 });
            fetchDiscounts();
        } catch (error) {
            alert('Failed to create code. It might already exist.');
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Discount Management</Typography>
                <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>Generate New Code</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Used Count</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {discounts.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{row.code}</TableCell>
                                <TableCell>{row.percentage}%</TableCell>
                                <TableCell>{row.usedCount}</TableCell>
                                <TableCell>{row.isActive ? 'Active' : 'Inactive'}</TableCell>
                            </TableRow>
                        ))}
                        {discounts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No discount codes generated yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Generate Discount Code</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code (e.g., SUMMER2024)"
                        fullWidth
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    />
                    <TextField
                        margin="dense"
                        label="Discount Percentage (%)"
                        type="number"
                        fullWidth
                        value={formData.percentage}
                        onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Generate</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DiscountManagement;
