import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, gender, community, dateOfBirth, heightInCm, jobTitle, currentAddress, mobileNumber, password } = req.body;

  if (!firstName || !lastName || !mobileNumber || !gender || !community || !dateOfBirth || !heightInCm || !jobTitle || !currentAddress) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  await dbConnect();

  const existingUser = await User.findOne({ mobileNumber });
  if (existingUser) {
    return res.status(400).json({ message: 'Mobile number already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    gender,
    community,
    dateOfBirth,
    heightInCm,
    jobTitle,
    currentAddress,
    mobileNumber,
    passwordHash: hashedPassword,
  });

  await user.save();
  return res.status(201).json({ message: 'User created successfully', success: true });
}
