import { NextApiRequest, NextApiResponse } from "next";

const health = (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({ status: "Ship shape and Bristol fashion" });
};

export default health;
