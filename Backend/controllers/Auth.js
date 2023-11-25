import EmployeeData from "../models/DataPegawaiModel.js";
import argon2 from "argon2";
import { verifyUser } from "../middleware/AuthUser.js";

// Login endpoint
export const Login = async (req, res) => {
  let user = {};
  // Find the employee data based on the provided username
  const employee = await EmployeeData.findOne({
    where: {
      username: req.body.username
    }
  });

  // Check if employee data is not found
  if (!employee) {
    return res.status(404).json({ msg: "Employee Data Not Found" });
  }

  // Verify the entered password against the stored hashed password
  const match = await argon2.verify(employee.password, req.body.password);

  // Check if the password does not match
  if (!match) {
    return res.status(400).json({ msg: "Incorrect Password" });
  }

  // Set the user session ID to the employee's ID
  req.session.userId = employee.id_pegawai;

  // Prepare user data for response
  user = {
    id_pegawai: employee.id,
    nama_pegawai: employee.nama_pegawai,
    username: employee.username,
    hak_akses: employee.hak_akses
  }

  // Respond with successful login message and user data
  res.status(200).json({
    id_pegawai: user.id_pegawai,
    nama_pegawai: user.nama_pegawai,
    username: user.username,
    hak_akses: user.hak_akses,
    msg: "Login Successful"
  });
};

// Me endpoint
export const Me = async (req, res) => {
  // Check if the user is not logged in
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please Login to Your Account!" });
  }

  // Find the employee data based on the user session ID
  const employee = await EmployeeData.findOne({
    attributes: ['id', 'nik', 'nama_pegawai', 'username', 'hak_akses'],
    where: {
      id_pegawai: req.session.userId
    }
  });

  // Check if the employee data is not found
  if (!employee) return res.status(404).json({ msg: "User Not Found" });

  // Respond with the employee data
  res.status(200).json(employee);
}

// LogOut endpoint
export const LogOut = (req, res) => {
  // Destroy the user session
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Unable to logout" });
    res.status(200).json({ msg: "You have been logged out" });
  });
}

// Change Password endpoint
export const changePassword = async (req, res) => {
  // Verify the user using the middleware
  await verifyUser(req, res, () => { });

  // Get the user ID from the request
  const userId = req.userId;

  // Find the user data based on the user ID
  const user = await EmployeeData.findOne({
    where: {
      id: userId
    }
  });

  // Get the new password and confirm password from the request body
  const { password, confPassword } = req.body;

  // Check if the new password and confirm password match
  if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });

  try {
    // Hash the new password
    const hashPassword = await argon2.hash(password);

    // Update the user's password in the database
    await EmployeeData.update(
      {
        password: hashPassword
      },
      {
        where: {
          id: user.id
        }
      }
    )
    // Respond with success message
    res.status(200).json({ msg: "Password Successfully Updated" });
  } catch (error) {
    // Respond with error message
    res.status(400).json({ msg: error.message });
  }
};
