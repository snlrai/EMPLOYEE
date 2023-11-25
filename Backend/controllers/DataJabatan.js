import EmployeeRole from "../models/DataJabatanModel.js";
import EmployeeData from "../models/DataPegawaiModel.js";
import { Op } from "sequelize";

// Display all job position data
export const getJobPositionData = async (req, res) => {
    try {
        let response;
        if (req.hak_akses === "admin") {
            response = await EmployeeRole.findAll({
                attributes: ['id', 'nama_jabatan', 'gaji_pokok', 'tj_transport', 'uang_makan'],
                include: [{
                    model: EmployeeData,
                    attributes: ['nama_pegawai', 'username', 'hak_akses'],
                }]
            });
        } else {
            if (req.userId !== EmployeeRole.userId) return res.status(403).json({ msg: "Unauthorized access" });
            await EmployeeRole.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    [Op.and]: [{ id_jabatan: jobPosition.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Method to display job position data by ID
export const getJobPositionDataByID = async (req, res) => {
    try {
        const response = await EmployeeRole.findOne({
            attributes: [
                'id', 'nama_jabatan', 'gaji_pokok', 'tj_transport', 'uang_makan'
            ],
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Job position data with that ID not found' });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Method to add job position data
export const createJobPositionData = async (req, res) => {
    const {
        id_jabatan, nama_jabatan, gaji_pokok, tj_transport, uang_makan
    } = req.body;
    try {
        if (req.hak_akses === "admin") {
            await EmployeeRole.create({
                id_jabatan: id_jabatan,
                nama_jabatan: nama_jabatan,
                gaji_pokok: gaji_pokok,
                tj_transport: tj_transport,
                uang_makan: uang_makan,
                userId: req.userId
            });
        } else {
            if (req.userId !== EmployeeRole.userId) return res.status(403).json({ msg: "Unauthorized access" });
            await EmployeeRole.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    [Op.and]: [{ id_jabatan: jobPosition.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(201).json({ success: true, message: "Job Position Data Successfully Saved" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }

}

// Method to update job position data
export const updateJobPositionData = async (req, res) => {
    try {
        const jobPosition = await EmployeeRole.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!jobPosition) return res.status(404).json({ msg: "Data not found" });
        const { nama_jabatan, gaji_pokok, tj_transport, uang_makan } = req.body;
        if (req.hak_akses === "admin") {
            await EmployeeRole.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    id: jobPosition.id
                }
            });
        } else {
            if (req.userId !== EmployeeRole.userId) return res.status(403).json({ msg: "Unauthorized access" });
            await EmployeeRole.update({
                nama_jabatan, gaji_pokok, tj_transport, uang_makan
            }, {
                where: {
                    [Op.and]: [{ id_jabatan: jobPosition.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: "Job Position Data Successfully Updated" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Method to delete job position data
export const deleteJobPositionData = async (req, res) => {
    try {
        const jobPosition = await EmployeeRole.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!jobPosition) return res.status(404).json({ msg: "Data not found" });
        if (req.hak_akses === "admin") {
            await jobPosition.destroy({
                where: {
                    id: jobPosition.id
                }
            });
        } else {
            if (req.userId !== jobPosition.userId) return res.status(403).json({ msg: "Unauthorized access" });
            await jobPosition.destroy({
                where: {
                    [Op.and]: [{ id_jabatan: jobPosition.id_jabatan }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: "Job Position Data Successfully Deleted" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}
